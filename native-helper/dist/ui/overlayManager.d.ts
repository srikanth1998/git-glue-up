import { BrowserWindow } from 'electron';
export interface OverlayPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare class OverlayManager {
    private overlayWindow;
    private isVisible;
    private currentPosition;
    constructor();
    private setupAppEvents;
    createStealthOverlay(sessionId: string, position?: OverlayPosition): BrowserWindow;
    private applyStealthMeasures;
    private setupOverlayEvents;
    private getOverlayHTML;
    showOverlay(): void;
    hideOverlay(): void;
    toggleOverlay(): void;
    updateOverlayContent(question: string, answer: string): void;
    setPosition(position: OverlayPosition): void;
    getPosition(): OverlayPosition | null;
    destroyOverlay(): void;
    isOverlayVisible(): boolean;
}
//# sourceMappingURL=overlayManager.d.ts.map