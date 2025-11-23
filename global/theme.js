


// 🌸 SETTINGS POPUP
const settingsBtn = document.getElementById("settingsBtn");
const themePopup = document.getElementById("themePopup");
const closePopup = document.getElementById("closePopup");

settingsBtn.addEventListener("click", () => {
    themePopup.style.display = "flex";
});

closePopup.addEventListener("click", () => {
    themePopup.style.display = "none";
});

// Close popup on outside click
themePopup.addEventListener("click", (e) => {
    if (e.target === themePopup) {
        themePopup.style.display = "none";
    }
});

// 🌸 THEME SWITCHING
const themeChoices = document.querySelectorAll(".theme-choice");

// load saved theme
const savedTheme = localStorage.getItem("bloomtrack-theme");
if (savedTheme) {
    document.body.classList.add(savedTheme);
}

themeChoices.forEach(btn => {
    btn.addEventListener("click", () => {
        const theme = btn.getAttribute("data-theme");

        // remove old themes
        document.body.classList.remove("sunset", "night");

        // apply new theme
        if (theme !== "default") {
            document.body.classList.add(theme);
        }

        // save theme
        localStorage.setItem("bloomtrack-theme", theme);

        // close popup
        themePopup.style.display = "none";
    });
});

// 🌸 Load saved theme when page loads
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("bloomtrack-theme");

    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
    }
});

// 🌸 Theme buttons action
function setTheme(themeName) {
    document.documentElement.setAttribute("data-theme", themeName);
    localStorage.setItem("bloomtrack-theme", themeName);
}

function toggleThemePopup() {
    document.getElementById("themePopup").classList.toggle("show");
}

