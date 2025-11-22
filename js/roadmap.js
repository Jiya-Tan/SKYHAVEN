// BloomTrack — roadmap.js
// Loads roadmap data + shows modal

async function loadRoadmapData() {
    const res = await fetch('../data/roadmaps.json');
    return await res.json();
}

async function openRoadmap(key) {
    const data = await loadRoadmapData();
    const roadmap = data[key];

    document.getElementById('roadmapTitle').innerText = roadmap.title;

    // Steps
    const list = document.getElementById('roadmapList');
    list.innerHTML = '';
    roadmap.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        list.appendChild(li);
    });

    // Resources
    const resList = document.getElementById('resourceList');
    resList.innerHTML = '';
    roadmap.resources.forEach(r => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${r.link}" target="_blank">${r.name}</a>`;
        resList.appendChild(li);
    });

    document.getElementById('roadmapModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('roadmapModal').classList.add('hidden');
}
