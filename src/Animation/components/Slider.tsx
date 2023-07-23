import { useState, useEffect, useMemo } from 'react';
import { Input } from './Input';

export const Slider = ({ setTimeLine, animation }: SliderProps) => {
    const [flag, setFlag] = useState(false);
    const { delay, duration } = useMemo(() => animation.__options, [animation]);
    const [position, setPosition] = useState(0);
    const [startTime, setStartTime] = useState(delay / 1000);
    const [endTime, setEndTime] = useState((delay + duration) / 1000);

    const setTime = () => {
        if (endTime - startTime > 1) return;
        setEndTime(endTime + 1);
        setStartTime(startTime - 1);
    };
    const onMouseMove = (e: React.MouseEvent) => {
        // if (isPlaying || playFlag) return;
        e.stopPropagation();
        if (!flag) return;
        const num = e.screenX >= 1300 ? 10 : 5;
        if (position >= e.clientX + num) {
            if (startTime === 0) return;
            setPosition(e.clientX);
            setEndTime(endTime - 1);
            setStartTime(startTime - 1);
            setTimeLine(startTime, endTime);
        } else if (position <= e.clientX - num) {
            if (endTime === 100) return;
            setPosition(e.clientX);
            setEndTime(endTime + 1);
            setStartTime(startTime + 1);
            setTimeLine(startTime, endTime);
        }
    };

    useEffect(() => {
        setTimeLine(startTime, endTime);
    }, [startTime, endTime, setTimeLine]);

    useEffect(() => {
        setStartTime(delay / 1000);
        setEndTime((delay + duration) / 1000);
    }, [animation, delay, duration]);

    return (
        <div key="slider" className={'hidden sm:flex w-full items-center relative'} onMouseMove={(e) => onMouseMove(e)} onMouseLeave={() => setFlag(false)}>
            <Input value={startTime} setTime={setTime} setValue={setStartTime} flag={flag} />
            <Input value={endTime} setTime={setTime} setValue={setEndTime} flag={flag} />
            <div className="relative h-[7px] w-full rounded-[4px] bg-[white]">
                <div
                    className="group absolute rounded-[10px] h-[7px] bg-[#a3a2a2] cursor-pointer"
                    style={{ left: startTime + '%', right: 100 - endTime + '%' }}
                    onMouseMove={(e) => onMouseMove(e)}
                    onMouseDown={(e) => {
                        setFlag(true);
                        setPosition(e.clientX);
                    }}
                    onMouseUp={() => setFlag(false)}
                />
            </div>
        </div>
    );
};
