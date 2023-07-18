type TKeyframes = { [key in keyof CSSStyleDeclaration]?: string };

type TInsert = {
    element: HTMLElement;
    keyframes: { from?: TKeyframes; to?: TKeyframes };
    animation: { duration: string; delay?: string; repeat?: string; mode?: 'foward' | 'backward' | 'both'; easing?: string };
};

// animation-duration: 1s;
// animation-delay: 1s;
// animation-iteration-count: 5;
// animation-fill-mode: forwards;
// animation-timing-function: linear;
