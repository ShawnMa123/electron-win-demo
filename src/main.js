// src/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // 确保 preload.js 被加载
            nodeIntegration: false,                      // 保持 false 以提高安全性
            contextIsolation: true,                      // 保持 true 以提高安全性
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // 打开开发者工具 (可选，用于调试打包后的应用)
    // To open DevTools in the packaged app for debugging, you might need to
    // check if it's development mode or add a flag/menu item.
    // For now, you can uncomment it for testing builds.
    // mainWindow.webContents.openDevTools(); 
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});