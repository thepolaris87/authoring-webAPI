// Editor
interface IElementOptions {
    id?: string;
    cssText?: string;
    flipX?: boolean;
    flipY?: boolean;
}

interface IWrapElementOptions extends IElementOptions {}

interface ITextboxOptions extends IElementOptions {}

interface IImageOptions extends IElementOptions {}

interface IGroupElementOptions extends IElementOptions {}

interface IElementData {
    id?: string;
    text?: string;
    type?: string;
    cssText?: string;
    src?: string;
    filpX?: boolean;
    flipY?: boolean;
    children?: IElementData[];
}

interface IEffectData {
    id?: string;
    animation?: { keyframes: Keyframe[] | PropertyIndexedKeyframes; options: KeyframeEffectOptions }[];
}

type TDataMap = { textbox: '__textbox'; image: '__image' };

// Event Emitter
// basic
type TBasic = 'element:select' | 'element:add' | 'element:remove' | 'element:group' | 'element:ungroup';
// focus
type TFocus = 'element:active' | 'element:discardActive';
// interaction
type TDrag = 'element:drag' | 'element:drag:end';
type TRotate = 'element:rotate' | 'element:rotate:end';
type TSize = 'element:size' | 'element:size:end';
// effects
type TEffects = 'effects:add' | 'effects:delete';
// stack
type TStack = 'stack';

type TEvents = TBasic | TFocus | TDrag | TRotate | TSize | TEffects | TStack;
