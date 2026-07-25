/* ============================================
   Timer — Countdown Logic
   ============================================ */

const Timer = (() => {
  let intervalId = null;
  let remaining = 0;
  let totalDuration = 0;
  let onTick = null;
  let onComplete = null;
  let startTime = null;

  /**
   * Initialize the timer
   * @param {number} duration - Duration in seconds
   * @param {Function} tickCallback - Called each second with remaining time
   * @param {Function} completeCallback - Called when timer reaches zero
   */
  function init(duration, tickCallback, completeCallback) {
    stop();
    totalDuration = duration;
    remaining = duration;
    onTick = tickCallback;
    onComplete = completeCallback;
    startTime = null;
  }

  /**
   * Start the countdown
   */
  function start() {
    if (intervalId) return;
    startTime = Date.now();
    intervalId = setInterval(() => {
      remaining--;
      if (onTick) onTick(remaining, getElapsed());
      if (remaining <= 0) {
        stop();
        if (onComplete) onComplete();
      }
    }, 1000);
  }

  /**
   * Stop the timer
   */
  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  /**
   * Reset the timer to initial duration
   */
  function reset() {
    stop();
    remaining = totalDuration;
    startTime = null;
  }

  /**
   * Get remaining time
   * @returns {number} Seconds remaining
   */
  function getRemaining() {
    return remaining;
  }

  /**
   * Get elapsed time in seconds
   * @returns {number} Seconds elapsed
   */
  function getElapsed() {
    if (!startTime) return 0;
    return (Date.now() - startTime) / 1000;
  }

  /**
   * Get total duration
   * @returns {number} Total duration in seconds
   */
  function getTotalDuration() {
    return totalDuration;
  }

  /**
   * Check if timer is running
   * @returns {boolean}
   */
  function isRunning() {
    return intervalId !== null;
  }

  return {
    init,
    start,
    stop,
    reset,
    getRemaining,
    getElapsed,
    getTotalDuration,
    isRunning
  };
})();
