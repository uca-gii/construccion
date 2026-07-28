export type LangKey =
  | 'java'
  | 'csharp'
  | 'javascript'
  | 'python'
  | 'ruby'
  | 'scala'
  | 'cpp'
  | 'c'
  | 'eiffel';

export interface LangInfo {
  label: string;
  runnable: boolean;
}

export const LANGUAGES: Record<LangKey, LangInfo> = {
  java: {label: 'Java', runnable: true},
  // Compiling arbitrary C# in Blazor WebAssembly (no server) turned out to
  // need much more than a small REPL app - see docs/implementacion notes on
  // the pilot for context. Kept as edit + copy for now, like Scala/C++/C/Eiffel.
  csharp: {label: 'C#', runnable: false},
  javascript: {label: 'JavaScript', runnable: true},
  python: {label: 'Python', runnable: true},
  ruby: {label: 'Ruby', runnable: true},
  scala: {label: 'Scala', runnable: false},
  cpp: {label: 'C++', runnable: false},
  c: {label: 'C', runnable: false},
  eiffel: {label: 'Eiffel', runnable: false},
};

export interface RunResult {
  stdout: string;
  stderr?: string;
}
