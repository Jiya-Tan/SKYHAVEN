/* BloomTrack Mental • Combined A+B JS
   - breathing animation + adjustable cycle
   - floating blobs (CSS)
   - mood tracker (save)
   - background sound (play/upload/generate)
   - background image presets + upload
   - settings popup (save to localStorage)
   - motivational popup on open
   - journal save + stats
*/

(() => {
  // DOM refs
  const motivationPopup = document.getElementById('motivationPopup');
  const motivationText = document.getElementById('motivationText');
  const closeMotivation = document.getElementById('closeMotivation');

  const breathCircle = document.getElementById('breathCircle');
  const breathLabel = document.getElementById('breathLabel');
  const breathTimer = document.getElementById('breathTimer');
  const breathLengthInput = document.getElementById('breathLength');
  const startBreathBtn = document.getElementById('startBreath');
  const stopBreathBtn = document.getElementById('stopBreath');

  const newAffirmationBtn = document.getElementById('newAffirmation');
  const affirmationText = document.getElementById('affirmationText');
  const newTipBtn = document.getElementById('newTip');
  const tipText = document.getElementById('tipText');

  const moodBtns = document.querySelectorAll('.mood-btn');
  const moodSaved = document.getElementById('moodSaved');

  const soundSelect = document.getElementById('soundSelect');
  const playSound = document.getElementById('playSound');
  const pauseSound = document.getElementById('pauseSound');
  const soundVol = document.getElementById('soundVol');
  const bgAudio = document.getElementById('bgAudio');

  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const settingsPanel = document.getElementById('settingsPanel');
  const closeSettings = document.getElementById('closeSettings');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  const bgPreset = document.getElementById('bgPreset');
  const uploadBg = document.getElementById('uploadBg');
  const panelSound = document.getElementById('panelSound');
  const uploadAudio = document.getElementById('uploadAudio');
  const themeSelect = document.getElementById('themeSelect');

  const journalInput = document.getElementById('journalInput');
  const saveJournal = document.getElementById('saveJournal');
  const clearJournal = document.getElementById('clearJournal');
  const journalSaved = document.getElementById('journalSaved');

  const sessionsCountEl = document.getElementById('sessionsCount');
  const totalMinutesEl = document.getElementById('totalMinutes');
  const resetStats = document.getElementById('resetStats');

  // helper state
  let breathInterval = null;
  let breathRunning = false;

  let audioCtx = null;
  let noiseNode = null;

  function tryNotify() {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") Notification.requestPermission().catch(()=>{});
  }
  tryNotify();

  // motivational popup (random)
  const quotes = [
    "Small progress is still progress — keep going! ✨",
    "You're closer than you think. One step at a time. 🌱",
    "Take a moment — breathe, then continue. 💗",
    "Consistency beats intensity. Do a little today. 💜",
    "You are allowed to rest and still be productive. 🌸"
  ];

  function showMotivation() {
    const q = quotes[Math.floor(Math.random()*quotes.length)];
    motivationText.textContent = q;
    motivationPopup.style.display = 'block';
  }
  closeMotivation.addEventListener('click', () => motivationPopup.style.display = 'none');

  // breathing: simple pulse driven by CSS class + timer label
  function startBreathing(cycleSec = 4) {
    stopBreathing();
    breathRunning = true;
    breathCircle.classList.add('pulse');
    breathTimer.textContent = `${cycleSec}s`;
    let state = 0; // 0 inhale, 1 hold, 2 exhale
    const inhale = Math.max(1, Math.round(cycleSec*0.4));
    const hold = Math.max(0, Math.round(cycleSec*0.2));
    const exhale = Math.max(1, cycleSec - inhale - hold);
    // sequence durations in seconds
    const seq = [inhale, hold, exhale];
    let idx = 0;
    breathLabel.textContent = 'Inhale';
    let localCounter = seq[idx];
    breathTimer.textContent = `${localCounter}s`;
    breathInterval = setInterval(()=>{
      localCounter--;
      breathTimer.textContent = `${localCounter}s`;
      if (localCounter <= 0) {
        idx = (idx+1) % seq.length;
        localCounter = seq[idx];
        if (idx === 0) breathLabel.textContent = 'Inhale';
        else if (idx === 1) breathLabel.textContent = 'Hold';
        else breathLabel.textContent = 'Exhale';
      }
    }, 1000);
  }
  function stopBreathing(){
    if (breathInterval) clearInterval(breathInterval);
    breathInterval = null;
    breathRunning = false;
    breathCircle.classList.remove('pulse');
    breathLabel.textContent = 'Breathe';
    breathTimer.textContent = `${breathLengthInput.value}s`;
  }

  startBreathBtn.addEventListener('click', ()=>{
    const v = Math.max(2, Number(breathLengthInput.value) || 4);
    startBreathing(v);
  });
  stopBreathBtn.addEventListener('click', ()=> stopBreathing());

  // affirmations / tips
  const affirmations = [
    "You are doing your best, and that’s enough. ♡",
    "You are growing at your own pace — and that is beautiful.",
    "Your mind is a garden. Water it with kindness. 🪴",
    "You deserve rest, love, and softness today.",
    "Every small step you take matters. Proud of you! 💗"
  ];
  const tips = [
    "Take a 2-minute breathing break: inhale 4s, hold 4s, exhale 4s.",
    "Drink a glass of water — your brain needs hydration!",
    "Stretch your shoulders for 30s — your body will thank you.",
    "Write down 3 things you're grateful for today.",
    "Step outside for 5 minutes and breathe fresh air."
  ];

  function newAffirmation(){ affirmationText.textContent = affirmations[Math.floor(Math.random()*affirmations.length)]; }
  function newTip(){ tipText.textContent = tips[Math.floor(Math.random()*tips.length)]; }

  newAffirmationBtn.addEventListener('click', newAffirmation);
  newTipBtn.addEventListener('click', newTip);

  // mood tracker
  moodBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const mood = btn.dataset.mood;
      localStorage.setItem('bt_mood', mood);
      moodSaved.textContent = `Saved mood: ${mood}`;
      // tiny confetti / pulse
      btn.animate([{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:300});
    });
  });
  const savedMood = localStorage.getItem('bt_mood');
  if (savedMood) moodSaved.textContent = `Saved mood: ${savedMood}`;

  // audio helpers: white/brown noise generation
  function startWhiteNoise(vol=0.45){
    stopNoise();
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = 2 * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i=0;i<bufferSize;i++) data[i] = Math.random()*2-1;
    const src = audioCtx.createBufferSource(); src.buffer = buffer; src.loop = true;
    const gain = audioCtx.createGain(); gain.gain.value = vol;
    src.connect(gain); gain.connect(audioCtx.destination); src.start();
    noiseNode = { src, gain, type: 'white' };
    localStorage.setItem('bt_bgSound','white');
  }
  function startBrownNoise(vol=0.45){
    stopNoise();
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = 2 * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i=0;i<bufferSize;i++){
      const white = Math.random()*2-1;
      output[i] = (lastOut + (0.02 * white))/1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }
    const src = audioCtx.createBufferSource(); src.buffer = buffer; src.loop = true;
    const gain = audioCtx.createGain(); gain.gain.value = vol;
    src.connect(gain); gain.connect(audioCtx.destination); src.start();
    noiseNode = { src, gain, type: 'brown' };
    localStorage.setItem('bt_bgSound','brown');
  }
  function stopNoise(){
    try{ if (noiseNode) { noiseNode.src.stop(); noiseNode=null; } if (audioCtx) { audioCtx.close(); audioCtx=null; } }catch(e){}
    localStorage.removeItem('bt_bgSound');
  }

  // sound select handlers
  const cdn = {
    calm: 'https://cdn.pixabay.com/download/audio/2023/03/06/audio_4b14d2f0c9.mp3',
    rain: 'https://cdn.pixabay.com/download/audio/2021/09/16/audio_4d1d98694d.mp3',
    piano: 'https://cdn.pixabay.com/download/audio/2022/03/16/audio_dfe043b1e4.mp3'
  };

  playSound.addEventListener('click', ()=>{
    const v = soundSelect.value;
    stopNoise();
    if (v === 'white') return startWhiteNoise(Number(soundVol.value||0.45));
    if (v === 'brown') return startBrownNoise(Number(soundVol.value||0.45));
    if (v && cdn[v]){
      bgAudio.src = cdn[v]; bgAudio.volume = Number(soundVol.value||0.45);
      bgAudio.play().catch(()=>{});
      localStorage.setItem('bt_bgSrc', cdn[v]);
    }
  });
  pauseSound.addEventListener('click', ()=> {
    try{ bgAudio.pause(); }catch(e){}
    stopNoise();
  });
  soundVol.addEventListener('input', ()=> {
    try { bgAudio.volume = Number(soundVol.value); } catch(e){}
    if (noiseNode) {
      try { noiseNode.gain.gain.value = Number(soundVol.value); } catch(e) {}
    }
    localStorage.setItem('bt_bgVol', soundVol.value);
  });

  // settings open/close
  openSettingsBtn.addEventListener('click', ()=> settingsPanel.classList.add('open'));
  closeSettings.addEventListener('click', ()=> settingsPanel.classList.remove('open'));
  cancelSettingsBtn.addEventListener('click', ()=> settingsPanel.classList.remove('open'));

  // apply/save settings
  saveSettingsBtn.addEventListener('click', ()=>{
    const bg = bgPreset.value;
    if (bg) {
      document.getElementById('page-body').style.backgroundImage = `url('${bg}')`;
      localStorage.setItem('bt_bgImage', bg);
    }
    // uploaded bg handled elsewhere
    const pSound = panelSound.value;
    if (pSound && cdn[pSound]) {
      localStorage.setItem('bt_bgSound', pSound);
      bgAudio.src = cdn[pSound]; bgAudio.play().catch(()=>{});
    }
    // uploaded audio processed earlier
    const theme = themeSelect.value;
    localStorage.setItem('bt_theme', theme);
    applyTheme(theme);

    settingsPanel.classList.remove('open');
  });

  // background preset + upload handling
  const savedBg = localStorage.getItem('bt_bgImage');
  if (savedBg) {
    document.getElementById('page-body').style.backgroundImage = `url('${savedBg}')`;
    document.getElementById('page-body').style.backgroundSize = 'cover';
  }
  uploadBg.addEventListener('change', (ev)=>{
    const f = ev.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = e => {
      const url = e.target.result;
      document.getElementById('page-body').style.backgroundImage = `url('${url}')`;
      document.getElementById('page-body').style.backgroundSize = 'cover';
      localStorage.setItem('bt_bgImage', url);
    };
    r.readAsDataURL(f);
  });

  // upload audio
  uploadAudio.addEventListener('change', (ev)=>{
    const f = ev.target.files[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    bgAudio.src = url; bgAudio.play().catch(()=>{});
    localStorage.setItem('bt_bgSrc', url);
  });

  // theme application
  function applyTheme(key){
    if (key === 'bloom') {
      document.body.style.background = 'linear-gradient(180deg,#f9f5ff,#efe8ff)';
      document.documentElement.style.setProperty('--accent','#7c4dff');
      document.documentElement.style.setProperty('--accent-2','#ff8acb');
    } else if (key === 'calm') {
      document.body.style.background = 'linear-gradient(180deg,#0f1724,#071028)';
      document.documentElement.style.setProperty('--accent','#6ee7b7');
      document.documentElement.style.setProperty('--accent-2','#60a5fa');
    } else if (key === 'sunny') {
      document.body.style.background = 'linear-gradient(180deg,#fff7ed,#fff1e6)';
      document.documentElement.style.setProperty('--accent','#fb923c');
      document.documentElement.style.setProperty('--accent-2','#fb7185');
    }
  }
  // load saved theme
  const savedTheme = localStorage.getItem('bt_theme') || 'bloom';
  applyTheme(savedTheme);
  themeSelect.value = savedTheme;

  // journal save
  saveJournal.addEventListener('click', ()=>{
    const text = journalInput.value.trim();
    if (!text) { journalSaved.textContent = 'Write something first'; return; }
    localStorage.setItem('bt_journal', JSON.stringify({text, at: Date.now()}));
    journalSaved.textContent = 'Saved!';
    setTimeout(()=> journalSaved.textContent='', 1800);
  });
  clearJournal.addEventListener('click', ()=> { journalInput.value=''; localStorage.removeItem('bt_journal'); journalSaved.textContent='Cleared'; setTimeout(()=>journalSaved.textContent='',1400); });

  // stats (simple): increment when user uses breathing start
  let sessions = Number(localStorage.getItem('bt_sessions')||0);
  let minutes = Number(localStorage.getItem('bt_minutes')||0);
  sessionsCountEl.textContent = sessions;
  totalMinutesEl.textContent = minutes;

  startBreathBtn.addEventListener('click', ()=> {
    sessions++;
    localStorage.setItem('bt_sessions', sessions);
    sessionsCountEl.textContent = sessions;
    // approximate minutes add by breath length * 0.07 (tiny), for demo we add 1
    minutes += 1;
    localStorage.setItem('bt_minutes', minutes);
    totalMinutesEl.textContent = minutes;
  });

  resetStats.addEventListener('click', ()=> { if (!confirm('Reset focus stats?')) return; localStorage.removeItem('bt_sessions'); localStorage.removeItem('bt_minutes'); sessions=0;minutes=0; sessionsCountEl.textContent=0; totalMinutesEl.textContent=0; });

  // apply saved bg audio src if any
  const savedBgSrc = localStorage.getItem('bt_bgSrc') || '';
  if (savedBgSrc) { bgAudio.src = savedBgSrc; bgAudio.volume = Number(localStorage.getItem('bt_bgVol')||0.45); }

  // load saved sound preference
  const savedSound = localStorage.getItem('bt_bgSound') || '';
  if (savedSound) {
    if (savedSound === 'white') startWhiteNoise(Number(localStorage.getItem('bt_bgVol')||0.45));
    else if (savedSound === 'brown') startBrownNoise(Number(localStorage.getItem('bt_bgVol')||0.45));
    else if (cdn[savedSound]) { bgAudio.src = cdn[savedSound]; bgAudio.play().catch(()=>{}); }
    soundSelect.value = savedSound;
  }

  // mood display if saved
  const m = localStorage.getItem('bt_mood'); if (m) moodSaved.textContent = `Saved mood: ${m}`;

  // play/pause quick controls (right column)
  playSound.addEventListener('click', ()=> { try { bgAudio.play().catch(()=>{}); } catch(e){} });
  pauseSound.addEventListener('click', ()=> { try { bgAudio.pause(); } catch(e){} });

  // keyboard: Esc close settings
  window.addEventListener('keydown', (e)=> {
    if (e.key === 'Escape') { settingsPanel.classList.remove('open'); motivationPopup.style.display='none'; }
  });

  // show motivational popup on first visit (or every load)
  setTimeout(()=> showMotivation(), 600);

})();
