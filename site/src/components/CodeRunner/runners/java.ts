import type {RunResult} from '../languages';
import {loadScript} from './utils';

const CHEERPJ_VERSION = '4.3';
const CHEERPJ_URL = `https://cjrtnc.leaningtech.com/${CHEERPJ_VERSION}/loader.js`;

declare global {
  interface Window {
    cheerpjInit?: (config: Record<string, unknown>) => Promise<void>;
    cheerpjRunMain?: (mainClass: string, classPath: string, ...args: string[]) => Promise<number>;
    cheerpjAddStringFile?: (path: string, content: string) => void;
  }
}

let initPromise: Promise<void> | null = null;
let consoleEl: HTMLPreElement | null = null;

function ensureConsoleElement(): HTMLPreElement {
  if (!consoleEl) {
    consoleEl = document.createElement('pre');
    // CheerpJ auto-detects an element with id="console" in the document and
    // routes System.out/System.err text into it - no extra JNI wiring needed.
    consoleEl.id = 'console';
    consoleEl.style.display = 'none';
    document.body.appendChild(consoleEl);
  }
  return consoleEl;
}

async function ensureCheerpJ(baseUrl: string): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      ensureConsoleElement();
      if (!window.cheerpjInit) {
        await loadScript(CHEERPJ_URL);
      }
      // CheerpJ's virtual "/app/" filesystem prefix maps to the document
      // root by default, which breaks once the site is nested under a
      // sub-path (as it is here, under Docusaurus's baseUrl). overrideDocumentBase
      // repoints it at our actual base path, so "/app{baseUrl}tools.jar"
      // resolves to the real static/tools.jar we ship.
      await window.cheerpjInit!({status: 'none', overrideDocumentBase: baseUrl});
    })();
  }
  return initPromise;
}

function waitForOutputToSettle(el: HTMLElement, quietMs: number, maxMs: number): Promise<void> {
  return new Promise((resolve) => {
    let settleTimer: ReturnType<typeof setTimeout>;
    const finish = () => {
      observer.disconnect();
      clearTimeout(settleTimer);
      clearTimeout(maxTimer);
      resolve();
    };
    const observer = new MutationObserver(() => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(finish, quietMs);
    });
    observer.observe(el, {childList: true, characterData: true, subtree: true});
    const maxTimer = setTimeout(finish, maxMs);
    settleTimer = setTimeout(finish, quietMs);
  });
}

// The entry point class must be literally named `Main` (javac requires the
// file name to match the public class it declares, so the source is always
// written to /str/Main.java).
export async function runJava(code: string, baseUrl = '/'): Promise<RunResult> {
  await ensureCheerpJ(baseUrl);
  const el = ensureConsoleElement();
  el.textContent = '';

  const sourcePath = '/str/Main.java';
  const classPath = `/app${baseUrl}tools.jar:/files/`;

  window.cheerpjAddStringFile!(sourcePath, code);

  const compileResult = await window.cheerpjRunMain!(
    'com.sun.tools.javac.Main',
    classPath,
    sourcePath,
    '-d',
    '/files/',
  );

  if (compileResult !== 0) {
    return {
      stdout: el.textContent ?? '',
      stderr: 'La compilación de Java ha fallado (revisa que la clase pública se llame Main).',
    };
  }

  await window.cheerpjRunMain!('Main', classPath);
  await waitForOutputToSettle(el, 300, 8000);
  return {stdout: el.textContent ?? ''};
}
