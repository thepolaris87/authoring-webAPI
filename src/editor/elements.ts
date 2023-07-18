import EE from './events';
import Interaction from './interaction';
import { applyStyle, pxToNumber } from './util';

export class BasicElement extends HTMLElement {
    static __name = 'dm-basic';

    __interaction;
    __isEditing = false;

    __removeDrag = () => {};
    __removeRotate = () => {};
    __removeSize = () => {};

    constructor() {
        super();
        this.__interaction = new Interaction();
        this.addEventListener('pointerdown', () => {
            EE.emit('element:select', this);
            EE.emit('element:active', [this]);
        });
    }

    get __flipX() {
        return !((this.style.scale.split(' ')[0] ?? '1') === '1');
    }
    set __flipX(isFlipX: boolean) {
        const flipY = this.__flipY ? '-1' : '1';
        if (isFlipX) this.style.scale = `-1 ${flipY}`;
        else this.style.scale = `1  ${flipY}`;
    }
    get __flipY() {
        return !((this.style.scale.split(' ')[1] ?? '1') === '1');
    }
    set __flipY(isFlipY: boolean) {
        const flipX = this.__flipX ? '-1' : '1';
        if (isFlipY) this.style.scale = `${flipX} -1`;
        else this.style.scale = `${flipX} 1`;
    }

    // INTERACTION
    __addDrag() {
        this.__removeDrag();
        this.__removeDrag = this.__interaction.addDrag(this);
    }
    __addRotate() {
        this.__removeRotate();
        this.__removeRotate = this.__interaction.addRotate(this);
    }
    __addSize() {
        this.__removeSize();
        this.__removeSize = this.__interaction.addSize(this);
    }
    //
    __toData() {}
}

export class WrapElement extends BasicElement {
    // DIGITAL MATH
    static __name = 'dm-wrap';

    constructor() {
        super();
    }

    // DATA
    __toData() {
        const type = `${this.dataset.type}` as keyof TDataMap;
        const key: TDataMap[typeof type] = `__${type}`;
        const elementData = this[key]?.();

        return { id: this.id, ...elementData, cssText: this.style.cssText };
    }
    __textbox() {
        const text = this.querySelector('p')?.innerHTML ?? '';
        return { type: 'textbox', text };
    }
    __image() {
        const src = this.querySelector('img')?.src ?? '';
        return { type: 'image', src };
    }
    __addEditable() {
        this.addEventListener('dblclick', () => {
            if (this.dataset.type !== 'textbox') return;
            this.contentEditable = 'plaintext-only';
            this.__isEditing = true;
        });
        this.addEventListener('blur', () => {
            this.contentEditable = 'inherit';
            this.__isEditing = false;
        });
    }
    // STYLE
    __setTextStyle(cssStyle: { [key in keyof CSSStyleDeclaration]?: string }) {
        if (this.dataset.type !== 'textbox') return;
        const paragraph = this.querySelector('p');
        const selection = document.getSelection();
        if (!paragraph || !selection) return;

        const span = applyStyle(document.createElement('span'), cssStyle);
        const range = selection.getRangeAt(0);
        const selectedContent = range.extractContents();

        if (!selectedContent.textContent) {
            applyStyle(this, cssStyle);
            paragraph.querySelectorAll('span').forEach((s) => applyStyle(s, cssStyle, { value: 'inherit' }));
        } else {
            selectedContent.querySelectorAll('span').forEach((s) => applyStyle(s, cssStyle, { value: 'inherit' }));
            span.appendChild(selectedContent);
            range.insertNode(span);
        }

        // REMOVE EMPTY ELEMENT
        paragraph.querySelectorAll('span').forEach((s) => !s.textContent && s.remove());
    }
}

export class GroupElement extends BasicElement {
    static __name = 'dm-group';

    constructor() {
        super();
    }

    __add(elements: BasicElement | BasicElement[], options?: { hasStyle?: boolean }) {
        this.setAttribute('data-type', 'group');
        const children = (Array.isArray(elements) ? elements : [elements]).reverse();
        const bbox = children.reduce(
            (p, child) => {
                child.__removeDrag();
                child.__removeRotate();
                child.__removeSize();

                const [x1 = 0, y1 = 0] = pxToNumber(child.style.translate);
                const x2 = x1 + child.offsetWidth;
                const y2 = y1 + child.offsetHeight;
                p.x1 = Math.min(p.x1, x1);
                p.y1 = Math.min(p.y1, y1);
                p.x2 = Math.max(p.x2, x2);
                p.y2 = Math.max(p.y2, y2);
                this.prepend(child);

                return p;
            },
            { x1: 9999, y1: 9999, x2: 0, y2: 0 }
        );
        if (!options?.hasStyle) {
            this.style.translate = `${bbox.x1 - 1}px ${bbox.y1 - 1}px`;
            this.style.width = `${bbox.x2 - bbox.x1}px`;
            this.style.height = `${bbox.y2 - bbox.y1}px`;
        }

        children.forEach((child) => {
            const [x = 0, y = 0] = pxToNumber(child.style.translate);
            child.classList.remove('focus');
            child.style.translate = `${x - bbox.x1}px ${y - bbox.y1}px`;
        });
    }

    __ungroup() {
        this.__removeDrag();
        this.__removeRotate();
        this.__removeSize();

        const [dx = 0, dy = 0] = pxToNumber(this.style.translate);
        const children = Array.from(this.children) as (WrapElement | GroupElement)[];

        children.forEach((child) => {
            const [x = 0, y = 0] = pxToNumber(child.style.translate);
            child.__addDrag();
            child.__addRotate();
            child.__addSize();
            child.style.translate = `${x + dx + 1}px ${y + dy + 1}px`;
        });

        return children;
    }

    __toData() {
        const children = Array.from(this.children).reduce((p, child) => {
            if (child instanceof BasicElement) p.push(child.__toData() as unknown as IElementData);
            return p;
        }, [] as IElementData[]);
        return { id: this.id, cssText: this.style.cssText, type: 'group', children };
    }
}
