let timer;
let timeLeft = 1500;
let running = false;

const display = document.getElementById("timeDisplay");
const timerCircle = document.getElementById("timerCircle");
const endSound = document.getElementById("endSound");
const bgSound = document.getElementById("bgSound");

/* ---------------- TIMER ---------------- */
function updateDisplay() {
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    display.textContent = `${m}:${s < 10 ? "0" : ""}${s}`;
}

function startTimer() {
    if (running) return;
    running = true;
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timer);
            running = false;
            timerCircle.classList.add("timer-glow");
            endSound.play();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    running = false;
}

function resetTimer() {
    clearInterval(timer);
    running = false;
    timeLeft = 1500;
    updateDisplay();
    timerCircle.classList.remove("timer-glow");
}

function setTimer() {
    const mins = document.getElementById("customTime").value;
    if (mins > 0) {
        timeLeft = mins * 60;
        updateDisplay();
    }
}

/* ---------------- SETTINGS ---------------- */
function openSettings() {
    document.getElementById("settingsPanel").classList.add("open");
}

function closeSettings() {
    document.getElementById("settingsPanel").classList.remove("open");
}

function changeBG(color) {
    document.body.style.background = color;
}

function uploadBG(event) {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        document.body.style.backgroundImage = `url(${url})`;
    }
}

function changeSound() {
    const sound = document.getElementById("soundSelect").value;
    bgSound.src = sound;
    if (sound) bgSound.play();
    else bgSound.pause();
}

/* ---------------- TASK LIST ---------------- */
document.getElementById("addTaskBtn").onclick = addTask;

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    if (taskInput.value.trim() === "") return;

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const text = document.createElement("span");
    text.innerText = taskInput.value;

    checkbox.onchange = () => {
        taskDiv.classList.toggle("completed");
    };

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(text);
    taskList.appendChild(taskDiv);

    taskInput.value = "";
}

updateDisplay();

/* ---------------- MOTIVATIONAL POPUP ---------------- */
const quotes = [
    "You're doing amazing sweetie 💗📚",
    "Small steps still count 💕",
    "Future you will thank you 🌸",
    "Stay consistent, stay magical ✨",
    "Even 1% better a day = success 🌟"
];

window.onload = () => {
    document.getElementById("quoteText").textContent =
        quotes[Math.floor(Math.random() * quotes.length)];

    document.getElementById("quotePopup").style.display = "block";
};

function closeQuote() {
    document.getElementById("quotePopup").style.display = "none";
}
