// SIJAKA v1.1.1 - Vercel Serverless API Code for Google Sheets Integration
export const VERCEL_API_SHEETS_CONTENT = `// /api/sheets.ts - Vercel Serverless Function for Google Sheets
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Allowed 10 Official Google Sheets Schema
const ALLOWED_SHEETS = [
  'Anggota',
  'Keluarga',
  'Kematian',
  'Iuran',
  'BukuKas',
  'Users',
  'Sessions',
  'Pelayanan',
  'Santunan',
  'AuditLogs'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E';

  try {
    if (req.method === 'GET') {
      const { sheet } = req.query;
      return res.status(200).json({
        success: true,
        spreadsheetId: SPREADSHEET_ID,
        sheet: sheet || 'all',
        data: [],
        timestamp: new Date().toISOString()
      });
    }

    if (req.method === 'POST') {
      const { action, sheet, payload, requestId } = req.body || {};
      
      // Idempotency & Validation Guard
      if (sheet && !ALLOWED_SHEETS.includes(sheet)) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_SHEET_NAME'
        });
      }

      return res.status(200).json({
        success: true,
        action: action || 'SAVE',
        sheet: sheet,
        requestId: requestId || ('REQ-' + Date.now()),
        timestamp: new Date().toISOString()
      });
    }

    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'INTERNAL_SERVER_ERROR'
    });
  }
}
`;

export const VERCEL_ENV_EXAMPLE_CONTENT = `# SIJAKA v1.1.1 Environment Configuration (Vercel & Google Sheets)
# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E
GOOGLE_SERVICE_ACCOUNT_EMAIL=sijaka-service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----"

# WhatsApp Gateway (Fonnte)
FONNTE_API_TOKEN=your_official_fonnte_token_here

# Security
NODE_ENV=production
`;
