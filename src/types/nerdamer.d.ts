type Operator = '+' | '-' | '*' | '/';

type TStackData = { type: 'pre' | 'post'; operand1: Symbol; operand2: Symbol; operator?: Token; result?: Symbol };

type TStepper = {
    // pre
    pre_add?: (a: Symbol, b: Symbol, e: Token) => void;
    pre_subtract?: (a: Symbol, b: Symbol, e: Token) => void;
    pre_multiply?: (a: Symbol, b: Symbol, e: Token) => void;
    pre_divide?: (a: Symbol, b: Symbol, e: Token) => void;
    pre_pow?: (a: Symbol, b: Symbol, e: Token) => void;
    pre_function_call?: (fname: string, args: any) => void;

    // post
    post_add?: (result: Symbol, a: Symbol, b: Symbol, e: Token) => void;
    post_subtract?: (result: Symbol, a: Symbol, b: Symbol, e: Token) => void;
    post_multiply?: (result: Symbol, a: Symbol, b: Symbol, e: Token) => void;
    post_divide?: (result: Symbol, a: Symbol, b: Symbol, e: Token) => void;
    post_pow?: (result: Symbol, a: Symbol, b: Symbol, e: Token) => void;
    post_function_call?: (f: any, fname: string, args: any) => void;
};

declare class Token {
    static OPERATOR: string;
    static VARIABLE_OR_LITERAL: string;
    static FUNCTION: string;
    static UNIT: string;
    static KEYWORD: string;
    static MAX_PRECEDENCE: number;
    is_prefix: boolean;
    type: string;
    value: string;
    column: number;
    precedence: number;
    leftAssoc: boolean;
    postfix?: boolean;
    action?: string;
    operator?: string;
    prefix?: boolean;
    constructor(node: string, node_type: string, column: number, operator?: any);
    toString(): string;
}

interface Symbol {
    /**
     * Returns vanilla imaginary symbol
     * @returns {Symbol}
     */
    static imaginary(): Symbol;
    /**
     * Return nerdamer's representation of Infinity
     * @param {int} negative -1 to return negative infinity
     * @returns {Symbol}
     */
    static infinity(negative?: any): Symbol;
    static shell(group: any, value: any): Symbol;
    static unwrapSQRT(symbol: any, all: any): any;
    static hyp(a: any, b: any): Symbol;
    static toPolarFormArray(symbol: any): any[];
    static unwrapPARENS(symbol: any): any;
    static create(value: any, power: any): any;
    // constructor(obj: any);
    unit: any;
    group: Groups;
    power: Frac;
    fname: any;
    value: any;
    multiplier: Frac;
    imaginary: boolean | undefined;
    isInfinity: boolean | undefined;
    /**
     * Gets nth root accounting for rounding errors
     * @param {Number} n
     * @return {Number}
     */
    getNth(n: number): number;
    /**
     * Checks if symbol is to the nth power
     * @returns {Boolean}
     */
    isToNth(n: any): boolean;
    /**
     * Checks if a symbol is square
     * @return {Boolean}
     */
    isSquare(): boolean;
    /**
     * Checks if a symbol is cube
     * @return {Boolean}
     */
    isCube(): boolean;
    /**
     * Checks if a symbol is a bare variable
     * @return {Boolean}
     */
    isSimple(): boolean;
    /**
     * Simplifies the power of the symbol
     * @returns {Symbol} a clone of the symbol
     */
    powSimp(): Symbol;
    /**
     * Checks to see if two functions are of equal value
     * @param {Symbol} symbol
     */
    equals(symbol: Symbol): any;
    abs(): Symbol;
    gt(symbol: any): any;
    gte(symbol: any): any;
    lt(symbol: any): any;
    lte(symbol: any): any;
    /**
     * Because nerdamer doesn't group symbols by polynomials but
     * rather a custom grouping method, this has to be
     * reinserted in order to make use of most algorithms. This function
     * checks if the symbol meets the criteria of a polynomial.
     * @param {boolean} multivariate
     * @returns {boolean}
     */
    isPoly(multivariate?: boolean): boolean;
    stripVar(x: any, exclude_x: any): Symbol;
    toArray(v: any, arr: any): any;
    hasFunc(v: any): boolean;
    sub(a: any, b: any): any;
    isMonomial(): boolean;
    isPi(): boolean;
    sign(): 1 | -1;
    isE(): boolean;
    isSQRT(): boolean;
    isConstant(check_all: any, check_symbols: any): boolean;
    isImaginary(): boolean;
    /**
     * Returns the real part of a symbol
     * @returns {Symbol}
     */
    realpart(): Symbol;
    imagpart(): Symbol;
    isInteger(): any;
    isLinear(wrt: any): any;
    /**
     * Checks to see if a symbol has a function by a specified name or within a specified list
     * @param {String|String[]} names
     * @returns {Boolean}
     */
    containsFunction(names: string | string[]): boolean;
    multiplyPower(p2: any): Symbol;
    setPower(p: any, retainSign: any): Symbol;
    /**
     * Checks to see if symbol is located in the denominator
     * @returns {boolean}
     */
    isInverse(): boolean;
    /**
     * Make a duplicate of a symbol by copying a predefined list of items.
     * The name 'copy' would probably be a more appropriate name.
     * to a new symbol
     * @param {Symbol | undefined} c
     * @returns {Symbol}
     */
    clone(c?: Symbol | undefined): Symbol;
    /**
     * Converts a symbol multiplier to one.
     * @param {Boolean} keepSign Keep the multiplier as negative if the multiplier is negative and keepSign is true
     * @returns {Symbol}
     */
    toUnitMultiplier(keepSign?: boolean): Symbol;
    /**
     * Converts a Symbol's power to one.
     * @returns {Symbol}
     */
    toLinear(): Symbol;
    /**
     * Iterates over all the sub-symbols. If no sub-symbols exist then it's called on itself
     * @param {Function} fn
     * @@param {Boolean} deep If true it will itterate over the sub-symbols their symbols as well
     * @param deep
     */
    each(fn: Function, deep: boolean): void;
    /**
     * A numeric value to be returned for Javascript. It will try to
     * return a number as far a possible but in case of a pure symbolic
     * symbol it will just return its text representation
     * @returns {String|Number}
     */
    valueOf(): string | number;
    /**
     * Checks to see if a symbols has a particular variable within it.
     * Pass in true as second argument to include the power of exponentials
     * which aren't check by default.
     * @example let s = _.parse('x+y+z'); s.contains('y');
     * //returns true
     * @param {any} variable
     * @param {boolean} all
     * @returns {boolean}
     */
    contains(variable: any, all: boolean): boolean;
    /**
     * Negates a symbols
     * @returns {boolean}
     */
    negate(): boolean;
    /**
     * Inverts a symbol
     * @param {boolean} power_only
     * @param {boolean} all
     * @returns {boolean}
     */
    invert(power_only: boolean, all: boolean): boolean;
    /**
     * Symbols of group Groups.CP or Groups.PL may have the multiplier being carried by
     * the top level symbol at any given time e.g. 2*(x+y+z). This is
     * convenient in many cases, however in some cases the multiplier needs
     * to be carried individually e.g. 2*x+2*y+2*z.
     * This method distributes the multiplier over the entire symbol
     * @param {boolean} all
     * @returns {Symbol}
     */
    distributeMultiplier(all?: boolean): Symbol;
    /**
     * This method expands the exponent over the entire symbol just like
     * distributeMultiplier
     * @returns {Symbol}
     */
    distributeExponent(): Symbol;
    /**
     * This method will attempt to up-convert or down-convert one symbol
     * from one group to another. Not all symbols are convertible from one
     * group to another however. In that case the symbol will remain
     * unchanged.
     * @param {number} group
     * @param {string} imaginary
     */
    convert(group: number, imaginary?: string): Symbol;
    symbols: {} | undefined;
    length: number | undefined;
    previousGroup: Groups.N | Groups.P | Groups.S | Groups.FN | Groups.PL | Groups.CB | Groups.CP | undefined;
    /**
     * This method is one of the principal methods to make it all possible.
     * It performs cleanup and prep operations whenever a symbols is
     * inserted. If the symbols results in a 1 in a Groups.CB (multiplication)
     * group for instance it will remove the redundant symbol. Similarly
     * in a symbol of group Groups.PL or Groups.CP (symbols glued by multiplication) it
     * will remove any dangling zeroes from the symbol. It will also
     * up-convert or down-convert a symbol if it detects that it's
     * incorrectly grouped. It should be noted that this method is not
     * called directly but rather by the 'attach' method for addition groups
     * and the 'combine' method for multiplication groups.
     * @param {Symbol} symbol
     * @param {String} action
     */
    insert(symbol: Symbol, action: string): Symbol;
    attach(symbol: any): Symbol;
    combine(symbol: any): Symbol;
    /**
     * This method should be called after any major "surgery" on a symbol.
     * It updates the hash of the symbol for example if the fname of a
     * function has changed it will update the hash of the symbol.
     */
    updateHash(): void;
    /**
     * this function defines how every group in stored within a group of
     * higher order think of it as the switchboard for the library. It
     * defines the hashes for symbols.
     * @param {int} group
     */
    keyForGroup(group: any): any;
    /**
     * Symbols are typically stored in an object which works fine for most
     * cases but presents a problem when the order of the symbols makes
     * a difference. This function simply collects all the symbols and
     * returns them as an array. If a function is supplied then that
     * function is called on every symbol contained within the object.
     * @param {Function} fn
     * @param {Object} opt
     * @param {Function} sort_fn
     * @@param {Boolean} expand_symbol
     * @param expand_symbol
     * @returns {Array}
     */
    collectSymbols(fn: Function, opt: Object, sort_fn?: Function, expand_symbol?: boolean): any[];
    /**
     * Returns the latex representation of the symbol
     * @param {String} option
     * @returns {String}
     */
    latex(option: string): string;
    /**
     * Returns the text representation of a symbol
     * @param {String} option
     * @returns {String}
     */
    text(option?: string): string;
    /**
     * Checks if the function evaluates to 1. e.g. x^0 or 1 :)
     * @@param {bool} abs Compares the absolute value
     */
    isOne(abs: any): any;
    isComposite(): boolean;
    isCombination(): boolean;
    lessThan(n: any): any;
    greaterThan(n: any): any;
    /**
     * Get's the denominator of the symbol if the symbol is of class Groups.CB (multiplication)
     * with other classes the symbol is either the denominator or not.
     * Take x^-1+x^-2. If the symbol was to be mixed such as x+x^-2 then the symbol doesn't have have an exclusive
     * denominator and has to be found by looking at the actual symbols themselves.
     */
    getDenom(): any;
    getNum(): any;
    toString(): string;
    /**
     * This method traverses the symbol structure and grabs all the variables in a symbol. The variable
     * names are then returned in alphabetical order.
     * @param {Symbol} obj
     * @param {Boolean} poly
     * @param {Object} vars - An object containing the variables. Do not pass this in as it generated
     * automatically. In the future this will be a Collector object.
     * @returns {String[]} - An array containing variable names
     */
    variables(poly?: boolean, vars?: Object): string[];
    token?: Token;
}
