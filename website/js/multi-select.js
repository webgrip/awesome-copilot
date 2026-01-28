/**
 * Multi-select dropdown component
 * Creates a dropdown with checkboxes for multiple selections
 */
class MultiSelect {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      placeholder: options.placeholder || 'Select...',
      searchable: options.searchable !== false,
      onChange: options.onChange || (() => {}),
      maxDisplay: options.maxDisplay || 2,
    };
    this.items = [];
    this.selected = new Set();
    this.isOpen = false;
    this.searchQuery = '';
    
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.container.classList.add('multi-select');
    this.container.innerHTML = `
      <button type="button" class="multi-select-trigger" aria-haspopup="listbox" aria-expanded="false">
        <span class="multi-select-display">${this.options.placeholder}</span>
        <svg class="multi-select-arrow" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"/>
        </svg>
      </button>
      <div class="multi-select-dropdown" role="listbox" aria-multiselectable="true">
        ${this.options.searchable ? `
          <div class="multi-select-search-wrapper">
            <input type="text" class="multi-select-search" placeholder="Search..." autocomplete="off">
          </div>
        ` : ''}
        <div class="multi-select-options"></div>
        <div class="multi-select-actions">
          <button type="button" class="multi-select-clear">Clear</button>
          <button type="button" class="multi-select-done">Done</button>
        </div>
      </div>
    `;

    this.trigger = this.container.querySelector('.multi-select-trigger');
    this.display = this.container.querySelector('.multi-select-display');
    this.dropdown = this.container.querySelector('.multi-select-dropdown');
    this.optionsContainer = this.container.querySelector('.multi-select-options');
    this.searchInput = this.container.querySelector('.multi-select-search');
    this.clearBtn = this.container.querySelector('.multi-select-clear');
    this.doneBtn = this.container.querySelector('.multi-select-done');
  }

  setupEventListeners() {
    // Toggle dropdown
    this.trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Search
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        this.searchQuery = this.searchInput.value.toLowerCase();
        this.renderOptions();
      });
      this.searchInput.addEventListener('click', (e) => e.stopPropagation());
    }

    // Clear selection
    this.clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.clearSelection();
    });

    // Done button
    this.doneBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.close();
      }
    });

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  setItems(items) {
    this.items = items.map(item => {
      if (typeof item === 'string') {
        return { value: item, label: item };
      }
      return item;
    });
    this.renderOptions();
  }

  renderOptions() {
    const filteredItems = this.items.filter(item => {
      if (!this.searchQuery) return true;
      return item.label.toLowerCase().includes(this.searchQuery);
    });

    if (filteredItems.length === 0) {
      this.optionsContainer.innerHTML = '<div class="multi-select-empty">No options found</div>';
      return;
    }

    this.optionsContainer.innerHTML = filteredItems.map(item => `
      <label class="multi-select-option" data-value="${this.escapeHtml(item.value)}" title="${this.escapeHtml(item.label)}">
        <input type="checkbox" ${this.selected.has(item.value) ? 'checked' : ''}>
        <span class="multi-select-checkbox"></span>
        <span class="multi-select-label">${this.escapeHtml(item.label)}</span>
      </label>
    `).join('');

    // Add change listeners to checkboxes
    this.optionsContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const value = e.target.closest('.multi-select-option').dataset.value;
        if (e.target.checked) {
          this.selected.add(value);
        } else {
          this.selected.delete(value);
        }
        this.updateDisplay();
        this.options.onChange(this.getSelected());
      });
    });
  }

  updateDisplay() {
    const selected = this.getSelected();
    if (selected.length === 0) {
      this.display.textContent = this.options.placeholder;
      this.display.classList.remove('has-value');
    } else if (selected.length <= this.options.maxDisplay) {
      this.display.textContent = selected.join(', ');
      this.display.classList.add('has-value');
    } else {
      this.display.textContent = `${selected.length} selected`;
      this.display.classList.add('has-value');
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.container.classList.add('is-open');
    this.trigger.setAttribute('aria-expanded', 'true');
    if (this.searchInput) {
      this.searchInput.value = '';
      this.searchQuery = '';
      this.renderOptions();
      setTimeout(() => this.searchInput.focus(), 10);
    }
  }

  close() {
    this.isOpen = false;
    this.container.classList.remove('is-open');
    this.trigger.setAttribute('aria-expanded', 'false');
  }

  getSelected() {
    return Array.from(this.selected);
  }

  setSelected(values) {
    this.selected = new Set(values);
    this.renderOptions();
    this.updateDisplay();
  }

  clearSelection() {
    this.selected.clear();
    this.renderOptions();
    this.updateDisplay();
    this.options.onChange(this.getSelected());
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MultiSelect;
}
