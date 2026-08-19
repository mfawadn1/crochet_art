import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // handle newlines in env vars
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

export const getDoc = async () => {
  const docId = process.env.GOOGLE_SHEET_ID;
  if (!docId) {
    throw new Error("GOOGLE_SHEET_ID is missing");
  }
  const doc = new GoogleSpreadsheet(docId, serviceAccountAuth);
  await doc.loadInfo(); // loads document properties and worksheets
  return doc;
};
