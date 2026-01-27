let data = null;
let voted = false;

async function load() {
  try {
    const r = await fetch("/api/pools");
    if (!r.ok) return;
    data = await r.json();
    render();
    countdown(new Date(data.end));
  } catch (e) {
    console.error(e);
  }
}

function render() {
  data.options.forEach((o, i) => {
    const card = document.getElementById(`opt-${i}`);
    document.getElementById(`name-${i}`).innerText = o.name;
    card.dataset.id = o.id;
    if (voted) refresh(i);
  });
}

async function vote(idx) {
  if (voted) return;
  const id = document.getElementById(`opt-${idx}`).dataset.id;
  try {
    voted = true;
    const r = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_option: parseInt(id) }),
    });
    if (!r.ok) throw new Error();
    const res = await r.json();
    data.options.forEach(o => {
      const up = res.options.find(n => n.id === o.id);
      if (up) o.votes = up.votes;
    });
    data.total = res.total;
    document.querySelectorAll('.option-box').forEach(b => b.classList.add('voted'));
    data.options.forEach((_, i) => refresh(i));
    document.getElementById("votedReference").innerText = `VOCÊ E OUTRAS ${data.total - 1} PESSOAS JÁ VOTARAM.`;
  } catch (e) {
    voted = false;
  }
}

function refresh(idx) {
  const total = data.total || 1;
  const perc = Math.round((data.options[idx].votes / total) * 100);
  document.getElementById(`perc-${idx}`).innerText = `${perc}%`;
  document.getElementById(`bar-${idx}`).style.width = `${perc}%`;
}

function countdown(end) {
  const el = document.getElementById("timerReference");
  const tick = () => {
    const diff = end - new Date();
    if (diff <= 0) {
      el.innerText = "NOVA RODADA!";
      return setTimeout(() => window.location.reload(), 2000);
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.innerText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };
  tick();
  setInterval(tick, 1000);
}

load();
