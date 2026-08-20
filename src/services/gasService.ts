/**
 * ==============================================================================
 * SIJAKA - Google Apps Script (GAS) Live Integration & Network Service
 * Production-ready HTTP client with timeout, idempotency, retry, and offline resilience.
 * ==============================================================================
 */

export interface GasApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
  requestId?: string;
}

export interface GasRequestOptions {
  timeoutMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  requestId?: string;
  sessionId?: string;
}

export class GasService {
  private static instance: GasService;
  private defaultTimeout = 12000; // 12 seconds
  private activeRequests: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): GasService {
    if (!GasService.instance) {
      GasService.instance = new GasService();
    }
    return GasService.instance;
  }

  /**
   * Check if client is connected to network
   */
  public isOnline(): boolean {
    return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true;
  }

  /**
   * Send RPC action to Google Apps Script Exec Web App with Idempotency Key
   */
  public async executeGasAction<T = any>(
    execUrl: string,
    action: string,
    payload: Record<string, any> = {},
    options: GasRequestOptions = {}
  ): Promise<GasApiResponse<T>> {
    if (!execUrl || !execUrl.startsWith('https://script.google.com/macros/s/')) {
      return {
        success: false,
        error: 'URL Google Apps Script Exec belum dikonfigurasi dengan benar.',
        code: 'UNCONFIGURED_ENDPOINT'
      };
    }

    if (!this.isOnline()) {
      return {
        success: false,
        error: 'Anda sedang offline. Periksa koneksi internet Anda.',
        code: 'OFFLINE'
      };
    }

    const requestId = options.requestId || 'REQ-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
    const timeoutMs = options.timeoutMs || this.defaultTimeout;
    const maxRetries = options.maxRetries || 1;

    // Idempotency: Prevent duplicate in-flight requests for identical action & requestId
    const requestKey = `${action}_${requestId}`;
    if (this.activeRequests.has(requestKey)) {
      return {
        success: false,
        error: 'Permintaan sedang diproses. Harap tunggu.',
        code: 'DUPLICATE_IN_FLIGHT',
        requestId
      };
    }

    this.activeRequests.add(requestKey);

    try {
      let attempt = 0;
      let lastError: any = null;

      while (attempt <= maxRetries) {
        attempt++;
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), timeoutMs);

          const requestBody = {
            action,
            requestId,
            sessionId: options.sessionId,
            timestamp: new Date().toISOString(),
            payload
          };

          const response = await fetch(execUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8' // GAS doPost prefers text/plain for no-preflight CORS
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
          });

          clearTimeout(timer);

          if (!response.ok) {
            throw new Error(`HTTP_${response.status}: ${response.statusText}`);
          }

          const text = await response.text();
          let jsonResult: any;

          try {
            jsonResult = JSON.parse(text);
          } catch (parseErr) {
            throw new Error('MALFORMED_RESPONSE: Backend mengembalikan format non-JSON.');
          }

          return {
            success: !!jsonResult.success,
            data: jsonResult.data,
            message: jsonResult.message,
            error: jsonResult.error,
            requestId
          };
        } catch (err: any) {
          lastError = err;
          if (err.name === 'AbortError') {
            lastError = new Error('TIMEOUT: Permintaan ke server memakan waktu terlalu lama.');
          }

          // If retry count remaining and it's a network glitch, wait briefly
          if (attempt <= maxRetries) {
            await new Promise(res => setTimeout(res, options.retryDelayMs || 1000));
          }
        }
      }

      return {
        success: false,
        error: lastError?.message || 'Gagal terhubung ke Google Apps Script backend.',
        code: 'NETWORK_ERROR',
        requestId
      };
    } finally {
      this.activeRequests.delete(requestKey);
    }
  }

  /**
   * Safe Fonnte WhatsApp API Dispatcher
   */
  public async sendFonnteMessage(
    targetNumber: string,
    messageText: string,
    token?: string
  ): Promise<{ success: boolean; status: 'TERKIRIM' | 'TERJADWAL' | 'GAGAL' | 'BELUM TERKIRIM'; message: string }> {
    if (!token || token.trim() === '' || token === 'YOUR_FONNTE_TOKEN_HERE') {
      return {
        success: false,
        status: 'BELUM TERKIRIM',
        message: 'Notifikasi WhatsApp belum tersedia.'
      };
    }

    if (!this.isOnline()) {
      return {
        success: false,
        status: 'GAGAL',
        message: 'Tidak dapat mengirim notifikasi saat offline.'
      };
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);

      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': token.trim(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          target: targetNumber,
          message: messageText,
          countryCode: '62'
        }),
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!response.ok) {
        return {
          success: false,
          status: 'GAGAL',
          message: 'Notifikasi WhatsApp belum tersedia.'
        };
      }

      const resJson = await response.json().catch(() => null);
      if (resJson && resJson.status) {
        return {
          success: true,
          status: 'TERKIRIM',
          message: 'Pesan WhatsApp berhasil dikirim.'
        };
      }

      return {
        success: false,
        status: 'GAGAL',
        message: 'Notifikasi WhatsApp belum tersedia.'
      };
    } catch (e) {
      return {
        success: false,
        status: 'GAGAL',
        message: 'Notifikasi WhatsApp belum tersedia.'
      };
    }
  }
}

export const gasService = GasService.getInstance();
