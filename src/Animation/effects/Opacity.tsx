import { useState, useCallback } from 'react';
import { BiPalette, BiTrash } from 'react-icons/bi';
import { Slider } from '../components/Slider';
import { editorAtom, ActiveElementsAtom } from '../../atoms/atoms';
import { useAtomValue } from 'jotai';

export const Opacity = ({ index, animations }: { index: number; animations: any }) => {
    const editor = useAtomValue(editorAtom);
    const activeElements = useAtomValue(ActiveElementsAtom);
    const animationList = Array.from(animations._animations) as any;
    const animation = animationList[index];
    const { delay, duration } = animation.__options;
    const value = (delay + duration - delay) / (Object.keys(animation.__keyframes).length * 1000);
    const [interval, setInterval] = useState(Object.keys(animation.__keyframes).length === 3 ? '1' : String(Math.ceil(value)));

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInterval(e.target.value);
        updateTiming();
    };
    const updateTiming = useCallback(() => {
        const timeline = (animation.effect as KeyframeEffect).getTiming();
        const keyframes = [];
        let t1 = 1000 as number;
        let t2 = t1;
        let flag = true;
        const endTime = (timeline.delay as number) + (timeline.duration as number);

        while (t2 < endTime) {
            t2 = t1 + Number(interval) * 1000;
            t1 = t2;
            flag = !flag;
            keyframes.push({ opacity: Number(flag) });
        }
        (animation.effect as KeyframeEffect).setKeyframes(keyframes);
        animation.__setKeyframes(keyframes, 'blink');
    }, [animation, interval]);
    const setTimeLine = useCallback(
        (startTime: number, endTime: number) => {
            (animation.effect as KeyframeEffect).updateTiming({ delay: startTime * 1000, duration: (endTime - startTime) * 1000 });
            animation.__updateTiming({ delay: startTime * 1000, duration: (endTime - startTime) * 1000 });
            updateTiming();
        },
        [animation, updateTiming]
    );
    const onDelete = () => {
        const effects = editor?.effect(activeElements[0]);
        if (animation) effects?.delete(animation);
    };

    return (
        <div className="flex justify-between items-center mb-1">
            <div className="flex w-[40%] justify-between">
                <span className="flex items-center">
                    <BiPalette className="mr-2" />
                    <h5>Blink</h5>
                </span>
                <span className="flex pr-2">
                    <label className="mr-2">Interval</label>
                    <input
                        name="left"
                        className="rounded-sm px-2 mr-3 w-[80%] shadow-[0_1px_#cdd8dd]"
                        value={interval}
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
