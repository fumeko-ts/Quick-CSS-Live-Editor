(() => {
  const CSS_URL = 'https://raw.githubusercontent.com/fumeko-ts/Quick-CSS-Live-Editor/main/ui.css';
  const HOVER_HINTS_URL = 'https://raw.githubusercontent.com/fumeko-ts/Quick-CSS-Live-Editor/main/hover-text.atemp';

  let styleOptions = {};
  let selected = null;
  let underCursorElements = [];
  let underCursorIndex = 0;
  let currentTab = 0;
  let allowTransparentStyling = false;
  let recolorAllText = false;
  const tabs = ['Panels', 'Text', 'Links', 'Images'];

  const predefinedColors = [
    "black", "white", "red", "green", "blue", "cyan", "magenta", "yellow", "gray",
    "lime", "maroon", "navy", "olive", "orange", "purple", "silver", "teal",
    "aqua", "fuchsia", "coral", "gold", "pink", "violet", "indigo", "beige",
    "brown", "salmon", "tan", "turquoise", "plum", "khaki", "lavender",
    "#4fc3f7", "#3f7fcf", "#222", "#1f1f1f", "rgba(79,195,247,0.75)", "transparent"
  ];

  function isInsideLink(el) {
    while (el) {
      if (el.tagName && el.tagName.toLowerCase() === 'a') return true;
      el = el.parentElement;
    }
    return false;
  }

  async function loadCSS(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load CSS');
      const cssText = await res.text();
      const styleTag = document.createElement('style');
      styleTag.id = 'element-styler-css';
      styleTag.textContent = cssText;
      document.head.appendChild(styleTag);
    } catch (e) {
      console.error('Error loading CSS:', e);
    }
  }

  async function loadHoverHints() {
    try {
      const res = await fetch(HOVER_HINTS_URL);
      if (!res.ok) throw new Error('Failed to load hover hints');
      styleOptions = await res.json();
    } catch (e) {
      console.error('Error loading hover hints:', e);
      styleOptions = {};
    }
  }

  function createUI() {
    const overlay = document.createElement('div');
    overlay.id = 'element-styler-overlay';
    document.body.appendChild(overlay);

    const infoTooltip = document.createElement('div');
    infoTooltip.id = 'element-styler-info-tooltip';
    document.body.appendChild(infoTooltip);

    const panel = document.createElement('div');
    panel.id = 'element-styler-panel';
    panel.innerHTML = `
      <div class="title">Element Styler</div>
      <div id="tabButtons"></div>
      <div id="tabContent"></div>
      <label for="toggleTransparent" class="transparent-label" style="display:block; margin-top:8px;">
        <input type="checkbox" id="toggleTransparent" />
        Allow styling transparent elements
      </label>
      <label for="toggleRecolorAll" style="display:block; margin-top:8px;">
        <input type="checkbox" id="toggleRecolorAll" />
        Recolor all text (except links)
      </label>
      <label for="toggleElementRemove" style="display:block; margin-top:8px;">
        <input type="checkbox" id="toggleElementRemove" />
        Element Remove
      </label>
      <label for="toggleRemoveChildren" style="display:block; margin-left: 20px; margin-top: 4px;">
        <input type="checkbox" id="toggleRemoveChildren" />
        Remove Children
      </label>
      <button id="applyStyle">Apply</button>
      <button id="resetStyle" style="margin-left: 8px;">Reset CSS</button>
      <label for="cssOutput" class="output-label" style="display:block; margin-top:8px;">CSS Output:</label>
      <textarea id="cssOutput" readonly></textarea>
    `;
    document.body.appendChild(panel);

    const hintBox = document.createElement('div');
    hintBox.id = 'element-styler-hint-box';
    document.body.appendChild(hintBox);

    return { overlay, infoTooltip, panel, hintBox };
  }

  function createPropertyRow(propName, tabName) {
    const description = styleOptions[tabName]?.[propName] || '';
    const wrapper = document.createElement('div');
    wrapper.className = 'property-row';

    const label = document.createElement('label');
    label.textContent = propName;
    label.title = description;
    label.className = 'property-label';
    label.addEventListener('mouseenter', () => {
      const hintBox = document.getElementById('element-styler-hint-box');
      hintBox.style.display = 'block';
      hintBox.textContent = description;
    });
    label.addEventListener('mouseleave', () => {
      const hintBox = document.getElementById('element-styler-hint-box');
      hintBox.style.display = 'none';
      hintBox.textContent = '';
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('data-style', propName);
    input.className = 'style-input';

    const colorProps = ['color', 'backgroundColor', 'border', 'boxShadow', 'hoverColor', 'textDecoration'];
    let dropdown = null;
    if (
      colorProps.some(k => k.toLowerCase() === propName.toLowerCase()) ||
      description.toLowerCase().includes('color')
    ) {
      dropdown = document.createElement('select');
      dropdown.className = 'color-dropdown';
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = '-- select color --';
      dropdown.appendChild(emptyOption);
      for (const color of predefinedColors) {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        dropdown.appendChild(option);
      }
      dropdown.addEventListener('change', () => {
        input.value = dropdown.value;
      });
    }

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    if (dropdown) wrapper.appendChild(dropdown);
    return wrapper;
  }

  function renderTab(panel) {
    const tabContent = panel.querySelector('#tabContent');
    tabContent.innerHTML = '';
    const tabName = tabs[currentTab];
    const properties = styleOptions[tabName] || {};

    for (const propName in properties) {
      const row = createPropertyRow(propName, tabName);
      tabContent.appendChild(row);
    }
  }

  function updateTabButtons(panel) {
    const tabButtons = panel.querySelector('#tabButtons');
    tabButtons.innerHTML = '';
    tabs.forEach((tab, i) => {
      const btn = document.createElement('button');
      btn.textContent = tab;
      if (i === currentTab) btn.classList.add('active');
      btn.onclick = () => {
        currentTab = i;
        updateTabButtons(panel);
        renderTab(panel);
        clearRemoveToggles(panel);
      };
      tabButtons.appendChild(btn);
    });
  }

  function updateInfoTooltip(element, event) {
    const tooltip = document.getElementById('element-styler-info-tooltip');
    if (!element) {
      tooltip.style.opacity = 0;
      return;
    }
    const tag = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const classes = element.className ? '.' + element.className.trim().replace(/\s+/g, '.') : '';
    tooltip.textContent = `${tag}${id}${classes}`;
    if (event) {
      const padding = 12;
      let x = event.clientX + padding;
      let y = event.clientY + padding;
      const { innerWidth, innerHeight } = window;
      const rect = tooltip.getBoundingClientRect();
      if (x + rect.width > innerWidth) x = event.clientX - rect.width - padding;
      if (y + rect.height > innerHeight) y = event.clientY - rect.height - padding;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
      tooltip.style.opacity = 1;
    }
  }

  function isVisible(element) {
    const style = window.getComputedStyle(element);
    return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  function isScrollable(el) {
    const style = window.getComputedStyle(el);
    return ['auto', 'scroll'].includes(style.overflow) ||
      ['auto', 'scroll'].includes(style.overflowX) ||
      ['auto', 'scroll'].includes(style.overflowY);
  }

  function clearInlineColorsInsideLinks() {
    document.querySelectorAll('a').forEach(a => {
      a.querySelectorAll('*').forEach(child => {
        if (child.style && child.style.color) {
          child.style.color = '';
        }
      });
    });
  }

  function getSelector(el) {
    if (!el) return '';
    if (el.id) return `#${el.id}`;
    if (el.className) {
      const classes = el.className.trim().split(/\s+/).join('.');
      return `${el.tagName.toLowerCase()}.${classes}`;
    }
    return el.tagName.toLowerCase();
  }

  function clearRemoveRules(outputEl) {
    const lines = outputEl.value.split('\n');
    const filtered = lines.filter(line => !line.includes('/* element-remove') && !line.includes('/* element-remove-children'));
    outputEl.value = filtered.join('\n').trim() + (filtered.length ? '\n\n' : '');
  }

  function clearRemoveToggles(panel) {
    panel.querySelector('#toggleElementRemove').checked = false;
    panel.querySelector('#toggleRemoveChildren').checked = false;
  }

  function setupEventListeners(overlay, infoTooltip, panel, hintBox) {
    const toggleElementRemove = panel.querySelector('#toggleElementRemove');
    const toggleRemoveChildren = panel.querySelector('#toggleRemoveChildren');
    const output = panel.querySelector('#cssOutput');

    document.addEventListener('mousemove', e => {
      if (!e.altKey) {
        if (!selected) {
          overlay.style.display = 'none';
          updateInfoTooltip(null);
          underCursorElements = [];
          clearRemoveToggles(panel);
        }
        return;
      }
      underCursorElements = document.elementsFromPoint(e.clientX, e.clientY)
        .filter(el => el !== overlay && el !== infoTooltip && el !== panel && el !== hintBox);
      if (underCursorElements.length) {
        underCursorIndex = 0;
        selected = underCursorElements[0];
        updateInfoTooltip(selected, e);
        const r = selected.getBoundingClientRect();
        Object.assign(overlay.style, {
          display: 'block',
          top: `${window.scrollY + r.top}px`,
          left: `${window.scrollX + r.left}px`,
          width: `${r.width}px`,
          height: `${r.height}px`
        });

        const selector = getSelector(selected);
        const cssText = output.value;

        toggleElementRemove.checked = cssText.includes(`${selector} { display: none; /* element-remove */`);
        toggleRemoveChildren.checked = cssText.includes(`${selector} > * { display: none; /* element-remove-children */`);

      } else {
        selected = null;
        overlay.style.display = 'none';
        updateInfoTooltip(null);
        clearRemoveToggles(panel);
      }
    });

    document.addEventListener('wheel', e => {
      if (!e.altKey || underCursorElements.length <= 1) return;
      const target = e.target;
      if (isScrollable(target)) return;
      e.preventDefault();
      e.stopPropagation();
      const dir = Math.sign(e.deltaY);
      underCursorIndex = (underCursorIndex + dir + underCursorElements.length) % underCursorElements.length;
      selected = underCursorElements[underCursorIndex];
      updateInfoTooltip(selected, e);
      const r = selected.getBoundingClientRect();
      Object.assign(overlay.style, {
        display: 'block',
        top: `${window.scrollY + r.top}px`,
        left: `${window.scrollX + r.left}px`,
        width: `${r.width}px`,
        height: `${r.height}px`
      });

      const selector = getSelector(selected);
      const cssText = output.value;
      toggleElementRemove.checked = cssText.includes(`${selector} { display: none; /* element-remove */`);
      toggleRemoveChildren.checked = cssText.includes(`${selector} > * { display: none; /* element-remove-children */`);
    }, { passive: false });

    toggleElementRemove.addEventListener('change', () => {
      if (!selected) return;
      const selector = getSelector(selected);
      if (!selector) return;

      clearRemoveRules(output);

      if (toggleElementRemove.checked) {
        output.value += `${selector} { display: none; /* element-remove */ }\n\n`;
        if (toggleRemoveChildren.checked) {
          output.value += `${selector} > * { display: none; /* element-remove-children */ }\n\n`;
        }
      } else {
        toggleRemoveChildren.checked = false;
      }
    });

    toggleRemoveChildren.addEventListener('change', () => {
      if (!selected) return;
      const selector = getSelector(selected);
      if (!selector) return;

      clearRemoveRules(output);

      if (toggleElementRemove.checked && toggleRemoveChildren.checked) {
        output.value += `${selector} { display: none; /* element-remove */ }\n\n`;
        output.value += `${selector} > * { display: none; /* element-remove-children */ }\n\n`;
      } else if (toggleElementRemove.checked) {
        output.value += `${selector} { display: none; /* element-remove */ }\n\n`;
      }
    });

    panel.querySelector('#applyStyle').onclick = () => {
      if (!selected && currentTab !== 1) return;

      if (!document.body.contains(selected)) {
        alert('Selected element no longer exists.');
        selected = null;
        clearRemoveToggles(panel);
        return;
      }

      if (!allowTransparentStyling && selected && !isVisible(selected) && selected.tagName.toLowerCase() !== 'img') {
        alert('Selected element is invisible or transparent — styles will not be applied unless toggle is enabled.');
        return;
      }

      const inputs = panel.querySelectorAll('input[data-style]');

      if (currentTab === 1) {
        if (recolorAllText) {
          clearInlineColorsInsideLinks();
          const textElements = Array.from(document.body.querySelectorAll('*')).filter(el => {
            if (el.tagName.toLowerCase() === 'a' || el.tagName.toLowerCase() === 'img') return false;
            if (!el.textContent.trim()) return false;
            if (isInsideLink(el)) return false;
            return true;
          });

          textElements.forEach(el => {
            inputs.forEach(input => {
              const key = input.getAttribute('data-style');
              let val = input.value.trim();
              if (!val) return;
              if (/^\d+(\.\d+)?$/.test(val) && key !== 'color') val += 'px';
              el.style[key] = val;
            });
          });

          inputs.forEach(input => {
            const key = input.getAttribute('data-style');
            let val = input.value.trim();
            if (!val) return;
            if (/^\d+(\.\d+)?$/.test(val) && key !== 'color') val += 'px';
            const cssKey = key.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
            panel.querySelector('#cssOutput').value += `*:not(a):not(img) {\n  ${cssKey}: ${val};\n}\n\n`;
          });

        } else {
          if (!selected) return;
          if (selected.tagName.toLowerCase() === 'a' || isInsideLink(selected)) {
            alert('Cannot recolor links or elements inside links when toggle is off.');
            return;
          }
          inputs.forEach(input => {
            const key = input.getAttribute('data-style');
            let val = input.value.trim();
            if (!val) return;
            if (/^\d+(\.\d+)?$/.test(val) && key !== 'color') val += 'px';
            selected.style[key] = val;
          });

          inputs.forEach(input => {
            const key = input.getAttribute('data-style');
            let val = input.value.trim();
            if (!val) return;
            if (/^\d+(\.\d+)?$/.test(val) && key !== 'color') val += 'px';
            const cssKey = key.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
            const tag = selected.tagName.toLowerCase();
            const id = selected.id ? '#' + selected.id : '';
            const classes = selected.className ? '.' + selected.className.trim().replace(/\s+/g, '.') : '';
            const selector = id || classes || tag;
            panel.querySelector('#cssOutput').value += `${selector} {\n  ${cssKey}: ${val};\n}\n\n`;
          });
        }
      } else if (currentTab === 2) {
        let styleTag = document.getElementById('link-hover-style');
        if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.id = 'link-hover-style';
          document.head.appendChild(styleTag);
        }
        clearInlineColorsInsideLinks();

        const newStyles = [];

        inputs.forEach(input => {
          const key = input.getAttribute('data-style');
          let val = input.value.trim();
          if (!val) return;

          if (key !== 'hoverColor' && /^\d+(\.\d+)?$/.test(val)) val += 'px';

          if (key === 'hoverColor') {
            newStyles.push(`a:hover { color: ${val}; }`);
            panel.querySelector('#cssOutput').value += `a:hover {\n  color: ${val};\n}\n\n`;
          } else {
            document.querySelectorAll('a').forEach(a => { a.style[key] = val; });
            const cssKey = key.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
            panel.querySelector('#cssOutput').value += `a {\n  ${cssKey}: ${val};\n}\n\n`;
          }
        });

        styleTag.innerHTML = newStyles.join('\n') + '\n';

      } else {
        let styleTag = document.getElementById('hover-style');
        if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.id = 'hover-style';
          document.head.appendChild(styleTag);
        }

        const newStyles = [];

        inputs.forEach(input => {
          const key = input.getAttribute('data-style');
          let val = input.value.trim();
          if (!val) return;

          if (key !== 'hoverColor' && /^\d+(\.\d+)?$/.test(val)) val += 'px';

          if (key === 'hoverColor') {
            selected.setAttribute('data-hover-style', val);
            newStyles.push(`${selected.tagName.toLowerCase()}[data-hover-style]:hover { color: ${val}; }`);
            panel.querySelector('#cssOutput').value += `:hover {\n  color: ${val};\n}\n\n`;
          } else {
            selected.style[key] = val;
            const cssKey = key.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
            const tag = selected.tagName.toLowerCase();
            const id = selected.id ? '#' + selected.id : '';
            const classes = selected.className ? '.' + selected.className.trim().replace(/\s+/g, '.') : '';
            const selector = id || classes || tag;
            panel.querySelector('#cssOutput').value += `${selector} {\n  ${cssKey}: ${val};\n}\n\n`;
          }
        });

        styleTag.innerHTML = newStyles.join('\n') + '\n';
      }

      if (selected) {
        clearRemoveRules(output);
        const selector = getSelector(selected);
        if (toggleElementRemove.checked) {
          output.value += `${selector} { display: none; /* element-remove */ }\n\n`;
          if (toggleRemoveChildren.checked) {
            output.value += `${selector} > * { display: none; /* element-remove-children */ }\n\n`;
          }
        }
      }

      renderTab(panel);
    };

    panel.querySelector('#resetStyle').onclick = () => {
      const styleHover = document.getElementById('hover-style');
      const styleLinkHover = document.getElementById('link-hover-style');
      if (styleHover) styleHover.innerHTML = '';
      if (styleLinkHover) styleLinkHover.innerHTML = '';

      if (selected) {
        selected.removeAttribute('data-hover-style');
        selected.style.cssText = '';
      }

      clearInlineColorsInsideLinks();

      const output = panel.querySelector('#cssOutput');
      output.value = '';

      renderTab(panel);

      clearRemoveToggles(panel);
    };

    let lastSelected = null;
    const observer = new MutationObserver(() => {
      if (selected !== lastSelected) {
        lastSelected = selected;
        clearRemoveToggles(panel);
      }
    });
    observer.observe(document.body, { subtree: true, childList: true });

  }

  async function init() {
    await loadCSS(CSS_URL);
    await loadHoverHints();

    const { overlay, infoTooltip, panel, hintBox } = createUI();

    updateTabButtons(panel);
    renderTab(panel);
    setupEventListeners(overlay, infoTooltip, panel, hintBox);
  }

  init();
})();
