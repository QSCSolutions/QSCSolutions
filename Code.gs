const SHEET_ID_DEFAULT = "PASTE_SPREADSHEET_ID";
const MAIN_SHEET_NAME_DEFAULT = "Applicant_Data";
const HISTORY_SHEET_NAME = "Collection_History";

function getSpreadsheetId_() {
  return PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || SHEET_ID_DEFAULT;
}

function getMainSheetName_() {
  return PropertiesService.getScriptProperties().getProperty('MAIN_SHEET_NAME') || MAIN_SHEET_NAME_DEFAULT;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizeText_(value) {
  return String(value == null ? '' : value).trim();
}

function ensureHeaderMap_(headers) {
  const map = {};
  headers.forEach((header, index) => {
    const key = normalizeText_(header);
    if (key) {
      map[key] = index;
    }
  });
  return map;
}

function getCellValue_(row, headerMap, headerName) {
  const index = headerMap[headerName];
  if (index === undefined) {
    return '';
  }
  return row[index] == null ? '' : row[index];
}

function getSpreadsheet_() {
  const spreadsheetId = getSpreadsheetId_();
  if (!spreadsheetId || spreadsheetId === 'PASTE_SPREADSHEET_ID') {
    throw new Error('Spreadsheet ID is not configured. Update the SPREADSHEET_ID script property before using the app.');
  }
  return SpreadsheetApp.openById(spreadsheetId);
}

function getMainSheet_(spreadsheet) {
  const sheetName = getMainSheetName_();
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (sheet) {
    return sheet;
  }

  const fallbackNames = ['Applicant_Data', 'Sheet1', 'Main', 'Data', 'Applicants'];
  for (const name of fallbackNames) {
    sheet = spreadsheet.getSheetByName(name);
    if (sheet) {
      return sheet;
    }
  }

  return spreadsheet.getSheets()[0];
}

function ensureHistorySheet_(spreadsheet) {
  let historySheet = spreadsheet.getSheetByName(HISTORY_SHEET_NAME);
  if (!historySheet) {
    historySheet = spreadsheet.insertSheet(HISTORY_SHEET_NAME);
  }

  const headers = ['Timestamp', 'ApplicationId', 'Applicant Name', 'Short Code', 'Remarks', 'Executive Identity'];
  const existing = historySheet.getDataRange().getValues();
  if (!existing.length) {
    historySheet.appendRow(headers);
    return historySheet;
  }

  const firstRow = existing[0];
  const matches = headers.every((header, index) => normalizeText_(firstRow[index]) === header);
  if (!matches) {
    historySheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  return historySheet;
}

function buildApplicantRecord_(row, headerMap) {
  return {
    ApplicationId: normalizeText_(getCellValue_(row, headerMap, 'ApplicationId')),
    NBFC: normalizeText_(getCellValue_(row, headerMap, 'NBFC')),
    'Institute Name': normalizeText_(getCellValue_(row, headerMap, 'Institute Name')),
    'Applicant Name': normalizeText_(getCellValue_(row, headerMap, 'Applicant Name')),
    'Emi Cycle Date': normalizeText_(getCellValue_(row, headerMap, 'Emi Cycle Date')),
    'Loan Pos': normalizeText_(getCellValue_(row, headerMap, 'Loan Pos')),
    'Risk BKT': normalizeText_(getCellValue_(row, headerMap, 'Risk BKT')),
    'Resolved/Not Resolved': normalizeText_(getCellValue_(row, headerMap, 'Resolved/Not Resolved')),
    'Manager Name': normalizeText_(getCellValue_(row, headerMap, 'Manager Name')),
    'Agency Name': normalizeText_(getCellValue_(row, headerMap, 'Agency Name')),
    'Loan Amount': normalizeText_(getCellValue_(row, headerMap, 'Loan Amount')),
    'Emi Start Date': normalizeText_(getCellValue_(row, headerMap, 'Emi Start Date')),
    'Loan Tenure': normalizeText_(getCellValue_(row, headerMap, 'Loan Tenure')),
    'Emi Amount': normalizeText_(getCellValue_(row, headerMap, 'Emi Amount')),
    'Total Amount Overdue': normalizeText_(getCellValue_(row, headerMap, 'Total Amount Overdue')),
    'Total Amount Paid': normalizeText_(getCellValue_(row, headerMap, 'Total Amount Paid')),
    'Applicant Mobile': normalizeText_(getCellValue_(row, headerMap, 'Applicant Mobile')),
    'Applicant Permanent Address City': normalizeText_(getCellValue_(row, headerMap, 'Applicant Permanent Address City')),
    'Correspondence Address': normalizeText_(getCellValue_(row, headerMap, 'Correspondence Address')),
    'Permanent Address': normalizeText_(getCellValue_(row, headerMap, 'Permanent Address')),
    'Course Name': normalizeText_(getCellValue_(row, headerMap, 'Course Name')),
    'Short Code': normalizeText_(getCellValue_(row, headerMap, 'Short Code')),
    Remarks: normalizeText_(getCellValue_(row, headerMap, 'Remarks'))
  };
}

function searchApplicants_(query, limit) {
  const trimmedQuery = normalizeText_(query).toLowerCase();
  if (!trimmedQuery) {
    throw new Error('Search query is required.');
  }

  const spreadsheet = getSpreadsheet_();
  const sheet = getMainSheet_(spreadsheet);
  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return { ok: true, results: [] };
  }

  const headerMap = ensureHeaderMap_(rows[0]);
  const results = [];

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    if (!row || row.every((cell) => normalizeText_(cell) === '')) {
      continue;
    }

    const applicant = buildApplicantRecord_(row, headerMap);
    const applicationId = applicant.ApplicationId;
    const applicantName = applicant['Applicant Name'];

    if (
      (applicationId && applicationId.toLowerCase().includes(trimmedQuery)) ||
      (applicantName && applicantName.toLowerCase().includes(trimmedQuery))
    ) {
      results.push({
        ApplicationId: applicationId,
        ApplicantName: applicantName,
        NBFC: applicant.NBFC,
        InstituteName: applicant['Institute Name']
      });

      if (results.length >= limit) {
        break;
      }
    }
  }

  return { ok: true, results };
}

function findMatchingRows_(sheet, applicationId) {
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) {
    return [];
  }

  const headerMap = ensureHeaderMap_(rows[0]);
  const rowNumbers = [];
  const targetId = normalizeText_(applicationId);

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const currentId = normalizeText_(getCellValue_(row, headerMap, 'ApplicationId'));
    if (currentId === targetId) {
      rowNumbers.push(i + 1);
    }
  }

  return rowNumbers;
}

function getAuthenticatedExecutive_() {
  try {
    const email = Session.getActiveUser().getEmail();
    if (email) {
      return email;
    }
  } catch (error) {
    return 'Unknown';
  }
  return 'Unknown';
}

function doGet(e) {
  try {
    const query = e && e.parameter ? (e.parameter.query || e.parameter.q || '') : '';
    const limit = Number(e && e.parameter ? (e.parameter.limit || 10) : 10) || 10;
    const result = searchApplicants_(query, limit);
    return jsonResponse(result);
  } catch (error) {
    return jsonResponse({ ok: false, message: error.message || 'Request failed.' });
  }
}

function doPost(e) {
  try {
    const payload = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const action = normalizeText_(payload.action || '').toLowerCase();

    if (action === 'search') {
      const query = payload.query || payload.searchTerm || '';
      const limit = Number(payload.limit || 10) || 10;
      const result = searchApplicants_(query, limit);
      return jsonResponse(result);
    }

    if (action === 'update') {
      const applicationId = normalizeText_(payload.applicationId || payload.ApplicationId || '');
      const shortCode = normalizeText_(payload.shortCode || payload.ShortCode || '');
      const remarks = normalizeText_(payload.remarks || payload.Remarks || '');

      if (!applicationId) {
        return jsonResponse({ ok: false, message: 'Application ID is required.' });
      }

      if (!shortCode) {
        return jsonResponse({ ok: false, message: 'A short code selection is required.' });
      }

      if (remarks.length < 10 || remarks.length > 500) {
        return jsonResponse({ ok: false, message: 'Remarks must be between 10 and 500 characters long.' });
      }

      const spreadsheet = getSpreadsheet_();
      const sheet = getMainSheet_(spreadsheet);
      const matchingRows = findMatchingRows_(sheet, applicationId);

      if (matchingRows.length === 0) {
        return jsonResponse({ ok: false, message: 'No matching Application ID was found in the main sheet.' });
      }

      if (matchingRows.length > 1) {
        return jsonResponse({ ok: false, message: 'Multiple rows share the same Application ID. Please correct the duplicate record before updating.' });
      }

      const lock = LockService.getScriptLock();
      lock.waitLock(15000);

      try {
        const rows = sheet.getDataRange().getValues();
        const headerMap = ensureHeaderMap_(rows[0]);
        const shortCodeIndex = headerMap['Short Code'];
        const remarksIndex = headerMap['Remarks'];
        const rowIndex = matchingRows[0];
        const rowData = rows[rowIndex - 1];

        if (shortCodeIndex === undefined || remarksIndex === undefined) {
          return jsonResponse({ ok: false, message: 'The spreadsheet is missing the required Short Code or Remarks columns.' });
        }

        const applicantName = normalizeText_(getCellValue_(rowData, headerMap, 'Applicant Name'));
        sheet.getRange(rowIndex, shortCodeIndex + 1).setValue(shortCode);
        sheet.getRange(rowIndex, remarksIndex + 1).setValue(remarks);

        const historySheet = ensureHistorySheet_(spreadsheet);
        const timestamp = new Date().toISOString();
        const executiveIdentity = getAuthenticatedExecutive_();
        historySheet.appendRow([
          timestamp,
          applicationId,
          applicantName,
          shortCode,
          remarks,
          executiveIdentity
        ]);

        return jsonResponse({
          ok: true,
          message: `Collection update confirmed for Application ID ${applicationId}.`,
          applicationId,
          shortCode,
          remarks
        });
      } finally {
        lock.releaseLock();
      }
    }

    return jsonResponse({ ok: false, message: 'Unsupported action. Use search or update.' });
  } catch (error) {
    return jsonResponse({ ok: false, message: error.message || 'Unexpected server error.' });
  }
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('QSC Collection Tools')
    .addItem('Set Spreadsheet ID', 'promptForSpreadsheetId')
    .addItem('Set Main Sheet Name', 'promptForMainSheetName')
    .addToUi();
}

function promptForSpreadsheetId() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt('Spreadsheet ID', 'Paste the Google Sheet ID for the main database:', ui.ButtonSet.OK_CANCEL);
  if (result.getSelectedButton() === ui.Button.OK) {
    const id = normalizeText_(result.getResponseText());
    if (id) {
      PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', id);
      ui.alert('Spreadsheet ID Saved', 'The Apps Script project is now configured to use the selected spreadsheet.', ui.ButtonSet.OK);
    }
  }
}

function promptForMainSheetName() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt('Main Sheet Name', 'Paste the tab name containing the applicant records, such as Applicant_Data or Sheet1:', ui.ButtonSet.OK_CANCEL);
  if (result.getSelectedButton() === ui.Button.OK) {
    const name = normalizeText_(result.getResponseText());
    if (name) {
      PropertiesService.getScriptProperties().setProperty('MAIN_SHEET_NAME', name);
      ui.alert('Sheet Name Saved', 'The Apps Script project will use the selected sheet name.', ui.ButtonSet.OK);
    }
  }
}
