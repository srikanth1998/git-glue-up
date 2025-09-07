declare global {
    interface Window {
        electronAPI: {
            getCapabilities: () => Promise<any>;
            startCapture: (sessionId: string, jwt: string, config: any) => Promise<void>;
            stopCapture: () => Promise<void>;
            checkDriverStatus: () => Promise<any>;
            getInstallationSteps: () => Promise<any[]>;
            executeInstallationStep: (stepId: string) => Promise<any[]>;
            verifyDriverInstallation: () => Promise<any>;
            refreshDriverStatus: () => Promise<any[]>;
            getDriverInstructions: () => Promise<string[]>;
            openDriverDownload: () => Promise<void>;
            minimizeWindow: () => Promise<void>;
            closeWindow: () => Promise<void>;
            onDriverStatusChange: (callback: (status: any) => void) => void;
            onCaptureStatusChange: (callback: (status: any) => void) => void;
            onOverlayStatusChange: (callback: (status: any) => void) => void;
            createStealthOverlay: (sessionId: string, position?: any) => Promise<any>;
            showOverlay: () => Promise<void>;
            hideOverlay: () => Promise<void>;
            toggleOverlay: () => Promise<void>;
            setOverlayPosition: (position: any) => Promise<void>;
            updateOverlayContent: (question: string, answer: string) => Promise<void>;
            destroyOverlay: () => Promise<void>;
        };
    }
}
export {};
//# sourceMappingURL=preload.d.ts.map