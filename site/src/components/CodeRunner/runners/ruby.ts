import type {RunResult} from '../languages';

// ruby.wasm only ships rolling nightly builds (no stable dotted version to
// pin), so "latest" is the intended, not just convenient, way to consume it.
// The package root export does NOT include DefaultRubyVM (only low-level
// bindings) - the browser convenience helper lives at the "./dist/browser"
// subpath specifically.
const RUBY_JS_MODULE = 'https://esm.sh/@ruby/wasm-wasi@latest/dist/browser';
const RUBY_WASM_URL =
  'https://cdn.jsdelivr.net/npm/@ruby/3.3-wasm-wasi@latest/dist/ruby+stdlib.wasm';

let vmPromise: Promise<any> | null = null;

async function getRubyVM(): Promise<any> {
  if (!vmPromise) {
    vmPromise = (async () => {
      const [{DefaultRubyVM}, wasmResponse] = await Promise.all([
        import(/* webpackIgnore: true */ RUBY_JS_MODULE),
        fetch(RUBY_WASM_URL),
      ]);
      const rubyModule = await WebAssembly.compileStreaming(wasmResponse);
      const {vm} = await DefaultRubyVM(rubyModule);
      return vm;
    })();
  }
  return vmPromise;
}

export async function runRuby(code: string): Promise<RunResult> {
  const vm = await getRubyVM();
  try {
    // ruby.wasm's default printer writes straight to devtools console, so we
    // redirect $stdout to a StringIO for the run and read it back as text,
    // consistent with the other runners. The snippet is spliced in as Ruby
    // source (not re-quoted as a string), so no escaping is needed here.
    const wrapped = `
      require "stringio"
      __out__ = StringIO.new
      $stdout = __out__
      begin
        ${code}
      rescue => e
        __out__.puts "#{e.class}: #{e.message}"
      ensure
        $stdout = STDOUT
      end
      __out__.string
    `;
    const result = vm.eval(wrapped);
    return {stdout: result.toString()};
  } catch (error) {
    return {stdout: '', stderr: String(error)};
  }
}
