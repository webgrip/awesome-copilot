/**
 * Utility functions for the Awesome Copilot website
 */

const REPO_BASE_URL = 'https://raw.githubusercontent.com/github/awesome-copilot/main';
const REPO_GITHUB_URL = 'https://github.com/github/awesome-copilot/blob/main';

// VS Code install URL template
const VSCODE_INSTALL_URLS = {
  instructions: 'https://aka.ms/awesome-copilot/install/instructions',
  prompt: 'https://aka.ms/awesome-copilot/install/prompt',
  agent: 'https://aka.ms/awesome-copilot/install/agent',
};

/**
 * Fetch JSON data from the data directory
 */
async function fetchData(filename) {
  try {
    const basePath = window.location.pathname.includes('/pages/') ? '..' : '.';
    const response = await fetch(`${basePath}/data/${filename}`);
    if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);
    return null;
  }
}

/**
 * Fetch raw file content from GitHub
 */
async function fetchFileContent(filePath) {
  try {
    const response = await fetch(`${REPO_BASE_URL}/${filePath}`);
    if (!response.ok) throw new Error(`Failed to fetch ${filePath}`);
    return await response.text();
  } catch (error) {
    console.error(`Error fetching file content:`, error);
    return null;
  }
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

/**
 * Generate VS Code install URL
 */
function getVSCodeInstallUrl(type, filePath) {
  const baseUrl = VSCODE_INSTALL_URLS[type];
  if (!baseUrl) return null;
  return `${baseUrl}?url=${encodeURIComponent(`${REPO_BASE_URL}/${filePath}`)}`;
}

/**
 * Get GitHub URL for a file
 */
function getGitHubUrl(filePath) {
  return `${REPO_GITHUB_URL}/${filePath}`;
}

/**
 * Get raw GitHub URL for a file (for fetching content)
 */
function getRawGitHubUrl(filePath) {
  return `${REPO_BASE_URL}/${filePath}`;
}

/**
 * Show a toast notification
 */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/**
 * Debounce function for search input
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Truncate text with ellipsis
 */
function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get resource type from file path
 */
function getResourceType(filePath) {
  if (filePath.endsWith('.agent.md')) return 'agent';
  if (filePath.endsWith('.prompt.md')) return 'prompt';
  if (filePath.endsWith('.instructions.md')) return 'instruction';
  if (filePath.includes('/skills/') && filePath.endsWith('SKILL.md')) return 'skill';
  if (filePath.endsWith('.collection.yml')) return 'collection';
  return 'unknown';
}

/**
 * Format a resource type for display
 */
function formatResourceType(type) {
  const labels = {
    agent: '🤖 Agent',
    prompt: '🎯 Prompt',
    instruction: '📋 Instruction',
    skill: '⚡ Skill',
    collection: '📦 Collection',
  };
  return labels[type] || type;
}

/**
 * Get icon for resource type
 */
function getResourceIcon(type) {
  const icons = {
    agent: '🤖',
    prompt: '🎯',
    instruction: '📋',
    skill: '⚡',
    collection: '📦',
  };
  return icons[type] || '📄';
}
