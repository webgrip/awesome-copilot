/**
 * Modal functionality for file viewing
 */

import { fetchFileContent, getVSCodeInstallUrl, copyToClipboard, showToast } from './utils';

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
}

/**
 * Open file viewer modal
 */
export async function openFileModal(filePath: string, type: string): Promise<void> {
  const modal = document.getElementById('file-modal');
  const title = document.getElementById('modal-title');
  const contentEl = document.getElementById('modal-content')?.querySelector('code');
  const installBtn = document.getElementById('install-btn') as HTMLAnchorElement | null;
  const installInsidersBtn = document.getElementById('install-insiders-btn') as HTMLAnchorElement | null;

  if (!modal || !title || !contentEl) return;

  currentFilePath = filePath;
  currentFileType = type;
  
  // Show modal with loading state
  title.textContent = filePath.split('/').pop() || filePath;
  contentEl.textContent = 'Loading...';
  modal.classList.remove('hidden');

  // Setup install buttons (VS Code and VS Code Insiders)
  const installUrl = getVSCodeInstallUrl(type, filePath, false);
  const installInsidersUrl = getVSCodeInstallUrl(type, filePath, true);
  
  if (installUrl && installBtn) {
    installBtn.href = installUrl;
    installBtn.style.display = 'inline-flex';
  } else if (installBtn) {
    installBtn.style.display = 'none';
  }
  
  if (installInsidersUrl && installInsidersBtn) {
    installInsidersBtn.href = installInsidersUrl;
    installInsidersBtn.style.display = 'inline-flex';
  } else if (installInsidersBtn) {
    installInsidersBtn.style.display = 'none';
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
  if (modal) {
    modal.classList.add('hidden');
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
