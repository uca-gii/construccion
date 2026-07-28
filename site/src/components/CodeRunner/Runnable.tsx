import React, {useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Editor from './Editor';
import Console from './Console';
import {LANGUAGES, type LangKey, type RunResult} from './languages';
import styles from './styles.module.css';

interface RunnableProps {
  lang: LangKey;
  title?: string;
  // Preferred way to pass source: a template-literal prop, so raw braces in
  // the snippet never reach MDX's JSX-expression parser. `children` remains
  // supported for simple snippets with no braces at all.
  code?: string;
  children?: string;
  // Override to hide the "Ejecutar" button even for a runnable language -
  // e.g. deliberately incomplete pseudocode meant for critique, not execution.
  static?: boolean;
}

type RunnerFn = (code: string, baseUrl: string) => Promise<RunResult>;

async function loadRunner(lang: LangKey): Promise<RunnerFn | null> {
  switch (lang) {
    case 'java':
      return (await import('./runners/java')).runJava;
    case 'javascript':
      return (await import('./runners/javascript')).runJavaScript;
    case 'python':
      return (await import('./runners/python')).runPython;
    case 'ruby':
      return (await import('./runners/ruby')).runRuby;
    default:
      return null;
  }
}

function RunnableInner({lang, title, code: initialCode, children, static: isStatic}: RunnableProps): React.ReactElement {
  const source = initialCode ?? children ?? '';
  const [code, setCode] = useState(source.replace(/^\n/, '').replace(/\n$/, ''));
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const info = LANGUAGES[lang];
  const runnable = info.runnable && !isStatic;
  const {siteConfig} = useDocusaurusContext();

  async function handleRun() {
    setRunning(true);
    setResult(null);
    try {
      const runner = await loadRunner(lang);
      if (!runner) {
        setResult({stdout: '', stderr: `No hay runner disponible para ${info.label}.`});
        return;
      }
      const runResult = await runner(code, siteConfig.baseUrl);
      setResult(runResult);
    } catch (error) {
      setResult({stdout: '', stderr: String(error)});
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      {title ? <div className={styles.editorToolbar}>{title}</div> : null}
      <Editor lang={lang} code={code} onChange={setCode} />
      {runnable ? (
        <div className={styles.editorToolbar}>
          <button
            type="button"
            className={`${styles.toolbarButton} ${styles.runButton}`}
            onClick={handleRun}
            disabled={running}>
            {running ? 'Ejecutando…' : `▶ Ejecutar (${info.label})`}
          </button>
        </div>
      ) : (
        <div className={styles.notRunnableNote}>
          {info.label} no se ejecuta en el navegador aquí — edítalo y usa el botón
          «Copiar» para probarlo en tu entorno habitual.
        </div>
      )}
      <Console running={running} result={result} />
    </div>
  );
}

export default function Runnable(props: RunnableProps): React.ReactElement {
  return (
    <BrowserOnly fallback={<pre>{props.code ?? props.children}</pre>}>
      {() => <RunnableInner {...props} />}
    </BrowserOnly>
  );
}
