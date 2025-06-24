// src/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // 即使我们现在没用preload做math.js，但保留它以备后用或用于其他IPC
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // 打开开发者工具 (可选)
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

// 你可能有一个空的或者带有其他功能的 preload.js，这里假设有一个基础的或空的。
// 如果你没有 preload.js 文件，可以将 webPreferences 中的 preload 那行注释掉。