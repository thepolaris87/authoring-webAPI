const GlobalAnimation = window.Animation;

export default class Animation extends GlobalAnimation {
    constructor(__element: Element, private __keyframes: Keyframe[] | PropertyIndexedKeyframes, private __options: KeyframeEffectOptions) {
        const effect = new KeyframeEffect(__element, __keyframes, __options);
        super(effect, document.timeline);
        Object.setPrototypeOf(this, Animation.prototype);
    }
    __speed(speed: number) {
        this.playbackRate = speed;
    }
    __getKeyframes() {
        return this.__keyframes;
    }
    __updateTiming(data: EffectTiming | OptionalEffectTiming) {
        this.effect?.updateTiming(data as OptionalEffectTiming);
        this.__options = { ...this.__options, ...data };
    }
    __setKeyframes(data: Keyframe[] | PropertyIndexedKeyframes, option?: string) {
        (this.effect as KeyframeEffect)?.setKeyframes(data);
        if (option) this.__keyframes = { ...data };
        else this.__keyframes = { ...this.__keyframes, ...data };
    }
    __getOptions() {
        return this.__options;
    }
}
