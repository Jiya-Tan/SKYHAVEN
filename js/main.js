// 🌸 BloomTrack — main.js
// Handles: motivational quotes, reminders, UI effects

// ✨ Random motivational lines
const quotes = [
    "You're blooming beautifully today 🌸",
    "One tiny step can change your whole future ✨",
    "You are capable of amazing things 💗",
    "Believe in your slow, gentle growth 🌿",
    "Proud of you for trying, darling ♡",
    "Your dreams miss you, go study a little ✨"
];

function showRandomQuote() {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    alert(q);
}

// Show quote every 3 minutes\setInterval(showRandomQuote, 180000);

// 🌼 Deadline reminder system (localStorage)
function checkDeadlines() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const now = new Date();
    tasks.forEach(task => {
        const due = new Date(task.dueDate);
        if (due - now < 3600000 && !task.notified) { // 1 hr left
            alert(`Reminder: "${task.title}" is due soon! ⏳`);
            task.notified = true;
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

setInterval(checkDeadlines, 60000); // check every 1 min

// 🌺 Smooth page fade-in
window.onload = () => {
    document.body.classList.add("fade-in");
};