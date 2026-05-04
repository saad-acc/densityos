# POC Form -> Google Sheets Setup

Use this guide to store each `poc-signup.html` submission in Google Sheets.

## 1) Create the spreadsheet

1. In Google Drive, create a new Google Sheet.
2. Rename the first tab to `POC Leads`.
3. Add this header row (row 1), in this exact order:

`Submitted At | Source Page | Company Name | Website | Your Name | Role | Email | Phone | Cluster Size | Workload Types | Infrastructure Types | Challenges | Timeframe | Honeypot`

## 2) Create Apps Script bound to the sheet

1. In the sheet: `Extensions -> Apps Script`.
2. Replace default code with the script below.
3. Set `SHEET_NAME`.
4. Save.

```javascript
const SHEET_NAME = 'POC Leads';

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonResponse({ ok: false, error: 'Sheet not found' }, 500);
    }

    // Basic spam protection: ignore hidden honeypot submissions
    if ((payload.honeypot || '').trim()) {
      return jsonResponse({ ok: true, skipped: true });
    }

    const row = [
      payload.submittedAt || new Date().toISOString(),
      payload.sourcePage || '',
      payload.companyName || '',
      payload.website || '',
      payload.yourName || '',
      payload.role || '',
      payload.email || '',
      payload.phone || '',
      payload.clusterSize || '',
      Array.isArray(payload.workloadTypes) ? payload.workloadTypes.join(', ') : '',
      Array.isArray(payload.infraTypes) ? payload.infraTypes.join(', ') : '',
      payload.challenges || '',
      payload.timeframe || '',
      payload.honeypot || ''
    ];

    sheet.appendRow(row);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) }, 500);
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3) Deploy as Web App

1. In Apps Script, click `Deploy -> New deployment`.
2. Select type: `Web app`.
3. Execute as: `Me`.
4. Who has access: `Anyone`.
5. Deploy and authorize.
6. Copy the generated Web App URL.

## 4) Connect website form to endpoint

Open `poc-signup.html` and set the form endpoint:

```html
<form id="poc-form" ... data-endpoint="PASTE_WEB_APP_URL_HERE">
```

The form already posts JSON in `script.js`. Once URL is set, submissions will:

- append a row in Google Sheet

## 5) Test checklist

1. Submit a test from `poc-signup.html`.
2. Confirm new row appears in the sheet.
3. Submit once with honeypot field filled (using browser dev tools) and verify it is ignored.

