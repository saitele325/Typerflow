/* ============================================
   App — Main State, Event Handling & Rendering
   ============================================ */

const App = (() => {
  // ── State ──────────────────────────────────
  let state = {
    mode: 'words',
    timeDuration: 30,
    wordCount: 50,
    targetText: '',
    charElements: [],
    currentIndex: 0,
    correctCount: 0,
    incorrectCount: 0,
    isStarted: false,
    isFinished: false,
    isPaused: false,
    wpmHistory: [],
    soundEnabled: false
  };

  // ── DOM References ─────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  let els = {};

  function cacheElements() {
    els = {
      textDisplay: $('#textDisplay'),
      hiddenInput: $('#hiddenInput'),
      typingArea: $('#typingArea'),
      timerDisplay: $('#timerDisplay'),
      configBar: $('#configBar'),
      liveStats: $('#liveStats'),
      liveWpm: $('#liveWpm'),
      liveAccuracy: $('#liveAccuracy'),
      restartHint: $('#restartHint'),
      resultsOverlay: $('#resultsOverlay'),
      resultsCard: $('.results-card'),
      restartBtn: $('#restartBtn'),
      resultWpm: $('#resultWpm'),
      resultAccuracy: $('#resultAccuracy'),
      resultRawWpm: $('#resultRawWpm'),
      resultCorrectChars: $('#resultCorrectChars'),
      resultIncorrectChars: $('#resultIncorrectChars'),
      resultTime: $('#resultTime'),
      wpmChart: $('#wpmChart'),
      historyList: $('#historyList'),
      personalBestBadge: $('#personalBestBadge'),
      themeToggle: $('#themeToggle'),
      soundToggle: $('#soundToggle'),
      wordCountGroup: $('#wordCountGroup'),
      timeOptions: $('#timeOptions'),
      modeOptions: $('#modeOptions'),
      wordCountOptions: $('#wordCountOptions')
    };
  }

  // ── Audio ──────────────────────────────────
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playKeystroke() {
    if (!state.soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(800 + Math.random() * 200, audioCtx.currentTime);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.05);
    } catch { /* ignore */ }
  }

  function playError() {
    if (!state.soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(200, audioCtx.currentTime);
      osc.type = 'square';
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.1);
    } catch { /* ignore */ }
  }

  function playComplete() {
    if (!state.soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const notes = [523, 659, 784];
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.12);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.12 + 0.2);
        osc.start(audioCtx.currentTime + i * 0.12);
        osc.stop(audioCtx.currentTime + i * 0.12 + 0.2);
      });
    } catch { /* ignore */ }
  }

  // ── Theme ──────────────────────────────────
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.saveTheme(theme);
    const sunIcon = els.themeToggle.querySelector('.icon-sun');
    const moonIcon = els.themeToggle.querySelector('.icon-moon');
    if (theme === 'dark') {
      sunIcon.style.display = '';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = '';
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // ── Sound Toggle ───────────────────────────
  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    Storage.saveSound(state.soundEnabled);
    updateSoundIcon();
    if (state.soundEnabled) initAudio();
  }

  function updateSoundIcon() {
    const soundOn = els.soundToggle.querySelectorAll('.sound-on');
    const soundOff = els.soundToggle.querySelectorAll('.sound-off');
    if (state.soundEnabled) {
      soundOn.forEach(e => e.style.display = '');
      soundOff.forEach(e => e.style.display = 'none');
    } else {
      soundOn.forEach(e => e.style.display = 'none');
      soundOff.forEach(e => e.style.display = '');
    }
  }

  // ── Text Rendering ─────────────────────────
  function renderText() {
    els.textDisplay.innerHTML = '';
    state.charElements = [];

    for (let i = 0; i < state.targetText.length; i++) {
      const span = document.createElement('span');
      span.className = 'char';
      if (state.targetText[i] === ' ') {
        span.classList.add('space');
      }
      span.textContent = state.targetText[i];
      els.textDisplay.appendChild(span);
      state.charElements.push(span);
    }

    // Set initial caret
    if (state.charElements.length > 0) {
      state.charElements[0].classList.add('current');
    }
  }

  // ── Timer Display ──────────────────────────
  function updateTimerDisplay(remaining) {
    els.timerDisplay.textContent = remaining;
    els.timerDisplay.classList.remove('warning', 'danger');
    if (remaining <= 5) {
      els.timerDisplay.classList.add('danger');
    } else if (remaining <= 10) {
      els.timerDisplay.classList.add('warning');
    }
  }

  // ── Live Stats Update ──────────────────────
  function updateLiveStats() {
    const elapsed = Timer.getElapsed();
    const netWpm = Stats.calculateNetWpm(state.correctCount, elapsed);
    const accuracy = Stats.calculateAccuracy(state.correctCount, state.correctCount + state.incorrectCount);
    els.liveWpm.textContent = netWpm;
    els.liveAccuracy.textContent = accuracy.toFixed(1);
  }

  // ── Record WPM snapshot for chart ──────────
  function recordWpmSnapshot() {
    const elapsed = Timer.getElapsed();
    if (elapsed > 0) {
      const netWpm = Stats.calculateNetWpm(state.correctCount, elapsed);
      state.wpmHistory.push({ time: Math.round(elapsed), wpm: netWpm });
    }
  }

  let wpmInterval = null;

  function startWpmTracking() {
    wpmInterval = setInterval(recordWpmSnapshot, 1000);
  }

  function stopWpmTracking() {
    if (wpmInterval) {
      clearInterval(wpmInterval);
      wpmInterval = null;
    }
  }

  // ── Input Handling ─────────────────────────
  function handleInput(e) {
    if (state.isFinished) return;

    const inputVal = els.hiddenInput.value;
    const typedLength = inputVal.length;

    // Start timer on first keypress
    if (!state.isStarted && typedLength > 0) {
      state.isStarted = true;
      els.configBar.style.opacity = '0.3';
      els.configBar.style.pointerEvents = 'none';
      els.liveStats.classList.add('visible');
      els.restartHint.classList.add('visible');
      Timer.start();
      startWpmTracking();
    }

    // Handle backspace
    if (typedLength < state.currentIndex) {
      // Move back and adjust counts
      while (state.currentIndex > typedLength) {
        state.currentIndex--;
        const charEl = state.charElements[state.currentIndex];
        const wasCorrect = charEl.classList.contains('correct');
        const wasIncorrect = charEl.classList.contains('incorrect');
        charEl.classList.remove('correct', 'incorrect');
        if (wasCorrect) state.correctCount--;
        if (wasIncorrect) state.incorrectCount--;
      }
      // Remove current from previous char
      if (state.currentIndex < state.charElements.length) {
        state.charElements[state.currentIndex].classList.remove('current');
      }
      // Set current class on new position
      if (state.currentIndex < state.charElements.length) {
        state.charElements[state.currentIndex].classList.add('current');
      }
      updateLiveStats();
      return;
    }

    // Process new characters — mobile keyboards (autocorrect, autocapitalize,
    // IME composition) can add MORE THAN ONE character in a single input
    // event, so we must consume all of them here, not just one.
    while (
      state.currentIndex < typedLength &&
      state.currentIndex < state.targetText.length
    ) {
      const newChar = inputVal[state.currentIndex];
      const targetChar = state.targetText[state.currentIndex];
      const charEl = state.charElements[state.currentIndex];

      if (newChar === targetChar) {
        charEl.classList.remove('current');
        charEl.classList.add('correct');
        state.correctCount++;
        playKeystroke();
      } else {
        charEl.classList.remove('current');
        charEl.classList.add('incorrect');
        state.incorrectCount++;
        playError();
      }

      state.currentIndex++;

      // Set next current
      if (state.currentIndex < state.charElements.length) {
        state.charElements[state.currentIndex].classList.add('current');
      }

      // Check if text is fully typed
      if (state.currentIndex >= state.targetText.length) {
        break;
      }
    }

    // If the input somehow got longer than the target text (e.g. autocorrect
    // appended extra characters/space at the very end), trim it back so the
    // hidden input and currentIndex never drift apart on the next event.
    if (typedLength > state.targetText.length) {
      els.hiddenInput.value = inputVal.slice(0, state.targetText.length);
    }

    updateLiveStats();

    // Check if text is fully typed
    if (state.currentIndex >= state.targetText.length) {
      finishTest();
    }
  }

  // ── Finish Test ────────────────────────────
  function finishTest() {
    if (state.isFinished) return;
    state.isFinished = true;
    Timer.stop();
    stopWpmTracking();
    els.hiddenInput.blur();
    playComplete();

    const elapsed = Timer.getElapsed();
    const result = Stats.calculateAll(state.correctCount, state.incorrectCount, elapsed);
    result.mode = state.mode;
    result.duration = state.timeDuration;

    // Record final snapshot
    if (elapsed > 0) {
      state.wpmHistory.push({ time: Math.round(elapsed), wpm: result.netWpm });
    }

    const isNewBest = Storage.saveResult(result);
    showResults(result, isNewBest);
  }

  // ── Results Screen ─────────────────────────
  function showResults(result, isNewBest) {
    els.resultWpm.textContent = result.netWpm;
    els.resultAccuracy.textContent = result.accuracy + '%';
    els.resultRawWpm.textContent = result.rawWpm;
    els.resultCorrectChars.textContent = result.correctChars;
    els.resultIncorrectChars.textContent = result.incorrectChars;
    els.resultTime.textContent = Math.round(result.elapsedSeconds) + 's';

    // Show personal best badge
    els.personalBestBadge.style.display = isNewBest ? 'flex' : 'none';

    // Render history
    renderHistory();

    // Draw chart
    drawWpmChart();

    els.resultsOverlay.style.display = 'flex';
    els.configBar.style.opacity = '';
    els.configBar.style.pointerEvents = '';
  }

  // ── History Rendering ──────────────────────
  function renderHistory() {
    const history = Storage.getHistory();
    els.historyList.innerHTML = '';

    if (history.length === 0) {
      els.historyList.innerHTML = '<div style="text-align:center;color:var(--text-muted);font-size:0.8rem;padding:0.5rem;">No tests yet</div>';
      return;
    }

    const recent = history.slice(0, 8);
    recent.forEach(entry => {
      const item = document.createElement('div');
      item.className = 'history-item';

      const date = new Date(entry.date);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      item.innerHTML = `
        <span class="history-item-wpm">${entry.wpm} <small>wpm</small></span>
        <span class="history-item-accuracy">${entry.accuracy}%</span>
        <span class="history-item-date">${dateStr}</span>
      `;
      els.historyList.appendChild(item);
    });
  }

  // ── WPM Chart (Canvas) ────────────────────
  function drawWpmChart() {
    const canvas = els.wpmChart;
    const ctx = canvas.getContext('2d');
    const data = state.wpmHistory;

    // Set canvas size for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 160 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '160px';
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = 160;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    // Clear
    ctx.clearRect(0, 0, w, h);

    if (data.length < 2) {
      ctx.fillStyle = 'var(--text-muted)';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Not enough data', w / 2, h / 2);
      return;
    }

    const maxWpm = Math.max(...data.map(d => d.wpm), 10);
    const maxTime = Math.max(...data.map(d => d.time), 1);

    // Get computed accent color
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6c63ff';
    const textMuted = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || 'rgba(255,255,255,0.25)';
    const textSecondary = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || 'rgba(255,255,255,0.5)';

    // Grid lines
    ctx.strokeStyle = textMuted;
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 4]);
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Y-axis labels
    ctx.fillStyle = textSecondary;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = Math.round(maxWpm - (maxWpm / 4) * i);
      const y = padding.top + (chartH / 4) * i;
      ctx.fillText(String(val), padding.left - 6, y + 3);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    const xSteps = Math.min(data.length - 1, 5);
    for (let i = 0; i <= xSteps; i++) {
      const idx = Math.round((i / xSteps) * (data.length - 1));
      const x = padding.left + (data[idx].time / maxTime) * chartW;
      ctx.fillText(data[idx].time + 's', x, h - 8);
    }

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    data.forEach((point, i) => {
      const x = padding.left + (point.time / maxTime) * chartW;
      const y = padding.top + chartH - (point.wpm / maxWpm) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Gradient fill under line
    const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
    gradient.addColorStop(0, accentColor + '30');
    gradient.addColorStop(1, accentColor + '00');

    ctx.lineTo(padding.left + (data[data.length - 1].time / maxTime) * chartW, h - padding.bottom);
    ctx.lineTo(padding.left + (data[0].time / maxTime) * chartW, h - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Dots on data points
    data.forEach((point) => {
      const x = padding.left + (point.time / maxTime) * chartW;
      const y = padding.top + chartH - (point.wpm / maxWpm) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.fill();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  // ── Reset / Restart ────────────────────────
  function resetTest() {
    // Stop everything
    Timer.stop();
    stopWpmTracking();
    state.isStarted = false;
    state.isFinished = false;
    state.isPaused = false;
    state.currentIndex = 0;
    state.correctCount = 0;
    state.incorrectCount = 0;
    state.wpmHistory = [];

    // Initialize timer with callbacks
    Timer.init(state.timeDuration, updateTimerDisplay, finishTest);

    // Hide results
    els.resultsOverlay.style.display = 'none';

    // Reset UI
    els.timerDisplay.textContent = state.timeDuration;
    els.timerDisplay.classList.remove('warning', 'danger');
    els.liveWpm.textContent = '0';
    els.liveAccuracy.textContent = '100';
    els.liveStats.classList.remove('visible');
    els.restartHint.classList.remove('visible');
    els.configBar.style.opacity = '';
    els.configBar.style.pointerEvents = '';

    // Generate new text and render
    state.targetText = TextGenerator.getText(state.mode, state.wordCount);
    renderText();

    // Focus typing area
    els.hiddenInput.value = '';
    els.hiddenInput.focus();
  }

  // ── Config Button Handlers ─────────────────
  function setupConfigButtons() {
    // Time buttons
    els.timeOptions.addEventListener('click', (e) => {
      const btn = e.target.closest('.config-btn');
      if (!btn) return;
      els.timeOptions.querySelectorAll('.config-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.timeDuration = parseInt(btn.dataset.time, 10);
      resetTest();
    });

    // Mode buttons
    els.modeOptions.addEventListener('click', (e) => {
      const btn = e.target.closest('.config-btn');
      if (!btn) return;
      els.modeOptions.querySelectorAll('.config-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;

      // Show/hide word count options
      els.wordCountGroup.style.display = state.mode === 'words' ? '' : 'none';

      resetTest();
    });

    // Word count buttons
    els.wordCountOptions.addEventListener('click', (e) => {
      const btn = e.target.closest('.config-btn');
      if (!btn) return;
      els.wordCountOptions.querySelectorAll('.config-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.wordCount = parseInt(btn.dataset.count, 10);
      resetTest();
    });
  }

  // ── Keyboard Shortcuts ─────────────────────
  let tabPressed = false;

  function handleKeyDown(e) {
    // Tab + Enter to restart
    if (e.key === 'Tab') {
      e.preventDefault();
      tabPressed = true;
      setTimeout(() => { tabPressed = false; }, 500);
      return;
    }

    if (e.key === 'Enter' && tabPressed) {
      e.preventDefault();
      tabPressed = false;
      resetTest();
      return;
    }

    // Escape to restart
    if (e.key === 'Escape') {
      e.preventDefault();
      if (state.isFinished) {
        resetTest();
      }
      return;
    }
  }

  // ── Event Binding ──────────────────────────
  function bindEvents() {
    // Typing area click to focus
    els.typingArea.addEventListener('click', () => {
      if (!state.isFinished) {
        els.hiddenInput.focus();
      }
    });

    // Input handling
    els.hiddenInput.addEventListener('input', handleInput);

    // Prevent paste
    els.hiddenInput.addEventListener('paste', (e) => e.preventDefault());

    // Restart button
    els.restartBtn.addEventListener('click', resetTest);

    // Theme toggle
    els.themeToggle.addEventListener('click', toggleTheme);

    // Sound toggle
    els.soundToggle.addEventListener('click', toggleSound);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyDown);

    // Config buttons
    setupConfigButtons();

    // Window resize - redraw chart if results visible
    window.addEventListener('resize', () => {
      if (els.resultsOverlay.style.display === 'flex') {
        drawWpmChart();
      }
    });
  }

  // ── Init ───────────────────────────────────
  function init() {
    cacheElements();
    bindEvents();

    // Load preferences
    const savedTheme = Storage.getTheme();
    applyTheme(savedTheme);

    state.soundEnabled = Storage.getSound();
    updateSoundIcon();

    // Initial state
    els.wordCountGroup.style.display = state.mode === 'words' ? '' : 'none';

    // Generate and render initial text
    state.targetText = TextGenerator.getText(state.mode, state.wordCount);
    renderText();

    // Focus
    setTimeout(() => els.hiddenInput.focus(), 100);
  }

  return { init };
})();

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);