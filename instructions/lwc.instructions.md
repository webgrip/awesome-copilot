---
description: Guidelines and best practices for developing Lightning Web Components (LWC) on Salesforce Platform.
applyTo: 'force-app/main/default/lwc/**'

---

# LWC Development

## General Instructions

- Each LWC should reside in its own folder under `force-app/main/default/lwc/`.
- The folder name should match the component name (e.g., `myComponent` for `myComponent`).
- Each component folder should contain the following files:
    - `myComponent.html`: The HTML template file.
    - `myComponent.js`: The JavaScript controller file.
    - `myComponent.js-meta.xml`: The metadata configuration file.
    - Optional: `myComponent.css` for component-specific styles.
    - Optional: `myComponent.test.js` for Jest unit tests.

## Development Best Practices
### Component Design
- **Single Responsibility**: Each component should have a single, well-defined purpose.
- **Reusability**: Design components to be reusable across different parts of the application.
- **Composition**: Prefer composing smaller components into larger ones rather than creating monolithic components.
- **Public API**: Use `@api` decorators to expose properties and methods that need to be accessed by parent components.
- **Private State**: Use `@track` for reactive properties that are internal to the component.

### Performance Optimization
- **Lazy Loading**: Load components only when needed to improve initial load times.
- **Efficient Rendering**: Minimize DOM updates by batching changes and using conditional rendering.
- **Avoid Unnecessary Re-renders**: Use getters and setters wisely to prevent unnecessary re-renders.
- **Use Lightning Data Service (LDS)**: Prefer LDS for data access to leverage built-in caching and performance optimizations.

### Security Considerations
- **Sanitize Inputs**: Always sanitize user inputs to prevent XSS attacks.
- **Use `@wire`**: Prefer using `@wire` for data access to ensure security and compliance with Salesforce's security model.
- **Avoid Direct DOM Manipulation**: Use LWC's reactive properties and templates instead of manipulating the DOM directly.
# Lightning Web Component (LWC) Development Best Practices

## Core Principles

### 1. Use Lightning Components Over HTML Tags
Always prefer Lightning Web Component library components over plain HTML elements for consistency, accessibility, and future-proofing.

#### Recommended Approach
```html
<!-- Use Lightning components -->
<lightning-button label="Save" variant="brand" onclick={handleSave}></lightning-button>
<lightning-input type="text" label="Name" value={name} onchange={handleNameChange}></lightning-input>
<lightning-combobox label="Type" options={typeOptions} value={selectedType}></lightning-combobox>
<lightning-radio-group name="duration" label="Duration" options={durationOptions} value={duration} type="radio"></lightning-radio-group>
```

#### Avoid Plain HTML
```html
<!-- Avoid these -->
<button onclick={handleSave}>Save</button>
<input type="text" onchange={handleNameChange} />
<select onchange={handleTypeChange}>
    <option value="option1">Option 1</option>
</select>
```

### 2. Lightning Component Mapping Guide

| HTML Element | Lightning Component | Key Attributes |
|--------------|-------------------|----------------|
| `<button>` | `<lightning-button>` | `variant`, `label`, `icon-name` |
| `<input>` | `<lightning-input>` | `type`, `label`, `variant` |
| `<select>` | `<lightning-combobox>` | `options`, `value`, `placeholder` |
| `<textarea>` | `<lightning-textarea>` | `label`, `max-length` |
| `<input type="checkbox">` | `<lightning-input type="checkbox">` | `checked`, `label` |
| `<input type="radio">` | `<lightning-radio-group>` | `options`, `type`, `name` |
| `<input type="toggle">` | `<lightning-input type="toggle">` | `checked`, `variant` |
| Custom pills | `<lightning-pill>` | `label`, `name`, `onremove` |
| Icons | `<lightning-icon>` | `icon-name`, `size`, `variant` |

### 3. SLDS2 Design System Compliance

#### Use SLDS Utility Classes
Always use Salesforce Lightning Design System utility classes with the `slds-var-` prefix for modern implementations:

```html
<!-- Spacing -->
<div class="slds-var-m-around_medium slds-var-p-top_large">
    <div class="slds-var-m-bottom_small">Content</div>
</div>

<!-- Layout -->
<div class="slds-grid slds-wrap slds-gutters_small">
    <div class="slds-col slds-size_1-of-2 slds-medium-size_1-of-3">
        <!-- Content -->
    </div>
</div>

<!-- Typography -->
<h2 class="slds-text-heading_medium slds-var-m-bottom_small">Section Title</h2>
<p class="slds-text-body_regular">Description text</p>
```

#### SLDS Component Patterns
```html
<!-- Card Layout -->
<article class="slds-card slds-var-m-around_medium">
    <header class="slds-card__header">
        <h2 class="slds-text-heading_small">Card Title</h2>
    </header>
    <div class="slds-card__body slds-card__body_inner">
        <!-- Card content -->
    </div>
    <footer class="slds-card__footer">
        <!-- Card actions -->
    </footer>
</article>

<!-- Form Layout -->
<div class="slds-form slds-form_stacked">
    <div class="slds-form-element">
        <lightning-input label="Field Label" value={fieldValue}></lightning-input>
    </div>
</div>
```

### 4. Avoid Custom CSS

#### Use SLDS Classes
```html
<!-- Color and theming -->
<div class="slds-theme_success slds-text-color_inverse slds-var-p-around_small">
    Success message
</div>

<div class="slds-theme_error slds-text-color_inverse slds-var-p-around_small">
    Error message
</div>

<div class="slds-theme_warning slds-text-color_inverse slds-var-p-around_small">
    Warning message
</div>
```

#### Avoid Custom CSS
```css
/* Don't create custom styles that override SLDS */
.custom-button {
    background-color: red;
    padding: 10px;
}

.my-special-layout {
    display: flex;
    justify-content: center;
}
```

#### When Custom CSS is Necessary
If you must use custom CSS, follow these guidelines:
- Use CSS custom properties (design tokens) when possible
- Prefix custom classes to avoid conflicts
- Never override SLDS base classes

```css
/* Custom CSS example */
.my-component-special {
    border-radius: var(--lwc-borderRadiusMedium);
    box-shadow: var(--lwc-shadowButton);
}
```

### 5. Component Architecture Best Practices

#### Reactive Properties
```javascript
import { LightningElement, track, api } from 'lwc';

export default class MyComponent extends LightningElement {
    // Use @api for public properties
    @api recordId;
    @api title;

    // Use @track sparingly - prefer reactive properties
    @track complexObject = {};

    // Simple reactive properties (no decorator needed)
    name = '';
    isLoading = false;

    // Computed properties
    get displayName() {
        return this.name ? `Hello, ${this.name}` : 'Hello, Guest';
    }
}
```

#### Event Handling Patterns
```javascript
// Custom event dispatch
handleSave() {
    const saveEvent = new CustomEvent('save', {
        detail: {
            recordData: this.recordData,
            timestamp: new Date()
        }
    });
    this.dispatchEvent(saveEvent);
}

// Lightning component event handling
handleInputChange(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    // For lightning-input, lightning-combobox, etc.
    this[fieldName] = fieldValue;
}

handleRadioChange(event) {
    // For lightning-radio-group
    this.selectedValue = event.detail.value;
}

handleToggleChange(event) {
    // For lightning-input type="toggle"
    this.isToggled = event.detail.checked;
}
```

### 6. Data Handling and Wire Services

#### Use @wire for Data Access
```javascript
import { getRecord } from 'lightning/uiRecordApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class MyComponent extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    record;

    @wire(getObjectInfo, { objectApiName: 'Account' })
    objectInfo;

    get recordData() {
        return this.record.data ? this.record.data.fields : {};
    }
}
```

### 7. Error Handling and User Experience

#### Implement Proper Error Boundaries
```javascript
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class MyComponent extends LightningElement {
    isLoading = false;
    error = null;

    async handleAsyncOperation() {
        this.isLoading = true;
        this.error = null;

        try {
            const result = await this.performOperation();
            this.showSuccessToast();
        } catch (error) {
            this.error = error;
            this.showErrorToast(error.body?.message || 'An error occurred');
        } finally {
            this.isLoading = false;
        }
    }

    showSuccessToast() {
        const event = new ShowToastEvent({
            title: 'Success',
            message: 'Operation completed successfully',
            variant: 'success'
        });
        this.dispatchEvent(event);
    }

    showErrorToast(message) {
        const event = new ShowToastEvent({
            title: 'Error',
            message: message,
            variant: 'error',
            mode: 'sticky'
        });
        this.dispatchEvent(event);
    }
}
```

### 8. Performance Optimization

#### Conditional Rendering
```html
<!-- Use template directives for conditional rendering -->
<template if:true={isLoading}>
    <lightning-spinner alternative-text="Loading..."></lightning-spinner>
</template>

<template if:false={isLoading}>
    <template for:each={items} for:item="item">
        <div key={item.id} class="slds-var-m-bottom_small">
            {item.name}
        </div>
    </template>
</template>

<template if:true={error}>
    <div class="slds-theme_error slds-text-color_inverse slds-var-p-around_small">
        {error.message}
    </div>
</template>
```

### 9. Accessibility Best Practices

#### Use Proper ARIA Labels and Semantic HTML
```html
<!-- Use semantic structure -->
<section aria-label="Product Selection">
    <h2 class="slds-text-heading_medium">Products</h2>

    <lightning-input
        type="search"
        label="Search Products"
        placeholder="Enter product name..."
        aria-describedby="search-help">
    </lightning-input>

    <div id="search-help" class="slds-assistive-text">
        Type to filter the product list
    </div>
</section>
```

## Common Anti-Patterns to Avoid
1. **Direct DOM Manipulation**: Never use `document.querySelector()` or similar
2. **jQuery or External Libraries**: Avoid non-Lightning compatible libraries
3. **Inline Styles**: Use SLDS classes instead of `style` attributes
4. **Global CSS**: All styles should be scoped to the component
5. **Hardcoded Values**: Use custom labels, custom metadata, or constants
6. **Imperative API Calls**: Prefer `@wire` over imperative `import` calls when possible
7. **Memory Leaks**: Always clean up event listeners in `disconnectedCallback()`
