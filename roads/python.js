// WEEKLY PLAN
document.getElementById("planBtn").onclick = () => {
  let h = Number(hours.value);
  let w = Number(weeks.value);

  let total = h * w;
  planResult.innerHTML = `
    <b>${total} hrs</b> per level 🌸<br>
    <b>${total * 4} hrs</b> for all 4 levels ✨
  `;
};

// QUIZ
document.getElementById("checkQuiz").onclick = () => {
  let ans = quizAnswer.value.toLowerCase();
  let fb = document.getElementById("quizFeedback");

  if (ans.includes("yield") || ans.includes("lazy")) {
    fb.innerHTML = "Correct! Generators produce values lazily 🌼";
    fb.style.color = "lightgreen";
  } else {
    fb.innerHTML = "Hint: mention <b>yield</b> + lazy evaluation 💗";
    fb.style.color = "crimson";
  }
};

// CHECKLIST
let boxes = document.querySelectorAll("#checklist input");
let progress = document.getElementById("progress");
let progressText = document.getElementById("progressText");

function updateProgress(){
  let done = [...boxes].filter(x => x.checked).length;
  progress.value = done;
  progressText.innerHTML = `${done}/5 completed 🌸`;
}
boxes.forEach(x => x.addEventListener("change", updateProgress));
updateProgress();

// SNIPPETS
const snippets = {
  hello: `import sys
name = sys.argv[1] if len(sys.argv)>1 else "friend"
print("Hello,", name)`,
  readcsv: `import pandas as pd
df = pd.read_csv("data.csv")
print(df.head())`,
  flask: `from flask import Flask
app = Flask(__name__)

@app.get("/")
def home():
    return "Hello from Flask!"

app.run()`
};

snippetSelect.onchange = () => {
  snippetPreview.textContent = snippets[snippetSelect.value];
};

snippetSelect.onchange();

// DOWNLOAD
downloadBtn.onclick = () => {
  let text = snippetPreview.textContent;
  let file = new Blob([text], {type:"text/plain"});
  let a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = `${snippetSelect.value}.py`;
  a.click();
};

// OPEN IN REPLIT
runOnline.href =
  "https://replit.com/languages/python3";
