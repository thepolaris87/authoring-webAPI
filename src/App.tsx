import './assets/styles';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import Editor from './editor/core';
import EditorToolbox from './TestToolbox/TestToolbox';
import { useSetAtom } from 'jotai';
import { editorAtom } from './atoms/atoms';
import Toolbox from './Toolbox/Toolbox';
import { Animation } from './Animation/Animation';
import ViewContainer from './SideContainer/ViewContainer';
import FormatContainer from './SideContainer/FormatContainer';

export default function App() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const testRef = useRef<HTMLDivElement>(null);
    const setEditorAtom = useSetAtom(editorAtom);
    const [openExEditor, setOpenExEditor] = useState(false);
    const onOpnEditorClick = (open: boolean) => setOpenExEditor(open);

    useEffect(() => {
        if (!canvasRef.current) return;
        const editor = new Editor(canvasRef.current);
        setEditorAtom(editor);
    }, [setEditorAtom]);

    return (
        <>
            <div className="flex flex-col h-screen">
                <header className="flex p-1 items-center">
                    <div className="flex-[1]">
                        <Toolbox />
                        {/* <EditorToolbox /> */}
                    </div>
                    <button className="justify-end rounded border p-1" onClick={onOpnEditorClick.bind(null, true)}>
                        OPEN EDITOR
                    </button>
                </header>
                <hr className="border-cyan-950"></hr>
                <main className="flex">
                    {/* <div className="flex-[1] border p-1">VIEW CONTAINER</div>
                    <div ref={testRef} className="w-[800px] h-[300px] border rounded"></div>
                    <div className="flex-[1.5] border p-1">FORMAT CONTAINER</div> */}
                    <ViewContainer />
                    <div ref={canvasRef} className="w-[800px] h-[500px] border rounded"></div>
                    <FormatContainer />
                </main>
                <hr className="border-cyan-950"></hr>
                <footer className="flex-[1] overflow-auto p-1">
                    <Animation />
                </footer>
            </div>
            {openExEditor && (
                <div className="fixed inset-0 flex justify-center items-center bg-[#0000004c]">
                    <div className="w-[95%] h-[95%] p-1 border rounded bg-white">
                        <header className="flex">
                            <EditorToolbox />
                            <button className="justify-end rounded border p-1 h-fit" onClick={onOpnEditorClick.bind(null, false)}>
                                CLOSE
                            </button>
                        </header>
                        <main className="flex justify-center">
                            <div ref={testRef} className="w-[800px] h-[500px] border rounded"></div>
                        </main>
                    </div>
                </div>
            )}
        </>
    );
}
