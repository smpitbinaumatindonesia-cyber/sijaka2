/**
 * ==============================================================================
 * SIJAKA - Vercel Serverless Function: WhatsApp Fonnte Proxy Gateway
 * Architecture: AI Studio -> GitHub -> Vercel -> Google Sheets (No Google Apps Script)
 * Endpoints: POST /api/fonnte
 * Keeps Fonnte API tokens masked and secure on the server-side.
 * ==============================================================================
 */

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { target, message, token } = req.body || {};

    const activeToken = token || process.env.FONNTE_TOKEN;

    if (!activeToken || activeToken === 'YOUR_FONNTE_TOKEN_HERE') {
      return res.status(400).json({
        success: false,
        message: 'Fonnte Token belum dikonfigurasi.'
      });
    }

    if (!target || !message) {
      return res.status(400).json({
        success: false,
        message: 'Target number dan message wajib diisi.'
      });
    }

    const fonnteRes = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': activeToken.trim(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        target,
        message,
        countryCode: '62'
      })
    });

    const data = await fonnteRes.json().catch(() => null);

    return res.status(fonnteRes.ok ? 200 : 400).json({
      success: fonnteRes.ok,
      data,
      message: fonnteRes.ok ? 'Pesan WhatsApp berhasil dikirim.' : 'Gagal mengirim pesan WhatsApp.'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Gagal menghubungi server WhatsApp Fonnte.'
    });
  }
}
