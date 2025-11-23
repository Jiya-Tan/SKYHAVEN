// cyberSecurity.js — BloomTrack-wrapped Cybersecurity page logic
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Planner ---------- */
  const planBtn = document.getElementById("planBtn");
  const hoursInput = document.getElementById("hours");
  const weeksInput = document.getElementById("weeks");
  const planResult = document.getElementById("planResult");

  if (planBtn) {
    planBtn.addEventListener("click", () => {
      const h = Number(hoursInput.value) || 0;
      const w = Number(weeksInput.value) || 0;
      if (h <= 0 || w <= 0) {
        planResult.textContent = "Please enter valid hours and weeks 💗";
        return;
      }
      const levels = 4;
      const totalHours = h * w * levels;
      planResult.innerHTML = `🌷 <strong>Plan:</strong> ${h} hrs/week × ${w} weeks × ${levels} levels = <strong>${totalHours} hours</strong>`;
    });
  }

  /* ---------- Checklist persistence & progress ---------- */
  const checkboxes = document.querySelectorAll("#checklist input[type='checkbox']");
  const progress = document.getElementById("progress");
  const progressText = document.getElementById("progressText");

  function updateProgress() {
    const done = [...checkboxes].filter(c => c.checked).length;
    if (progress) progress.value = done;
    if (progressText) progressText.textContent = (done === checkboxes.length) ? "✨ Fully Bloomed! 5/5" : `${done}/${checkboxes.length}`;
  }

  checkboxes.forEach(cb => {
    const key = cb.dataset.key;
    const saved = localStorage.getItem("cyber-check-" + key);
    if (saved === "true") cb.checked = true;

    cb.addEventListener("change", () => {
      localStorage.setItem("cyber-check-" + key, cb.checked);
      updateProgress();
    });
  });

  updateProgress();

  /* ---------- Mini Risk Simulator ---------- */
  const addRiskBtn = document.getElementById("addRisk");
  const calcRiskBtn = document.getElementById("calcRisk");
  const assetInput = document.getElementById("asset");
  const threatInput = document.getElementById("threat");
  const impactInput = document.getElementById("impact");
  const riskList = document.getElementById("riskList");
  const simFeedback = document.getElementById("simFeedback");

  let risks = [];

  function renderRisks() {
    if (!riskList) return;
    riskList.innerHTML = "";
    risks.forEach((r, i) => {
      const li = document.createElement("li");
      li.innerHTML = `🌸 <strong>${escapeHtml(r.asset)}</strong> — ${escapeHtml(r.threat)} (Impact: ${escapeHtml(String(r.impact))})
        <button data-i="${i}" class="btn clear smallBtn" style="margin-left:8px;">Remove</button>`;
      riskList.appendChild(li);
    });
    riskList.querySelectorAll(".smallBtn").forEach(b => {
      b.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.dataset.i);
        risks.splice(idx, 1);
        renderRisks();
      });
    });
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }

  if (addRiskBtn) {
    addRiskBtn.addEventListener("click", () => {
      const asset = (assetInput.value || "").trim();
      const threat = (threatInput.value || "").trim();
      const impact = Number(impactInput.value) || 0;
      if (!asset || !threat || impact <= 0) {
        if (simFeedback) simFeedback.textContent = "Please fill asset, threat and impact (1-10).";
        return;
      }
      risks.push({ asset, threat, impact });
      assetInput.value = "";
      threatInput.value = "";
      impactInput.value = "";
      if (simFeedback) simFeedback.textContent = "Risk added 🌷";
      renderRisks();
    });
  }

  if (calcRiskBtn) {
    calcRiskBtn.addEventListener("click", () => {
      if (risks.length === 0) {
        if (simFeedback) simFeedback.textContent = "No risks to calculate. Add a risk first.";
        return;
      }
      const avgImpact = risks.reduce((s, r) => s + r.impact, 0) / risks.length;
      const score = Math.round(avgImpact * (1 + (risks.length - 1) * 0.1));
      if (simFeedback) simFeedback.textContent = `Risk summary — ${risks.length} items, avg impact ${avgImpact.toFixed(1)} → Score: ${score}/10`;
    });
  }

});
