// Renders the Learn cards and the Explore demo from the topic data.
const Lessons = {
  learn(t, el) {
    el.innerHTML = t.learn.map((s, i) => `<div class="card" data-i="${i}"><h3>${s.h}</h3><p>${s.p}</p><pre>${esc(s.code)}</pre><p>${s.explain}</p><button class="try">▶ Run this example</button><pre class="o" hidden></pre></div>`).join('');
    el.onclick = async e => {
      if (!e.target.classList.contains('try')) return;
      const c = e.target.parentNode, o = c.querySelector('.o'); o.hidden = false; o.textContent = 'Running…';
      const r = await PythonRunner.run(t.learn[c.dataset.i].code);
      o.textContent = (r.out + (r.err ? '\n❌ ' + r.err : '')).trim() || '(no output)';
    };
  },
  demo(el, openInEditor) {
    el.innerHTML = `<div class="card"><h3>Watch a for loop run</h3><p>Change the numbers, then press Step. Try a negative step like -1 with start 5 and stop 0.</p>
    <div class="demo"><label>start <input id="a" type="number" value="0"></label><label>stop <input id="b" type="number" value="5"></label><label>step <input id="c" type="number" value="1"></label></div>
    <pre id="pc"></pre><div class="boxes" id="bx"></div><p id="cap"></p><div class="bar"><button id="st">Step ▶</button><button id="rs">Restart</button><button id="ed">Open in the editor</button></div></div>`;
    const $ = s => el.querySelector(s); let i = 0, vals = [];
    const code = () => `for i in range(${+$('#a').value}, ${+$('#b').value}, ${+$('#c').value || 1}):\n    print(i)\n`;
    function build() {
      const a = +$('#a').value, b = +$('#b').value, c = +$('#c').value; vals = []; i = 0;
      if (c) for (let v = a; (c > 0 ? v < b : v > b) && vals.length < 30; v += c) vals.push(v);
      draw();
    }
    function draw() {
      $('#pc').textContent = code();
      $('#bx').innerHTML = vals.map((v, k) => `<span class="${k === i - 1 ? 'cur' : k < i ? 'on' : ''}">${v}</span>`).join('') || '<em>No values: the loop would not run.</em>';
      $('#cap').textContent = !+$('#c').value ? 'A step of 0 is not allowed in Python.' : i === 0 ? `Press Step. The loop body will run ${vals.length} time(s).` : i < vals.length ? `Round ${i}: i = ${vals[i - 1]}, so print(${vals[i - 1]}).` : `Round ${i}: i = ${vals[i - 1]}. Done! range() stops before it reaches stop.`;
    }
    $('#st').onclick = () => { if (i < vals.length) { i++; draw(); } };
    $('#rs').onclick = build; $('#ed').onclick = () => openInEditor(code());
    el.querySelectorAll('input').forEach(x => x.oninput = build); build();
  }
};
