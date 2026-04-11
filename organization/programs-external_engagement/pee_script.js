// ─────────────────────────────────────────────────────────────────────────────
//  Programs & External Engagement – pee_script.js
//  Structure mirrors ot_script.js data for dept id=2 (Programs & Engagement).
//  Rendering follows oa_script.js: static always-visible chart, tooltip on
//  hover, slide-in detail panel on click. No expand/collapse toggles.
// ─────────────────────────────────────────────────────────────────────────────

const STRUCTURE = [
  // ── Cluster 1: Programs & Community ────────────────────────────────────────
  {
    id: "pgm",
    label: "Programs &\nCommunity",
    tag: "Programs & Community",
    color: "#993C1D",
    light: "#FAECE7",
    dark:  "#712B13",
    desc: "Designs, implements, and monitors community-based programs covering livelihood, education, and health services to directly uplift the communities ANGAT serves.", holder: {name: "Sub-Department", since: "est. 2026"},
    keyRoles: [
      {
        id: "pgm_dir",
        label: "Programs\nDirector",
        tag: "Programs & Community",
        color: "#993C1D", light: "#FAECE7", dark: "#712B13",
        desc: "The Programs Director is responsible for the planning, development, and implementation of organizational programs. This role ensures that initiatives are effectively designed to meet community and organizational objectives.",
        holder: {name: "Adrienne Alexey Aguirre", since: "2026"}
      }
    ],
    subRoles: [
      {
        id: "livelihood_coord",
        label: "Livelihood Program\nCoordinator",
        tag: "Programs & Community",
        color: "#993C1D", light: "#FAECE7", dark: "#712B13",
        desc: "Plans and manages livelihood programs that provide community members with skills training, micro-enterprise support, and economic opportunities to achieve sustainable livelihoods.",
        holder: null
      },
      {
        id: "edu_coord",
        label: "Education Program\nCoordinator",
        tag: "Programs & Community",
        color: "#993C1D", light: "#FAECE7", dark: "#712B13",
        desc: "Develops and oversees educational initiatives including scholarships, tutorial programs, and school partnerships that improve access to quality education for underserved youth.",
        holder: null
      },
      {
        id: "health_coord",
        label: "Health & Social\nServices Coordinator",
        tag: "Programs & Community",
        color: "#993C1D", light: "#FAECE7", dark: "#712B13",
        desc: "Coordinates health outreach, medical missions, psychosocial support, and social welfare referrals to address the health and well-being needs of beneficiary communities.",
        holder: null
      },
      {
        id: "field_off",
        label: "Field\nOfficers",
        tag: "Programs & Community",
        color: "#993C1D", light: "#FAECE7", dark: "#712B13",
        desc: "Conduct on-the-ground community engagement, beneficiary registration, program facilitation, and feedback collection to ensure programs reach and benefit intended recipients.",
        holder: null
      }
    ]
  },

  // ── Cluster 2: Communications & Advocacy ───────────────────────────────────
  {
    id: "comms",
    label: "Communications\n& Advocacy",
    tag: "Communications & Advocacy",
    color: "#7A2E12",
    light: "#F5E4DE",
    dark:  "#551F0C",
    desc: "Shapes ANGAT's public presence, amplifies its mission through strategic communications, digital media, and advocacy campaigns that mobilise supporters and influence policy.", holder: {name: "Sub-Department", since: "est. 2026"},
    keyRoles: [
      {
        id: "comms_dir",
        label: "Communications\nDirector",
        tag: "Communications & Advocacy",
        color: "#7A2E12", light: "#F5E4DE", dark: "#551F0C",
        desc: "The Communications Director manages internal and external communication strategies, including public relations and information dissemination. This role ensures clear, consistent, and effective communication across all stakeholders.",
        holder: {name: "Byron Leonard Alar", since: "2026"}
      }
    ],
    subRoles: [
      {
        id: "socmed_mgr",
        label: "Social Media\nManager",
        tag: "Communications & Advocacy",
        color: "#7A2E12", light: "#F5E4DE", dark: "#551F0C",
        desc: "Manages ANGAT's social media channels, develops content calendars, monitors engagement metrics, and builds an online community of supporters around the organisation's programs and values.",
        holder: null
      },
      {
        id: "content_writer",
        label: "Content Writer /\nGraphic Designer",
        tag: "Communications & Advocacy",
        color: "#7A2E12", light: "#F5E4DE", dark: "#551F0C",
        desc: "Produces written and visual content including articles, infographics, reports, and campaign materials that communicate ANGAT's stories, impact, and calls to action.",
        holder: null
      },
      {
        id: "pr_off",
        label: "Public Relations\nOfficer",
        tag: "Communications & Advocacy",
        color: "#7A2E12", light: "#F5E4DE", dark: "#551F0C",
        desc: "Cultivates relationships with media, government bodies, and community leaders; handles press releases and public statements; and manages ANGAT's reputation with external stakeholders.",
        holder: null
      },
      {
        id: "advocacy_off",
        label: "Advocacy Campaign\nOfficer",
        tag: "Communications & Advocacy",
        color: "#7A2E12", light: "#F5E4DE", dark: "#551F0C",
        desc: "Designs and implements advocacy campaigns that raise awareness of social issues, mobilise community action, and engage policymakers to create systemic change aligned with ANGAT's mission.",
        holder: null
      }
    ]
  },

  // ── Cluster 3: Partnerships & Resources ────────────────────────────────────
  {
    id: "partner",
    label: "Partnerships &\nResources",
    tag: "Partnerships & Resources",
    color: "#5C2310",
    light: "#EFD9D2",
    dark:  "#3D160A",
    desc: "Secures the financial and institutional resources ANGAT needs to sustain and scale its programs through fundraising, grant writing, sponsorships, and corporate partnerships.", holder: {name: "Sub-Department", since: "est. 2026"},
    keyRoles: [
      {
        id: "partner_dir",
        label: "Partnerships\nDirector",
        tag: "Partnerships & Resources",
        color: "#5C2310", light: "#EFD9D2", dark: "#3D160A",
        desc: "The Partnerships Director is responsible for establishing and maintaining relationships with external partners, stakeholders, and donors. This role focuses on resource mobilization and strengthening institutional collaborations.",
        holder: {name: "Lyca Joyce Amido", since: "2026"}
      }
    ],
    subRoles: [
      {
        id: "fundraising_off",
        label: "Fundraising\nOfficer",
        tag: "Partnerships & Resources",
        color: "#5C2310", light: "#EFD9D2", dark: "#3D160A",
        desc: "Plans and executes fundraising campaigns, donor acquisition strategies, and crowdfunding initiatives to diversify and grow ANGAT's individual and institutional donor base.",
        holder: null
      },
      {
        id: "sponsor_coord",
        label: "Sponsorship\nCoordinator",
        tag: "Partnerships & Resources",
        color: "#5C2310", light: "#EFD9D2", dark: "#3D160A",
        desc: "Manages relationships with event and program sponsors, prepares sponsorship proposals and fulfillment reports, and ensures sponsor recognition is delivered according to agreed terms.",
        holder: null
      },
      {
        id: "grant_writer",
        label: "Grant\nWriter",
        tag: "Partnerships & Resources",
        color: "#5C2310", light: "#EFD9D2", dark: "#3D160A",
        desc: "Researches funding opportunities, prepares compelling grant proposals, manages grant timelines and reporting requirements, and maintains relationships with institutional funders.",
        holder: null
      },
      {
        id: "corp_partner_off",
        label: "Corporate Partnerships\nOfficer",
        tag: "Partnerships & Resources",
        color: "#5C2310", light: "#EFD9D2", dark: "#3D160A",
        desc: "Develops and manages corporate social responsibility partnerships, negotiates agreements with business sponsors, and coordinates employee volunteering and in-kind donation programs.",
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
const svg = document.getElementById("pee-chart");
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
const tooltip = document.getElementById("pee-tooltip");

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

    panel.style.setProperty("--panel-color", node.color || "#993C1D");
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

    // Pre-compute each cluster's width
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

    // Assign x positions to each cluster
    let curX = CANVAS_PAD;
    clusters.forEach(cl => {
        cl.startX = curX;
        cl.cx     = curX + cl.clusterW / 2;
        curX     += cl.clusterW + SECTION_GAP;
    });

    // Spine: vertical drop from top, then horizontal bar connecting all section boxes
    const spineCx    = svgW / 2;
    const secMidY    = TIER0_Y + SEC_H / 2;
    const leftSecCx  = clusters[0].cx;
    const rightSecCx = clusters[clusters.length - 1].cx;

    vLine(spineCx, 0, secMidY, "#993C1D", "0.4");
    hLine(leftSecCx, rightSecCx, secMidY, "#993C1D", "0.4");
    // Lighter dashed bar between section centres (purely decorative)
    hLine(leftSecCx + SEC_W / 2, rightSecCx - SEC_W / 2,
          secMidY, "#c96040", "0.5", "5 4");

    clusters.forEach(({ sec, kTotalW, sTotalW, sCount, clusterW, cx }) => {

        // ── Tier 0: section header box ──────────────────────────────────────
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
        const kStartX = cx - kTotalW / 2;
        const keyBoxes = sec.keyRoles.map((role, i) => ({
            x:  kStartX + i * (KEY_W + KEY_G),
            y:  TIER1_Y,
            cx: kStartX + i * (KEY_W + KEY_G) + KEY_W / 2,
            role
        }));

        // Connectors: section → key bridge → key boxes
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

            // Key bottoms drop to bridge2Y
            kMidXs.forEach(mx => vLine(mx, kBottomY, bridge2Y, sec.color, "0.4", "4 3"));
            if (kMidXs.length > 1)
                hLine(Math.min(...kMidXs), Math.max(...kMidXs), bridge2Y, sec.color, "0.4", "4 3");

            // Bridge at bridge2Y spanning sub roles
            if (subMidXs.length > 1)
                hLine(Math.min(...subMidXs), Math.max(...subMidXs), bridge2Y, sec.color, "0.4", "4 3");

            // Horizontal connector between the key cluster mid and the sub cluster mid if offset
            const keyCx      = (Math.min(...kMidXs) + Math.max(...kMidXs)) / 2;
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
                    fill: "#fdf3ee", stroke: sec.color, "stroke-width": "1"
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

    // ── Cross-cluster dashed connectors at key-role row ──────────────────────
    for (let i = 0; i < clusters.length - 1; i++) {
        const c0 = clusters[i], c1 = clusters[i + 1];
        const c0RightX = c0.cx + c0.kTotalW / 2;
        const c1LeftX  = c1.cx - c1.kTotalW / 2;
        hLine(c0RightX, c1LeftX, TIER1_Y + KEY_H / 2, "#c96040", "0.45", "5 4");
    }

    // ── Cross-cluster dashed connectors at sub-role row ──────────────────────
    const subClusters = clusters.filter(c => c.sCount > 0);
    for (let i = 0; i < subClusters.length - 1; i++) {
        const c0 = subClusters[i], c1 = subClusters[i + 1];
        const c0SubRight = c0.cx + c0.sTotalW / 2;
        const c1SubLeft  = c1.cx - c1.sTotalW / 2;
        hLine(c0SubRight, c1SubLeft, TIER2_Y + SUB_H / 2, "#c96040", "0.45", "5 4");
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