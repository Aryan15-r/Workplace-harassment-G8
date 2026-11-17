/**
 * ============================================================================
 * Workplace Harassment G8 — Custom Feedback System Backend
 * ============================================================================
 * 
 * Google Apps Script Web App that receives feedback submissions from the
 * presentation website and records them into a Google Sheet.
 * 
 * Target Google Sheet Columns:
 * | Timestamp | Name | Student ID | Feedback | Rating |
 * 
 * Features:
 * - Automatically initializes header columns if sheet is blank
 * - Automatic timestamps (ISO 8601 & readable local format)
 * - Strict server-side validation (types, lengths, required fields)
 * - Spam protection: Honeypot field detection
 * - Flood protection: Short-term submission caching
 * - CORS-friendly JSON responses
 * - Graceful error handling
 * ============================================================================
 */

// If bound to a Google Sheet (Extensions > Apps Script), leave SPREADSHEET_ID empty
// to automatically use SpreadsheetApp.getActiveSpreadsheet().
// If using a standalone script, paste your Google Sheet ID here:
const SPREADSHEET_ID = '';

// Name of the tab/sheet where feedback is stored (default: first sheet or 'Feedback')
const SHEET_NAME = 'Feedback';

// Expected table headers
const EXPECTED_HEADERS = ['Timestamp', 'Name', 'Reg. No. / Emp. ID', 'Feedback', 'Rating'];

/**
 * Handles GET requests:
 * Useful for verifying that the Web App is deployed and reachable.
 */
function doGet(e) {
  return createJsonResponse({
    status: 'ok',
    service: 'Workplace Harassment G8 - Feedback API',
    version: '1.0.0',
    message: 'The feedback endpoint is active and ready to receive POST submissions.',
    timestamp: new Date().toISOString()
  });
}

/**
 * Handles POST requests:
 * Receives feedback payload, validates it, and appends to Google Sheet.
 */
function doPost(e) {
  // Use a script lock to prevent race conditions during concurrent submissions
  const lock = LockService.getScriptLock();
  
  try {
    // Wait up to 10 seconds for concurrent write operations to finish
    lock.waitLock(10000);
  } catch (lockError) {
    return createJsonResponse({
      status: 'error',
      message: 'Server is currently busy processing requests. Please retry in a few moments.'
    });
  }

  try {
    if (!e) {
      return createJsonResponse({
        status: 'error',
        message: 'No request payload received.'
      });
    }

    // 1. Parse incoming payload
    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        // Fallback for form-encoded contents
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    // 2. Anti-spam: Honeypot check
    // The frontend contains a hidden honeypot field (e.g. 'honeypot' or 'website').
    // If a bot fills it out, reject immediately.
    const honeypot = (data.honeypot || data.website || '').toString().trim();
    if (honeypot.length > 0) {
      // Return a simulated success to waste bot resources without writing to sheet
      return createJsonResponse({
        status: 'success',
        message: 'Feedback received.'
      });
    }

    // 3. Extract & sanitize fields
    const name = (data.name || '').toString().trim();
    const studentId = (data.studentId || data.student_id || '').toString().trim();
    const feedback = (data.feedback || data.review || data.message || '').toString().trim();
    const ratingRaw = data.rating;

    // 4. Server-Side Validation
    // Never trust client validation alone!
    if (!name || name.length < 1) {
      return createJsonResponse({
        status: 'error',
        message: 'Name is required.'
      });
    }
    if (name.length > 100) {
      return createJsonResponse({
        status: 'error',
        message: 'Name cannot exceed 100 characters.'
      });
    }

    if (studentId.length > 50) {
      return createJsonResponse({
        status: 'error',
        message: 'Reg. No. or Emp. ID cannot exceed 50 characters.'
      });
    }

    if (!feedback || feedback.length < 5) {
      return createJsonResponse({
        status: 'error',
        message: 'Feedback must be at least 5 characters long.'
      });
    }
    if (feedback.length > 2500) {
      return createJsonResponse({
        status: 'error',
        message: 'Feedback cannot exceed 2500 characters.'
      });
    }

    const rating = Number(ratingRaw);
    if (!rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return createJsonResponse({
        status: 'error',
        message: 'Rating must be an integer between 1 and 5.'
      });
    }

    // 5. Basic anti-flood duplicate suppression (5 seconds window for exact duplicate)
    const cache = CacheService.getScriptCache();
    const submissionFingerprint = Utilities.base64Encode(
      Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, name + '|' + feedback)
    );
    if (cache.get(submissionFingerprint)) {
      return createJsonResponse({
        status: 'error',
        message: 'Duplicate submission detected. Please do not submit identical reviews multiple times.'
      });
    }
    // Remember fingerprint for 60 seconds
    cache.put(submissionFingerprint, 'true', 60);

    // 6. Access Google Sheet
    const sheet = getTargetSheet();
    if (!sheet) {
      return createJsonResponse({
        status: 'error',
        message: 'Target Google Sheet could not be accessed. Please check script configuration.'
      });
    }

    // 7. Ensure header row exists
    ensureHeaders(sheet);

    // 8. Prepare Row Data: [Timestamp, Name, Student ID, Feedback, Rating]
    const timestamp = new Date();
    const formattedTimestamp = Utilities.formatDate(
      timestamp,
      Session.getScriptTimeZone() || 'UTC',
      'yyyy-MM-dd HH:mm:ss'
    );

    const row = [
      formattedTimestamp,
      name,
      studentId.length > 0 ? studentId : 'N/A',
      feedback,
      rating
    ];

    // 9. Append Row
    sheet.appendRow(row);

    // Verify row was appended
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      throw new Error('Failed to verify newly written row in spreadsheet.');
    }

    // 10. Return success response
    return createJsonResponse({
      status: 'success',
      message: 'Feedback submitted successfully! Thank you for helping improve our presentation.',
      rowNumber: lastRow
    });

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createJsonResponse({
      status: 'error',
      message: 'Failed to record feedback: ' + (error.message || error.toString())
    });
  } finally {
    // Release the concurrency lock
    lock.releaseLock();
  }
}

/**
 * Retrieves the target Google Sheet instance.
 */
function getTargetSheet() {
  let ss = null;
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim().length > 0) {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  } else {
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {
      Logger.log('Could not open active spreadsheet: ' + e);
    }
  }

  if (!ss) {
    throw new Error('Spreadsheet not found. Set SPREADSHEET_ID in Code.gs or bind the script to a sheet.');
  }

  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    // If the sheet name doesn't exist, use the first available sheet or create one
    sheet = ss.getSheets()[0] || ss.insertSheet(SHEET_NAME);
  }

  return sheet;
}

/**
 * Initializes header columns and styling if sheet is blank.
 */
function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(EXPECTED_HEADERS);
    
    // Style headers: Bold, dark graphite background, golden text
    const headerRange = sheet.getRange(1, 1, 1, EXPECTED_HEADERS.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#191919');
    headerRange.setFontColor('#FFD34E');
    sheet.setFrozenRows(1);

    // Auto-adjust column widths for readability
    for (let col = 1; col <= EXPECTED_HEADERS.length; col++) {
      if (col === 4) {
        sheet.setColumnWidth(col, 400); // Feedback column wider
      } else {
        sheet.setColumnWidth(col, 160);
      }
    }
  }
}

/**
 * Helper to build standard JSON response.
 */
function createJsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this function manually in the Apps Script editor to test permissions
 * and verify that the sheet headers get created correctly.
 */
function testSetup() {
  const sheet = getTargetSheet();
  ensureHeaders(sheet);
  Logger.log('Sheet connection verified! Sheet name: ' + sheet.getName());
}
