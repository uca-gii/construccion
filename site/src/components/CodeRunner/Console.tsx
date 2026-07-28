import React from 'react';
import type {RunResult} from './languages';
import styles from './styles.module.css';

interface ConsoleProps {
  running: boolean;
  result: RunResult | null;
}

export default function Console({running, result}: ConsoleProps): React.ReactElement | null {
  if (!running && !result) {
    return null;
  }
  return (
    <pre className={styles.console}>
      {running && !result ? 'Ejecutando…' : null}
      {result?.stdout}
      {result?.stderr ? (
        <span className={styles.consoleError}>{result.stderr}</span>
      ) : null}
    </pre>
  );
}
