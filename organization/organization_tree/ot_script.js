const D=[
  {id:0,short:"Governance &\nExecutive",color:"#534AB7",light:"#EEEDFE",dark:"#3C3489",
   subs:[
    {name:"Board of\nDirectors",   keys:["Chairperson","Vice Chairperson","Secretary","Treasurer"], roles:["Board Members"]},
    {name:"Executive\nLeadership", keys:["Executive Director","Deputy Executive Director"],         roles:["Executive Assistant"]}
  ]},
  {id:1,short:"Operations &\nAdministration",color:"#0F6E56",light:"#E1F5EE",dark:"#085041",
   subs:[
    {name:"Operations\nDept",    keys:["Operations Director"], roles:["Administrative Officer","Human Resources Officer","Logistics Officer","Volunteer Coordinator"]},
    {name:"Finance &\nAdmin",    keys:["Finance Director"],    roles:["Accountant","Budget Analyst","Cashier / Disbursement Officer","Audit and Compliance Officer"]}
  ]},
  {id:2,short:"Programs &\nEngagement",color:"#993C1D",light:"#FAECE7",dark:"#712B13",
   subs:[
    {name:"Programs &\nCommunity",      keys:["Programs Director"],      roles:["Livelihood Program Coordinator","Education Program Coordinator","Health & Social Services Coordinator","Field Officers"]},
    {name:"Communications\n& Advocacy", keys:["Communications Director"],roles:["Social Media Manager","Content Writer / Graphic Designer","Public Relations Officer","Advocacy Campaign Officer"]},
    {name:"Partnerships &\nResources",  keys:["Partnerships Director"],  roles:["Fundraising Officer","Sponsorship Coordinator","Grant Writer","Corporate Partnerships Officer"]}
  ]},
  {id:3,short:"Research &\nSupport",color:"#185FA5",light:"#E6F1FB",dark:"#0C447C",
   subs:[
    {name:"Monitoring,\nEval & Research",keys:["M&E Director"],  roles:["Data Analyst","Field Researcher","Impact Assessment Officer","Reporting Specialist"]},
    {name:"Legal &\nCompliance",         keys:["Legal Officer"],  roles:["Policy Advisor"]},
    {name:"IT & Digital\nSystems",       keys:["IT Officer"],     roles:["Database Manager","Systems Administrator"]}
  ]}
];

const openDepts = new Set();
const openSubs  = new Set();
const svg = document.getElementById("org-chart");

const BW=138, BH=68, BG=24;
const SW=145, SH=60, SG=16;
const KW=155, KH=34, KG=12;
const RW=155, RH=32, RG=12;
const PAD=30, ROW_GAP=44;

function el(tag, attrs) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k,v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

function txt(p, x, y, s, sz, w, fill, anchor="middle") {
  const t = el("text", {x, y, "text-anchor": anchor,
    "font-family":"Arial,sans-serif", "font-size":sz, "font-weight":w, fill});
  t.textContent = s;
  p.appendChild(t);
}

function multiline(p, x, cy, lines, sz, w, fill) {
  const lh = 15, total = lines.length * lh;
  let sy = cy - total/2 + lh*0.82;
  lines.forEach(l => { txt(p, x, sy, l, sz, w, fill); sy += lh; });
}

function hbridge(g, boxes, topY, color) {
  boxes.forEach(b => {
    const cx = b.x + b.w/2;
    g.appendChild(el("line", {x1:cx, y1:b.y, x2:cx, y2:topY,
      stroke:color, "stroke-width":"1.5", fill:"none"}));
  });
  if (boxes.length > 1) {
    const xs = boxes.map(b => b.x + b.w/2);
    g.appendChild(el("line", {x1:Math.min(...xs), y1:topY,
      x2:Math.max(...xs), y2:topY, stroke:color, "stroke-width":"1.5"}));
  }
}

function resolveOverlaps(boxes, minGap) {
  // Sort by x, then push boxes apart until none overlap
  boxes.sort((a, b) => a.x - b.x);
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < boxes.length - 1; i++) {
      const a = boxes[i], b = boxes[i+1];
      const overlap = (a.x + a.w + minGap) - b.x;
      if (overlap > 0) {
        b.x += overlap / 2;
        a.x -= overlap / 2;
        changed = true;
      }
    }
  }
}

function render() {
  svg.innerHTML = "";

  // ── compute total canvas width first ──────────────────────────
  // We need to know how wide all sub/key/role clusters get when all open,
  // so we can set the viewBox correctly from the start.

  const BW_TOTAL = D.length * BW + (D.length-1) * BG;

  // Build sub positions relative to dept centers first
  // Dept centers are spaced BW+BG apart starting at offset 0
  const deptCenters = D.map((d,i) => i * (BW + BG) + BW/2);

  // For each open dept, compute cluster width
  const subClusters = D.map(d => {
    if (!openDepts.has(d.id)) return null;
    const cw = d.subs.length * SW + (d.subs.length-1) * SG;
    return { width: cw, dept: d };
  });

  // For each open sub, compute key/role cluster width
  // We need to figure out total canvas width to center everything
  // Strategy: compute the natural x of every box, find bounds, then shift all

  // Step 1: place dept boxes starting at x=0
  let rawDeptBoxes = D.map((d,i) => ({
    x: i * (BW + BG), y: PAD, w: BW, h: BH, d
  }));

  const t0y = PAD;
  const t1y = t0y + BH + ROW_GAP;
  const t2y = t1y + SH + ROW_GAP;
  const t3y = t2y + KH + ROW_GAP - 10;

  // Step 2: place sub boxes centered under their dept
  let rawSubBoxes = [];
  rawDeptBoxes.forEach(({x:dx, w:dw, d}) => {
    if (!openDepts.has(d.id)) return;
    const cw = d.subs.length * SW + (d.subs.length-1) * SG;
    const sx = dx + dw/2 - cw/2;
    d.subs.forEach((s,i) => {
      rawSubBoxes.push({
        x: sx + i*(SW+SG), y: t1y, w: SW, h: SH,
        sub: s, deptId: d.id, subIdx: i, dept: d
      });
    });
  });

  // Step 3: resolve sub-box overlaps
  if (rawSubBoxes.length > 1) resolveOverlaps(rawSubBoxes, 14);

  // Step 4: place key boxes centered under their sub
  let rawKeyBoxes = [];
  rawSubBoxes.forEach(sb => {
    const key = `${sb.deptId}-${sb.subIdx}`;
    if (!openSubs.has(key)) return;
    const nk = sb.sub.keys.length;
    const kw = nk*KW + (nk-1)*KG;
    const kx = sb.x + SW/2 - kw/2;
    sb.sub.keys.forEach((r,i) => {
      rawKeyBoxes.push({
        x: kx + i*(KW+KG), y: t2y, w: KW, h: KH,
        label: r, deptId: sb.deptId, subIdx: sb.subIdx, dept: sb.dept
      });
    });
  });

  if (rawKeyBoxes.length > 1) resolveOverlaps(rawKeyBoxes, 10);

  // Step 5: place role boxes centered under their sub
  let rawRoleBoxes = [];
  rawSubBoxes.forEach(sb => {
    const key = `${sb.deptId}-${sb.subIdx}`;
    if (!openSubs.has(key)) return;
    const nr = sb.sub.roles.length;
    const rw = nr*RW + (nr-1)*RG;
    const rx = sb.x + SW/2 - rw/2;
    sb.sub.roles.forEach((r,i) => {
      rawRoleBoxes.push({
        x: rx + i*(RW+RG), y: t3y, w: RW, h: RH,
        label: r, deptId: sb.deptId, subIdx: sb.subIdx
      });
    });
  });

  if (rawRoleBoxes.length > 1) resolveOverlaps(rawRoleBoxes, 10);

  // Step 6: find bounding box of ALL elements, shift everything to center
  const allRaw = [...rawDeptBoxes, ...rawSubBoxes, ...rawKeyBoxes, ...rawRoleBoxes];
  const rawMinX = Math.min(...allRaw.map(b => b.x));
  const rawMaxX = Math.max(...allRaw.map(b => b.x + b.w));
  const rawW = rawMaxX - rawMinX;

  // Final SVG width = max(natural content width, minimum) + padding
  const finalW = Math.max(rawW + PAD*2, BW_TOTAL + PAD*2, 700);

  // Shift to center: offset so content is centered in finalW
  const shift = (finalW - rawW) / 2 - rawMinX;

  const deptBoxes  = rawDeptBoxes.map(b => ({...b, x: b.x + shift}));
  const allSubBoxes = rawSubBoxes.map(b => ({...b, x: b.x + shift}));
  const allKeyBoxes = rawKeyBoxes.map(b => ({...b, x: b.x + shift}));
  const allRoleBoxes = rawRoleBoxes.map(b => ({...b, x: b.x + shift}));

  const lastY = allRoleBoxes.length ? t3y+RH :
                allKeyBoxes.length  ? t2y+KH :
                allSubBoxes.length  ? t1y+SH : t0y+BH;
  const svgH = lastY + PAD*2;

  svg.setAttribute("viewBox", `0 0 ${finalW} ${svgH}`);
  svg.setAttribute("height", svgH);
  svg.style.minWidth = finalW + "px";

  // ── connectors (drawn first, behind boxes) ────────────────────
  const connG = el("g", {});
  svg.appendChild(connG);

  // dashed bar connecting all 4 dept boxes
  const dMidY = t0y + BH/2;
  for (let i = 0; i < deptBoxes.length-1; i++) {
    const a = deptBoxes[i], b = deptBoxes[i+1];
    connG.appendChild(el("line", {
      x1: a.x+BW, y1: dMidY, x2: b.x, y2: dMidY,
      stroke:"#bbb", "stroke-width":"1.5", "stroke-dasharray":"4 3"
    }));
  }

  // dept → subs
  deptBoxes.forEach(({x:dx, w:dw, d}) => {
    if (!openDepts.has(d.id)) return;
    const mySubs = allSubBoxes.filter(s => s.deptId === d.id);
    if (!mySubs.length) return;
    const dCx = dx + dw/2;
    const bridgeY = Math.min(...mySubs.map(s => s.y)) - 14;
    connG.appendChild(el("line", {
      x1:dCx, y1:t0y+BH, x2:dCx, y2:bridgeY,
      stroke:d.color+"99", "stroke-width":"1.5"
    }));
    hbridge(connG, mySubs, bridgeY, d.color+"99");
  });

  // dashed bar connecting sub clusters of different open depts
  if (openDepts.size > 1 && allSubBoxes.length > 1) {
    const reps = [...openDepts].sort((a,b)=>a-b).map(did => {
      const sbs = allSubBoxes.filter(s => s.deptId === did);
      return sbs.length ? {
        lx: Math.min(...sbs.map(s=>s.x)),
        rx: Math.max(...sbs.map(s=>s.x+s.w))
      } : null;
    }).filter(Boolean);
    const lineY = t1y + SH/2;
    for (let i = 0; i < reps.length-1; i++) {
      connG.appendChild(el("line", {
        x1:reps[i].rx, y1:lineY, x2:reps[i+1].lx, y2:lineY,
        stroke:"#bbb", "stroke-width":"1.5", "stroke-dasharray":"4 3"
      }));
    }
  }

  // sub → key roles
  allSubBoxes.forEach(sb => {
    const key = `${sb.deptId}-${sb.subIdx}`;
    if (!openSubs.has(key)) return;
    const myKeys = allKeyBoxes.filter(k => k.deptId===sb.deptId && k.subIdx===sb.subIdx);
    if (!myKeys.length) return;
    const sCx = sb.x + SW/2;
    const bridgeY = t2y - 14;
    connG.appendChild(el("line", {
      x1:sCx, y1:t1y+SH, x2:sCx, y2:bridgeY,
      stroke:sb.dept.color+"99", "stroke-width":"1.5"
    }));
    hbridge(connG, myKeys, bridgeY, sb.dept.color+"99");
  });

  // dashed bar across all key clusters
  if (allKeyBoxes.length > 1) {
    const sorted = [...allKeyBoxes].sort((a,b) => a.x-b.x);
    const ky = t2y + KH/2;
    connG.appendChild(el("line", {
      x1:sorted[0].x+KW, y1:ky,
      x2:sorted[sorted.length-1].x, y2:ky,
      stroke:"#ccc", "stroke-width":"1", "stroke-dasharray":"3 4"
    }));
  }

  // key roles → sub-roles
  allSubBoxes.forEach(sb => {
    const key = `${sb.deptId}-${sb.subIdx}`;
    if (!openSubs.has(key)) return;
    const myKeys  = allKeyBoxes.filter(k => k.deptId===sb.deptId && k.subIdx===sb.subIdx);
    const myRoles = allRoleBoxes.filter(r => r.deptId===sb.deptId && r.subIdx===sb.subIdx);
    if (!myKeys.length || !myRoles.length) return;
    const kMid = (Math.min(...myKeys.map(k=>k.x+KW/2)) + Math.max(...myKeys.map(k=>k.x+KW/2))) / 2;
    const bridgeY = t3y - 12;
    connG.appendChild(el("line", {
      x1:kMid, y1:t2y+KH, x2:kMid, y2:bridgeY,
      stroke:sb.dept.color+"66", "stroke-width":"1.5"
    }));
    hbridge(connG, myRoles, bridgeY, sb.dept.color+"66");
  });

  // dashed bar across all role clusters
  if (allRoleBoxes.length > 1) {
    const sorted = [...allRoleBoxes].sort((a,b) => a.x-b.x);
    const ry = t3y + RH/2;
    connG.appendChild(el("line", {
      x1:sorted[0].x+RW, y1:ry,
      x2:sorted[sorted.length-1].x, y2:ry,
      stroke:"#ccc", "stroke-width":"1", "stroke-dasharray":"3 4"
    }));
  }

  // ── boxes ──────────────────────────────────────────────────────

  deptBoxes.forEach(({x,y,w,h,d}) => {
    const isOpen = openDepts.has(d.id);
    const g = el("g", {style:"cursor:pointer"});
    g.appendChild(el("rect", {x,y,width:w,height:h,rx:"10",
      fill:d.color, stroke:d.color,
      "stroke-width":isOpen?"3":"1", opacity:isOpen?"1":"0.85"}));
    multiline(g, x+w/2, y+h/2-4, d.short.split("\n"), "12","600","#fff");
    txt(g, x+w/2, y+h-9, isOpen?"▲":"▼", "9","400","rgba(255,255,255,0.65)");
    g.addEventListener("click", () => {
      openDepts.has(d.id) ? openDepts.delete(d.id) : openDepts.add(d.id);
      render();
    });
    svg.appendChild(g);
  });

  allSubBoxes.forEach(({x,y,w,h,sub,deptId,subIdx,dept}) => {
    const key = `${deptId}-${subIdx}`;
    const isOpen = openSubs.has(key);
    const g = el("g", {style:"cursor:pointer"});
    g.appendChild(el("rect", {x,y,width:w,height:h,rx:"8",
      fill:isOpen?dept.dark:dept.light, stroke:dept.color,
      "stroke-width":isOpen?"2":"1"}));
    multiline(g, x+w/2, y+h/2-4, sub.name.split("\n"), "11","500", isOpen?"#fff":dept.dark);
    txt(g, x+w/2, y+h-8, isOpen?"▲":"▼", "9","400",
      isOpen?"rgba(255,255,255,0.6)":dept.color+"aa");
    g.addEventListener("click", () => {
      openSubs.has(key) ? openSubs.delete(key) : openSubs.add(key);
      render();
    });
    svg.appendChild(g);
  });

  allKeyBoxes.forEach(({x,y,w,h,label,dept}) => {
    const g = el("g", {});
    g.appendChild(el("rect", {x,y,width:w,height:h,rx:"6",
      fill:dept.light, stroke:dept.color, "stroke-width":"1"}));
    txt(g, x+w/2, y+h/2+1, label, "10.5","500",dept.dark);
    svg.appendChild(g);
  });

  allRoleBoxes.forEach(({x,y,w,h,label}) => {
    const g = el("g", {});
    g.appendChild(el("rect", {x,y,width:w,height:h,rx:"6",
      fill:"#f8f8f8", stroke:"#aaa", "stroke-width":"1","stroke-dasharray":"4 3"}));
    txt(g, x+w/2, y+h/2+1, label, "10.5","400","#555");
    svg.appendChild(g);
  });
}

// Nav helpers
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

render();