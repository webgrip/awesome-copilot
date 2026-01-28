/**
 * Theme management for the Awesome Copilot website
 * Supports light/dark mode with user preference storage
 */

const THEME_KEY = 'awesome-copilot-theme';

/**
 * Get the current theme preference
 * Priority: localStorage > system preference > dark (default)
 */
function getThemePreference() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

/**
 * Apply theme to the document
 */
function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
}

/**
 * Initialize theme on page load
 */
function initTheme() {
  // Apply theme immediately to prevent flash
  const theme = getThemePreference();
  applyTheme(theme);

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't set a preference
      const stored = localStorage.getItem(THEME_KEY);
      if (!stored) {
        applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  }
}

// Initialize theme immediately (before DOM ready to prevent flash)
initTheme();

// Setup toggle button after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }
});
