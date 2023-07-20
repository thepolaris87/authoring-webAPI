import { atom } from 'jotai';
import Editor from '../editor/core';
import { GroupElement, WrapElement } from '../editor/elements';
type TDMElements = WrapElement | GroupElement;

export const editorAtom = atom<Editor | null>(null);

export const testEditorAtom = atom<Editor | null>(null);

export const ActiveElementsAtom = atom<TDMElements[]>([])
