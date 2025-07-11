(() => {
  const CSS_URL = `
  #element-styler-overlay {
    position: absolute;
    border: 2px solid #4fc3f7;
    border-radius: 4px;
    pointer-events: none;
    z-index: 2147483647;
    display: none;
    box-shadow: 0 0 6px 1px rgba(79, 195, 247, 0.75);
    transition: box-shadow 0.15s ease;
  }

  :root {
    --dark-bg: #1e1e2e;
    --darker-bg: #181825;
    --dark-text: #cdd6f4;
    --dark-accent: #89b4fa;
    --dark-hover: #313244;
    --dark-active: #45475a;
    --dark-border: #585b70;
    --dark-glow: rgba(79, 195, 247, 0.2);
  }

  /* Main Panel Styling - Updated for slide-out */
  #element-styler-panel {
    position: fixed;
    top: 0;
    right: -400px;
    height: 100vh;
    background: var(--darker-bg);
    color: var(--dark-text);
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
    border-left: 1px solid var(--dark-border);
    z-index: 2147483647;
    width: 380px;
    box-shadow: 
      -6px 0 18px rgba(0, 0, 0, 0.5),
      inset 0 1px 1px rgba(255, 255, 255, 0.05);
    user-select: none;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    transition: right 0.3s ease;
    overflow-y: auto;
  }

  #element-styler-panel.panel-open {
    right: 0;
  }

  #element-styler-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: var(--darker-bg);
    color: var(--dark-text);
    border-radius: 50%;
    border: 1px solid var(--dark-border);
    z-index: 2147483647;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }

  #element-styler-toggle:hover {
    background: var(--dark-hover);
    transform: scale(1.1);
  }

  #element-styler-toggle::before {
    content: "⚙️";
    font-size: 20px;
  }

  #element-styler-panel .panel-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  /* Tab System */
  #element-styler-panel #tabButtons {
    margin: 12px 0 16px;
    display: flex;
    gap: 2px;
    padding: 4px;
    background-color: var(--darker-bg);
    border-radius: 10px;
    border: 1px solid var(--dark-border);
    box-shadow: 
      0 2px 6px rgba(0, 0, 0, 0.3),
      inset 0 1px 1px rgba(255, 255, 255, 0.05);
    user-select: none;
  }

  #tabButtons button {
    flex: 1;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    background-color: transparent;
    color: var(--dark-text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    text-align: center;
    letter-spacing: 0.3px;
  }

  #tabButtons button:hover {
    background-color: var(--dark-hover);
    box-shadow: 0 0 8px var(--dark-glow);
  }

  #tabButtons button.active {
    background-color: rgba(137, 180, 250, 0.15);
    color: var(--dark-accent);
    font-weight: 600;
    box-shadow: 0 0 0 1px rgba(137, 180, 250, 0.3);
  }

  #tabButtons button.active::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 2px;
    background-color: var(--dark-accent);
    border-radius: 2px;
    animation: tabUnderline 0.3s ease-out;
  }

  @keyframes tabUnderline {
    from {
      width: 0;
      opacity: 0;
    }
    to {
      width: 50%;
      opacity: 1;
    }
  }

  #element-styler-panel #tabContent {
    margin-bottom: 16px;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
    scrollbar-width: thin;
    scrollbar-color: var(--dark-accent) var(--darker-bg);
  }

  /* Form Elements */
  #element-styler-panel input[data-style] {
    width: 100%;
    background: var(--dark-bg);
    border: 1.5px solid var(--dark-border);
    border-radius: 6px;
    padding: 8px 10px;
    color: var(--dark-text);
    font-family: 'Consolas', monospace;
    font-size: 14px;
    box-sizing: border-box;
    transition: all 0.25s ease;
  }

  #element-styler-panel input[data-style]:focus {
    outline: none;
    background: var(--darker-bg);
    border-color: var(--dark-accent);
    box-shadow: 0 0 8px rgba(137, 180, 250, 0.5);
    color: #aeefff;
  }

  #element-styler-panel label {
    display: block;
    font-size: 13px;
    margin-bottom: 6px;
    cursor: default;
    user-select: none;
    color: #bbb;
    font-weight: 500;
  }

  #element-styler-panel label[for="toggleTransparent"] {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    cursor: pointer;
    font-weight: 600;
    color: var(--dark-accent);
  }

  /* Buttons */
  #element-styler-panel #applyStyle,
  #element-styler-panel #resetStyle {
    margin-top: 8px;
    width: 100%;
    border: none;
    border-radius: 8px;
    padding: 10px 0;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;
  }

  #element-styler-panel #applyStyle {
    background: var(--dark-accent);
    color: #111;
  }

  #element-styler-panel #applyStyle:hover {
    background: #7aa6e0;
    box-shadow: 0 0 12px rgba(137, 180, 250, 0.5);
  }

  #element-styler-panel #resetStyle {
    background: #f15a5a;
    color: white;
    margin-top: 10px;
  }

  #element-styler-panel #resetStyle:hover {
    background: #d04141;
    box-shadow: 0 0 12px rgba(241, 90, 90, 0.4);
  }

  /* CSS Output */
  #element-styler-panel #cssOutput {
    width: 100%;
    height: 140px;
    background: var(--dark-bg);
    color: var(--dark-text);
    border: 1.5px solid var(--dark-border);
    border-radius: 8px;
    padding: 10px;
    font-family: 'Consolas', monospace;
    white-space: pre-wrap;
    resize: vertical;
    box-sizing: border-box;
    margin-top: 12px;
    scrollbar-width: thin;
    scrollbar-color: var(--dark-accent) var(--dark-bg);
    max-height: 200px;
  }

  /* Tooltip & Info */
  #element-styler-info-tooltip {
    position: fixed;
    top: 0;
    left: 0;
    max-width: min(280px, 90vw);
    background-color: rgba(15, 15, 15, 0.9);
    color: var(--dark-accent);
    font-family: 'Minecraftia', monospace;
    font-size: 12px;
    padding: 8px 12px;
    border-radius: 8px;
    pointer-events: none;
    user-select: none;
    white-space: pre-line;
    z-index: 2147483647;
    transform: translate(10px, 10px);
    transition: opacity 0.15s ease;
    opacity: 0;
    box-shadow: 0 0 10px rgba(137, 180, 250, 0.5);
    backdrop-filter: blur(2px);
    border: 1px solid rgba(137, 180, 250, 0.3);
  }

  #element-styler-hint-box {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(24, 24, 24, 0.96);
    color: var(--dark-accent);
    font-family: 'Segoe UI', monospace;
    font-size: 12px;
    padding: 10px 14px;
    border-radius: 8px;
    max-height: 150px;
    overflow-y: auto;
    white-space: normal;
    z-index: 2147483647;
    display: none;
    user-select: none;
    cursor: default;
    box-sizing: border-box;
    box-shadow: 0 0 15px rgba(137, 180, 250, 0.5);
    backdrop-filter: blur(2px);
    border: 1px solid rgba(137, 180, 250, 0.3);
  }

  /* Property Rows */
  .property-row {
    margin-bottom: 14px;
    display: flex;
    flex-direction: column;
  }

  .property-label {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
  }

  .color-picker-btn {
    margin-top: 6px;
    padding: 6px 10px;
    background: var(--dark-bg);
    color: var(--dark-text);
    border: 1px solid var(--dark-border);
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    width: 100%;
    text-align: center;
    transition: all 0.2s ease;
  }

  .color-picker-btn:hover {
    background: var(--dark-hover);
    border-color: var(--dark-accent);
  }

  .input-with-picker {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .input-with-picker input {
    flex: 1;
  }

  /* Scrollbars */
  #element-styler-panel #tabContent::-webkit-scrollbar,
  #element-styler-panel #cssOutput::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  #element-styler-panel #tabContent::-webkit-scrollbar-track,
  #element-styler-panel #cssOutput::-webkit-scrollbar-track {
    background: var(--darker-bg);
  }

  #element-styler-panel #tabContent::-webkit-scrollbar-thumb,
  #element-styler-panel #cssOutput::-webkit-scrollbar-thumb {
    background-color: var(--dark-accent);
    border-radius: 4px;
  }

  /* Responsive */
  @media (max-width: 600px) {
    #element-styler-panel {
      width: 90vw;
      right: -90vw;
    }
    
    #element-styler-panel.panel-open {
      right: 0;
    }

    #tabButtons {
      flex-wrap: wrap;
    }
    
    #tabButtons button {
      padding: 8px 12px;
      font-size: 12px;
      flex: 1 0 40%;
    }
  }
  `;
  
  const HOVER_HINTS_URL = `
    {
  "Panels": {
    "backgroundColor": "Background color (color value)",
    "border": "Border style (e.g., '1px solid black')",
    "padding": "Padding (e.g., '10px')",
    "margin": "Margin (e.g., '10px')",
    "boxShadow": "Box shadow (e.g., '0 0 5px black')",
    "borderRadius": "Border radius (e.g., '5px')",
    "opacity": "Opacity (0.0 to 1.0)"
  },
  "Text": {
    "color": "Text color (color value)",
    "fontSize": "Font size (e.g., '16px')",
    "fontWeight": "Font weight (e.g., 'bold')",
    "lineHeight": "Line height (e.g., '1.5')",
    "textShadow": "Text shadow (e.g., '1px 1px 2px black')",
    "textAlign": "Text alignment (e.g., 'center')",
    "fontStyle": "Font style (e.g., 'italic')"
  },
  "Links": {
    "color": "Link color (color value)",
    "textDecoration": "Text decoration (e.g., 'none')",
    "hoverColor": "Hover color (color value)",
    "fontWeight": "Font weight (e.g., 'bold')"
  },
  "Images": {
    "width": "Width (e.g., '100px')",
    "height": "Height (e.g., 'auto')",
    "borderRadius": "Border radius (e.g., '10px')",
    "opacity": "Opacity (0.5 to 1.0)"
  }
}
  `;
  
  window.HOVER_HINTS_URL = HOVER_HINTS_URL;
  let styleOptions = {},
    selected = null,
    underCursorElements = [],
    underCursorIndex = 0,
    currentTab = 0,
    allowTransparentStyling = false,
    recolorAllText = false;
  const tabs = ['Panels', 'Text', 'Links', 'Images'];
  
  const isInsideLink = el => {
    while (el) {
      if (el.tagName?.toLowerCase() === 'a') return true;
      el = el.parentElement;
    }
    return false;
  };

  async function loadCSS(url) {
    try {
      const styleTag = document.createElement('style');
      styleTag.id = 'element-styler-css';
      styleTag.textContent = url;
      document.head.appendChild(styleTag);
    } catch (e) {
      console.error('Error loading CSS:', e);
    }
  }

  async function loadHoverHints() {
    try {
      styleOptions = JSON.parse(HOVER_HINTS_URL);
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
    
    // Create toggle button
    const toggleBtn = Object.assign(document.createElement('div'), {
      id: 'element-styler-toggle'
    });
    
    const panel = document.createElement('div');
    panel.id = 'element-styler-panel';
    panel.innerHTML = `
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

    [overlay, infoTooltip, toggleBtn, panel, hintBox].forEach(el => document.body.appendChild(el));
    
    // Toggle panel visibility
    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('panel-open');
    });
    
    return {
      overlay,
      infoTooltip,
      panel,
      hintBox,
      toggleBtn
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

    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-with-picker';

    const input = document.createElement('input');
    input.type = 'text';
    input.dataset.style = propName;
    input.className = 'style-input';
    inputContainer.appendChild(input);

    const colorProps = ['color', 'backgroundColor', 'border', 'boxShadow', 'hoverColor', 'textDecoration'];
    if (colorProps.some(k => k.toLowerCase() === propName.toLowerCase()) || desc.toLowerCase().includes('color')) {
      const colorBtn = document.createElement('button');
      colorBtn.className = 'color-picker-btn';
      colorBtn.textContent = 'Color Picker';
      colorBtn.title = 'Open color picker';
      
      colorBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = input.value.startsWith('#') ? input.value : '#000000';
        
        colorPicker.addEventListener('input', () => {
          input.value = colorPicker.value;
        });
        
        colorPicker.addEventListener('change', () => {
          input.value = colorPicker.value;
        });
        
        colorPicker.click();
      });
      
      inputContainer.appendChild(colorBtn);
    }

    wrapper.appendChild(label);
    wrapper.appendChild(inputContainer);
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
    }, 50));

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
  
function applyTransformScale(el, scale) {
  if (!el) return;

  const style = getComputedStyle(el);
  if (style.display === 'inline') el.style.display = 'inline-block';
  if (style.position === 'static') el.style.position = 'relative';

  let base = el.style.transform || getComputedStyle(el).transform || '';
  base = base === 'none' ? '' : base;

  base = base.replace(/scale\([^)]+\)/g, '').trim();
  if (base && !base.endsWith(')')) base += ' ';
  el.style.transform = `${base}scale(${scale})`.trim();
}

function addExportButton() {
  const panel = document.getElementById('element-styler-panel');

  const exportBtn = document.createElement('button');
  exportBtn.id = 'exportCss';
  exportBtn.textContent = 'Export CSS';
  exportBtn.style.marginTop = '8px';
  exportBtn.style.width = '100%';
  exportBtn.style.padding = '10px 0';
  exportBtn.style.background = 'var(--dark-accent)';
  exportBtn.style.color = '#111';
  exportBtn.style.border = 'none';
  exportBtn.style.borderRadius = '8px';
  exportBtn.style.fontWeight = '700';
  exportBtn.style.cursor = 'pointer';
  exportBtn.style.transition = 'all 0.3s ease';

  exportBtn.addEventListener('mouseenter', () => {
    exportBtn.style.background = '#7aa6e0';
    exportBtn.style.boxShadow = '0 0 12px rgba(137, 180, 250, 0.5)';
  });

  exportBtn.addEventListener('mouseleave', () => {
    exportBtn.style.background = 'var(--dark-accent)';
    exportBtn.style.boxShadow = 'none';
  });

  exportBtn.addEventListener('click', () => {
    const cssOutput = document.getElementById('cssOutput');
    if (!cssOutput.value.trim()) {
      alert('No CSS to export!');
      return;
    }

    const blob = new Blob([cssOutput.value], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'element-styles.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Add toggles for drag and scale
  const dragToggle = document.createElement('label');
  dragToggle.style.display = 'block';
  dragToggle.style.marginTop = '8px';
  dragToggle.innerHTML = `<input type="checkbox" id="toggleDragElement" /> Enable Drag`;

  const scaleToggle = document.createElement('label');
  scaleToggle.style.display = 'block';
  scaleToggle.style.marginTop = '8px';
  scaleToggle.innerHTML = `<input type="checkbox" id="toggleScaleElement" /> Enable Scale (wheel)`;

  panel.appendChild(dragToggle);
  panel.appendChild(scaleToggle);
  panel.appendChild(exportBtn);

  // Drag + Scale logic
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let currentScale = 1;

  document.addEventListener('mousedown', e => {
    if (!selected || !document.getElementById('toggleDragElement').checked) return;
    if (!e.altKey) return;

    e.preventDefault();
    const rect = selected.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    isDragging = true;

    const style = getComputedStyle(selected);
    if (style.position === 'static') selected.style.position = 'relative';
    if (style.display === 'inline') selected.style.display = 'inline-block';
  });

  document.addEventListener('mouseup', e => {
    if (isDragging) {
      isDragging = false;
      const output = document.getElementById('cssOutput');
      const transform = selected.style.transform || '';
      output.value += `${getSelector(selected)} {\n  transform: ${transform};\n}\n\n`;
    }
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging || !selected) return;
    e.preventDefault();
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    selected.style.left = `${x}px`;
    selected.style.top = `${y}px`;

    applyTransformScale(selected, currentScale);
  });

  document.addEventListener('wheel', e => {
    if (!selected || !document.getElementById('toggleScaleElement').checked) return;
    if (!e.altKey) return;

    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * 0.1;
    currentScale = Math.max(0.2, Math.min(currentScale + delta, 4));

    applyTransformScale(selected, currentScale);

    const output = document.getElementById('cssOutput');
    const transform = selected.style.transform || '';
    output.value += `${getSelector(selected)} {\n  transform: ${transform};\n}\n\n`;
  }, { passive: false });
}

setTimeout(addExportButton, 500);

  const applyCSSOutputToPage = () => {
    const css = document.getElementById('cssOutput')?.value;
    if (!css) return;

    let styleTag = document.getElementById('element-styler-output-style');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'element-styler-output-style';
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = css;
  };

  const injectBtn = document.createElement('button');
  injectBtn.textContent = 'Apply CSS to Page';
  injectBtn.style.marginTop = '8px';
  injectBtn.style.width = '100%';
  injectBtn.style.padding = '10px 0';
  injectBtn.style.background = 'var(--dark-accent)';
  injectBtn.style.color = '#111';
  injectBtn.style.border = 'none';
  injectBtn.style.borderRadius = '8px';
  injectBtn.style.fontWeight = '700';
  injectBtn.style.cursor = 'pointer';
  injectBtn.style.transition = 'all 0.3s ease';

  injectBtn.addEventListener('mouseenter', () => {
    injectBtn.style.background = '#7aa6e0';
    injectBtn.style.boxShadow = '0 0 12px rgba(137, 180, 250, 0.5)';
  });

  injectBtn.addEventListener('mouseleave', () => {
    injectBtn.style.background = 'var(--dark-accent)';
    injectBtn.style.boxShadow = 'none';
  });

  injectBtn.addEventListener('click', applyCSSOutputToPage);

  const panel = document.getElementById('element-styler-panel');
  if (panel) {
    panel.appendChild(injectBtn);
  }
  function addCloseButton() {
  const panel = document.getElementById('element-styler-panel');
  if (!panel) return;

  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '10px';
  closeBtn.style.left = '10px';
  closeBtn.style.width = '30px';
  closeBtn.style.height = '30px';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '50%';
  closeBtn.style.background = 'transparent';
  closeBtn.style.color = 'var(--dark-text)';
  closeBtn.style.fontSize = '20px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.display = 'flex';
  closeBtn.style.alignItems = 'center';
  closeBtn.style.justifyContent = 'center';
  closeBtn.style.transition = 'all 0.2s ease';

  // Hover effects
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = 'var(--dark-hover)';
    closeBtn.style.color = 'var(--dark-accent)';
    closeBtn.style.transform = 'scale(1.1)';
  });

  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'transparent';
    closeBtn.style.color = 'var(--dark-text)';
    closeBtn.style.transform = 'scale(1)';
  });

  // Close functionality
  closeBtn.addEventListener('click', () => {
    panel.classList.remove('panel-open');
  });

  // Add close button to panel (first element so it's on top)
  panel.insertBefore(closeBtn, panel.firstChild);
}

// Add the close button after a short delay to ensure panel exists
setTimeout(addCloseButton, 500);
})();
