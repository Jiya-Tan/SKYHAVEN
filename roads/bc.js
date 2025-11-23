// bc.js — BloomTrack-flavored blockchain page (wrapped for safety)

// wait for DOM
document.addEventListener("DOMContentLoaded", () => {

  // ---------- planner ----------
  const planBtn = document.getElementById("planBtn");
  const hoursInput = document.getElementById("hours");
  const weeksInput = document.getElementById("weeks");
  const planResult = document.getElementById("planResult");

  planBtn && planBtn.addEventListener("click", () => {
    const hours = Number(hoursInput.value) || 0;
    const weeks = Number(weeksInput.value) || 0;
    const total = hours * weeks * 4;
    planResult.textContent = `✨ You will study about ${total} hours per level. Keep blooming, cutie! 🌸`;
  });

  // ---------- checklist + progress ----------
  const boxes = document.querySelectorAll("#checklist input");
  const progress = document.getElementById("progress");
  const progressText = document.getElementById("progressText");

  function updateProgressUI() {
    const done = [...boxes].filter(b => b.checked).length;
    if (progress) progress.value = done;
    if (progressText) progressText.textContent = `${done}/${boxes.length}`;
  }

  boxes.forEach(box => {
    box.addEventListener("change", () => {
      updateProgressUI();
      // optional: persist to localStorage
      const obj = {};
      boxes.forEach(c => obj[c.dataset.key] = c.checked);
      localStorage.setItem('bc_checks', JSON.stringify(obj));
    });
  });

  // load persisted checks
  try {
    const raw = localStorage.getItem('bc_checks');
    if (raw) {
      const obj = JSON.parse(raw);
      boxes.forEach(c => c.checked = !!obj[c.dataset.key]);
      updateProgressUI();
    }
  } catch (e) { /* ignore */ }

  // ---------- simple blockchain simulator ----------
  class Block {
    constructor(index, timestamp, txs, prevHash = "") {
      this.index = index;
      this.timestamp = timestamp;
      this.txs = txs;
      this.prevHash = prevHash;
      this.hash = "";
      this.nonce = 0;
    }
  }

  const pending = [];
  const chain = [];

  // tiny safe helpers (elements may not exist)
  const pendingList = document.getElementById("pendingList");
  const chainWrap = document.getElementById("chainWrap");
  const simFeedback = document.getElementById("simFeedback");
  const addTx = document.getElementById("addTx");
  const txFrom = document.getElementById("txFrom");
  const txTo = document.getElementById("txTo");
  const txAmount = document.getElementById("txAmount");
  const mineBtn = document.getElementById("mineBtn");
  const verifyBtn = document.getElementById("verifyBtn");
  const difficulty = document.getElementById("difficulty");

  // you'll need CryptoJS included for SHA256; if not present, fallback to a simple hash
  function calculateHash(block) {
    if (window.CryptoJS && CryptoJS.SHA256) {
      return CryptoJS.SHA256(
        block.index + block.timestamp + JSON.stringify(block.txs) + block.prevHash + block.nonce
      ).toString();
    }
    // fallback: simple (not secure) hash for demo
    return String(Math.abs(JSON.stringify(block).split("").reduce((a,c)=>a*31 + c.charCodeAt(0), 7))).slice(0,32);
  }

  function mine(block, diff) {
    block.hash = calculateHash(block);
    while (block.hash.substring(0, diff) !== "0".repeat(diff)) {
      block.nonce++;
      block.hash = calculateHash(block);
      // prevent freezing the UI in case diff too high
      if (block.nonce % 100000 === 0) {
        // allow UI update
      }
    }
  }

  // render helpers
  function renderPending() {
    if (!pendingList) return;
    pendingList.innerHTML = pending.map(t => `<li>${escapeHtml(t.from)} → ${escapeHtml(t.to)} : ${escapeHtml(String(t.amount))}</li>`).join("");
  }
  function renderChain() {
    if (!chainWrap) return;
    chainWrap.innerHTML = chain.map(b => `
      <div class="card" style="margin:10px 0;">
        <strong>Block ${b.index}</strong><br>
        Hash: ${escapeHtml(b.hash)}<br>
        Prev: ${escapeHtml(b.prevHash)}<br>
        Tx count: ${b.txs.length}
      </div>
    `).join("");
  }

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }

  // add tx
  addTx && addTx.addEventListener("click", () => {
    if (!txFrom || !txTo || !txAmount) return;
    if (!txFrom.value || !txTo.value || !txAmount.value) return;
    pending.push({ from: txFrom.value, to: txTo.value, amount: Number(txAmount.value) });
    renderPending();
  });

  // mine
  mineBtn && mineBtn.addEventListener("click", () => {
    if (!difficulty) return;
    if (pending.length === 0) {
      if (simFeedback) simFeedback.textContent = "No pending transactions to mine.";
      return;
    }
    const prev = chain.length ? chain[chain.length - 1].hash : "0";
    const block = new Block(chain.length, Date.now(), [...pending], prev);
    const diff = Math.min(6, Math.max(1, Number(difficulty.value) || 3));
    // perform mining (blocking but fine for tiny demos)
    mine(block, diff);
    chain.push(block);
    pending.length = 0;
    renderPending();
    renderChain();
    if (simFeedback) simFeedback.textContent = "🌸 Block mined successfully!";
  });

  // verify
  verifyBtn && verifyBtn.addEventListener("click", () => {
    for (let i = 1; i < chain.length; i++) {
      if (chain[i].prevHash !== chain[i-1].hash) {
        if (simFeedback) simFeedback.textContent = "❌ Chain is invalid!";
        return;
      }
    }
    if (simFeedback) simFeedback.textContent = "✔️ Chain integrity verified — blooming beautifully!";
  });

  // initial render
  renderPending();
  renderChain();

});


