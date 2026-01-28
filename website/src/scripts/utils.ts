/**
 * Utility functions for the Awesome Copilot website
 */

const REPO_BASE_URL = 'https://raw.githubusercontent.com/github/awesome-copilot/main';
const REPO_GITHUB_URL = 'https://github.com/github/awesome-copilot/blob/main';

// VS Code install URL configurations
const VSCODE_INSTALL_CONFIG: Record<string, { baseUrl: string; scheme: string }> = {
  instructions: { 
    baseUrl: 'https://aka.ms/awesome-copilot/install/instructions',
    scheme: 'chat-instructions'
  },
  prompt: { 
    baseUrl: 'https://aka.ms/awesome-copilot/install/prompt',
    scheme: 'chat-prompt'
  },
  agent: { 
    baseUrl: 'https://aka.ms/awesome-copilot/install/agent',
    scheme: 'chat-agent'
  },
};

/**
 * Get the base path for the site
 */
export function getBasePath(): string {
  // In Astro, import.meta.env.BASE_URL is available at build time
  // At runtime, we use a data attribute on the body
  if (typeof document !== 'undefined') {
    return document.body.dataset.basePath || '/';
  }
  return '/';
}

/**
 * Fetch JSON data from the data directory
 */
export async function fetchData<T = unknown>(filename: string): Promise<T | null> {
  try {
    const basePath = getBasePath();
    const response = await fetch(`${basePath}data/${filename}`);
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
export async function fetchFileContent(filePath: string): Promise<string | null> {
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
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
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
 * @param type - Resource type (agent, prompt, instructions)
 * @param filePath - Path to the file
 * @param insiders - Whether to use VS Code Insiders
 */
export function getVSCodeInstallUrl(type: string, filePath: string, insiders = false): string | null {
  const config = VSCODE_INSTALL_CONFIG[type];
  if (!config) return null;
  
  const rawUrl = `${REPO_BASE_URL}/${filePath}`;
  const vscodeScheme = insiders ? 'vscode-insiders' : 'vscode';
  const innerUrl = `${vscodeScheme}:${config.scheme}/install?url=${encodeURIComponent(rawUrl)}`;
  
  return `${config.baseUrl}?url=${encodeURIComponent(innerUrl)}`;
}

/**
 * Get GitHub URL for a file
 */
export function getGitHubUrl(filePath: string): string {
  return `${REPO_GITHUB_URL}/${filePath}`;
}

/**
 * Get raw GitHub URL for a file (for fetching content)
 */
export function getRawGitHubUrl(filePath: string): string {
  return `${REPO_BASE_URL}/${filePath}`;
}

/**
 * Show a toast notification
 */
export function showToast(message: string, type: 'success' | 'error' = 'success'): void {
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
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
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
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string | undefined, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get resource type from file path
 */
export function getResourceType(filePath: string): string {
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
export function formatResourceType(type: string): string {
  const labels: Record<string, string> = {
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
export function getResourceIcon(type: string): string {
  const icons: Record<string, string> = {
    agent: '🤖',
    prompt: '🎯',
    instruction: '📋',
    skill: '⚡',
    collection: '📦',
  };
  return icons[type] || '📄';
}

/**
 * Generate HTML for install dropdown button
 */
export function getInstallDropdownHtml(type: string, filePath: string, small = false): string {
  const vscodeUrl = getVSCodeInstallUrl(type, filePath, false);
  const insidersUrl = getVSCodeInstallUrl(type, filePath, true);
  
  if (!vscodeUrl) return '';
  
  const sizeClass = small ? 'install-dropdown-small' : '';
  const uniqueId = `install-${filePath.replace(/[^a-zA-Z0-9]/g, '-')}`;
  
  return `
    <div class="install-dropdown ${sizeClass}" id="${uniqueId}" onclick="event.stopPropagation()">
      <a href="${vscodeUrl}" class="btn btn-primary ${small ? 'btn-small' : ''} install-btn-main" target="_blank" rel="noopener">
        <svg viewBox="0 0 16 16" width="${small ? 14 : 16}" height="${small ? 14 : 16}" fill="currentColor">
          <path d="M7.47 10.78a.75.75 0 0 0 1.06 0l3.75-3.75a.75.75 0 0 0-1.06-1.06L8.75 8.44V1.75a.75.75 0 0 0-1.5 0v6.69L4.78 5.97a.75.75 0 0 0-1.06 1.06l3.75 3.75ZM3.75 13a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z"/>
        </svg>
        Install
      </a>
      <button type="button" class="btn btn-primary ${small ? 'btn-small' : ''} install-btn-toggle" aria-label="Install options" onclick="event.preventDefault(); this.parentElement.classList.toggle('open');">
        <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
          <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"/>
        </svg>
      </button>
      <div class="install-dropdown-menu">
        <a href="${vscodeUrl}" target="_blank" rel="noopener" onclick="this.closest('.install-dropdown').classList.remove('open')">
          <svg viewBox="0 0 100 100" fill="currentColor"><path d="M95.436 26.986L75.282 15.768a6.04 6.04 0 0 0-6.895.876L28.78 51.927 11.912 39.151a4.03 4.03 0 0 0-5.154.387l-5.36 4.878a4.03 4.03 0 0 0-.003 5.947l14.646 13.396-14.646 13.396a4.03 4.03 0 0 0 .003 5.947l5.36 4.878a4.03 4.03 0 0 0 5.154.387L28.78 74.59l39.607 35.283a6.04 6.04 0 0 0 6.895.876l20.154-11.218a6.04 6.04 0 0 0 3.127-5.288V32.274a6.04 6.04 0 0 0-3.127-5.288zM75.015 73.428L46.339 51.927l28.676-21.5z" transform="scale(0.16)"/></svg>
          VS Code
        </a>
        <a href="${insidersUrl}" target="_blank" rel="noopener" onclick="this.closest('.install-dropdown').classList.remove('open')">
          <svg viewBox="0 0 100 100" fill="currentColor"><path d="M95.436 26.986L75.282 15.768a6.04 6.04 0 0 0-6.895.876L28.78 51.927 11.912 39.151a4.03 4.03 0 0 0-5.154.387l-5.36 4.878a4.03 4.03 0 0 0-.003 5.947l14.646 13.396-14.646 13.396a4.03 4.03 0 0 0 .003 5.947l5.36 4.878a4.03 4.03 0 0 0 5.154.387L28.78 74.59l39.607 35.283a6.04 6.04 0 0 0 6.895.876l20.154-11.218a6.04 6.04 0 0 0 3.127-5.288V32.274a6.04 6.04 0 0 0-3.127-5.288zM75.015 73.428L46.339 51.927l28.676-21.5z" transform="scale(0.16)"/></svg>
          VS Code Insiders
        </a>
      </div>
    </div>
  `;
}

/**
 * Setup dropdown close handlers for dynamically created dropdowns
 */
export function setupDropdownCloseHandlers(): void {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    // Close all open dropdowns if clicking outside
    if (!target.closest('.install-dropdown')) {
      document.querySelectorAll('.install-dropdown.open').forEach(dropdown => {
        dropdown.classList.remove('open');
      });
    }
  });
}
