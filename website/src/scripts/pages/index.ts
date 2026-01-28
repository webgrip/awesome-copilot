/**
 * Homepage functionality
 */
import { FuzzySearch, type SearchItem } from '../search';
import { fetchData, debounce, escapeHtml, truncate, getResourceIcon } from '../utils';
import { setupModal, openFileModal } from '../modal';

interface Manifest {
  counts: {
    agents: number;
    prompts: number;
    instructions: number;
    skills: number;
    collections: number;
  };
}

interface Collection {
  id: string;
  name: string;
  description?: string;
  path: string;
  tags?: string[];
  featured?: boolean;
  itemCount: number;
}

interface CollectionsData {
  items: Collection[];
}

export async function initHomepage(): Promise<void> {
  // Load manifest for stats
  const manifest = await fetchData<Manifest>('manifest.json');
  if (manifest && manifest.counts) {
    const statsEl = document.getElementById('stats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat"><span class="stat-value">${manifest.counts.agents}</span><span class="stat-label">Agents</span></div>
        <div class="stat"><span class="stat-value">${manifest.counts.prompts}</span><span class="stat-label">Prompts</span></div>
        <div class="stat"><span class="stat-value">${manifest.counts.instructions}</span><span class="stat-label">Instructions</span></div>
        <div class="stat"><span class="stat-value">${manifest.counts.skills}</span><span class="stat-label">Skills</span></div>
        <div class="stat"><span class="stat-value">${manifest.counts.collections}</span><span class="stat-label">Collections</span></div>
      `;
    }
  }

  // Load search index
  const searchIndex = await fetchData<SearchItem[]>('search-index.json');
  if (searchIndex) {
    const search = new FuzzySearch();
    search.setItems(searchIndex);
    
    const searchInput = document.getElementById('global-search') as HTMLInputElement;
    const resultsDiv = document.getElementById('search-results');
    
    if (searchInput && resultsDiv) {
      searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.trim();
        if (query.length < 2) {
          resultsDiv.classList.add('hidden');
          return;
        }
        
        const results = search.search(query).slice(0, 10);
        if (results.length === 0) {
          resultsDiv.innerHTML = '<div class="search-result-empty">No results found</div>';
        } else {
          resultsDiv.innerHTML = results.map(item => `
            <div class="search-result" data-path="${escapeHtml(item.path)}" data-type="${escapeHtml(item.type)}">
              <span class="search-result-type">${getResourceIcon(item.type)}</span>
              <div>
                <div class="search-result-title">${search.highlight(item.title, query)}</div>
                <div class="search-result-description">${truncate(item.description, 60)}</div>
              </div>
            </div>
          `).join('');

          // Add click handlers
          resultsDiv.querySelectorAll('.search-result').forEach(el => {
            el.addEventListener('click', () => {
              const path = (el as HTMLElement).dataset.path;
              const type = (el as HTMLElement).dataset.type;
              if (path && type) openFileModal(path, type);
            });
          });
        }
        resultsDiv.classList.remove('hidden');
      }, 200));
      
      // Close results when clicking outside
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target as Node) && !resultsDiv.contains(e.target as Node)) {
          resultsDiv.classList.add('hidden');
        }
      });
    }
  }

  // Load featured collections
  const collectionsData = await fetchData<CollectionsData>('collections.json');
  if (collectionsData && collectionsData.items) {
    const featured = collectionsData.items.filter(c => c.featured).slice(0, 6);
    const featuredEl = document.getElementById('featured-collections');
    if (featuredEl) {
      if (featured.length > 0) {
        featuredEl.innerHTML = featured.map(c => `
          <div class="card" data-path="${escapeHtml(c.path)}">
            <h3>${escapeHtml(c.name)}</h3>
            <p>${escapeHtml(truncate(c.description, 80))}</p>
            <div class="resource-meta">
              <span class="resource-tag">${c.itemCount} items</span>
              ${c.tags?.slice(0, 3).map(t => `<span class="resource-tag">${escapeHtml(t)}</span>`).join('') || ''}
            </div>
          </div>
        `).join('');

        // Add click handlers
        featuredEl.querySelectorAll('.card').forEach(el => {
          el.addEventListener('click', () => {
            const path = (el as HTMLElement).dataset.path;
            if (path) openFileModal(path, 'collection');
          });
        });
      } else {
        featuredEl.innerHTML = '<p style="text-align: center; color: var(--color-text-muted);">No featured collections yet</p>';
      }
    }
  }

  // Setup modal
  setupModal();
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initHomepage);
