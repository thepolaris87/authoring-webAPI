import { useCallback } from 'react';
import { BiPalette, BiTrash } from 'react-icons/bi';
import { Slider } from '../components/Slider';
import { ActiveElementsAtom, editorAtom } from '../../atoms/atoms';
import { useAtomValue } from 'jotai';

export const FadeOut = ({ index, animations }: { index: number; animations: any }) => {
    const editor = useAtomValue(editorAtom);
    const activeElements = useAtomValue(ActiveElementsAtom);
    const animationList = Array.from(animations._animations) as any;
    const animation = animationList[index];

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

    return (
        <div className="flex justify-between items-center mb-1">
            <span className="flex w-[40%] items-center">
                <BiPalette className="mr-2" />
                <h5>Fade Out</h5>
            </span>
            <div className="flex w-[60%]">
                <Slider setTimeLine={setTimeLine} animation={animation} />
                <BiTrash className="w-[24px] h-[24px] ml-3 cursor-pointer" onClick={onDelete} />
            </div>
        </div>
    );
};
