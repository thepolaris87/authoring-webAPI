import { useState, useCallback, useEffect, useMemo } from 'react';
import { BiPalette, BiTrash } from 'react-icons/bi';
import { Slider } from '../components/Slider';
import { editorAtom, ActiveElementsAtom } from '../../atoms/atoms';
import { useAtomValue } from 'jotai';

export const Scale = ({ index, animations }: { index: number; animations: any }) => {
    const editor = useAtomValue(editorAtom);
    const activeElements = useAtomValue(ActiveElementsAtom);
    const animationList = useMemo(() => Array.from(animations[0]._animations) as any, [animations]);
    const animation = useMemo(() => animationList[index], [animationList, index]);
    const { scale: _scale } = useMemo(() => animation.__keyframes[0], [animation]);
    const scaleValue = useMemo(() => _scale.split(' '), [_scale]);
    const [scale, setScale] = useState({ x: scaleValue[0], y: scaleValue[1] });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setScale({ ...scale, [e.target.name]: e.target.value });
    };
    const setTimeLine = useCallback(
        (startTime: number, endTime: number) => {
            (animation.effect as KeyframeEffect).updateTiming({ delay: startTime * 1000, duration: (endTime - startTime) * 1000 });
            animation.__updateTiming({ delay: startTime * 1000, duration: (endTime - startTime) * 1000 });
        },
        [animation]
    );
    const onDelete = () => {
        const effects = editor?.effect(activeElements[0]);
        if (animation) effects?.delete(animation);
    };

    useEffect(() => {
        (animation.effect as KeyframeEffect).setKeyframes({ scale: `${scale.x} ${scale.y}` });
        animation.__setKeyframes([{ scale: `${scale.x} ${scale.y}` }]);
    }, [scale, animation]);

    useEffect(() => {
        setScale({ x: scaleValue[0], y: scaleValue[1] });
    }, [animation, scaleValue]);

    return (
        <div className="flex justify-between items-center mb-1">
            <div className="flex w-[40%] justify-between">
                <span className="flex items-center">
                    <BiPalette className="mr-2" />
                    <h5>Scale</h5>
                </span>
                <span className="flex pr-5">
                    <label className="mr-2">x</label>
                    <input
                        name="x"
                        className="rounded-sm px-2 mr-3 w-[80%] shadow-[0_1px_#cdd8dd]"
                        value={scale.x}
                        onChange={(e) => onChange(e)}
                        // disabled={isPlay}
                    />
                    <label className="mr-2">y</label>
                    <input
                        name="y"
                        className="rounded-sm px-2 w-[80%] shadow-[0_1px_#cdd8dd]"
                        value={scale.y}
                        onChange={(e) => onChange(e)}
                        // disabled={isPlay}
                    />
                </span>
            </div>
            <div className="flex w-[60%]">
                <Slider setTimeLine={setTimeLine} animation={animation} />
                <BiTrash className="w-[24px] h-[24px] ml-3 cursor-pointer" onClick={onDelete} />
            </div>
        </div>
    );
};
