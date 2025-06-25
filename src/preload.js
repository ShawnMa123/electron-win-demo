// src/preload.js
const { contextBridge } = require('electron');
const math = require('mathjs'); // preload.js 可以访问 Node.js 的 require

// contextBridge 用于安全地将选定的 API 暴露给渲染进程
// 我们暴露一个名为 'electronAPI' (你可以选择其他名字) 的对象
// 该对象包含一个名为 'calculate' 的方法
contextBridge.exposeInMainWorld('electronAPI', {
    calculate: (expressionString) => {
        try {
            // 在这里进行实际的计算
            const result = math.evaluate(expressionString);
            // 为了确保返回的是可序列化的简单数据
            let returnValue;
            if (typeof result === 'number') {
                returnValue = parseFloat(result.toPrecision(12)); // 格式化数字
            } else if (result && typeof result.toString === 'function') {
                returnValue = result.toString();
            } else {
                returnValue = String(result); // 尝试转换为字符串
            }
            return { success: true, value: returnValue };
        } catch (error) {
            console.error("Error in preload evaluating expression:", expressionString, error.message);
            return { success: false, error: error.message };
        }
    }
});

console.log('[Preload] electronAPI has been exposed to the renderer process.');