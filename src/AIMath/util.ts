export const regExpOerator = /(\+|-|\*|\/)/g;

export const regExpNumber = /\d/g;

export const getOperatorName = (operator: string) => {
    if (operator === '+') return 'add';
    if (operator === '-') return 'substract';
    if (operator === '*') return 'multiply';
    if (operator === '/') return 'divide';
    return '';
};

export const isOperator = (operator: string) => operator.length === 1 && !!operator.match(regExpOerator);

export const splitExpresstionByOperator = (expression: string) => expression.split(regExpOerator).filter(Boolean);

export const findIndex = (expression: string, col: number) => {
    if (!col) return -1;
    const splitExp = splitExpresstionByOperator(expression);
    let curIndex = 0;
    let curSearch = 0;

    splitExp.some((exp) => {
        curSearch += exp.length;
        if (curSearch >= col) {
            return true;
        } else {
            curIndex += 1;
            return false;
        }
    });
    return curIndex;
};
