import { atom } from 'jotai';
import Editor, { TDMElements } from '../editor/core';

export const editorAtom = atom<Editor | null>(null);

export const testEditorAtom = atom<Editor | null>(null);

export const ActiveElementsAtom = atom<TDMElements[]>([]);

export const playAtom = atom<boolean>(false);
