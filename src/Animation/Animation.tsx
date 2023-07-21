import { useState, useEffect, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { editorAtom } from '../atoms/atoms';
import { AnimationList } from './components/AnimationList';

export const Animation = () => {
    const editor = useAtomValue(editorAtom);
    const [play, setPlay] = useState(true);
    const [elements, setElements] = useState<TData>();
    const [effects, setEffects] = useState<IEffectData[]>();

    useEffect(() => {
        const addElementListener = () => {
            const elements = editor?.toData();
            if (elements) setElements(elements as TData);
            const effects = editor?.getEffects();
            if (effects) setEffects(effects);
            console.log(elements, effects);
        };
        editor?.on('element:add', addElementListener);
        editor?.on('element:remove', addElementListener);
        editor?.on('effects:add', addElementListener);
        editor?.on('effects:delete', addElementListener);
        return () => {
            editor?.off('element:add', addElementListener);
            editor?.off('element:remove', addElementListener);
            editor?.off('effects:add', addElementListener);
            editor?.off('effects:delete', addElementListener);
        };
    }, [editor]);

    const updateElements = useCallback(() => {
        const elements = editor?.toData();
        if (elements) setElements(elements as TData);
        const effects = editor?.getEffects();
        if (effects) setEffects(effects);
    }, [editor]);

    return (
        <div>
            <div className="flex items-center justify-between p-[4px_12px]">
                <h5 className="font-[600]">ANIMATION</h5>
                {play ? (
                    <button className="bg-[#84b2f3] hover:bg-[#a7c4ee] text-[white] p-[4px_12px] rounded-md" onClick={() => setPlay(false)}>
                        PLAY
                    </button>
                ) : (
                    <button className="bg-[#747576] hover:bg-[#a2a3a4] text-[white] p-[4px_12px] rounded-md" onClick={() => setPlay(true)}>
                        STOP
                    </button>
                )}
            </div>
            {elements && (
                <AnimationList elements={elements.elements} effects={elements.effects} animations={effects as IEffectData[]} updateElements={updateElements} />
            )}
        </div>
    );
};
