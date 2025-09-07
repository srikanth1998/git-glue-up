"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Audio capture methods
    getCapabilities: () => electron_1.ipcRenderer.invoke('get-capabilities'),
    startCapture: (sessionId, jwt, config) => electron_1.ipcRenderer.invoke('start-capture', sessionId, jwt, config),
    stopCapture: () => electron_1.ipcRenderer.invoke('stop-capture'),
    // Driver management methods
    checkDriverStatus: () => electron_1.ipcRenderer.invoke('check-driver-status'),
    getInstallationSteps: () => electron_1.ipcRenderer.invoke('get-installation-steps'),
    executeInstallationStep: (stepId) => electron_1.ipcRenderer.invoke('execute-installation-step', stepId),
    verifyDriverInstallation: () => electron_1.ipcRenderer.invoke('verify-driver-installation'),
    refreshDriverStatus: () => electron_1.ipcRenderer.invoke('refresh-driver-status'),
    getDriverInstructions: () => electron_1.ipcRenderer.invoke('get-driver-instructions'),
    openDriverDownload: () => electron_1.ipcRenderer.invoke('open-driver-download'),
    // Overlay management methods
    createStealthOverlay: (sessionId, position) => electron_1.ipcRenderer.invoke('create-stealth-overlay', sessionId, position),
    showOverlay: () => electron_1.ipcRenderer.invoke('show-overlay'),
    hideOverlay: () => electron_1.ipcRenderer.invoke('hide-overlay'),
    toggleOverlay: () => electron_1.ipcRenderer.invoke('toggle-overlay'),
    setOverlayPosition: (position) => electron_1.ipcRenderer.invoke('set-overlay-position', position),
    updateOverlayContent: (question, answer) => electron_1.ipcRenderer.invoke('update-overlay-content', question, answer),
    destroyOverlay: () => electron_1.ipcRenderer.invoke('destroy-overlay'),
    // Window management
    minimizeWindow: () => electron_1.ipcRenderer.invoke('minimize-window'),
    closeWindow: () => electron_1.ipcRenderer.invoke('close-window'),
    // Event listeners
    onDriverStatusChange: (callback) => electron_1.ipcRenderer.on('driver-status-changed', callback),
    onCaptureStatusChange: (callback) => electron_1.ipcRenderer.on('capture-status-changed', callback),
    onOverlayStatusChange: (callback) => electron_1.ipcRenderer.on('overlay-status-changed', callback)
});
//# sourceMappingURL=preload.js.map