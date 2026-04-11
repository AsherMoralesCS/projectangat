const STRUCTURE = [
  {
    id: "board",
    label: "Board of\nDirectors",
    tag: "Board of Directors",
    color: "#534AB7", light: "#EEEDFE", dark: "#3C3489",
    desc: "The Board provides strategic oversight, fiduciary responsibility, and organizational accountability for ANGAT's mission and programs.", holder: {name: "Sub-Department", since: "est. 2026"},
    keyRoles: [
      { id:"chair", label:"Chairperson",       tag:"Board of Directors", color:"#534AB7", light:"#EEEDFE", dark:"#3C3489", desc:"The Chairperson provides overall leadership to the governing body and ensures that all decisions and policies are aligned with the organization’s mission, vision, and objectives. This role is responsible for providing strategic direction and maintaining organizational coherence.", holder: { name: "Asher Morales", since: "2026" }},
      { id:"vice",  label:"Vice\nChairperson",  tag:"Board of Directors", color:"#534AB7", light:"#EEEDFE", dark:"#3C3489", desc:"The Vice Chairperson supports the Chairperson in the execution of leadership responsibilities and ensures continuity of governance. This role assists in decision-making and contributes to organizational stability and effectiveness.", holder:null },
      { id:"sec",   label:"Secretary",          tag:"Board of Directors", color:"#534AB7", light:"#EEEDFE", dark:"#3C3489", desc:"The Secretary is responsible for maintaining official records, documentation, and correspondence of the organization. This role ensures proper communication, accurate record-keeping, and administrative organization.", holder: { name: "Acel Lea Ardeño", since: "2026" } },
      { id:"treas", label:"Treasurer",          tag:"Board of Directors", color:"#534AB7", light:"#EEEDFE", dark:"#3C3489", desc:"The Treasurer is responsible for the management, monitoring, and reporting of the organization’s financial resources. This role ensures financial accountability, transparency, and proper allocation of funds.", holder: { name: "Marvie Lance Domingo", since: "2026" } }
    ],
    subRoles: [
      { id:"bm", label:"Board\nMembers", tag:"Board of Directors", color:"#534AB7", light:"#EEEDFE", dark:"#3C3489", desc:"Participate in Board deliberations and decision-making, provide diverse expertise and perspectives, and collectively uphold the organization's mission, values, and strategic direction.", holder:null }
    ]
  },
  {
    id: "exec",
    label: "Executive\nLeadership",
    tag: "Executive Leadership",
    color: "#3C3489", light: "#E8E6F8", dark: "#26215C",
    desc: "The Executive team leads day-to-day operations, implements Board decisions, and drives ANGAT's programs and partnerships forward.", holder: {name: "Sub-Department", since: "est. 2026"},
    keyRoles: [
      { id:"ed",  label:"Executive\nDirector",      tag:"Executive Leadership", color:"#3C3489", light:"#E8E6F8", dark:"#26215C", desc:"The Executive Director provides overall operational leadership and oversees the implementation of organizational strategies, programs, and initiatives. This role ensures that all departments function in alignment with the organization’s goals.", holder: { name: "Kath Leah Talbos", since: "2026"} },
      { id:"ded", label:"Deputy\nExec. Director",   tag:"Executive Leadership", color:"#3C3489", light:"#E8E6F8", dark:"#26215C", desc:"The Deputy Executive Director assists the Executive Director in overseeing daily operations and supports the implementation of organizational plans and policies. This role ensures continuity and operational efficiency.", holder:null }
    ],
    subRoles: [
      { id:"ea", label:"Executive\nAssistant", tag:"Executive Leadership", color:"#3C3489", light:"#E8E6F8", dark:"#26215C", desc:"Provides high-level administrative and logistical support to the Executive Director and Deputy, manages scheduling and communications, and ensures smooth day-to-day executive operations.", holder:null }
    ]
  }
];

// ── LAYOUT ────────────────────────────────────────────────────────────────────
const SEC_W  = 150, SEC_H  = 64;
const KEY_W  = 138, KEY_H  = 56, KEY_G = 18;
const SUB_W  = 150, SUB_H  = 56;
const ROW_GAP      = 44;
const SECTION_GAP  = 100;
const CANVAS_PAD   = 40;
const SPINE_EXTRA  = 80;   // extra space at top for the long spine line

// Tier Y positions — offset down by SPINE_EXTRA to make room for spine
const TIER0_Y = SPINE_EXTRA + 20;
const TIER1_Y = TIER0_Y + SEC_H  + ROW_GAP;
const TIER2_Y = TIER1_Y + KEY_H  + ROW_GAP;

// ── SVG SETUP ─────────────────────────────────────────────────────────────────
const svg = document.getElementById("gel-chart");
const NS  = "http://www.w3.org/2000/svg";

function mkEl(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
}

const connLayer = mkEl("g", {});
const boxLayer  = mkEl("g", {});
svg.appendChild(connLayer);
svg.appendChild(boxLayer);

// ── TOOLTIP ───────────────────────────────────────────────────────────────────
const tooltip = document.getElementById("gel-tooltip");

function showTooltip(title, desc, e) {
    const short = desc.split(/\.\s/)[0] + ".";
    tooltip.innerHTML = `<strong>${title}</strong>${short}`;
    tooltip.classList.add("visible");
    moveTip(e);
}
function hideTip() { tooltip.classList.remove("visible"); }
function moveTip(e) {
    const TW = tooltip.offsetWidth  || 260;
    const TH = tooltip.offsetHeight || 80;
    let x = e.clientX + 14, y = e.clientY + 14;
    if (x + TW > window.innerWidth  - 8) x = e.clientX - TW - 14;
    if (y + TH > window.innerHeight - 8) y = e.clientY - TH - 14;
    tooltip.style.left = x + "px";
    tooltip.style.top  = y + "px";
}

// ── DETAIL PANEL ──────────────────────────────────────────────────────────────
const panel     = document.getElementById("detail-panel");
const overlay   = document.getElementById("panel-overlay");
const chartWrap = document.querySelector(".chart-wrapper");
let focusedId = null, focusedG = null;

document.getElementById("detail-close").addEventListener("click", closePanel);
overlay.addEventListener("click", closePanel);

function openPanel(node) {
    if (focusedId === node.id) { closePanel(); return; }
    if (focusedG) focusedG.classList.remove("focused-vivid");

    focusedId = node.id;
    focusedG  = document.getElementById("ng-" + node.id);

    svg.classList.add("has-focus");
    if (focusedG) focusedG.classList.add("focused-vivid");

    panel.style.setProperty("--panel-color", node.color || "#534AB7");
    document.getElementById("detail-tag").textContent   = node.tag  || "";
    document.getElementById("detail-title").textContent = node.label.replace(/\n/g, " ");
    document.getElementById("detail-desc").textContent  = node.desc  || "";

    const hw = document.getElementById("detail-holder-wrap");
    if (node.holder) {
        const initials = node.holder.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
        hw.innerHTML = `
            <div class="detail-holder-label">Currently Held By</div>
            <div class="detail-holder-row">
                <div class="detail-avatar">${initials}</div>
                <div>
                    <div class="detail-holder-name">${node.holder.name}</div>
                    <div class="detail-holder-since">Since ${node.holder.since}</div>
                </div>
            </div>`;
    } else {
        hw.innerHTML = `
            <div class="detail-holder-label">Currently Held By</div>
            <p class="detail-vacant">Position not yet assigned</p>`;
    }

    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    chartWrap.classList.add("panel-open");
    overlay.classList.add("active");
}

function closePanel() {
    if (focusedG) focusedG.classList.remove("focused-vivid");
    svg.classList.remove("has-focus");
    focusedId = null;
    focusedG  = null;
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    chartWrap.classList.remove("panel-open");
    overlay.classList.remove("active");
}

// ── TEXT HELPER ───────────────────────────────────────────────────────────────
function addMultilineText(g, cx, cy, text, fontSize, fontWeight, fill, lineH) {
    const lines  = text.split("\n");
    const lh     = lineH || (parseInt(fontSize) + 4);
    const startY = cy - (lines.length - 1) * lh / 2;
    lines.forEach((line, i) => {
        const t = mkEl("text", {
            x: cx, y: startY + i * lh,
            "text-anchor": "middle",
            "dominant-baseline": "central",
            "font-family": "'DM Sans', Arial, sans-serif",
            "font-size": fontSize,
            "font-weight": fontWeight,
            fill
        });
        t.textContent = line;
        g.appendChild(t);
    });
}

// ── CONNECTOR HELPERS ─────────────────────────────────────────────────────────
function vLine(x, y1, y2, color, opacity, dash) {
    const ln = mkEl("line", { x1:x, y1, x2:x, y2, stroke:color, "stroke-width":"1.5", opacity });
    if (dash) ln.setAttribute("stroke-dasharray", dash);
    connLayer.appendChild(ln);
}
function hLine(x1, x2, y, color, opacity, dash) {
    const ln = mkEl("line", { x1, y1:y, x2, y2:y, stroke:color, "stroke-width":"1.5", opacity });
    if (dash) ln.setAttribute("stroke-dasharray", dash);
    connLayer.appendChild(ln);
}

// ── DRAW ──────────────────────────────────────────────────────────────────────
function draw() {
    while (connLayer.firstChild) connLayer.removeChild(connLayer.firstChild);
    while (boxLayer.firstChild)  boxLayer.removeChild(boxLayer.firstChild);

    // Compute cluster widths
    const clusters = STRUCTURE.map(sec => {
    const kCount   = sec.keyRoles.length;
    const kTotalW  = kCount * KEY_W + (kCount - 1) * KEY_G;

    const sCount   = sec.subRoles ? sec.subRoles.length : 0;
    const sTotalW  = sCount * SUB_W + (sCount - 1) * KEY_G;

    const clusterW = Math.max(SEC_W, kTotalW, sTotalW);

    return { sec, kTotalW, sTotalW, sCount, clusterW };
    });

    const totalContentW = clusters.reduce((a,c) => a + c.clusterW, 0)
                        + (clusters.length - 1) * SECTION_GAP;
    const svgW = totalContentW + CANVAS_PAD * 2;

    const hasSubRoles = STRUCTURE.some(s => s.subRoles && s.subRoles.length > 0);
    const svgH = (hasSubRoles ? TIER2_Y + SUB_H : TIER1_Y + KEY_H) + CANVAS_PAD;

    svg.setAttribute("viewBox", `0 0 ${svgW} ${svgH}`);
    svg.setAttribute("height", svgH);
    svg.style.width    = "100%";        // let CSS centre it, not a fixed px width
    svg.style.minWidth = svgW + "px";

    // Assign x positions
    let curX = CANVAS_PAD;
    clusters.forEach(cl => {
        cl.startX = curX;
        cl.cx     = curX + cl.clusterW / 2;
        curX     += cl.clusterW + SECTION_GAP;
    });

    // Centre of the whole chart — spine drops from here
    const spineCx   = svgW / 2;
    const secMidY   = TIER0_Y + SEC_H / 2;

    // Long spine from very top of SVG down to section-box mid height
    vLine(spineCx, 0, secMidY, "#999", "0.6");

    // Horizontal bar connecting the two section box centres
    const leftSecCx  = clusters[0].cx;
    const rightSecCx = clusters[clusters.length - 1].cx;
    hLine(leftSecCx, rightSecCx, secMidY, "#999", "0.6");

    // Dashed connector between the inner edges of the two section boxes
    hLine(leftSecCx + SEC_W / 2, rightSecCx - SEC_W / 2, secMidY, "#aaa", "0.8", "5 4");

    // Draw each cluster
    clusters.forEach(({ sec, kTotalW, clusterW, startX, cx }) => {

        // Tier 0: section box
        const secX = cx - SEC_W / 2;
        const secG = mkEl("g", { class:"node-g", id:"ng-" + sec.id });
        secG.style.cursor = "pointer";
        secG.appendChild(mkEl("rect", {
            x:secX, y:TIER0_Y, width:SEC_W, height:SEC_H, rx:"10",
            fill:sec.color, stroke:sec.color, "stroke-width":"1"
        }));
        addMultilineText(secG, cx, TIER0_Y + SEC_H / 2, sec.label, "12","600","#fff", 15);
        boxLayer.appendChild(secG);
        secG.addEventListener("mouseenter", e => showTooltip(sec.label.replace(/\n/," "), sec.desc, e));
        secG.addEventListener("mousemove",  e => moveTip(e));
        secG.addEventListener("mouseleave", hideTip);
        secG.addEventListener("click", e => { e.stopPropagation(); hideTip(); openPanel(sec); });

        // Tier 1: key role boxes
        const kStartX = cx - kTotalW / 2;
        const keyBoxes = sec.keyRoles.map((role, i) => ({
            x:  kStartX + i * (KEY_W + KEY_G),
            y:  TIER1_Y,
            cx: kStartX + i * (KEY_W + KEY_G) + KEY_W / 2,
            role
        }));

        const bridge1Y = TIER1_Y - 14;
        vLine(cx, TIER0_Y + SEC_H, bridge1Y, sec.color, "0.6");
        const kMidXs = keyBoxes.map(b => b.cx);
        if (kMidXs.length > 1)
            hLine(Math.min(...kMidXs), Math.max(...kMidXs), bridge1Y, sec.color, "0.6");
        kMidXs.forEach(mx => vLine(mx, bridge1Y, TIER1_Y, sec.color, "0.6"));

        keyBoxes.forEach(({ x, y, cx:bcx, role }) => {
            const g = mkEl("g", { class:"node-g", id:"ng-" + role.id });
            g.style.cursor = "pointer";
            g.appendChild(mkEl("rect", {
                x, y, width:KEY_W, height:KEY_H, rx:"8",
                fill:sec.light, stroke:sec.color, "stroke-width":"1"
            }));
            addMultilineText(g, bcx, y + KEY_H / 2, role.label, "11","500", sec.dark, 14);
            boxLayer.appendChild(g);
            g.addEventListener("mouseenter", e => showTooltip(role.label.replace(/\n/," "), role.desc, e));
            g.addEventListener("mousemove",  e => moveTip(e));
            g.addEventListener("mouseleave", hideTip);
            g.addEventListener("click", e => { e.stopPropagation(); hideTip(); openPanel(role); });
        });

        // Tier 2: sub-roles
        if (sec.subRoles && sec.subRoles.length > 0) {
            const bridge2Y = TIER2_Y - 14;
            const kBottomY = TIER1_Y + KEY_H;

            // Drop lines from key roles
            kMidXs.forEach(mx => vLine(mx, kBottomY, bridge2Y, sec.color, "0.4","4 3"));

            if (kMidXs.length > 1)
                hLine(Math.min(...kMidXs), Math.max(...kMidXs), bridge2Y, sec.color, "0.4","4 3");

            // Sub-role positioning
            const subCount  = sec.subRoles.length;
            const subTotalW = subCount * SUB_W + (subCount - 1) * KEY_G;
            const subStartX = cx - subTotalW / 2;

            const subMidXs = sec.subRoles.map((_, i) =>
                subStartX + i * (SUB_W + KEY_G) + SUB_W / 2
            );

            // Horizontal bridge across sub-roles
            if (subMidXs.length > 1)
                hLine(Math.min(...subMidXs), Math.max(...subMidXs), bridge2Y, sec.color, "0.4","4 3");

            // Align center of key roles and sub roles
            const keyCx = (Math.min(...kMidXs) + Math.max(...kMidXs)) / 2;
            const subBridgeMid = (Math.min(...subMidXs) + Math.max(...subMidXs)) / 2;

            if (Math.abs(keyCx - subBridgeMid) > 2)
                hLine(Math.min(keyCx, subBridgeMid), Math.max(keyCx, subBridgeMid),
                    bridge2Y, sec.color, "0.4","4 3");

            // Draw sub-role boxes
            sec.subRoles.forEach((role, i) => {
                const sx  = subStartX + i * (SUB_W + KEY_G);
                const scx = sx + SUB_W / 2;

                vLine(scx, bridge2Y, TIER2_Y, sec.color, "0.4","4 3");

                const g = mkEl("g", { class:"node-g", id:"ng-" + role.id });
                g.style.cursor = "pointer";

                const rect = mkEl("rect", {
                    x:sx, y:TIER2_Y, width:SUB_W, height:SUB_H, rx:"8",
                    fill:"#f8f8f8", stroke:"#aaa", "stroke-width":"1"
                });
                rect.setAttribute("stroke-dasharray","5 3");

                g.appendChild(rect);
                addMultilineText(g, scx, TIER2_Y + SUB_H / 2, role.label, "11","400","#555", 14);

                boxLayer.appendChild(g);

                g.addEventListener("mouseenter", e => showTooltip(role.label.replace(/\n/," "), role.desc, e));
                g.addEventListener("mousemove",  e => moveTip(e));
                g.addEventListener("mouseleave", hideTip);
                g.addEventListener("click", e => { e.stopPropagation(); hideTip(); openPanel(role); });
            });
        }
    });

    // Dashed connector between key role rows of the two clusters
    if (clusters.length === 2) {
        const c0 = clusters[0], c1 = clusters[1];
        const c0RightX = c0.cx + c0.kTotalW / 2;
        const c1LeftX  = c1.cx - c1.kTotalW / 2;
        hLine(c0RightX, c1LeftX, TIER1_Y + KEY_H / 2, "#aaa","0.7","5 4");

        const hasBoth = STRUCTURE[0].subRoles?.length && STRUCTURE[1].subRoles?.length;
        if (hasBoth) {
            const c0SubRightX = c0.cx + c0.sTotalW / 2;
            const c1SubLeftX  = c1.cx - c1.sTotalW / 2;
            hLine(c0SubRightX, c1SubLeftX, TIER2_Y + SUB_H / 2, "#aaa","0.7","5 4");
        }
    }
}

// ── NAV HELPERS ───────────────────────────────────────────────────────────────
function toggleDropdown(id) {
    const d = document.getElementById(id), isOpen = d.classList.contains("show");
    document.querySelectorAll(".dropdown-contents").forEach(x => x.classList.remove("show"));
    if (!isOpen) d.classList.add("show");
}
function toggleMobileMenu() {
    document.getElementById("main-nav").classList.toggle("open");
    document.querySelector(".hamburger").classList.toggle("open");
}
function closeMobileMenu() {
    document.getElementById("main-nav").classList.remove("open");
    document.querySelector(".hamburger").classList.remove("open");
}
window.addEventListener("click", e => {
    if (!e.target.closest(".dropdown"))
        document.querySelectorAll(".dropdown-contents").forEach(d => d.classList.remove("show"));
    if (focusedId && !e.target.closest(".node-g") && !e.target.closest("#detail-panel"))
        closePanel();
});
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && focusedId) closePanel();
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) { e.preventDefault(); closeMobileMenu(); target.scrollIntoView({behavior:"smooth"}); }
    });
});

draw();