"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods for overlay functionality
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Overlay control methods
    hideOverlay: () => electron_1.ipcRenderer.invoke('hide-overlay'),
    showOverlay: () => electron_1.ipcRenderer.invoke('show-overlay'),
    toggleOverlay: () => electron_1.ipcRenderer.invoke('toggle-overlay'),
    setOverlayPosition: (position) => electron_1.ipcRenderer.invoke('set-overlay-position', position),
    // Event listeners for real-time updates
    onAnswerReceived: (callback) => electron_1.ipcRenderer.on('overlay-answer-received', callback),
    onCaptureStatusChange: (callback) => electron_1.ipcRenderer.on('capture-status-changed', callback),
    onSessionUpdate: (callback) => electron_1.ipcRenderer.on('session-updated', callback),
    // Remove listeners
    removeAllListeners: () => {
        electron_1.ipcRenderer.removeAllListeners('overlay-answer-received');
        electron_1.ipcRenderer.removeAllListeners('capture-status-changed');
        electron_1.ipcRenderer.removeAllListeners('session-updated');
    }
});
// Note: Type definitions for electronAPI are in preload.ts to avoid conflicts
//# sourceMappingURL=overlay-preload.js.map