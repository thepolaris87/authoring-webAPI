type TElements = {
    id: string;
    type: string;
    src?: string;
    text?: string;
    cssText: string;
};

type TKeyFrames = {
    opacity?: string;
    translate?: string;
};

type TAnimation = {
    keyframes: TKeyFrames[];
    options: {
        duration: number;
        easing: string;
        fill: string;
        delay: number;
        type: TEffect;
    };
};

type TEffectList = {
    id: string;
    animation: TAnimation[];
};

type TData = {
    effects: TeffectList[];
    elements: TElements[];
};

type AnimationCardProps = {
    element: TElements;
    effects: TEffectList[];
    animations: IEffectData[];
    setActiveObj: (value: TDMElements) => void;
    activeObj: TDMElements;
    updateElements: () => void;
};

type SliderProps = {
    setTimeLine: (value1: number, value2: number) => void;
    objectId?: string;
    isPlaying?: boolean;
    animation: any;
};

type InputProps = { value: number; setTime: () => void; setValue: (value: number) => void; isPlaying?: boolean; flag: boolean };
