const STRUCTURE = [
  {
    id: "ops",
    label: "Operations\nDepartment",
    tag: "Operations Department",
    color: "#0F6E56",
    light: "#E1F5EE",
    dark:  "#085041",
    desc: "Oversees the day-to-day operational functions of ANGAT, ensuring that administrative processes, human resources, logistics, and volunteer systems run smoothly and efficiently.",
    keyRoles: [
      {
        id: "ops_dir",
        label: "Operations\nDirector",
        tag: "Operations Department",
        color: "#0F6E56", light: "#E1F5EE", dark: "#085041",
        desc: "Leads and oversees all operational activities of ANGAT, ensures organizational systems are functioning effectively, and coordinates cross-departmental operations to support program delivery and administrative efficiency.",
        holder: null
      }
    ],
    subRoles: [
      {
        id: "admin_off",
        label: "Administrative\nOfficer",
        tag: "Operations Department",
        color: "#0F6E56", light: "#E1F5EE", dark: "#085041",
        desc: "Manages day-to-day administrative tasks including correspondence, documentation, scheduling, and office management to ensure the smooth running of organizational operations.",
        holder: null
      },
      {
        id: "hr_off",
        label: "Human Resources\nOfficer",
        tag: "Operations Department",
        color: "#0F6E56", light: "#E1F5EE", dark: "#085041",
        desc: "Handles recruitment, onboarding, staff welfare, performance management, and compliance with labor policies to maintain a motivated and well-supported team.",
        holder: null
      },
      {
        id: "log_off",
        label: "Logistics\nOfficer",
        tag: "Operations Department",
        color: "#0F6E56", light: "#E1F5EE", dark: "#085041",
        desc: "Coordinates procurement, inventory, transportation, and distribution of materials and equipment needed for programs and organizational operations.",
        holder: null
      },
      {
        id: "vol_coord",
        label: "Volunteer\nCoordinator",
        tag: "Operations Department",
        color: "#0F6E56", light: "#E1F5EE", dark: "#085041",
        desc: "Recruits, trains, schedules, and supports volunteers, ensuring their contributions are meaningful, recognized, and aligned with ANGAT's operational and program needs.",
        holder: null
      }
    ]
  },
  {
    id: "fin",
    label: "Finance &\nAdministration",
    tag: "Finance & Administration Department",
    color: "#085041",
    light: "#C8EDE3",
    dark:  "#04342C",
    desc: "Ensures the financial integrity, transparency, and sustainability of ANGAT through sound financial management, budgeting, accounting, and compliance.",
    keyRoles: [
      {
        id: "fin_dir",
        label: "Finance\nDirector",
        tag: "Finance & Administration Department",
        color: "#085041", light: "#C8EDE3", dark: "#04342C",
        desc: "Leads the financial planning, management, and reporting of ANGAT, ensures fiscal responsibility, and provides strategic financial guidance to the Executive Leadership and Board.",
        holder: null
      }
    ],
    subRoles: [
      {
        id: "accountant",
        label: "Accountant",
        tag: "Finance & Administration Department",
        color: "#085041", light: "#C8EDE3", dark: "#04342C",
        desc: "Maintains accurate financial records, prepares financial statements, manages bookkeeping, and ensures all transactions are recorded in compliance with accounting standards.",
        holder: null
      },
      {
        id: "budget_an",
        label: "Budget\nAnalyst",
        tag: "Finance & Administration Department",
        color: "#085041", light: "#C8EDE3", dark: "#04342C",
        desc: "Develops, monitors, and analyzes budgets for organizational programs and departments, providing financial insights and recommendations to support decision-making.",
        holder: null
      },
      {
        id: "cashier",
        label: "Cashier /\nDisbursement Officer",
        tag: "Finance & Administration Department",
        color: "#085041", light: "#C8EDE3", dark: "#04342C",
        desc: "Manages cash handling, processes disbursements and reimbursements, and maintains accurate records of all financial transactions in accordance with organizational policies.",
        holder: null
      },
      {
        id: "audit_off",
        label: "Audit &\nCompliance Officer",
        tag: "Finance & Administration Department",
        color: "#085041", light: "#C8EDE3", dark: "#04342C",
        desc: "Conducts internal audits, ensures compliance with financial regulations and donor requirements, and identifies risks to organizational financial integrity.",
        holder: null
      }
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
const SPINE_EXTRA  = 80;

const TIER0_Y = SPINE_EXTRA + 20;
const TIER1_Y = TIER0_Y + SEC_H  + ROW_GAP;
const TIER2_Y = TIER1_Y + KEY_H  + ROW_GAP;

// ── SVG SETUP ─────────────────────────────────────────────────────────────────
const svg = document.getElementById("oa-chart");
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
const tooltip = document.getElementById("oa-tooltip");

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
    panel.style.setProperty("--panel-color", node.color || "#0F6E56");
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
    svg.style.width    = "100%";
    svg.style.minWidth = svgW + "px";

    let curX = CANVAS_PAD;
    clusters.forEach(cl => {
        cl.startX = curX;
        cl.cx     = curX + cl.clusterW / 2;
        curX     += cl.clusterW + SECTION_GAP;
    });

    // Spine from top of SVG to section-box mid-height
    const spineCx  = svgW / 2;
    const secMidY  = TIER0_Y + SEC_H / 2;
    const leftSecCx  = clusters[0].cx;
    const rightSecCx = clusters[clusters.length - 1].cx;

    vLine(spineCx, 0, secMidY, "#1A9070", "0.5");
    hLine(leftSecCx, rightSecCx, secMidY, "#1A9070", "0.5");
    hLine(leftSecCx + SEC_W/2, rightSecCx - SEC_W/2, secMidY, "#2db88f", "0.6", "5 4");

    clusters.forEach(({ sec, kTotalW, sTotalW, sCount, clusterW, cx }) => {

        // Tier 0: section box
        const secX = cx - SEC_W / 2;
        const secG = mkEl("g", { class:"node-g", id:"ng-" + sec.id });
        secG.style.cursor = "pointer";
        secG.appendChild(mkEl("rect", {
            x:secX, y:TIER0_Y, width:SEC_W, height:SEC_H, rx:"10",
            fill:sec.color, stroke:sec.color, "stroke-width":"1"
        }));
        addMultilineText(secG, cx, TIER0_Y + SEC_H/2, sec.label, "12","600","#fff", 15);
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
            addMultilineText(g, bcx, y + KEY_H/2, role.label, "11","500", sec.dark, 14);
            boxLayer.appendChild(g);
            g.addEventListener("mouseenter", e => showTooltip(role.label.replace(/\n/," "), role.desc, e));
            g.addEventListener("mousemove",  e => moveTip(e));
            g.addEventListener("mouseleave", hideTip);
            g.addEventListener("click", e => { e.stopPropagation(); hideTip(); openPanel(role); });
        });

        // Tier 2: sub-roles (fan out horizontally)
        if (sec.subRoles && sec.subRoles.length > 0) {
            const bridge2Y = TIER2_Y - 14;
            const kBottomY = TIER1_Y + KEY_H;

            // Dashed drop lines from each key role down to bridge2Y
            kMidXs.forEach(mx => vLine(mx, kBottomY, bridge2Y, sec.color, "0.4","4 3"));
            if (kMidXs.length > 1)
                hLine(Math.min(...kMidXs), Math.max(...kMidXs), bridge2Y, sec.color, "0.4","4 3");

            // Sub-roles spread across cluster width
            const subCount  = sec.subRoles.length;
            const subTotalW = subCount * SUB_W + (subCount - 1) * KEY_G;
            const subStartX = cx - subTotalW / 2;

            // H-bridge spanning sub roles
            const subMidXs = sec.subRoles.map((_, i) => subStartX + i * (SUB_W + KEY_G) + SUB_W / 2);
            if (subMidXs.length > 1)
                hLine(Math.min(...subMidXs), Math.max(...subMidXs), bridge2Y, sec.color, "0.4","4 3");

            // Vertical: bridge2Y to each sub role top
            // Connect from the key role cluster mid down to the sub bridge
            const keyCx = (Math.min(...kMidXs) + Math.max(...kMidXs)) / 2;
            const subBridgeMid = (Math.min(...subMidXs) + Math.max(...subMidXs)) / 2;
            if (Math.abs(keyCx - subBridgeMid) > 2)
                hLine(Math.min(keyCx, subBridgeMid), Math.max(keyCx, subBridgeMid),
                    bridge2Y, sec.color, "0.4","4 3");

            sec.subRoles.forEach((role, i) => {
                const sx  = subStartX + i * (SUB_W + KEY_G);
                const scx = sx + SUB_W / 2;
                vLine(scx, bridge2Y, TIER2_Y, sec.color, "0.4","4 3");

                const g = mkEl("g", { class:"node-g", id:"ng-" + role.id });
                g.style.cursor = "pointer";
                const rect = mkEl("rect", {
                    x:sx, y:TIER2_Y, width:SUB_W, height:SUB_H, rx:"8",
                    fill:"#f0faf6", stroke:sec.color, "stroke-width":"1"
                });
                rect.setAttribute("stroke-dasharray","5 3");
                g.appendChild(rect);
                addMultilineText(g, scx, TIER2_Y + SUB_H/2, role.label, "10.5","400", sec.dark, 14);
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
        hLine(c0RightX, c1LeftX, TIER1_Y + KEY_H/2, "#2db88f","0.5","5 4");

        // Dashed connector between sub-role rows
        if (c0.sCount && c1.sCount) {
            const c0SubRight = c0.cx + c0.sTotalW / 2;
            const c1SubLeft  = c1.cx - c1.sTotalW / 2;
            hLine(c0SubRight, c1SubLeft, TIER2_Y + SUB_H/2, "#2db88f","0.5","5 4");
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