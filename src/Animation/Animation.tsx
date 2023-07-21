import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { editorAtom } from '../atoms/atoms';
import { AnimationList } from './components/AnimationList';

export const Animation = () => {
    const editor = useAtomValue(editorAtom);
    const [play, setPlay] = useState(true);
    const [elements, setElements] = useState<any>({ elements: null, effect: null });
    // const [effects, setEffects] = useState<IEffectData[]>();

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
            const _elements = editor?.toData();
            setElements({ elements: _elements, effects: _elements?._effects });
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
                <AnimationList elements={elements.elements.elements} effects={elements.elements.effects} animations={elements.effects as IEffectData[]} />
            )}
        </div>
    );
};
