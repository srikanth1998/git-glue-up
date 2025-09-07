/*
  Native Helper client for InterviewAce
  ------------------------------------
  – Connects to the local native-helper WebSocket (port 8765)
  – Exposes methods to start/stop audio capture.
  – Emits events for overlay / driverStatus changes.
*/

export interface CaptureOptions {
  sessionId: string;
  jwt?: string;
  supabaseConfig?: Record<string, any>;
}

type Listener = (payload: any) => void;

export class NativeHelperClient {
  private ws: WebSocket | null = null;
  private connected = false;
  private listeners: Record<string, Listener[]> = {};
  private connectPromise?: Promise<void>;

  connect(timeoutMs = 1000): Promise<void> {
    if (this.connected) return Promise.resolve();
    if (this.connectPromise) return this.connectPromise;

    this.connectPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('helper-timeout')), timeoutMs);
      try {
        this.ws = new WebSocket('ws://localhost:8765');
        this.ws.onopen = () => {
          clearTimeout(timer);
          this.connected = true;
          this.ws?.addEventListener('message', (evt) => this.handleMessage(evt));
          resolve();
        };
        this.ws.onerror = () => {
          clearTimeout(timer);
          reject(new Error('ws-error'));
        };
      } catch (err) {
        clearTimeout(timer);
        reject(err);
      }
    });
    return this.connectPromise;
  }

  private handleMessage(evt: MessageEvent) {
    try {
      const msg = JSON.parse(evt.data);
      this.emit(msg.type, msg);
    } catch {}
  }

  private emit(type: string, payload: any) {
    (this.listeners[type] || []).forEach((cb) => cb(payload));
  }

  on(type: string, cb: Listener) {
    this.listeners[type] = this.listeners[type] || [];
    this.listeners[type].push(cb);
  }

  off(type: string, cb: Listener) {
    this.listeners[type] = (this.listeners[type] || []).filter((fn) => fn !== cb);
  }

  async startCapture(opts: CaptureOptions) {
    await this.ensureConnected();
    this.ws?.send(
      JSON.stringify({
        action: 'startCapture',
        ...opts,
      })
    );
  }

  async stopCapture() {
    await this.ensureConnected();
    this.ws?.send(JSON.stringify({ action: 'stopCapture' }));
  }

  async showOverlay() {
    await this.ensureConnected();
    this.ws?.send(JSON.stringify({ action: 'showOverlay' }));
  }

  async hideOverlay() {
    await this.ensureConnected();
    this.ws?.send(JSON.stringify({ action: 'hideOverlay' }));
  }

  private async ensureConnected() {
    if (!this.connected) {
      try {
        await this.connect();
      } catch (e) {
        // helper not running – attempt to prompt user
        window.open('https://interviewace.com/helper-download', '_blank');
        throw e;
      }
    }
  }
}

export const nativeHelper = new NativeHelperClient();
