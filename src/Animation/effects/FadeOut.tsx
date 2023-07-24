import { useCallback, useMemo } from 'react';
import { BiPalette, BiTrash } from 'react-icons/bi';
import { Slider } from '../components/Slider';
import { ActiveElementsAtom, editorAtom } from '../../atoms/atoms';
import { useAtomValue } from 'jotai';
import classNames from 'classnames';

export const FadeOut = ({ index, animations, play }: { index: number; animations: any; play: boolean }) => {
    const editor = useAtomValue(editorAtom);
    const activeElements = useAtomValue(ActiveElementsAtom);
    const animationList = useMemo(() => Array.from(animations[0]._animations) as any, [animations]);
    const animation = useMemo(() => animationList[index], [animationList, index]);

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
                <Slider setTimeLine={setTimeLine} animation={animation} isPlaying={play} />
                <BiTrash className={classNames('w-[24px] h-[24px] ml-3', play ? 'cursor-not-allowed' : 'cursor-pointer')} onClick={() => !play && onDelete()} />
            </div>
        </div>
    );
};
