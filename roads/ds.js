// PLAN GENERATOR
document.getElementById("planBtn").addEventListener("click", () => {
  let h = Number(document.getElementById("hours").value);
  let w = Number(document.getElementById("weeks").value);

  let total = h * w;

  document.getElementById("planResult").innerHTML =
    `✨ <b>Your Study Plan</b> ✨ <br><br>
     Spend <b>${total} hrs</b> per level 🌸<br>
     At ${h} hrs/week → <b>${w} weeks</b> per level 💗`;
});


// QUIZ CHECKER
document.getElementById("checkQuiz").addEventListener("click", () => {
  let ans = document.getElementById("quizAnswer").value.toLowerCase();
  let fb = document.getElementById("quizFeedback");

  if (ans.includes("evaluation") || ans.includes("overfitting") || ans.includes("model")) {
    fb.textContent = "Correct! 💜 Cross-validation checks model stability.";
  } else {
    fb.textContent = "Not quite! Try again 🌸";
  }
});


// CSV PREVIEW
document.getElementById("csvFile").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const rows = e.target.result.split("\n").slice(0, 10);

    let html = "<table>";
    rows.forEach((row) => {
      html += "<tr>";
      row.split(",").forEach((cell) => {
        html += `<td>${cell}</td>`;
      });
      html += "</tr>";
    });
    html += "</table>";

    document.getElementById("tableWrap").innerHTML = html;
  };

  reader.readAsText(file);
});


// CHECKLIST SAVE
const checks = document.querySelectorAll("input[type='checkbox']");
const progress = document.getElementById("progress");
const pText = document.getElementById("progressText");

checks.forEach(chk => {
  chk.addEventListener("change", updateProgress);
});

// Load saved
checks.forEach(chk => {
  let key = chk.getAttribute("data-key");
  chk.checked = localStorage.getItem(key) === "true";
});
updateProgress();

function updateProgress() {
  let done = 0;
  checks.forEach(chk => {
    let key = chk.getAttribute("data-key");
    localStorage.setItem(key, chk.checked);
    if (chk.checked) done++;
  });

  progress.value = done;
  pText.textContent = `${done}/5`;
}


// SPARKLINE CHART
document.getElementById("drawChart").addEventListener("click", () => {
  let arr = [];
  try {
    arr = JSON.parse(document.getElementById("chartData").value);
  } catch {
    alert("Invalid JSON!");
    return;
  }

  const canvas = document.getElementById("spark");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let w = canvas.width;
  let h = canvas.height;

  let max = Math.max(...arr);
  let min = Math.min(...arr);

  ctx.beginPath();
  arr.forEach((v, i) => {
    let x = (i / (arr.length - 1)) * w;
    let y = h - ((v - min) / (max - min)) * h;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.strokeStyle = "#9f72ff";
  ctx.lineWidth = 2;
  ctx.stroke();
});

document.getElementById("clearChart").addEventListener("click", () => {
  const canvas = document.getElementById("spark");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
