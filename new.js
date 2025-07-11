(() => {
  // CSS for the entire UI and overlays
  const CSS = `
  :root {
    --qce-bg: #23272e;
    --qce-panel: #2c313a;
    --qce-accent: #65b7ff;
    --qce-border: #39404a;
    --qce-text: #e6e6e6;
    --qce-shadow: 0 8px 24px rgba(20,20,30,0.4);
    --qce-radius: 10px;
  }
  #qce-root {
    font-family: 'Segoe UI', 'Arial', sans-serif;
    position: fixed; z-index: 2147483647;
    top: 0; right: 0; min-width: 330px; max-width: 400px; width: 360px;
    height: 100vh; background: var(--qce-bg); color: var(--qce-text);
    border-radius: 10px 0 0 10px; box-shadow: var(--qce-shadow);
    border-left: 2px solid var(--qce-accent); border-top: none; border-bottom: none;
    user-select: none; display: flex; flex-direction: column;
    transition: right 0.3s;
  }
  #qce-header {
    background: var(--qce-panel); padding: 16px 18px;
    border-radius: 10px 0 0 0; display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--qce-border);
  }
  #qce-title { font-size: 1.13em; font-weight: 700; }
  #qce-close {
    border: none; background: none; color: var(--qce-accent); font-size: 1.5em; cursor: pointer;
    border-radius: 6px; transition: background 0.1s;
  }
  #qce-close:hover { background: #41546b; color: white; }
  #qce-tabs {
    display: flex; gap: 8px; border-bottom: 1px solid var(--qce-border);
    background: var(--qce-panel); padding: 0 8px;
  }
  .qce-tab {
    padding: 10px 18px; border: none; background: none;
    color: var(--qce-text); font-weight: 500; cursor: pointer;
    border-radius: 10px 10px 0 0; margin-bottom: -2px;
    transition: background 0.1s, color 0.1s;
  }
  .qce-tab.active, .qce-tab:focus {
    background: var(--qce-bg); color: var(--qce-accent); outline: none;
  }
  #qce-content { padding: 15px 18px 18px 18px; background: var(--qce-bg); flex: 1; overflow-y: auto; }
  .qce-section { margin-bottom: 20px; }
  .qce-label { font-size: 0.97em; margin-bottom: 6px; color: #b7c2d1; }
  .qce-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .qce-input, .qce-select {
    background: #20242a; color: var(--qce-text);
    border: 1px solid var(--qce-border); border-radius: 5px;
    padding: 5px 8px; font-size: 1em; min-width: 0; flex: 1 1 0; outline: none;
    transition: border 0.2s;
  }
  .qce-input:focus, .qce-select:focus { border: 1.5px solid var(--qce-accent); }
  .qce-btn, #qce-export, #qce-apply, #qce-inject {
    background: var(--qce-accent); color: #fff;
    border: none; border-radius: 5px; padding: 9px 18px;
    font-size: 1em; font-weight: 600; cursor: pointer; margin-top: 7px; margin-bottom: 8px;
    box-shadow: 0 2px 6px rgba(30,90,190,0.08);
    transition: background 0.14s, color 0.12s;
    width: 100%;
  }
  .qce-btn:hover, #qce-export:hover, #qce-apply:hover, #qce-inject:hover { background: #338de4; }
  .qce-tip { font-size: 0.93em; color: #8b9cb3; margin-top: 7px; }
  #qce-footer {
    background: var(--qce-panel); padding: 7px 16px; border-top: 1px solid var(--qce-border);
    border-radius: 0 0 0 10px; text-align: right; font-size: 0.92em; color: #99aac3;
  }
  #qce-overlay {
    position: absolute; pointer-events: none; z-index: 2147483646;
    outline: 3px solid var(--qce-accent); background: rgba(60,175,255,0.11);
    border-radius: 10px; transition: all 0.16s; display: none;
  }
  #qce-tooltip {
    position: absolute; z-index: 2147483647;
    background: #222d39e8; color: #fff; font-size: 0.96em;
    padding: 8px 12px; border-radius: 8px; pointer-events: none;
    box-shadow: 0 2px 12px rgba(20,40,60,0.25); top: 0; left: 0; display: none;
  }
  @media (max-width: 600px) {
    #qce-root { min-width: 0; width: 99vw; max-width: 100vw; }
    #qce-header { flex-direction: column; align-items: flex-start; gap: 8px; }
  }
  `;

  // Inject CSS
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  // Main UI markup
  const root = document.createElement("div");
  root.id = "qce-root";
  root.innerHTML = `
    <div id="qce-header">
      <span id="qce-title">Quick CSS Live Editor</span>
      <button id="qce-close" title="Close">&times;</button>
    </div>
    <div id="qce-tabs" role="tablist">
      <button class="qce-tab active" role="tab" aria-selected="true" tabindex="0" data-tab="panel">Panels</button>
      <button class="qce-tab" role="tab" aria-selected="false" tabindex="0" data-tab="text">Text</button>
      <button class="qce-tab" role="tab" aria-selected="false" tabindex="0" data-tab="link">Links</button>
      <button class="qce-tab" role="tab" aria-selected="false" tabindex="0" data-tab="img">Images</button>
      <button class="qce-tab" role="tab" aria-selected="false" tabindex="0" data-tab="inject">Inject</button>
    </div>
    <div id="qce-content"></div>
    <div id="qce-footer">
      <span>Alt+Click to select element &bull; Alt+Wheel: cycle</span>
    </div>
  `;
  document.body.appendChild(root);

  // Overlay (for selecting elements)
  const overlay = document.createElement("div");
  overlay.id = "qce-overlay";
  document.body.appendChild(overlay);

  // Tooltip
  const tooltip = document.createElement("div");
  tooltip.id = "qce-tooltip";
  document.body.appendChild(tooltip);

  // State
  let selected = null, underCursor = [], underCursorIdx = 0, currentTab = "panel";
  let allowInvisible = false, recolorAll = false, removeElem = false, removeChildren = false;
  let scaleMode = false, dragMode = false, dragging = false, dragOffset = {x:0,y:0}, scaleVal = 1;

  // Tab system
  const tabConfig = {
    panel: {
      title: "Panels",
      fields: [
        {label: "Background", type: "color", key: "backgroundColor"},
        {label: "Border", type: "text", key: "border"},
        {label: "Padding", type: "text", key: "padding"},
        {label: "Margin", type: "text", key: "margin"},
        {label: "Box Shadow", type: "text", key: "boxShadow"},
        {label: "Border Radius", type: "text", key: "borderRadius"},
        {label: "Opacity", type: "number", key: "opacity"}
      ]
    },
    text: {
      title: "Text",
      fields: [
        {label: "Color", type: "color", key: "color"},
        {label: "Font Size", type: "text", key: "fontSize"},
        {label: "Font Weight", type: "text", key: "fontWeight"},
        {label: "Line Height", type: "text", key: "lineHeight"},
        {label: "Text Shadow", type: "text", key: "textShadow"},
        {label: "Text Align", type: "text", key: "textAlign"},
        {label: "Font Style", type: "text", key: "fontStyle"}
      ]
    },
    link: {
      title: "Links",
      fields: [
        {label: "Link Color", type: "color", key: "color"},
        {label: "Text Decoration", type: "text", key: "textDecoration"},
        {label: "Hover Color", type: "color", key: "hoverColor"},
        {label: "Font Weight", type: "text", key: "fontWeight"}
      ]
    },
    img: {
      title: "Images",
      fields: [
        {label: "Width", type: "text", key: "width"},
        {label: "Height", type: "text", key: "height"},
        {label: "Border Radius", type: "text", key: "borderRadius"},
        {label: "Opacity", type: "number", key: "opacity"}
      ]
    },
    inject: {
      title: "Inject",
      fields: []
    }
  };

  // Helper: get selector for element
  function getSelector(el) {
    if (!el) return "";
    if (el.id) return `#${el.id}`;
    if (el.className) return `${el.tagName.toLowerCase()}.${el.className.trim().split(/\s+/).join('.')}`;
    return el.tagName.toLowerCase();
  }

  // Helper: render tab content
  function renderTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.qce-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
      btn.setAttribute('aria-selected', btn.dataset.tab === tab ? "true" : "false");
    });
    const content = document.getElementById("qce-content");
    content.innerHTML = "";

    if (tab === "inject") {
      content.innerHTML = `
        <div class="qce-section">
          <div class="qce-label">Paste raw CSS here:</div>
          <textarea id="qce-inject-area" style="width:100%;min-height:120px;background:#222;color:#fff;font-family:monospace;padding:8px;border-radius:8px;border:1px solid #444;"></textarea>
          <button id="qce-inject" class="qce-btn">Inject CSS</button>
        </div>
        <div class="qce-section">
          <div class="qce-label">Generate JS Snippet:</div>
          <button id="qce-genjs" class="qce-btn">Generate &amp; Copy JS</button>
          <pre id="qce-jsout" style="background:#181825;color:#b7c2d1;padding:8px;border-radius:8px;white-space:pre-wrap;"></pre>
        </div>
      `;
      content.querySelector("#qce-inject").onclick = () => {
        const css = content.querySelector("#qce-inject-area").value;
        if (!css.trim()) return;
        let st = document.getElementById("qce-injected-style");
        if (!st) {
          st = document.createElement("style");
          st.id = "qce-injected-style";
          document.head.appendChild(st);
        }
        st.textContent = css;
      };
      content.querySelector("#qce-genjs").onclick = () => {
        const css = content.querySelector("#qce-inject-area").value;
        if (!css.trim()) return;
        const js = `(() => {const style = document.createElement('style');style.textContent = \`${css.replace(/`/g,"\\`")}\`;document.head.appendChild(style);})();`;
        content.querySelector("#qce-jsout").textContent = js;
        navigator.clipboard.writeText(js);
      };
      return;
    }

    // For element tabs
    let html = "";
    if (!selected) {
      html = `<div class="qce-tip">Alt+Click any element to select and edit its style live.</div>`;
    } else {
      let sel = getSelector(selected);
      html += `<div class="qce-label" style="margin-bottom:12px;">Selected: <code>${sel}</code></div>`;
      tabConfig[tab].fields.forEach(field => {
        const v = selected.style[field.key] || "";
        html += `
          <div class="qce-row">
            <label class="qce-label" style="min-width:100px">${field.label}</label>
            <input class="qce-input" id="qce-${field.key}" type="${field.type}" value="${v}">
          </div>
        `;
      });
      html += `<button id="qce-apply" class="qce-btn">Apply Style</button>
        <button id="qce-export" class="qce-btn">Export CSS</button>
        <button id="qce-remove" class="qce-btn" style="background:#f15a5a;">Remove Element</button>
        <button id="qce-hide" class="qce-btn" style="background:#888;">Hide Element</button>
        <button id="qce-drag" class="qce-btn">Drag</button>
        <button id="qce-scale" class="qce-btn">Scale (wheel)</button>
        <textarea id="qce-cssout" style="width:100%;min-height:80px;background:#222;color:#fff;font-family:monospace;padding:8px;border-radius:8px;margin-top:10px;"></textarea>
      `;
    }
    content.innerHTML = html;

    if (selected) {
      // Apply
      content.querySelector("#qce-apply").onclick = () => {
        tabConfig[tab].fields.forEach(field => {
          const val = content.querySelector(`#qce-${field.key}`).value;
          if (val) selected.style[field.key] = val;
        });
        updateCSSOut();
      };
      // Export
      content.querySelector("#qce-export").onclick = () => {
        updateCSSOut();
        const txt = content.querySelector("#qce-cssout").value;
        navigator.clipboard.writeText(txt);
      };
      // Remove
      content.querySelector("#qce-remove").onclick = () => {
        selected.remove();
        selected = null;
        renderTab(tab);
      };
      // Hide
      content.querySelector("#qce-hide").onclick = () => {
        selected.style.display = "none";
        updateCSSOut();
      };
      // Drag
      content.querySelector("#qce-drag").onclick = () => {
        dragMode = !dragMode;
        scaleMode = false;
      };
      // Scale
      content.querySelector("#qce-scale").onclick = () => {
        scaleMode = !scaleMode;
        dragMode = false;
      };
    }
  }

  // CSS Output (for export)
  function updateCSSOut() {
    if (!selected) return;
    let css = getSelector(selected) + " {\n";
    Object.keys(selected.style).forEach(k => {
      if (typeof selected.style[k] === "string" && selected.style[k]) {
        css += `  ${k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}: ${selected.style[k]};\n`;
      }
    });
    css += "}\n";
    document.getElementById("qce-cssout").value = css;
  }

  // Tabs events
  document.querySelectorAll('.qce-tab').forEach(tabBtn => {
    tabBtn.onclick = () => renderTab(tabBtn.dataset.tab);
    tabBtn.onkeydown = e => { if (e.key === "Enter" || e.key === " ") renderTab(tabBtn.dataset.tab); };
  });

  // Close button
  document.getElementById("qce-close").onclick = () => {
    root.style.display = "none";
    overlay.style.display = "none";
    tooltip.style.display = "none";
  };

  // Element picking and overlay
  document.addEventListener("mousemove", e => {
    if (!e.altKey) {
      if (!selected) overlay.style.display = "none";
      return;
    }
    underCursor = document.elementsFromPoint(e.clientX, e.clientY).filter(
      el => !root.contains(el) && el.id !== "qce-overlay" && el.id !== "qce-tooltip"
    );
    if (underCursor.length) {
      underCursorIdx = 0;
      const el = underCursor[0];
      const r = el.getBoundingClientRect();
      Object.assign(overlay.style, {
        display: "block",
        top: `${window.scrollY + r.top}px`,
        left: `${window.scrollX + r.left}px`,
        width: `${r.width}px`,
        height: `${r.height}px`
      });
      tooltip.textContent = getSelector(el);
      tooltip.style.display = "block";
      tooltip.style.left = `${e.pageX + 20}px`;
      tooltip.style.top = `${e.pageY + 10}px`;
    } else {
      overlay.style.display = "none";
      tooltip.style.display = "none";
    }
  });

  // Cycle stacked elements
  document.addEventListener("wheel", e => {
    if (!e.altKey) return;
    if (!underCursor.length) return;
    e.preventDefault();
    underCursorIdx = (underCursorIdx + Math.sign(e.deltaY) + underCursor.length) % underCursor.length;
    const el = underCursor[underCursorIdx];
    const r = el.getBoundingClientRect();
    Object.assign(overlay.style, {
      display: "block",
      top: `${window.scrollY + r.top}px`,
      left: `${window.scrollX + r.left}px`,
      width: `${r.width}px`,
      height: `${r.height}px`
    });
    tooltip.textContent = getSelector(el);
    tooltip.style.display = "block";
    tooltip.style.left = `${e.pageX + 20}px`;
    tooltip.style.top = `${e.pageY + 10}px`;
  }, {passive: false});

  // Pick element on Alt+Click
  document.addEventListener("click", e => {
    if (!e.altKey) return;
    if (!underCursor.length) return;
    e.preventDefault();
    selected = underCursor[underCursorIdx];
    overlay.style.display = "none";
    tooltip.style.display = "none";
    renderTab(currentTab);
  });

  // Drag & scale
  document.addEventListener("mousedown", e => {
    if (!dragMode || !selected || !e.altKey) return;
    dragging = true;
    const r = selected.getBoundingClientRect();
    dragOffset.x = e.clientX - r.left;
    dragOffset.y = e.clientY - r.top;
    e.preventDefault();
  });
  document.addEventListener("mouseup", () => { dragging = false; });
  document.addEventListener("mousemove", e => {
    if (!dragging || !dragMode || !selected) return;
    selected.style.position = "fixed";
    selected.style.left = `${e.clientX - dragOffset.x}px`;
    selected.style.top = `${e.clientY - dragOffset.y}px`;
  });
  document.addEventListener("wheel", e => {
    if (!scaleMode || !selected || !e.altKey) return;
    e.preventDefault();
    scaleVal += Math.sign(-e.deltaY) * 0.1;
    if (scaleVal < 0.2) scaleVal = 0.2;
    if (scaleVal > 5) scaleVal = 5;
    selected.style.transform = `scale(${scaleVal})`;
  }, {passive:false});

  // Initial render
  renderTab("panel");
})();