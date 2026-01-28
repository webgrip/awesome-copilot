/**
 * Fuzzy search implementation for the Awesome Copilot website
 * Simple substring matching on title and description with scoring
 */

class FuzzySearch {
  constructor(items = []) {
    this.items = items;
  }

  /**
   * Update the items to search
   */
  setItems(items) {
    this.items = items;
  }

  /**
   * Search items with fuzzy matching
   * @param {string} query - The search query
   * @param {object} options - Search options
   * @returns {array} Matching items sorted by relevance
   */
  search(query, options = {}) {
    const {
      fields = ['title', 'description', 'searchText'],
      limit = 50,
      minScore = 0,
    } = options;

    if (!query || query.trim().length === 0) {
      return this.items.slice(0, limit);
    }

    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/);
    const results = [];

    for (const item of this.items) {
      const score = this.calculateScore(item, queryWords, fields);
      if (score > minScore) {
        results.push({ item, score });
      }
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit).map(r => r.item);
  }

  /**
   * Calculate match score for an item
   */
  calculateScore(item, queryWords, fields) {
    let totalScore = 0;

    for (const word of queryWords) {
      let wordScore = 0;

      for (const field of fields) {
        const value = item[field];
        if (!value) continue;

        const normalizedValue = String(value).toLowerCase();

        // Exact match in title gets highest score
        if (field === 'title' && normalizedValue === word) {
          wordScore = Math.max(wordScore, 100);
        }
        // Title starts with word
        else if (field === 'title' && normalizedValue.startsWith(word)) {
          wordScore = Math.max(wordScore, 80);
        }
        // Title contains word
        else if (field === 'title' && normalizedValue.includes(word)) {
          wordScore = Math.max(wordScore, 60);
        }
        // Description contains word
        else if (field === 'description' && normalizedValue.includes(word)) {
          wordScore = Math.max(wordScore, 30);
        }
        // searchText (includes tags, tools, etc) contains word
        else if (field === 'searchText' && normalizedValue.includes(word)) {
          wordScore = Math.max(wordScore, 20);
        }
      }

      totalScore += wordScore;
    }

    // Bonus for matching all words
    const matchesAllWords = queryWords.every(word =>
      fields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(word);
      })
    );

    if (matchesAllWords && queryWords.length > 1) {
      totalScore *= 1.5;
    }

    return totalScore;
  }

  /**
   * Highlight matching text in a string
   */
  highlight(text, query) {
    if (!query || !text) return escapeHtml(text || '');

    const normalizedQuery = query.toLowerCase().trim();
    const words = normalizedQuery.split(/\s+/);
    let result = escapeHtml(text);

    for (const word of words) {
      if (word.length < 2) continue;
      const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      result = result.replace(regex, '<mark>$1</mark>');
    }

    return result;
  }
}

// Global search instance
const globalSearch = new FuzzySearch();

/**
 * Initialize global search with search index
 */
async function initGlobalSearch() {
  const searchIndex = await fetchData('search-index.json');
  if (searchIndex) {
    globalSearch.setItems(searchIndex);
  }
  return globalSearch;
}
