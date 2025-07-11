(() => {
  const CSS_URL = 'https://raw.githubusercontent.com/fumeko-ts/Quick-CSS-Live-Editor/main/src/ui.css';
  const HOVER_HINTS_URL = 'https://raw.githubusercontent.com/fumeko-ts/Quick-CSS-Live-Editor/main/src/hover-text.atemp';
  window.HOVER_HINTS_URL = HOVER_HINTS_URL;
  let styleOptions = {},
    selected = null,
    underCursorElements = [],
    underCursorIndex = 0,
    currentTab = 0,
    allowTransparentStyling = false,
    recolorAllText = false;
  const tabs = ['Panels', 'Text', 'Links', 'Images'];
  const predefinedColors = [
    "black", "white", "red", "green", "blue", "cyan", "magenta", "yellow", "gray",
    "lime", "maroon", "navy", "olive", "orange", "purple", "silver", "teal",
    "aqua", "fuchsia", "coral", "gold", "pink", "violet", "indigo", "beige",
    "brown", "salmon", "tan", "turquoise", "plum", "khaki", "lavender",
    "#4fc3f7", "#3f7fcf", "#222", "#1f1f1f", "rgba(79,195,247,0.75)", "transparent"
  ];

  const isInsideLink = el => {
    while (el) {
      if (el.tagName?.toLowerCase() === 'a') return true;
      el = el.parentElement;
    }
    return false;
  };

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
    const overlay = Object.assign(document.createElement('div'), {
      id: 'element-styler-overlay'
    });
    const infoTooltip = Object.assign(document.createElement('div'), {
      id: 'element-styler-info-tooltip'
    });
    const panel = document.createElement('div');
    panel.id = 'element-styler-panel';
    panel.innerHTML = `
      <div class="title">Element Styler</div>
      <div id="tabButtons"></div>
      <div id="tabContent"></div>
      <label style="display:block; margin-top:8px;" for="toggleTransparent">
        <input type="checkbox" id="toggleTransparent" /> Allow styling transparent elements
      </label>
      <label style="display:block; margin-top:8px;" for="toggleRecolorAll">
        <input type="checkbox" id="toggleRecolorAll" /> Recolor all text (except links)
      </label>
      <label style="display:block; margin-top:8px;" for="toggleElementRemove">
        <input type="checkbox" id="toggleElementRemove" /> Element Remove
      </label>
      <label style="display:block; margin-left:20px; margin-top:4px;" for="toggleRemoveChildren">
        <input type="checkbox" id="toggleRemoveChildren" /> Remove Children
      </label>
      <button id="applyStyle">Apply</button>
      <button id="resetStyle" style="margin-left:8px;">Reset CSS</button>
      <label class="output-label" style="display:block; margin-top:8px;" for="cssOutput">CSS Output:</label>
      <textarea id="cssOutput" readonly></textarea>
    `;
    const hintBox = Object.assign(document.createElement('div'), {
      id: 'element-styler-hint-box'
    });

    [overlay, infoTooltip, panel, hintBox].forEach(el => document.body.appendChild(el));
    return {
      overlay,
      infoTooltip,
      panel,
      hintBox
    };
  }

  function createPropertyRow(propName, tabName) {
    const desc = styleOptions[tabName]?.[propName] || '';
    const wrapper = document.createElement('div');
    wrapper.className = 'property-row';

    const label = document.createElement('label');
    label.textContent = propName;
    label.title = desc;
    label.className = 'property-label';
    label.addEventListener('mouseenter', () => {
      const hintBox = document.getElementById('element-styler-hint-box');
      hintBox.style.display = 'block';
      hintBox.textContent = desc;
    });
    label.addEventListener('mouseleave', () => {
      const hintBox = document.getElementById('element-styler-hint-box');
      hintBox.style.display = 'none';
      hintBox.textContent = '';
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.dataset.style = propName;
    input.className = 'style-input';

    const colorProps = ['color', 'backgroundColor', 'border', 'boxShadow', 'hoverColor', 'textDecoration'];
    let dropdown = null;
    if (colorProps.some(k => k.toLowerCase() === propName.toLowerCase()) || desc.toLowerCase().includes('color')) {
      dropdown = document.createElement('select');
      dropdown.className = 'color-dropdown';
      dropdown.appendChild(new Option('-- select color --', ''));
      for (const c of predefinedColors) dropdown.appendChild(new Option(c, c));
      dropdown.onchange = () => (input.value = dropdown.value);
    }

    [label, input, dropdown].forEach(el => el && wrapper.appendChild(el));
    return wrapper;
  }

  function renderTab(panel) {
    const tabContent = panel.querySelector('#tabContent');
    tabContent.innerHTML = '';
    const tabName = tabs[currentTab];
    const props = styleOptions[tabName] || {};
    for (const p in props) tabContent.appendChild(createPropertyRow(p, tabName));
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

  // Helper to position tooltip near cursor and keep inside viewport
  function positionTooltip(e, tooltip) {
    const pad = 12;
    const {
      innerWidth: w,
      innerHeight: h
    } = window;
    const rect = tooltip.getBoundingClientRect();
    let x = e.clientX + pad,
      y = e.clientY + pad;
    if (x + rect.width > w) x = e.clientX - rect.width - pad;
    if (y + rect.height > h) y = e.clientY - rect.height - pad;
    Object.assign(tooltip.style, {
      left: x + 'px',
      top: y + 'px',
      opacity: 1
    });
  }

  let lastHovered = null;

  function updateInfoTooltip(el, e) {
    const tooltip = document.getElementById('element-styler-info-tooltip');
    if (!el) {
      tooltip.style.opacity = 0;
      tooltip.innerHTML = '';
      lastHovered = null;
      return;
    }

    if (el === lastHovered) {
      if (e) positionTooltip(e, tooltip);
      return;
    }
    lastHovered = el;

    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const classes = el.className ? '.' + el.className.trim().replace(/\s+/g, '.') : '';

    tooltip.innerHTML = '';

    // Only add simple text info
    const infoText = document.createElement('div');
    infoText.textContent = `${tag}${id}${classes}`;
    infoText.style.fontWeight = 'bold';
    infoText.style.padding = '6px 10px';

    tooltip.appendChild(infoText);

    if (e) positionTooltip(e, tooltip);
  }


  function isVisible(el) {
    const s = window.getComputedStyle(el);
    return s && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
  }

  function isScrollable(el) {
    const s = window.getComputedStyle(el);
    return ['auto', 'scroll'].some(v => [s.overflow, s.overflowX, s.overflowY].includes(v));
  }

  function clearInlineColorsInsideLinks() {
    document.querySelectorAll('a *').forEach(el => {
      if (el.style?.color) el.style.color = '';
    });
  }

  function getSelector(el) {
    if (!el) return '';
    if (el.id) return `#${el.id}`;
    if (el.className) return `${el.tagName.toLowerCase()}.${el.className.trim().split(/\s+/).join('.')}`;
    return el.tagName.toLowerCase();
  }

  function clearRemoveRules(outputEl) {
    const filtered = outputEl.value.split('\n').filter(line => !line.includes('/* element-remove') && !line.includes('/* element-remove-children'));
    outputEl.value = filtered.join('\n').trim() + (filtered.length ? '\n\n' : '');
  }

  function clearRemoveToggles(panel) {
    panel.querySelector('#toggleElementRemove').checked = false;
    panel.querySelector('#toggleRemoveChildren').checked = false;
  }

  // Throttle function to limit frequency of calls
  function throttle(fn, limit) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  }

  function setupEventListeners(overlay, infoTooltip, panel, hintBox) {
    const toggleElementRemove = panel.querySelector('#toggleElementRemove');
    const toggleRemoveChildren = panel.querySelector('#toggleRemoveChildren');
    const output = panel.querySelector('#cssOutput');

    document.addEventListener('mousemove', throttle(e => {
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
        .filter(el => ![overlay, infoTooltip, panel, hintBox].includes(el));
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
    }, 50)); // throttle to 20fps

    document.addEventListener('wheel', e => {
      if (!e.altKey || underCursorElements.length <= 1) return;
      if (isScrollable(e.target)) return;
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
    }, {
      passive: false
    });

    toggleElementRemove.onchange = () => {
      if (!selected) return;
      const selector = getSelector(selected);
      if (!selector) return;
      clearRemoveRules(output);
      if (toggleElementRemove.checked) {
        output.value += `${selector} { display: none; /* element-remove */ }\n\n`;
        if (toggleRemoveChildren.checked)
          output.value += `${selector} > * { display: none; /* element-remove-children */ }\n\n`;
      } else {
        toggleRemoveChildren.checked = false;
      }
    };

    toggleRemoveChildren.onchange = () => {
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
    };

    panel.querySelector('#toggleTransparent').onchange = e => allowTransparentStyling = e.target.checked;
    panel.querySelector('#toggleRecolorAll').onchange = e => recolorAllText = e.target.checked;

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
            const tag = el.tagName.toLowerCase();
            if (tag === 'a' || tag === 'img') return false;
            if (!el.textContent.trim()) return false;
            if (isInsideLink(el)) return false;
            return true;
          });
          textElements.forEach(el => {
            inputs.forEach(input => {
              const key = input.dataset.style;
              let val = input.value.trim();
              if (!val) return;
              if (/^\d+(\.\d+)?$/.test(val) && key !== 'color') val += 'px';
              el.style[key] = val;
            });
          });
          inputs.forEach(input => {
            const key = input.dataset.style;
            let val = input.value.trim();
            if (!val) return;
            if (/^\d+(\.\d+)?$/.test(val) && key !== 'color') val += 'px';
            const cssKey = key.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
            output.value += `*:not(a):not(img) {\n  ${cssKey}: ${val};\n}\n\n`;
          });
        } else {
          if (!selected) return;
          if (selected.tagName.toLowerCase() === 'a' || isInsideLink(selected)) {
            alert('Cannot recolor links or elements inside links when toggle is off.');
            return;
          }
          inputs.forEach(input => {
            const key = input.dataset.style;
            let val = input.value.trim();
            if (!val) return;
            if (/^\d+(\.\d+)?$/.test(val) && key !== 'color') val += 'px';
            selected.style[key] = val;
          });
          inputs.forEach(input => {
            const key = input.dataset.style;
            let val = input.value.trim();
            if (!val) return;
            if (/^\d+(\.\d+)?$/.test(val) && key !== 'color') val += 'px';
            output.value += `${getSelector(selected)} {\n  ${key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${val};\n}\n\n`;
          });
        }
      } else if (currentTab === 2) {
        if (!selected || !isInsideLink(selected)) {
          alert('Please select a link element for Links tab styling.');
          return;
        }
        inputs.forEach(input => {
          const key = input.dataset.style;
          let val = input.value.trim();
          if (!val) return;
          if (/^\d+(\.\d+)?$/.test(val) && key !== 'color') val += 'px';
          selected.style[key] = val;
        });
        inputs.forEach(input => {
          const key = input.dataset.style;
          let val = input.value.trim();
          if (!val) return;
          if (/^\d+(\.\d+)?$/.test(val) && key !== 'color') val += 'px';
          output.value += `${getSelector(selected)} {\n  ${key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${val};\n}\n\n`;
        });
      } else if (currentTab === 3) {
        if (!selected || selected.tagName.toLowerCase() !== 'img') {
          alert('Please select an image element for Images tab styling.');
          return;
        }
        inputs.forEach(input => {
          const key = input.dataset.style;
          let val = input.value.trim();
          if (!val) return;
          if (/^\d+(\.\d+)?$/.test(val) && key !== 'color') val += 'px';
          selected.style[key] = val;
        });
        inputs.forEach(input => {
          const key = input.dataset.style;
          let val = input.value.trim();
          if (!val) return;
          if (/^\d+(\.\d+)?$/.test(val) && key !== 'color') val += 'px';
          output.value += `${getSelector(selected)} {\n  ${key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${val};\n}\n\n`;
        });
      } else {
        // Panels tab
        if (!selected) return;
        inputs.forEach(input => {
          const key = input.dataset.style;
          let val = input.value.trim();
          if (!val) return;
          if (/^\d+(\.\d+)?$/.test(val) && key !== 'color') val += 'px';
          selected.style[key] = val;
        });
        inputs.forEach(input => {
          const key = input.dataset.style;
          let val = input.value.trim();
          if (!val) return;
          if (/^\d+(\.\d+)?$/.test(val) && key !== 'color') val += 'px';
          output.value += `${getSelector(selected)} {\n  ${key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${val};\n}\n\n`;
        });
      }
    };

    panel.querySelector('#resetStyle').onclick = () => {
      if (selected) {
        selected.style = '';
        clearRemoveRules(output);
        output.value = '';
      }
    };
  }

  (async () => {
    await loadCSS(CSS_URL);
    await loadHoverHints();
    const {
      overlay,
      infoTooltip,
      panel,
      hintBox
    } = createUI();
    updateTabButtons(panel);
    renderTab(panel);
    setupEventListeners(overlay, infoTooltip, panel, hintBox);
  })();

})();
