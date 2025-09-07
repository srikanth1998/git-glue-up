import { EventEmitter } from 'events';
interface NativeAudioCapture extends EventEmitter {
    initialize(): boolean;
    startCapture(): boolean;
    stopCapture(): void;
    destroy(): void;
}
export declare function createNativeAudioCapture(): NativeAudioCapture | null;
export { NativeAudioCapture };
//# sourceMappingURL=nativeAudioBridge.d.ts.map