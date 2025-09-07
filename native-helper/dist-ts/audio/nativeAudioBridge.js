"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNativeAudioCapture = createNativeAudioCapture;
// Node.js bridge for native audio capture modules
const events_1 = require("events");
class WindowsAudioCapture extends events_1.EventEmitter {
    constructor() {
        super();
        this.captureHandle = null;
        try {
            this.nativeBinding = require('../../build/Release/wasapi_capture.node');
        }
        catch (error) {
            console.error('Failed to load Windows audio capture module:', error);
            throw error;
        }
    }
    initialize() {
        try {
            this.captureHandle = this.nativeBinding.createCapture();
            return this.captureHandle !== null;
        }
        catch (error) {
            console.error('Failed to initialize Windows audio capture:', error);
            return false;
        }
    }
    startCapture() {
        if (!this.captureHandle) {
            console.error('Audio capture not initialized');
            return false;
        }
        try {
            // Set up audio data callback
            this.nativeBinding.setAudioCallback((audioData) => {
                this.emit('audioData', audioData);
            });
            return this.nativeBinding.startCapture(this.captureHandle);
        }
        catch (error) {
            console.error('Failed to start Windows audio capture:', error);
            return false;
        }
    }
    stopCapture() {
        if (this.captureHandle) {
            try {
                this.nativeBinding.stopCapture(this.captureHandle);
            }
            catch (error) {
                console.error('Failed to stop Windows audio capture:', error);
            }
        }
    }
    destroy() {
        if (this.captureHandle) {
            try {
                this.nativeBinding.destroyCapture(this.captureHandle);
                this.captureHandle = null;
            }
            catch (error) {
                console.error('Failed to destroy Windows audio capture:', error);
            }
        }
    }
}
class MacOSAudioCapture extends events_1.EventEmitter {
    constructor() {
        super();
        this.captureHandle = null;
        try {
            this.nativeBinding = require('../../build/Release/macos_capture.node');
        }
        catch (error) {
            console.error('Failed to load macOS audio capture module:', error);
            throw error;
        }
    }
    initialize() {
        try {
            this.captureHandle = this.nativeBinding.createMacOSCapture();
            return this.captureHandle !== null;
        }
        catch (error) {
            console.error('Failed to initialize macOS audio capture:', error);
            return false;
        }
    }
    startCapture() {
        if (!this.captureHandle) {
            console.error('Audio capture not initialized');
            return false;
        }
        try {
            // Set up audio data callback
            this.nativeBinding.setAudioCallback((audioData) => {
                this.emit('audioData', audioData);
            });
            return this.nativeBinding.startMacOSCapture(this.captureHandle);
        }
        catch (error) {
            console.error('Failed to start macOS audio capture:', error);
            return false;
        }
    }
    stopCapture() {
        if (this.captureHandle) {
            try {
                this.nativeBinding.stopMacOSCapture(this.captureHandle);
            }
            catch (error) {
                console.error('Failed to stop macOS audio capture:', error);
            }
        }
    }
    destroy() {
        if (this.captureHandle) {
            try {
                this.nativeBinding.destroyMacOSCapture(this.captureHandle);
                this.captureHandle = null;
            }
            catch (error) {
                console.error('Failed to destroy macOS audio capture:', error);
            }
        }
    }
}
function createNativeAudioCapture() {
    try {
        if (process.platform === 'win32') {
            return new WindowsAudioCapture();
        }
        else if (process.platform === 'darwin') {
            return new MacOSAudioCapture();
        }
        else {
            console.error('Unsupported platform for native audio capture');
            return null;
        }
    }
    catch (error) {
        console.error('Failed to create native audio capture:', error);
        return null;
    }
}
//# sourceMappingURL=nativeAudioBridge.js.map