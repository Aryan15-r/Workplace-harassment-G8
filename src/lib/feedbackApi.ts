/**
 * Workplace Harassment G8 — Feedback API Client
 */

import { FEEDBACK_ENDPOINT } from '@/config/feedbackConfig'

export interface FeedbackSubmission {
  name: string
  studentId?: string
  feedback: string
  rating: number
  honeypot?: string
}

export interface FeedbackValidationResult {
  valid: boolean
  errors: {
    name?: string
    studentId?: string
    feedback?: string
    rating?: string
  }
}

export interface FeedbackApiResponse {
  success: boolean
  message: string
  isSimulated?: boolean
  rowNumber?: number
}

/**
 * Validates the submission payload prior to dispatch.
 */
export function validateFeedback(data: FeedbackSubmission): FeedbackValidationResult {
  const errors: FeedbackValidationResult['errors'] = {}

  const trimmedName = data.name.trim()
  if (!trimmedName) {
    errors.name = 'Please enter your name.'
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  } else if (trimmedName.length > 100) {
    errors.name = 'Name cannot exceed 100 characters.'
  }

  const trimmedStudentId = (data.studentId || '').trim()
  if (trimmedStudentId && trimmedStudentId.length > 50) {
    errors.studentId = 'Student ID cannot exceed 50 characters.'
  }

  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.rating = 'Please select a star rating (1 to 5 stars).'
  }

  const trimmedFeedback = data.feedback.trim()
  if (!trimmedFeedback) {
    errors.feedback = 'Please provide your feedback or review.'
  } else if (trimmedFeedback.length < 5) {
    errors.feedback = 'Feedback must be at least 5 characters.'
  } else if (trimmedFeedback.length > 2500) {
    errors.feedback = 'Feedback cannot exceed 2500 characters.'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Submits feedback to the Google Apps Script Web App.
 *
 * Uses 'Content-Type: text/plain;charset=utf-8' with a JSON string body.
 * This is an established best practice for Google Apps Script Web Apps
 * because it avoids CORS preflight OPTIONS requests (which Google Apps
 * Script endpoints do not respond to), allowing direct POST submissions.
 */
export async function submitFeedback(data: FeedbackSubmission): Promise<FeedbackApiResponse> {
  // Client-side honeypot check
  if (data.honeypot && data.honeypot.trim().length > 0) {
    // Return early without doing network request
    return {
      success: true,
      message: 'Feedback received.',
    }
  }

  const validation = validateFeedback(data)
  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0]
    return {
      success: false,
      message: firstError || 'Please fix the errors in the form before submitting.',
    }
  }

  // If no endpoint is configured in .env, simulate submission for seamless local testing
  if (!FEEDBACK_ENDPOINT) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return {
      success: true,
      isSimulated: true,
      message:
        'Feedback recorded in simulated demo mode! (Set VITE_FEEDBACK_ENDPOINT in .env to connect live Google Sheets)',
    }
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 16000)

  try {
    const payload = {
      name: data.name.trim(),
      studentId: (data.studentId || '').trim(),
      feedback: data.feedback.trim(),
      rating: Number(data.rating),
      honeypot: data.honeypot || '',
      submittedAt: new Date().toISOString(),
    }

    const response = await fetch(FEEDBACK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    if (result && result.status === 'success') {
      return {
        success: true,
        message: result.message || 'Feedback submitted successfully!',
        rowNumber: result.rowNumber,
      }
    } else {
      return {
        success: false,
        message: result?.message || 'Submission was rejected by the server.',
      }
    }
  } catch (error: unknown) {
    clearTimeout(timeoutId)

    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        success: false,
        message: 'Submission timed out. Please check your network connection and retry.',
      }
    }

    const errMessage = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      message:
        'Could not deliver feedback to Google Sheets (' +
        errMessage +
        '). Please verify the Web App deployment and retry.',
    }
  }
}
