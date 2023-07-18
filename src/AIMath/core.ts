import nerdamer from '../jiggzson-nerdamer';
import Renderer from './renderer';
import Stack from './stack';
import { getOperatorName, isOperator, splitExpresstionByOperator } from './util';

// addend / minuend / subtrahend / multiplier / mutilplicand / dvidend / divisor / regroup

type TSmallStep = { regroup?: string; result: string; addend1: string; addend2: string };
// const latexRegexp = /\\times|\\div|\\frac{(\d+)}{(\d+)}|\\left|\\right/g;

export default class AIMath {
    expression;
    Stack;
    Renderer;

    constructor({ expression }: { expression: string }) {
        this.expression = expression;
        this.Stack = new Stack();
        this.Renderer = new Renderer();

        nerdamer.addStepper(this.Stack.stepper);

        nerdamer(expression);
    }

    // static convertLatex(latex: string) {
    //     const replacer = (match: string, p1: string, p2: string) => {
    //         if (match === '\\times') return '*';
    //         if (match === '\\div') return '/';
    //         if (match === '\\left') return '';
    //         if (match === '\\right') return '';
    //         if (match.includes('\\frac')) return `${p1}/${p2}`;
    //         return '';
    //     };

    //     return latex.replace(latexRegexp, replacer);
    // }

    initialize() {
        this.Stack.init();
    }

    getStack() {
        return this.Stack.get();
    }

    getSmallStep() {
        const stack = this.getStack();

        const smallStep = stack.reduce((p, c) => {
            if (c.type !== 'post') return p;
            const step = this.createSmallStep(c);
            return [...p, ...step];
        }, [] as TSmallStep[]);

        return smallStep;
    }

    createSmallStep(stack: TStackData) {
        const smallStep: TSmallStep[] = [];
        const { operand1, operand2, operator } = stack;
        const addend1 = operand1.toString();
        const addend2 = operand2.toString();

        if (operator?.operator === '+') {
            const len = Math.max(addend1.length, addend2.length);
            const filledAddend1 = addend1.padStart(len, ' ');
            const filledAddend2 = addend2.padStart(len, ' ');

            for (let index = len - 1; index > -1; index--) {
                const { regroup = '0', result: _result = '' } = smallStep.slice().pop() ?? {};
                const _addend1 = Number(filledAddend1.charAt(index));
                const _addend2 = Number(filledAddend2.charAt(index));
                const result = (_addend1 + _addend2 + Number(regroup)).toString();
                const step: TSmallStep = { addend1: filledAddend1, addend2: filledAddend2, result: (result.slice(-1) + _result.trim()).padStart(len, ' ') };

                if (result.length === 2) {
                    const regroup = result.charAt(0);
                    step.regroup = regroup;
                    if (index === 0) step.result = regroup + step.result;
                }

                smallStep.push(step);
            }
        }

        return smallStep;
    }

    renderExpression(expression: string, _opt?: object) {
        const container = document.createElement('p');
        const outter: HTMLElement[] = [];
        const inner: HTMLElement[] = [];
        const splitExp = splitExpresstionByOperator(expression);
        // 각각의 수/기호를 span으로 append
        splitExp.forEach((exp) => {
            const _outter = document.createElement('span');
            _outter.classList.add('outter');

            exp.split('').forEach((_str) => {
                const str = _str.trim();
                const _inner = document.createElement('span');
                _inner.classList.add('inner');
                const classNames = [];

                if (str === '') {
                    classNames.push('empty', 'number');
                } else if (isOperator(str)) {
                    classNames.push('operator', getOperatorName(str));
                } else {
                    classNames.push('number', str);
                    _inner.textContent = str;
                }
                _inner.classList.add(...classNames.filter(Boolean));

                inner.push(_inner);
                _outter.appendChild(_inner);
            });
            outter.push(_outter);
            container.appendChild(_outter);
        });

        document.body.appendChild(container);

        return { container, outter, inner };
    }
}
