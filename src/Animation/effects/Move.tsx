import { useCallback, useEffect, useState } from 'react';
import { BiPalette, BiTrash } from 'react-icons/bi';
import { Slider } from '../components/Slider';
import { editorAtom } from '../../atoms/atoms';
import { useAtomValue } from 'jotai';
import { pxToNumber } from '../../editor/util';
import { TDMElements } from '../../editor/core';

export const Move = ({
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
    const { translate } = animation.__keyframes[0];
    const keyframes = translate.split(' ');
    const [move, setMove] = useState({ left: keyframes[0].slice(0, -2), top: keyframes[0].slice(0, -2) });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMove({ ...move, [e.target.name]: e.target.value });
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

    useEffect(() => {
        if (!activeObj) return;
        const [ox = 0, oy = 0] = pxToNumber(activeObj.style.translate);
        const [dx, dy] = [ox + Number(move.top), oy + Number(move.left)];
        (animation.effect as KeyframeEffect).setKeyframes({ translate: `${dx}px ${dy}px` });
        animation.__setKeyframes([{ translate: `${dx}px ${dy}px` }]);
        updateElements();
    }, [move, activeObj, animation, updateElements]);

    return (
        <div className="flex justify-between items-center mb-1">
            <div className="flex w-[40%] justify-between">
                <span className="flex items-center">
                    <BiPalette className="mr-2" />
                    <h5>Move</h5>
                </span>
                <span className="flex pr-5">
                    <label className="mr-2">x</label>
                    <input
                        name="left"
                        className="rounded-sm px-2 mr-3 w-[80%] shadow-[0_1px_#cdd8dd]"
                        value={move.left}
                        onChange={(e) => onChange(e)}
                        // disabled={isPlay}
                    />
                    <label className="mr-2">y</label>
                    <input
                        name="top"
                        className="rounded-sm px-2 w-[80%] shadow-[0_1px_#cdd8dd]"
                        value={move.top}
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
