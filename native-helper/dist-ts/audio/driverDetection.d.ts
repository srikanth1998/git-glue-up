export interface DriverStatus {
    installed: boolean;
    version?: string;
    deviceName?: string;
    error?: string;
}
export declare class DriverDetector {
    static detectWindowsVBCable(): Promise<DriverStatus>;
    static detectMacOSBlackHole(): Promise<DriverStatus>;
    static getCurrentPlatformDriver(): Promise<DriverStatus>;
    static getDriverDownloadUrl(): string;
    static getDriverName(): string;
}
//# sourceMappingURL=driverDetection.d.ts.map