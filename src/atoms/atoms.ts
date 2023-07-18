import { atom } from 'jotai';
import Editor from '../editor/core';

export const editorAtom = atom<Editor | null>(null);

export const testEditorAtom = atom<Editor | null>(null);
