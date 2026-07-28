import React, {useState} from 'react';
import CodeMirror from '@uiw/react-codemirror';
import {EditorView} from '@codemirror/view';
import {java} from '@codemirror/lang-java';
import {cpp} from '@codemirror/lang-cpp';
import {javascript} from '@codemirror/lang-javascript';
import {python} from '@codemirror/lang-python';
import {csharp} from '@replit/codemirror-lang-csharp';
import {StreamLanguage} from '@codemirror/language';
import {ruby} from '@codemirror/legacy-modes/mode/ruby';
import {clike} from '@codemirror/legacy-modes/mode/clike';
import type {LangKey} from './languages';
import styles from './styles.module.css';

// Scala shares C-like block/line comments and braces closely enough that the
// generic "clike" stream mode gives reasonable highlighting without pulling
// in a dedicated (and heavier) Scala grammar package just for a read-only-ish
// editor box.
const scalaLike = clike({
  name: 'scala',
  keywords: {
    def: 1, val: 1, var: 1, class: 1, object: 1, trait: 1, extends: 1,
    with: 1, override: 1, abstract: 1, private: 1, protected: 1, final: 1,
    import: 1, package: 1, new: 1, return: 1, if: 1, else: 1, match: 1,
    case: 1, for: 1, while: 1, do: 1, yield: 1, implicit: 1, lazy: 1,
    sealed: 1, this: 1, super: 1, throw: 1, try: 1, catch: 1, finally: 1,
  },
});

function extensionFor(lang: LangKey) {
  switch (lang) {
    case 'java':
      return java();
    case 'csharp':
      return csharp();
    case 'javascript':
      return javascript();
    case 'python':
      return python();
    case 'cpp':
    case 'c':
      return cpp();
    case 'ruby':
      return StreamLanguage.define(ruby);
    case 'scala':
      return StreamLanguage.define(scalaLike);
    case 'eiffel':
    default:
      return [];
  }
}

interface EditorProps {
  lang: LangKey;
  code: string;
  onChange: (value: string) => void;
}

export default function Editor({lang, code, onChange}: EditorProps): React.ReactElement {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.editorToolbar}>
        <button type="button" className={styles.toolbarButton} onClick={handleCopy}>
          {copied ? 'Copiado ✓' : 'Copiar'}
        </button>
      </div>
      <CodeMirror
        value={code}
        height="auto"
        extensions={[extensionFor(lang), EditorView.lineWrapping]}
        onChange={onChange}
        basicSetup={{foldGutter: false}}
      />
    </div>
  );
}
