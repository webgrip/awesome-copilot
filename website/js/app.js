/**
 * Main application logic for the Awesome Copilot website
 */

// Modal state
let currentFilePath = null;
let currentFileContent = null;
let currentFileType = null;

/**
 * Initialize the application
 */
async function init() {
  // Initialize global search
  await initGlobalSearch();

  // Load stats for homepage
  await loadStats();

  // Load featured collections for homepage
  await loadFeaturedCollections();

  // Setup global search
  setupGlobalSearch();

  // Setup modal
  setupModal();
}

/**
 * Load and display stats on homepage
 */
async function loadStats() {
  const statsEl = document.getElementById('stats');
  if (!statsEl) return;

  const manifest = await fetchData('manifest.json');
  if (!manifest) return;

  const { counts } = manifest;
  statsEl.innerHTML = `
    <div class="stat">
      <div class="stat-value">${counts.agents}</div>
      <div class="stat-label">Agents</div>
    </div>
    <div class="stat">
      <div class="stat-value">${counts.prompts}</div>
      <div class="stat-label">Prompts</div>
    </div>
    <div class="stat">
      <div class="stat-value">${counts.instructions}</div>
      <div class="stat-label">Instructions</div>
    </div>
    <div class="stat">
      <div class="stat-value">${counts.skills}</div>
      <div class="stat-label">Skills</div>
    </div>
    <div class="stat">
      <div class="stat-value">${counts.collections}</div>
      <div class="stat-label">Collections</div>
    </div>
  `;
}

/**
 * Load featured collections for homepage
 */
async function loadFeaturedCollections() {
  const container = document.getElementById('featured-collections');
  if (!container) return;

  const collections = await fetchData('collections.json');
  if (!collections) return;

  const featured = collections.filter(c => c.featured).slice(0, 6);
  
  if (featured.length === 0) {
    // Show first 6 collections if none are featured
    featured.push(...collections.slice(0, 6));
  }

  container.innerHTML = featured.map(collection => `
    <div class="card" onclick="openCollectionModal('${collection.id}')">
      <div class="card-icon">📦</div>
      <h3>${escapeHtml(collection.name)}</h3>
      <p>${escapeHtml(truncate(collection.description, 100))}</p>
      ${collection.tags?.length ? `
        <div class="resource-meta">
          ${collection.tags.slice(0, 3).map(tag => `
            <span class="resource-tag">${escapeHtml(tag)}</span>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');
}

/**
 * Setup global search functionality
 */
function setupGlobalSearch() {
  const searchInput = document.getElementById('global-search');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput || !searchResults) return;

  const performSearch = debounce((query) => {
    if (!query || query.length < 2) {
      searchResults.classList.add('hidden');
      return;
    }

    const results = globalSearch.search(query, { limit: 10 });
    
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-result-item">
          <span class="search-result-title">No results found</span>
        </div>
      `;
    } else {
      searchResults.innerHTML = results.map(item => `
        <div class="search-result-item" onclick="openFileModal('${item.path}', '${item.type}')">
          <span class="search-result-type">${item.type}</span>
          <span class="search-result-title">${globalSearch.highlight(item.title, query)}</span>
          <span class="search-result-description">${escapeHtml(truncate(item.description, 60))}</span>
        </div>
      `).join('');
    }
    
    searchResults.classList.remove('hidden');
  }, 200);

  searchInput.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });

  // Close results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.add('hidden');
    }
  });

  // Handle keyboard navigation
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchResults.classList.add('hidden');
      searchInput.blur();
    }
  });
}

/**
 * Setup modal functionality
 */
function setupModal() {
  const modal = document.getElementById('file-modal');
  const closeBtn = document.getElementById('close-modal');
  const copyBtn = document.getElementById('copy-btn');
  const installBtn = document.getElementById('install-vscode-btn');

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
async function openFileModal(filePath, type) {
  const modal = document.getElementById('file-modal');
  const title = document.getElementById('modal-title');
  const content = document.getElementById('modal-content').querySelector('code');
  const installBtn = document.getElementById('install-vscode-btn');

  if (!modal) return;

  currentFilePath = filePath;
  currentFileType = type;
  
  // Show modal with loading state
  title.textContent = filePath.split('/').pop();
  content.textContent = 'Loading...';
  modal.classList.remove('hidden');

  // Setup install button
  const installUrl = getVSCodeInstallUrl(type, filePath);
  if (installUrl && installBtn) {
    installBtn.href = installUrl;
    installBtn.style.display = 'inline-flex';
  } else if (installBtn) {
    installBtn.style.display = 'none';
  }

  // Fetch and display content
  const fileContent = await fetchFileContent(filePath);
  currentFileContent = fileContent;
  
  if (fileContent) {
    content.textContent = fileContent;
  } else {
    content.textContent = 'Failed to load file content. Click the button below to view on GitHub.';
  }
}

/**
 * Open collection modal (for homepage)
 */
async function openCollectionModal(collectionId) {
  const collections = await fetchData('collections.json');
  const collection = collections?.find(c => c.id === collectionId);
  
  if (collection) {
    openFileModal(collection.path, 'collection');
  }
}

/**
 * Close modal
 */
function closeModal() {
  const modal = document.getElementById('file-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
  currentFilePath = null;
  currentFileContent = null;
  currentFileType = null;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
