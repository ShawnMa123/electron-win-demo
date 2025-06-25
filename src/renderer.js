// src/renderer.js

const display = document.getElementById('display');
let currentExpression = '';

function appendToDisplay(value) {
    if (display.value !== currentExpression && !['+', '-', '*', '/', '(', ')', '.'].includes(value)) {
        // 如果当前显示的是上次计算的结果 (不是正在输入的表达式)
        // 并且新输入的是数字 (而不是操作符或小数点)
        // 则清空当前表达式，开始新的数字输入
        if (!isNaN(parseFloat(display.value)) && !isNaN(parseFloat(value))) {
            currentExpression = '';
        }
    }
    currentExpression += value;
    display.value = currentExpression;
}

function clearDisplay() {
    currentExpression = '';
    display.value = '';
}

function deleteLast() {
    if (currentExpression.length > 0) {
        currentExpression = currentExpression.slice(0, -1);
        display.value = currentExpression;
    }
}

async function calculateResult() {
    if (currentExpression === '') {
        return;
    }

    if (typeof window.electronAPI === 'undefined' || typeof window.electronAPI.calculate !== 'function') {
        display.value = 'Error: API not loaded';
        console.error("window.electronAPI or window.electronAPI.calculate is not available. Check preload.js and main.js webPreferences.");
        currentExpression = '';
        return;
    }

    console.log(`[Renderer] Sending to preload for calculation: ${currentExpression}`);
    const resultObject = await window.electronAPI.calculate(currentExpression); // Preload 通信可以是异步的，虽然这里是同步的
    console.log(`[Renderer] Received from preload:`, resultObject);

    if (resultObject.success) {
        const resultValue = resultObject.value;
        let displayResult;

        // preload.js 中已经处理了数字格式化和 toString()
        if (typeof resultValue === 'number' || typeof resultValue === 'string') {
            displayResult = resultValue.toString();
        } else {
            displayResult = 'Error: Invalid result type';
            console.warn("Renderer received an unexpected result type:", resultValue);
        }

        display.value = displayResult;

        if (displayResult.toLowerCase().includes('error') || displayResult.toLowerCase().includes('invalid')) {
            currentExpression = '';
        } else {
            currentExpression = displayResult; // 将结果作为下一次运算的开始
        }
    } else {
        display.value = 'Error: ' + (resultObject.error || 'Calc failed');
        console.error("Calculation error reported by preload:", resultObject.error);
        currentExpression = '';
    }
}

// 将函数暴露给 HTML 的 onclick 事件 (或者更好的方式是使用 addEventListener)
window.appendToDisplay = appendToDisplay;
window.clearDisplay = clearDisplay;
window.deleteLast = deleteLast;
window.calculateResult = calculateResult;

// 初始清空显示
clearDisplay();
console.log('[Renderer] Renderer script loaded. electronAPI:', window.electronAPI);