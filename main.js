(() => {
  const CSS_URL = 'https://raw.githubusercontent.com/fumeko-ts/Quick-CSS-Live-Editor/main/ui.css';
  const HOVER_HINTS_URL = 'https://raw.githubusercontent.com/fumeko-ts/Quick-CSS-Live-Editor/main/hover-text.atemp';

  let styleOptions = {};
  let selected = null;
  let underCursorElements = [];
  let underCursorIndex = 0;
  let currentTab = 0;
  let allowTransparentStyling = false;
  const tabs = ['Panels', 'Text', 'Links', 'Images'];

  async function loadCSS(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load CSS');
      const cssText = await res.text();
      const styleTag = document.createElement('style');
      styleTag.id = 'element-styler-css';
      styleTag.textContent = cssText;
      document.head.appendChild(styleTag);

      // Add isolation CSS to prevent UI from being styled
      const protectTag = document.createElement('style');
      protectTag.textContent = `
        #element-styler-panel, #element-styler-panel * {
          all: initial !important;
          font-family: sans-serif !important;
        }
        #element-styler-panel input, 
        #element-styler-panel button, 
        #element-styler-panel textarea {
          all: revert !important;
        }
      `;
      document.head.appendChild(protectTag);

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
    Object.assign(overlay.style, {
      border: '2px solid #4fc3f7',
      borderRadius: '3px'
    });
    document.body.appendChild(overlay);

    const infoTooltip = document.createElement('div');
    infoTooltip.id = 'element-styler-info-tooltip';
    document.body.appendChild(infoTooltip);

    const panel = document.createElement('div');
    panel.id = 'element-styler-panel';
    Object.assign(panel.style, {
      border: '1px solid #444',
      borderRadius: '8px'
    });
    panel.innerHTML = `
      <div style="font-size:16px;font-weight:500;margin-bottom:10px;color:#fff;">Element Styler</div>
      <div id="tabButtons"></div>
      <div id="tabContent"></div>
      <label for="toggleTransparent" style="display:flex; align-items:center; gap:8px; margin-bottom:12px; cursor:pointer;">
        <input type="checkbox" id="toggleTransparent" />
        Allow styling transparent elements
      </label>
      <button id="applyStyle">Apply</button>
      <button id="resetStyle" style="margin-left: 8px;">Reset CSS</button>
      <label for="cssOutput" style="display:block; margin-top:12px; font-weight:500;">CSS Output:</label>
      <textarea id="cssOutput" readonly style="white-space: pre; font-family: monospace; height:150px; width:100%;"></textarea>
    `;
    document.body.appendChild(panel);

    const hintBox = document.createElement('div');
    hintBox.id = 'element-styler-hint-box';
    document.body.appendChild(hintBox);

    return { overlay, infoTooltip, panel, hintBox };
  }

  function resetInputs(panel) {
    const inputs = panel.querySelectorAll('input[data-style]');
    inputs.forEach(input => input.value = '');
  }

  function isVisible(el) {
    if (!el) return false;
    if (el.tagName.toLowerCase() === 'img') return true;
    const style = getComputedStyle(el);
    if (!allowTransparentStyling) {
      if (!style.backgroundColor || style.backgroundColor === 'transparent' || style.backgroundColor.endsWith(', 0)')) return false;
      if (style.opacity === '0') return false;
    }
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    return true;
  }

  let lastAnimationFrame;

  function updateInfoTooltip(el, event) {
    const infoTooltip = document.getElementById('element-styler-info-tooltip');
    if (!el) {
      infoTooltip.style.opacity = '0';
      return;
    }
    const tag = el.tagName.toLowerCase();
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const visible = isVisible(el);
    const sizeText = `${Math.round(rect.width)}x${Math.round(rect.height)}`;
    const posText = `Pos: ${Math.round(rect.left)}, ${Math.round(rect.top)}`;
    const opacityText = `Opacity: ${style.opacity}`;
    const bg = style.backgroundColor || 'none';
    const visibleText = visible ? 'Visible' : 'Invisible/Transparent';

    const infoText = `${tag}, ${visibleText}, Size: ${sizeText}, ${posText}, Opacity: ${opacityText}, BG: ${bg}`;
    infoTooltip.innerHTML = infoText.split(',').map(line => line.trim()).join('<br>');

    if (event) {
      if (lastAnimationFrame) cancelAnimationFrame(lastAnimationFrame);
      lastAnimationFrame = requestAnimationFrame(() => {
        let x = event.clientX + 10;
        let y = event.clientY + 10;
        const margin = 10;
        const tooltipRect = infoTooltip.getBoundingClientRect();
        if (x + tooltipRect.width > window.innerWidth - margin) x = window.innerWidth - tooltipRect.width - margin;
        if (y + tooltipRect.height > window.innerHeight - margin) y = window.innerHeight - tooltipRect.height - margin;
        infoTooltip.style.left = `${x}px`;
        infoTooltip.style.top = `${y}px`;
        infoTooltip.style.opacity = '1';
      });
    }
  }

  function splitIgnoringParens(str) {
    const result = [];
    let current = '';
    let depth = 0;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && depth === 0) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    if (current.trim() !== '') result.push(current.trim());
    return result;
  }

  function renderTab(panel, hintBox) {
    const tabContentDiv = panel.querySelector('#tabContent');
    tabContentDiv.innerHTML = '';
    if (!styleOptions[tabs[currentTab]]) {
      tabContentDiv.textContent = 'Loading hints...';
      return;
    }
    Object.entries(styleOptions[tabs[currentTab]]).forEach(([key, hint]) => {
      const wrapper = document.createElement('div');
      wrapper.style.marginBottom = '10px';
      wrapper.style.position = 'relative';

      const label = document.createElement('label');
      label.textContent = key;
      label.style.cursor = 'default';
      label.style.userSelect = 'none';
      label.style.display = 'block';
      label.style.fontSize = '12px';
      label.style.marginBottom = '4px';
      wrapper.appendChild(label);

      // Create color input and dropdown for colors
      const inputWrapper = document.createElement('div');
      inputWrapper.style.display = 'flex';
      inputWrapper.style.gap = '8px';
      inputWrapper.style.alignItems = 'center';

      const input = document.createElement('input');
      input.setAttribute('data-style', key);
      input.type = 'text';
      input.style.flex = '1';
      inputWrapper.appendChild(input);

      const select = document.createElement('select');
      select.style.width = '120px';

      // Predefined dark mode colors
      const predefinedColors = [
        '',
        'black', 'white', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow', 'gray',
        'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'silver', 'teal',
        'aqua', 'fuchsia', 'coral', 'gold', 'pink', 'violet', 'indigo', 'beige',
        'brown', 'salmon', 'tan', 'turquoise', 'plum', 'khaki', 'lavender'
      ];
      predefinedColors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color || '--select--';
        select.appendChild(option);
      });

      select.addEventListener('change', () => {
        input.value = select.value;
      });

      inputWrapper.appendChild(select);
      wrapper.appendChild(inputWrapper);

      label.addEventListener('mouseenter', e => {
        const rect = label.getBoundingClientRect();
        const lines = splitIgnoringParens(hint || '(no hint)');
        hintBox.innerHTML = lines.join('<br>');
        hintBox.style.display = 'block';
        const leftPos = rect.left - hintBox.offsetWidth - 8;
        hintBox.style.top = `${rect.top}px`;
        hintBox.style.left = `${leftPos < 0 ? rect.right + 8 : leftPos}px`;
        hintBox.scrollTop = 0;
      });
      label.addEventListener('mouseleave', () => {
        if (!hintBox.matches(':hover')) {
          hintBox.style.display = 'none';
        }
      });

      hintBox.addEventListener('mouseleave', () => {
        hintBox.style.display = 'none';
      });
      hintBox.addEventListener('mouseenter', () => {
        hintBox.style.display = 'block';
      });
      hintBox.addEventListener('wheel', e => {
        e.preventDefault();
        hintBox.scrollTop += e.deltaY;
      });

      tabContentDiv.appendChild(wrapper);
    });
  }

  function updateTabButtons(panel) {
    const tabButtonsDiv = panel.querySelector('#tabButtons');
    tabButtonsDiv.innerHTML = '';
    tabs.forEach((tab, i) => {
      const btn = document.createElement('button');
      btn.textContent = tab;
      btn.className = i === currentTab ? 'active' : '';
      btn.onclick = () => {
        currentTab = i;
        renderTab(panel, document.getElementById('element-styler-hint-box'));
        updateTabButtons(panel);
      };
      tabButtonsDiv.appendChild(btn);
    });
  }

  function isScrollable(el) {
    if (!el) return false;
    const style = getComputedStyle(el);
    return (el.scrollHeight > el.clientHeight) && (style.overflowY === 'auto' || style.overflowY === 'scroll');
  }

  function setupEventListeners(overlay, infoTooltip, panel, hintBox) {
    document.addEventListener('mousemove', e => {
      if (!e.altKey) {
        if (!selected) {
          overlay.style.display = 'none';
          updateInfoTooltip(null);
          underCursorElements = [];
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
      } else {
        selected = null;
        overlay.style.display = 'none';
        updateInfoTooltip(null);
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
    }, { passive: false });

    panel.querySelector('#applyStyle').onclick = () => {
      if (!selected) return;

      // Element might have been removed
      if (!document.body.contains(selected)) {
        alert('Selected element no longer exists.');
        selected = null;
        return;
      }

      if (!allowTransparentStyling && !isVisible(selected) && selected.tagName.toLowerCase() !== 'img') {
        alert('Selected element is invisible or transparent — styles will not be applied unless toggle is enabled.');
        return;
      }

      const output = panel.querySelector('#cssOutput');
      const inputs = panel.querySelectorAll('input[data-style]');

      if (currentTab === 2) { // Links tab
        let styleTag = document.getElementById('link-hover-style');
        if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.id = 'link-hover-style';
          document.head.appendChild(styleTag);
        }
        const newStyles = [];

        inputs.forEach(input => {
          const key = input.getAttribute('data-style');
          let val = input.value.trim();
          if (!val) return;

          if (key !== 'hoverColor' && /^\d+(\.\d+)?$/.test(val)) val += 'px';

          if (key === 'hoverColor') {
            newStyles.push(`a:hover { color: ${val}; }`);
            output.value += `a:hover {\n  color: ${val};\n}\n\n`;
          } else {
            document.querySelectorAll('a').forEach(a => { a.style[key] = val; });
            const cssKey = key.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
            output.value += `a {\n  ${cssKey}: ${val};\n}\n\n`;
          }
        });

        styleTag.innerHTML += newStyles.join('\n') + '\n';

      } else if (currentTab === 1) { // Text tab - Apply to all text elements (except links and images)
        const textElements = Array.from(document.body.querySelectorAll('*')).filter(el => {
          if (el.tagName.toLowerCase() === 'a' || el.tagName.toLowerCase() === 'img') return false;
          if (!el.textContent.trim()) return false;
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

        output.value = '';
        inputs.forEach(input => {
          const key = input.getAttribute('data-style');
          let val = input.value.trim();
          if (!val) return;
          if (/^\d+(\.\d+)?$/.test(val) && key !== 'color') val += 'px';
          const cssKey = key.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
          output.value += `*:not(a):not(img) {\n  ${cssKey}: ${val};\n}\n\n`;
        });

      } else { // Panels or Images tabs, or fallback
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
            output.value += `:hover {\n  color: ${val};\n}\n\n`;
          } else {
            selected.style[key] = val;
            const cssKey = key.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
            const tag = selected.tagName.toLowerCase();
            const id = selected.id ? '#' + selected.id : '';
            const classes = selected.className ? '.' + selected.className.trim().replace(/\s+/g, '.') : '';
            const selector = id || classes || tag;
            output.value += `${selector} {\n  ${cssKey}: ${val};\n}\n\n`;
          }
        });

        styleTag.innerHTML += newStyles.join('\n') + '\n';
      }

      // Re-render tab to refresh inputs
      renderTab(panel, document.getElementById('element-styler-hint-box'));
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

      const output = panel.querySelector('#cssOutput');
      output.value = '';
    };

    panel.querySelector('#toggleTransparent').addEventListener('change', e => {
      allowTransparentStyling = e.target.checked;
    });
  }

  async function init() {
    await loadCSS(CSS_URL);
    await loadHoverHints();
    const { overlay, infoTooltip, panel, hintBox } = createUI();

    updateTabButtons(panel);
    renderTab(panel, hintBox);
    setupEventListeners(overlay, infoTooltip, panel, hintBox);
  }

  init();
})();
