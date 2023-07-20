import { useAtomValue, useSetAtom } from 'jotai';
import { ActiveElementsAtom, editorAtom } from '../atoms/atoms';
import { useEffect, useRef, useState } from 'react';
import { GroupElement, WrapElement } from '../editor/elements';
import { MdSave, MdDownload, MdTextFields, MdImage } from 'react-icons/md';
import { BsFillTrashFill } from 'react-icons/bs';
import { LiaObjectGroup, LiaObjectUngroup } from 'react-icons/lia';
import { BsChevronDoubleUp, BsChevronUp, BsChevronDown, BsChevronDoubleDown } from 'react-icons/bs';
import { AiOutlineFontColors, AiOutlineFontSize } from 'react-icons/ai';
import { BiBold, BiItalic } from 'react-icons/bi';

export default function Toolbox() {
    const editor = useAtomValue(editorAtom);
    const color = useRef('');
    const fontSize = useRef('');
    const [isFont, setIsFont] = useState<boolean>(false);
    const setActiveElement = useSetAtom(ActiveElementsAtom);
    const activeElements = useAtomValue(ActiveElementsAtom);
    const [fontStyle, setFontStyle] = useState({ bold: false, italic: false });

    useEffect(() => {
        const handleElementSelect = () => {
            const active = editor?.getActiveElements();
            if (!active) return;
            setActiveElement(active);
        };

        const handleElementAdd = () => {
            const active = editor?.getActiveElements();
            if (!active) return;
            setActiveElement(active);
        };

        const handleElementActive = () => {
            const active = editor?.getActiveElements();
            if (!active) return;
            setActiveElement(active);
        };

        const handleElementDrag = () => {
            const active = editor?.getActiveElements();
            if (!active) return;
            setActiveElement(active);
        };

        if (editor) {
            editor.on('element:select', handleElementSelect);
            editor.on('element:add', handleElementAdd);
            editor.on('element:active', handleElementActive);
            editor.on('element:discardActive', handleElementActive);
            editor.on('element:drag', handleElementDrag);
        }

        return () => {
            if (editor) {
                editor.off('element:select', handleElementSelect);
                editor.off('element:add', handleElementAdd);
                editor.off('element:active', handleElementActive);
                editor.off('element:discardActive', handleElementActive);
                editor.off('element:drag', handleElementDrag);
            }
        };
    }, [editor]);

    useEffect(() => {
        if (activeElements[0]?.dataset?.type === 'textbox') setIsFont(true);
        else setIsFont(false);
    }, [activeElements]);

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
        console.log(editor);
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

    //
    const onSendToBack = () => {
        if (!editor) return;
        const s = editor.getActiveElements();
        if (s[0]) editor.sendToBack(s[0]);
    };

    const onColor = () => {
        if (!editor) return;
        const s = editor.getActiveElements();
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

    return (
        <div className="flex flex-[1]">
            <div className="flex self-center">
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onSave}>
                        <MdSave />
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onLoad}>
                        <MdDownload />
                    </button>
                </div>
            </div>
            <div className="flex self-center">
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onInsertText}>
                        <MdTextFields />
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onInsertImage}>
                        <MdImage />
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onRemove}>
                        <BsFillTrashFill />
                    </button>
                </div>
            </div>

            <div className="flex self-center">
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onToGroup}>
                        <LiaObjectGroup />
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onUngroup}>
                        <LiaObjectUngroup />
                    </button>
                </div>
            </div>

            <div className="flex  self-center">
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onBringToFront}>
                        <BsChevronDoubleUp />
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onBringFoward}>
                        <BsChevronUp />
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onSendToBack}>
                        <BsChevronDoubleDown />
                    </button>
                </div>
                <div>
                    <button className="border p-1 m-1 rounded" onClick={onSendBackward}>
                        <BsChevronDown />
                    </button>
                </div>
            </div>
            {isFont && (
                <>
                    <div className="w-0 h-5 mx-2 border self-center" />
                    <div className="flex">
                        <div className="flex items-center">
                            <button className="border p-1 m-1 rounded" onClick={onColor}>
                                <AiOutlineFontColors />
                            </button>
                            <input type="color" onChange={(e) => (color.current = e.target.value)}></input>
                        </div>
                        <div className="flex items-center">
                            <button
                                className="border p-1 m-1 rounded"
                                onClick={() => {
                                    setFontStyle((prev) => ({ ...prev, bold: !fontStyle.bold }));
                                    fontStyle.bold ? onFontWeight('bold') : onFontWeight('normal');
                                }}
                            >
                                <BiBold />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div>
                            <button className="border p-1 m-1 rounded" onClick={onFontSize}>
                                <AiOutlineFontSize />
                            </button>
                            <input className="border rounded w-24" onChange={(e) => (fontSize.current = e.target.value)}></input>
                        </div>
                        <div className="flex items-center">
                            <button
                                className="border p-1 m-1 rounded"
                                onClick={() => {
                                    setFontStyle((prev) => ({ ...prev, italic: !fontStyle.italic }));
                                    fontStyle.italic ? onFontStyle('italic') : onFontStyle('normal');
                                }}
                            >
                                <BiItalic />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
