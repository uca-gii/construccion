import type {RunResult} from '../languages';
import {loadScript} from './utils';

// Pinned to a known-good release; bump deliberately and re-verify rather
// than tracking "latest", since this loads on every page view that runs
// Python.
const PYODIDE_VERSION = '0.28.3';
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

declare global {
  interface Window {
    loadPyodide?: (options: {indexURL: string}) => Promise<any>;
  }
}

let pyodidePromise: Promise<any> | null = null;

async function getPyodide(): Promise<any> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      if (!window.loadPyodide) {
        await loadScript(`${PYODIDE_INDEX_URL}pyodide.js`);
      }
      return window.loadPyodide!({indexURL: PYODIDE_INDEX_URL});
    })();
  }
  return pyodidePromise;
}

export async function runPython(code: string): Promise<RunResult> {
  const pyodide = await getPyodide();
  const logs: string[] = [];
  pyodide.setStdout({batched: (line: string) => logs.push(line)});
  pyodide.setStderr({batched: (line: string) => logs.push(line)});
  try {
    await pyodide.runPythonAsync(code);
    return {stdout: logs.join('\n')};
  } catch (error) {
    return {stdout: logs.join('\n'), stderr: String(error)};
  }
}
