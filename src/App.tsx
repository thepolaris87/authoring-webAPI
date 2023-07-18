import './assets/styles';
import './App.css';
import View from './View';
import { useEffect, useRef } from 'react';
import Editor from './editor/core';
import Toolbox from './Toolbox/Toolbox';
import { useSetAtom } from 'jotai';
import { editorAtom } from './atoms/atoms';

export default function App() {
    const viewRef = useRef<HTMLDivElement>(null);
    const setEditorAtom = useSetAtom(editorAtom);

    useEffect(() => {
        if (!viewRef.current) return;
        const editor = new Editor(viewRef.current);
        setEditorAtom(editor);
    }, [setEditorAtom]);

    return (
        <div>
            <Toolbox />
            <div className="flex">
                <div className="w-40 border">aa</div>
                <View viewRef={viewRef} />
            </div>
        </div>
    );
}
