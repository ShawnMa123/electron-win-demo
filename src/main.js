// src/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 400, // 调整窗口大小以适应计算器
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // 如果你没有 preload.js，可以移除或注释掉
            nodeIntegration: false, // 推荐 false 以提高安全性
            contextIsolation: true, // 推荐 true
            // 如果你的 renderer.js 需要直接使用 Node.js API (本例不需要)
            // 且没有 preload.js，则需要 nodeIntegration: true, contextIsolation: false
            // 但为了简单起见，上面的 renderer.js 是纯浏览器 JS，所以默认值或安全设置即可。
            // 为了让 onclick="functionName()" 在 HTML 中工作而不需要 preload.js
            // 你可以设置 nodeIntegration: false, contextIsolation: false (不推荐，但简单)
            // 或者像 renderer.js 中那样，将函数附加到 window 对象。
            // 对于上面的 renderer.js，它将函数附加到 window，所以以下设置是安全的：
            // nodeIntegration: false,
            // contextIsolation: true, // preload.js 仍然可以用来暴露选择性的 Node API
        }
    });

    // mainWindow.loadFile('index.html'); // 如果 main.js 和 index.html 在同一目录
    mainWindow.loadFile(path.join(__dirname, 'index.html')); // 如果 index.html 在 src 目录，且 main.js 也在 src 目录

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