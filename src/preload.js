// src/preload.js
// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('myAPI', {
//   doSomething: () => ipcRenderer.send('do-something')
// });

// 在这个阶段，如果只为了引入 math.js 而不是其他 IPC，此文件可以为空。
// 或者，如果你在 main.js 中根本没有配置 preload，可以忽略此文件。
console.log('Preload script loaded.');