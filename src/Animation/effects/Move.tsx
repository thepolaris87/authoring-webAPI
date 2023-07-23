import { useCallback, useEffect, useState, useMemo } from 'react';
import { BiPalette, BiTrash } from 'react-icons/bi';
import { Slider } from '../components/Slider';
import { editorAtom, ActiveElementsAtom } from '../../atoms/atoms';
import { useAtomValue } from 'jotai';
import { pxToNumber } from '../../editor/util';

export const Move = ({ index, animations }: { index: number; animations: any }) => {
    const editor = useAtomValue(editorAtom);
    const activeElements = useAtomValue(ActiveElementsAtom);
    const animationList = useMemo(() => Array.from(animations[0]._animations) as any, [animations]);
    const animation = useMemo(() => animationList[index], [animationList, index]);
    const { translate } = useMemo(() => animation.__keyframes[0], [animation]);
    const keyframes = useMemo(() => translate.split(' '), [translate]);
    const [move, setMove] = useState({ left: keyframes[0].slice(0, -2), top: keyframes[0].slice(0, -2) });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMove({ ...move, [e.target.name]: e.target.value });
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
    const updateMove = useCallback(() => {
        if (!activeElements) return;
        const [ox = 0, oy = 0] = pxToNumber(activeElements[0].style.translate);
        const [dx, dy] = [ox + Number(move.top), oy + Number(move.left)];
        (animation.effect as KeyframeEffect).setKeyframes({ translate: `${dx}px ${dy}px` });
        animation.__setKeyframes([{ translate: `${dx}px ${dy}px` }]);
    }, [animation, activeElements, move]);

    useEffect(() => {
        updateMove();
    }, [move, updateMove]);

    useEffect(() => {
        const addElementListener = () => {
            updateMove();
        };
        editor?.on('element:drag:end', addElementListener);
        return () => {
            editor?.off('element:drag:end', addElementListener);
        };
    }, [editor, updateMove]);

    useEffect(() => {
        setMove({ left: keyframes[0].slice(0, -2), top: keyframes[0].slice(0, -2) });
    }, [animation, keyframes]);

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
