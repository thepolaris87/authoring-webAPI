import { useEffect, useState } from 'react';
import Input from './components/Input';
import { useAtomValue } from 'jotai';
import { ActiveElementsAtom, editorAtom } from '../atoms/atoms';
import { BsChevronDown } from 'react-icons/bs';

export default function FormatContainer() {
    const editor = useAtomValue(editorAtom);
    const ActiveElements = useAtomValue(ActiveElementsAtom);
    const elements = editor?.getElements();
    const rect = ActiveElements[0]?.getBoundingClientRect();
    const [format, setFormat] = useState({ width: 0, height: 0, rotate: 0, opacity: 1 });
    const [isOpen, setIsOpen] = useState({ position: false, size: false, rotate: false, opacity: false });

    useEffect(() => {
        if (ActiveElements.length === 0) {
            setFormat({ width: 0, height: 0, rotate: 0, opacity: 0 });
            return;
        }
        console.log(ActiveElements[0].style);
        setFormat((prev) => ({
            ...prev,
            width: rect.width,
            height: rect.height,
            rotate: Number(ActiveElements[0].style.rotate.replace('deg', '')),
            opacity: ActiveElements[0].style.opacity ? Number(ActiveElements[0].style.opacity) : 1
        }));
    }, [ActiveElements]);

    const onWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormat((prev) => ({ ...prev, width: Number(e.target.value) }));
        ActiveElements[0].style.width = `${e.target.value}px`;
    };
    const onHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormat((prev) => ({ ...prev, height: Number(e.target.value) }));
        ActiveElements[0].style.height = `${e.target.value}px`;
    };

    const onOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormat((prev) => ({ ...prev, opacity: Number(e.target.value) }));
        ActiveElements[0].style.opacity = `${e.target.value}`;
    };

    const onRotateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormat((prev) => ({ ...prev, rotate: Number(e.target.value) }));
        ActiveElements[0].style.rotate = `${e.target.value}deg`;
    };

    return (
        <div className="flex-[1.5] border p-1">
            <div>
                <div className="font-bold">Transform</div>
                <div>
                    <div className="w-2/3 min-w-[140px] bg-[#E7E6E6] flex justify-between cursor-pointer p-1 mb-1"
                    onClick={() => setIsOpen((prev) => ({ ...prev, position: !isOpen.position }))}>
                        <div>Positioin</div>
                        <BsChevronDown className="w-4 pt-1" />
                    </div>
                    {isOpen.position && (
                    <div className="flex gap-4 text-[0.75rem] text-gray-500">
                        <Input title="Left" name="left" value={1} onChange={() => console.log('onChange')} />
                        <Input title="Right" name="right" value={1} onChange={() => console.log('onChange')} />
                    </div>
                    )}
                </div>
                <div>
                    <div className="w-2/3 min-w-[140px] bg-[#E7E6E6] flex justify-between cursor-pointer p-1 mb-1"
                    onClick={() => setIsOpen((prev) => ({ ...prev, size: !isOpen.size }))}>
                        <div>Size</div>
                        <BsChevronDown className="w-4 pt-1" />
                    </div>
                    {isOpen.size && (
                    <div className="flex gap-4 text-[0.75rem] text-gray-500">
                        <Input title="width" name="width" value={format.width} onChange={(e) => onWidthChange(e)} />
                        <Input title="height" name="height" value={format.height} onChange={(e) => onHeightChange(e)} />
                    </div>
                    )}
                </div>
                <div>
                    <div className="w-2/3 min-w-[140px] bg-[#E7E6E6] flex justify-between cursor-pointer p-1 mb-1"
                    onClick={() => setIsOpen((prev) => ({ ...prev, rotate: !isOpen.rotate }))}>
                        <div>Rotate</div>
                        <BsChevronDown className="w-4 pt-1" />
                    </div>
                    {isOpen.rotate && (
                    <div className="flex gap-4 text-[0.75rem] text-gray-500">
                        <Input title="angle" name="angle" value={format.rotate} onChange={(e) => onRotateChange(e)} />
                        <div>flip X</div>
                        <div>flip Y</div>
                    </div>
                    )}
                </div>
            </div>
            <div>
                <div className="font-bold">Attribute</div>
                <div>
                    <div className="w-2/3 min-w-[140px] bg-[#E7E6E6] flex justify-between cursor-pointer p-1 mb-1"
                    onClick={() => setIsOpen((prev) => ({ ...prev, opacity: !isOpen.opacity }))}>
                        <div>Opacity</div>
                        <BsChevronDown className="w-4 pt-1" />
                    </div>
                    {isOpen.opacity && (
                    <div className="flex gap-4 text-[0.75rem] text-gray-500">
                        <Input title="opacity" name="opacity" value={format.opacity} onChange={(e) => onOpacityChange(e)} />
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}
