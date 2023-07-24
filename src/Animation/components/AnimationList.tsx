import { useEffect } from 'react';
import { AnimationCard } from './AnimationCard';
import { editorAtom, ActiveElementsAtom } from '../../atoms/atoms';
import { useAtomValue, useSetAtom } from 'jotai';

export const AnimationList = ({
    elements,
    effects,
    animations,
    play
}: {
    elements: TElements[];
    effects: TEffectList[];
    animations: IEffectData[];
    play: boolean;
}) => {
    const editor = useAtomValue(editorAtom);
    const activeElements = useSetAtom(ActiveElementsAtom);

    useEffect(() => {
        const setActiveElementListener = () => {
            const elements = editor?.getActiveElements();
            if (elements) activeElements(elements);
        };
        editor?.on('element:active', setActiveElementListener);
        return () => {
            editor?.off('element:active', setActiveElementListener);
        };
    }, [editor, activeElements]);

    return (
        <div className="p-[10px]">
            {elements.map((element: TElements, index: number) => {
                return <AnimationCard key={index} element={element} effects={effects} animations={animations} playing={play} />;
            })}
        </div>
    );
};
