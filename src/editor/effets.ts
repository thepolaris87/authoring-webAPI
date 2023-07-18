import Animation from './animation';
import EE from './events';

export default class Effects {
    id;
    element;

    private _animations = new Set<Animation>();
    private _keyframeDefaultOption: KeyframeEffectOptions = { easing: 'linear', fill: 'forwards' };

    constructor(element: Element) {
        this.element = element;
        this.id = element.id ?? '';
    }

    add({ keyframes, options }: { keyframes: Keyframe[] | PropertyIndexedKeyframes; options?: KeyframeEffectOptions }) {
        const animation = new Animation(this.element, keyframes, { ...this._keyframeDefaultOption, ...options });
        this._animations.add(animation);
        EE.emit('effects:add');
        return animation;
    }
    delete(animation?: Animation) {
        if (animation) this._animations.delete(animation);
        else this._animations.clear();
        EE.emit('effects:delete');
    }

    getAnimations() {
        return this._animations;
    }
    toData() {
        const animation = Array.from(this._animations).reduce((p, anim) => {
            p.push({ keyframes: anim.__getKeyframes(), options: anim.__getOptions() });
            return p;
        }, [] as { keyframes: Keyframe[] | PropertyIndexedKeyframes; options: KeyframeEffectOptions }[]);

        return { id: this.id, animation };
    }

    play(options?: { init?: boolean }) {
        this._animations.forEach((anim) => anim.play());
        if (options?.init) this._animations.forEach((anim) => anim.finished.then(() => this.cancel()));
    }
    pause() {
        this._animations.forEach((anim) => anim.pause());
    }
    cancel() {
        this._animations.forEach((anim) => anim.cancel());
    }
    finish() {
        this._animations.forEach((anim) => anim.finish());
    }
    speed(speed: number) {
        this._animations.forEach((anim) => anim.__speed(speed));
    }
    reverse() {
        this._animations.forEach((anim) => anim.reverse());
    }

    // addMove() {}
    // addHidden() {}
    // addVisible() {}
    // addFadeIn() {}
    // addFadeOut() {}
    // addRotate() {}
}
