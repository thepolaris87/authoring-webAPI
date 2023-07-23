import { useState, useCallback, useMemo, useEffect } from 'react';
import { BiPalette, BiTrash } from 'react-icons/bi';
import { Slider } from '../components/Slider';
import { editorAtom, ActiveElementsAtom } from '../../atoms/atoms';
import { useAtomValue } from 'jotai';

export const Rotate = ({ index, animations }: { index: number; animations: any }) => {
    const editor = useAtomValue(editorAtom);
    const activeElements = useAtomValue(ActiveElementsAtom);
    const animationList = useMemo(() => Array.from(animations[0]._animations) as any, [animations]);
    const animation = useMemo(() => animationList[index], [animationList, index]);
    const { rotate: angle } = animation.__keyframes[0];
    const [rotate, setRotate] = useState(String(angle.slice(0, -3)));

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRotate(e.target.value);
        (animation.effect as KeyframeEffect).setKeyframes({ rotate: `${e.target.value}deg` });
        animation.__setKeyframes([{ rotate: `${e.target.value}deg` }]);
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
        const value = angle;
        setRotate(String(value.slice(0, -3)));
    }, [animation, angle]);

    return (
        <div className="flex justify-between items-center mb-1">
            <div className="flex w-[40%] justify-between">
                <span className="flex items-center">
                    <BiPalette className="mr-2" />
                    <h5>Rotate</h5>
                </span>
                <span className="flex pr-2">
                    <label className="mr-2">angle</label>
                    <input
                        name="left"
                        className="rounded-sm px-2 mr-3 w-[80%] shadow-[0_1px_#cdd8dd]"
                        value={rotate}
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
