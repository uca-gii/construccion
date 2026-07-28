import type {RunResult} from '../languages';

// Runs the snippet inside a sandboxed iframe with an opaque origin
// (sandbox="allow-scripts" without "allow-same-origin"), isolating it from
// the page's cookies/storage. console.* calls are captured and shipped back
// over a dedicated MessageChannel so concurrent runners on the same page
// never cross-talk.
export async function runJavaScript(code: string): Promise<RunResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.sandbox.add('allow-scripts');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const channel = new MessageChannel();
    let settled = false;
    let timer: ReturnType<typeof setTimeout>;

    function finish(result: RunResult) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      channel.port1.close();
      iframe.remove();
      resolve(result);
    }

    channel.port1.onmessage = (event) => finish(event.data as RunResult);

    timer = setTimeout(() => {
      finish({stdout: '', stderr: 'Tiempo de espera agotado (5 s).'});
    }, 5000);

    iframe.srcdoc = `<!doctype html><html><body><script>
      self.addEventListener('message', function (event) {
        var port = event.ports[0];
        var logs = [];
        var record = function () {
          var parts = [];
          for (var i = 0; i < arguments.length; i++) {
            var a = arguments[i];
            parts.push(typeof a === 'string' ? a : JSON.stringify(a));
          }
          logs.push(parts.join(' '));
        };
        var sandboxConsole = { log: record, info: record, warn: record, error: record };
        try {
          var fn = new Function('console', event.data.code);
          fn(sandboxConsole);
          port.postMessage({ stdout: logs.join('\\n') });
        } catch (e) {
          port.postMessage({ stdout: logs.join('\\n'), stderr: String(e) });
        }
      });
    <\/script></body></html>`;

    iframe.onload = () => {
      iframe.contentWindow?.postMessage({code}, '*', [channel.port2]);
    };
  });
}
