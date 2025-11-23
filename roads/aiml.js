// BloomTrack AI/ML roadmap — planner, quiz, playground, checklist (with persistence)
document.addEventListener("DOMContentLoaded", function() {
    // all your aiml.js code here
    // ---------- planner ----------
function generatePlan(hours, weeks) {
  const topics = [
    { title: 'Python & tools', hrs: 0.25 },
    { title: 'Math (LA/Calc/Prob)', hrs: 0.25 },
    { title: 'Core ML (sklearn)', hrs: 0.2 },
    { title: 'Deep Learning', hrs: 0.15 },
    { title: 'Projects & practice', hrs: 0.15 }
  ];
  let out = [];
  for (let i = 1; i <= 4; i++) {
    let totalHours = hours * weeks;
    out.push({
      level: i,
      hours: totalHours,
      breakdown: topics.map(t => ({ topic: t.title, hrs: Math.round(totalHours * t.hrs) }))
    });
  }
  return out;
}

document.getElementById('planBtn').addEventListener('click', () => {
  const h = Number(document.getElementById('hours').value) || 10;
  const w = Number(document.getElementById('weeks').value) || 6;
  const plan = generatePlan(h, w);
  const el = document.getElementById('planResult');
  el.innerHTML = '';
  plan.forEach(p => {
    const div = document.createElement('div');
    div.style.marginBottom = '8px';
    div.innerHTML = `<strong>Level ${p.level} — ${p.hours} hours</strong><br><small class='muted'>${p.breakdown.map(b => b.topic + ': ' + b.hrs + 'h').join(' • ')}</small>`;
    el.appendChild(div);
  });
});



// ---------- playground ----------
const preview = document.getElementById('preview');
document.getElementById('runBtn').addEventListener('click', () => {
  const code = document.getElementById('playCode').value || '<h3>Nothing to run</h3>';
  const src = `data:text/html;charset=utf-8,${encodeURIComponent(code)}`;
  preview.src = src;
});
document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('playCode').value = '';
  preview.src = 'about:blank';
});

// ---------- checklist localStorage ----------
const checks = document.querySelectorAll('#checklist input[type=checkbox]');
function saveChecks() {
  const obj = {};
  checks.forEach(c => obj[c.dataset.key] = c.checked);
  localStorage.setItem('ai_checks', JSON.stringify(obj));
  updateProgress();
}
function loadChecks() {
  const raw = localStorage.getItem('ai_checks');
  if (!raw) return;
  try {
    const obj = JSON.parse(raw);
    checks.forEach(c => c.checked = !!obj[c.dataset.key]);
  } catch (e) { }
  updateProgress();
}
function updateProgress() {
  const total = checks.length;
  const done = Array.from(checks).filter(c => c.checked).length;
  document.getElementById('progress').value = done;
  document.getElementById('progressText').textContent = done + '/' + total;
}
checks.forEach(c => c.addEventListener('change', saveChecks));
loadChecks();

// ---------- seed playground ----------
document.getElementById('playCode').value = '<!doctype html>\n<html><body><h1>ML tip</h1><p>Always validate with a held-out test set.</p></body></html>';



});



