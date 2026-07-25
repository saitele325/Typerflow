/* ============================================
   Storage — localStorage Read/Write
   ============================================ */

const Storage = (() => {
  const KEYS = {
    HISTORY: 'typeflow_history',
    THEME: 'typeflow_theme',
    SOUND: 'typeflow_sound',
    PERSONAL_BEST: 'typeflow_personal_best'
  };

  const MAX_HISTORY = 20;

  /**
   * Get test history from localStorage
   * @returns {Array} Array of test results
   */
  function getHistory() {
    try {
      const data = localStorage.getItem(KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Save a test result to history
   * @param {Object} result - Test result object
   * @returns {boolean} Whether this was a new personal best
   */
  function saveResult(result) {
    const history = getHistory();
    const entry = {
      wpm: result.netWpm,
      rawWpm: result.rawWpm,
      accuracy: result.accuracy,
      correctChars: result.correctChars,
      incorrectChars: result.incorrectChars,
      mode: result.mode,
      duration: result.duration,
      date: new Date().toISOString()
    };

    history.unshift(entry);
    if (history.length > MAX_HISTORY) {
      history.length = MAX_HISTORY;
    }

    try {
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    } catch {
      // Storage full or unavailable
    }

    return isNewPersonalBest(entry);
  }

  /**
   * Check if a result is a new personal best
   * @param {Object} entry - Test result entry
   * @returns {boolean}
   */
  function isNewPersonalBest(entry) {
    const best = getPersonalBest();
    if (!best || entry.wpm > best.wpm) {
      setPersonalBest(entry);
      return true;
    }
    return false;
  }

  /**
   * Get personal best record
   * @returns {Object|null}
   */
  function getPersonalBest() {
    try {
      const data = localStorage.getItem(KEYS.PERSONAL_BEST);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Set personal best record
   * @param {Object} entry
   */
  function setPersonalBest(entry) {
    try {
      localStorage.setItem(KEYS.PERSONAL_BEST, JSON.stringify(entry));
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Get saved theme preference
   * @returns {string} 'dark' or 'light'
   */
  function getTheme() {
    try {
      return localStorage.getItem(KEYS.THEME) || 'dark';
    } catch {
      return 'dark';
    }
  }

  /**
   * Save theme preference
   * @param {string} theme - 'dark' or 'light'
   */
  function saveTheme(theme) {
    try {
      localStorage.setItem(KEYS.THEME, theme);
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Get sound preference
   * @returns {boolean}
   */
  function getSound() {
    try {
      return localStorage.getItem(KEYS.SOUND) === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Save sound preference
   * @param {boolean} enabled
   */
  function saveSound(enabled) {
    try {
      localStorage.setItem(KEYS.SOUND, String(enabled));
    } catch {
      // Storage unavailable
    }
  }

  return {
    getHistory,
    saveResult,
    getPersonalBest,
    getTheme,
    saveTheme,
    getSound,
    saveSound
  };
})();
