/**
 * Modal functionality for file viewing
 */

import { fetchFileContent, getVSCodeInstallUrl, copyToClipboard, showToast, downloadFile, shareFile } from './utils';

// Modal state
let currentFilePath: string | null = null;
let currentFileContent: string | null = null;
let currentFileType: string | null = null;

/**
 * Setup modal functionality
 */
export function setupModal(): void {
  const modal = document.getElementById('file-modal');
  const closeBtn = document.getElementById('close-modal');
  const copyBtn = document.getElementById('copy-btn');
  const downloadBtn = document.getElementById('download-btn');
  const shareBtn = document.getElementById('share-btn');

  if (!modal) return;

  closeBtn?.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  copyBtn?.addEventListener('click', async () => {
    if (currentFileContent) {
      const success = await copyToClipboard(currentFileContent);
      showToast(success ? 'Copied to clipboard!' : 'Failed to copy', success ? 'success' : 'error');
    }
  });

  downloadBtn?.addEventListener('click', async () => {
    if (currentFilePath) {
      const success = await downloadFile(currentFilePath);
      showToast(success ? 'Download started!' : 'Download failed', success ? 'success' : 'error');
    }
  });

  shareBtn?.addEventListener('click', async () => {
    if (currentFilePath) {
      const success = await shareFile(currentFilePath);
      showToast(success ? 'Link copied to clipboard!' : 'Failed to copy link', success ? 'success' : 'error');
    }
  });

  // Setup install dropdown toggle
  setupInstallDropdown('install-dropdown');
}

/**
 * Setup install dropdown toggle functionality
 */
export function setupInstallDropdown(containerId: string): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  const toggle = container.querySelector('.install-btn-toggle');
  
  toggle?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    container.classList.toggle('open');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target as Node)) {
      container.classList.remove('open');
    }
  });

  // Close dropdown when clicking a menu item
  container.querySelectorAll('.install-dropdown-menu a').forEach(link => {
    link.addEventListener('click', () => {
      container.classList.remove('open');
    });
  });
}

/**
 * Open file viewer modal
 */
export async function openFileModal(filePath: string, type: string): Promise<void> {
  const modal = document.getElementById('file-modal');
  const title = document.getElementById('modal-title');
  const contentEl = document.getElementById('modal-content')?.querySelector('code');
  const installDropdown = document.getElementById('install-dropdown');
  const installBtnMain = document.getElementById('install-btn-main') as HTMLAnchorElement | null;
  const installVscode = document.getElementById('install-vscode') as HTMLAnchorElement | null;
  const installInsiders = document.getElementById('install-insiders') as HTMLAnchorElement | null;

  if (!modal || !title || !contentEl) return;

  currentFilePath = filePath;
  currentFileType = type;
  
  // Show modal with loading state
  title.textContent = filePath.split('/').pop() || filePath;
  contentEl.textContent = 'Loading...';
  modal.classList.remove('hidden');

  // Setup install dropdown
  const vscodeUrl = getVSCodeInstallUrl(type, filePath, false);
  const insidersUrl = getVSCodeInstallUrl(type, filePath, true);
  
  if (vscodeUrl && installDropdown) {
    installDropdown.style.display = 'inline-flex';
    installDropdown.classList.remove('open');
    if (installBtnMain) installBtnMain.href = vscodeUrl;
    if (installVscode) installVscode.href = vscodeUrl;
    if (installInsiders) installInsiders.href = insidersUrl || '#';
  } else if (installDropdown) {
    installDropdown.style.display = 'none';
  }

  // Fetch and display content
  const fileContent = await fetchFileContent(filePath);
  currentFileContent = fileContent;
  
  if (fileContent) {
    contentEl.textContent = fileContent;
  } else {
    contentEl.textContent = 'Failed to load file content. Click the button below to view on GitHub.';
  }
}

/**
 * Close modal
 */
export function closeModal(): void {
  const modal = document.getElementById('file-modal');
  const installDropdown = document.getElementById('install-dropdown');
  
  if (modal) {
    modal.classList.add('hidden');
  }
  if (installDropdown) {
    installDropdown.classList.remove('open');
  }
  
  currentFilePath = null;
  currentFileContent = null;
  currentFileType = null;
}

/**
 * Get current file path (for external use)
 */
export function getCurrentFilePath(): string | null {
  return currentFilePath;
}

/**
 * Get current file content (for external use)
 */
export function getCurrentFileContent(): string | null {
  return currentFileContent;
}
