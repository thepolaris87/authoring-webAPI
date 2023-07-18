import { atom } from 'jotai';
import Editor from '../editor/core';

export const editorAtom = atom<Editor | null>(null);
