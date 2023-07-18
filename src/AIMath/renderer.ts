export default class Renderer {
    latexRegExp = /(\+|\-|\\times|\\div|\\frac{\d+}{\d+})|\\left(\()|\\right(\))/g;

    constructor() {}

    latex(latex: string) {
        const container = this.createContainer();
        const latexArray = latex.split(this.latexRegExp).filter(Boolean);
        let col = 1;

        latexArray.forEach((latex) => {
            const wrapper = document.createElement('span');
            const isOperator = this._isOperator(latex);
            const isBracket = this._isBracket(latex);

            if (isOperator) {
                wrapper.classList.add('operator');
                const operatorName = this._getOperatorName(latex);
                const inner = document.createElement('span');
                inner.classList.add(`col-${col}`, operatorName);
                wrapper.appendChild(inner);
                col += 1;
            } else if (isBracket) {
                wrapper.classList.add('bracket', latex === '(' ? 'op' : 'cl');
                const inner = document.createElement('span');
                inner.classList.add(`col-${col}`);
                wrapper.appendChild(inner);
                col += 1;
            } else {
                wrapper.classList.add('number');
                const isFraction = this._isFraction(latex);

                if (isFraction) {
                    wrapper.classList.add('fraction');
                    latex
                        .split(/\\frac{(\d+)}{(\d+)}/g)
                        .filter(Boolean)
                        .forEach((_num) => {
                            const _inner = document.createElement('span');
                            _num.split('').forEach((num) => {
                                const inner = document.createElement('span');
                                inner.classList.add(`col-${col}`);
                                inner.textContent = num;
                                _inner.appendChild(inner);
                                col += 1;
                            });
                            wrapper.appendChild(_inner);
                        });
                } else {
                    latex.split('').forEach((num) => {
                        const inner = document.createElement('span');
                        inner.classList.add(`col-${col}`);
                        inner.textContent = num;
                        col += 1;
                        wrapper.appendChild(inner);
                    });
                }
            }

            container.appendChild(wrapper);
        });

        let opIndex: number[] = [];
        let clIndex: number[] = [];

        const children = Array.from(container.children);

        children.forEach((child, i) => {
            if (child.classList.contains('bracket')) {
                if (child.classList.contains('op')) opIndex.push(i);
                if (child.classList.contains('cl')) clIndex.push(i);

                if (opIndex.length === clIndex.length) {
                    opIndex.forEach((op_i, i) => {
                        const cl_i = clIndex[opIndex.length - i - 1];
                        const targets = children.slice(op_i, cl_i + 1);
                        const hasFraction = targets.some((child) => child.classList.contains('fraction'));
                        if (hasFraction) {
                            targets[0].classList.remove('bracket');
                            targets[0].classList.add('bracket-frac');
                            targets.slice(-1)[0].classList.remove('bracket');
                            targets.slice(-1)[0].classList.add('bracket-frac');
                        }
                    });

                    opIndex.length = 0;
                    clIndex.length = 0;
                }
            }
        });

        return container;
    }

    createContainer() {
        const container = document.createElement('p');
        container.classList.add('container', 'flex', 'items-center');
        return container;
    }

    private _isOperator(latex: string) {
        return ['\\times', '\\div', '+', '-'].includes(latex);
    }
    private _getOperatorName(latex: string) {
        if (latex === '\\times') return 'multiply';
        if (latex === '\\div') return 'divide';
        if (latex === '+') return 'add';
        if (latex === '-') return 'substract';
        return '';
    }
    private _isFraction(latex: string) {
        return latex.includes('\\frac');
    }
    private _isBracket(latex: string) {
        return ['(', ')', '{', '}', '[', ']'].includes(latex);
    }
}
