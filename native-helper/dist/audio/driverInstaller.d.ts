import { DriverStatus } from './driverDetection';
export interface InstallationStep {
    id: string;
    title: string;
    description: string;
    action?: () => Promise<void>;
    completed: boolean;
}
export declare class DriverInstaller {
    private static instance;
    private installationSteps;
    private onStatusChange?;
    static getInstance(): DriverInstaller;
    setStatusChangeCallback(callback: (steps: InstallationStep[]) => void): void;
    initializeInstallationFlow(): Promise<InstallationStep[]>;
    private getWindowsInstallationSteps;
    private getMacOSInstallationSteps;
    executeStep(stepId: string): Promise<void>;
    verifyInstallation(): Promise<DriverStatus>;
    refreshStepStatus(): Promise<void>;
    getInstallationSteps(): InstallationStep[];
    isInstallationComplete(): boolean;
    private notifyStatusChange;
    getDetailedInstructions(): string[];
}
//# sourceMappingURL=driverInstaller.d.ts.map