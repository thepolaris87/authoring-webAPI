import { useState, useCallback, useMemo, useEffect } from 'react';
import { BiPalette, BiTrash } from 'react-icons/bi';
import { Slider } from '../components/Slider';
import { editorAtom, ActiveElementsAtom } from '../../atoms/atoms';
import { useAtomValue } from 'jotai';
import classNames from 'classnames';

export const Opacity = ({ index, animations, play }: { index: number; animations: any; play: boolean }) => {
    const editor = useAtomValue(editorAtom);
    const activeElements = useAtomValue(ActiveElementsAtom);
    const animationList = useMemo(() => Array.from(animations[0]._animations) as any, [animations]);
    const animation = useMemo(() => animationList[index], [animationList, index]);
    const { interval: _interval } = useMemo(() => animation.__options, [animation]);
    const [interval, setInterval] = useState(_interval ? _interval : '1');

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInterval(e.target.value);
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

    useEffect(() => {
        setInterval(_interval ? _interval : '1');
    }, [animation, _interval]);

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
                        name="interval"
                        className="rounded-sm px-2 mr-3 w-[80%] shadow-[0_1px_#cdd8dd]"
                        value={interval}
                        onChange={(e) => onChange(e)}
                        disabled={play}
                    />
                </span>
            </div>
            <div className="flex w-[60%]">
                <Slider setTimeLine={setTimeLine} animation={animation} isPlaying={play} />
                <BiTrash className={classNames('w-[24px] h-[24px] ml-3', play ? 'cursor-not-allowed' : 'cursor-pointer')} onClick={() => !play && onDelete()} />
            </div>
        </div>
    );
};
