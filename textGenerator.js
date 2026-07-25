/* ============================================
   TextGenerator — Paragraph Bank & Random Picker
   ============================================ */

const TextGenerator = (() => {
  // Common words pool for "words" mode
  const commonWords = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see',
    'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
    'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work',
    'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
    'give', 'day', 'most', 'us', 'great', 'find', 'here', 'thing', 'many',
    'well', 'those', 'tell', 'one', 'very', 'her', 'own', 'may', 'still',
    'high', 'each', 'right', 'start', 'might', 'must', 'while', 'last',
    'long', 'much', 'small', 'number', 'off', 'always', 'never', 'made',
    'keep', 'let', 'begin', 'came', 'where', 'every', 'should', 'through',
    'year', 'again', 'place', 'around', 'thought', 'point', 'world', 'live',
    'head', 'need', 'too', 'different', 'hand', 'high', 'play', 'old', 'large',
    'read', 'next', 'move', 'end', 'between', 'city', 'tree', 'cross', 'run',
    'house', 'group', 'always', 'music', 'both', 'story', 'young', 'real',
    'leave', 'light', 'open', 'example', 'under', 'never', 'family', ' yet',
    'late', 'while', 'press', 'close', 'night', 'real', 'life', 'few',
    'north', 'open', 'book', 'carry', 'took', 'science', 'eat', 'room',
    'friend', 'began', 'idea', 'fish', 'mountain', 'stop', 'once', 'base',
    'hear', 'horse', 'cut', 'sure', 'watch', 'color', 'face', 'wood', 'main',
    'enough', 'plain', 'girl', 'usual', 'young', 'ready', 'above', 'ever',
    'red', 'list', 'though', 'feel', 'talk', 'bird', 'soon', 'body', 'dog',
    'family', 'direct', 'pose', 'leave', 'song', 'measure', 'door', 'product',
    'black', 'short', 'numeral', 'class', 'wind', 'question', 'happen',
    'complete', 'ship', 'area', 'half', 'rock', 'order', 'fire', 'south',
    'problem', 'piece', 'told', 'knew', 'pass', 'since', 'top', 'whole',
    'king', 'space', 'heard', 'best', 'hour', 'better', 'true', 'during',
    'hundred', 'five', 'remember', 'step', 'early', 'hold', 'west', 'ground',
    'interest', 'reach', 'fast', 'verb', 'sing', 'listen', 'six', 'table',
    'travel', 'less', 'morning', 'ten', 'simple', 'several', 'vowel',
    'toward', 'war', 'lay', 'against', 'pattern', 'slow', 'center', 'love',
    'person', 'money', 'serve', 'appear', 'road', 'map', 'rain', 'rule',
    'govern', 'pull', 'cold', 'notice', 'voice', 'energy', 'hunt', 'probable',
    'bed', 'brother', 'egg', 'ride', 'cell', 'believe', 'perhaps', 'pick',
    'sudden', 'count', 'reason', 'square', 'moment', 'develop', 'catch',
    'sleep', 'wing', 'produce', 'strange', 'jump', 'sugar', 'death', 'pretty',
    'sleep', 'size', 'cool', 'crowd', 'spread', 'draw', 'deep', 'draw',
    'speed', 'write', 'return', 'foot', 'care', 'second', 'enough', 'plain',
    'girl', 'type', 'usual', 'try', 'ready', 'above', 'ever', 'red', 'list',
    'though', 'feel', 'talk', 'bird', 'soon', 'body', 'dog', 'family',
    'direct', 'pose', 'leave', 'song', 'measure', 'door', 'product', 'black',
    'short', 'numeral', 'class', 'wind', 'question', 'happen', 'complete',
    'ship', 'area', 'half', 'rock', 'order', 'fire', 'south', 'problem',
    'piece', 'told', 'knew', 'pass', 'since', 'top', 'whole', 'king', 'space'
  ];

  // Quotes/passages bank
  const quotes = [
    "The only way to do great work is to love what you do. If you have not found it yet, keep looking. Do not settle. As with all matters of the heart, you will know when you find it.",
    "In the middle of difficulty lies opportunity. Life is like riding a bicycle. To keep your balance, you must keep moving. The future belongs to those who believe in the beauty of their dreams.",
    "Time you enjoy wasting is not wasted time. The real voyage of discovery consists not in seeking new landscapes, but in having new eyes. To live is the rarest thing in the world. Most people exist, that is all.",
    "Success is not final, failure is not fatal. It is the courage to continue that counts. Do not judge each day by the harvest you reap but by the seeds that you plant.",
    "Be yourself; everyone else is already taken. Two things are infinite: the universe and human stupidity. Imagination is more important than knowledge. Life is what happens when you are busy making other plans.",
    "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well.",
    "It is during our darkest moments that we must focus to see the light. The greatest glory in living lies not in never falling, but in rising every time we fall.",
    "The way to get started is to quit talking and begin doing. If you look at what you have in life, you will always have more. If you look at what you do not have in life, you will never have enough.",
    "Spread love everywhere you go. Let no one ever come to you without leaving happier. The best time to plant a tree was twenty years ago. The second best time is now.",
    "Your time is limited, so do not waste it living someone else's life. Do not be trapped by dogma which is living with the results of other people's thinking.",
    "If life were predictable it would cease to be life and be without flavor. In the end, it is not the years in your life that count, but the life in your years.",
    "If you set your goals ridiculously high and it is a failure, you will fail above everyone else's success. The only impossible journey is the one you never begin.",
    "Life is what happens when you are busy making other plans. In a gentle way, you can shake the world. The best and most beautiful things in the world cannot be seen or even touched, they must be felt with the heart.",
    "Keep your face always toward the sunshine and shadows will fall behind you. The wound is the place where the light enters you. What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    "We delight in the beauty of the butterfly, but rarely admit the changes it has gone through to achieve that beauty. The mind is everything. What you think you become. The soul always knows what to do to heal itself.",
    "Act as if what you do makes a difference. It does. Never doubt that a small group of thoughtful, committed citizens can change the world. Indeed, it is the only thing that ever has.",
    "What we think, we become. The only limit to our realization of tomorrow will be our doubts of today. Success usually comes to those who are too busy to be looking for it.",
    "Everything you can imagine is real. Logic will get you from A to B. Imagination will take you everywhere. Life is a riding a bicycle. To keep your balance you must keep moving.",
    "You must be the change you wish to see in the world. The best time to repair the roof is when the sun is shining. Do what you can, with what you have, where you are.",
    "Not everything that is faced can be changed, but nothing can be changed until it is faced. The function of leadership is to produce more leaders, not more followers.",
    "It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change. In three words I can sum up everything I have learned about life: it goes on.",
    "The only thing we have to fear is fear itself. It is during our darkest moments that we must focus to see the light. The greatest wealth is to live content with little.",
    "You will face many defeats in life, but never let yourself be defeated. The greatest glory in living lies not in never falling, but in rising every time we fall.",
    "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. All our dreams can come true, if we have the courage to pursue them.",
    "The future belongs to those who believe in the beauty of their dreams. It does not matter how slowly you go as long as you do not stop. Believe you can and you are halfway there."
  ];

  /**
   * Generate random words
   * @param {number} count - Number of words to generate
   * @returns {string} Random words string
   */
  function generateWords(count = 50) {
    const words = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * commonWords.length);
      words.push(commonWords[idx]);
    }
    return words.join(' ');
  }

  /**
   * Get a random quote
   * @returns {string} Random quote
   */
  function generateQuote() {
    const idx = Math.floor(Math.random() * quotes.length);
    return quotes[idx];
  }

  /**
   * Get text based on mode
   * @param {string} mode - 'words' or 'quote'
   * @param {number} wordCount - Word count for words mode
   * @returns {string} Generated text
   */
  function getText(mode = 'words', wordCount = 50) {
    if (mode === 'quote') {
      return generateQuote();
    }
    return generateWords(wordCount);
  }

  return { getText, generateWords, generateQuote };
})();
