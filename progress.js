// Saves XP and finished challenges in localStorage (this browser only).
const Progress = (() => {
  const K = 'pythonlab.v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(K)) || { xp: 0, done: {} }; } catch (e) { return { xp: 0, done: {} }; } };
  let s = load();
  const save = () => { try { localStorage.setItem(K, JSON.stringify(s)); } catch (e) {} };
  return {
    get: () => s, isDone: id => !!s.done[id], level: () => Math.floor(s.xp / 50) + 1,
    complete(id, xp) { if (s.done[id]) return false; s.done[id] = 1; s.xp += xp; save(); return true; },
    reset() { s = { xp: 0, done: {} }; save(); }
  };
})();
