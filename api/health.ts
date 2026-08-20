/**
 * ==============================================================================
 * SIJAKA - Vercel Serverless Function: Health Check Handler
 * Architecture: AI Studio -> GitHub -> Vercel -> Google Sheets (No Google Apps Script)
 * Endpoints: GET /api/health
 * ==============================================================================
 */

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sheetId = process.env.GOOGLE_SHEET_ID || '1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E';

  return res.status(200).json({
    status: 'ONLINE',
    version: '1.1.1',
    architecture: 'Vercel Serverless API + Google Sheets (No Google Apps Script)',
    environment: process.env.NODE_ENV || 'production',
    sheetsConnected: true,
    spreadsheetId: sheetId,
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? process.uptime() : 0,
    message: 'SIJAKA Vercel Backend Service operational.'
  });
}
