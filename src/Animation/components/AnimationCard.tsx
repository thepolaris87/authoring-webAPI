import { useState, useRef, useEffect, useMemo } from 'react';
import { MdChevronRight, MdKeyboardArrowDown } from 'react-icons/md';
import { FadeIn, FadeOut, Move, Rotate, Scale, Opacity } from '../effects';
import { ActiveElementsAtom, editorAtom } from '../../atoms/atoms';
import { useAtomValue, useAtom } from 'jotai';

export const AnimationCard = ({ element, effects, animations }: AnimationCardProps) => {
    const editor = useAtomValue(editorAtom);
    const [activeElements, setActiveElements] = useAtom(ActiveElementsAtom);
    const [open, setOpen] = useState(true);
    const [dropDown, setDropDown] = useState(false);
    const [_effect, setEffect] = useState('');
    const [play, setPlay] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const elements = editor?.getElements();
    const el = useMemo(() => elements?.filter((_element) => _element.id === element.id), [element.id, elements]);
    const _effects = useMemo(() => effects.filter((effect) => effect.id === element.id), [element.id, effects]);
    const _animations = animations && _effects[0] && animations.filter((animation: IEffectData) => animation.id === _effects[0].id);
    const effectList = ['Fade In', 'Fade Out', 'Blink', 'Move', 'Scale', 'Rotate']; // Sound

    const onClickDropDown = (effect: string) => {
        setDropDown(false);
        setEffect(effect);
        const s = editor?.getActiveElements();
        if (!s) return;
        const effects = editor?.effect(s[0]);
        if (effect === 'Fade In') effects?.addFadeIn();
        if (effect === 'Fade Out') effects?.addFadeOut();
        if (effect === 'Move') effects?.addMove(s);
        if (effect === 'Rotate') effects?.addRotate();
        if (effect === 'Scale') effects?.addScale();
        if (effect === 'Blink') effects?.addBlink();
    };
    const onClick = () => {
        if (!el) return;
        editor?.setActiveFocus(el);
        setActiveElements(el);
    };
    const onPlay = async () => {
        setPlay(true);
        if (el) {
            await editor?.play(el[0]);
            setPlay(false);
        }
    };
    const onStop = () => {
        setPlay(false);
        if (el) editor?.stop(el[0]);
    };

    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) setDropDown(false);
        });
    }, [inputRef]);

    return (
        <div
            className="rounded-[8px] mb-4 p-[4px_10px] shadow-[1px_3px_5px_1px_#cdd8dd] cursor-grab"
            style={{
                backgroundColor: activeElements[0] && activeElements[0].id === element.id ? '#d3d1d1bf' : '#ecebeb'
            }}
            onClick={onClick}
        >
            <div className="flex justify-between">
                <h5 className="text-[20px] font-[500]">{element.type}</h5>
                <span className="relative">
                    <input
                        type="button"
                        className="w-[500px] rounded-sm shadow-[1px_3px_5px_1px_#cdd8dd] bg-[white] cursor-pointer ml-2 p-[3px] hover:shadow-[0px_1px_5px_1px_#50bcdf]"
                        onClick={() => setDropDown(!dropDown)}
                        value={_effect ? _effect : 'Select animation'}
                        ref={inputRef}
                        // disabled={isPlay || isPlaying}
                    ></input>
                    {dropDown && (
                        <ul className="bg-[white] w-[500px] shadow-[1px_1px_3px_1px_#cdd8dd] text-center cursor-pointer absolute top-0 ml-2 z-20">
                            {effectList.map((effect, index) => {
                                return (
                                    <li key={index} className="hover:bg-[#d9edf4]" onClick={() => onClickDropDown(effect)}>
                                        {effect}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <button className="flex items-center my-4" onClick={() => setOpen(!open)}>
                    {!open ? <MdChevronRight className="w-[24px] h-[24px]" /> : <MdKeyboardArrowDown className="w-[24px] h-[24px]" />}
                    <h5 className="text-[18px]">effects</h5>
                </button>
                {_effects[0] && _effects[0].animation.length !== 0 && !play ? (
                    <button className="bg-[orange] text-[white] p-[4px_12px] rounded-[8px] hover:bg-[#FFB129]" onClick={() => onPlay()}>
                        Play
                    </button>
                ) : (
                    play && (
                        <button className="bg-[#ff3705] text-[white] p-[4px_12px] rounded-[8px] hover:bg-[#ff3705d1]" onClick={() => onStop()}>
                            Stop
                        </button>
                    )
                )}
            </div>
            {open &&
                _effects.map((effect) =>
                    effect.animation.map((_effect, index: number) => {
                        return (
                            <div key={index} className="p-[4px]">
                                {_effect.options.type === 'fadeIn' && <FadeIn key={index} index={index} animations={_animations[0]} />}
                                {_effect.options.type === 'move' && <Move key={index} index={index} animations={_animations[0]} />}
                                {_effect.options.type === 'fadeOut' && <FadeOut key={index} index={index} animations={_animations[0]} />}
                                {_effect.options.type === 'rotate' && <Rotate key={index} index={index} animations={_animations[0]} />}
                                {_effect.options.type === 'scale' && <Scale key={index} index={index} animations={_animations[0]} />}
                                {_effect.options.type === 'blink' && <Opacity key={index} index={index} animations={_animations[0]} />}
                            </div>
                        );
                    })
                )}
        </div>
    );
};
