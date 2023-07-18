export default class Stack {
    private _stack: TStackData[] = [];

    readonly stepper: Partial<Pick<TStepper, keyof TStepper>> = {
        pre_add: (operand1, operand2, operator) => this.add({ type: 'pre', operand1, operand2, operator }),
        pre_subtract: (operand1, operand2,operator) => this.add({ type: 'pre', operand1, operand2, operator }),
        pre_multiply: (operand1,operand2, operator) => this.add({ type: 'pre', operand1, operand2, operator }),
        pre_divide: (operand1, operand2, operator) => this.add({ type: 'pre', operand1, operand2, operator }),
        // pre_pow: (a, b) => Stack.add({ type: 'pre', operand1: a, operand2: b, operator: '^' }),
        // pre_function_call: (fname, args) => console.log('The function ' + fname + ' was called with arguments ' + args),
        post_add: (result, operand1, operand2, operator) => this.add({ type: 'post', result, operand1, operand2, operator }),
        post_subtract: (result, operand1, operand2, operator) => this.add({ type: 'post', result, operand1, operand2, operator }),
        post_multiply: (result, operand1, operand2, operator) => this.add({ type: 'post', result, operand1, operand2, operator }),
        post_divide: (result, operand1, operand2, operator) => this.add({ type: 'post', result, operand1, operand2, operator })
        // post_pow: (result, a, b) => Stack.add({ type: 'post', result, operand1: a, operand2: b, operator: '^' }),
        // post_function_call: (f) => console.log('Afterwards this resulted in ' + f + '\n')
    };

    get() {
        return this._stack;
    }

    init() {
        this._stack = [];
    }

    add(data: TStackData) {
        this._stack.push(data);
    }
}
