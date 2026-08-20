const CTA_KEYWORDS = [
  'comment',
  'share this',
  'share with',
  'follow us',
  'follow for',
  'link in bio',
  'tag a friend',
  'tag someone',
  'dm us',
  'subscribe',
  'click the link',
  'save this',
  'swipe up',
  'sign up',
  'drop a',
  'let us know',
]

const EMOJI_REGEX = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu

/**
 * Analyzes extracted post/caption text and returns stats, a 0-100
 * "engagement readiness" score, and a list of concrete suggestions.
 * Purely heuristic — no external ML/API calls.
 * @param {string} rawText
 */
export function analyzeContent(rawText) {
  const text = (rawText || '').trim()
  const words = text.split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const charCount = text.length

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const sentenceCount = sentences.length || (wordCount > 0 ? 1 : 0)
  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0

  const hashtags = text.match(/#[a-zA-Z0-9_]+/g) || []
  const mentions = text.match(/@[a-zA-Z0-9_]+/g) || []
  const links = text.match(/https?:\/\/\S+/g) || []
  const emojis = text.match(EMOJI_REGEX) || []
  const hasQuestion = /\?/.test(text)

  const lowerText = text.toLowerCase()
  const ctaFound = CTA_KEYWORDS.filter((k) => lowerText.includes(k))

  const suggestions = []
  let score = 50

  if (wordCount === 0) {
    return {
      stats: {
        wordCount: 0,
        charCount: 0,
        sentenceCount: 0,
        avgWordsPerSentence: 0,
        hashtagCount: 0,
        mentionCount: 0,
        linkCount: 0,
        emojiCount: 0,
        hasQuestion: false,
        ctaCount: 0,
      },
      hashtags: [],
      mentions: [],
      links: [],
      suggestions: ['No readable text was extracted — try a clearer scan or a text-based PDF.'],
      score: 0,
    }
  }

  if (wordCount < 8) {
    suggestions.push('Caption is very short — consider adding more context or a hook to draw readers in.')
    score -= 5
  } else if (wordCount > 150) {
    suggestions.push('Caption is quite long for most platforms — trim to the key message and move details to a comment or link.')
    score -= 5
  } else {
    score += 10
  }

  if (hashtags.length === 0) {
    suggestions.push('No hashtags found — adding 3–5 relevant hashtags can improve discoverability.')
  } else if (hashtags.length > 10) {
    suggestions.push(`Found ${hashtags.length} hashtags — more than ~10 can look spammy; 3–5 targeted ones usually perform better.`)
    score -= 5
  } else if (hashtags.length >= 3 && hashtags.length <= 5) {
    score += 10
  } else {
    score += 5
  }

  if (mentions.length === 0) {
    suggestions.push('Consider tagging relevant accounts, partners, or collaborators to expand reach.')
  } else {
    score += 5
  }

  if (!hasQuestion) {
    suggestions.push('Adding a question can invite comments and boost engagement.')
  } else {
    score += 10
  }

  if (ctaFound.length === 0) {
    suggestions.push('No clear call-to-action detected — try adding one like "comment below" or "share with a friend".')
  } else {
    score += 10
  }

  if (emojis.length === 0) {
    suggestions.push('Adding a relevant emoji or two can make the post more visually engaging.')
  } else if (emojis.length > 8) {
    suggestions.push('Emoji usage is quite high — consider trimming for a cleaner look.')
    score -= 5
  } else {
    score += 5
  }

  if (links.length > 0) {
    suggestions.push('Direct links can reduce reach on some platforms (e.g. Instagram) — consider "link in bio" instead.')
  }

  if (avgWordsPerSentence > 25) {
    suggestions.push('Sentences are quite long on average — shorter sentences are easier to skim on social feeds.')
    score -= 5
  }

  score = Math.max(0, Math.min(100, score))

  return {
    stats: {
      wordCount,
      charCount,
      sentenceCount,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      hashtagCount: hashtags.length,
      mentionCount: mentions.length,
      linkCount: links.length,
      emojiCount: emojis.length,
      hasQuestion,
      ctaCount: ctaFound.length,
    },
    hashtags,
    mentions,
    links,
    suggestions,
    score,
  }
}
