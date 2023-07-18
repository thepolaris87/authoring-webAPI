const GlobalAnimation = window.Animation;

export default class Animation extends GlobalAnimation {
    constructor(__element: Element, private __keyframes: Keyframe[] | PropertyIndexedKeyframes , private __options: KeyframeEffectOptions) {
        const effect = new KeyframeEffect(__element, __keyframes, __options);
        super(effect, document.timeline);
    }
    __speed(speed: number) {
        this.playbackRate = speed;
    }
    __getKeyframes() {
        return this.__keyframes;
    }
    __getOptions() {
        return this.__options;
    }
}
