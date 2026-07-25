/* ============================================
   Stats — WPM & Accuracy Calculations
   ============================================ */

const Stats = (() => {
  const CHARS_PER_WORD = 5;

  /**
   * Calculate Words Per Minute (net - correct characters only)
   * @param {number} correctChars - Number of correctly typed characters
   * @param {number} elapsedSeconds - Time elapsed in seconds
   * @returns {number} Net WPM
   */
  function calculateNetWpm(correctChars, elapsedSeconds) {
    if (elapsedSeconds <= 0) return 0;
    const minutes = elapsedSeconds / 60;
    return Math.round((correctChars / CHARS_PER_WORD) / minutes);
  }

  /**
   * Calculate Raw WPM (all typed characters including errors)
   * @param {number} totalTyped - Total characters typed
   * @param {number} elapsedSeconds - Time elapsed in seconds
   * @returns {number} Raw WPM
   */
  function calculateRawWpm(totalTyped, elapsedSeconds) {
    if (elapsedSeconds <= 0) return 0;
    const minutes = elapsedSeconds / 60;
    return Math.round((totalTyped / CHARS_PER_WORD) / minutes);
  }

  /**
   * Calculate accuracy percentage
   * @param {number} correctChars - Correctly typed characters
   * @param {number} totalTyped - Total characters typed
   * @returns {number} Accuracy percentage (0-100)
   */
  function calculateAccuracy(correctChars, totalTyped) {
    if (totalTyped === 0) return 100;
    return Math.round((correctChars / totalTyped) * 1000) / 10;
  }

  /**
   * Calculate all stats at once
   * @param {number} correctChars - Correct characters
   * @param {number} incorrectChars - Incorrect characters
   * @param {number} elapsedSeconds - Time elapsed
   * @returns {Object} Stats object
   */
  function calculateAll(correctChars, incorrectChars, elapsedSeconds) {
    const totalTyped = correctChars + incorrectChars;
    return {
      netWpm: calculateNetWpm(correctChars, elapsedSeconds),
      rawWpm: calculateRawWpm(totalTyped, elapsedSeconds),
      accuracy: calculateAccuracy(correctChars, totalTyped),
      correctChars,
      incorrectChars,
      totalTyped,
      elapsedSeconds
    };
  }

  return {
    calculateNetWpm,
    calculateRawWpm,
    calculateAccuracy,
    calculateAll
  };
})();
