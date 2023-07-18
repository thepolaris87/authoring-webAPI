import { useAtomValue } from 'jotai';
import { editorAtom } from '../atoms/atoms';
import { useRef } from 'react';
import { GroupElement, WrapElement } from '../editor/elements';
import { pxToNumber } from '../editor/util';

export default function Toolbox() {
    const editor = useAtomValue(editorAtom);
    const color = useRef('');
    const fontSize = useRef('');
    const onSave = () => {
        if (!editor) return;
        const data = editor.toData();
        window.localStorage.setItem('au', JSON.stringify(data));
    };
    const onLoad = () => {
        if (!editor) return;
        editor.clear();
        editor.loadFromJSON(window.localStorage.getItem('au') ?? '');
    };

    const onInsertText = () => {
        if (!editor) return;
        const textbox = editor.textbox('TEXT');
        editor.add(textbox);
    };
    const onInsertImage = () => {
        if (!editor) return;
        const image = editor.image('https://sol-api.esls.io/images/M1/MI00000914.svg?dummy=1689056130845');
        editor?.add(image);
    };
    const onRemove = () => {
        if (!editor) return;
        const s = editor.getActiveElements();
        if (s[0]) editor.remove(s[0]);
    };
    const onColor = () => {
        if (!editor) return;
        const s = editor.getActiveElements();
        console.log(color.current);
        if (s[0] instanceof WrapElement) s[0].__setTextStyle({ color: color.current });
    };
    const onFontWeight = (fontWeight: string) => {
        if (!editor) return;
        const s = editor.getActiveElements();
        if (s[0] instanceof WrapElement) s[0].__setTextStyle({ fontWeight });
    };
    const onFontStyle = (fontStyle: string) => {
        if (!editor) return;
        const s = editor.getActiveElements();
        if (s[0] instanceof WrapElement) s[0].__setTextStyle({ fontStyle });
    };
    const onFontSize = () => {
        if (!editor) return;
        const s = editor.getActiveElements();
        if (s[0] instanceof WrapElement) s[0].__setTextStyle({ fontSize: fontSize.current + 'px' });
    };
    const onFadeIn = () => {
        if (!editor) return;
        const s = editor.getActiveElements();
        if (s[0]) {
            const effects = editor.effect(s[0]);
            effects.delete();
            const anim = effects.add({ keyframes: [{ opacity: '0' }, { opacity: '1' }], options: { duration: 1000 } });
            anim.ready.then(() => effects.play({ init: true }));
        }
    };
    const onMove = () => {
        if (!editor) return;
        const s = editor.getActiveElements();
        if (s[0]) {
            const effects = editor.effect(s[0]);
            effects.delete();
            const [ox = 0, oy = 0] = pxToNumber(s[0].style.translate);
            const [dx, dy] = [ox + 100, oy + 100];
            const anim = effects.add({
                keyframes: [{ translate: `${dx}px ${dy}px` }],
                options: { duration: 1000 }
            });
            anim.ready.then(() => effects.play({ init: true }));
        }
    };
    const onPlay = () => {
        if (!editor) return;
        const s = editor.getActiveElements();
        if (s[0]) editor.play(s[0], { init: true });
    };

    const onToGroup = () => {
        if (!editor) return;
        const s = editor.getActiveElements();
        editor.toGroup(s);
    };
    const onUngroup = () => {
        if (!editor) return;
        const s = editor.getActiveElements();
        if (s[0] instanceof GroupElement) editor.unGroup(s[0]);
    };

    const onUndo = () => {
        if (!editor) return;
        editor.undo();
    };
    const onRedo = () => {
        if (!editor) return;
        editor.redo();
    };
    const onBringToFront = () => {
        if (!editor) return;
        const s = editor.getActiveElements();
        if (s[0]) editor.bringToFront(s[0]);
    };

    const onBringFoward = () => {
        if (!editor) return;
        const s = editor.getActiveElements();
        if (s[0]) editor.bringToFoward(s[0]);
    };

    const onSendBackward = () => {
        if (!editor) return;
        const s = editor.getActiveElements();
        if (s[0]) editor.sendToBackward(s[0]);
    };

    const onSendToBack = () => {
        if (!editor) return;
        const s = editor.getActiveElements();
        if (s[0]) editor.sendToBack(s[0]);
    };

    return (
        <div className="flex">
            <div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onSave}>
                        SAVE
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onLoad}>
                        LOAD
                    </button>
                </div>
            </div>
            <div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onInsertText}>
                        Insert Text
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onInsertImage}>
                        Insert Image
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onRemove}>
                        Remove Element
                    </button>
                </div>
            </div>
            <div>
                <div className="flex items-center">
                    <button className="border p-1 m-1 rounded" onClick={onColor}>
                        Color
                    </button>
                    <input type="color" onChange={(e) => (color.current = e.target.value)}></input>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onFontWeight.bind(null, 'normal')}>
                        Normal
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onFontWeight.bind(null, 'bold')}>
                        Bold
                    </button>
                </div>
            </div>
            <div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onFontSize}>
                        Font Size
                    </button>
                    <input className="border rounded w-24" onChange={(e) => (fontSize.current = e.target.value)}></input>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onFontStyle.bind(null, 'normal')}>
                        Normal
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onFontStyle.bind(null, 'italic')}>
                        Italic
                    </button>
                </div>
            </div>
            <div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onFadeIn}>
                        Fade In
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onMove}>
                        Move
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onPlay}>
                        LOAD TEST PLAY
                    </button>
                </div>
            </div>
            <div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onToGroup}>
                        To Group
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onUngroup}>
                        Ungroup
                    </button>
                </div>
            </div>
            <div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onUndo}>
                        UNDO
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onRedo}>
                        REDO
                    </button>
                </div>
            </div>
            <div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onBringToFront}>
                        FRONT
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onBringFoward}>
                        FOWARD
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onSendToBack}>
                        BACK
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onSendBackward}>
                        BACKWARD
                    </button>
                </div>
            </div>
        </div>
    );
}
