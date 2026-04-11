// ─────────────────────────────────────────────────────────────
//  Org-chart – all-open variant
//  All dept and sub boxes can be expanded simultaneously.
//  No auto-close behaviour on click.
// ─────────────────────────────────────────────────────────────

const D = [
  {
    id: 0, short: "Governance &\nExecutive", color: "#534AB7",
    light: "#EEEDFE", dark: "#3C3489",
    subs: [
      { name: "Board of\nDirectors",   keys: ["Chairperson","Vice Chairperson","Secretary","Treasurer"], roles: ["Board Members"] },
      { name: "Executive\nLeadership", keys: ["Executive Director","Deputy Executive Director"],         roles: ["Executive Assistant"] }
    ]
  },
  {
    id: 1, short: "Operations &\nAdministration", color: "#0F6E56",
    light: "#E1F5EE", dark: "#085041",
    subs: [
      { name: "Operations\nDept", keys: ["Operations Director"], roles: ["Administrative Officer","Human Resources Officer","Logistics Officer","Volunteer Coordinator"] },
      { name: "Finance &\nAdmin",  keys: ["Finance Director"],   roles: ["Accountant","Budget Analyst","Cashier / Disbursement Officer","Audit and Compliance Officer"] }
    ]
  },
  {
    id: 2, short: "Programs &\nEngagement", color: "#993C1D",
    light: "#FAECE7", dark: "#712B13",
    subs: [
      { name: "Programs &\nCommunity",      keys: ["Programs Director"],      roles: ["Livelihood Program Coordinator","Education Program Coordinator","Health & Social Services Coord.","Field Officers"] },
      { name: "Communications\n& Advocacy", keys: ["Communications Director"], roles: ["Social Media Manager","Content Writer / Graphic Designer","Public Relations Officer","Advocacy Campaign Officer"] },
      { name: "Partnerships &\nResources",  keys: ["Partnerships Director"],   roles: ["Fundraising Officer","Sponsorship Coordinator","Grant Writer","Corporate Partnerships Officer"] }
    ]
  },
  {
    id: 3, short: "Research &\nSupport", color: "#185FA5",
    light: "#E6F1FB", dark: "#0C447C",
    subs: [
      { name: "Monitoring,\nEval & Research", keys: ["M&E Director"],  roles: ["Data Analyst","Field Researcher","Impact Assessment Officer","Reporting Specialist"] },
      { name: "Legal &\nCompliance",          keys: ["Legal Officer"],  roles: ["Policy Advisor"] },
      { name: "IT & Digital\nSystems",        keys: ["IT Officer"],     roles: ["Database Manager","Systems Administrator"] }
    ]
  }
];

// ── constants ──────────────────────────────────────────────────
const BW=138, BH=68, BG=24;
const SW=145, SH=60, SG=16;
const PAD=30, ROW_GAP=44;
const t0y = PAD;
const t1y = t0y + BH + ROW_GAP;
const t2y = t1y + SH + ROW_GAP;

// Tree-mode
const KW=155, KH=34, KG=12;
const RW=155, RH=32, RG=12;
const t3y_tree = t2y + KH + ROW_GAP - 10;

// List-mode
const LKW=160, LKH=34;
const LRW=150, LRH=28, LRG=6;
const LIST_INDENT=20;
const LIST_KEY_GAP=14;
const LIST_COL_W = LKW + LIST_INDENT + 12;
const LIST_COL_GAP = 20;

// ── state ──────────────────────────────────────────────────────
const openDepts = new Set();
const openSubs  = new Set();
let   rafId     = null;

const svg = document.getElementById("org-chart");
const NS  = "http://www.w3.org/2000/svg";

// ── SVG helpers ────────────────────────────────────────────────
function mkEl(tag, attrs) {
  const e = document.createElementNS(NS, tag);
  applyAttrs(e, attrs);
  return e;
}
function applyAttrs(e, attrs) {
  for (const k in attrs) e.setAttribute(k, attrs[k]);
}

// ── layout mode decision ───────────────────────────────────────
function subMode(sub) {
  if (sub.keys.length === 1) return 'list';
  if (sub.roles.length <= sub.keys.length) return 'list';
  return 'tree';
}

// ── layout (pure computation, zero DOM) ───────────────────────
function computeLayout() {
  const INTER_SUB_GAP = 14;
  const INTER_DEPT_GAP = 40; // extra breathing room between dept columns

  // ── Tier 0: dept boxes — positions derived after sub layout ──
  const deptMeta = D.map((d, i) => ({ d, nomCx: i * (BW + BG) + BW / 2 }));

  // ── Tier 1: sub-box clusters (ALL open depts) ────────────────
  const clusterFor = new Map();
  for (const { d, nomCx } of deptMeta) {
    if (!openDepts.has(d.id)) continue;
    const clusterW = d.subs.length * SW + (d.subs.length - 1) * SG;
    const startX   = nomCx - clusterW / 2;
    const boxes    = d.subs.map((s, i) => ({
      x: startX + i * (SW + SG), y: t1y, w: SW, h: SH,
      sub: s, deptId: d.id, subIdx: i, dept: d
    }));
    clusterFor.set(d.id, { boxes });
  }

  // Global sweep: push sub clusters apart so nothing overlaps
  const openDeptsSorted = [...openDepts].sort((a, b) => a - b);
  let prevRX = -Infinity;
  for (const did of openDeptsSorted) {
    const cl = clusterFor.get(did);
    if (!cl) continue;
    const lx = cl.boxes[0].x;
    const needed = prevRX + INTER_SUB_GAP;
    if (lx < needed) { const d = needed - lx; cl.boxes.forEach(b => b.x += d); }
    prevRX = cl.boxes[cl.boxes.length - 1].x + SW;
  }

  const subBoxes = [];
  for (const did of openDeptsSorted) {
    const cl = clusterFor.get(did);
    if (cl) subBoxes.push(...cl.boxes);
  }

  // ── Tier 0 (revised): re-centre dept boxes over their subs ───
  const deptBoxes = deptMeta.map(({ d, nomCx }) => {
    let cx = nomCx;
    if (openDepts.has(d.id)) {
      const cl = clusterFor.get(d.id);
      if (cl) {
        const lx = cl.boxes[0].x;
        const rx = cl.boxes[cl.boxes.length - 1].x + SW;
        cx = (lx + rx) / 2;
      }
    }
    return { x: cx - BW / 2, y: t0y, w: BW, h: BH, d };
  });
  // Sweep closed dept boxes right if needed
  for (let i = 1; i < deptBoxes.length; i++) {
    const prev = deptBoxes[i - 1], cur = deptBoxes[i];
    const needed = prev.x + prev.w + BG;
    if (cur.x < needed) cur.x = needed;
  }

  // ── Tiers 2+3: per-sub, mode-aware ───────────────────────────
  const treeItems = new Map();
  const listItems = new Map();

  for (const sb of subBoxes) {
    const subKey = `${sb.deptId}-${sb.subIdx}`;
    if (!openSubs.has(subKey)) continue;
    const subCx = sb.x + SW / 2;
    const mode  = subMode(sb.sub);

    if (mode === 'tree') {
      const { keys, roles } = sb.sub;
      const kTotalW = keys.length  * KW + (keys.length  - 1) * KG;
      const rTotalW = roles.length * RW + (roles.length - 1) * RG;
      const totalW  = Math.max(kTotalW, rTotalW);

      const kStartX = subCx - kTotalW / 2;
      const rStartX = subCx - rTotalW / 2;

      const keyBoxes  = keys.map((label, i) => ({
        x: kStartX + i * (KW + KG), y: t2y, w: KW, h: KH,
        label, deptId: sb.deptId, subIdx: sb.subIdx, dept: sb.dept, mode: 'tree'
      }));
      const roleBoxes = roles.map((label, i) => ({
        x: rStartX + i * (RW + RG), y: t3y_tree, w: RW, h: RH,
        label, deptId: sb.deptId, subIdx: sb.subIdx, mode: 'tree'
      }));
      treeItems.set(subKey, { keyBoxes, roleBoxes, totalW, subCx,
        deptId: sb.deptId, subIdx: sb.subIdx, dept: sb.dept });

    } else {
      const { keys, roles } = sb.sub;
      const numCols = keys.length;

      const rolesByKey = Array.from({ length: numCols }, () => []);
      const sharedRoles = [];
      if (roles.length <= 1 || roles.length < numCols) {
        roles.forEach(r => sharedRoles.push(r));
      } else {
        roles.forEach((r, i) => rolesByKey[i % numCols].push(r));
      }

      const colH = rolesByKey.map(rs =>
        LKH + (rs.length > 0 ? (LRG + rs.length * (LRH + LRG)) : 0)
      );
      const maxColH = Math.max(...colH);

      const totalW  = numCols * LIST_COL_W + (numCols - 1) * LIST_COL_GAP;
      const startX  = subCx - totalW / 2;

      const groups = keys.map((label, i) => {
        const colX   = startX + i * (LIST_COL_W + LIST_COL_GAP);
        const keyBox = {
          x: colX, y: t2y, w: LKW, h: LKH,
          label, deptId: sb.deptId, subIdx: sb.subIdx, dept: sb.dept, mode: 'list'
        };
        const roleRects = rolesByKey[i].map((rl, j) => ({
          x: colX + LIST_INDENT, y: t2y + LKH + LRG + j * (LRH + LRG),
          w: LRW, h: LRH,
          label: rl, deptId: sb.deptId, subIdx: sb.subIdx, mode: 'list'
        }));
        return { keyBox, roleRects };
      });

      // x=0 placeholder; recomputed in flushRender after sweep+shift
      const sharedRoleRects = sharedRoles.map((rl, j) => ({
        x: 0,
        y: t2y + LKH + LRG + j * (LRH + LRG),
        w: LRW, h: LRH,
        label: rl, deptId: sb.deptId, subIdx: sb.subIdx, mode: 'list', shared: true
      }));

      listItems.set(subKey, { groups, sharedRoleRects, totalW, maxColH, subCx,
        deptId: sb.deptId, subIdx: sb.subIdx, dept: sb.dept });
    }
  }

  // ── Global horizontal sweep for tier-2+ clusters ─────────────
  const tier2Clusters = subBoxes
    .map(sb => {
      const subKey = `${sb.deptId}-${sb.subIdx}`;
      const tree = treeItems.get(subKey);
      const list = listItems.get(subKey);
      if (!tree && !list) return null;
      const subCx  = sb.x + SW / 2;
      const totalW = tree ? tree.totalW : list.totalW;
      return { subKey, lx: subCx - totalW / 2, rx: subCx + totalW / 2, tree, list,
               deptId: sb.deptId };
    })
    .filter(Boolean)
    .sort((a, b) => a.lx - b.lx);

  let prevTierRX  = -Infinity;
  let prevTierDept = null;
  for (const cl of tier2Clusters) {
    // Use a larger gap when crossing dept boundaries to prevent visual merging
    const gap = (prevTierDept !== null && prevTierDept !== cl.deptId)
      ? INTER_DEPT_GAP
      : 14;
    const needed = prevTierRX + gap;
    if (cl.lx < needed) {
      const delta = needed - cl.lx;
      if (cl.tree) {
        cl.tree.keyBoxes.forEach(b  => b.x += delta);
        cl.tree.roleBoxes.forEach(b => b.x += delta);
        cl.tree.subCx += delta;
      }
      if (cl.list) {
        cl.list.groups.forEach(g => {
          g.keyBox.x += delta;
          g.roleRects.forEach(r => r.x += delta);
        });
        cl.list.subCx += delta;
      }
      cl.lx += delta; cl.rx += delta;
    }
    prevTierRX   = cl.rx;
    prevTierDept = cl.deptId;
  }

  // ── Flatten for rendering + find canvas bounds ────────────────
  const allKeyBoxes  = [];
  const allRoleBoxes = [];
  for (const { tree, list } of tier2Clusters) {
    if (tree) { allKeyBoxes.push(...tree.keyBoxes); allRoleBoxes.push(...tree.roleBoxes); }
    if (list) {
      list.groups.forEach(g => {
        allKeyBoxes.push(g.keyBox);
        allRoleBoxes.push(...g.roleRects);
      });
      if (list.sharedRoleRects) {
        list.sharedRoleRects.forEach(r => {
          if (r.y + r.h > 0) allRoleBoxes.push({ x: 0, y: r.y, w: 0, h: r.h });
        });
      }
    }
  }

  // Canvas height
  let maxY = t1y + SH;
  for (const b of allKeyBoxes)  if (b.y + b.h > maxY) maxY = b.y + b.h;
  for (const b of allRoleBoxes) if (b.y + b.h > maxY) maxY = b.y + b.h;

  // ── Global centering ─────────────────────────────────────────
  const allBoxes = [...deptBoxes, ...subBoxes, ...allKeyBoxes, ...allRoleBoxes];
  let minX = Infinity, maxX = -Infinity;
  for (const b of allBoxes) {
    if (b.x       < minX) minX = b.x;
    if (b.x + b.w > maxX) maxX = b.x + b.w;
  }
  const contentW   = maxX - minX;
  const minCanvasW = D.length * BW + (D.length - 1) * BG + PAD * 2;
  const finalW     = Math.max(contentW + PAD * 2, minCanvasW, 700);
  const shift      = (finalW - contentW) / 2 - minX;
  for (const b of allBoxes) b.x += shift;
  for (const { tree, list } of tier2Clusters) {
    if (tree) tree.subCx += shift;
    if (list) list.subCx += shift;
  }

  return {
    deptBoxes, subBoxes,
    treeItems, listItems,
    allKeyBoxes, allRoleBoxes,
    tier2Clusters,
    finalW, svgH: maxY + PAD * 2
  };
}

// ── element pools ──────────────────────────────────────────────
const connLayer = mkEl("g", {});
const boxLayer  = mkEl("g", {});
svg.appendChild(connLayer);
svg.appendChild(boxLayer);

const lines = [];
let   lineHead = 0;

function acquireLine(attrs) {
  let ln;
  if (lineHead < lines.length) {
    ln = lines[lineHead];
    ln.removeAttribute("display");
  } else {
    ln = mkEl("line", {});
    connLayer.appendChild(ln);
    lines.push(ln);
  }
  lineHead++;
  applyAttrs(ln, attrs);
}

function releaseUnusedLines() {
  for (let i = lineHead; i < lines.length; i++)
    lines[i].setAttribute("display", "none");
  lineHead = 0;
}

const groupPool = new Map();

function acquireGroup(id, onFirstCreate) {
  if (!groupPool.has(id)) {
    const g    = mkEl("g", {});
    const rect = mkEl("rect", {});
    g.appendChild(rect);
    const entry = { g, rect, textNodes: [] };
    groupPool.set(id, entry);
    boxLayer.appendChild(g);
    if (onFirstCreate) onFirstCreate(g);
  }
  const entry = groupPool.get(id);
  entry.g.removeAttribute("display");
  return entry;
}

function hideStaleGroups(usedIds) {
  for (const [id, { g }] of groupPool)
    if (!usedIds.has(id)) g.setAttribute("display", "none");
}

function syncTexts(entry, defs) {
  const nodes = entry.textNodes;
  while (nodes.length < defs.length) {
    const t = mkEl("text", { "font-family": "Arial,sans-serif", "text-anchor": "middle" });
    entry.g.appendChild(t);
    nodes.push(t);
  }
  defs.forEach((d, i) => {
    const t = nodes[i];
    t.removeAttribute("display");
    applyAttrs(t, {
      x: d.x, y: d.y, "font-size": d.sz, "font-weight": d.w,
      fill: d.fill, "text-anchor": d.anchor || "middle"
    });
    t.textContent = d.s;
  });
  for (let i = defs.length; i < nodes.length; i++)
    nodes[i].setAttribute("display", "none");
}

function multilineDefs(cx, cy, lines, sz, w, fill) {
  const lh = 15;
  let y = cy - (lines.length * lh) / 2 + lh * 0.82;
  return lines.map(s => { const d = { x: cx, y, s, sz, w, fill }; y += lh; return d; });
}

// ── connector helpers ──────────────────────────────────────────
function hBridge(boxes, topY, color) {
  const midXs = boxes.map(b => b.x + b.w / 2);
  for (const mx of midXs)
    acquireLine({ x1: mx, y1: boxes[0].y, x2: mx, y2: topY, stroke: color, "stroke-width": "1.5" });
  if (boxes.length > 1)
    acquireLine({ x1: Math.min(...midXs), y1: topY, x2: Math.max(...midXs), y2: topY, stroke: color, "stroke-width": "1.5" });
}

// ── scheduled render ──────────────────────────────────────────
function scheduleRender() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    flushRender();
  });
}

function flushRender() {
  const { deptBoxes, subBoxes, treeItems, listItems, finalW, svgH } = computeLayout();

  applyAttrs(svg, { viewBox: `0 0 ${finalW} ${svgH}`, width: finalW, height: svgH });
  svg.style.width    = finalW + "px";
  svg.style.minWidth = finalW + "px";

  lineHead = 0;

  // ── connectors ────────────────────────────────────────────────

  // Dashed bar between dept boxes
  const dMidY = t0y + BH / 2;
  for (let i = 0; i < deptBoxes.length - 1; i++) {
    const a = deptBoxes[i], b = deptBoxes[i + 1];
    acquireLine({ x1: a.x + BW, y1: dMidY, x2: b.x, y2: dMidY,
      stroke: "#bbb", "stroke-width": "1.5", "stroke-dasharray": "4 3" });
  }

  // Index subs by dept
  const subsByDept = new Map();
  for (const sb of subBoxes) {
    if (!subsByDept.has(sb.deptId)) subsByDept.set(sb.deptId, []);
    subsByDept.get(sb.deptId).push(sb);
  }

  // Dept → subs
  for (const { x: dx, w: dw, d } of deptBoxes) {
    if (!openDepts.has(d.id)) continue;
    const mySubs = subsByDept.get(d.id) || [];
    if (!mySubs.length) continue;
    const dCx = dx + dw / 2, bridgeY = t1y - 14;
    acquireLine({ x1: dCx, y1: t0y + BH, x2: dCx, y2: bridgeY,
      stroke: d.color + "99", "stroke-width": "1.5" });
    hBridge(mySubs, bridgeY, d.color + "99");
  }

  // Dashed bar across sub clusters of different open depts
  if (openDepts.size > 1 && subBoxes.length > 1) {
    const lineY = t1y + SH / 2;
    const reps = [...openDepts].sort((a, b) => a - b).map(did => {
      const sbs = subsByDept.get(did);
      if (!sbs || !sbs.length) return null;
      return { lx: Math.min(...sbs.map(s => s.x)), rx: Math.max(...sbs.map(s => s.x + s.w)) };
    }).filter(Boolean);
    for (let i = 0; i < reps.length - 1; i++)
      acquireLine({ x1: reps[i].rx, y1: lineY, x2: reps[i + 1].lx, y2: lineY,
        stroke: "#bbb", "stroke-width": "1.5", "stroke-dasharray": "4 3" });
  }

  // Sub → tier-2 connectors
  for (const sb of subBoxes) {
    const subKey = `${sb.deptId}-${sb.subIdx}`;
    const tree = treeItems.get(subKey);
    const list = listItems.get(subKey);
    if (!tree && !list) continue;

    const sCx   = sb.x + SW / 2;
    const color = sb.dept.color;

    if (tree) {
      const bridgeY = t2y - 14;
      acquireLine({ x1: sCx, y1: t1y + SH, x2: sCx, y2: bridgeY,
        stroke: color + "99", "stroke-width": "1.5" });
      hBridge(tree.keyBoxes, bridgeY, color + "99");
      if (tree.roleBoxes.length) {
        const xs   = tree.keyBoxes.map(k => k.x + KW / 2);
        const kMid = (Math.min(...xs) + Math.max(...xs)) / 2;
        const rBridgeY = t3y_tree - 12;
        acquireLine({ x1: kMid, y1: t2y + KH, x2: kMid, y2: rBridgeY,
          stroke: color + "66", "stroke-width": "1.5" });
        hBridge(tree.roleBoxes, rBridgeY, color + "66");
      }
    } else {
      const bridgeY = t2y - 14;
      const keyCxs  = list.groups.map(g => g.keyBox.x + LKW / 2);
      const keyMid  = (Math.min(...keyCxs) + Math.max(...keyCxs)) / 2;

      acquireLine({ x1: sCx, y1: t1y + SH, x2: sCx, y2: bridgeY,
        stroke: color + "99", "stroke-width": "1.5" });
      if (Math.abs(keyMid - sCx) > 1)
        acquireLine({ x1: sCx, y1: bridgeY, x2: keyMid, y2: bridgeY,
          stroke: color + "99", "stroke-width": "1.5" });
      if (keyCxs.length > 1)
        acquireLine({ x1: Math.min(...keyCxs), y1: bridgeY,
          x2: Math.max(...keyCxs),             y2: bridgeY,
          stroke: color + "99", "stroke-width": "1.5" });
      keyCxs.forEach(cx =>
        acquireLine({ x1: cx, y1: bridgeY, x2: cx, y2: t2y,
          stroke: color + "99", "stroke-width": "1.5" })
      );

      list.groups.forEach(g => {
        if (!g.roleRects.length) return;
        const kCx = g.keyBox.x + LKW / 2;
        const lastRoleY = g.roleRects[g.roleRects.length - 1].y + LRH / 2;
        acquireLine({ x1: kCx, y1: t2y + LKH, x2: kCx, y2: lastRoleY,
          stroke: color + "66", "stroke-width": "1.2", "stroke-dasharray": "3 3" });
        g.roleRects.forEach(r => {
          const rCy = r.y + LRH / 2;
          acquireLine({ x1: kCx, y1: rCy, x2: r.x, y2: rCy,
            stroke: color + "66", "stroke-width": "1.2" });
        });
      });

      if (list.sharedRoleRects && list.sharedRoleRects.length) {
        const minKCx    = Math.min(...keyCxs);
        const maxKCx    = Math.max(...keyCxs);
        const midKCx    = (minKCx + maxKCx) / 2;
        const shBridgeY = t2y + LKH + 8;

        list.sharedRoleRects.forEach(r => { r.x = midKCx - r.w / 2; });

        keyCxs.forEach(cx =>
          acquireLine({ x1: cx, y1: t2y + LKH, x2: cx, y2: shBridgeY,
            stroke: color + "66", "stroke-width": "1.2", "stroke-dasharray": "3 3" })
        );
        if (keyCxs.length > 1)
          acquireLine({ x1: minKCx, y1: shBridgeY, x2: maxKCx, y2: shBridgeY,
            stroke: color + "66", "stroke-width": "1.2", "stroke-dasharray": "3 3" });
        list.sharedRoleRects.forEach(r => {
          const rCy = r.y + r.h / 2;
          acquireLine({ x1: midKCx, y1: shBridgeY, x2: midKCx, y2: rCy,
            stroke: color + "66", "stroke-width": "1.2", "stroke-dasharray": "3 3" });
          acquireLine({ x1: midKCx, y1: rCy, x2: r.x + r.w / 2, y2: rCy,
            stroke: color + "66", "stroke-width": "1.2" });
        });
      }
    }   // closes else (list mode)
  }     // closes for (const sb of subBoxes)

  releaseUnusedLines();

  // ── boxes ─────────────────────────────────────────────────────
  const usedIds = new Set();

  // Dept boxes
  for (const { x, y, w, h, d } of deptBoxes) {
    const id = `dept-${d.id}`, isOpen = openDepts.has(d.id);
    usedIds.add(id);
    const entry = acquireGroup(id, g => {
      g.style.cursor = "pointer";
      g.addEventListener("click", () => {
        // Toggle dept; if closing, also close all its subs
        if (openDepts.has(d.id)) {
          openDepts.delete(d.id);
          d.subs.forEach((_, i) => openSubs.delete(`${d.id}-${i}`));
        } else {
          openDepts.add(d.id);
        }
        scheduleRender();
      });
    });
    applyAttrs(entry.rect, { x, y, width: w, height: h, rx: "10",
      fill: d.color, stroke: d.color,
      "stroke-width": isOpen ? "3" : "1", opacity: isOpen ? "1" : "0.85" });
    syncTexts(entry, [
      ...multilineDefs(x + w / 2, y + h / 2 - 4, d.short.split("\n"), "12", "600", "#fff"),
      { x: x + w / 2, y: y + h - 9, s: isOpen ? "▲" : "▼", sz: "9", w: "400",
        fill: "rgba(255,255,255,0.65)" }
    ]);
  }

  // Sub boxes
  for (const { x, y, w, h, sub, deptId, subIdx, dept } of subBoxes) {
    const key = `${deptId}-${subIdx}`, id = `sub-${key}`;
    const isOpen = openSubs.has(key);
    usedIds.add(id);
    const entry = acquireGroup(id, g => {
      g.style.cursor = "pointer";
      g.addEventListener("click", () => {
        // Simple toggle — no forced closing of other subs or depts
        if (openSubs.has(key)) {
          openSubs.delete(key);
        } else {
          openSubs.add(key);
        }
        scheduleRender();
      });
    });
    applyAttrs(entry.rect, { x, y, width: w, height: h, rx: "8",
      fill: isOpen ? dept.dark : dept.light, stroke: dept.color,
      "stroke-width": isOpen ? "2" : "1" });
    syncTexts(entry, [
      ...multilineDefs(x + w / 2, y + h / 2 - 4, sub.name.split("\n"), "11", "500",
        isOpen ? "#fff" : dept.dark),
      { x: x + w / 2, y: y + h - 8, s: isOpen ? "▲" : "▼", sz: "9", w: "400",
        fill: isOpen ? "a(255,255,255,0.6)" : dept.color + "aa" }
    ]);
  }

  // Tree-mode: key row + role row
  for (const [, item] of treeItems) {
    item.keyBoxes.forEach(({ x, y, w, h, label, dept, deptId, subIdx }, i) => {
      const id = `key-${deptId}-${subIdx}-t${i}`;
      usedIds.add(id);
      const entry = acquireGroup(id, g => { g.style.cursor = "default"; });
      applyAttrs(entry.rect, { x, y, width: w, height: h, rx: "6",
        fill: dept.light, stroke: dept.color, "stroke-width": "1", "stroke-dasharray": "none" });
      syncTexts(entry, [{ x: x+w/2, y: y+h/2+1, s: label, sz: "10.5", w: "500", fill: dept.dark }]);
    });
    item.roleBoxes.forEach(({ x, y, w, h, label, deptId, subIdx }, i) => {
      const id = `role-${deptId}-${subIdx}-t${i}`;
      usedIds.add(id);
      const entry = acquireGroup(id, g => { g.style.cursor = "default"; });
      applyAttrs(entry.rect, { x, y, width: w, height: h, rx: "6",
        fill: "#f8f8f8", stroke: "#aaa", "stroke-width": "1", "stroke-dasharray": "4 3" });
      syncTexts(entry, [{ x: x+w/2, y: y+h/2+1, s: label, sz: "10.5", w: "400", fill: "#555" }]);
    });
  }

  // List-mode: key header (dark) + indented role rows (light)
  for (const [, item] of listItems) {
    item.groups.forEach(({ keyBox, roleRects }, gi) => {
      const { x, y, w, h, label, dept, deptId, subIdx } = keyBox;
      const kid = `key-${deptId}-${subIdx}-l${gi}`;
      usedIds.add(kid);
      const ke = acquireGroup(kid, g => { g.style.cursor = "default"; });
      applyAttrs(ke.rect, { x, y, width: w, height: h, rx: "6",
        fill: dept.dark, stroke: dept.color, "stroke-width": "1.5", "stroke-dasharray": "none" });
      syncTexts(ke, [{ x: x+w/2, y: y+h/2+1, s: label, sz: "10.5", w: "600", fill: "#fff" }]);

      roleRects.forEach(({ x: rx, y: ry, w: rw, h: rh, label: rl, deptId: did, subIdx: si }, ri) => {
        const rid = `role-${did}-${si}-l${gi}-${ri}`;
        usedIds.add(rid);
        const re = acquireGroup(rid, g => { g.style.cursor = "default"; });
        applyAttrs(re.rect, { x: rx, y: ry, width: rw, height: rh, rx: "5",
          fill: item.dept.light, stroke: item.dept.color,
          "stroke-width": "1", "stroke-dasharray": "none" });
        syncTexts(re, [{ x: rx+rw/2, y: ry+rh/2+1, s: rl, sz: "10", w: "400", fill: item.dept.dark }]);
      });
    });

    // Shared role boxes
    if (item.sharedRoleRects) {
      item.sharedRoleRects.forEach(({ x: rx, y: ry, w: rw, h: rh, label: rl,
                                      deptId: did, subIdx: si }, ri) => {
        const rid = `role-${did}-${si}-shared-${ri}`;
        usedIds.add(rid);
        const re = acquireGroup(rid, g => { g.style.cursor = "default"; });
        applyAttrs(re.rect, { x: rx, y: ry, width: rw, height: rh, rx: "5",
          fill: item.dept.light, stroke: item.dept.color,
          "stroke-width": "1", "stroke-dasharray": "none" });
        syncTexts(re, [{ x: rx+rw/2, y: ry+rh/2+1, s: rl, sz: "10", w: "400",
          fill: item.dept.dark }]);
      });
    }
  }

  hideStaleGroups(usedIds);
}

// ── nav helpers ────────────────────────────────────────────────
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
});

// ── initial render ─────────────────────────────────────────────
scheduleRender();