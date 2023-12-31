import { useState, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { editorAtom, playAtom } from '../atoms/atoms';
import { AnimationList } from './components/AnimationList';

export const Animation = () => {
    const editor = useAtomValue(editorAtom);
    const [play, setPlay] = useState(true);
    const [elements, setElements] = useState<any>([]);

    const onPlay = async () => {
        setPlay(false);
        await editor?.play();
        setPlay(true);
    };
    const onStop = () => {
        setPlay(true);
        editor?.stop();
    };

    useEffect(() => {
        const addElementListener = () => {
            const _elements = editor?.toElements();
            setElements({ elements: _elements?.elements, effects: _elements?.effects, effects2: _elements?._effects });
        };
        editor?.on('element:add', addElementListener);
        editor?.on('element:remove', addElementListener);
        editor?.on('effects:add', addElementListener);
        editor?.on('effects:delete', addElementListener);
        return () => {
            editor?.off('element:add', addElementListener);
            editor?.off('element:remove', addElementListener);
            editor?.on('effects:add', addElementListener);
            editor?.on('effects:delete', addElementListener);
        };
    }, [editor]);

    return (
        <div>
            <div className="flex items-center justify-between p-[4px_12px]">
                <h5 className="font-[600]">ANIMATION</h5>
                {play ? (
                    <button className="bg-[#84b2f3] hover:bg-[#a7c4ee] text-[white] p-[4px_12px] rounded-md" onClick={() => onPlay()}>
                        PLAY
                    </button>
                ) : (
                    <button className="bg-[#747576] hover:bg-[#a2a3a4] text-[white] p-[4px_12px] rounded-md" onClick={() => onStop()}>
                        STOP
                    </button>
                )}
            </div>
            {elements.elements && (
                <AnimationList elements={elements.elements} effects={elements.effects} animations={elements.effects2 as IEffectData[]} play={play} />
            )}
        </div>
    );
};
