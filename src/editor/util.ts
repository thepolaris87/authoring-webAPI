import { customAlphabet } from 'nanoid';

// ELEMENT - NUMBER
export const pxToNumber = (px: string) => px.split(' ').map((s) => Number(s.replace('px', ''))) ?? [];
export const degToNumber = (deg: string) => deg.split(' ').map((s) => Number(s.replace('deg', ''))) ?? [];
export const flipToNumber = (flip: boolean) => (flip ? -1 : 1);

// UTIL
export const generateId = () => customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)();

// ELEMENT
export const applyStyle = (element: HTMLElement, cssStyle: { [key in keyof CSSStyleDeclaration]?: string }, options?: { value?: string }) => {
    for (const key in cssStyle) {
        if (Object.prototype.hasOwnProperty.call(cssStyle, key)) {
            element.style[key] = options?.value ?? cssStyle[key] ?? element.style[key];
        }
    }
    return element;
};

export const isInsidePoint = (domRect: DOMRect, x: number, y: number) => {
    return x >= domRect.x && x <= domRect.x + domRect.width && y >= domRect.y && y <= domRect.y + domRect.height;
};

export const isIntersect = (root: HTMLElement, target: HTMLElement) => {
    const rootBox = root.getBoundingClientRect();
    const targetBox = target.getBoundingClientRect();
    return (
        isInsidePoint(rootBox, targetBox.x, targetBox.y) ||
        isInsidePoint(rootBox, targetBox.right, targetBox.y) ||
        isInsidePoint(rootBox, targetBox.x, targetBox.bottom) ||
        isInsidePoint(rootBox, targetBox.right, targetBox.bottom) ||
        isInsidePoint(targetBox, rootBox.x, rootBox.y) ||
        isInsidePoint(targetBox, rootBox.right, rootBox.y) ||
        isInsidePoint(targetBox, rootBox.x, rootBox.bottom) ||
        isInsidePoint(targetBox, rootBox.right, rootBox.bottom) ||
        (((targetBox.x < rootBox.right && targetBox.x > rootBox.x) || (rootBox.x < targetBox.right && rootBox.x > targetBox.x)) &&
            ((targetBox.y < rootBox.bottom && targetBox.y > rootBox.y) || (rootBox.y < targetBox.bottom && rootBox.y > targetBox.y)))
    );
};
