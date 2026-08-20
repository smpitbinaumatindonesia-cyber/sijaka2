import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        
        if (url.startsWith('/api/health')) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'ONLINE',
            version: '1.1.1',
            architecture: 'Vercel Serverless API + Google Sheets (No Google Apps Script)',
            sheetsConnected: true,
            spreadsheetId: process.env.GOOGLE_SHEET_ID || '1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E',
            timestamp: new Date().toISOString(),
            message: 'SIJAKA Vercel Backend Service operational.'
          }));
          return;
        }

        if (url.startsWith('/api/sheets')) {
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              message: 'SIJAKA Google Sheets Vercel API Gateway is operational.',
              spreadsheetId: process.env.GOOGLE_SHEET_ID || '1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E',
              timestamp: new Date().toISOString(),
              schemas: ['Anggota', 'Keluarga', 'Kematian', 'Iuran', 'BukuKas', 'Users', 'Sessions', 'Pelayanan', 'Santunan', 'AuditLogs']
            }));
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: true,
                  action: parsed.action || 'sync',
                  requestId: parsed.requestId,
                  data: parsed.payload,
                  message: `Aksi ${parsed.action || 'sync'} berhasil diproses oleh Vercel Data Layer.`
                }));
              } catch (e) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
              }
            });
            return;
          }
        }

        if (url.startsWith('/api/fonnte')) {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}');
              if (!parsed.token && !process.env.FONNTE_TOKEN) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, message: 'Fonnte Token belum dikonfigurasi.' }));
                return;
              }
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: 'Pesan WhatsApp berhasil dikirim.'
              }));
            } catch (e) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevMiddleware()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
