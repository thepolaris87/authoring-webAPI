import EE, { SO } from './events';
import { BasicElement, GroupElement, WrapElement } from './elements';
import Effects from './effets';
import { generateId, isIntersect } from './util';
import './editor.css';
export type TDMElements = WrapElement | GroupElement;

export default class Editor {
    canvas;
    private _effects: Record<string, Effects> = {};
    private _activeElement: TDMElements[] = [];
    private _stackLoad = false;

    inactiveFocus = () => {};
    inactiveSelection = () => {};
    inactiveStack = () => {};
    inactiveKeyboard = () => {};

    constructor(element: HTMLElement) {
        this.canvas = element;
        this.canvas.classList.add('dm-canvas');
        this.canvas.tabIndex = 0;
        // import('./editor.css');

        // DEFINE CUSTOM Element
        if (!customElements.get(WrapElement.__name)) customElements.define(WrapElement.__name, WrapElement);
        if (!customElements.get(GroupElement.__name)) customElements.define(GroupElement.__name, GroupElement);

        // ACTIVE STATE
        this.inactiveFocus = this.activeFocus();
        this.inactiveSelection = this.activeSelection();
        this.inactiveStack = this.activeStack();
        this.inactiveKeyboard = this.activeKeyboard();
    }

    // ELEMET HANDLER
    add(elements: TDMElements | TDMElements[]) {
        const _elements = Array.isArray(elements) ? elements : [elements];
        _elements.forEach((element) => this.canvas.appendChild(element));
        EE.emit('element:add');
        SO.notify();
    }
    remove(elements: TDMElements | TDMElements[]) {
        const _elements = Array.isArray(elements) ? elements : [elements];
        _elements.forEach((element) => element.remove());
        EE.emit('element:remove');
        SO.notify();
    }
    toGroup(elements: TDMElements | TDMElements[], options?: IGroupElementOptions) {
        const group = this._createGroup(options);
        group.__add(elements, { hasStyle: !!options?.cssText });
        this.add(group);

        if (Array.isArray(elements)) {
            elements.forEach((element) => {
                console.log(this._effects[element.id]);
            });
        }

        EE.emit('element:group');
        SO.notify();
        return group;
    }
    unGroup(element: GroupElement) {
        if (element.dataset.type !== 'group') return;
        const children = element.__ungroup();
        this.add(children);
        this.remove(element);
        EE.emit('element:ungroup');
        SO.notify();
    }

    // ELEMENT CREATOR
    textbox(text: string, options?: ITextboxOptions) {
        const wrap = this._createWrap('textbox', options);

        const paragraph = document.createElement('p');
        paragraph.classList.add('element');
        paragraph.innerHTML = text ?? '';

        wrap.prepend(paragraph);
        wrap.__addEditable();
        return wrap;
    }
    image(url: string, options?: IImageOptions) {
        const wrap = this._createWrap('image', options);

        const img = document.createElement('img');
        img.classList.add('element');
        img.src = url;
        img.draggable = false;

        wrap.prepend(img);

        return wrap;
    }

    // EFFECT - ANIMATION
    effect(element: HTMLElement) {
        console.log(this._effects[element.id]);
        if (element.id in this._effects) return this._effects[element.id];
        const effect = new Effects(element);
        this._effects[element.id] = effect;
        return effect;
    }
    play(element: HTMLElement) {
        return this._effects[element.id]?.play();
    }
    stop(element: HTMLElement) {
        this._effects[element.id]?.cancel();
    }

    // EVENT EMITTER
    on(event: TEvents, listener: (data: any) => void) {
        EE.on(event, listener);
    }
    off(event: TEvents, listner: Function) {
        EE.off(event, listner);
    }
    // emit(event: TEvents, data: any) {
    //     EE.emit(event, data);
    // }

    // IMPORT & EXPORT
    toData() {
        const elements = this.getElements().reduce((p, c) => {
            p.push(c.__toData());
            return p;
        }, [] as IElementData[]);

        const effects = this.getEffects().reduce((p, c) => {
            p.push(c.toData());
            return p;
        }, [] as IEffectData[]);
        return { elements, effects };
    }

    loadFromJSON(json?: any) {
        if (!json) return;
        const data = (typeof json !== 'string' ? json : JSON.parse(json)) as { elements: IElementData[]; effects: IEffectData[] };
        const loadElement = (data: IElementData) => {
            let element;
            if (data.type === 'textbox' && data.text) element = this.textbox(data.text, data);
            if (data.type === 'image' && data.src) element = this.image(data.src, data);
            if (data.type === 'group' && data.children) element = this.toGroup(data.children.map(loadElement) as TDMElements | TDMElements[], data);
            if (element) this.add(element);
            return element;
        };
        const loadEffect = (data: IEffectData) => {
            if (!data.id) return;
            const target = document.getElementById(data.id);
            if (!target) return;
            const effect = this.effect(target);
            data.animation?.forEach((anim) => effect.add({ keyframes: anim.keyframes, options: anim.options }));
        };

        data?.elements?.forEach(loadElement);
        data?.effects?.forEach(loadEffect);
    }

    // UTIL - CLIENT(USER) SIDE
    getActiveElements() {
        return this._activeElement;
    }
    getElements() {
        return Array.from(this.canvas.children) as TDMElements[];
    }
    getEffects() {
        console.log(this._effects);
        return Object.values(this._effects);
    }
    clear() {
        this.remove(this.getElements());
    }
    undo() {
        SO.index -= 1;
        this._stackLoad = true;
        this.clear();
        this.loadFromJSON(SO.stack[SO.index - 1]);
        this._stackLoad = false;
    }
    redo() {
        SO.index += 1;
        this._stackLoad = true;
        this.clear();
        this.loadFromJSON(SO.stack[SO.index - 1]);
        this._stackLoad = false;
    }
    bringToFront(element: HTMLElement) {
        this.canvas.insertAdjacentElement('beforeend', element);
    }
    bringToFoward(element: HTMLElement) {
        if (element.nextSibling) this.canvas.insertBefore(element.nextSibling, element);
    }
    sendToBack(element: HTMLElement) {
        this.canvas.insertAdjacentElement('afterbegin', element);
    }
    sendToBackward(element: HTMLElement) {
        if (element.previousSibling) this.canvas.insertBefore(element, element.previousSibling);
    }
    activeFocus() {
        this.inactiveFocus();
        const pointerdown = (e: PointerEvent) => e.target === this.canvas && EE.emit('element:discardActive');

        this.canvas.addEventListener('pointerdown', pointerdown);

        EE.on('element:active', (elements: TDMElements[]) => {
            this._activeElement = elements;
            this.getElements().forEach((element) => (elements.includes(element) ? element.classList.add('focus') : element.classList.remove('focus')));
        });
        EE.on('element:discardActive', () => {
            this._activeElement = [];
            this.getElements().forEach((element) => element.classList.remove('focus'));
        });

        return () => {
            this.canvas.removeEventListener('pointerdown', pointerdown);
        };
    }
    setActiveFocus(elements: TDMElements[]) {
        this._activeElement = elements;
        this.getElements().forEach((element) => (elements.includes(element) ? element.classList.add('focus') : element.classList.remove('focus')));
    }
    activeSelection() {
        this.inactiveSelection();
        const slelectionClient = { x: 0, y: 0 };
        const selectionElement = document.createElement('div');

        const pointermoveListner = (e: PointerEvent) => {
            const dx = e.clientX - slelectionClient.x;
            const dy = e.clientY - slelectionClient.y;
            if (dx < 0) selectionElement.style.left = e.clientX + 'px';
            if (dy < 0) selectionElement.style.top = e.clientY + 'px';
            selectionElement.style.width = Math.abs(dx) + 'px';
            selectionElement.style.height = Math.abs(dy) + 'px';
        };
        const pointerupListner = () => {
            const targets = this.getElements().filter((element) => isIntersect(selectionElement, element));
            EE.emit('element:active', targets);
            selectionElement.style.width = '0';
            selectionElement.style.height = '0';
            selectionElement.remove();
            document.removeEventListener('pointermove', pointermoveListner);
            document.removeEventListener('pointerup', pointerupListner);
        };
        const pointerdown = (e: PointerEvent) => {
            const targets = this.getActiveElements();
            EE.emit('element:active', targets);
            if (e.target !== this.canvas) return;
            slelectionClient.x = e.clientX;
            slelectionClient.y = e.clientY;

            selectionElement.style.position = 'fixed';
            selectionElement.style.top = slelectionClient.y + 'px';
            selectionElement.style.left = slelectionClient.x + 'px';
            selectionElement.style.border = '1px solid red';
            document.body.appendChild(selectionElement);
            document.addEventListener('pointermove', pointermoveListner);
            document.addEventListener('pointerup', pointerupListner);
        };

        this.canvas.addEventListener('pointerdown', pointerdown);

        return () => {
            selectionElement.remove();
            this.canvas.removeEventListener('pointerdown', pointerdown);
        };
    }
    activeStack() {
        this.inactiveStack();
        const subscribe = () => {
            if (this._stackLoad) return;
            SO.stack = SO.stack.slice(0, SO.index);
            SO.stack.push(this.toData());
            SO.index = SO.stack.length;
        };
        SO.subscribe(subscribe);
        return () => {
            SO.unsubscribe(subscribe);
        };
    }
    activeKeyboard() {
        this.inactiveKeyboard();
        const keydownListner = (e: KeyboardEvent) => {
            const activeElements = this.getActiveElements();
            console.log(activeElements);
        };

        this.canvas.addEventListener('keydown', keydownListner);
        return () => {
            this.canvas.removeEventListener('keydown', keydownListner);
        };
    }

    // UTIL - EDITOR SIDE
    private _createDMElement<T extends BasicElement>(name: string) {
        const dm = document.createElement(name) as T;

        dm.__addDrag();
        dm.__addRotate();
        dm.__addSize();

        return dm;
    }
    private _createWrap(type: string, options?: IWrapElementOptions) {
        const wrap = this._createDMElement<WrapElement>(WrapElement.__name);

        wrap.classList.add('wrap');
        wrap.setAttribute('data-type', type);
        wrap.id = options?.id ?? generateId();
        wrap.style.cssText = options?.cssText ?? '';
        wrap.__flipX = !!options?.flipX;
        wrap.__flipY = !!options?.flipY;

        return wrap;
    }
    private _createGroup(options?: IGroupElementOptions) {
        const group = this._createDMElement<GroupElement>(GroupElement.__name);

        group.classList.add('group');
        group.setAttribute('data-type', 'group');
        group.id = options?.id ?? generateId();
        group.style.cssText = options?.cssText ?? '';
        group.__flipX = !!options?.flipX;
        group.__flipY = !!options?.flipY;

        return group;
    }
}
