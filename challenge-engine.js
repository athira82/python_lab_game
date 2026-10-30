// Runs the student's program for each test and judges the real output (not the source text).
const Challenge = {
  check(t, r) {
    if (r.err) return { ok: false, msg: r.timeout ? r.err : 'Your program raised an error: ' + r.err.split('\n').pop() };
    const lines = r.out.split('\n').map(s => s.trim()).filter(Boolean), low = r.out.toLowerCase();
    if (t.expect && JSON.stringify(lines) !== JSON.stringify(t.expect)) return { ok: false, msg: `Expected these lines: ${t.expect.join(', ')}. Got: ${lines.join(', ') || '(nothing)'}.` };
    if (t.last !== undefined && lines[lines.length - 1] !== t.last) return { ok: false, msg: `The last line should be "${t.last}" but it was "${lines[lines.length - 1] || ''}".` };
    let pos = 0;
    for (const s of t.inOrder || []) { const i = low.indexOf(s, pos); if (i < 0) return { ok: false, msg: `Expected to see "${s}"${pos ? ' after the earlier messages' : ''} in the output.` }; pos = i + s.length; }
    for (const s of t.not || []) if (low.includes(s)) return { ok: false, msg: `The output should not contain "${s}" for this input.` };
    return { ok: true };
  },
  async runAll(ch, code) {
    const rows = [];
    for (const t of ch.tests) rows.push({ name: t.name, ...this.check(t, await PythonRunner.run((t.prelude || '') + code, t.input || [], 3000)) });
    return rows;
  }
};
