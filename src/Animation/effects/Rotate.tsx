import { useState, useCallback } from 'react';
import { BiPalette, BiTrash } from 'react-icons/bi';
import { Slider } from '../components/Slider';
import { editorAtom } from '../../atoms/atoms';
import { useAtomValue } from 'jotai';
import { TDMElements } from '../../editor/core';

export const Rotate = ({
    index,
    animations,
    activeObj,
    updateElements
}: {
    index: number;
    animations: any;
    activeObj: TDMElements;
    updateElements: () => void;
}) => {
    const editor = useAtomValue(editorAtom);
    const animationList = Array.from(animations._animations) as any;
    const animation = animationList[index];
    const { transform } = animation.__keyframes[0];
    const [rotate, setRotate] = useState(transform.slice(7, -4));

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRotate(e.target.value);
        (animation.effect as KeyframeEffect).setKeyframes({ transform: `rotate(${e.target.value}deg)` });
        animation.__setKeyframes([{ transform: `rotate(${e.target.value}deg)` }]);
    };
    const setTimeLine = useCallback(
        (startTime: number, endTime: number) => {
            (animation.effect as KeyframeEffect).updateTiming({ delay: startTime * 1000, duration: (endTime - startTime) * 1000 });
            animation.__updateTiming({ delay: startTime * 1000, duration: (endTime - startTime) * 1000 });
            updateElements();
        },
        [animation, updateElements]
    );
    const onDelete = () => {
        const effects = editor?.effect(activeObj);
        if (animation) effects?.delete(animation);
    };

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
