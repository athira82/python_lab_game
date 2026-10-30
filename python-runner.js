// Runs Python with Pyodide inside a Web Worker. A stuck program is stopped by terminating the worker (timeout).
// Browsers cannot pause for typing, so input() reads from the Input box (one line per call).
const PythonRunner = (() => {
  const WORKER = `importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
const ready = loadPyodide().then(p => { postMessage({type: 'ready'}); return p; });
onmessage = async e => {
  const py = await ready; let out = '', err = null;
  py.setStdout({batched: s => out += s + '\\n'}); py.setStderr({batched: s => out += s + '\\n'});
  py.globals.set('_lines', py.toPy(e.data.lines)); py.globals.set('_code', e.data.code);
  try { await py.runPythonAsync(e.data.pre); } catch (x) { err = String(x.message || x); }
  postMessage({type: 'done', out, err});
};`;
  const PRE = `import builtins, sys
def _input(prompt=''):
    if not _lines:
        raise EOFError('input() needs a value but the Input box has no more lines.')
    v = _lines.pop(0)
    print(str(prompt) + v)
    return v
builtins.input = _input
try:
    exec(compile(_code, '<your code>', 'exec'), {'__name__': '__main__'})
finally:
    sys.stdout.flush()
`;
  const url = URL.createObjectURL(new Blob([WORKER], { type: 'text/javascript' }));
  let w, ready;
  const api = { onStatus() {} };
  function spawn() {
    api.onStatus('loading', '⏳ Loading Python (the first load takes a few seconds)…');
    const me = w = new Worker(url);
    ready = new Promise(r => { me.onmessage = e => { if (e.data.type === 'ready') { r(); api.onStatus('ready', ''); } }; });
    me.onerror = () => api.onStatus('error', '⚠️ Python could not load. Check your internet connection and reload.');
  }
  const clean = e => { const i = e.indexOf('File "<your code>"'); return (i >= 0 ? e.slice(i) : e).trim(); };
  api.init = spawn;
  api.run = async (code, lines = [], ms = 5000) => {
    await ready; const wk = w;
    return new Promise(res => {
      const t = setTimeout(() => { wk.terminate(); spawn(); res({ out: '', err: `Stopped: the program ran longer than ${ms / 1000} seconds. Can your loop condition ever become False?`, timeout: true }); }, ms);
      wk.onmessage = e => { if (e.data.type === 'done') { clearTimeout(t); res({ out: e.data.out, err: e.data.err && clean(e.data.err) }); } };
      wk.postMessage({ code, lines, pre: PRE });
    });
  };
  return api;
})();
