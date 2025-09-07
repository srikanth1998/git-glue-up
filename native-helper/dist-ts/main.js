"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const ws_1 = require("ws");
const audioCaptureManager_1 = require("./audio/audioCaptureManager");
const overlayManager_1 = require("./ui/overlayManager");
const driverDetection_1 = require("./audio/driverDetection");
const driverInstaller_1 = require("./audio/driverInstaller");
class NativeHelper {
    constructor() {
        this.mainWindow = null;
        this.wsServer = null;
        this.audioCaptureManager = null;
        this.overlayManager = null;
        this.setupApp();
    }
    setupApp() {
        electron_1.app.whenReady().then(() => {
            this.createMainWindow();
            this.startWebSocketServer();
            this.setupAudioCapture();
            this.setupOverlay();
            this.setupIpcHandlers();
        });
        electron_1.app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                electron_1.app.quit();
            }
        });
        electron_1.app.on('activate', () => {
            if (electron_1.BrowserWindow.getAllWindows().length === 0) {
                this.createMainWindow();
            }
        });
    }
    createMainWindow() {
        this.mainWindow = new electron_1.BrowserWindow({
            width: 400,
            height: 500,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: (0, path_1.join)(__dirname, 'preload.js')
            },
            show: false,
            skipTaskbar: true,
            title: 'InterviewAce Helper'
        });
        this.mainWindow.loadFile((0, path_1.join)(__dirname, 'status.html'));
        this.hideFromScreenShare();
    }
    hideFromScreenShare() {
        if (!this.mainWindow)
            return;
        if (process.platform === 'win32') {
            const { exec } = require('child_process');
            const hwnd = this.mainWindow.getNativeWindowHandle();
            exec(`powershell -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\\"user32.dll\\")] public static extern bool SetWindowDisplayAffinity(IntPtr hwnd, uint affinity); }'; [Win32]::SetWindowDisplayAffinity(${hwnd}, 0x00000011)"`);
        }
        else if (process.platform === 'darwin') {
            this.mainWindow.setAlwaysOnTop(true, 'screen-saver');
        }
    }
    setupIpcHandlers() {
        // Driver detection and installation handlers
        electron_1.ipcMain.handle('check-driver-status', async () => {
            return await driverDetection_1.DriverDetector.getCurrentPlatformDriver();
        });
        electron_1.ipcMain.handle('get-installation-steps', async () => {
            const installer = driverInstaller_1.DriverInstaller.getInstance();
            return await installer.initializeInstallationFlow();
        });
        electron_1.ipcMain.handle('execute-installation-step', async (event, stepId) => {
            const installer = driverInstaller_1.DriverInstaller.getInstance();
            await installer.executeStep(stepId);
            return installer.getInstallationSteps();
        });
        electron_1.ipcMain.handle('verify-driver-installation', async () => {
            const installer = driverInstaller_1.DriverInstaller.getInstance();
            return await installer.verifyInstallation();
        });
        electron_1.ipcMain.handle('refresh-driver-status', async () => {
            const installer = driverInstaller_1.DriverInstaller.getInstance();
            await installer.refreshStepStatus();
            return installer.getInstallationSteps();
        });
        electron_1.ipcMain.handle('get-driver-instructions', async () => {
            const installer = driverInstaller_1.DriverInstaller.getInstance();
            return installer.getDetailedInstructions();
        });
        electron_1.ipcMain.handle('open-driver-download', async () => {
            await electron_1.shell.openExternal(driverDetection_1.DriverDetector.getDriverDownloadUrl());
        });
        // Overlay management handlers
        electron_1.ipcMain.handle('create-stealth-overlay', async (event, sessionId, position) => {
            if (this.overlayManager) {
                return this.overlayManager.createStealthOverlay(sessionId, position);
            }
            return null;
        });
        electron_1.ipcMain.handle('show-overlay', async () => {
            if (this.overlayManager) {
                this.overlayManager.showOverlay();
            }
        });
        electron_1.ipcMain.handle('hide-overlay', async () => {
            if (this.overlayManager) {
                this.overlayManager.hideOverlay();
            }
        });
        electron_1.ipcMain.handle('toggle-overlay', async () => {
            if (this.overlayManager) {
                this.overlayManager.toggleOverlay();
            }
        });
        electron_1.ipcMain.handle('set-overlay-position', async (event, position) => {
            if (this.overlayManager) {
                this.overlayManager.setPosition(position);
            }
        });
        electron_1.ipcMain.handle('update-overlay-content', async (event, question, answer) => {
            if (this.overlayManager) {
                this.overlayManager.updateOverlayContent(question, answer);
            }
        });
        electron_1.ipcMain.handle('destroy-overlay', async () => {
            if (this.overlayManager) {
                this.overlayManager.destroyOverlay();
            }
        });
        // Audio capture handlers
        electron_1.ipcMain.handle('get-capabilities', async () => {
            return this.audioCaptureManager?.getStatus() || { available: false };
        });
        electron_1.ipcMain.handle('start-capture', async (event, sessionId, jwt, config) => {
            if (this.audioCaptureManager) {
                await this.audioCaptureManager.startCapture(sessionId, jwt, config);
                // Show overlay when capture starts
                if (this.overlayManager) {
                    this.overlayManager.showOverlay();
                }
            }
        });
        electron_1.ipcMain.handle('stop-capture', async () => {
            if (this.audioCaptureManager) {
                await this.audioCaptureManager.stopCapture();
                // Hide overlay when capture stops
                if (this.overlayManager) {
                    this.overlayManager.hideOverlay();
                }
            }
        });
        // Window management
        electron_1.ipcMain.handle('minimize-window', async () => {
            if (this.mainWindow) {
                this.mainWindow.minimize();
            }
        });
        electron_1.ipcMain.handle('close-window', async () => {
            if (this.mainWindow) {
                this.mainWindow.close();
            }
        });
    }
    startWebSocketServer() {
        this.wsServer = new ws_1.WebSocketServer({ port: 8765 });
        this.wsServer.on('connection', (ws) => {
            console.log('Client connected to native helper');
            ws.on('message', async (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    await this.handleClientMessage(ws, message);
                }
                catch (error) {
                    console.error('Error handling client message:', error);
                    ws.send(JSON.stringify({ type: 'error', message: error instanceof Error ? error.message : String(error) }));
                }
            });
            ws.on('close', () => {
                console.log('Client disconnected');
            });
            // Send capabilities and driver status on connection
            this.sendCapabilitiesAndDriverStatus(ws);
        });
        console.log('WebSocket server started on port 8765');
    }
    async sendCapabilitiesAndDriverStatus(ws) {
        const driverStatus = await driverDetection_1.DriverDetector.getCurrentPlatformDriver();
        ws.send(JSON.stringify({
            type: 'capabilities',
            data: {
                available: true,
                version: '1.0.0',
                drivers: {
                    windows: process.platform === 'win32',
                    macos: process.platform === 'darwin'
                },
                driverStatus: driverStatus
            }
        }));
    }
    async handleClientMessage(ws, message) {
        switch (message.action) {
            case 'startCapture':
                if (this.audioCaptureManager) {
                    await this.audioCaptureManager.startCapture(message.sessionId, message.jwt, message.supabaseConfig);
                    // Create and show stealth overlay
                    if (this.overlayManager) {
                        this.overlayManager.createStealthOverlay(message.sessionId);
                        this.overlayManager.showOverlay();
                    }
                    ws.send(JSON.stringify({ type: 'captureStatus', status: 'active' }));
                }
                break;
            case 'stopCapture':
                if (this.audioCaptureManager) {
                    await this.audioCaptureManager.stopCapture();
                    // Hide overlay
                    if (this.overlayManager) {
                        this.overlayManager.hideOverlay();
                    }
                    ws.send(JSON.stringify({ type: 'captureStatus', status: 'idle' }));
                }
                break;
            case 'showOverlay':
                if (this.overlayManager) {
                    this.overlayManager.showOverlay();
                    ws.send(JSON.stringify({ type: 'overlayStatus', visible: true }));
                }
                break;
            case 'hideOverlay':
                if (this.overlayManager) {
                    this.overlayManager.hideOverlay();
                    ws.send(JSON.stringify({ type: 'overlayStatus', visible: false }));
                }
                break;
            case 'updateOverlay':
                if (this.overlayManager && message.question && message.answer) {
                    this.overlayManager.updateOverlayContent(message.question, message.answer);
                    ws.send(JSON.stringify({ type: 'overlayUpdated', success: true }));
                }
                break;
            case 'checkDriverStatus':
                const driverStatus = await driverDetection_1.DriverDetector.getCurrentPlatformDriver();
                ws.send(JSON.stringify({
                    type: 'driverStatus',
                    status: driverStatus
                }));
                break;
            case 'getCapabilities':
                await this.sendCapabilitiesAndDriverStatus(ws);
                break;
        }
    }
    async setupAudioCapture() {
        this.audioCaptureManager = new audioCaptureManager_1.AudioCaptureManager();
        await this.audioCaptureManager.initialize();
    }
    setupOverlay() {
        this.overlayManager = new overlayManager_1.OverlayManager();
    }
}
// Start the application
new NativeHelper();
//# sourceMappingURL=main.js.map