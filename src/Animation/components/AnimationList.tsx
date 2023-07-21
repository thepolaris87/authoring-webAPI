import { useEffect, useState } from 'react';
import { AnimationCard } from './AnimationCard';
import { editorAtom } from '../../atoms/atoms';
import { useAtomValue } from 'jotai';
import { TDMElements } from '../../editor/core';

export const AnimationList = ({
    elements,
    effects,
    animations,
    updateElements
}: {
    elements: TElements[];
    effects: TEffectList[];
    animations: IEffectData[];
    updateElements: () => void;
}) => {
    const editor = useAtomValue(editorAtom);
    const [activeObj, setActiveObj] = useState<TDMElements>();
    const [update, setUpdate] = useState(true);

    useEffect(() => {
        const setActiveElementListener = () => {
            const elements = editor?.getActiveElements();
            if (elements) setActiveObj(elements[0]);
            // setUpdate(!update);
            // updateElements();
        };
        editor?.on('element:active', setActiveElementListener);
        return () => {
            editor?.off('element:active', setActiveElementListener);
        };
    }, [editor, update, updateElements]);

    return (
        <div className="p-[10px]">
            {elements.map((element: TElements, index: number) => {
                return (
                    <AnimationCard
                        key={index}
                        element={element}
                        effects={effects}
                        animations={animations}
                        setActiveObj={setActiveObj}
                        activeObj={activeObj}
                        updateElements={updateElements}
                    />
                );
            })}
        </div>
    );
};
