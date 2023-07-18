import nerdamer from './nerdamer.core';
// import './Calculus';
// import './Algebra';
// import './Solve';
// import './Extra';

export const addStepper = (stepper: TStepper) => {
    const { PARSER: _ } = nerdamer.getCore(),
        stack: string[] = [];
    //nerdamer makes recursive calls when adding, subtracting, etc.
    //Making sure the stack is clear ensures that we're at the first call a function to add calls to the stack
    const wrapper = (f: Function) => {
        stack.push('lock');
        const r = f();
        stack.pop();
        return r;
    };
    //This logging function makes sure that there aren't any items on the stack before logging
    const logger = (f?: Function, ...args: any) => {
        if (stack.length === 0) f?.apply(undefined, ...args);
    };

    //the semi-globals
    const add = _.add,
        subtract = _.subtract,
        divide = _.divide,
        multiply = _.multiply,
        pow = _.pow,
        fcall = _.callfunction;

    //ADD
    const step_add = (a: Symbol, b: Symbol, e: Token) => {
        logger(stepper.pre_add, a, b, e);

        const result = wrapper(() => add.call(_, a.clone(), b.clone()));

        logger(stepper.post_add, result, a, b, e);

        return result;
    };
    _.add = step_add;
    //SUBTRACT
    const step_subtract = (a: Symbol, b: Symbol, e: Token) => {
        logger(stepper.pre_subtract, a, b, e);

        const result = wrapper(() => subtract.call(_, a.clone(), b.clone()));

        logger(stepper.post_subtract, result, a, b, e);

        return result;
    };
    _.subtract = step_subtract;
    //DIVIDE
    const step_divide = (a: Symbol, b: Symbol, e: Token) => {
        logger(stepper.pre_divide, a, b, e);

        const result = wrapper(() => divide.call(_, a.clone(), b.clone()));

        logger(stepper.post_divide, result, a, b, e);

        return result;
    };
    _.divide = step_divide;
    //MULTIPLY
    const step_multiply = (a: Symbol, b: Symbol, e: Token) => {
        logger(stepper.pre_multiply, a, b, e);

        const result = wrapper(() => multiply.call(_, a.clone(), b.clone()));

        logger(stepper.post_multiply, result, a, b, e);

        return result;
    };
    _.multiply = step_multiply;
    //POW
    const step_pow = (a: Symbol, b: Symbol, e: Token) => {
        logger(stepper.pre_pow, a, b, e);

        const result = wrapper(() => pow.call(_, a.clone(), b.clone()));

        logger(stepper.post_pow, result, a, b, e);

        return result;
    };
    _.pow = step_pow;
    //CALLFUNCTION
    //function calls are not recursive and can have more than one call on the stack
    //because of this we don't use the wrapper
    const step_fcall = (fname: any, args: any) => {
        if (stepper.pre_function_call && typeof stepper.pre_function_call === 'function') stepper.pre_function_call(fname, args);

        const f = fcall.call(_, fname, args);

        if (stepper.post_function_call && typeof stepper.post_function_call === 'function') stepper.post_function_call(f, fname, args);

        return f;
    };
    _.callfunction = step_fcall;
};

nerdamer.addStepper = addStepper;

export default nerdamer;
