// src/renderer.js

const display = document.getElementById('display');
let currentExpression = ''; // 用于存储用户输入的完整表达式

function appendToDisplay(value) {
    // 防止在结果后面直接附加数字，除非是操作符或括号
    // 例如：如果显示的是 "5" (上次计算结果)，用户按 "2"，则应替换为 "2" 而不是 "52"
    // 但如果用户按 "+"，则应为 "5+"
    // 这是一个简单的处理，可以根据需要优化
    if (display.value !== currentExpression && !['+', '-', '*', '/', '(', ')'].includes(value)) {
        if (!isNaN(parseFloat(display.value))) { // 检查显示的是否是数字结果
            currentExpression = ''; // 清空表达式，开始新的输入
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

function calculateResult() {
    if (currentExpression === '') {
        return;
    }

    try {
        // math.js 应该已经通过 index.html 中的 <script> 标签全局加载了
        if (typeof math === 'undefined' || typeof math.evaluate !== 'function') {
            display.value = 'Error: math.js not loaded';
            console.error("math.js is not loaded or math.evaluate is not a function. Please ensure math.js is included correctly in index.html.");
            currentExpression = ''; // 出错后清空表达式
            return;
        }

        // 替换一些用户可能输入的视觉上相似但 math.js 不直接支持的字符
        let expressionToEvaluate = currentExpression;
        // 例子: 如果你想允许中文乘号，可以在这里替换
        // expressionToEvaluate = expressionToEvaluate.replace(/×/g, '*');
        // expressionToEvaluate = expressionToEvaluate.replace(/÷/g, '/');


        const result = math.evaluate(expressionToEvaluate);

        let displayResult;
        if (typeof result === 'number') {
            // 尝试格式化结果以避免非常长的小数或科学计数法 (对于简单计算器)
            // 你可以根据需要调整精度
            if (Number.isFinite(result)) {
                // 对于非常大或非常小的数，toFixed 可能会产生问题或过长的字符串
                // 可以考虑使用 toPrecision 或自定义格式化
                displayResult = parseFloat(result.toPrecision(12)).toString(); // 保留约12位有效数字
            } else {
                displayResult = result.toString(); // Infinity, -Infinity, NaN
            }
        } else if (result && typeof result.toString === 'function') {
            // 对于 BigNumber 或其他 math.js 类型
            displayResult = result.toString();
        } else {
            // 对于函数定义等，这里可能不是期望的结果
            displayResult = 'Error: Invalid expr';
            console.warn("Math.js evaluated to a non-displayable result:", result);
        }

        display.value = displayResult;
        // 计算完成后，将结果设置为当前表达式，方便用户基于结果继续运算
        // 如果结果是错误信息，则不更新 currentExpression，或清空
        if (displayResult.toLowerCase().includes('error') || displayResult.toLowerCase().includes('invalid')) {
            currentExpression = ''; // 出错后清空内部表达式
        } else {
            currentExpression = displayResult;
        }

    } catch (error) {
        display.value = 'Error';
        console.error("Calculation error:", error.message);
        currentExpression = ''; // 出错后清空内部表达式
    }
}

// 将函数暴露给 HTML 的 onclick 事件
window.appendToDisplay = appendToDisplay;
window.clearDisplay = clearDisplay;
window.deleteLast = deleteLast;
window.calculateResult = calculateResult;

// 初始清空显示
clearDisplay();