import Animation from './animation';
import { TDMElements } from './core';
import EE from './events';
import { pxToNumber } from './util';

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
        if (animation) this._animations.delete(animation); // element의 특정 애니메이션 삭제
        else this._animations.clear(); // element의 전체 애니메이션 삭제
        EE.emit('effects:delete');
    }
    getAnimations() {
        return this._animations;
    }
    toData() {
        console.log(this._animations);
        const animation = Array.from(this._animations).reduce((p, anim) => {
            p.push({ keyframes: anim?.__getKeyframes(), options: anim.__getOptions() });
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
    addMove(s: TDMElements[]) {
        const [ox = 0, oy = 0] = pxToNumber(s[0].style.translate);
        const [dx, dy] = [ox + 100, oy + 100];
        const keyframes = [{ translate: `${dx}px ${dy}px` }];
        const options: KeyframeEffectOptions = { type: 'move', duration: 1000, delay: 0 };
        const animation = new Animation(this.element, keyframes, { ...this._keyframeDefaultOption, ...options });
        this._animations.add(animation);
        EE.emit('effects:add');
        return animation;
    }
    addFadeIn() {
        const keyframes = [{ opacity: '0' }, { opacity: '1' }];
        const options: KeyframeEffectOptions = { type: 'fadeIn', duration: 1000, delay: 0 };
        const animation = new Animation(this.element, keyframes, { ...this._keyframeDefaultOption, ...options });
        this._animations.add(animation);
        EE.emit('effects:add');
        return animation;
    }
    addFadeOut() {
        const keyframes = [{ opacity: '1' }, { opacity: '0' }];
        const options: KeyframeEffectOptions = { type: 'fadeOut', duration: 1000, delay: 0 };
        const animation = new Animation(this.element, keyframes, { ...this._keyframeDefaultOption, ...options });
        this._animations.add(animation);
        EE.emit('effects:add');
        return animation;
    }
    addRotate() {
        const keyframes = [{ transform: 'rotate(90deg)' }];
        const options: KeyframeEffectOptions = { type: 'rotate', duration: 1000, delay: 0 };
        const animation = new Animation(this.element, keyframes, { ...this._keyframeDefaultOption, ...options });
        this._animations.add(animation);
        EE.emit('effects:add');
        console.log(this._animations, animation);
        return animation;
    }
    addScale() {
        const keyframes = [{ transform: 'scale(3,3)' }];
        const options: KeyframeEffectOptions = { type: 'scale', duration: 1000, delay: 0 };
        const animation = new Animation(this.element, keyframes, { ...this._keyframeDefaultOption, ...options });
        this._animations.add(animation);
        EE.emit('effects:add');
        return animation;
    }
    // addVisible() {}
}
