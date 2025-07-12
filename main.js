(() => {
 //v4
    const CSS = `
  :root {
    --atemp-bg: #161a20;
    --atemp-panel: #1c222b;
    --atemp-aatempent: #36e6f7;
    --atemp-aatempent2: #1db7d6;
    --atemp-aatempent3: #8af9ff;
    --atemp-hover: #17303a;
    --atemp-text: #eafaff;
    --atemp-muted: #b3atempe0;
    --atemp-shadow: 0 4px 22px #0a1f2980;
    --atemp-danger: #e24b6c;
    --atemp-green: #36e6c2;
    --atemp-tooltip-bg: #171f28e6;
    --atemp-tooltip-border: #36e6f7;
    --atemp-scroll: #212e35;
  }
  #atemp-root {
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    position: fixed; z-index: 2147483647;
    top: 24px; right: 12px; width: 330px; min-width: 220px; max-width: 100vw; height: 600px; min-height:120px;
    color: var(--atemp-text); background: var(--atemp-bg);
    display: flex; flex-direction: column; border-radius: 0;
    box-shadow: var(--atemp-shadow);
    user-select: none; overflow: hidden;
    resize: none;
  }
  #atemp-bgcontrols, #atemp-header, #atemp-footer {
    padding: 8px 10px; background: var(--atemp-panel); font-size: .99em;
  }
  #atemp-bgcontrols { display: flex; align-items: center; gap:6px; border-bottom:1px solid var(--atemp-aatempent);}
  #atemp-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid var(--atemp-aatempent);}
  #atemp-title { font-weight: 800; letter-spacing:.01em; color: var(--atemp-aatempent3);}
  #atemp-close {
    border: none; background: none; color: var(--atemp-aatempent); font-size: 1.2em; cursor: pointer; padding: 0 8px;
    transition: background 0.11s;
  }
  #atemp-close:hover { background: var(--atemp-hover); color: #fff; }
  #atemp-tabs {
    display: flex; overflow-x: auto; border-bottom: 1.5px solid var(--atemp-aatempent); background: var(--atemp-panel);
    white-space: nowrap; scrollbar-width: thin; scrollbar-color: var(--atemp-aatempent2) var(--atemp-panel);
  }
  .atemp-tab {
    flex: 1 0 auto; min-width: 0; padding: 9px 6px; margin: 0; border: none;
    background: var(--atemp-hover); color: var(--atemp-muted); font-weight: 700; font-size: .98em;
    letter-spacing:.01em; border-radius:0; cursor: pointer; outline: none;
    border-right: 1px solid var(--atemp-panel);
    transition: background .13s, color .13s;
    text-align: center;
  }
  .atemp-tab:last-child { border-right: none; }
  .atemp-tab.active, .atemp-tab:focus { background: var(--atemp-bg); color: var(--atemp-aatempent3); border-bottom: 2px solid var(--atemp-aatempent3);}
  .atemp-tab:hover { background: #145a6c; color: var(--atemp-aatempent);}
  #atemp-content {
    flex: 1 1 auto; overflow-y: auto; padding: 8px 8px 6px 8px; background: var(--atemp-bg);
    font-size: .97em; min-height:0;
    scrollbar-color: var(--atemp-aatempent2) var(--atemp-scroll); scrollbar-width: thin;
  }
  .atemp-section { margin-bottom: 7px; padding: 7px 7px 5px 7px; background: #191f29; border-bottom: 1px solid #22333d;}
  .atemp-label { font-size: .98em; font-weight: 600; color: var(--atemp-aatempent2); margin-right: 4px;}
  .atemp-row { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; flex-wrap: wrap;}
  .atemp-input, .atemp-btn { background: #1c222b; color: var(--atemp-text); border: 1.2px solid var(--atemp-aatempent2);
    border-radius: 0; padding: 5px 6px; font-size: .97em; flex: 1 1 0; outline: none;}
  .atemp-input:focus, .atemp-btn:focus { border: 1.6px solid var(--atemp-aatempent3);}
  .atemp-btn { font-weight: 700; cursor: pointer; transition: background 0.13s, color 0.12s;}
  .atemp-btn:hover { background: var(--atemp-aatempent2); color: #fff;}
  .atemp-btn[style*="background"] { color: #222;}
  #atemp-footer { font-size: .97em; color: var(--atemp-muted); border-top: 1.5px solid var(--atemp-aatempent);}
  #atemp-footer b { color: var(--atemp-aatempent3);}
  #atemp-overlay {
    position: absolute; pointer-events: none; z-index: 2147483646;
    outline: 2px solid var(--atemp-aatempent3); background: rgba(54,230,247,0.13);
    transition: all 0.13s; display: none;
  }
  #atemp-tooltip, .atemp-tooltip {
    position: absolute; z-index: 2147483647; font-size: .97em; background:var(--atemp-tooltip-bg); color:#fff;
    padding: 5px 7px; border: 1.2px solid var(--atemp-tooltip-border); max-width: 300px;
    display: none; font-family: 'JetBrains Mono',monospace; font-weight: 500; border-radius:0;
    pointer-events: none; white-space:pre-line;
  }
  #atemp-cssout, #atemp-jsout, #atemp-inject-area {
    width: 100%; min-height: 50px; background: #161d25; color: #d4f6fd;
    font-family: 'JetBrains Mono',monospace; padding: 5px 8px; border-radius: 0; border: 1.2px solid var(--atemp-aatempent2);
    margin-top: 6px; margin-bottom: 8px; font-size: .97em; resize: vertical;
  }
  #atemp-cssout { min-height: 70px; max-height: 180px; }
  .atemp-computed { background: #192834; color: #82e9f6; padding: 4px 7px; margin: 0 0 5px 0; font-size: .97em; border-radius: 0; font-family: 'JetBrains Mono',monospace; overflow:auto; white-space:pre-wrap; max-height: 65px;}
  .atemp-selrow { display: flex; gap: 5px; align-items:center; margin-bottom:4px;}
  .atemp-selrow code { background: #17303a; color: #36e6f7; border-radius: 0; padding: 1px 5px; font-size: .97em;}
  #atemp-preview-tooltip {
    position: absolute; z-index: 2147483647; background: #10181fef; border: 2px solid var(--atemp-aatempent3);
    box-shadow: 0 6px 30px #0af8ff1a; padding: 4px; display: none; width: 120px; min-height: 40px; max-width: 130px; max-height: 70px;
    pointer-events: none; border-radius: 0; overflow: hidden; text-align: center;
  }
  #atemp-preview-tooltip .atemp-preview-label { color: var(--atemp-aatempent3); font-size: .93em; font-family: 'JetBrains Mono',monospace; margin-bottom: 3px; display:block;}
  #atemp-preview-tooltip .atemp-preview-content { background: #17303a; min-height: 20px; max-height: 45px; overflow: auto; border: 1px solid #222e2f; margin: 0 auto; padding: 0; display: flex; align-items: center; justify-content: center;}
  #atemp-preview-tooltip .atemp-preview-clone { max-width: 90px; max-height: 40px; overflow: hidden; border: none; background: transparent; pointer-events: none; margin: 0 auto; display: block;}
  #atemp-content::-webkit-scrollbar, #atemp-tabs::-webkit-scrollbar { height:7px; background: var(--atemp-panel);}
  #atemp-content::-webkit-scrollbar-thumb, #atemp-tabs::-webkit-scrollbar-thumb { background: var(--atemp-aatempent2);}
  #atemp-resizer {
    width:17px;height:17px;position:absolute;right:2px;bottom:2px;cursor:nwse-resize;z-index:9999;
    background:rgba(54,230,247,0.22);border:1.5px solid #1db7d6;
  }
  #atemp-resize-children-toggle {
    border: none; background: none; color: var(--atemp-aatempent); font-size: 1.2em; 
    cursor: pointer; padding: 0 8px; transition: background 0.11s;
  }
  #atemp-resize-children-toggle:hover { background: var(--atemp-hover) !important; color: #fff; }
  #atemp-resize-children-toggle.active { background: var(--atemp-aatempent2) !important; color: #222; }
  @media (max-width: 500px) { #atemp-root { width:98vw !important; max-width:98vw;} #atemp-content { padding:3px 1vw 3px 1vw; } #atemp-preview-tooltip { max-width: 65vw; } }
  `;

    document.head.appendChild(Object.assign(document.createElement("style"), {
        textContent: CSS
    }));

    const root = document.createElement("div");
    root.id = "atemp-root";
    root.innerHTML = `
    <div id="atemp-bgcontrols">
      <label>Custom BG:</label>
      <input id="atemp-bgurl" class="atemp-input" placeholder="Image URL..." style="width:70px;flex:1 1 auto;" autocomplete="off">
      <input id="atemp-bgfile" type="file" aatempept="image/*" title="Upload image" style="width:23px;">
      <button id="atemp-bgclear" class="atemp-btn" style="min-width:22px;width:auto;padding:2px 5px;">✕</button>
    </div>
    <div id="atemp-header">
      <span id="atemp-title">live CSS Editor</span>
      <button id="atemp-resize-children-toggle" title="Resize children with parent">⇲</button>
      <button id="atemp-close" title="Close">&times;</button>
    </div>
    <div id="atemp-tabs" role="tablist">
      <button class="atemp-tab active" role="tab" aria-selected="true" tabindex="0" data-tab="global">Global</button>
      <button class="atemp-tab" role="tab" aria-selected="false" tabindex="0" data-tab="panel">Panel</button>
      <button class="atemp-tab" role="tab" aria-selected="false" tabindex="0" data-tab="text">Text</button>
      <button class="atemp-tab" role="tab" aria-selected="false" tabindex="0" data-tab="img">Image</button>
      <button class="atemp-tab" role="tab" aria-selected="false" tabindex="0" data-tab="advanced">Advanced</button>
      <button class="atemp-tab" role="tab" aria-selected="false" tabindex="0" data-tab="inject">Inject</button>
      <button class="atemp-tab" role="tab" aria-selected="false" tabindex="0" data-tab="info">Info</button>
      <button class="atemp-tab" role="tab" aria-selected="false" tabindex="0" data-tab="help">Help</button>
    </div>
    <div id="atemp-content"></div>
    <textarea id="atemp-cssout" readonly placeholder="All CSS output appears here..."></textarea>
    <div id="atemp-footer"><b>Shift+Hover</b> to select • <b>Shift+Scroll</b> to cycle • <b>Export</b> to copy</div>
    <div id="atemp-tooltip" class="atemp-tooltip"></div>
  `;
    document.body.appendChild(root);
    document.body.appendChild(Object.assign(document.createElement("div"), {
        id: "atemp-overlay"
    }));
    const preview = document.createElement("div");
    preview.id = "atemp-preview-tooltip";
    document.body.appendChild(preview);

    let dragging = false,
        dragOffset = [0, 0],
        resizingPanel = false,
        resizeStart = [0, 0],
        panelStart = [0, 0],
        moveMode = false,
        moveChildren = false;

    const resizer = document.createElement("div");
    resizer.id = "atemp-resizer";
    root.appendChild(resizer);

    root.style.left = "";
    root.style.top = "24px";
    root.style.right = "12px";
    root.style.bottom = "";
    root.style.width = "330px";
    root.style.height = "600px";
    root.style.minHeight = "120px";
    root.style.minWidth = "220px";
    root.style.position = "fixed";

    const atempHeader = root.querySelector("#atemp-header");
    atempHeader.style.cursor = "move";
    atempHeader.onmousedown = e => {
        if (e.button !== 0) return;
        dragging = true;
        dragOffset = [e.clientX - root.offsetLeft, e.clientY - root.offsetTop];
        document.body.style.userSelect = "none";
        e.preventDefault();
    };
    window.addEventListener("mousemove", e => {
        if (dragging) {
            root.style.left = (e.clientX - dragOffset[0]) + "px";
            root.style.top = (e.clientY - dragOffset[1]) + "px";
            root.style.right = "auto";
        }
        if (resizingPanel) {
            root.style.width = Math.max(220, panelStart[0] + (e.clientX - resizeStart[0])) + "px";
            root.style.height = Math.max(120, panelStart[1] + (e.clientY - resizeStart[1])) + "px";
        }
    });
    window.addEventListener("mouseup", e => {
        dragging = false;
        resizingPanel = false;
        document.body.style.userSelect = "";
    });

    resizer.onmousedown = e => {
        resizingPanel = true;
        resizeStart = [e.clientX, e.clientY];
        panelStart = [root.offsetWidth, root.offsetHeight];
        e.stopPropagation();
        e.preventDefault();
    };

    let selected = null,
        underCursor = [],
        underCursorIdx = 0,
        currentTab = "panel";
    let cycling = false,
        lastMouseEvent = null;
    let globalLinkColor = "",
        globalLinkHover = "",
        globalTextColor = "";
    let globalStyleNode = null;
    let resizeChildrenMode = false;
    let moveOrigin = {
        parent: null,
        children: []
    };

    let cssMap = {};

    const propertyTips = {
        backgroundColor: "Background color (e.g. #0ff, transparent)",
        border: "CSS border, e.g. 1px solid #36e6f7",
        padding: "Padding (inside spacing), e.g. 8px 16px",
        margin: "Margin (outside spacing), e.g. 8px auto",
        boxShadow: "CSS box-shadow, e.g. 0 2px 8px #000a",
        borderRadius: "Border radius (rounded corners), e.g. 8px",
        opacity: "Transparency (0-1), e.g. 0.7",
        color: "Text color",
        fontSize: "Font size, e.g. 16px, 1.5em",
        fontWeight: "Font weight, e.g. 400, bold",
        lineHeight: "Line height, e.g. 1.5",
        textShadow: "Text shadow, e.g. 1px 2px 4px #000",
        textAlign: "Text align, e.g. left, center",
        fontStyle: "Font style, e.g. italic",
        width: "Width (px, %, em, etc)",
        height: "Height",
        filter: "CSS filter, e.g. blur(2px) brightness(0.8)",
        objectFit: "Image fit, e.g. cover, contain",
        mixBlendMode: "Blend mode, e.g. multiply, screen",
        zIndex: "Stacking order (number)",
        pointerEvents: "e.g. auto, none",
        display: "Display type, e.g. block, flex, grid",
        position: "CSS position, e.g. absolute, fixed",
        top: "Top offset",
        left: "Left offset",
        right: "Right offset",
        bottom: "Bottom offset",
        backgroundImage: "Background image URL or gradient",
        backgroundSize: "Background size, e.g. cover, contain",
        backgroundRepeat: "Background repeat, e.g. no-repeat",
        backgroundPosition: "Background position, e.g. center",
        borderColor: "Border color",
        borderWidth: "Border width",
        borderStyle: "Border style, e.g. solid, dashed"
    };

    const tabConfig = {
        panel: {
            fields: [{
                k: "backgroundColor",
                type: "color"
            }, {
                k: "border",
                type: "text"
            }, {
                k: "padding",
                type: "text"
            }, {
                k: "margin",
                type: "text"
            }, {
                k: "boxShadow",
                type: "text"
            }, {
                k: "borderRadius",
                type: "text"
            }, {
                k: "opacity",
                type: "number"
            }]
        },
        text: {
            fields: [{
                k: "color",
                type: "color"
            }, {
                k: "fontSize",
                type: "text"
            }, {
                k: "fontWeight",
                type: "number"
            }, {
                k: "lineHeight",
                type: "text"
            }, {
                k: "textShadow",
                type: "text"
            }, {
                k: "textAlign",
                type: "text"
            }, {
                k: "fontStyle",
                type: "text"
            }]
        },
        img: {
            fields: [{
                k: "width",
                type: "text"
            }, {
                k: "height",
                type: "text"
            }, {
                k: "borderRadius",
                type: "text"
            }, {
                k: "opacity",
                type: "number"
            }, {
                k: "filter",
                type: "text"
            }, {
                k: "objectFit",
                type: "text"
            }, {
                k: "mixBlendMode",
                type: "text"
            }]
        },
        advanced: {
            fields: [{
                k: "zIndex",
                type: "number"
            }, {
                k: "pointerEvents",
                type: "text"
            }, {
                k: "display",
                type: "text"
            }, {
                k: "position",
                type: "text"
            }, {
                k: "top",
                type: "text"
            }, {
                k: "left",
                type: "text"
            }, {
                k: "right",
                type: "text"
            }, {
                k: "bottom",
                type: "text"
            }, {
                k: "backgroundImage",
                type: "text"
            }, {
                k: "backgroundSize",
                type: "text"
            }, {
                k: "backgroundRepeat",
                type: "text"
            }, {
                k: "backgroundPosition",
                type: "text"
            }, {
                k: "borderColor",
                type: "color"
            }, {
                k: "borderWidth",
                type: "text"
            }, {
                k: "borderStyle",
                type: "text"
            }]
        }
    };

    function themeElement(el, property, value) {
        el.style[property] = value;
    }

    function getSelector(el) {
        if (!el) return "";
        if (el.id) return `#${el.id}`;
        if (el.className) return `${el.tagName.toLowerCase()}.${el.className.trim().split(/\s+/).join('.')}`;
        return el.tagName.toLowerCase();
    }

    function getComputed(el) {
        if (!el) return "";
        const styles = window.getComputedStyle(el);
        return Array.from(styles)
            .slice(0, 18)
            .map(k => `${k}: ${styles.getPropertyValue(k)}`)
            .join('\n');
    }

    function getInline(el) {
        if (!el || !el.style) return "";
        return Object.keys(el.style)
            .filter(k => el.style[k])
            .map(k =>
                `${k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}: ${el.style[k]};`
            )
            .join('\n');
    }

    function updateCSSOut() {
        if (!selected) return updateCssOutBox();

        const selector = getSelector(selected);
        const styleMap = {};

        Object.keys(selected.style).forEach(k => {
            if (typeof selected.style[k] === "string" && selected.style[k] && !/^\d+$/.test(k)) {
                const propName = k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
                styleMap[propName] = selected.style[k];
            }
        });

        const groupedProps = {
            'border': ['border-top', 'border-right', 'border-bottom', 'border-left'],
            'margin': ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
            'padding': ['padding-top', 'padding-right', 'padding-bottom', 'padding-left']
        };

        Object.entries(groupedProps).forEach(([group, props]) => {
            if (props.every(p => styleMap[p] && styleMap[p] === styleMap[props[0]])) {
                styleMap[group] = styleMap[props[0]];
                props.forEach(p => delete styleMap[p]);
            }
        });

        const finalProps = Object.keys(styleMap)
            .sort()
            .filter(prop => styleMap[prop] && !prop.startsWith('webkit-'));

        if (finalProps.length > 0) {
            let css = `${selector} {\n`;
            finalProps.forEach(prop => {
                css += `  ${prop}: ${styleMap[prop]};\n`;
            });
            css += '}\n';

            if (css.replace(/\s+/g, '') !== (cssMap[selector] || '').replace(/\s+/g, '')) {
                cssMap[selector] = css;
            }
        } else {
            delete cssMap[selector];
        }

        updateCssOutBox();
    }


    function updateCssOutBox() {
        const box = document.getElementById("atemp-cssout");
        box.value = Object.values(cssMap)
            .filter(Boolean)
            .join("\n");
    }

    function showTooltip(msg, x, y) {
        const tip = document.getElementById("atemp-tooltip");
        tip.textContent = msg;
        tip.style.display = "block";
        tip.style.left = `${x + 10}px`;
        tip.style.top = `${y + 4}px"`;
    }

    function hideTooltip() {
        document.getElementById("atemp-tooltip")
            .style.display = "none";
    }

    function injectGlobalStyle() {
        if (!globalStyleNode) {
            globalStyleNode = document.createElement('style');
            globalStyleNode.id = 'atemp-global-style';
            document.head.appendChild(globalStyleNode);
        }
        globalStyleNode.textContent = `
      ${globalLinkColor ? `a { color: ${globalLinkColor} !important; }` : ''}
      ${globalLinkHover ? `a:hover { color: ${globalLinkHover} !important; }` : ''}
      ${globalTextColor ? `body, body *:not(script):not(style):not(a) { color: ${globalTextColor} !important; }` : ''}
    `;
    }

    function resizeChildrenWithParent(parent, widthChange, heightChange) {
        if (!resizeChildrenMode || !parent.children || parent.children.length === 0) return;

        const originalWidth = parent.dataset.originalWidth || parent.offsetWidth;
        const originalHeight = parent.dataset.originalHeight || parent.offsetHeight;

        if (!parent.dataset.originalWidth) {
            parent.dataset.originalWidth = originalWidth;
            parent.dataset.originalHeight = originalHeight;

            Array.from(parent.children)
                .forEach(child => {
                    child.dataset.originalWidth = child.offsetWidth;
                    child.dataset.originalHeight = child.offsetHeight;
                    if (window.getComputedStyle(child)
                        .fontSize) {
                        child.dataset.originalFontSize = parseFloat(window.getComputedStyle(child)
                            .fontSize);
                    }
                });
        }

        const widthRatio = parent.offsetWidth / originalWidth;
        const heightRatio = parent.offsetHeight / originalHeight;

        Array.from(parent.children)
            .forEach(child => {
                if (child.dataset.originalWidth && child.dataset.originalHeight) {
                    child.style.width = (parseFloat(child.dataset.originalWidth) * widthRatio) + 'px';
                    child.style.height = (parseFloat(child.dataset.originalHeight) * heightRatio) + 'px';

                    if (child.dataset.originalFontSize) {
                        child.style.fontSize = (child.dataset.originalFontSize * Math.min(widthRatio, heightRatio)) + 'px';
                    }

                    const originalPadding = child.dataset.originalPadding || window.getComputedStyle(child)
                        .padding;
                    if (originalPadding) {
                        const padValues = originalPadding.split(' ')
                            .map(v => parseFloat(v));
                        const scaledPadding = padValues.map(v => v * Math.min(widthRatio, heightRatio))
                            .join('px ') + 'px';
                        child.style.padding = scaledPadding;
                        if (!child.dataset.originalPadding) child.dataset.originalPadding = originalPadding;
                    }
                }
            });
    }

    const bgurl = root.querySelector("#atemp-bgurl"),
        bgfile = root.querySelector("#atemp-bgfile"),
        bgclear = root.querySelector("#atemp-bgclear");

    function setBg(url) {
        document.documentElement.style.setProperty("--atemp-bg-image", url ? `url('${url}')` : "none");
    }
    bgurl.addEventListener("change", e => setBg(bgurl.value));
    bgurl.addEventListener("blur", e => setBg(bgurl.value));
    bgfile.onchange = e => {
        if (!bgfile.files[0]) return;
        const fr = new FileReader();
        fr.onload = e2 => setBg(fr.result);
        fr.readAsDataURL(bgfile.files[0]);
    };
    bgclear.onclick = () => {
        setBg();
        bgurl.value = "";
        bgfile.value = "";
    };

    function elementBgTextureUI() {
        return `
      <div class="atemp-section" style="background:#191f29;">
        <div class="atemp-row">
          <label class="atemp-label" title="Set texture (background image) for this element">Texture</label>
          <input class="atemp-input" id="atemp-elem-bgurl" type="text" placeholder="Image URL..." style="width:80px;">
          <input id="atemp-elem-bgfile" type="file" aatempept="image/*" style="width:22px;">
          <button id="atemp-elem-bgclear" class="atemp-btn" style="width:auto;padding:1px 5px;">✕</button>
        </div>
      </div>
    `;
    }

    function setupElementBgTextureHandlers() {
        const input = document.getElementById("atemp-elem-bgurl");
        const file = document.getElementById("atemp-elem-bgfile");
        const clear = document.getElementById("atemp-elem-bgclear");
        if (!selected) return;
        input.value = selected.style.backgroundImage && selected.style.backgroundImage !== "none" ?
            (selected.style.backgroundImage.match(/url\(["']?([^"')]+)/)
                ?.[1] || "") : "";
        input.onchange = () => {
            selected.style.backgroundImage = input.value ? `url('${input.value}')` : "";
        };
        input.onblur = input.onchange;
        file.onchange = () => {
            if (!file.files[0]) return;
            const fr = new FileReader();
            fr.onload = e2 => {
                selected.style.backgroundImage = `url('${fr.result}')`;
                input.value = fr.result;
            };
            fr.readAsDataURL(file.files[0]);
        };
        clear.onclick = () => {
            selected.style.backgroundImage = "";
            input.value = "";
            file.value = "";
        };
    }

    function updatePreview(el, x, y) {
        const box = preview;
        if (!el) {
            box.style.display = "none";
            return;
        }
        box.innerHTML = "";
        const label = document.createElement("span");
        label.className = "atemp-preview-label";
        label.textContent = getSelector(el);
        box.appendChild(label);
        const content = document.createElement("div");
        content.className = "atemp-preview-content";
        let clone;
        if (el instanceof HTMLImageElement) {
            clone = el.cloneNode(false);
            clone.className = "atemp-preview-clone";
            clone.style.maxWidth = "90px";
            clone.style.maxHeight = "40px";
            clone.removeAttribute("id");
            content.appendChild(clone);
        } else if (el instanceof HTMLInputElement || el instanceof HTMLButtonElement || el instanceof HTMLTextAreaElement) {
            clone = el.cloneNode(true);
            clone.className = "atemp-preview-clone";
            clone.disabled = true;
            clone.removeAttribute("id");
            clone.removeAttribute("name");
            clone.style.pointerEvents = "none";
            content.appendChild(clone);
        } else {
            clone = el.cloneNode(false);
            clone.className = "atemp-preview-clone";
            const cs = getComputedStyle(el);
            clone.style.cssText = [
                "display:block", "margin:0 auto", "pointer-events:none",
                `background:${cs.background}`,
                `color:${cs.color}`,
                `font:${cs.font}`,
                `border:${cs.border}`,
                `borderRadius:${cs.borderRadius}`,
                `boxShadow:${cs.boxShadow}`,
                `padding:${cs.padding}`,
                `width:${Math.min(parseInt(cs.width)||90,90)}px`, "height:auto",
                "max-width:90px", "max-height:40px", "overflow:hidden"
            ].join(";");
            if (el.textContent && el.textContent.trim()) clone.textContent = el.textContent.slice(0, 32);
            content.appendChild(clone);
        }
        box.appendChild(content);
        box.style.display = "block";
        let px = Math.max(5, Math.min(window.innerWidth - box.offsetWidth - 8, x + 14));
        let py = Math.max(2, Math.min(window.innerHeight - box.offsetHeight - 8, y - 2));
        box.style.left = px + "px";
        box.style.top = py + "px";
    }

    function addMoveChildrenToggleUI() {
        const content = document.getElementById("atemp-content");
        if (!content) return;
        let moveRow = document.createElement("div");
        moveRow.className = "atemp-row";
        moveRow.innerHTML = `<label class="atemp-label">Move Children</label>
      <button id="atemp-move-children" class="atemp-btn" style="width:auto">${moveChildren ? "ON" : "OFF"}</button>
      <span style="color:var(--atemp-muted);font-size:.94em;">(Shift+C to toggle)</span>`;
        moveRow.querySelector("#atemp-move-children")
            .onclick = () => {
                moveChildren = !moveChildren;
                moveRow.querySelector("#atemp-move-children")
                    .textContent = moveChildren ? "ON" : "OFF";
            };
        content.appendChild(moveRow);
    }

    function renderTab(tab) {
        currentTab = tab;
        document.querySelectorAll('.atemp-tab')
            .forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === tab);
                btn.setAttribute('aria-selected', btn.dataset.tab === tab ? "true" : "false");
            });
        const content = document.getElementById("atemp-content");
        content.innerHTML = "";
        if (tab === "help") {
            content.innerHTML = `
<div class="atemp-section">
  <div class="atemp-label">Keyboard & Mouse Controls</div>
  <ul style="padding-left:19px;line-height:1.7em;">
    <li><b>Shift + Hover</b>: Select element under mouse</li>
    <li><b>Shift + Scroll (Mouse Wheel)</b>: Cycle through stacked elements under cursor (for covered/overlapping elements)</li>
    <li><b>Arrow Keys (<b>while Shift+Hover</b>)</b>: Resize selected element (width/height)</li>
    <li><b>Shift + Arrow Keys (with Shift+Hover)</b>: Resize faster (10px steps)</li>
    <li><b>Shift + X</b>: Toggle Move-Mode (move via arrow keys, see below)</li>
    <li><b>Arrow Keys (Move-Mode)</b>: Move element (top/left)</li>
    <li><b>Shift + Arrow Keys (Move-Mode)</b>: Move faster (10px steps)</li>
    <li><b>Shift + C (Move-Mode)</b>: Toggle if children move with parent</li>
    <li><b>Escape (Move-Mode)</b>: Exit move mode</li>
    <li><b>Panel</b>: Drag header to move, drag bottom-right corner to resize</li>
    <li><b>Copy CSS</b>: Click Export to copy all CSS output</li>
  </ul>
  <div style="margin-top:8px;color:var(--atemp-muted);font-size:.98em;">
    <b>Tip:</b> If the element you want to resize is covered, hold <b>Shift</b> and use your mouse wheel to scroll through the stacked elements until the desired one is selected, then resize with <b>Shift+Arrow keys</b>.
    <br>All CSS output appears in the textbox at the bottom.<br>
    You can export or copy-paste this for later use.
  </div>
</div>
`;
            return;
        }
        if (tab === "global") {
            content.innerHTML = `
    <div class="atemp-section">
      <div class="atemp-row">
        <label class="atemp-label">All Links</label>
        <input type="color" id="atemp-global-link" value="${globalLinkColor||'#36e6f7'}">
        <label class="atemp-label">Hover</label>
        <input type="color" id="atemp-global-link-hover" value="${globalLinkHover||'#8af9ff'}">
        <button id="atemp-reset-link" class="atemp-btn" style="width:auto">Reset</button>
      </div>
      <div class="atemp-row">
        <label class="atemp-label">All Text</label>
        <input type="color" id="atemp-global-text" value="${globalTextColor||'#eafaff'}">
        <button id="atemp-reset-text" class="atemp-btn" style="width:auto">Reset</button>
      </div>
    </div>
    <div class="atemp-tip">These update all link or text colors using CSS rules. Text color does not affect links.</div>
  `;
            content.querySelector("#atemp-global-link")
                .oninput = e => {
                    globalLinkColor = e.target.value;
                    injectGlobalStyle();
                };
            content.querySelector("#atemp-global-link-hover")
                .oninput = e => {
                    globalLinkHover = e.target.value;
                    injectGlobalStyle();
                };
            content.querySelector("#atemp-global-text")
                .oninput = e => {
                    globalTextColor = e.target.value;
                    injectGlobalStyle();
                };
            content.querySelector("#atemp-reset-link")
                .onclick = () => {
                    globalLinkColor = "";
                    globalLinkHover = "";
                    injectGlobalStyle();
                    content.querySelector("#atemp-global-link")
                        .value = "#36e6f7";
                    content.querySelector("#atemp-global-link-hover")
                        .value = "#8af9ff";
                };
            content.querySelector("#atemp-reset-text")
                .onclick = () => {
                    globalTextColor = "";
                    injectGlobalStyle();
                    content.querySelector("#atemp-global-text")
                        .value = "#eafaff";
                };
            return;
        }
        if (tab === "inject") {
            content.innerHTML = `
    <div class="atemp-section">
      <div class="atemp-label">Paste CSS to inject:</div>
      <textarea id="atemp-inject-area" placeholder="body { color: cyan; }"></textarea>
      <button id="atemp-inject" class="atemp-btn" title="Inject this CSS into the page">Inject CSS</button>
    </div>
    <div class="atemp-section">
      <div class="atemp-label">Generate JS Snippet:</div>
      <button id="atemp-genjs" class="atemp-btn" title="Generate and copy a JS snippet to inject the above CSS">Generate &amp; Copy JS</button>
      <pre id="atemp-jsout"></pre>
    </div>
  `;
            content.querySelector("#atemp-inject")
                .onclick = () => {
                    const css = content.querySelector("#atemp-inject-area")
                        .value;
                    if (!css.trim()) return;
                    let st = document.getElementById("atemp-injected-style");
                    if (!st) {
                        st = document.createElement("style");
                        st.id = "atemp-injected-style";
                        document.head.appendChild(st);
                    }
                    st.textContent = css;
                };
            content.querySelector("#atemp-genjs")
                .onclick = () => {
                    const css = content.querySelector("#atemp-inject-area")
                        .value;
                    if (!css.trim()) return;
                    const js = `(() => {const style=document.createElement('style');style.textContent=\`${css.replace(/`/g,"\\`")}\`;document.head.appendChild(style);})();`;
                    content.querySelector("#atemp-jsout")
                        .textContent = js;
                    navigator.clipboard.writeText(js);
                };
            return;
        }
        if (tab === "info") {
            content.innerHTML = `
    <div class="atemp-section">
      <div class="atemp-label">Selected Element Info</div>
      ${
        selected ?
        `<div class="atemp-selrow"><code>${getSelector(selected)}</code>
          <button id="atemp-copyselector" class="atemp-btn" style="width:auto;padding:3px 8px;">Copy</button>
        </div>
        <div class="atemp-label" style="margin-bottom:3px;">Computed Styles</div>
        <div class="atemp-computed">${getComputed(selected)}</div>
        <div class="atemp-label" style="margin-bottom:3px;">Inline Styles</div>
        <div class="atemp-computed">${getInline(selected)}</div>
        <button id="atemp-reset" class="atemp-btn">Reset Styles</button>
        `
        : `<div class="atemp-tip">Shift+Hover any element to inspect</div>`
      }
    </div>
  `;
            if (selected) {
                content.querySelector("#atemp-copyselector")
                    .onclick = () => {
                        navigator.clipboard.writeText(getSelector(selected));
                    };
                content.querySelector("#atemp-reset")
                    .onclick = () => {
                        selected.removeAttribute("style");
                        renderTab("info");
                    };
            }
            addMoveChildrenToggleUI();
            return;
        }

        let html = "";
        if (!selected) {
            html = `<div class="atemp-tip">Hold <b>Shift</b> and hover any element to select and edit its style live.</div>`;
        } else {
            html += `<div class="atemp-label" style="margin-bottom:4px;">
    <div class="atemp-selrow">
      <code>${getSelector(selected)}</code>
      <button id="atemp-copyselector" class="atemp-btn" style="width:auto;padding:2px 7px;">Copy</button>
    </div>
  </div>`;
            html += elementBgTextureUI();
            (tabConfig[tab]?.fields || [])
            .forEach(field => {
                let k = field.k,
                    v = selected.style[k] || "";
                let type = field.type || (k.includes("color") ? "color" : (k === "opacity" || k === "zIndex" || k === "fontWeight") ? "number" : "text");

                // Special handling for color inputs
                if (type === "color") {
                    html += `<div class="atemp-row">
                    <label class="atemp-label" style="min-width:80px" title="${propertyTips[k]||k}">${k}
                        <span style="color:var(--atemp-aatempent3);font-size:1.08em;cursor:pointer;" data-tt data-k="${k}" tabindex="0">?</span>
                    </label>
                    <input type="color" id="atemp-${k}-picker" value="${v || '#000000'}" style="width:30px;height:30px;padding:0;">
                    <input class="atemp-input" id="atemp-${k}" type="text" value="${v}" placeholder="${k}" style="flex:1;">
                </div>`;
                } else {
                    html += `<div class="atemp-row">
                    <label class="atemp-label" style="min-width:80px" title="${propertyTips[k]||k}">${k}
                        <span style="color:var(--atemp-aatempent3);font-size:1.08em;cursor:pointer;" data-tt data-k="${k}" tabindex="0">?</span>
                    </label>
                    <input class="atemp-input" id="atemp-${k}" type="${type}" value="${v}">
                </div>`;
                }
            });
            html += `
        <button id="atemp-apply" class="atemp-btn">Apply Style</button>
        <button id="atemp-export" class="atemp-btn">Export CSS</button>
        <button id="atemp-remove" class="atemp-btn">Remove Element</button>
        <button id="atemp-hide" class="atemp-btn">Hide Element</button>
      `;
        }
        content.innerHTML = html;
        if (selected) {
            setupElementBgTextureHandlers();

            // Set up color picker synchronization
            (tabConfig[tab]?.fields || []).forEach(field => {
                const k = field.k;
                const type = field.type || (k.includes("color") ? "color" : (k === "opacity" || k === "zIndex" || k === "fontWeight") ? "number" : "text");

                if (type === "color") {
                    const colorPicker = content.querySelector(`#atemp-${k}-picker`);
                    const textInput = content.querySelector(`#atemp-${k}`);

                    if (colorPicker && textInput) {
                        colorPicker.addEventListener('input', (e) => {
                            textInput.value = e.target.value;
                        });

                        textInput.addEventListener('input', (e) => {
                            if (e.target.value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
                                colorPicker.value = e.target.value;
                            }
                        });
                    }
                }
            });

            content.querySelector("#atemp-copyselector")
                .onclick = () => {
                    navigator.clipboard.writeText(getSelector(selected));
                };
            content.querySelector("#atemp-apply")
                .onclick = () => {
                    (tabConfig[tab]?.fields || [])
                    .forEach(field => {
                        const val = content.querySelector(`#atemp-${field.k}`)
                            .value;
                        if (val !== undefined) themeElement(selected, field.k, val);
                    });
                    updateCSSOut();
                };
            content.querySelector("#atemp-export")
                .onclick = () => {
                    updateCSSOut();
                    const txt = document.getElementById("atemp-cssout")
                        .value;
                    navigator.clipboard.writeText(txt);
                };
            content.querySelector("#atemp-remove")
                .onclick = () => {
                    delete cssMap[getSelector(selected)];
                    selected.remove();
                    selected = null;
                    updateCssOutBox();
                    renderTab(tab);
                };
            content.querySelector("#atemp-hide")
                .onclick = () => {
                    selected.style.display = "none";
                    updateCSSOut();
                };
            content.querySelectorAll('[data-tt]')
                .forEach(el => {
                    el.onmouseenter = e => showTooltip(propertyTips[el.dataset.k] || el.dataset.k, e.clientX, e.clientY);
                    el.onfocus = e => showTooltip(propertyTips[el.dataset.k] || el.dataset.k, el.getBoundingClientRect()
                        .left, el.getBoundingClientRect()
                        .top);
                    el.onmouseleave = hideTooltip;
                    el.onblur = hideTooltip;
                });
            updateCSSOut();
        }
        addMoveChildrenToggleUI();
    }

    document.querySelectorAll('.atemp-tab')
        .forEach(tabBtn => {
            tabBtn.onclick = () => renderTab(tabBtn.dataset.tab);
            tabBtn.onkeydown = e => {
                if (e.key === "Enter" || e.key === " ") renderTab(tabBtn.dataset.tab);
            };
        });
    document.getElementById("atemp-close")
        .onclick = () => {
            root.style.display = "none";
            document.getElementById("atemp-overlay")
                .style.display = "none";
            hideTooltip();
            preview.style.display = "none";
        };

    const resizeToggle = document.getElementById("atemp-resize-children-toggle");
    resizeToggle.onclick = () => {
        resizeChildrenMode = !resizeChildrenMode;
        resizeToggle.classList.toggle("active", resizeChildrenMode);
        if (selected) {

            delete selected.dataset.originalWidth;
            delete selected.dataset.originalHeight;
        }
    };

    document.addEventListener("mousemove", e => {
        lastMouseEvent = e;
        if (!e.shiftKey) {
            document.getElementById("atemp-overlay")
                .style.display = "none";
            hideTooltip();
            preview.style.display = "none";
            return;
        }
        underCursor = document.elementsFromPoint(e.clientX, e.clientY)
            .filter(
                el => !root.contains(el) && el.id !== "atemp-overlay" && !el.classList.contains("atemp-tooltip") && el.id !== "atemp-preview-tooltip"
            );
        if (underCursor.length) {
            if (!cycling) underCursorIdx = 0;
            const el = underCursor[underCursorIdx];
            const r = el.getBoundingClientRect();
            Object.assign(document.getElementById("atemp-overlay")
                .style, {
                    display: "block",
                    top: `${window.scrollY + r.top}px`,
                    left: `${window.scrollX + r.left}px`,
                    width: `${r.width}px`,
                    height: `${r.height}px`
                });
            showTooltip(getSelector(el), e.pageX, e.pageY);
            updatePreview(el, e.pageX, e.pageY);
            if (selected !== el) {
                selected = el;
                renderTab(currentTab);
            }
        } else {
            document.getElementById("atemp-overlay")
                .style.display = "none";
            hideTooltip();
            preview.style.display = "none";
        }
    });
    document.addEventListener("wheel", e => {
        if (!e.shiftKey) return;
        if (!underCursor.length) return;
        e.preventDefault();
        cycling = true;
        underCursorIdx = (underCursorIdx + (e.deltaY > 0 ? 1 : -1) + underCursor.length) % underCursor.length;
        if (lastMouseEvent) document.dispatchEvent(new MouseEvent("mousemove", lastMouseEvent));
        setTimeout(() => {
            cycling = false;
        }, 100);
    }, {
        passive: false
    });

    window.addEventListener("keydown", e => {
        if (!selected) return;

        if (e.shiftKey && !moveMode) {
            let amount = e.shiftKey ? 10 : 1;
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                let style = selected.style;
                if (!style.position || style.position === 'static') style.position = "relative";
                let curW = parseInt(style.width) || selected.offsetWidth;
                let curH = parseInt(style.height) || selected.offsetHeight;

                if (e.key === "ArrowUp") {
                    style.height = Math.max(1, curH - amount) + "px";
                    resizeChildrenWithParent(selected, 0, -amount);
                }
                if (e.key === "ArrowDown") {
                    style.height = (curH + amount) + "px";
                    resizeChildrenWithParent(selected, 0, amount);
                }
                if (e.key === "ArrowLeft") {
                    style.width = Math.max(1, curW - amount) + "px";
                    resizeChildrenWithParent(selected, -amount, 0);
                }
                if (e.key === "ArrowRight") {
                    style.width = (curW + amount) + "px";
                    resizeChildrenWithParent(selected, amount, 0);
                }
                updateCSSOut && updateCSSOut();
                e.preventDefault();
            }
        }

        if (e.shiftKey && e.key.toLowerCase() === "x" && selected) {
            moveMode = !moveMode;

            if (moveMode) {

                moveOrigin = {
                    parent: {
                        element: selected,
                        top: selected.style.top || selected.offsetTop + "px",
                        left: selected.style.left || selected.offsetLeft + "px"
                    },
                    children: []
                };

                if (moveChildren) {
                    Array.from(selected.children)
                        .forEach(child => {
                            moveOrigin.children.push({
                                element: child,
                                top: child.style.top || child.offsetTop + "px",
                                left: child.style.left || child.offsetLeft + "px"
                            });
                        });
                }

                root.querySelector("#atemp-title")
                    .textContent = "Cyber CSS Editor [MOVE MODE]";
                root.style.border = "2px solid #e24b6c";
                root.querySelector("#atemp-footer")
                    .textContent = moveChildren ?
                    "Children will also be moved (Shift+C to toggle)" :
                    "Move mode: Arrow keys to move, Shift+C toggle children, Esc to exit";
            } else {

                moveOrigin = {
                    parent: null,
                    children: []
                };
                root.querySelector("#atemp-title")
                    .textContent = "Cyber CSS Editor";
                root.style.border = "";
                root.querySelector("#atemp-footer")
                    .textContent = "Shift+Hover to select • Shift+Scroll to cycle • Export to copy";
            }
            e.preventDefault();
        }

        if (moveMode && e.shiftKey && e.key.toLowerCase() === "c") {
            moveChildren = !moveChildren;

            if (moveChildren && moveOrigin.parent) {
                moveOrigin.children = [];
                Array.from(selected.children)
                    .forEach(child => {
                        moveOrigin.children.push({
                            element: child,
                            top: child.style.top || child.offsetTop + "px",
                            left: child.style.left || child.offsetLeft + "px"
                        });
                    });
            }

            root.querySelector("#atemp-footer")
                .textContent = moveChildren ?
                "Children will also be moved (Shift+C to toggle)" :
                "Move mode: Arrow keys to move, Shift+C toggle children, Esc to exit";
            e.preventDefault();
        }

        if (moveMode && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            let amount = e.shiftKey ? 10 : 1;

            function moveEl(el, originalPos) {
                if (!el.style.position || el.style.position === 'static') {
                    el.style.position = "relative";
                }

                if (!el.style.top) el.style.top = originalPos.top;
                if (!el.style.left) el.style.left = originalPos.left;

                let top = parseInt(el.style.top) || 0;
                let left = parseInt(el.style.left) || 0;

                if (e.key === "ArrowUp") el.style.top = (top - amount) + "px";
                if (e.key === "ArrowDown") el.style.top = (top + amount) + "px";
                if (e.key === "ArrowLeft") el.style.left = (left - amount) + "px";
                if (e.key === "ArrowRight") el.style.left = (left + amount) + "px";
            }

            if (moveOrigin.parent) {
                moveEl(selected, moveOrigin.parent);
            }

            if (moveChildren && moveOrigin.children) {
                moveOrigin.children.forEach(childOrigin => {
                    moveEl(childOrigin.element, childOrigin);
                });
            }

            updateCSSOut && updateCSSOut();
            e.preventDefault();
        }

        if (moveMode && e.key === "Escape") {
            moveMode = false;
            moveOrigin = {
                parent: null,
                children: []
            };
            root.querySelector("#atemp-title")
                .textContent = "CSS Editor";
            root.style.border = "";
            root.querySelector("#atemp-footer")
                .textContent = "Shift+Hover to select • Shift+Scroll to cycle • Export to copy";
            e.preventDefault();
        }
    });

    renderTab("panel");
})();
