// Wires up tabs, progress, and the editor workspace. Content comes from data/lessons.js.
const $ = (s, r = document) => r.querySelector(s);
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const TABS = [['learn', '1 Learn'], ['explore', '2 Explore'], ['practice', '3 Practice'], ['build', '4 Build'], ['code', '5 Code']];
const FREE = '# Free editor: write anything!\nname = input("Your name? ")\nfor i in range(3):\n    print("Hi", name, i)\n';
let topic, tab = 'learn', sel = { practice: 0, build: 0 }, freeCode = null;
const earned = () => topic.badges.filter(b => b.needs.every(Progress.isDone));

function stats() {
  const all = topic.challenges, d = all.filter(c => Progress.isDone(c.id)).length;
  $('#stats').innerHTML = `${Progress.get().xp} XP · Level ${Progress.level()} · ${earned().map(b => `<span title="${b.name}">${b.icon}</span>`).join(' ') || 'no badges yet'} · ${d}/${all.length} done<div class="meter"><i style="width:${100 * d / all.length}%"></i></div>`;
}

function workspace(el, ch) {
  const start = ch ? ch.starter : (freeCode || FREE); let hint = 0;
  el.innerHTML = (ch ? `<h3>${ch.title} <span class="xp">+${ch.xp} XP</span></h3><p>${ch.prompt}</p>` : '<h3>Free Python editor</h3>') +
    `<textarea class="ed" spellcheck="false" aria-label="Python code"></textarea><details open><summary>Input for input(): one value per line</summary><textarea class="in" aria-label="Input"></textarea></details>
    <div class="bar"><button class="run">▶ Run (Ctrl+Enter)</button>${ch ? '<button class="test">✔ Run tests</button><button class="hint">💡 Hint</button>' : ''}<button class="clr">Clear output</button><button class="rst">Reset code</button></div>
    <div class="hints"></div><pre class="out">Output appears here.</pre><div class="res"></div>`;
  const ed = $('.ed', el), out = $('.out', el), res = $('.res', el); ed.value = start;
  const busy = b => el.querySelectorAll('button').forEach(x => x.disabled = b);
  ed.onkeydown = e => { if (e.key === 'Tab') { e.preventDefault(); document.execCommand('insertText', false, '    '); } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) $('.run', el).click(); };
  $('.run', el).onclick = async () => {
    busy(true); out.textContent = 'Running…'; const v = $('.in', el).value;
    const r = await PythonRunner.run(ed.value, v ? v.split('\n') : []);
    out.textContent = (r.out + (r.err ? '\n❌ ' + r.err : '')).trim() || '(no output)'; busy(false);
  };
  $('.clr', el).onclick = () => { out.textContent = ''; res.innerHTML = ''; };
  $('.rst', el).onclick = () => { ed.value = start; };
  if (!ch) return;
  $('.hint', el).onclick = () => $('.hints', el).insertAdjacentHTML('beforeend', `<p>💡 ${hint < ch.hints.length ? ch.hints[hint++] : 'No more hints. Experiment in the Code tab!'}</p>`);
  $('.test', el).onclick = async () => {
    busy(true); res.textContent = 'Running tests…';
    const rows = await Challenge.runAll(ch, ed.value);
    res.innerHTML = rows.map(r => `<p class="${r.ok ? 'ok' : 'bad'}">${r.ok ? '✅' : '❌'} ${r.name}${r.ok ? '' : ': ' + esc(r.msg)}</p>`).join('');
    if (rows.every(r => r.ok)) {
      const had = earned().map(b => b.id), fresh = Progress.complete(ch.id, ch.xp); stats();
      const nb = earned().filter(b => !had.includes(b.id)).map(b => `${b.icon} ${b.name}`);
      res.insertAdjacentHTML('beforeend', `<div class="win">🎉 All tests passed! ${fresh ? '+' + ch.xp + ' XP.' : 'XP already earned.'} Skills: ${ch.skills}. ${nb.length ? 'Badge unlocked: ' + nb.join(', ') + '. ' : ''}${ch.next}</div>`);
    }
    busy(false);
  };
}

function render() {
  $('#tabs').innerHTML = TABS.map(([k, l]) => `<button data-k="${k}" class="${k === tab ? 'on' : ''}">${l}</button>`).join(''); stats();
  const v = $('#view'), d = document.createElement('div'); v.innerHTML = '';
  if (tab === 'learn') { v.innerHTML = `<div class="card"><h2>${topic.title}</h2><p>${topic.tagline}</p><b>You will learn to:</b><ul>${topic.objectives.map(o => `<li>${o}</li>`).join('')}</ul></div>`; v.append(d); Lessons.learn(topic, d); }
  else if (tab === 'explore') Lessons.demo(v, c => { freeCode = c; tab = 'code'; render(); });
  else if (tab === 'code') { d.className = 'card'; v.append(d); workspace(d, null); }
  else {
    const list = topic.challenges.filter(c => c.stage === tab);
    v.innerHTML = `<div class="bar">${list.map((c, i) => `<button data-i="${i}" class="${i === sel[tab] ? 'on' : ''}">${c.title}${Progress.isDone(c.id) ? ' ✅' : ''}</button>`).join('')}</div>`;
    d.className = 'card'; v.append(d); workspace(d, list[sel[tab]]);
    v.firstChild.onclick = e => { if (e.target.dataset.i !== undefined) { sel[tab] = +e.target.dataset.i; render(); } };
  }
}

const picker = $('#topic');
Object.entries(TOPICS).forEach(([k, t]) => picker.add(new Option(t.title, k)));
picker.onchange = () => { topic = TOPICS[picker.value]; tab = 'learn'; sel = { practice: 0, build: 0 }; render(); };
$('#tabs').onclick = e => { if (e.target.dataset.k) { tab = e.target.dataset.k; render(); } };
$('#reset').onclick = () => { if (confirm('Erase all saved progress in this browser?')) { Progress.reset(); render(); } };
PythonRunner.onStatus = (s, m) => { const b = $('#status'); b.hidden = s === 'ready'; b.textContent = m; };
topic = TOPICS[picker.value]; PythonRunner.init(); render();
