class EventEmitter<T extends string = string> {
    listners: Record<string, Function[]> = {};

    on(event: T, fn: (data?: any) => void) {
        if (!this.listners[event]) this.listners[event] = [fn];
        else this.listners[event].push(fn);
    }
    emit(event: T, data?: any) {
        const eventListner = this.listners[event];
        if (eventListner) eventListner.forEach((listner) => listner(data));
    }
    off(evnet: T, fn: Function) {
        const eventListner = this.listners[evnet];
        if (eventListner) this.listners[evnet] = eventListner.filter((listner) => listner !== fn);
    }
    init() {
        this.listners = {};
    }
}

class Observable {
    private observer: Function[] = [];
    subscribe(fn: (data: any) => void) {
        this.observer.push(fn);
    }
    unsubscribe(fn: Function) {
        this.observer.filter((subscribe) => subscribe !== fn);
    }
    notify(data?: any) {
        this.observer.forEach((subscribe) => subscribe(data));
    }
}

class StackObservable extends Observable {
    stack: { elements: IElementData[]; effects: IEffectData[] }[] = [];
    _index = 0;

    get index() {
        return this._index;
    }
    set index(num: number) {
        this._index = Math.min(Math.max(0, num), this.stack.length);
    }

    constructor() {
        super();
    }
}

const EE = new EventEmitter<TEvents>();

export const SO = new StackObservable();

export default EE;
