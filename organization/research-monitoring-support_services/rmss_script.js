// ─────────────────────────────────────────────────────────────────────────────
//  Research, Monitoring & Support Services – rmss_script.js
//  Structure mirrors ot_script.js data for dept id=3 (Research & Support).
//  Rendering follows oa_script.js / pee_script.js: static always-visible chart,
//  tooltip on hover, slide-in detail panel on click.
// ─────────────────────────────────────────────────────────────────────────────

const STRUCTURE = [
  // ── Cluster 1: Monitoring, Evaluation & Research ───────────────────────────
  {
    id: "mer",
    label: "Monitoring, Eval\n& Research",
    tag: "Monitoring, Evaluation & Research",
    color: "#185FA5",
    light: "#E6F1FB",
    dark:  "#0C447C",
    desc: "Tracks the effectiveness and impact of ANGAT's programs through systematic data collection, field research, and evidence-based evaluation to drive learning and continuous improvement.", holder: {name: "Sub-Department", since: "est. 2026"},
    keyRoles: [
      {
        id: "me_dir",
        label: "M&E\nDirector",
        tag: "Monitoring, Evaluation & Research",
        color: "#185FA5", light: "#E6F1FB", dark: "#0C447C",
        desc: "The Monitoring and Evaluation Director develops and implements systems for assessing program performance, outcomes, and impact. This role ensures continuous improvement through data-driven evaluation and reporting.",
        holder: null
      }
    ],
    subRoles: [
      {
        id: "data_analyst",
        label: "Data\nAnalyst",
        tag: "Monitoring, Evaluation & Research",
        color: "#185FA5", light: "#E6F1FB", dark: "#0C447C",
        desc: "Collects, cleans, and analyses program data from multiple sources to produce insights, visualisations, and performance dashboards that inform organisational decision-making.",
        holder: null
      },
      {
        id: "field_researcher",
        label: "Field\nResearcher",
        tag: "Monitoring, Evaluation & Research",
        color: "#185FA5", light: "#E6F1FB", dark: "#0C447C",
        desc: "Conducts on-the-ground data gathering through surveys, focus group discussions, and key informant interviews to capture community perspectives and verify program outcomes.",
        holder: null
      },
      {
        id: "impact_off",
        label: "Impact Assessment\nOfficer",
        tag: "Monitoring, Evaluation & Research",
        color: "#185FA5", light: "#E6F1FB", dark: "#0C447C",
        desc: "Designs and conducts baseline, midline, and endline assessments to measure the short- and long-term impact of ANGAT's interventions on target beneficiaries and communities.",
        holder: null
      },
      {
        id: "report_spec",
        label: "Reporting\nSpecialist",
        tag: "Monitoring, Evaluation & Research",
        color: "#185FA5", light: "#E6F1FB", dark: "#0C447C",
        desc: "Compiles and writes program reports, donor updates, and annual impact summaries, ensuring all documentation is accurate, timely, and aligned with funder and organisational reporting standards.",
        holder: null
      }
    ]
  },

  // ── Cluster 2: Legal & Compliance ──────────────────────────────────────────
  {
    id: "legal",
    label: "Legal &\nCompliance",
    tag: "Legal & Compliance",
    color: "#105088",
    light: "#D8EAF8",
    dark:  "#083660",
    desc: "Safeguards ANGAT's legal standing and regulatory compliance, providing expert guidance on organisational governance, contracts, policy, and risk management.", holder: {name: "Sub-Department", since: "est. 2026"},
    keyRoles: [
      {
        id: "legal_off",
        label: "Legal\nOfficer",
        tag: "Legal & Compliance",
        color: "#104880", light: "#D8EAF8", dark: "#083660",
        desc: "The Legal Officer ensures organizational compliance with applicable laws, regulations, and policies. This role manages legal documentation and supports risk mitigation and ethical governance.",
        holder: null
      }
    ],
    subRoles: [
      {
        id: "policy_adv",
        label: "Policy\nAdvisor",
        tag: "Legal & Compliance",
        color: "#104880", light: "#D8EAF8", dark: "#083660",
        desc: "Researches relevant legislation and sector policy developments, advises the Executive Leadership on regulatory implications, and supports the development of internal policies and advocacy positions.",
        holder: null
      }
    ]
  },

  // ── Cluster 3: IT & Digital Systems ────────────────────────────────────────
  {
    id: "it",
    label: "IT & Digital\nSystems",
    tag: "IT & Digital Systems",
    color: "#1368B0",
    light: "#DCF0FF",
    dark:  "#0A4A80",
    desc: "Maintains and develops the digital infrastructure that enables ANGAT's operations, program delivery, and data management through reliable systems, databases, and technical support.", holder: {name: "Sub-Department", since: "est. 2026"},
    keyRoles: [
      {
        id: "it_off",
        label: "IT\nOfficer",
        tag: "IT & Digital Systems",
        color: "#1368B0", light: "#DCF0FF", dark: "#0A4A80",
        desc: "The IT Officer manages the organization’s digital infrastructure, including hardware, software, and network systems. This role ensures the reliability, security, and efficiency of technological operations and provides technical support as needed.",
        holder: null
      }
    ],
    subRoles: [
      {
        id: "db_mgr",
        label: "Database\nManager",
        tag: "IT & Digital Systems",
        color: "#1368B0", light: "#DCF0FF", dark: "#0A4A80",
        desc: "Designs, maintains, and manages ANGAT's databases and beneficiary information systems, ensures data integrity and accessibility, and develops queries and reports for program and management use.",
        holder: null
      },
      {
        id: "sys_admin",
        label: "Systems\nAdministrator",
        tag: "IT & Digital Systems",
        color: "#1368B0", light: "#DCF0FF", dark: "#0A4A80",
        desc: "Administers servers, cloud services, user accounts, and network infrastructure; monitors system performance; applies security patches; and troubleshoots technical issues across the organisation.",
        holder: null
      }
    ]
  }
];

// ── LAYOUT CONSTANTS ──────────────────────────────────────────────────────────
const SEC_W        = 150, SEC_H  = 64;
const KEY_W        = 140, KEY_H  = 56, KEY_G = 18;
const SUB_W        = 152, SUB_H  = 56;
const ROW_GAP      = 44;
const SECTION_GAP  = 90;
const CANVAS_PAD   = 40;
const SPINE_EXTRA  = 80;

const TIER0_Y = SPINE_EXTRA + 20;
const TIER1_Y = TIER0_Y + SEC_H  + ROW_GAP;
const TIER2_Y = TIER1_Y + KEY_H  + ROW_GAP;

// ── SVG SETUP ─────────────────────────────────────────────────────────────────
const svg = document.getElementById("rmss-chart");
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
const tooltip = document.getElementById("rmss-tooltip");

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

    panel.style.setProperty("--panel-color", node.color || "#185FA5");
    document.getElementById("detail-tag").textContent   = node.tag   || "";
    document.getElementById("detail-title").textContent = node.label.replace(/\n/g, " ");
    document.getElementById("detail-desc").textContent  = node.desc  || "";

    const hw = document.getElementById("detail-holder-wrap");
    if (node.holder) {
        const initials = node.holder.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
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
    focusedId = null; focusedG = null;
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
    const ln = mkEl("line", { x1: x, y1, x2: x, y2, stroke: color, "stroke-width": "1.5", opacity });
    if (dash) ln.setAttribute("stroke-dasharray", dash);
    connLayer.appendChild(ln);
}
function hLine(x1, x2, y, color, opacity, dash) {
    const ln = mkEl("line", { x1, y1: y, x2, y2: y, stroke: color, "stroke-width": "1.5", opacity });
    if (dash) ln.setAttribute("stroke-dasharray", dash);
    connLayer.appendChild(ln);
}

// ── DRAW ──────────────────────────────────────────────────────────────────────
function draw() {
    while (connLayer.firstChild) connLayer.removeChild(connLayer.firstChild);
    while (boxLayer.firstChild)  boxLayer.removeChild(boxLayer.firstChild);

    const clusters = STRUCTURE.map(sec => {
        const kCount   = sec.keyRoles.length;
        const kTotalW  = kCount * KEY_W + (kCount - 1) * KEY_G;
        const sCount   = sec.subRoles ? sec.subRoles.length : 0;
        const sTotalW  = sCount * SUB_W + (sCount - 1) * KEY_G;
        const clusterW = Math.max(SEC_W, kTotalW, sTotalW);
        return { sec, kTotalW, sTotalW, sCount, clusterW };
    });

    const totalContentW = clusters.reduce((a, c) => a + c.clusterW, 0)
                        + (clusters.length - 1) * SECTION_GAP;
    const svgW = totalContentW + CANVAS_PAD * 2;

    const hasSubRoles = STRUCTURE.some(s => s.subRoles && s.subRoles.length > 0);
    const svgH = (hasSubRoles ? TIER2_Y + SUB_H : TIER1_Y + KEY_H) + CANVAS_PAD;

    svg.setAttribute("viewBox", `0 0 ${svgW} ${svgH}`);
    svg.setAttribute("width",    svgW);
    svg.setAttribute("height",   svgH);
    svg.style.width    = svgW + "px";
    svg.style.minWidth = svgW + "px";

    let curX = CANVAS_PAD;
    clusters.forEach(cl => {
        cl.startX = curX;
        cl.cx     = curX + cl.clusterW / 2;
        curX     += cl.clusterW + SECTION_GAP;
    });

    // Spine
    const spineCx    = svgW / 2;
    const secMidY    = TIER0_Y + SEC_H / 2;
    const leftSecCx  = clusters[0].cx;
    const rightSecCx = clusters[clusters.length - 1].cx;

    vLine(spineCx, 0, secMidY, "#185FA5", "0.4");
    hLine(leftSecCx, rightSecCx, secMidY, "#185FA5", "0.4");
    hLine(leftSecCx + SEC_W / 2, rightSecCx - SEC_W / 2,
          secMidY, "#3a8fd4", "0.5", "5 4");

    clusters.forEach(({ sec, kTotalW, sTotalW, sCount, clusterW, cx }) => {

        // ── Tier 0: section header ───────────────────────────────────────────
        const secX = cx - SEC_W / 2;
        const secG = mkEl("g", { class: "node-g", id: "ng-" + sec.id });
        secG.style.cursor = "pointer";
        secG.appendChild(mkEl("rect", {
            x: secX, y: TIER0_Y, width: SEC_W, height: SEC_H, rx: "10",
            fill: sec.color, stroke: sec.color, "stroke-width": "1"
        }));
        addMultilineText(secG, cx, TIER0_Y + SEC_H / 2, sec.label, "12", "600", "#fff", 15);
        boxLayer.appendChild(secG);
        secG.addEventListener("mouseenter", e => showTooltip(sec.label.replace(/\n/g, " "), sec.desc, e));
        secG.addEventListener("mousemove",  e => moveTip(e));
        secG.addEventListener("mouseleave", hideTip);
        secG.addEventListener("click", e => { e.stopPropagation(); hideTip(); openPanel(sec); });

        // ── Tier 1: key role boxes ───────────────────────────────────────────
        const kStartX  = cx - kTotalW / 2;
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

        keyBoxes.forEach(({ x, y, cx: bcx, role }) => {
            const g = mkEl("g", { class: "node-g", id: "ng-" + role.id });
            g.style.cursor = "pointer";
            g.appendChild(mkEl("rect", {
                x, y, width: KEY_W, height: KEY_H, rx: "8",
                fill: sec.light, stroke: sec.color, "stroke-width": "1"
            }));
            addMultilineText(g, bcx, y + KEY_H / 2, role.label, "11", "500", sec.dark, 14);
            boxLayer.appendChild(g);
            g.addEventListener("mouseenter", e => showTooltip(role.label.replace(/\n/g, " "), role.desc, e));
            g.addEventListener("mousemove",  e => moveTip(e));
            g.addEventListener("mouseleave", hideTip);
            g.addEventListener("click", e => { e.stopPropagation(); hideTip(); openPanel(role); });
        });

        // ── Tier 2: sub-role boxes ───────────────────────────────────────────
        if (sec.subRoles && sec.subRoles.length > 0) {
            const bridge2Y  = TIER2_Y - 14;
            const kBottomY  = TIER1_Y + KEY_H;
            const subCount  = sec.subRoles.length;
            const subTotalW = subCount * SUB_W + (subCount - 1) * KEY_G;
            const subStartX = cx - subTotalW / 2;
            const subMidXs  = sec.subRoles.map((_, i) => subStartX + i * (SUB_W + KEY_G) + SUB_W / 2);

            kMidXs.forEach(mx => vLine(mx, kBottomY, bridge2Y, sec.color, "0.4", "4 3"));
            if (kMidXs.length > 1)
                hLine(Math.min(...kMidXs), Math.max(...kMidXs), bridge2Y, sec.color, "0.4", "4 3");

            if (subMidXs.length > 1)
                hLine(Math.min(...subMidXs), Math.max(...subMidXs), bridge2Y, sec.color, "0.4", "4 3");

            const keyCx       = (Math.min(...kMidXs) + Math.max(...kMidXs)) / 2;
            const subBridgeMid = (Math.min(...subMidXs) + Math.max(...subMidXs)) / 2;
            if (Math.abs(keyCx - subBridgeMid) > 2)
                hLine(Math.min(keyCx, subBridgeMid), Math.max(keyCx, subBridgeMid),
                      bridge2Y, sec.color, "0.4", "4 3");

            sec.subRoles.forEach((role, i) => {
                const sx  = subStartX + i * (SUB_W + KEY_G);
                const scx = sx + SUB_W / 2;
                vLine(scx, bridge2Y, TIER2_Y, sec.color, "0.4", "4 3");

                const g    = mkEl("g", { class: "node-g", id: "ng-" + role.id });
                g.style.cursor = "pointer";
                const rect = mkEl("rect", {
                    x: sx, y: TIER2_Y, width: SUB_W, height: SUB_H, rx: "8",
                    fill: "#edf6ff", stroke: sec.color, "stroke-width": "1"
                });
                rect.setAttribute("stroke-dasharray", "5 3");
                g.appendChild(rect);
                addMultilineText(g, scx, TIER2_Y + SUB_H / 2, role.label, "10.5", "400", sec.dark, 14);
                boxLayer.appendChild(g);
                g.addEventListener("mouseenter", e => showTooltip(role.label.replace(/\n/g, " "), role.desc, e));
                g.addEventListener("mousemove",  e => moveTip(e));
                g.addEventListener("mouseleave", hideTip);
                g.addEventListener("click", e => { e.stopPropagation(); hideTip(); openPanel(role); });
            });
        }
    });

    // Cross-cluster dashed connectors — key-role row
    for (let i = 0; i < clusters.length - 1; i++) {
        const c0 = clusters[i], c1 = clusters[i + 1];
        hLine(c0.cx + c0.kTotalW / 2, c1.cx - c1.kTotalW / 2,
              TIER1_Y + KEY_H / 2, "#3a8fd4", "0.45", "5 4");
    }

    // Cross-cluster dashed connectors — sub-role row
    const subClusters = clusters.filter(c => c.sCount > 0);
    for (let i = 0; i < subClusters.length - 1; i++) {
        const c0 = subClusters[i], c1 = subClusters[i + 1];
        hLine(c0.cx + c0.sTotalW / 2, c1.cx - c1.sTotalW / 2,
              TIER2_Y + SUB_H / 2, "#3a8fd4", "0.45", "5 4");
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

draw();