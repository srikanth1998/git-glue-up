import { DriverStatus } from './driverDetection';
import { DriverInstaller } from './driverInstaller';
export declare class AudioCaptureManager {
    private nativeCapture;
    private supabaseWs;
    private isCapturing;
    private sessionId;
    private driverStatus;
    initialize(): Promise<void>;
    checkDriverStatus(): Promise<DriverStatus>;
    startCapture(sessionId: string, jwt: string, supabaseConfig: any): Promise<void>;
    stopCapture(): Promise<void>;
    getStatus(): {
        isCapturing: boolean;
        sessionId: string | null;
        hasNativeSupport: boolean;
        platform: NodeJS.Platform;
        driverStatus: DriverStatus | null;
    };
    getDriverInstaller(): DriverInstaller;
    private connectToSupabase;
    private sendAudioToSupabase;
    private cleanup;
}
//# sourceMappingURL=audioCaptureManager.d.ts.map