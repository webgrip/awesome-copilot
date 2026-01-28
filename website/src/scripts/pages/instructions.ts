/**
 * Instructions page functionality
 */
import { createChoices, getChoicesValues, type Choices } from '../choices';
import { FuzzySearch } from '../search';
import { fetchData, debounce, escapeHtml, getGitHubUrl, getVSCodeInstallUrl } from '../utils';
import { setupModal, openFileModal } from '../modal';

interface Instruction {
  title: string;
  description?: string;
  path: string;
  applyTo?: string;
  extensions?: string[];
}

interface InstructionsData {
  items: Instruction[];
  filters: {
    extensions: string[];
  };
}

const resourceType = 'instruction';
let allItems: Instruction[] = [];
let search = new FuzzySearch();
let extensionSelect: Choices;
let currentFilters = { extensions: [] as string[] };

function applyFiltersAndRender(): void {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const countEl = document.getElementById('results-count');
  const query = searchInput?.value || '';

  let results = query ? search.search(query) : [...allItems];

  if (currentFilters.extensions.length > 0) {
    results = results.filter(item => {
      if (currentFilters.extensions.includes('(none)') && (!item.extensions || item.extensions.length === 0)) {
        return true;
      }
      return item.extensions?.some(ext => currentFilters.extensions.includes(ext));
    });
  }

  renderItems(results, query);
  let countText = `${results.length} of ${allItems.length} instructions`;
  if (currentFilters.extensions.length > 0) {
    countText += ` (filtered by ${currentFilters.extensions.length} extension${currentFilters.extensions.length > 1 ? 's' : ''})`;
  }
  if (countEl) countEl.textContent = countText;
}

function renderItems(items: Instruction[], query = ''): void {
  const list = document.getElementById('resource-list');
  if (!list) return;

  if (items.length === 0) {
    list.innerHTML = '<div class="empty-state"><h3>No instructions found</h3><p>Try a different search term or adjust filters</p></div>';
    return;
  }

  list.innerHTML = items.map(item => `
    <div class="resource-item" data-path="${escapeHtml(item.path)}">
      <div class="resource-info">
        <div class="resource-title">${query ? search.highlight(item.title, query) : escapeHtml(item.title)}</div>
        <div class="resource-description">${escapeHtml(item.description || 'No description')}</div>
        <div class="resource-meta">
          ${item.applyTo ? `<span class="resource-tag">applies to: ${escapeHtml(item.applyTo)}</span>` : ''}
          ${item.extensions?.slice(0, 4).map(e => `<span class="resource-tag tag-extension">${escapeHtml(e)}</span>`).join('') || ''}
          ${item.extensions && item.extensions.length > 4 ? `<span class="resource-tag">+${item.extensions.length - 4} more</span>` : ''}
        </div>
      </div>
      <div class="resource-actions">
        <a href="${getVSCodeInstallUrl('instructions', item.path, false)}" class="btn btn-primary btn-small" target="_blank" onclick="event.stopPropagation()" title="Install to VS Code">
          <svg viewBox="0 0 100 100" width="14" height="14" fill="currentColor"><path d="M95.436 26.986L75.282 15.768a6.04 6.04 0 0 0-6.895.876L28.78 51.927 11.912 39.151a4.03 4.03 0 0 0-5.154.387l-5.36 4.878a4.03 4.03 0 0 0-.003 5.947l14.646 13.396-14.646 13.396a4.03 4.03 0 0 0 .003 5.947l5.36 4.878a4.03 4.03 0 0 0 5.154.387L28.78 74.59l39.607 35.283a6.04 6.04 0 0 0 6.895.876l20.154-11.218a6.04 6.04 0 0 0 3.127-5.288V32.274a6.04 6.04 0 0 0-3.127-5.288zM75.015 73.428L46.339 51.927l28.676-21.5z" transform="scale(0.16)"/></svg>
          VS Code
        </a>
        <a href="${getVSCodeInstallUrl('instructions', item.path, true)}" class="btn btn-secondary btn-small" target="_blank" onclick="event.stopPropagation()" title="Install to VS Code Insiders">
          Insiders
        </a>
        <a href="${getGitHubUrl(item.path)}" class="btn btn-secondary btn-small" target="_blank" onclick="event.stopPropagation()">
          GitHub
        </a>
      </div>
    </div>
  `).join('');

  // Add click handlers
  list.querySelectorAll('.resource-item').forEach(el => {
    el.addEventListener('click', () => {
      const path = (el as HTMLElement).dataset.path;
      if (path) openFileModal(path, resourceType);
    });
  });
}

export async function initInstructionsPage(): Promise<void> {
  const list = document.getElementById('resource-list');
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const clearFiltersBtn = document.getElementById('clear-filters');

  const data = await fetchData<InstructionsData>('instructions.json');
  if (!data || !data.items) {
    if (list) list.innerHTML = '<div class="empty-state"><h3>Failed to load data</h3></div>';
    return;
  }

  allItems = data.items;
  search.setItems(allItems);

  extensionSelect = createChoices('#filter-extension', { placeholderValue: 'All Extensions' });
  extensionSelect.setChoices(data.filters.extensions.map(e => ({ value: e, label: e })), 'value', 'label', true);
  document.getElementById('filter-extension')?.addEventListener('change', () => {
    currentFilters.extensions = getChoicesValues(extensionSelect);
    applyFiltersAndRender();
  });

  applyFiltersAndRender();
  searchInput?.addEventListener('input', debounce(() => applyFiltersAndRender(), 200));
  
  clearFiltersBtn?.addEventListener('click', () => {
    currentFilters = { extensions: [] };
    extensionSelect.removeActiveItems();
    if (searchInput) searchInput.value = '';
    applyFiltersAndRender();
  });
  
  setupModal();
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initInstructionsPage);
