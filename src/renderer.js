// src/renderer.js
const display = document.getElementById('display');
let currentInput = '';
let operator = null;
let previousInput = '';
let waitingForSecondOperand = false;

function appendToDisplay(value) {
    if (waitingForSecondOperand && isOperator(value)) {
        // 如果已经有一个操作符，并且又输入了一个操作符，则替换它
        // (或者可以选择先计算，这里简单替换)
        if (operator && currentInput === '') { // 允许更改操作符，如 5 + - 2
            operator = value;
            display.value = previousInput + operator;
            return;
        }
    }

    if (waitingForSecondOperand && !isOperator(value)) {
        // 如果我们刚按下一个操作符，现在开始输入第二个操作数
        // 此时 currentInput 应该是空的，或者说 display.value 已经是 previousInput + operator
        // 所以我们直接将新数字附加到 display.value
        currentInput = value; // 重置 currentInput 为新数字的开始
        display.value += value;
        waitingForSecondOperand = false; // 现在我们正在输入第二个操作数
    } else {
        // 正常附加数字或第一个操作符
        currentInput += value;
        display.value += value;
    }

    // 处理操作符的特殊情况
    if (isOperator(value)) {
        if (previousInput && operator && !waitingForSecondOperand && currentInput.length > 1) {
            // e.g., 5 + 3, then user presses *
            // currentInput here is '3*' which is wrong. It should be just '3'
            // or we should calculate first. Let's calculate first.
            const lastCharOfCurrentInput = currentInput.slice(-1); // the operator
            const actualCurrentNumber = currentInput.slice(0, -1); // the number before operator

            if (!isNaN(parseFloat(actualCurrentNumber))) {
                calculate(); // Calculate 5+3
                previousInput = display.value; // Result becomes previousInput
                operator = lastCharOfCurrentInput; // New operator
                currentInput = ''; // Reset currentInput
                display.value += operator;
                waitingForSecondOperand = true;
            } else { // e.g. 5 + * (invalid)
                // remove last operator from display and currentInput
                currentInput = currentInput.slice(0, -1);
                display.value = display.value.slice(0, -1);
                // then set new operator
                operator = value;
                display.value += operator;
                waitingForSecondOperand = true;
            }

        } else if (previousInput === '' && currentInput.length > 1) { // First number and then operator
            operator = value;
            previousInput = currentInput.slice(0, -1); // number part
            currentInput = ''; // operator is handled, reset currentInput for next number
            waitingForSecondOperand = true;
        } else if (previousInput && operator && currentInput === '') { // e.g. 5 + then user presses -
            operator = value; // change operator
            display.value = previousInput + operator; // update display
            // waitingForSecondOperand remains true
        } else {
            // This case might be complex or indicate an edge case not handled.
            // For simplicity, if we hit an operator and don't know what to do,
            // we assume it's the first operator after a number.
            if (currentInput.length > 1) { // Ensure there was a number before operator
                operator = value;
                previousInput = currentInput.slice(0, -1);
                currentInput = '';
                waitingForSecondOperand = true;
            }
        }
    }
}

function isOperator(value) {
    return ['+', '-', '*', '/'].includes(value);
}

function clearDisplay() {
    currentInput = '';
    operator = null;
    previousInput = '';
    display.value = '';
    waitingForSecondOperand = false;
}

function deleteLast() {
    if (display.value.length > 0) {
        const removedChar = display.value.slice(-1);
        display.value = display.value.slice(0, -1);

        if (isOperator(removedChar)) {
            operator = null; // Removed an operator
            // Restore previousInput to currentInput, or handle complex states
            // For simplicity, let's just make currentInput what's left on display if no operator before
            // This part can get tricky to make perfect.
            // A simple approach:
            const lastOpIndex = findLastOperatorIndex(display.value);
            if (lastOpIndex !== -1) {
                previousInput = display.value.substring(0, lastOpIndex);
                operator = display.value[lastOpIndex];
                currentInput = display.value.substring(lastOpIndex + 1);
                waitingForSecondOperand = (currentInput === '');
            } else {
                currentInput = display.value;
                previousInput = '';
                operator = null;
                waitingForSecondOperand = false;
            }

        } else {
            // Removed a digit or a decimal point
            if (currentInput.length > 0) {
                currentInput = currentInput.slice(0, -1);
            } else if (previousInput && operator) {
                // This means we were deleting from the second operand part
                // and currentInput was already representing it implicitly.
                // This logic needs to be robust.
                // For simplicity, if display.value still has an operator,
                // assume currentInput is the part after the last operator.
                const lastOpIndex = findLastOperatorIndex(display.value);
                if (lastOpIndex !== -1) {
                    currentInput = display.value.substring(lastOpIndex + 1);
                } else {
                    currentInput = display.value;
                }
            }
            waitingForSecondOperand = (operator && currentInput === '');
        }
    }
}

function findLastOperatorIndex(str) {
    for (let i = str.length - 1; i >= 0; i--) {
        if (isOperator(str[i])) {
            // Ensure it's not a negative sign at the beginning of a number
            if (i === 0 && str[i] === '-') continue;
            // Or after another operator like 5*-2
            if (i > 0 && isOperator(str[i - 1]) && str[i] === '-') continue;
            return i;
        }
    }
    return -1;
}


function calculateResult() {
    if (!operator || previousInput === '') {
        // If there's no operator or no previous input, do nothing or show error
        // Or if currentInput is empty (e.g. "5+" then "=")
        if (operator && currentInput === '' && previousInput) {
            // e.g. 5+= -> use 5 as second operand
            currentInput = previousInput;
        } else if (!operator && currentInput) {
            // e.g. 5= -> display 5
            display.value = currentInput;
            previousInput = currentInput; // Store for potential chained operations
            currentInput = '';
            operator = null;
            waitingForSecondOperand = false;
            return;
        }
        else {
            return;
        }
    }

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) {
        display.value = 'Error';
        currentInput = '';
        operator = null;
        previousInput = '';
        waitingForSecondOperand = false;
        return;
    }

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                display.value = 'Error: Div by 0';
                currentInput = '';
                operator = null;
                previousInput = '';
                waitingForSecondOperand = false;
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    display.value = result.toString();
    currentInput = result.toString(); // The result is now the current input for further operations
    operator = null;
    previousInput = ''; // Or previousInput = result.toString() if you want to chain: 5+3=8, then +2=10
    waitingForSecondOperand = false;
}


// Expose functions to HTML via window object (since we are not using modules here for simplicity)
// This is necessary because onclick attributes in HTML look for global functions.
window.appendToDisplay = appendToDisplay;
window.clearDisplay = clearDisplay;
window.deleteLast = deleteLast;
window.calculateResult = calculateResult;

// Initial clear
clearDisplay();