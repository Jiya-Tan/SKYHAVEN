let timer;
let timeLeft;
let isBreak = false;
let isRunning = false;

let focusMinutes = 25;
let breakMinutes = 5;

// DOM
const display = document.getElementById("display");
const statusText = document.getElementById("status");
const focusInput = document.getElementById("focusTime");

// Circle ring animation setup
const circle = document.querySelector(".progress-ring__circle");
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = 0;

// Update circular progress
function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

// Calculate break = 20% of focus
function calculateBreakTime() {
    breakMinutes = Math.floor(focusMinutes * 0.20);
}

// Apply user input time
function applyCustomTime() {
    const val = parseInt(focusInput.value);
    if (!val || val <= 0) return alert("Enter valid minutes!");

    focusMinutes = val;
    calculateBreakTime();
    resetTimer();
}

// Start timer
function startTimer() {
    if (isRunning) return;

    isRunning = true;

    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();

        let total = isBreak ? breakMinutes * 60 : focusMinutes * 60;
        let percent = ((total - timeLeft) / total) * 100;
        setProgress(percent);

        if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;

            if (!isBreak) {
                // Switch to break
                isBreak = true;
                timeLeft = breakMinutes * 60;
                statusText.textContent = `Break Time 💗 (${breakMinutes} min)`;
            } else {
                // Switch to focus
                isBreak = false;
                timeLeft = focusMinutes * 60;
                statusText.textContent = `Focus Mode 🔥 (${focusMinutes} min)`;
            }

            setProgress(0);
            updateDisplay();
        }
    }, 1000);
}

// Pause
function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

// Reset
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isBreak = false;

    timeLeft = focusMinutes * 60;
    statusText.textContent = `Focus Mode 🔥 (${focusMinutes} min)`;

    setProgress(0);
    updateDisplay();
}

// Display
function updateDisplay() {
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    display.textContent = 
        `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Init
(function init() {
    timeLeft = focusMinutes * 60;
    updateDisplay();
})();
