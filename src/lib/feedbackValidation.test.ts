/**
 * Automated test suite for Feedback Validation & Configuration logic.
 */

import { RATING_DESCRIPTIONS, getFeedbackQrUrl } from '../config/feedbackConfig'
import { validateFeedback, type FeedbackSubmission } from './feedbackApi'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
}

console.log('--- RUNNING FEEDBACK SYSTEM TESTS ---')

// Test 1: Empty submission fails validation
{
  const empty: FeedbackSubmission = {
    name: '',
    feedback: '',
    rating: 0,
  }
  const result = validateFeedback(empty)
  assert(!result.valid, 'Empty submission should be invalid')
  assert(!!result.errors.name, 'Should require name')
  assert(!!result.errors.feedback, 'Should require feedback')
  assert(!!result.errors.rating, 'Should require rating')
  console.log('✓ Test 1: Empty submission validation passed')
}

// Test 2: Valid submission passes
{
  const valid: FeedbackSubmission = {
    name: 'Priya Sharma',
    studentId: '2024-ETH-108',
    feedback: 'Excellent 3D presentation and comprehensive POSH Act coverage.',
    rating: 5,
  }
  const result = validateFeedback(valid)
  assert(result.valid, 'Valid submission should pass')
  assert(Object.keys(result.errors).length === 0, 'No errors should exist')
  console.log('✓ Test 2: Valid submission passed')
}

// Test 3: Optional student ID can be omitted or blank
{
  const withoutStudentId: FeedbackSubmission = {
    name: 'Anonymous Attendee',
    feedback: 'Very intuitive interactive universe.',
    rating: 4,
  }
  const result = validateFeedback(withoutStudentId)
  assert(result.valid, 'Submission without student ID should pass')
  assert(!result.errors.studentId, 'Should not produce student ID error')
  console.log('✓ Test 3: Optional student ID passed')
}

// Test 4: Rating bounds check (1 to 5)
{
  const invalidLowRating: FeedbackSubmission = {
    name: 'Test User',
    feedback: 'Good presentation overview.',
    rating: 0,
  }
  assert(!validateFeedback(invalidLowRating).valid, 'Rating 0 should be rejected')

  const invalidHighRating: FeedbackSubmission = {
    name: 'Test User',
    feedback: 'Good presentation overview.',
    rating: 6,
  }
  assert(!validateFeedback(invalidHighRating).valid, 'Rating 6 should be rejected')

  for (let r = 1; r <= 5; r++) {
    const validRating: FeedbackSubmission = {
      name: 'Test User',
      feedback: 'Good presentation overview.',
      rating: r,
    }
    assert(validateFeedback(validRating).valid, `Rating ${r} should be valid`)
    assert(!!RATING_DESCRIPTIONS[r], `Rating ${r} must have a description`)
  }
  console.log('✓ Test 4: Rating boundary checks passed')
}

// Test 5: Length limits
{
  const tooShortFeedback: FeedbackSubmission = {
    name: 'Test',
    feedback: 'Hey',
    rating: 4,
  }
  assert(!validateFeedback(tooShortFeedback).valid, 'Too short feedback (<5 chars) must be rejected')

  const tooLongName: FeedbackSubmission = {
    name: 'A'.repeat(101),
    feedback: 'Great presentation and clear knowledge tree.',
    rating: 5,
  }
  assert(!validateFeedback(tooLongName).valid, 'Name > 100 characters must be rejected')

  const tooLongStudentId: FeedbackSubmission = {
    name: 'Test',
    studentId: 'B'.repeat(51),
    feedback: 'Great presentation and clear knowledge tree.',
    rating: 5,
  }
  assert(
    !validateFeedback(tooLongStudentId).valid,
    'Reg. No. or Emp. ID > 50 characters must be rejected',
  )
  console.log('✓ Test 5: Field length limits passed')
}

// Test 6: QR URL resolution
{
  const qrUrl = getFeedbackQrUrl()
  assert(qrUrl.endsWith('/feedback'), 'QR URL must end with /feedback')
  assert(!qrUrl.includes('localhost'), 'Production QR URL should never point to localhost')
  console.log('✓ Test 6: QR URL resolution passed (' + qrUrl + ')')
}

console.log('--- ALL FEEDBACK TESTS COMPLETED SUCCESSFULLY ---')
