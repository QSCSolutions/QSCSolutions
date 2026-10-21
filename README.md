# QSC Solutions Collection Management Portal

This repository contains a complete frontend + Apps Script solution for QSC Solutions to search applicant records, review customer profiles, submit collection updates, and write updates to a Google Sheet while keeping the existing spreadsheet structure intact.

## What this project includes
- Frontend single-page application in `index.html`, `styles.css`, and `app.js`
- Google Apps Script backend in `Code.gs`
- Apps Script project config in `appsscript.json`
- Documentation in `README.md` and `brand-guidelines.md`
- Ignore rules in `.gitignore`

## Important notes before deployment
- This project does not include your Google account credentials or spreadsheet secrets.
- You must authorize the Google Apps Script project in your own Google account.
- The spreadsheet must be shared with the Apps Script project owner and the script must be authorized to edit it.
- The app must not be deployed as a public unauthenticated write endpoint without proper Google authorization controls.

## Architecture summary
- Frontend: HTML, CSS, and vanilla JavaScript.
- Backend: Google Apps Script web app connected to the spreadsheet.
- Database: Google Sheets workbook with the main applicant list and a `Collection_History` tracking tab.
- Security model: browser calls the Apps Script web app; server validates all input and writes; user identity is read server-side from Google session rather than from client input.

## Required configuration values
Before the app works, you must provide:
- `SPREADSHEET_ID` in the Apps Script project properties or in the script constants.
- `MAIN_SHEET_NAME` in the project properties or in the script defaults.
- The deployed Google Apps Script web app URL in the browser `BACKEND_URL` constant.

The official spreadsheet URL included in your prompt is:
https://docs.google.com/spreadsheets/d/1d50S5XSbDinZr0VDivvmUIUamecRAT63916X1Dq14zA/edit?usp=sharing

## Project files
- `index.html` — UI structure
- `styles.css` — QSC-branded styling and responsive layout
- `app.js` — debounced search logic, UI rendering, and update submission
- `Code.gs` — Apps Script read/write backend
- `appsscript.json` — Apps Script runtime configuration
- `README.md` — startup and deployment guide
- `brand-guidelines.md` — verified brand token summary
- `.gitignore` — local secrets and generated artifacts

## Deployment steps
Detailed setup and deployment instructions are provided below. Use your Google account for all authorization steps.

1. Create or open a GitHub repository.
2. Add these files to the repository root.
3. Open the Google spreadsheet and ensure you can edit it.
4. Open Google Apps Script and create a new Apps Script project.
5. Copy the content of `Code.gs` and `appsscript.json` into the Apps Script project.
6. In Apps Script, set the script properties:
   - `SPREADSHEET_ID` = the spreadsheet ID from the Google Sheets URL.
   - `MAIN_SHEET_NAME` = the tab name containing the applicant records (for example, `Applicant_Data`, `Sheet1`, or the exact spreadsheet name you confirm in Google Sheets).
7. Run a test function or use the Apps Script menu to set the values.
8. Deploy the script as a web app with proper access settings.
9. Copy the deployed web URL and paste it into `app.js` as `BACKEND_URL`.
10. Host the frontend using GitHub Pages or a similar static-hosting option if desired.
11. Test search and submission flows in the browser.

## Security and privacy requirements
- No credentials, service-account keys, or secrets should be stored in frontend JavaScript.
- Only the script owner should have access to spreadsheet editing permissions.
- The backend must validate all incoming values before updating rows.
- The frontend must never send an executive identity from the client; use the authenticated Google session in Apps Script.
- Do not expose raw customer records in browser logs or public responses.
- The web app must be deployed with access limited to authorized Google accounts and not as a fully public write endpoint.

## Limitations
- The project depends on your spreadsheet structure and access permissions, which cannot be verified without your account access.
- If the Google Sheets headers differ from the expected values, the backend will return a clear error instead of modifying data.
- This solution communicates with the spreadsheet using Google Apps Script and is subject to Google Apps Script authorization and runtime limits.
