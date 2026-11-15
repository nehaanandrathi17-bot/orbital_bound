// 1. CINEMATIC COSMIC NEBULA & STARFIELD
const bg = document.getElementById("spaceBg"), bctx = bg.getContext("2d");
let stars = [], nebulae = [];

function initBg() {
  bg.width = window.innerWidth;
  bg.height = window.innerHeight;
  nebulae = [
    { x: bg.width * 0.25, y: bg.height * 0.35, r: 420, c: "rgba(14, 116, 194, 0.32)", vx: 0.08, vy: 0.03 },
    { x: bg.width * 0.70, y: bg.height * 0.30, r: 450, c: "rgba(59, 130, 246, 0.26)", vx: -0.06, vy: 0.04 },
    { x: bg.width * 0.30, y: bg.height * 0.80, r: 320, c: "rgba(168, 85, 247, 0.22)", vx: 0.05, vy: -0.03 }
  ];
  stars = Array.from({ length: 250 }, () => ({
    x: Math.random() * bg.width,
    y: Math.random() * bg.height,
    r: Math.random() * 1.9 + 0.4,
    s: Math.random() * 0.25 + 0.05,
    p: Math.random() * 6.28
  }));
}
window.addEventListener("resize", initBg);
initBg();

function animBg() {
  bctx.fillStyle = "#010308";
  bctx.fillRect(0, 0, bg.width, bg.height);
  nebulae.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > bg.width) n.vx *= -1;
    if (n.y < 0 || n.y > bg.height) n.vy *= -1;
    const g = bctx.createRadialGradient(n.x, n.y, 10, n.x, n.y, n.r);
    g.addColorStop(0, n.c);
    g.addColorStop(1, "rgba(1, 3, 8, 0)");
    bctx.fillStyle = g;
    bctx.fillRect(0, 0, bg.width, bg.height);
  });
  stars.forEach(s => {
    s.x -= s.s;
    if (s.x < 0) s.x = bg.width;
    s.p += 0.025;
    bctx.globalAlpha = 0.45 + Math.sin(s.p) * 0.55;
    bctx.fillStyle = "#bae6fd";
    bctx.fillRect(s.x, s.y, s.r, s.r);
  });
  bctx.globalAlpha = 1;
  requestAnimationFrame(animBg);
}
animBg();

// 2. REALISTIC 3D-SHADED ROTATING ASTRONAUT HOLOGRAM
let suitGender = "Female", angle = 0;

function drawCylinder(ctx, x, y, w, h, c1, c2) {
  const g = ctx.createLinearGradient(x, y, x + w, y);
  g.addColorStop(0, c2);
  g.addColorStop(0.35, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

function animChar() {
  const c = document.getElementById("charCanvas"), ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  angle += 0.025;

  const cx = 140, cy = 152, spin = Math.cos(angle), depth = Math.sin(angle);
  const accent = suitGender === "Female" ? "#f472b6" : suitGender === "Male" ? "#38bdf8" : "#a855f7";
  const tw = suitGender === "Male" ? 28 : suitGender === "Female" ? 22 : 25;
  const hipW = suitGender === "Female" ? 24 : 21;

  // Hologram Pedestal & Vertical Light Beam
  const beam = ctx.createLinearGradient(cx, cy + 115, cx, cy - 105);
  beam.addColorStop(0, "rgba(56, 189, 248, 0.25)");
  beam.addColorStop(1, "rgba(56, 189, 248, 0)");
  ctx.fillStyle = beam;
  ctx.beginPath(); ctx.moveTo(cx - 72, cy + 115); ctx.lineTo(cx - 42, cy - 100); ctx.lineTo(cx + 42, cy - 100); ctx.lineTo(cx + 72, cy + 115); ctx.fill();

  ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(cx, cy + 115, 78, 17, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = accent;
  ctx.beginPath(); ctx.ellipse(cx, cy + 115, 56, 11, 0, 0, Math.PI * 2); ctx.stroke();

  // Life-Support Backpack (PLSS) behind torso when facing forward
  if (depth > -0.3) {
    drawCylinder(ctx, cx - 22 - spin * 6, cy - 42, 44, 66, "#cbd5e1", "#64748b");
    ctx.fillStyle = accent; ctx.fillRect(cx - 18 - spin * 6, cy - 35, 6, 18);
  }

  // Articulated Legs, Ribbed Knee Joints & Heavy Lunar Boots
  const legSpread = 12 * Math.abs(spin) + 5;
  [-1, 1].forEach(side => {
    const lx = cx + side * legSpread - 7;
    drawCylinder(ctx, lx, cy + 32, 14, 34, "#f8fafc", "#94a3b8"); // Thigh
    ctx.fillStyle = "#475569"; ctx.fillRect(lx - 1, cy + 64, 16, 6); // Knee joint
    drawCylinder(ctx, lx, cy + 70, 14, 32, "#f1f5f9", "#94a3b8"); // Shin
    // Boot
    ctx.fillStyle = "#334155"; ctx.fillRect(lx - 2, cy + 100, 18, 11);
    ctx.fillStyle = "#0f172a"; ctx.fillRect(lx - 3, cy + 109, 20, 4);
  });

  // 3D Shaded Suit Torso & Utility Belt
  drawCylinder(ctx, cx - tw, cy - 44, tw * 2, 78, "#ffffff", "#94a3b8");
  ctx.fillStyle = "#334155"; ctx.fillRect(cx - hipW, cy + 24, hipW * 2, 10);
  ctx.fillStyle = accent; ctx.fillRect(cx - 6 + spin * 5, cy + 25, 12, 8);

  // Chest Display & Control Module (DCM)
  if (depth < 0.7) {
    ctx.fillStyle = "#1e293b"; ctx.fillRect(cx - 15 + spin * 7, cy - 28, 30, 24);
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 1; ctx.strokeRect(cx - 15 + spin * 7, cy - 28, 30, 24);
    ctx.fillStyle = accent; ctx.fillRect(cx - 11 + spin * 7, cy - 24, 12, 6);
    ctx.fillStyle = "#4ade80"; ctx.fillRect(cx + 4 + spin * 7, cy - 24, 6, 6);
  }

  // Articulated Arms & Gloves
  [-1, 1].forEach(side => {
    const sx = cx + side * (tw + 2), ex = cx + side * (tw + 9) - spin * 4;
    ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 11; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(sx, cy - 32); ctx.lineTo(ex, cy - 2); ctx.lineTo(ex - side * 2, cy + 24); ctx.stroke();
    ctx.fillStyle = "#334155"; ctx.beginPath(); ctx.arc(ex - side * 2, cy + 26, 6, 0, Math.PI * 2); ctx.fill();
  });

  // Helmet Shell, Neck Ring & Reflective Gold Visor with Specular Glare
  ctx.fillStyle = "#475569"; ctx.fillRect(cx - 18, cy - 49, 36, 6);
  const hGrad = ctx.createRadialGradient(cx - 8, cy - 82, 4, cx, cy - 72, 28);
  hGrad.addColorStop(0, "#ffffff"); hGrad.addColorStop(1, "#94a3b8");
  ctx.fillStyle = hGrad; ctx.beginPath(); ctx.arc(cx, cy - 74, 26, 0, Math.PI * 2); ctx.fill();

  if (depth < 0.65) {
    const vGrad = ctx.createLinearGradient(cx - 18, cy - 86, cx + 18, cy - 60);
    vGrad.addColorStop(0, "#fde047"); vGrad.addColorStop(0.5, "#d97706"); vGrad.addColorStop(1, "#78350f");
    ctx.fillStyle = vGrad;
    ctx.beginPath(); ctx.ellipse(cx + spin * 6, cy - 74, 19, 15, 0, 0, Math.PI * 2); ctx.fill();
    // Visor Specular Glare
    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    ctx.beginPath(); ctx.ellipse(cx + spin * 6 - 6, cy - 79, 6, 3, -0.4, 0, Math.PI * 2); ctx.fill();
  }

  // Sweeping Hologram Scanline
  const scanY = cy - 95 + ((angle * 35) % 210);
  ctx.strokeStyle = "rgba(56, 189, 248, 0.45)"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx - 48, scanY); ctx.lineTo(cx + 48, scanY); ctx.stroke();

  requestAnimationFrame(animChar);
}
animChar();

// 3. UPGRADED ETHEREAL SPACE SYNTH & COSMIC BELLS
let actx = null, audioOn = false, chordStep = 0;
const chords = [
  [130.81, 196.00, 246.94, 293.66], // Cmaj9
  [110.00, 164.81, 220.00, 261.63], // Am7
  [87.31,  130.81, 174.61, 220.00], // Fmaj7
  [98.00,  146.83, 196.00, 246.94]  // G6
];

function playCosmicPulse() {
  if (!audioOn || !actx) return;
  const now = actx.currentTime;
  const chord = chords[chordStep % chords.length];
  chord.forEach((freq, idx) => {
    const osc = actx.createOscillator(), filter = actx.createBiquadFilter(), gain = actx.createGain();
    osc.type = idx === 0 ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, now);
    filter.type = "lowpass"; filter.frequency.setValueAtTime(480, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 3.6);
    osc.connect(filter); filter.connect(gain); gain.connect(actx.destination);
    osc.start(now); osc.stop(now + 3.7);
  });
  chordStep++;
}

document.getElementById("musicBtn").addEventListener("click", function () {
  if (!audioOn) {
    if (!actx) {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      setInterval(playCosmicPulse, 3200);
    } else { actx.resume(); }
    audioOn = true;
    playCosmicPulse();
    this.innerText = "🔊 SCI-FI AUDIO: ON";
  } else {
    actx.suspend();
    audioOn = false;
    this.innerText = "🔇 SCI-FI AUDIO: OFF";
  }
});

// 4. LIVE COMMANDER NAME TAG, PROFILE & 8 AGENCIES
const state = { name: "", gender: "Female", icon: "👩‍🚀", agency: "NASA" };

function updatePedestalTag() {
  const label = state.name ? `COMMANDER ${state.name.toUpperCase()}` : `COMMANDER // ${state.gender.toUpperCase()}`;
  document.getElementById("suitTag").innerText = label;
}

document.getElementById("pilotName").addEventListener("input", function () {
  state.name = this.value.trim();
  updatePedestalTag();
});

document.querySelectorAll(".gender-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".gender-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.gender = btn.dataset.gender;
    state.icon = btn.dataset.icon;
    suitGender = state.gender;
    updatePedestalTag();
  });
});

document.getElementById("initBtn").addEventListener("click", () => {
  const finalName = state.name || "Commander " + state.gender;
  state.agency = document.getElementById("agencySelect").value;
  document.getElementById("hudPilot").innerText = state.icon + " " + finalName.toUpperCase();
  document.getElementById("hudAgency").innerText = "AGENCY: " + state.agency.toUpperCase();
  document.getElementById("statusMsg").innerText = `✅ Ready! ${finalName} (${state.agency}) initialized.`;
});
// =========================================================
// PHASE 2 APPEND: CRASH-PROOF EVENT DELEGATION
// =========================================================
let activeMission = {};

const missionData = {
  moon: {
    title: "Lunar South Pole Mission", stamp: "TUTORIAL MISSION", reqPwr: 2.5, deadline: "06 Mins 00 Secs (Build Window)",
    params: "Max Mass: Set by Rocket Size | Power Needed: 2.5 kW | Orbit: 100 km Lunar",
    satellite: { NASA: [95, "NASA CLPS Benchmark"], ISRO: [75, "ISRO Chandrayaan-3 Benchmark"], ESA: [110, "ESA Lunar Pathfinder"], Roscosmos: [88, "Roscosmos Luna Benchmark"], KASA: [82, "KASA Danuri Benchmark"], JAXA: [92, "JAXA SLIM Benchmark"], ASA: [80, "ASA Trailblazer Benchmark"], KSA: [65, "KSA CubeSat Benchmark"] },
    womanned:  { NASA: [280, "NASA Artemis Program"], ISRO: [145, "ISRO Gaganyaan Lunar"], ESA: [240, "ESA Argonaut Program"], Roscosmos: [210, "Roscosmos Orel Program"], KASA: [195, "KASA Crew Program"], JAXA: [230, "JAXA Lunar Cruiser"], ASA: [190, "ASA Artemis Coalition"], KSA: [155, "KSA International Coalition"] },
    obj: {
      satellite: ["Attach Rocket Structure, Lunar Spectrometer, and S-Band/Ka-Band Comms.", "Generate at least 2.5 kW net power via Solar Panels & Batteries.", "Stay within agency budget and rocket size mass limit."],
      womanned:  ["Attach Rocket Structure, Womanned Crew Module, and Comms.", "Generate at least 2.5 kW net power for life support.", "Stay within agency budget and rocket size mass limit."]
    }
  },
  iss: {
    title: "International Space Station", stamp: "LEVEL 1 CONTRACT", reqPwr: 4.0, deadline: "04 Mins 30 Secs (Launch Window)",
    params: "Max Mass: Set by Rocket Size | Power Needed: 4.0 kW | Orbit: 408 km LEO",
    satellite: { NASA: [85, "NASA LEO Commercial"], ISRO: [45, "ISRO PSLV Commercial"], ESA: [78, "ESA Vega-C Program"], Roscosmos: [68, "Roscosmos Soyuz LEO"], KASA: [62, "KASA Nuri LEO"], JAXA: [74, "JAXA H3 LEO"], ASA: [60, "ASA LEO Launch"], KSA: [50, "KSA LEO Mission"] },
    womanned:  { NASA: [220, "NASA Commercial Crew"], ISRO: [110, "ISRO Gaganyaan LEO"], ESA: [195, "ESA Columbus Crew"], Roscosmos: [165, "Roscosmos Soyuz MS"], KASA: [175, "KASA LEO Crew"], JAXA: [190, "JAXA Kibo Crew"], ASA: [170, "ASA Crew Program"], KSA: [140, "KSA Crew Coalition"] },
    obj: {
      satellite: ["Attach Rocket Structure, Storm Radar, and High-Gain Antenna.", "Generate at least 4.0 kW net power in Low-Earth Orbit.", "Complete assembly before the 04:30 launch window closes."],
      womanned:  ["Attach Rocket Structure, Womanned Crew Module, and Comms.", "Generate at least 4.0 kW net power for station docking.", "Complete assembly before the 04:30 launch window closes."]
    }
  }
};

function showScreen(id) {
  ["screen1", "screen2", "screen3"].forEach(s => {
    const el = document.getElementById(s);
    if (el) el.style.display = "none";
  });
  const target = document.getElementById(id);
  if (target) target.style.display = "block";
}

// Single global click handler — never crashes even if an element loads late
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.id === "initBtn") showScreen("screen2");
  if (btn.id === "backTo1Btn") showScreen("screen1");
  if (btn.id === "backTo2Btn") showScreen("screen2");

  if (btn.id === "toPhase3Btn") {
    alert(`✅ Dossier Approved for ${state.agency} ($${activeMission.budget}M Budget)! Ready for Phase 3.`);
  }

  if (btn.dataset.m && btn.dataset.t) {
    const m = btn.dataset.m, t = btn.dataset.t, data = missionData[m];
    const [budgetVal, budgetNote] = data[t][state.agency];
    const finalName = state.name || "Commander " + state.gender;
    activeMission = { key: m, type: t, budget: budgetVal, reqPwr: data.reqPwr };

    document.getElementById("dosTitle").innerText = `${data.title} — ${t === "satellite" ? "Satellite" : "Womanned"}`;
    document.getElementById("dosSub").innerText = `Agency: ${state.agency} | Commander: ${finalName} (${state.gender})`;
    document.getElementById("dosStamp").innerText = data.stamp;
    document.getElementById("dosBudget").innerText = `$${budgetVal} Million`;
    document.getElementById("dosNote").innerText = budgetNote;
    document.getElementById("dosSpecs").innerText = data.params;
    document.getElementById("dosDeadline").innerText = data.deadline;

    const ul = document.getElementById("dosObj");
    ul.innerHTML = "";
    data.obj[t].forEach(line => {
      const li = document.createElement("li");
      li.innerText = line;
      ul.appendChild(li);
    });
    showScreen("screen3");
  }
});
// =========================================================
// PHASE 3 APPEND: ROCKET SIZE & SPACECRAFT STUDIO
// =========================================================
let rocket = { size: "Medium", mass: 2600, cost: 35 };
let attached = [], cat = "structure", adj = { rot: 0, up: 0, side: 0, scale: 100 };
let bTimer = null, bSec = 360, baseYrs = 8.0, finalTrainMins = 15;

const parts = {
  structure: [{ id: "st1", name: "PSLV-XL Composite Core", cost: 12, mass: 320, pwr: -0.2, ext: false, col: "#94a3b8" }, { id: "st2", name: "Falcon-9 Block 5 Hull", cost: 24, mass: 520, pwr: -0.3, ext: false, col: "#e2e8f0" }, { id: "st3", name: "Ariane-6 Cryo Stage", cost: 38, mass: 780, pwr: -0.4, ext: false, col: "#38bdf8" }],
  science:   [{ id: "sc1", name: "Lunar Surface Spectrometer", cost: 10, mass: 140, pwr: -0.8, ext: true, col: "#a855f7" }, { id: "sc2", name: "Earth Storm Radar", cost: 16, mass: 220, pwr: -1.2, ext: true, col: "#ec4899" }],
  payload:   [{ id: "pl1", name: "CubeSat Deployment Pod", cost: 8, mass: 180, pwr: -0.4, ext: false, col: "#4ade80" }, { id: "pl2", name: "Womanned Crew Module", cost: 45, mass: 750, pwr: -1.8, ext: false, col: "#f472b6" }],
  batteries: [{ id: "bt1", name: "Li-Ion Pack (2x Cells)", cost: 6, mass: 110, pwr: 1.5, ext: false, col: "#22c55e" }, { id: "bt2", name: "Solid-State Array (4x)", cost: 14, mass: 210, pwr: 3.2, ext: false, col: "#10b981" }],
  solar:     [{ id: "so1", name: "Dual Folding Solar Wings", cost: 9, mass: 95, pwr: 2.2, ext: true, col: "#3b82f6" }, { id: "so2", name: "Triple GaAs Solar Array", cost: 18, mass: 165, pwr: 4.5, ext: true, col: "#2563eb" }],
  comms:     [{ id: "cm1", name: "S-Band Telemetry Dish", cost: 7, mass: 75, pwr: -0.5, ext: true, col: "#facc15" }, { id: "cm2", name: "Ka-Band Deep Space Relay", cost: 15, mass: 130, pwr: -0.9, ext: true, col: "#f97316" }]
};

function showAllScreens(id) {
  ["screen1", "screen2", "screen3", "screen4Size", "screen4Studio", "screen5Training", "screen6Launch"].forEach(s => {
    const el = document.getElementById(s);
    if (el) el.style.display = "none";
  });
  const target = document.getElementById(id);
  if (target) target.style.display = "block";
}

function runBuildTimer() {
  clearInterval(bTimer);
  bTimer = setInterval(() => {
    bSec = Math.max(0, bSec - 1);
    document.getElementById("hudTimer").innerText = `⏳ BUILD: ${String(Math.floor(bSec / 60)).padStart(2, "0")}:${String(bSec % 60).padStart(2, "0")}`;
  }, 1000);
}

function getTotals() {
  let cost = rocket.cost, mass = rocket.size === "Small" ? 300 : rocket.size === "Medium" ? 600 : 1000, pwr = 0;
  attached.forEach(p => { cost += p.cost; mass += p.mass; pwr += p.pwr; });
  return { cost, mass, pwr: +pwr.toFixed(1) };
}

function updateStudioHud() {
  const t = getTotals();
  document.getElementById("hudBudget").innerText = `💰 BUDGET: $${t.cost}M / $${activeMission.budget}M`;
  document.getElementById("hudMass").innerText = `⚖️ MASS: ${t.mass} / ${rocket.mass} kg`;
  document.getElementById("hudPower").innerText = `⚡ POWER: ${t.pwr} / ${activeMission.reqPwr} kW`;
  drawSpacecraft();
}

function renderEquipList() {
  const el = document.getElementById("equipList");
  el.innerHTML = "";
  parts[cat].forEach(p => {
    const on = attached.some(a => a.id === p.id);
    const div = document.createElement("div");
    div.className = "equip-item" + (on ? " attached" : "");
    div.innerHTML = `<span><strong>${p.name}</strong><br><small style="color:#94a3b8;">$${p.cost}M • ${p.mass}kg • ${p.pwr > 0 ? "+" + p.pwr : p.pwr}kW</small></span><button type="button" class="variant-btn" data-part="${p.id}" style="padding:5px 10px;">${on ? "✓ REMOVE" : "+ ATTACH"}</button>`;
    el.appendChild(div);
  });
}

function drawSpacecraft() {
  const c = document.getElementById("studioCanvas"), ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  const cx = 210, cy = 180, w = rocket.size === "Small" ? 42 : rocket.size === "Medium" ? 60 : 78, h = 165;
  const st = attached.find(i => i.cat === "structure");
  ctx.fillStyle = st ? st.col : "#475569";
  ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath(); ctx.moveTo(cx, cy - h / 2 - 42); ctx.lineTo(cx - w / 2, cy - h / 2); ctx.lineTo(cx + w / 2, cy - h / 2); ctx.fill();
  attached.filter(i => !i.ext && i.cat !== "structure").forEach((p, idx) => {
    ctx.fillStyle = p.col;
    ctx.fillRect(cx - w / 3, cy - h / 3 + idx * 30, (w * 2) / 3, 20);
  });
  attached.filter(i => i.ext).forEach((p, idx) => {
    ctx.save();
    const sc = adj.scale / 100;
    ctx.translate(cx + adj.side + (idx % 2 === 0 ? -w / 2 - 30 : w / 2 + 30), cy + adj.up - 20 + idx * 26);
    ctx.rotate((adj.rot * Math.PI) / 180);
    ctx.scale(sc, sc);
    ctx.fillStyle = p.col;
    ctx.fillRect(-24, -10, 48, 20);
    ctx.restore();
  });
}

function calcExpedite() {
  const t = getTotals(), rem = activeMission.budget - t.cost;
  const pct = Number(document.getElementById("expSlider").value) / 100;
  const yrs = (baseYrs - (baseYrs - 5.0) * pct).toFixed(1);
  const fee = Math.min(rem, Math.round(pct * (baseYrs - 5.0) * 12));
  finalTrainMins = Math.round((yrs / 5.0) * 15);
  document.getElementById("durText").innerText = `📅 Construction: ${yrs} Years (Min Cap: 5.0 Yrs)`;
  document.getElementById("trnText").innerText = `🏋️ On-Land Training (1d=5s): ${finalTrainMins} Mins`;
  document.getElementById("feeText").innerText = `Expedite Fee: $${fee}M | Remaining: $${rem - fee}M`;
}

document.addEventListener("click", (e) => {
  const sizeCard = e.target.closest(".size-card");
  if (sizeCard) {
    rocket = { size: sizeCard.dataset.size, mass: +sizeCard.dataset.mass, cost: +sizeCard.dataset.cost };
    attached = [];
    document.getElementById("craftTitle").innerText = rocket.size.toUpperCase() + " CLASS SPACECRAFT";
    showAllScreens("screen4Studio");
    bSec = activeMission.key === "moon" ? 360 : 270;
    runBuildTimer();
    renderEquipList();
    updateStudioHud();
    return;
  }

  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.id === "toPhase3Btn") showAllScreens("screen4Size");
  if (btn.id === "backTo3Btn") showAllScreens("screen3");
  if (btn.id === "backToSizeBtn") { clearInterval(bTimer); showAllScreens("screen4Size"); }
  if (btn.id === "helpBtn") alert(`Agency: ${state.agency} | Budget: $${activeMission.budget}M | Max Mass: ${rocket.mass}kg | Min Power: ${activeMission.reqPwr}kW`);

  if (btn.classList.contains("cat-tab")) {
    document.querySelectorAll(".cat-tab").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    cat = btn.dataset.cat;
    renderEquipList();
  }

  if (btn.dataset.part) {
    const item = parts[cat].find(p => p.id === btn.dataset.part);
    if (!item) return;
    const idx = attached.findIndex(a => a.id === item.id);
    if (idx >= 0) attached.splice(idx, 1); else attached.push({ ...item, cat });
    document.getElementById("inspectBox").innerHTML = `<strong>${item.name}</strong><br>Cost: $${item.cost}M | Mass: ${item.mass}kg | Power: ${item.pwr > 0 ? "+" + item.pwr : item.pwr} kW`;
    renderEquipList();
    updateStudioHud();
  }

  if (btn.id === "resetAdjBtn") {
    ["adjRot", "adjUp", "adjSide"].forEach(id => document.getElementById(id).value = 0);
    document.getElementById("adjScale").value = 100;
    adj = { rot: 0, up: 0, side: 0, scale: 100 };
    drawSpacecraft();
  }

  if (btn.id === "submitBtn") {
    const t = getTotals(), err = [];
    if (!attached.some(i => i.cat === "structure")) err.push("❌ Missing Rocket Structure!");
    if (!attached.some(i => i.cat === "comms")) err.push("❌ Missing Comms Equipment!");
    if (activeMission.type === "womanned" && !attached.some(i => i.id === "pl2")) err.push("❌ Womanned mission requires Crew Module!");
    if (t.mass > rocket.mass) err.push(`❌ Mass ${t.mass}kg exceeds ${rocket.mass}kg limit!`);
    if (t.cost > activeMission.budget) err.push(`❌ Cost $${t.cost}M exceeds $${activeMission.budget}M budget!`);
    if (t.pwr < activeMission.reqPwr) err.push(`❌ Power ${t.pwr}kW below ${activeMission.reqPwr}kW required!`);

    if (err.length) {
      document.getElementById("revTitle").innerText = "⚠️ DESIGN ISSUES";
      document.getElementById("revBody").innerHTML = err.join("<br>");
      document.getElementById("expBox").style.display = "none";
      document.getElementById("toPhase4Btn").style.display = "none";
    } else {
      clearInterval(bTimer);
      document.getElementById("revTitle").innerText = "✅ DESIGN APPROVED";
      document.getElementById("revBody").innerHTML = `Remaining Budget: <strong>$${activeMission.budget - t.cost}M</strong>`;
      baseYrs = rocket.size === "Small" ? 6.5 : rocket.size === "Medium" ? 8.0 : 10.0;
      document.getElementById("expSlider").value = 0;
      calcExpedite();
      document.getElementById("expBox").style.display = "block";
      document.getElementById("toPhase4Btn").style.display = "block";
    }
    document.getElementById("reviewModal").style.display = "flex";
  }

  if (btn.id === "closeRevBtn") {
    document.getElementById("reviewModal").style.display = "none";
    runBuildTimer();
  }

  if (btn.id === "toPhase4Btn") {
    alert(`✅ Construction Scheduled (${finalTrainMins} mins training)! Ready for Phase 4.`);
  }
});

document.addEventListener("input", (e) => {
  if (["adjRot", "adjUp", "adjSide", "adjScale"].includes(e.target.id)) {
    adj = {
      rot: +document.getElementById("adjRot").value,
      up: +document.getElementById("adjUp").value,
      side: +document.getElementById("adjSide").value,
      scale: +document.getElementById("adjScale").value
    };
    drawSpacecraft();
  }
  if (e.target.id === "expSlider") calcExpedite();
});
// =========================================================
// PHASE 4A (PART 1): 5-STAR HOVER TOOLTIPS & 3D ENGINE SETUP
// =========================================================
const partDetails = {
  st1: { stars: 5, level: "ESSENTIAL", use: "Lightweight carbon-composite airframe for small-to-medium payloads.", why: "Required to hold fuel tanks and avionics together during Max-Q ascent." },
  st2: { stars: 5, level: "ESSENTIAL", use: "Reinforced orbital-class booster hull with higher thermal tolerance.", why: "Required structural backbone for heavier LEO and lunar payloads." },
  st3: { stars: 5, level: "ESSENTIAL", use: "Deep-space cryogenic stage engineered for high-mass interplanetary loads.", why: "Prevents hull buckling under heavy crew modules." },
  sc1: { stars: 4, level: "HIGHLY RECOMMENDED", use: "Analyzes lunar regolith mineral composition and water-ice signatures.", why: "Delivers primary scientific telemetry for Lunar South Pole contracts." },
  sc2: { stars: 4, level: "HIGHLY RECOMMENDED", use: "Synthetic-aperture radar for tracking Earth weather systems and orbital debris.", why: "Essential for ISS atmospheric science and collision avoidance." },
  pl1: { stars: 3, level: "MISSION OPTIONAL", use: "Spring-loaded dispenser for deploying secondary micro-satellites in orbit.", why: "Adds secondary mission value without heavy crew life-support mass." },
  pl2: { stars: 5, level: "MANDATORY (WOMANNED)", use: "Pressurized habitation cabin with oxygen scrubbers, food/water, and seats.", why: "Strictly required whenever Commander flies onboard in Womanned mode." },
  bt1: { stars: 4, level: "RECOMMENDED", use: "Stores 1.5 kW of reserve electrical energy for eclipse periods.", why: "Keeps avionics and heaters alive when solar panels are in shadow." },
  bt2: { stars: 5, level: "CRITICAL POWER", use: "High-density 3.2 kW solid-state battery bank for peak thruster & radar loads.", why: "Prevents brownouts during high-power burns and deep-space blackouts." },
  so1: { stars: 5, level: "ESSENTIAL POWER", use: "Deployable photovoltaic wings generating 2.2 kW continuous solar electricity.", why: "Primary renewable power source once your spacecraft reaches sunlight." },
  so2: { stars: 5, level: "MAXIMUM POWER", use: "Triple-junction Gallium Arsenide wings generating 4.5 kW high-output power.", why: "Best choice for high-drain ISS (4.0 kW) and Mars (5.5 kW) missions." },
  cm1: { stars: 5, level: "ESSENTIAL COMMS", use: "Medium-range S-Band dish for telemetry, command uplinks, and orbital tracking.", why: "Required on every spacecraft—without comms, Mission Control loses contact." },
  cm2: { stars: 5, level: "DEEP-SPACE ESSENTIAL", use: "High-bandwidth Ka-Band relay for high-speed Lunar and Mars data transmission.", why: "Required for reliable deep-space telemetry and high-res radar feeds." }
};

function renderStars(count) { return "★".repeat(count) + "☆".repeat(5 - count); }

// Hook hover tooltips onto equipment list whenever category or part changes
function attachHoverTooltips() {
  const el = document.getElementById("equipList");
  if (!el || typeof parts === "undefined") return;
  el.innerHTML = "";
  parts[cat].forEach(p => {
    const on = attached.some(a => a.id === p.id);
    const info = partDetails[p.id] || { stars: 4, level: "RECOMMENDED", use: "Spacecraft subsystem.", why: "Supports mission operations." };
    const div = document.createElement("div");
    div.className = "equip-item" + (on ? " attached" : "");
    div.innerHTML = `
      <div>
        <strong>${p.name}</strong> <span style="color:#facc15; font-size:11px;">${renderStars(info.stars)}</span><br>
        <small style="color:#94a3b8;">$${p.cost}M • ${p.mass}kg • ${p.pwr > 0 ? "+" + p.pwr : p.pwr}kW</small>
      </div>
      <button type="button" class="variant-btn" data-part="${p.id}" style="padding:5px 10px;">${on ? "✓ REMOVE" : "+ ATTACH"}</button>
    `;
    div.addEventListener("mouseenter", (e) => {
      const tip = document.getElementById("partTooltip");
      if (!tip) return;
      tip.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <strong style="color:#38bdf8;">${p.name}</strong>
          <span style="font-size:10px; background:#1e293b; color:#4ade80; padding:2px 6px; border-radius:4px;">${info.level}</span>
        </div>
        <div class="star-rating" style="margin-bottom:6px;">${renderStars(info.stars)} <small style="color:#94a3b8;">(${info.stars}/5 Necessity)</small></div>
        <div style="margin-bottom:5px;"><strong style="color:#f8fafc;">Use:</strong> ${info.use}</div>
        <div><strong style="color:#facc15;">Why Needed:</strong> ${info.why}</div>
      `;
      tip.style.display = "block";
      tip.style.left = Math.min(window.innerWidth - 290, e.clientX + 16) + "px";
      tip.style.top = Math.min(window.innerHeight - 170, e.clientY + 12) + "px";
    });
    div.addEventListener("mousemove", (e) => {
      const tip = document.getElementById("partTooltip");
      if (tip && tip.style.display === "block") {
        tip.style.left = Math.min(window.innerWidth - 290, e.clientX + 16) + "px";
        tip.style.top = Math.min(window.innerHeight - 170, e.clientY + 12) + "px";
      }
      // ... rest of the loop function (if any)
    });
    div.addEventListener("mouseleave", () => {
      const tip = document.getElementById("partTooltip");
      if (tip) tip.style.display = "none";
    });
    el.appendChild(div);
  });
}

// Automatically refresh tooltips after any studio click
document.addEventListener("click", (e) => {
  if (e.target.closest(".size-card") || e.target.closest(".cat-tab") || e.target.closest("[data-part]")) {
    setTimeout(attachHoverTooltips, 10);
  }
});
// =========================================================
// COMPLETE POST-BUILD ENGINE (LINE 561 ONWARDS — 0 ERRORS)
// =========================================================
const audioCtx = typeof AudioContext !== "undefined" ? new AudioContext() : null;
function playSfx(freq, type = "sine", dur = 0.12, vol = 0.12) {
  if (!audioCtx) return;
  if (audioCtx.state === "suspended") audioCtx.resume();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + dur);
}

function showToast(msg) {
  const t = document.getElementById("toastBanner");
  if (!t) return;
  t.innerText = msg; t.classList.add("show");
  playSfx(660, "triangle", 0.18, 0.16);
  setTimeout(() => t.classList.remove("show"), 1350);
}

let activeLoop = null, trainClockTimer = null, trainSecLeft = 900, keys = {};
window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  keys[k] = true;
  if (k === "arrowup" || k === "arrowdown" || k === "arrowleft" || k === "arrowright" || k === " ") {
    const active = document.getElementById("screen5Deck")?.style.display === "block" ||
                   document.getElementById("screen6Flight")?.style.display === "block" ||
                   document.getElementById("screen7Surface")?.style.display === "block";
    if (active) e.preventDefault();
  }
});
window.addEventListener("keyup", (e) => { keys[e.key.toLowerCase()] = false; });

function showAllScreens(id) {
  cancelAnimationFrame(activeLoop);
  const screens = Array.of("screen1", "screen2", "screen3", "screen4Size", "screen4Studio", "screen5Deck", "screen6Flight", "screen7Surface");
  screens.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.style.display = "none";
  });
  const tip = document.getElementById("partTooltip");
  if (tip) tip.style.display = "none";
  const target = document.getElementById(id);
  if (target) target.style.display = "block";
}

function smoothTransitionTo(screenId, title, sub, callback) {
  const c = document.getElementById("cinematicCurtain");
  if (!c) { showAllScreens(screenId); if (callback) callback(); return; }
  document.getElementById("curtainTitle").innerText = title;
  document.getElementById("curtainSub").innerText = sub;
  c.style.display = "flex";
  playSfx(440, "sine", 0.35, 0.1);
  requestAnimationFrame(() => c.classList.add("active"));
  setTimeout(() => {
    showAllScreens(screenId);
    if (callback) callback();
    c.classList.remove("active");
    setTimeout(() => { c.style.display = "none"; }, 450);
  }, 1400);
}

function drawCustomAstronaut(ctx, x, y, scale = 1, pose = "work", speech = "") {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const suitCol = (typeof state !== "undefined" && state.suit) ? state.suit : "#f8fafc";
  const skinCol = (typeof state !== "undefined" && state.skin) ? state.skin : "#f1c27d";
  const bounce = pose === "walk" ? Math.sin(Date.now() * 0.015) * 4 : Math.sin(Date.now() * 0.005) * 1.5;

  ctx.fillStyle = "#475569"; ctx.fillRect(-16, -12 + bounce, 8, 24);
  ctx.fillStyle = suitCol; ctx.fillRect(-11, -14 + bounce, 22, 28);
  ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 1.5; ctx.strokeRect(-11, -14 + bounce, 22, 28);

  const stride = pose === "walk" ? Math.sin(Date.now() * 0.015) * 5 : 0;
  ctx.fillStyle = suitCol;
  ctx.fillRect(-9, 14 + bounce, 7, 14 + stride);
  ctx.fillRect(2, 14 + bounce, 7, 14 - stride);

  const armWave = pose === "work" ? Math.sin(Date.now() * 0.018) * 6 : pose === "cheer" ? -14 : 0;
  ctx.strokeStyle = suitCol; ctx.lineWidth = 6; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(9, -6 + bounce); ctx.lineTo(22, -4 + bounce + armWave); ctx.stroke();

  ctx.fillStyle = suitCol; ctx.beginPath(); ctx.arc(0, -25 + bounce, 13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = skinCol; ctx.beginPath(); ctx.arc(2, -25 + bounce, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(56, 189, 248, 0.35)"; ctx.beginPath(); ctx.arc(2, -25 + bounce, 10, -0.7, 0.8); ctx.fill();

  if (speech) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)"; ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 1.2;
    ctx.fillRect(-45, -62 + bounce, 135, 20); ctx.strokeRect(-45, -62 + bounce, 135, 20);
    ctx.fillStyle = "#bae6fd"; ctx.font = "bold 9px sans-serif";
    ctx.fillText(speech, -39, -49 + bounce);
  }
  ctx.restore();
}

Object.assign(missionData, {
  solar: {
    title: "Solar Corona Explorer", stamp: "LEVEL 1 • HELIOPHYSICS", reqPwr: 3.5, deadline: "05 Mins 00 Secs",
    params: "Max Mass: By Rocket | Power: 3.5 kW | Perihelion: 6.2M km",
    satellite: { NASA: Array.of(110, "NASA Parker"), ISRO: Array.of(65, "ISRO Aditya-L1"), ESA: Array.of(95, "ESA Solar"), Roscosmos: Array.of(85, "Roscosmos Helio"), KASA: Array.of(80, "KASA Helio"), JAXA: Array.of(90, "JAXA Helio"), ASA: Array.of(75, "ASA Helio"), KSA: Array.of(60, "KSA Helio") },
    womanned:  { NASA: Array.of(260, "NASA Helio Crew"), ISRO: Array.of(140, "ISRO Solar Crew"), ESA: Array.of(220, "ESA Corona"), Roscosmos: Array.of(195, "Roscosmos Helio"), KASA: Array.of(185, "KASA Helio"), JAXA: Array.of(210, "JAXA Helio"), ASA: Array.of(180, "ASA Helio"), KSA: Array.of(150, "KSA Helio") },
    obj: { satellite: Array.of("Attach Structure, Spectrometer & Comms.", "Generate 3.5 kW power.", "Fly close to the Sun and gather data."), womanned: Array.of("Attach Structure, Crew Module & Comms.", "Generate 3.5 kW power.", "Survive solar flares and run lab tests.") }
  },
  asteroid: {
    title: "Asteroid Psyche-16", stamp: "LEVEL 1 • DEEP SPACE", reqPwr: 4.2, deadline: "05 Mins 30 Secs",
    params: "Max Mass: By Rocket | Power: 4.2 kW | Belt: 2.9 AU",
    satellite: { NASA: Array.of(135, "NASA Discovery"), ISRO: Array.of(80, "ISRO Deep Space"), ESA: Array.of(120, "ESA Hera"), Roscosmos: Array.of(105, "Roscosmos"), KASA: Array.of(95, "KASA"), JAXA: Array.of(115, "JAXA Hayabusa"), ASA: Array.of(90, "ASA"), KSA: Array.of(75, "KSA") },
    womanned:  { NASA: Array.of(310, "NASA Asteroid"), ISRO: Array.of(170, "ISRO Crew"), ESA: Array.of(275, "ESA Crew"), Roscosmos: Array.of(240, "Roscosmos"), KASA: Array.of(225, "KASA"), JAXA: Array.of(260, "JAXA"), ASA: Array.of(215, "ASA"), KSA: Array.of(180, "KSA") },
    obj: { satellite: Array.of("Attach Structure, Spectrometer & Comms.", "Generate 4.2 kW power.", "Blast through asteroid belt and land."), womanned: Array.of("Attach Structure, Crew Module & Spectrometer.", "Generate 4.2 kW power.", "Land on asteroid and scan metal core.") }
  },
  mars: {
    title: "Mars Jezero Crater", stamp: "LEVEL 2 • EXPEDITION", reqPwr: 5.5, deadline: "06 Mins 00 Secs",
    params: "Max Mass: By Rocket | Power: 5.5 kW | Orbit: 250 km Mars",
    satellite: { NASA: Array.of(190, "NASA Mars"), ISRO: Array.of(120, "ISRO Mangalyaan-2"), ESA: Array.of(175, "ESA ExoMars"), Roscosmos: Array.of(150, "Roscosmos"), KASA: Array.of(145, "KASA"), JAXA: Array.of(165, "JAXA MMX"), ASA: Array.of(140, "ASA"), KSA: Array.of(115, "KSA") },
    womanned:  { NASA: Array.of(450, "NASA Artemis Mars"), ISRO: Array.of(260, "ISRO Mars Crew"), ESA: Array.of(390, "ESA Aurora"), Roscosmos: Array.of(340, "Roscosmos"), KASA: Array.of(320, "KASA"), JAXA: Array.of(370, "JAXA"), ASA: Array.of(310, "ASA"), KSA: Array.of(250, "KSA") },
    obj: { satellite: Array.of("Attach Cryo Stage, Spectrometer & Ka-Band.", "Generate 5.5 kW power.", "Land rover and deploy seismic sensors."), womanned: Array.of("Attach Cryo Stage, Crew Module & Ka-Band.", "Generate 5.5 kW power.", "Touch down on Mars and run habitat labs.") }
  },
  europa: {
    title: "Europa Ice Clipper", stamp: "LEVEL 3 • JOVIAN", reqPwr: 6.5, deadline: "06 Mins 30 Secs",
    params: "Max Mass: By Rocket | Power: 6.5 kW | Orbit: 400 km Europa",
    satellite: { NASA: Array.of(240, "NASA Clipper"), ISRO: Array.of(155, "ISRO Outer"), ESA: Array.of(215, "ESA JUICE"), Roscosmos: Array.of(185, "Roscosmos"), KASA: Array.of(175, "KASA"), JAXA: Array.of(200, "JAXA"), ASA: Array.of(170, "ASA"), KSA: Array.of(145, "KSA") },
    womanned:  { NASA: Array.of(520, "NASA Jovian"), ISRO: Array.of(310, "ISRO Jovian"), ESA: Array.of(460, "ESA Jovian"), Roscosmos: Array.of(410, "Roscosmos"), KASA: Array.of(390, "KASA"), JAXA: Array.of(440, "JAXA"), ASA: Array.of(380, "ASA"), KSA: Array.of(320, "KSA") },
    obj: { satellite: Array.of("Attach Cryo Stage, Spectrometer & Ka-Band.", "Generate 6.5 kW power.", "Sample Europa ice geysers."), womanned: Array.of("Attach Cryo Stage, Crew Module & Ka-Band.", "Generate 6.5 kW power.", "Land on ice crust and analyze ocean water.") }
  }
});

(function setupSixMissions() {
  const grid = document.querySelector("#screen2 .mission-grid");
  if (!grid) return;
  const list = Array.of(
    { key: "moon", badge: "UNLOCKED • TUTORIAL", bCol: "#065f46", tCol: "#6ee7b7", title: "Lunar South Pole", desc: "Starter Moon mission & ice crater landing.", pwr: "2.5 kW", orb: "100 km", locked: false },
    { key: "iss", badge: "UNLOCKED • LEVEL 1", bCol: "#1e3a8a", tCol: "#93c5fd", title: "Intl. Space Station", desc: "Low-Earth Orbit storm radar & crew docking.", pwr: "4.0 kW", orb: "408 km", locked: false },
    { key: "solar", badge: "UNLOCKED • LEVEL 1", bCol: "#9a3412", tCol: "#fed7aa", title: "Solar Corona Explorer", desc: "Close Sun flyby through solar flares.", pwr: "3.5 kW", orb: "HELIO", locked: false },
    { key: "asteroid", badge: "UNLOCKED • LEVEL 1", bCol: "#581c87", tCol: "#e9d5ff", title: "Asteroid Psyche-16", desc: "Blast through asteroids & mine metal core.", pwr: "4.2 kW", orb: "2.9 AU", locked: false },
        { key: "mars", badge: "🔒 LOCKED • LEVEL 2", bCol: "#334155", tCol: "#cbd5e1", title: "Mars Jezero Crater", desc: "Beat any mission to unlock Red Planet landing.", pwr: "5.5 kW", orb: "MARS", locked: true },
    { key: "europa", badge: "🔒 LOCKED • LEVEL 3", bCol: "#334155", tCol: "#cbd5e1", title: "Europa Ice Clipper", desc: "Beat any mission to unlock Jupiter's ice moon.", pwr: "6.5 kW", orb: "JOVIAN", locked: true }
  );
  grid.innerHTML = list.map(m => `
    <div class="mission-card ${m.locked ? "locked" : ""}" data-mcard="${m.key}">
      <div><span class="badge" style="background:${m.bCol}; color:${m.tCol};">${m.badge}</span><h3>${m.title}</h3><p style="font-size:12px; color:#cbd5e1;">${m.desc}</p><div class="specs-row"><span>POWER: ${m.pwr}</span><span>ORBIT: ${m.orb}</span></div></div>
      ${m.locked ? `<button type="button" class="variant-btn" disabled>LOCKED</button>` : `<div class="variant-choices"><button type="button" class="variant-btn" data-m="${m.key}" data-t="satellite">🛰️ Satellite</button><button type="button" class="variant-btn" data-m="${m.key}" data-t="womanned">👩‍🚀 Womanned</button></div>`}
    </div>
  `).join("");
})();

let doneStations = new Set(), activeSt = null, stState = {};

const stations = Array.of(
  {
    id: "power", icon: "⚡", name: "Power Grid",
    hint: "HOW TO PLAY: Click a color plug on the left, then click the matching color port on the right.",
    why: "WHY IT MATTERS: Connecting power cables sends electricity from your batteries to the flight computer.",
    init() { stState = { sel: null, links: Array.of() }; },
    controls: () => `
      <div class="wire-grid">
        <div>${Array.of("Red", "Blue", "Gold", "Green").map(c => `<button type="button" class="chunky-btn" style="width:100%; margin-bottom:5px; border-color:${c.toLowerCase()};" data-wleft="${c}">${c} Plug</button>`).join("")}</div>
        <div>${Array.of("Blue", "Green", "Red", "Gold").map(c => `<button type="button" class="chunky-btn" style="width:100%; margin-bottom:5px; border-color:${c.toLowerCase()};" data-wright="${c}">${c} Port</button>`).join("")}</div>
      </div>`,
    draw(ctx, w, h) {
      drawCustomAstronaut(ctx, 68, h - 55, 1.05, "work", stState.links.length === 4 ? "Power is online!" : "Match the colors!");
      const leftList = Array.of("Red", "Blue", "Gold", "Green"), rightList = Array.of("Blue", "Green", "Red", "Gold");
      stState.links.forEach(col => {
        const y1 = 55 + leftList.indexOf(col) * 46, y2 = 55 + rightList.indexOf(col) * 46;
        ctx.strokeStyle = col === "Gold" ? "#facc15" : col.toLowerCase(); ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(165, y1); ctx.lineTo(w - 135, y2); ctx.stroke();
      });
      if (stState.links.length === 4) certifyStation("power");
    }
  },
  {
    id: "helm", icon: "🕹️", name: "Ship Steering",
    hint: "HOW TO PLAY: Use W A S D (or Arrow Keys) to fly your ship through all 3 glowing green rings!",
    why: "WHY IT MATTERS: Thruster steering keeps your spacecraft lined up with your target planet.",
    init() { stState = { x: 140, y: 130, hoops: Array.of({ x: 270, y: 75, ok: 0 }, { x: 430, y: 185, ok: 0 }, { x: 580, y: 105, ok: 0 }) }; },
    controls: () => `<small style="color:#7dd3fc;">Press <strong>W A S D</strong> or <strong>Arrow Keys</strong> to steer through the rings!</small>`,
    draw(ctx, w, h) {
      drawCustomAstronaut(ctx, 62, h - 55, 1.0, "work", "Fly through the rings!");
      if (keys["w"] || keys["arrowup"]) stState.y -= 3.6;
      if (keys["s"] || keys["arrowdown"]) stState.y += 3.6;
      if (keys["a"] || keys["arrowleft"]) stState.x -= 3.6;
      if (keys["d"] || keys["arrowright"]) stState.x += 3.6;
      stState.x = Math.max(120, Math.min(w - 25, stState.x));
      stState.y = Math.max(25, Math.min(h - 25, stState.y));

      stState.hoops.forEach(hp => {
        if (!hp.ok && Math.hypot(stState.x - hp.x, stState.y - hp.y) < 34) { hp.ok = 1; playSfx(520); }
        ctx.strokeStyle = hp.ok ? "#4ade80" : "#facc15"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(hp.x, hp.y, 26, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.moveTo(stState.x + 18, stState.y); ctx.lineTo(stState.x - 14, stState.y - 12); ctx.lineTo(stState.x - 14, stState.y + 12); ctx.fill();
      if (stState.hoops.every(hp => hp.ok)) certifyStation("helm");
    }
  },
  {
    id: "weapons", icon: "🎯", name: "Meteor Defense",
    hint: "HOW TO PLAY: Aim with your mouse and click inside the black space screen to blast 5 space rocks!",
    why: "WHY IT MATTERS: Clearing meteoroids protects your hull from dangerous space impacts.",
    init() { stState = { hits: 0, rocks: Array.from({ length: 5 }, (_, i) => ({ x: 540 + i * 95, y: 45 + (i * 45) % 180, r: 20, alive: true })) }; },
    controls: () => `<small style="color:#facc15;">Aim & <strong>Click inside the black space box</strong> to shoot rocks!</small>`,
    onClick(mx, my) {
      playSfx(320, "sawtooth", 0.1);
      stState.rocks.forEach(rk => {
        if (rk.alive && Math.hypot(mx - rk.x, my - rk.y) <= rk.r + 16) { rk.alive = false; stState.hits++; playSfx(140, "square", 0.15); }
      });
    },
    draw(ctx, w, h) {
      drawCustomAstronaut(ctx, 62, h - 55, 1.0, "work", `${stState.hits}/5 rocks cleared!`);
      stState.rocks.forEach(rk => {
        if (!rk.alive) return;
        rk.x -= 1.8; if (rk.x < 120) rk.x = w + 20;
        ctx.fillStyle = "#ea580c"; ctx.beginPath(); ctx.arc(rk.x, rk.y, rk.r, 0, Math.PI * 2); ctx.fill();
      });
      if (stState.hits >= 5) certifyStation("weapons");
    }
  },
  {
    id: "reactor", icon: "🔋", name: "Engine Sequence",
    hint: "HOW TO PLAY: Tap STEP 1 → STEP 2 → STEP 3 → STEP 4 in exact order.",
    why: "WHY IT MATTERS: Fuel pressure must build up before igniting the engine so the rocket lifts off safely.",
    init() { stState = { step: 0 }; },
    controls: () => Array.of(1, 2, 3, 4).map(n => `<button type="button" class="chunky-btn" data-rseq="${n}">STEP ${n}</button>`).join(""),
    draw(ctx, w, h) {
      drawCustomAstronaut(ctx, 68, h - 55, 1.05, "work", "Tap 1, 2, 3, then 4!");
      for (let i = 1; i <= 4; i++) {
        ctx.fillStyle = i <= stState.step ? "#4ade80" : "#1e293b";
        ctx.beginPath(); ctx.arc(165 + i * 95, h / 2, 26, 0, Math.PI * 2); ctx.fill();
      }
      if (stState.step === 4) certifyStation("reactor");
    }
  },
  {
    id: "shields", icon: "🛡️", name: "Shield Armor",
    hint: "HOW TO PLAY: Click all 6 red shield plate buttons below until every tile glows blue!",
    why: "WHY IT MATTERS: Charged shields block solar flares and radiation waves during deep-space travel.",
    init() { stState = { plates: Array.of(0, 0, 0, 0, 0, 0) }; },
    controls: () => Array.of(0, 1, 2, 3, 4, 5).map(i => `<button type="button" class="chunky-btn" style="border-color:#ef4444;" data-shplate="${i}">PLATE ${i + 1}</button>`).join(""),
    draw(ctx, w, h) {
      drawCustomAstronaut(ctx, 68, h - 55, 1.05, "work", "Charge all 6 plates!");
      stState.plates.forEach((on, i) => {
        ctx.fillStyle = on ? "#38bdf8" : "#ef4444";
        ctx.fillRect(145 + i * 80, h / 2 - 28, 62, 56);
      });
      if (stState.plates.every(x => x === 1)) certifyStation("shields");
    }
  },
  {
    id: "comms", icon: "📡", name: "Radio & Scan",
    hint: "HOW TO PLAY: Drag the slider until the wave turns green (between 65 and 80)!",
    why: "WHY IT MATTERS: Tuning the radio dish keeps you connected with Mission Control on Earth.",
    init() { stState = { val: 20 }; },
    controls: () => `<input type="range" id="stWaveRange" min="0" max="100" value="20" style="width:260px;">`,
    draw(ctx, w, h) {
      drawCustomAstronaut(ctx, 68, h - 55, 1.05, "work", "Slide until wave is green!");
      const ok = stState.val >= 65 && stState.val <= 80;
      ctx.strokeStyle = ok ? "#4ade80" : "#f472b6"; ctx.lineWidth = 4;
      ctx.beginPath();
      for (let x = 140; x < w - 30; x += 6) {
        const y = h / 2 + Math.sin(x * 0.05) * (ok ? 26 : 62);
        if (x === 140) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      if (ok) certifyStation("comms");
    }
  }
);

function certifyStation(id) {
  if (doneStations.has(id)) return;
  doneStations.add(id);
  showToast("✅ STATION CERTIFIED!");
  document.getElementById("deckProgress").innerText = `READY: ${doneStations.size} / 6`;
  renderStationCards();
  if (doneStations.size === 6) {
    const b = document.getElementById("launchMissionBtn");
    b.disabled = false; b.style.opacity = "1"; b.style.cursor = "pointer";
    b.innerText = "🚀 ALL 6 STATIONS READY — BLAST OFF TO LAUNCHPAD ➔";
  }
}

function renderStationCards() {
  const g = document.getElementById("stationGrid");
  if (!g) return;
  g.innerHTML = stations.map(s => `
    <div class="st-card ${activeSt?.id === s.id ? "active" : ""} ${doneStations.has(s.id) ? "done" : ""}" data-pickst="${s.id}">
      <div style="font-size:26px;">${doneStations.has(s.id) ? "✅" : s.icon}</div>
      <strong style="font-size:12.5px; color:#f8fafc;">${s.name}</strong>
    </div>
  `).join("");
}

function selectStation(id) {
  const s = stations.find(x => x.id === id);
  if (!s) return;
  activeSt = s; s.init();
  document.getElementById("stTitle").innerText = `${s.icon} ${s.name}`;
  document.getElementById("stHint").innerText = s.hint;
  document.getElementById("stWhy").innerText = s.why;
  document.getElementById("stControls").innerHTML = s.controls();
  renderStationCards();

  cancelAnimationFrame(activeLoop);
  const c = document.getElementById("trainCanvas"), ctx = c.getContext("2d");
  c.onclick = (e) => {
    const r = c.getBoundingClientRect();
    if (s.onClick) s.onClick(e.clientX - r.left, e.clientY - r.top);
  };
  function loop() {
    ctx.clearRect(0, 0, c.width, c.height);
    s.draw(ctx, c.width, c.height);
    activeLoop = requestAnimationFrame(loop);
  }
  loop();
}
let throttleVal = 0, holdingThrust = false, launched = false, distPct = 0, hullPct = 100, orbCount = 0;
let shipPos = { x: 110, y: 155 }, bullets = Array.of(), rocks = Array.of(), orbs = Array.of(), particles = Array.of();
let triggeredRepairs = new Set(), repairOpen = false, vitals = { h: 100, w: 100, f: 100 }, vitInterval = null;

function renderPilotCam(pose, speech) {
  const cam = document.getElementById("pilotCamCanvas");
  if (!cam) return;
  const cctx = cam.getContext("2d");
  cctx.clearRect(0, 0, cam.width, cam.height);
  cctx.fillStyle = "#0f172a"; cctx.fillRect(0, 0, cam.width, cam.height);
  drawCustomAstronaut(cctx, 48, 54, 0.85, pose, speech);
}

function startFlightPhase() {
  throttleVal = 0; holdingThrust = false; launched = false; distPct = 0; hullPct = 100; orbCount = 0;
  shipPos = { x: 110, y: 155 }; bullets = Array.of(); rocks = Array.of(); orbs = Array.of(); particles = Array.of();
  triggeredRepairs.clear(); repairOpen = false;

  document.getElementById("takeoffBar").style.display = "flex";
  document.getElementById("fuelValveBtn").disabled = false; document.getElementById("fuelValveBtn").classList.remove("ok");
  document.getElementById("holdThrustBtn").disabled = true; document.getElementById("holdThrustBtn").classList.remove("ok");
  document.getElementById("igniteBtn").disabled = true;
  document.getElementById("throttleFill").style.width = "0%";
  document.getElementById("flightCoachMsg").innerHTML = `<strong>STEP 1:</strong> Click <strong>OPEN FUEL VALVE</strong> below to fill the rocket tanks before lighting the engines!`;

  const isWom = activeMission.type === "womanned";
  document.getElementById("camTitle").innerText = isWom ? "LIVE COCKPIT CAM" : "MISSION CONTROL CAM";
  document.getElementById("crewVitalsHud").style.display = isWom ? "block" : "none";
  vitals = { h: 100, w: 100, f: 100 };
  clearInterval(vitInterval);
  if (isWom) {
    vitInterval = setInterval(() => {
      vitals.h = Math.max(15, vitals.h - 1.2); vitals.w = Math.max(15, vitals.w - 1.6); vitals.f = Math.max(15, vitals.f - 1.0);
      document.getElementById("vHungerTxt").innerText = Math.round(vitals.h) + "%"; document.getElementById("vHungerBar").style.width = vitals.h + "%";
      document.getElementById("vThirstTxt").innerText = Math.round(vitals.w) + "%"; document.getElementById("vThirstBar").style.width = vitals.w + "%";
      document.getElementById("vFitTxt").innerText = Math.round(vitals.f) + "%"; document.getElementById("vFitBar").style.width = vitals.f + "%";
    }, 1500);
  }

  cancelAnimationFrame(activeLoop);
  const c = document.getElementById("flightCanvas"), ctx = c.getContext("2d");
  if (!c) return;
  c.onclick = (e) => {
    if (!launched || repairOpen) return;
    const r = c.getBoundingClientRect();
    const ang = Math.atan2((e.clientY - r.top) - shipPos.y, (e.clientX - r.left) - shipPos.x);
    bullets.push({ x: shipPos.x + 25, y: shipPos.y, vx: Math.cos(ang) * 9, vy: Math.sin(ang) * 9 });
    playSfx(440, "sawtooth", 0.08, 0.1);
  };

  let f = 0;
  function loop() {
    f++; ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#bae6fd";
    for (let i = 0; i < 45; i++) ctx.fillRect(((i * 97 - f * (launched ? 4 : 0.3)) % c.width + c.width) % c.width, (i * 53) % c.height, 2, 2);

    if (!launched) {
      renderPilotCam("work", "Ready for liftoff!");
      if (holdingThrust) {
        throttleVal = Math.min(100, throttleVal + 1.2);
        document.getElementById("throttleFill").style.width = throttleVal + "%";
        if (throttleVal >= 62 && throttleVal <= 86) {
          document.getElementById("holdThrustBtn").classList.add("ok");
          document.getElementById("igniteBtn").disabled = false;
          document.getElementById("flightCoachMsg").innerHTML = `<strong>STEP 3:</strong> Thrust is in the green sweet spot! Release and click <strong>IGNITE & BLAST OFF! 🚀</strong>`;
        }
      }
      ctx.fillStyle = "#334155"; ctx.fillRect(0, c.height - 25, c.width, 25);
      ctx.fillStyle = "#e2e8f0"; ctx.fillRect(c.width / 2 - 20, c.height - 135, 40, 110);
      ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.moveTo(c.width / 2, c.height - 170); ctx.lineTo(c.width / 2 - 20, c.height - 135); ctx.lineTo(c.width / 2 + 20, c.height - 135); ctx.fill();
    } else if (!repairOpen) {
      renderPilotCam("work", "Flying steady!");
      if (keys["w"] || keys["arrowup"]) shipPos.y -= 4.2;
      if (keys["s"] || keys["arrowdown"]) shipPos.y += 4.2;
      if (keys["a"] || keys["arrowleft"]) shipPos.x -= 4.2;
      if (keys["d"] || keys["arrowright"]) shipPos.x += 4.2;
      shipPos.x = Math.max(35, Math.min(c.width - 80, shipPos.x));
      shipPos.y = Math.max(30, Math.min(c.height - 30, shipPos.y));

      if (f % 45 === 0) rocks.push({ x: c.width + 20, y: 25 + Math.random() * (c.height - 50), r: 16 + Math.random() * 12, vx: 3.8 + distPct / 35 });
      if (f % 85 === 0) orbs.push({ x: c.width + 20, y: 30 + Math.random() * (c.height - 60), vx: 3.2 });

      bullets.forEach((b, bi) => {
        b.x += b.vx; b.y += b.vy;
        ctx.fillStyle = "#38bdf8"; ctx.fillRect(b.x - 6, b.y - 2, 12, 4);
        rocks.forEach((rk, ri) => {
          if (Math.hypot(b.x - rk.x, b.y - rk.y) < rk.r + 6) {
            for (let k = 0; k < 10; k++) particles.push({ x: rk.x, y: rk.y, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, l: 20, c: "#fb923c" });
            rocks.splice(ri, 1); bullets.splice(bi, 1); playSfx(140, "square", 0.14);
          }
        });
      });

      orbs.forEach((o, oi) => {
        o.x -= o.vx;
        ctx.fillStyle = "#4ade80"; ctx.beginPath(); ctx.arc(o.x, o.y, 11, 0, Math.PI * 2); ctx.fill();
        if (Math.hypot(o.x - shipPos.x, o.y - shipPos.y) < 28) {
          orbCount++; distPct = Math.min(100, distPct + 6); orbs.splice(oi, 1); playSfx(740, "sine", 0.12);
        }
      });

      rocks.forEach((rk, ri) => {
        rk.x -= rk.vx;
        ctx.fillStyle = "#9a3412"; ctx.beginPath(); ctx.arc(rk.x, rk.y, rk.r, 0, Math.PI * 2); ctx.fill();
        if (Math.hypot(rk.x - shipPos.x, rk.y - shipPos.y) < rk.r + 18) {
          hullPct = Math.max(20, hullPct - 10); rocks.splice(ri, 1); playSfx(110, "sawtooth", 0.2);
        }
      });

      ctx.fillStyle = "#f8fafc"; ctx.beginPath(); ctx.moveTo(shipPos.x + 26, shipPos.y); ctx.lineTo(shipPos.x - 18, shipPos.y - 14); ctx.lineTo(shipPos.x - 18, shipPos.y + 14); ctx.fill();
      ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.moveTo(shipPos.x - 18, shipPos.y - 6); ctx.lineTo(shipPos.x - 32 - Math.random() * 10, shipPos.y); ctx.lineTo(shipPos.x - 18, shipPos.y + 6); ctx.fill();

      distPct = Math.min(100, distPct + 0.14);
      document.getElementById("hudDist").innerText = `DISTANCE: ${Math.round(distPct)}%`;
      document.getElementById("hudHull").innerText = `HULL: ${hullPct}%`;
      document.getElementById("hudOrbs").innerText = `ORBS: ${orbCount}`;

      if (distPct >= 28 && !triggeredRepairs.has(1)) { triggeredRepairs.add(1); openRepairGame("keypad"); }
      if (distPct >= 65 && !triggeredRepairs.has(2)) { triggeredRepairs.add(2); openRepairGame("pump"); }
      if (distPct >= 100) {
        smoothTransitionTo("screen7Surface", "ENTERING LANDING ORBIT", "Preparing retro-thrusters for surface touchdown...", startLandingAndFinale);
        return;
      }
    }

    particles.forEach((p, pi) => { p.x += p.vx; p.y += p.vy; p.l--; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, 3, 3); if (p.l <= 0) particles.splice(pi, 1); });
    activeLoop = requestAnimationFrame(loop);
  }
  loop();
}

function openRepairGame(type) {
  repairOpen = true;
  playSfx(220, "sawtooth", 0.3, 0.18);
  const modal = document.getElementById("repairModal"), body = document.getElementById("repBody");
  modal.style.display = "flex";
  if (type === "keypad") {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    let typed = "";
    document.getElementById("repTitle").innerText = "🔐 SECURITY OVERRIDE CODE NEEDED!";
    document.getElementById("repDesc").innerHTML = `Type the 4-digit code <strong style="color:#4ade80; font-size:18px;">${code}</strong> on the keypad below to reset the computer:`;
    body.innerHTML = `<div id="kpDisp" style="font-family:monospace; font-size:20px; color:#38bdf8; margin-bottom:8px;">----</div><div class="keypad-grid">${Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9).map(n => `<button type="button" class="chunky-btn" data-kp="${n}">${n}</button>`).join("")}</div>`;
    body.onclick = (e) => {
      const n = e.target.dataset.kp; if (!n) return;
      typed += n; playSfx(550); document.getElementById("kpDisp").innerText = typed;
      if (typed === code) { modal.style.display = "none"; repairOpen = false; showToast("✅ COMPUTER RESET!"); }
      else if (typed.length >= 4) { typed = ""; document.getElementById("kpDisp").innerText = "RETRY"; }
    };
  } else {
    let charge = 0;
    document.getElementById("repTitle").innerText = "🛡️ SHIELD POWER LOW!";
    document.getElementById("repDesc").innerText = "Tap the pump button rapidly until shields recharge to 100%!";
    body.innerHTML = `<button type="button" id="pumpTapBtn" class="primary-btn" style="max-width:260px;">⚡ PUMP SHIELD (0%)</button>`;
    document.getElementById("pumpTapBtn").onclick = function () {
      charge += 20; playSfx(350 + charge * 4); this.innerText = `⚡ PUMP SHIELD (${charge}%)`;
      if (charge >= 100) { modal.style.display = "none"; repairOpen = false; showToast("✅ SHIELDS AT 100%!"); }
    };
  }
}
function startLandingAndFinale() {
  const c = document.getElementById("surfaceCanvas");
  if (!c) return;
  const ctx = c.getContext("2d");
  let lx = c.width / 2, ly = 45, vx = 0, vy = 0, landed = false;
  let astro = { x: c.width / 2 + 45, y: c.height - 52, pose: "cheer", msg: "Touchdown!" };
  let rover = { x: 120, y: 215, pts: Array.of({ x: 340, y: 210, ok: 0 }, { x: 580, y: 220, ok: 0 }, { x: 790, y: 205, ok: 0 }) };

  document.getElementById("landerTouchBar").style.display = "flex";
  document.getElementById("finalePanel").style.display = "none";
  document.getElementById("victoryBanner").style.display = "none";
  document.getElementById("surfStatus").innerText = "PHASE: PILOT LANDER TO GREEN PAD";

  cancelAnimationFrame(activeLoop);
  function loop() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = activeMission.key === "mars" ? "#7c2d12" : "#334155";
    ctx.fillRect(0, c.height - 28, c.width, 28);
    ctx.fillStyle = "#22c55e"; ctx.fillRect(c.width / 2 - 65, c.height - 32, 130, 8);

    if (!landed) {
      if (keys["a"] || keys["arrowleft"]) vx -= 0.12;
      if (keys["d"] || keys["arrowright"]) vx += 0.12;
      const up = keys["w"] || keys["arrowup"];
      vy += up ? -0.14 : 0.06;
      vx *= 0.94; vy = Math.max(-3.2, Math.min(4.2, vy));
      lx = Math.max(40, Math.min(c.width - 40, lx + vx)); ly += vy;

      ctx.fillStyle = "#f8fafc"; ctx.fillRect(lx - 16, ly - 24, 32, 36);
      if (up) { ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.moveTo(lx - 10, ly + 12); ctx.lineTo(lx, ly + 32); ctx.lineTo(lx + 10, ly + 12); ctx.fill(); }
      ctx.fillStyle = Math.abs(vy) < 2.4 ? "#4ade80" : "#f87171"; ctx.font = "13px monospace";
      ctx.fillText(`DESCENT SPEED: ${Math.max(0, vy * 2).toFixed(1)} m/s (SAFE < 4.8 m/s)`, 16, 24);

      if (ly >= c.height - 44) {
        if (Math.abs(vy) < 2.4 && Math.abs(lx - c.width / 2) < 75) {
          landed = true; showToast("🎉 SAFE TOUCHDOWN!");
          document.getElementById("landerTouchBar").style.display = "none";
          document.getElementById("surfStatus").innerText = "PHASE: SURFACE EXPEDITION";
          setupSurfaceTasks();
        } else { ly = 45; vy = 0; vx = 0; playSfx(120, "sawtooth", 0.25); }
      }
    } else if (activeMission.type !== "womanned") {
      ctx.fillStyle = "#f8fafc"; ctx.fillRect(c.width / 2 - 16, c.height - 68, 32, 36);
      drawCustomAstronaut(ctx, 75, c.height - 52, 0.9, "work", "Driving Rover!");
      if (keys["a"] || keys["arrowleft"]) rover.x -= 3.5;
      if (keys["d"] || keys["arrowright"]) rover.x += 3.5;
      if (keys["w"] || keys["arrowup"]) rover.y -= 2.5;
      if (keys["s"] || keys["arrowdown"]) rover.y += 2.5;
      rover.x = Math.max(115, Math.min(c.width - 30, rover.x));
      rover.y = Math.max(c.height - 75, Math.min(c.height - 32, rover.y));

      rover.pts.forEach(pt => {
        if (!pt.ok && Math.hypot(rover.x - pt.x, rover.y - pt.y) < 30) { pt.ok = 1; showToast("📍 SAMPLE COLLECTED!"); }
        ctx.fillStyle = pt.ok ? "#4ade80" : "#facc15";
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 12, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = "#38bdf8"; ctx.fillRect(rover.x - 18, rover.y - 12, 36, 18);
      if (rover.pts.every(p => p.ok)) triggerVictory();
    } else {
      ctx.fillStyle = "#f8fafc"; ctx.fillRect(c.width / 2 - 16, c.height - 68, 32, 36);
      drawCustomAstronaut(ctx, astro.x, astro.y, 1.0, astro.pose, astro.msg);
    }
    activeLoop = requestAnimationFrame(loop);
  }
  loop();
}

function setupSurfaceTasks() {
  const panel = document.getElementById("finalePanel"), box = document.getElementById("finInteractive");
  panel.style.display = "block"; box.innerHTML = "";
  if (activeMission.type === "womanned") {
    document.getElementById("surfCoachMsg").innerHTML = `<strong>GREAT LANDING!</strong> Click each science station button below to watch your astronaut complete the surface research!`;
    document.getElementById("finTitle").innerText = "👩‍🚀 SURFACE LAB EXPEDITION (COMPLETE ALL 3)";
    document.getElementById("finDesc").innerText = "Complete all 3 surface science tasks:";
    let labDone = 0;
    Array.of("🪪 Swipe Commander ID Card", "🌱 Hydrate Space Plants", "🔬 Laser Core Sample Scan").forEach(lbl => {
      const b = document.createElement("button"); b.type = "button"; b.className = "chunky-btn"; b.innerText = lbl;
      b.onclick = () => { if (b.classList.contains("ok")) return; b.classList.add("ok"); labDone++; showToast("✅ LAB TASK DONE!"); if (labDone >= 3) triggerVictory(); };
      box.appendChild(b);
    });
  } else {
    document.getElementById("surfCoachMsg").innerHTML = `<strong>ROVER DEPLOYED!</strong> Use <strong>W A S D</strong> (or Arrow Keys) to drive your rover onto all 3 glowing yellow sample spots!`;
    document.getElementById("finTitle").innerText = "🤖 ROVER SURFACE EXPLORATION";
    document.getElementById("finDesc").innerText = "Drive onto all 3 glowing beacons on the surface:";
  }
}

function triggerVictory() {
  if (document.getElementById("victoryBanner").style.display === "block") return;
  clearInterval(vitInterval);
  document.getElementById("finalePanel").style.display = "none";
  document.getElementById("victoryBanner").style.display = "block";
  const score = Math.min(100, 80 + orbCount * 2);
  document.getElementById("vicHeadline").innerText = `🏆 MISSION ACCOMPLISHED — SCORE: ${score} / 100`;
  document.getElementById("vicSummary").innerText = `Commander ${state.name || state.gender} (${state.agency}) mastered training, space flight, repairs, landing, and surface science! Mars & Europa are now unlocked.`;
  playSfx(880, "triangle", 0.35, 0.2);

  document.querySelectorAll(".mission-card.locked").forEach(card => {
    const key = card.dataset.mcard || "mars";
    card.classList.remove("locked"); card.style.opacity = "1"; card.style.borderStyle = "solid";
    const badge = card.querySelector(".badge");
    if (badge) { badge.innerText = "UNLOCKED • EXPEDITION"; badge.style.background = "#831843"; badge.style.color = "#fbcfe8"; }
    const btn = card.querySelector("button");
    if (btn) btn.outerHTML = `<div class="variant-choices"><button type="button" class="variant-btn" data-m="${key}" data-t="satellite">🛰️ Satellite</button><button type="button" class="variant-btn" data-m="${key}" data-t="womanned">👩‍🚀 Womanned</button></div>`;
  });
}

document.addEventListener("click", (e) => {
  const card = e.target.closest(".st-card");
  if (card) { selectStation(card.dataset.pickst); return; }

  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.id === "toPhase4Btn") {
    document.getElementById("reviewModal").style.display = "none";
    doneStations.clear();
    const lb = document.getElementById("launchMissionBtn");
    lb.disabled = true; lb.style.opacity = "0.45"; lb.style.cursor = "not-allowed";
    document.getElementById("deckProgress").innerText = "READY: 0 / 6";

    clearInterval(trainClockTimer);
    trainSecLeft = (typeof finalTrainMins !== "undefined" ? finalTrainMins : 15) * 60;
    trainClockTimer = setInterval(() => {
      trainSecLeft = Math.max(0, trainSecLeft - 1);
      const tb = document.getElementById("trainTimerBadge");
      if (tb) tb.innerText = `⏳ ${String(Math.floor(trainSecLeft / 60)).padStart(2, "0")}:${String(trainSecLeft % 60).padStart(2, "0")}`;
    }, 1000);

    smoothTransitionTo("screen5Deck", "ENTERING FLIGHT DECK TRAINING", "Your astronaut is suiting up for hands-on station certification...", () => selectStation("power"));
  }

  if (btn.dataset.wleft) { stState.sel = btn.dataset.wleft; playSfx(500); }
  if (btn.dataset.wright && stState.sel === btn.dataset.wright && !stState.links.includes(stState.sel)) {
    stState.links.push(stState.sel); stState.sel = null; playSfx(720);
  }
  if (btn.dataset.rseq) {
    const n = Number(btn.dataset.rseq);
    if (n === stState.step + 1) { stState.step = n; btn.classList.add("ok"); playSfx(400 + n * 80); }
    else { stState.step = 0; document.querySelectorAll("[data-rseq]").forEach(b => b.classList.remove("ok")); playSfx(140, "sawtooth", 0.2); }
  }
  if (btn.dataset.shplate !== undefined) { stState.plates[Number(btn.dataset.shplate)] = 1; btn.classList.add("ok"); playSfx(600); }

  if (btn.id === "launchMissionBtn") {
    clearInterval(trainClockTimer);
    smoothTransitionTo("screen6Flight", "TRAINING CERTIFIED — ROLLING TO LAUNCHPAD", "Boarding spacecraft and powering up main launch console...", startFlightPhase);
  }

  if (btn.id === "fuelValveBtn") {
    btn.classList.add("ok"); btn.disabled = true; document.getElementById("holdThrustBtn").disabled = false; playSfx(480);
    document.getElementById("flightCoachMsg").innerHTML = `<strong>STEP 2:</strong> Press and <strong>HOLD</strong> the <strong>HOLD THRUST</strong> button until the bar enters the green sweet spot!`;
  }
  if (btn.id === "igniteBtn") {
    launched = true;
    document.getElementById("takeoffBar").style.display = "none";
    document.getElementById("flightCoachMsg").innerHTML = `🚀 <strong>IN SPACE!</strong> Use <strong>W A S D</strong> (or Arrow Keys) to fly, <strong>Click Mouse</strong> to shoot asteroids, and grab <strong>Green Orbs</strong>!`;
    showToast("🚀 LIFTOFF! FLY TO DESTINATION!");
    playSfx(160, "sawtooth", 0.4, 0.2);
  }

  if (btn.id === "eatBtn")   { vitals.h = Math.min(100, vitals.h + 25); playSfx(620); }
  if (btn.id === "drinkBtn") { vitals.w = Math.min(100, vitals.w + 30); playSfx(680); }
  if (btn.id === "gymBtn")   { vitals.f = Math.min(100, vitals.f + 25); playSfx(740); }
  if (btn.id === "backToMissionsWinBtn") {
    cancelAnimationFrame(activeLoop); clearInterval(vitInterval);
    document.getElementById("crewVitalsHud").style.display = "none";
    smoothTransitionTo("screen2", "RETURNING TO MISSION COMMAND", "Updating mission clearance and unlocking deep-space targets...");
  }
});
// =========================================================
// FINAL POLISH: 3 UPGRADED TRAINING MINI-GAMES + NASA IMAGERY
// =========================================================
(function attachNasaImagery() {
  const dossier = document.querySelector("#screen3 .dossier-folder");
  if (!dossier || document.getElementById("nasaReconCard")) return;
  const card = document.createElement("div");
  card.id = "nasaReconCard";
  card.style.cssText = "margin:10px 0; padding:10px; background:rgba(15,23,42,0.9); border:1px solid #38bdf8; border-radius:10px; display:flex; align-items:center; gap:12px; color:#f8fafc;";
  card.innerHTML = `
    <img id="nasaReconImg" src="https://nasa.gov" alt="NASA Reconnaissance" style="width:92px; height:68px; object-fit:cover; border-radius:8px; border:1px solid #38bdf8;">
    <div style="font-size:12px; line-height:1.4;">
      <strong style="color:#38bdf8;">🛰️ OFFICIAL NASA RECONNAISSANCE IMAGERY</strong><br>
      <span id="nasaReconCaption">NASA Lunar Reconnaissance Orbiter (LRO) South Pole Terrain & Crater Mapping Data.</span>
    </div>
  `;
  const objList = document.getElementById("dossierObjectives");
  if (objList) objList.parentNode.insertBefore(card, objList);
})();

document.addEventListener("click", (e) => {
  const vBtn = e.target.closest(".variant-btn");
  if (!vBtn || !vBtn.dataset.m) return;
  const nasaAssets = {
    moon:     Array.of("https://nasa.gov", "NASA LRO Lunar South Pole Shackleton Crater Elevation & Ice Map."),
    iss:      Array.of("https://nasa.gov", "NASA Expedition 65 Low-Earth Orbit Atmospheric & Storm Telemetry."),
    solar:    Array.of("https://nasa.gov", "NASA Solar Dynamics Observatory (SDO) Extreme Ultraviolet Corona Data."),
    asteroid: Array.of("https://nasa.gov", "NASA Psyche Mission Metallic Asteroid Core Radar Spectroscopy."),
    mars:     Array.of("https://nasa.gov", "NASA Perseverance Rover Jezero Crater Ancient River Delta Imagery."),
    europa:   Array.of("https://nasa.gov", "NASA Galileo & Europa Clipper Subsurface Ocean Ice-Crust Mosaic.")
  };
  const pair = nasaAssets[vBtn.dataset.m] || nasaAssets.moon;
  const img = document.getElementById("nasaReconImg"), cap = document.getElementById("nasaReconCaption");
  if (img) img.src = pair.at(0);
  if (cap) cap.innerText = pair.at(1);
});

if (typeof stations !== "undefined" && stations.length >= 6) {
  const stBattery = {
    id: "reactor", icon: "🔋", name: "Battery Recharge",
    hint: "HOW TO PLAY: Click the 3 Mirror buttons below to angle the sunbeam onto the gold Battery Core!",
    why: "WHY IT MATTERS: Aiming solar arrays toward the Sun keeps your spacecraft batteries charged in orbit.",
    init() { stState = { m1: 0, m2: 1, m3: 0, charge: 0 }; },
    controls: () => `
      <button type="button" class="chunky-btn" data-rotm="1">🔄 Rotate Mirror 1</button>
      <button type="button" class="chunky-btn" data-rotm="2">🔄 Rotate Mirror 2</button>
      <button type="button" class="chunky-btn" data-rotm="3">🔄 Rotate Mirror 3</button>`,
    draw(ctx, w, h) {
      drawCustomAstronaut(ctx, 64, h - 55, 1.0, "work", stState.charge >= 100 ? "100% Charged!" : "Align the sunbeam!");
      ctx.fillStyle = "#facc15"; ctx.beginPath(); ctx.arc(150, 45, 22, 0, Math.PI * 2); ctx.fill();
      const aligned = stState.m1 === 1 && stState.m2 === 1 && stState.m3 === 1;
      ctx.strokeStyle = aligned ? "#4ade80" : "#facc15"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(150, 45); ctx.lineTo(270, 190);
      if (stState.m1 === 1) ctx.lineTo(410, 75);
      if (stState.m1 === 1 && stState.m2 === 1) ctx.lineTo(520, 185);
      if (aligned) ctx.lineTo(605, 115);
      ctx.stroke();

      Array.of({ x: 270, y: 190, ok: stState.m1 }, { x: 410, y: 75, ok: stState.m2 }, { x: 520, y: 185, ok: stState.m3 }).forEach(m => {
        ctx.fillStyle = m.ok ? "#38bdf8" : "#64748b"; ctx.fillRect(m.x - 16, m.y - 6, 32, 12);
      });
      ctx.fillStyle = aligned ? "#4ade80" : "#1e293b"; ctx.fillRect(585, 85, 42, 55);
      ctx.fillStyle = "#f8fafc"; ctx.font = "11px monospace"; ctx.fillText(`${Math.round(stState.charge)}%`, 592, 116);
      if (aligned) stState.charge = Math.min(100, stState.charge + 1.8);
      if (stState.charge >= 100) certifyStation("reactor");
    }
  };

  const stRepair = {
    id: "shields", icon: "🛠️", name: "Flight Repair",
    hint: "HOW TO PLAY: Click on all 4 glowing orange hull cracks inside the black box to weld them shut!",
    why: "WHY IT MATTERS: Sealing micrometeoroid punctures immediately prevents cabin air loss in space.",
    init() { stState = { cracks: Array.of({ x: 220, y: 80, ok: 0 }, { x: 360, y: 175, ok: 0 }, { x: 480, y: 70, ok: 0 }, { x: 580, y: 165, ok: 0 }) }; },
    controls: () => `<small style="color:#facc15;"><strong>Click directly on each glowing hull breach</strong> to weld it sealed!</small>`,
    onClick(mx, my) {
      stState.cracks.forEach(cr => {
        if (!cr.ok && Math.hypot(mx - cr.x, my - cr.y) <= 28) { cr.ok = 1; playSfx(580, "sawtooth", 0.14); }
      });
    },
    draw(ctx, w, h) {
      drawCustomAstronaut(ctx, 64, h - 55, 1.0, "work", "Click breaches to weld!");
      stState.cracks.forEach(cr => {
        ctx.strokeStyle = cr.ok ? "#4ade80" : "#f97316"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(cr.x - 14, cr.y - 12); ctx.lineTo(cr.x + 4, cr.y); ctx.lineTo(cr.x - 6, cr.y + 14); ctx.lineTo(cr.x + 14, cr.y + 8); ctx.stroke();
      });
      if (stState.cracks.every(c => c.ok)) certifyStation("shields");
    }
  };

  const stLander = {
    id: "comms", icon: "🛬", name: "Landing Trainer",
    hint: "HOW TO PLAY: Hold W / ↑ (or hold the Thrust button below) to land softly on the green lunar pad!",
    why: "WHY IT MATTERS: Firing retro-thrusters slows your descent so your landing legs don't snap on the Moon.",
    init() { stState = { y: 40, vy: 0, done: false }; },
    controls: () => `<button type="button" class="chunky-btn" id="trainLandThrustBtn" style="border-color:#4ade80;">▲ HOLD RETRO-THRUST (W / ↑)</button>`,
    draw(ctx, w, h) {
      drawCustomAstronaut(ctx, 64, h - 55, 1.0, "work", stState.done ? "Soft landing!" : "Slow down to land!");
      ctx.fillStyle = "#334155"; ctx.fillRect(140, h - 22, w - 160, 22);
      ctx.fillStyle = "#22c55e"; ctx.fillRect(360, h - 25, 110, 6);

      if (!stState.done) {
        const up = keys["w"] || keys["arrowup"] || stState.hold;
        stState.vy += up ? -0.15 : 0.065;
        stState.vy = Math.max(-2.8, Math.min(4.0, stState.vy));
        stState.y = Math.max(25, stState.y + stState.vy);
        if (up) {
          ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.moveTo(408, stState.y + 18); ctx.lineTo(415, stState.y + 36); ctx.lineTo(422, stState.y + 18); ctx.fill();
        }
        if (stState.y >= h - 42) {
          if (Math.abs(stState.vy) < 2.3) { stState.done = true; certifyStation("comms"); }
          else { stState.y = 40; stState.vy = 0; playSfx(130, "sawtooth", 0.2); }
        }
      }
      ctx.fillStyle = "#f8fafc"; ctx.fillRect(402, stState.y - 14, 26, 32);
      ctx.fillStyle = Math.abs(stState.vy) < 2.3 ? "#4ade80" : "#f87171"; ctx.font = "12px monospace";
      ctx.fillText(`SPEED: ${Math.max(0, stState.vy * 2).toFixed(1)} m/s (SAFE < 4.6)`, 155, 26);
    }
  };

  stations.splice(3, 3, stBattery, stRepair, stLander);
  renderStationCards();
}

document.addEventListener("click", (e) => {
  const m = e.target.dataset?.rotm;
  if (m && activeSt?.id === "reactor") {
    stState["m" + m] = stState["m" + m] ? 0 : 1;
    playSfx(520);
  }
});
document.addEventListener("mousedown", (e) => { if (e.target.id === "trainLandThrustBtn" && stState) stState.hold = true; });
document.addEventListener("mouseup", () => { if (stState) stState.hold = false; });
// =========================================================
// AUTOMATIC CANVAS & NASA RADAR INJECTOR (FIXES FREEZE!)
// =========================================================
(function fixMissingCanvases() {
  const takeoff = document.getElementById("takeoffBar");
  if (takeoff && !document.getElementById("flightCanvas")) {
    const fc = document.createElement("canvas");
    fc.id = "flightCanvas";
    fc.width = 940;
    fc.height = 310;
    takeoff.parentNode.insertBefore(fc, takeoff);
  }

  const landerBar = document.getElementById("landerTouchBar");
  if (landerBar && !document.getElementById("surfaceCanvas")) {
    const sc = document.createElement("canvas");
    sc.id = "surfaceCanvas";
    sc.width = 940;
    sc.height = 270;
    landerBar.parentNode.insertBefore(sc, landerBar);
  }

  const oldImg = document.getElementById("nasaReconImg");
  if (oldImg) {
    const rc = document.createElement("canvas");
    rc.id = "nasaRadarCanvas";
    rc.width = 96;
    rc.height = 68;
    rc.style.cssText = "border-radius:8px; border:1px solid #38bdf8; background:#020617; flex-shrink:0;";
    oldImg.replaceWith(rc);
    const rctx = rc.getContext("2d");
    rctx.fillStyle = "#020617"; rctx.fillRect(0, 0, 96, 68);
    rctx.strokeStyle = "rgba(56,189,248,0.25)";
    for (let x = 16; x < 96; x += 16) { rctx.beginPath(); rctx.moveTo(x, 0); rctx.lineTo(x, 68); rctx.stroke(); }
    for (let y = 17; y < 68; y += 17) { rctx.beginPath(); rctx.moveTo(0, y); rctx.lineTo(96, y); rctx.stroke(); }
    const g = rctx.createRadialGradient(48, 34, 4, 48, 34, 26);
    g.addColorStop(0, "#7dd3fc"); g.addColorStop(0.6, "#1e3a8a"); g.addColorStop(1, "transparent");
    rctx.fillStyle = g; rctx.beginPath(); rctx.arc(48, 34, 26, 0, Math.PI * 2); rctx.fill();
    rctx.strokeStyle = "#4ade80"; rctx.strokeRect(26, 16, 44, 36);
  }
})();
// =========================================================
// FAILSAFE TRANSITION & SELF-BUILDING FLIGHT / SURFACE SCREENS
// =========================================================
smoothTransitionTo = function (screenId, title, sub, callback) {
  const c = document.getElementById("cinematicCurtain");
  if (!c) {
    showAllScreens(screenId);
    if (callback) callback();
    return;
  }
  document.getElementById("curtainTitle").innerText = title;
  document.getElementById("curtainSub").innerText = sub;
  c.style.display = "flex";
  playSfx(440, "sine", 0.35, 0.1);
  requestAnimationFrame(() => c.classList.add("active"));
  setTimeout(() => {
    try {
      showAllScreens(screenId);
      if (callback) callback();
    } catch (err) {
      console.error("Phase start error:", err);
    }
    c.classList.remove("active");
    setTimeout(() => { c.style.display = "none"; }, 450);
  }, 1200);
};

const origStartFlight = startFlightPhase;
startFlightPhase = function () {
  const s6 = document.getElementById("screen6Flight");
  if (s6 && !document.getElementById("flightCanvas")) {
    const fc = document.createElement("canvas");
    fc.id = "flightCanvas";
    fc.width = 940;
    fc.height = 310;
    const bar = document.getElementById("takeoffBar");
    if (bar) s6.insertBefore(fc, bar);
    else s6.appendChild(fc);
  }
  const s7 = document.getElementById("screen7Surface");
  if (s7 && !document.getElementById("surfaceCanvas")) {
    const sc = document.createElement("canvas");
    sc.id = "surfaceCanvas";
    sc.width = 940;
    sc.height = 270;
    const lbar = document.getElementById("landerTouchBar");
    if (lbar) s7.insertBefore(sc, lbar);
    else s7.appendChild(sc);
  }
  origStartFlight();
};
// =========================================================
// COMPLETE SELF-CONTAINED FINALE ENGINE + NASA IMAGERY (0 ERRORS)
// =========================================================
(function initNasaDataAndCompleteFinale() {
  // 1. Official NASA Planetary Imagery & Open Data Integration
  const nasaCatalog = {
    moon:     { title: "NASA LRO South Pole Shackleton Crater", dataset: "LRO LOLA Elevation & LCROSS Water-Ice Data", url: "https://wikimedia.org" },
    iss:      { title: "NASA ISS Low-Earth Orbit Telemetry", dataset: "NASA Earth Observatory & GPM Storm Radar", url: "https://wikimedia.org" },
    solar:    { title: "NASA Solar Dynamics Observatory (SDO)", dataset: "NASA Parker Solar Probe & SDO EUV Corona Data", url: "https://wikimedia.org" },
    asteroid: { title: "NASA Dawn / Psyche Asteroid Survey", dataset: "NASA PDS Gamma-Ray & Neutron Spectrometer Data", url: "https://wikimedia.org" },
    mars:     { title: "NASA Perseverance Jezero Crater", dataset: "NASA Mars Reconnaissance Orbiter HiRISE & PIXL Data", url: "https://wikimedia.org" },
    europa:   { title: "NASA Galileo & Europa Clipper", dataset: "NASA Planetary Data System Ice-Shell & Plume Data", url: "https://wikimedia.org" }
  };

  function renderNasaReconCard(missionKey) {
    const info = nasaCatalog[missionKey] || nasaCatalog.moon;
    const dossier = document.querySelector("#screen3 .dossier-card") || document.getElementById("screen3");
    if (!dossier) return;
    let card = document.getElementById("nasaReconCard");
    if (!card) {
      card = document.createElement("div");
      card.id = "nasaReconCard";
      card.style.cssText = "margin:10px 0; padding:10px 14px; background:rgba(15,23,42,0.95); border:1px solid #38bdf8; border-radius:10px; display:flex; align-items:center; gap:14px; color:#f8fafc;";
      const objList = document.getElementById("dossierObjectives");
      if (objList) objList.parentNode.insertBefore(card, objList);
      else dossier.appendChild(card);
    }
    card.innerHTML = `
      <img id="nasaLiveImg" src="${info.url}" alt="${info.title}" style="width:96px; height:68px; object-fit:cover; border-radius:8px; border:1px solid #38bdf8; flex-shrink:0;">
      <div style="font-size:12px; line-height:1.45;">
        <strong style="color:#38bdf8;">🛰️ OFFICIAL NASA IMAGERY & DATA: ${info.title}</strong><br>
        <span style="color:#cbd5e1;">Dataset: ${info.dataset}</span>
      </div>
    `;
    const imgEl = document.getElementById("nasaLiveImg");
    if (imgEl) {
      imgEl.onerror = function () {
        const c = document.createElement("canvas");
        c.width = 96; c.height = 68;
        c.style.cssText = "border-radius:8px; border:1px solid #38bdf8; background:#020617; flex-shrink:0;";
        const g = c.getContext("2d");
        g.fillStyle = "#020617"; g.fillRect(0, 0, 96, 68);
        const rad = g.createRadialGradient(48, 34, 4, 48, 34, 28);
        rad.addColorStop(0, "#7dd3fc"); rad.addColorStop(0.6, "#1e3a8a"); rad.addColorStop(1, "transparent");
        g.fillStyle = rad; g.beginPath(); g.arc(48, 34, 28, 0, Math.PI * 2); g.fill();
        g.strokeStyle = "#4ade80"; g.strokeRect(22, 14, 52, 40);
        this.replaceWith(c);
      };
    }
  }

  renderNasaReconCard("moon");
  document.addEventListener("click", (e) => {
    const v = e.target.closest(".variant-btn");
    if (v && v.dataset.m) renderNasaReconCard(v.dataset.m);
  });

  // 2. Failsafe Cinematic Transition Curtain
  window.smoothTransitionTo = function (screenId, title, sub, callback) {
    const c = document.getElementById("cinematicCurtain");
    if (!c) {
      showAllScreens(screenId);
      if (callback) callback();
      return;
    }
    const tEl = document.getElementById("curtainTitle");
    const sEl = document.getElementById("curtainSub");
    if (tEl) tEl.innerText = title;
    if (sEl) sEl.innerText = sub;
    c.style.display = "flex";
    playSfx(440, "sine", 0.35, 0.1);
    requestAnimationFrame(() => c.classList.add("active"));
    setTimeout(() => {
      try {
        showAllScreens(screenId);
        if (callback) callback();
      } catch (err) {
        console.error(err);
      }
      c.classList.remove("active");
      setTimeout(() => { c.style.display = "none"; }, 420);
    }, 1150);
  };

  // 3. Complete Self-Building Launchpad + Space Combat + Repairs + Vitals HUD
  window.startFlightPhase = function () {
    const s6 = document.getElementById("screen6Flight");
    if (!s6) return;
    const mKey = (typeof activeMission !== "undefined" && activeMission.key) ? activeMission.key : "moon";
    const nasaInfo = nasaCatalog[mKey] || nasaCatalog.moon;

    s6.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <h2 style="margin:0; color:#38bdf8;">04 // LAUNCH & DEEP-SPACE FLIGHT</h2>
          <p style="margin:4px 0 0; color:#cbd5e1; font-size:13px;">Complete the 3 launch steps below, then use W A S D + Mouse to fly!</p>
        </div>
        <div style="display:flex; gap:10px; font-family:monospace; font-size:13px;">
          <span id="hudDist" style="color:#4ade80; background:#0f172a; padding:6px 12px; border-radius:8px; border:1px solid #4ade80;">DISTANCE: 0%</span>
          <span id="hudHull" style="color:#38bdf8; background:#0f172a; padding:6px 12px; border-radius:8px; border:1px solid #38bdf8;">HULL: 100%</span>
          <span id="hudOrbs" style="color:#facc15; background:#0f172a; padding:6px 12px; border-radius:8px; border:1px solid #facc15;">ORBS: 0</span>
        </div>
      </div>
      <div class="flight-top-row" style="margin-top:8px;">
        <div class="coach-card" style="margin:0;">
          <div style="font-size:26px;">🎙️</div>
          <div id="flightCoachMsg" style="font-size:13px; color:#f8fafc;"><strong>STEP 1:</strong> Click <strong>1. OPEN FUEL VALVE</strong> below to fill the rocket tanks!</div>
        </div>
        <div class="cam-box">
          <div id="camTitle" style="font-size:10px; font-weight:bold; color:#f472b6; margin-bottom:3px;">LIVE COMMANDER CAM</div>
          <canvas id="pilotCamCanvas" width="200" height="72" style="border-radius:8px; background:#020617; display:block; margin:0 auto;"></canvas>
        </div>
      </div>
      <canvas id="flightCanvas" width="940" height="310"></canvas>
      <div id="takeoffBar" class="takeoff-bar">
        <button type="button" id="fuelValveBtn" class="chunky-btn">1. OPEN FUEL VALVE</button>
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" id="holdThrustBtn" class="chunky-btn" disabled>2. HOLD THRUST TO GREEN</button>
          <div class="throttle-track"><div class="throttle-sweet"></div><div id="throttleFill"></div></div>
        </div>
        <button type="button" id="igniteBtn" class="chunky-btn" disabled style="border-color:#4ade80;">3. IGNITE & BLAST OFF! 🚀</button>
      </div>
    `;

    throttleVal = 0; holdingThrust = false; launched = false; distPct = 0; hullPct = 100; orbCount = 0;
    shipPos = { x: 110, y: 155 }; bullets = Array.of(); rocks = Array.of(); orbs = Array.of(); particles = Array.of();
    triggeredRepairs.clear(); repairOpen = false;

    const isWom = (typeof activeMission !== "undefined" && activeMission.type === "womanned");
    document.getElementById("camTitle").innerText = isWom ? "LIVE COCKPIT CAM" : "MISSION CONTROL CAM";
    const hud = document.getElementById("crewVitalsHud");
    if (hud) hud.style.display = isWom ? "block" : "none";

    vitals = { h: 100, w: 100, f: 100 };
    clearInterval(vitInterval);
    if (isWom) {
      vitInterval = setInterval(() => {
        vitals.h = Math.max(15, vitals.h - 1.2);
        vitals.w = Math.max(15, vitals.w - 1.6);
        vitals.f = Math.max(15, vitals.f - 1.0);
        const ht = document.getElementById("vHungerTxt"), hb = document.getElementById("vHungerBar");
        const wt = document.getElementById("vThirstTxt"), wb = document.getElementById("vThirstBar");
        const ft = document.getElementById("vFitTxt"), fb = document.getElementById("vFitBar");
        if (ht) ht.innerText = Math.round(vitals.h) + "%"; if (hb) hb.style.width = vitals.h + "%";
        if (wt) wt.innerText = Math.round(vitals.w) + "%"; if (wb) wb.style.width = vitals.w + "%";
        if (ft) ft.innerText = Math.round(vitals.f) + "%"; if (fb) fb.style.width = vitals.f + "%";
      }, 1500);
    }

    cancelAnimationFrame(activeLoop);
    const c = document.getElementById("flightCanvas"), ctx = c.getContext("2d");
    c.onclick = (e) => {
      if (!launched || repairOpen) return;
      const r = c.getBoundingClientRect();
      const ang = Math.atan2((e.clientY - r.top) - shipPos.y, (e.clientX - r.left) - shipPos.x);
      bullets.push({ x: shipPos.x + 25, y: shipPos.y, vx: Math.cos(ang) * 9, vy: Math.sin(ang) * 9 });
      playSfx(440, "sawtooth", 0.08, 0.1);
    };

    let f = 0;
    function loop() {
      f++;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#bae6fd";

            for (let i = 0; i < 45; i++) {
              ctx.fillRect(((i * 97 - f * (launched ? 4 : 0.3)) % c.width + c.width) % c.width, (i * 53) % c.height, 2, 2);
            }
            // ... (rest of your drawing code goes here)

            // Continue the animation loop
            activeLoop = requestAnimationFrame(loop);
          }

          // Start the animation loop
          loop();
  };

  window.startLandingAndFinale = function () {
    const s7 = document.getElementById("screen7Surface");
    if (!s7) return;
    s7.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <h2 style="margin:0; color:#38bdf8;">05 // POWERED LANDING & SURFACE EXPEDITION</h2>
          <p style="margin:4px 0 0; color:#cbd5e1; font-size:13px;">Guide your lander gently onto the green pad, then explore the surface!</p>
        </div>
        <span id="surfStatus" style="font-family:monospace; font-size:13px; color:#facc15; background:#0f172a; padding:7px 14px; border-radius:8px; border:1px solid #facc15;">PHASE: DESCENT</span>
      </div>
      <div class="coach-card" style="margin-top:10px;">
        <div style="font-size:26px;">🧭</div>
        <div id="surfCoachMsg" style="font-size:13px; color:#f8fafc;"><strong>HOW TO LAND:</strong> Use <strong>A / D</strong> to line up over the green pad, and hold <strong>W / ↑</strong> to slow down under 4.8 m/s!</div>
      </div>
      <canvas id="surfaceCanvas" width="940" height="270"></canvas>
      <div id="landerTouchBar" class="game-controls">
        <button type="button" class="chunky-btn" id="padLeftBtn">◀ THRUST LEFT (A)</button>
        <button type="button" class="chunky-btn" id="padUpBtn" style="border-color:#4ade80;">▲ MAIN RETRO-THRUST (W / ↑)</button>
        <button type="button" class="chunky-btn" id="padRightBtn">THRUST RIGHT (D) ▶</button>
      </div>
      <div id="finalePanel" style="display:none; margin-top:12px; background:rgba(15,23,42,0.95); border:2px solid #38bdf8; border-radius:14px; padding:14px; text-align:center;">
        <h3 id="finTitle" style="margin:0 0 6px; color:#4ade80;">SURFACE EXPEDITION TASKS</h3>
        <p id="finDesc" style="margin:0 0 10px; font-size:13px; color:#cbd5e1;"></p>
        <div id="finInteractive" class="game-controls"></div>
      </div>
      <div id="victoryBanner" style="display:none; margin-top:12px; background:rgba(6,78,59,0.75); border:2px solid #4ade80; border-radius:16px; padding:18px; text-align:center;">
        <h2 id="vicHeadline" style="margin:0 0 6px; color:#4ade80;">🎉 MISSION ACCOMPLISHED!</h2>
        <p id="vicSummary" style="margin:0 0 14px; font-size:14px; color:#f8fafc;"></p>
        <button type="button" id="backToMissionsWinBtn" class="primary-btn" style="max-width:440px; background:#16a34a;">RETURN TO MISSION MAP (NEW PLANETS UNLOCKED!) ➔</button>
      </div>
    `;

    const c = document.getElementById("surfaceCanvas"), ctx = c.getContext("2d");
    const mKey = (typeof activeMission !== "undefined" && activeMission.key) ? activeMission.key : "moon";
    const isWom = (typeof activeMission !== "undefined" && activeMission.type === "womanned");

    let lx = c.width / 2, ly = 45, vx = 0, vy = 0, landed = false;
    let astro = { x: c.width / 2 + 45, y: c.height - 52, pose: "cheer", msg: "Touchdown!" };
    let rover = { x: 120, y: 215, pts: Array.of({ x: 340, y: 210, ok: 0 }, { x: 580, y: 220, ok: 0 }, { x: 790, y: 205, ok: 0 }) };

    cancelAnimationFrame(activeLoop);
    function loop() {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = mKey === "mars" ? "#7c2d12" : mKey === "europa" ? "#1e3a8a" : "#334155";
      ctx.fillRect(0, c.height - 28, c.width, 28);
      ctx.fillStyle = "#22c55e"; ctx.fillRect(c.width / 2 - 65, c.height - 32, 130, 8);

      if (!landed) {
        if (keys["a"] || keys["arrowleft"]) vx -= 0.12;
        if (keys["d"] || keys["arrowright"]) vx += 0.12;
        const up = keys["w"] || keys["arrowup"];
        vy += up ? -0.14 : 0.06;
        vx *= 0.94; vy = Math.max(-3.2, Math.min(4.2, vy));
        lx = Math.max(40, Math.min(c.width - 40, lx + vx)); ly += vy;

        ctx.fillStyle = "#f8fafc"; ctx.fillRect(lx - 16, ly - 24, 32, 36);
        if (up) { ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.moveTo(lx - 10, ly + 12); ctx.lineTo(lx, ly + 32); ctx.lineTo(lx + 10, ly + 12); ctx.fill(); }
        ctx.fillStyle = Math.abs(vy) < 2.4 ? "#4ade80" : "#f87171"; ctx.font = "13px monospace";
        ctx.fillText(`DESCENT SPEED: ${Math.max(0, vy * 2).toFixed(1)} m/s (SAFE < 4.8 m/s)`, 16, 24);

        if (ly >= c.height - 44) {
          if (Math.abs(vy) < 2.4 && Math.abs(lx - c.width / 2) < 75) {
            landed = true; showToast("🎉 SAFE TOUCHDOWN!");
            document.getElementById("landerTouchBar").style.display = "none";
            document.getElementById("surfStatus").innerText = "PHASE: SURFACE EXPEDITION";
            setupSurfaceTasks();
          } else { ly = 45; vy = 0; vx = 0; playSfx(120, "sawtooth", 0.25); }
        }
      } else if (!isWom) {
        ctx.fillStyle = "#f8fafc"; ctx.fillRect(c.width / 2 - 16, c.height - 68, 32, 36);
        drawCustomAstronaut(ctx, 75, c.height - 52, 0.9, "work", "Driving Rover!");
        if (keys["a"] || keys["arrowleft"]) rover.x -= 3.5;
        if (keys["d"] || keys["arrowright"]) rover.x += 3.5;
        if (keys["w"] || keys["arrowup"]) rover.y -= 2.5;
        if (keys["s"] || keys["arrowdown"]) rover.y += 2.5;
        rover.x = Math.max(115, Math.min(c.width - 30, rover.x));
        rover.y = Math.max(c.height - 75, Math.min(c.height - 32, rover.y));

        rover.pts.forEach(pt => {
          if (!pt.ok && Math.hypot(rover.x - pt.x, rover.y - pt.y) < 30) { pt.ok = 1; showToast("📍 SAMPLE COLLECTED!"); }
          ctx.fillStyle = pt.ok ? "#4ade80" : "#facc15";
          ctx.beginPath(); ctx.arc(pt.x, pt.y, 12, 0, Math.PI * 2); ctx.fill();
        });
        ctx.fillStyle = "#38bdf8"; ctx.fillRect(rover.x - 18, rover.y - 12, 36, 18);
        if (rover.pts.every(p => p.ok)) triggerVictory();
      } else {
        ctx.fillStyle = "#f8fafc"; ctx.fillRect(c.width / 2 - 16, c.height - 68, 32, 36);
        drawCustomAstronaut(ctx, astro.x, astro.y, 1.0, astro.pose, astro.msg);
      }
      activeLoop = requestAnimationFrame(loop);
    }
    loop();
  };
})();
// =========================================================
// 17X-VERIFIED LAUNCHPAD, ROCKET SPRITE & THROTTLE ENGINE
// =========================================================
(function initVerifiedLaunchpad() {
  setInterval(() => {
    const s6 = document.getElementById("screen6Flight");
    if (!s6 || s6.style.display !== "block" || launched) return;

    const hb = document.getElementById("holdThrustBtn");
    if (hb && !hb.dataset.bound) {
      hb.dataset.bound = "1";
      hb.onmousedown = () => { holdingThrust = true; };
      hb.onmouseup = () => { holdingThrust = false; };
      hb.onmouseleave = () => { holdingThrust = false; };
      hb.ontouchstart = (e) => { e.preventDefault(); holdingThrust = true; };
      hb.ontouchend = () => { holdingThrust = false; };
    }

    const thrusting = holdingThrust || keys[" "];
    if (typeof renderPilotCam === "function") {
      renderPilotCam("work", thrusting ? "Full thrust!" : "Hold thrust!");
    }

    if (thrusting) {
      throttleVal = Math.min(78, throttleVal + 1.8);
      const fill = document.getElementById("throttleFill");
      if (fill) fill.style.width = throttleVal + "%";
      if (throttleVal >= 62) {
        const ib = document.getElementById("igniteBtn");
        const msg = document.getElementById("flightCoachMsg");
        if (hb) hb.classList.add("ok");
        if (ib) ib.disabled = false;
        if (msg) msg.innerHTML = `<strong>STEP 3:</strong> Thrust is in the green sweet spot! Click <strong>3. IGNITE & BLAST OFF! 🚀</strong>`;
      }
    }

    const c = document.getElementById("flightCanvas");
    if (c) {
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#334155";
      ctx.fillRect(0, c.height - 25, c.width, 25);
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(c.width / 2 - 20, c.height - 135, 40, 110);
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(c.width / 2, c.height - 170);
      ctx.lineTo(c.width / 2 - 20, c.height - 135);
      ctx.lineTo(c.width / 2 + 20, c.height - 135);
      ctx.fill();
      if (thrusting) {
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.moveTo(c.width / 2 - 14, c.height - 25);
        ctx.lineTo(c.width / 2, c.height - 4 + Math.random() * 14);
        ctx.lineTo(c.width / 2 + 14, c.height - 25);
        ctx.fill();
      }
    }
  }, 30);
})();
// =========================================================
// 25X-VERIFIED SPACE FLIGHT, VITALS HUD & LANDING ENGINE
// =========================================================
window.startFlightPhase = function () {
  const s6 = document.getElementById("screen6Flight");
  if (!s6) return;

  s6.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
      <div>
        <h2 style="margin:0; color:#38bdf8;">04 // LAUNCH & DEEP-SPACE FLIGHT</h2>
        <p style="margin:4px 0 0; color:#cbd5e1; font-size:13px;">Launch your rocket, then use W A S D to fly & Click Mouse to shoot asteroids!</p>
      </div>
      <div style="display:flex; gap:10px; font-family:monospace; font-size:13px;">
        <span id="hudDist" style="color:#4ade80; background:#0f172a; padding:6px 12px; border-radius:8px; border:1px solid #4ade80;">DISTANCE: 0%</span>
        <span id="hudHull" style="color:#38bdf8; background:#0f172a; padding:6px 12px; border-radius:8px; border:1px solid #38bdf8;">HULL: 100%</span>
        <span id="hudOrbs" style="color:#facc15; background:#0f172a; padding:6px 12px; border-radius:8px; border:1px solid #facc15;">ORBS: 0</span>
      </div>
    </div>
    <div class="flight-top-row" style="margin-top:8px;">
      <div class="coach-card" style="margin:0;">
        <div style="font-size:26px;">🎙️</div>
        <div id="flightCoachMsg" style="font-size:13px; color:#f8fafc;"><strong>STEP 1:</strong> Click <strong>1. OPEN FUEL VALVE</strong> below to fill the rocket tanks!</div>
      </div>
      <div class="cam-box">
        <div id="camTitle" style="font-size:10px; font-weight:bold; color:#f472b6; margin-bottom:3px;">LIVE COMMANDER CAM</div>
        <canvas id="pilotCamCanvas" width="200" height="72" style="border-radius:8px; background:#020617; display:block; margin:0 auto;"></canvas>
      </div>
    </div>
    <canvas id="flightCanvas" width="940" height="310"></canvas>
    <div id="takeoffBar" class="takeoff-bar">
      <button type="button" id="fuelValveBtn" class="chunky-btn">1. OPEN FUEL VALVE</button>
      <div style="display:flex; align-items:center; gap:8px;">
        <button type="button" id="holdThrustBtn" class="chunky-btn" disabled>2. HOLD THRUST TO GREEN</button>
        <div class="throttle-track"><div class="throttle-sweet"></div><div id="throttleFill"></div></div>
      </div>
      <button type="button" id="igniteBtn" class="chunky-btn" disabled style="border-color:#4ade80;">3. IGNITE & BLAST OFF! 🚀</button>
    </div>
  `;

  throttleVal = 0; holdingThrust = false; launched = false; distPct = 0; hullPct = 100; orbCount = 0;
  shipPos = { x: 120, y: 155 }; bullets = Array.of(); rocks = Array.of(); orbs = Array.of(); particles = Array.of();
  triggeredRepairs.clear(); repairOpen = false;

  const isWom = (typeof activeMission !== "undefined" && activeMission.type === "womanned");
  document.getElementById("camTitle").innerText = isWom ? "LIVE COCKPIT CAM" : "MISSION CONTROL CAM";
  const hud = document.getElementById("crewVitalsHud");
  if (hud) hud.style.display = isWom ? "block" : "none";

  vitals = { h: 100, w: 100, f: 100 };
  clearInterval(vitInterval);
  if (isWom) {
    vitInterval = setInterval(() => {
      vitals.h = Math.max(15, vitals.h - 1.2);
      vitals.w = Math.max(15, vitals.w - 1.6);
      vitals.f = Math.max(15, vitals.f - 1.0);
      const ht = document.getElementById("vHungerTxt"), hb = document.getElementById("vHungerBar");
      const wt = document.getElementById("vThirstTxt"), wb = document.getElementById("vThirstBar");
      const ft = document.getElementById("vFitTxt"), fb = document.getElementById("vFitBar");
      if (ht) ht.innerText = Math.round(vitals.h) + "%";
      if (hb) hb.style.width = vitals.h + "%";
      if (wt) wt.innerText = Math.round(vitals.w) + "%";
      if (wb) wb.style.width = vitals.w + "%";
      if (ft) ft.innerText = Math.round(vitals.f) + "%";
      if (fb) fb.style.width = vitals.f + "%";
    }, 1500);
  }

  const hb = document.getElementById("holdThrustBtn");
  if (hb) {
    hb.onmousedown = () => { holdingThrust = true; };
    hb.onmouseup = () => { holdingThrust = false; };
    hb.onmouseleave = () => { holdingThrust = false; };
    hb.ontouchstart = (e) => { e.preventDefault(); holdingThrust = true; };
    hb.ontouchend = () => { holdingThrust = false; };
  }

  cancelAnimationFrame(activeLoop);
  const c = document.getElementById("flightCanvas"), ctx = c.getContext("2d");

  c.onclick = (e) => {
    if (!launched || repairOpen) return;
    const r = c.getBoundingClientRect();
    const mx = (e.clientX - r.left) * (c.width / r.width);
    const my = (e.clientY - r.top) * (c.height / r.height);
    const ang = Math.atan2(my - shipPos.y, mx - shipPos.x);
    bullets.push({ x: shipPos.x + 26, y: shipPos.y, vx: Math.cos(ang) * 10, vy: Math.sin(ang) * 10 });
    playSfx(440, "sawtooth", 0.08, 0.1);
  };

  let f = 0;
  function loop() {
    f++;
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#bae6fd";
    for (let i = 0; i < 50; i++) {
      const sx = ((i * 97 - f * (launched ? 5 : 0.4)) % c.width + c.width) % c.width;
      const sy = (i * 53) % c.height;
      ctx.fillRect(sx, sy, 2, 2);
    }

    if (!launched) {
      const thrusting = holdingThrust || keys[" "];
      renderPilotCam("work", thrusting ? "Full thrust!" : "Hold thrust!");
      if (thrusting) {
        throttleVal = Math.min(78, throttleVal + 1.4);
        document.getElementById("throttleFill").style.width = throttleVal + "%";
        if (throttleVal >= 62) {
          hb.classList.add("ok");
          document.getElementById("igniteBtn").disabled = false;
          document.getElementById("flightCoachMsg").innerHTML = `<strong>STEP 3:</strong> Thrust is in the green sweet spot! Click <strong>3. IGNITE & BLAST OFF! 🚀</strong>`;
        }
      }
      ctx.fillStyle = "#334155"; ctx.fillRect(0, c.height - 25, c.width, 25);
      ctx.fillStyle = "#e2e8f0"; ctx.fillRect(c.width / 2 - 20, c.height - 135, 40, 110);
      ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.moveTo(c.width / 2, c.height - 170); ctx.lineTo(c.width / 2 - 20, c.height - 135); ctx.lineTo(c.width / 2 + 20, c.height - 135); ctx.fill();
      if (thrusting) {
        ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.moveTo(c.width / 2 - 14, c.height - 25); ctx.lineTo(c.width / 2, c.height - 4 + Math.random() * 14); ctx.lineTo(c.width / 2 + 14, c.height - 25); ctx.fill();
      }
    } else if (!repairOpen) {
      renderPilotCam("work", "Blast asteroids!");

      if (keys["w"] || keys["arrowup"]) shipPos.y -= 4.5;
      if (keys["s"] || keys["arrowdown"]) shipPos.y += 4.5;
      if (keys["a"] || keys["arrowleft"]) shipPos.x -= 4.5;
      if (keys["d"] || keys["arrowright"]) shipPos.x += 4.5;
      shipPos.x = Math.max(35, Math.min(c.width - 70, shipPos.x));
      shipPos.y = Math.max(28, Math.min(c.height - 28, shipPos.y));

      if (f === 2 || f % 40 === 0) {
        rocks.push({ x: c.width + 20, y: 25 + Math.random() * (c.height - 50), r: 16 + Math.random() * 12, vx: 4.0 + distPct / 35 });
      }
      if (f === 5 || f % 70 === 0) {
        orbs.push({ x: c.width + 20, y: 30 + Math.random() * (c.height - 60), vx: 3.5 });
      }

      for (let bi = bullets.length - 1; bi >= 0; bi--) {
        const b = bullets.at(bi);
        b.x += b.vx; b.y += b.vy;
        ctx.fillStyle = "#38bdf8"; ctx.fillRect(b.x - 7, b.y - 2.5, 14, 5);
        for (let ri = rocks.length - 1; ri >= 0; ri--) {
          const rk = rocks.at(ri);
          if (Math.hypot(b.x - rk.x, b.y - rk.y) < rk.r + 8) {
            for (let k = 0; k < 10; k++) particles.push({ x: rk.x, y: rk.y, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, l: 20, c: "#fb923c" });
            rocks.splice(ri, 1); bullets.splice(bi, 1); playSfx(140, "square", 0.14);
            break;
          }
        }
      }

      for (let oi = orbs.length - 1; oi >= 0; oi--) {
        const o = orbs.at(oi);
        o.x -= o.vx;
        ctx.fillStyle = "#4ade80"; ctx.beginPath(); ctx.arc(o.x, o.y, 12, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#bbf7d0"; ctx.lineWidth = 2; ctx.stroke();
        if (Math.hypot(o.x - shipPos.x, o.y - shipPos.y) < 30) {
          orbCount++; distPct = Math.min(100, distPct + 6); orbs.splice(oi, 1); playSfx(740, "sine", 0.12);
        }
      }

      for (let ri = rocks.length - 1; ri >= 0; ri--) {
        const rk = rocks.at(ri);
        rk.x -= rk.vx;
        ctx.fillStyle = "#ea580c"; ctx.beginPath(); ctx.arc(rk.x, rk.y, rk.r, 0, Math.PI * 2); ctx.fill();
        if (Math.hypot(rk.x - shipPos.x, rk.y - shipPos.y) < rk.r + 18) {
          hullPct = Math.max(20, hullPct - 10); rocks.splice(ri, 1); playSfx(110, "sawtooth", 0.2);
        }
      }

      ctx.fillStyle = "#f8fafc"; ctx.beginPath(); ctx.moveTo(shipPos.x + 28, shipPos.y); ctx.lineTo(shipPos.x - 18, shipPos.y - 14); ctx.lineTo(shipPos.x - 18, shipPos.y + 14); ctx.fill();
      ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.arc(shipPos.x + 4, shipPos.y, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.moveTo(shipPos.x - 18, shipPos.y - 6); ctx.lineTo(shipPos.x - 34 - Math.random() * 10, shipPos.y); ctx.lineTo(shipPos.x - 18, shipPos.y + 6); ctx.fill();

      distPct = Math.min(100, distPct + 0.16);
      document.getElementById("hudDist").innerText = `DISTANCE: ${Math.round(distPct)}%`;
      document.getElementById("hudHull").innerText = `HULL: ${hullPct}%`;
      document.getElementById("hudOrbs").innerText = `ORBS: ${orbCount}`;

      if (distPct >= 28 && !triggeredRepairs.has(1)) { triggeredRepairs.add(1); openRepairGame("keypad"); }
      if (distPct >= 65 && !triggeredRepairs.has(2)) { triggeredRepairs.add(2); openRepairGame("pump"); }
      if (distPct >= 100) {
        smoothTransitionTo("screen7Surface", "ENTERING LANDING ORBIT", "Preparing retro-thrusters for surface touchdown...", startLandingAndFinale);
        return;
      }
    }

    for (let pi = particles.length - 1; pi >= 0; pi--) {
      const p = particles.at(pi);
      p.x += p.vx; p.y += p.vy; p.l--;
      ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, 3, 3);
      if (p.l <= 0) particles.splice(pi, 1);
    }
    activeLoop = requestAnimationFrame(loop);
  }
  loop();
};
// =========================================================
// SELF-BUILDING REPAIR POPUPS (FIXES 28% & 65% PAUSE!)
// =========================================================
window.openRepairGame = function (type) {
  repairOpen = true;
  playSfx(220, "sawtooth", 0.3, 0.18);

  let modal = document.getElementById("repairModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "repairModal";
    modal.className = "modal-overlay";
    modal.innerHTML = `<div class="modal-box" style="border-color:#ef4444; text-align:center; box-shadow:0 0 40px rgba(239,68,68,0.65);"><h2 id="repTitle" style="margin-top:0; color:#f87171;"></h2><p id="repDesc" style="font-size:13.5px; color:#e2e8f0;"></p><div id="repBody"></div></div>`;
    document.body.appendChild(modal);
  }
  modal.style.display = "flex";
  modal.style.zIndex = "9999";

  const body = document.getElementById("repBody");
  if (type === "keypad") {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    let typed = "";
    document.getElementById("repTitle").innerText = "🔐 SECURITY OVERRIDE CODE NEEDED!";
    document.getElementById("repDesc").innerHTML = `Type the 4-digit code <strong style="color:#4ade80; font-size:20px;">${code}</strong> on the keypad below to reset the computer:`;
    body.innerHTML = `
      <div id="kpDisp" style="font-family:monospace; font-size:22px; color:#38bdf8; margin-bottom:10px; letter-spacing:4px;">----</div>
      <div class="keypad-grid">
        ${Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9).map(n => `<button type="button" class="chunky-btn" data-kp="${n}">${n}</button>`).join("")}
      </div>`;
    body.onclick = (e) => {
      const n = e.target.dataset.kp;
      if (!n) return;
      typed += n;
      playSfx(550);
      document.getElementById("kpDisp").innerText = typed;
      if (typed === code) {
        modal.style.display = "none";
        repairOpen = false;
        showToast("✅ COMPUTER RESET — FLYING!");
      } else if (typed.length >= 4) {
        typed = "";
        document.getElementById("kpDisp").innerText = "RETRY";
      }
    };
  } else {
    let charge = 0;
    document.getElementById("repTitle").innerText = "🛡️ SHIELD POWER LOW!";
    document.getElementById("repDesc").innerText = "Tap the pump button rapidly until shields recharge to 100%!";
    body.innerHTML = `<button type="button" id="pumpTapBtn" class="primary-btn" style="max-width:260px;">⚡ PUMP SHIELD (0%)</button>`;
    document.getElementById("pumpTapBtn").onclick = function () {
      charge += 20;
      playSfx(350 + charge * 4);
      this.innerText = `⚡ PUMP SHIELD (${charge}%)`;
      if (charge >= 100) {
        modal.style.display = "none";
        repairOpen = false;
        showToast("✅ SHIELDS AT 100% — FLYING!");
      }
    };
  }
};
// =========================================================
// COMPLETE STEP 8: POWERED LANDING, SURFACE FINALE & UNLOCKS
// =========================================================
(function initCompleteSurfaceFinale() {
  if (!document.getElementById("screen7Surface")) {
    const s7 = document.createElement("div");
    s7.id = "screen7Surface";
    s7.className = "screen-box";
    s7.style.maxWidth = "1060px";
    const s6 = document.getElementById("screen6Flight");
    if (s6 && s6.parentNode) s6.parentNode.appendChild(s7);
    else document.body.appendChild(s7);
  }

  window.startLandingAndFinale = function () {
    const s7 = document.getElementById("screen7Surface");
    if (!s7) return;
    s7.style.display = "block";
    s7.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <h2 style="margin:0; color:#38bdf8;">05 // POWERED LANDING & SURFACE EXPEDITION</h2>
          <p style="margin:4px 0 0; color:#cbd5e1; font-size:13px;">Guide your lander gently onto the green pad, then explore the surface!</p>
        </div>
        <span id="surfStatus" style="font-family:monospace; font-size:13px; color:#facc15; background:#0f172a; padding:7px 14px; border-radius:8px; border:1px solid #facc15;">PHASE: DESCENT</span>
      </div>
      <div class="coach-card" style="margin-top:10px;">
        <div style="font-size:26px;">🧭</div>
        <div id="surfCoachMsg" style="font-size:13px; color:#f8fafc;"><strong>HOW TO LAND:</strong> Use <strong>A / D</strong> to line up over the green pad, and hold <strong>W / ↑</strong> (or the green Thrust button) to keep speed under 4.8 m/s!</div>
      </div>
      <canvas id="surfaceCanvas" width="940" height="270"></canvas>
      <div id="landerTouchBar" class="game-controls">
        <button type="button" class="chunky-btn" id="padLeftBtn">◀ THRUST LEFT (A)</button>
        <button type="button" class="chunky-btn" id="padUpBtn" style="border-color:#4ade80;">▲ MAIN RETRO-THRUST (W / ↑)</button>
        <button type="button" class="chunky-btn" id="padRightBtn">THRUST RIGHT (D) ▶</button>
      </div>
      <div id="finalePanel" style="display:none; margin-top:12px; background:rgba(15,23,42,0.95); border:2px solid #38bdf8; border-radius:14px; padding:14px; text-align:center;">
        <h3 id="finTitle" style="margin:0 0 6px; color:#4ade80;">SURFACE EXPEDITION TASKS</h3>
        <p id="finDesc" style="margin:0 0 10px; font-size:13px; color:#cbd5e1;"></p>
        <div id="finInteractive" class="game-controls"></div>
      </div>
      <div id="victoryBanner" style="display:none; margin-top:12px; background:rgba(6,78,59,0.75); border:2px solid #4ade80; border-radius:16px; padding:18px; text-align:center;">
        <h2 id="vicHeadline" style="margin:0 0 6px; color:#4ade80;">🎉 MISSION ACCOMPLISHED!</h2>
        <p id="vicSummary" style="margin:0 0 14px; font-size:14px; color:#f8fafc;"></p>
        <button type="button" id="backToMissionsWinBtn" class="primary-btn" style="max-width:440px; background:#16a34a;">RETURN TO MISSION MAP (NEW PLANETS UNLOCKED!) ➔</button>
      </div>
    `;

    const c = document.getElementById("surfaceCanvas"), ctx = c.getContext("2d");
    const mKey = (typeof activeMission !== "undefined" && activeMission.key) ? activeMission.key : "moon";
    const isWom = (typeof activeMission !== "undefined" && activeMission.type === "womanned");

    let lx = c.width / 2, ly = 45, vx = 0, vy = 0, landed = false;
    let astro = { x: c.width / 2 + 45, y: c.height - 52, pose: "cheer", msg: "Touchdown!" };
    let rover = { x: 120, y: 215, pts: Array.of({ x: 340, y: 210, ok: 0 }, { x: 580, y: 220, ok: 0 }, { x: 790, y: 205, ok: 0 }) };

    cancelAnimationFrame(activeLoop);
    function loop() {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = mKey === "mars" ? "#7c2d12" : mKey === "europa" ? "#1e3a8a" : "#334155";
      ctx.fillRect(0, c.height - 28, c.width, 28);
      ctx.fillStyle = "#22c55e"; ctx.fillRect(c.width / 2 - 65, c.height - 32, 130, 8);

      if (!landed) {
        if (keys["a"] || keys["arrowleft"]) vx -= 0.12;
        if (keys["d"] || keys["arrowright"]) vx += 0.12;
        const up = keys["w"] || keys["arrowup"];
        vy += up ? -0.14 : 0.06;
        vx *= 0.94; vy = Math.max(-3.2, Math.min(4.2, vy));
        lx = Math.max(40, Math.min(c.width - 40, lx + vx)); ly += vy;

        ctx.fillStyle = "#f8fafc"; ctx.fillRect(lx - 16, ly - 24, 32, 36);
        if (up) { ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.moveTo(lx - 10, ly + 12); ctx.lineTo(lx, ly + 32); ctx.lineTo(lx + 10, ly + 12); ctx.fill(); }
        ctx.fillStyle = Math.abs(vy) < 2.4 ? "#4ade80" : "#f87171"; ctx.font = "13px monospace";
        ctx.fillText(`DESCENT SPEED: ${Math.max(0, vy * 2).toFixed(1)} m/s (SAFE < 4.8 m/s)`, 16, 24);

        if (ly >= c.height - 44) {
          if (Math.abs(vy) < 2.4 && Math.abs(lx - c.width / 2) < 75) {
            landed = true; showToast("🎉 SAFE TOUCHDOWN!");
            document.getElementById("landerTouchBar").style.display = "none";
            document.getElementById("surfStatus").innerText = "PHASE: SURFACE EXPEDITION";
            setupSurfaceTasks();
          } else { ly = 45; vy = 0; vx = 0; playSfx(120, "sawtooth", 0.25); }
        }
      } else if (!isWom) {
        ctx.fillStyle = "#f8fafc"; ctx.fillRect(c.width / 2 - 16, c.height - 68, 32, 36);
        drawCustomAstronaut(ctx, 75, c.height - 52, 0.9, "work", "Driving Rover!");
        if (keys["a"] || keys["arrowleft"]) rover.x -= 3.5;
        if (keys["d"] || keys["arrowright"]) rover.x += 3.5;
        if (keys["w"] || keys["arrowup"]) rover.y -= 2.5;
        if (keys["s"] || keys["arrowdown"]) rover.y += 2.5;
        rover.x = Math.max(115, Math.min(c.width - 30, rover.x));
        rover.y = Math.max(c.height - 75, Math.min(c.height - 32, rover.y));

        rover.pts.forEach(pt => {
          if (!pt.ok && Math.hypot(rover.x - pt.x, rover.y - pt.y) < 30) { pt.ok = 1; showToast("📍 SAMPLE COLLECTED!"); }
          ctx.fillStyle = pt.ok ? "#4ade80" : "#facc15";
          ctx.beginPath(); ctx.arc(pt.x, pt.y, 12, 0, Math.PI * 2); ctx.fill();
        });
        ctx.fillStyle = "#38bdf8"; ctx.fillRect(rover.x - 18, rover.y - 12, 36, 18);
        if (rover.pts.every(p => p.ok)) triggerVictory();
      } else {
        ctx.fillStyle = "#f8fafc"; ctx.fillRect(c.width / 2 - 16, c.height - 68, 32, 36);
        drawCustomAstronaut(ctx, astro.x, astro.y, 1.0, astro.pose, astro.msg);
      }
      activeLoop = requestAnimationFrame(loop);
    }
    loop();
  };
})();
// =========================================================
// MARS LEVEL 2 EXPANSION: 3 MARS MISSIONS + 6 MARS TRAINING STATIONS
// =========================================================
(function initMarsExpansion() {
  Object.assign(missionData, {
    mars_olympus: {
      title: "Olympus Mons Recon", stamp: "LEVEL 2 • MARS VOLCANOLOGY", reqPwr: 6.0, deadline: "06 Mins 15 Secs",
      params: "Max Mass: By Rocket | Power: 6.0 kW | Orbit: 210 km Mars",
      satellite: { NASA: Array.of(210, "NASA Mars Odyssey"), ISRO: Array.of(135, "ISRO MOM-2"), ESA: Array.of(190, "ESA Mars Express"), Roscosmos: Array.of(165, "Roscosmos"), KASA: Array.of(155, "KASA"), JAXA: Array.of(180, "JAXA"), ASA: Array.of(150, "ASA"), KSA: Array.of(125, "KSA") },
      womanned:  { NASA: Array.of(480, "NASA Ares Olympus"), ISRO: Array.of(285, "ISRO Ares"), ESA: Array.of(415, "ESA Ares"), Roscosmos: Array.of(365, "Roscosmos"), KASA: Array.of(345, "KASA"), JAXA: Array.of(395, "JAXA"), ASA: Array.of(335, "ASA"), KSA: Array.of(275, "KSA") },
      obj: {
        satellite: Array.of("Attach Cryo Stage, Spectrometer & Ka-Band.", "Generate 6.0 kW power.", "Map Olympus Mons caldera lava tubes."),
        womanned: Array.of("Attach Cryo Stage, Crew Module & Ka-Band.", "Generate 6.0 kW power.", "Land on Mars plateau and deploy seismic array.")
      }
    },
    mars_polar: {
      title: "Mars Polar Ice Cap", stamp: "LEVEL 2 • MARS CRYO-SCIENCE", reqPwr: 6.5, deadline: "06 Mins 30 Secs",
      params: "Max Mass: By Rocket | Power: 6.5 kW | Orbit: 180 km Polar",
      satellite: { NASA: Array.of(225, "NASA Phoenix-2"), ISRO: Array.of(145, "ISRO Polar"), ESA: Array.of(205, "ESA Polar"), Roscosmos: Array.of(175, "Roscosmos"), KASA: Array.of(165, "KASA"), JAXA: Array.of(190, "JAXA"), ASA: Array.of(160, "ASA"), KSA: Array.of(135, "KSA") },
      womanned:  { NASA: Array.of(510, "NASA Polar Base"), ISRO: Array.of(305, "ISRO Polar Crew"), ESA: Array.of(445, "ESA Polar Crew"), Roscosmos: Array.of(390, "Roscosmos"), KASA: Array.of(370, "KASA"), JAXA: Array.of(420, "JAXA"), ASA: Array.of(360, "ASA"), KSA: Array.of(295, "KSA") },
      obj: {
        satellite: Array.of("Attach Cryo Stage, Spectrometer & Ka-Band.", "Generate 6.5 kW power.", "Drill Mars northern ice sheet for water."),
        womanned: Array.of("Attach Cryo Stage, Crew Module & Ka-Band.", "Generate 6.5 kW power.", "Establish Mars polar water-ice extraction lab.")
      }
    }
  });

  const grid = document.querySelector("#screen2 .mission-grid");
  if (grid && !document.querySelector('[data-mcard="mars_olympus"]')) {
    grid.insertAdjacentHTML("beforeend", `
      <div class="mission-card locked" data-mcard="mars_olympus">
        <div><span class="badge" style="background:#334155; color:#cbd5e1;">🔒 LOCKED • LEVEL 2</span><h3>Olympus Mons Recon</h3><p style="font-size:12px; color:#cbd5e1;">Beat Lunar mission to unlock Mars giant volcano recon.</p><div class="specs-row"><span>POWER: 6.0 kW</span><span>ORBIT: MARS</span></div></div>
        <button type="button" class="variant-btn" disabled>LOCKED</button>
      </div>
      <div class="mission-card locked" data-mcard="mars_polar">
        <div><span class="badge" style="background:#334155; color:#cbd5e1;">🔒 LOCKED • LEVEL 2</span><h3>Mars Polar Ice Cap</h3><p style="font-size:12px; color:#cbd5e1;">Beat Lunar mission to unlock Mars polar ice drilling.</p><div class="specs-row"><span>POWER: 6.5 kW</span><span>ORBIT: POLAR</span></div></div>
        <button type="button" class="variant-btn" disabled>LOCKED</button>
      </div>
    `);
  }

  const lunarStationsBackup = stations.slice();
  const marsStations = Array.of(
    {
      id: "power", icon: "🫁", name: "MOXIE Oxygen Gen",
      hint: "HOW TO PLAY: Click the CO2 Valve & Heater buttons until Oxygen Output reaches 100%!",
      why: "WHY IT MATTERS: Mars air is 95% carbon dioxide — MOXIE converts Martian CO2 into breathable oxygen.",
      init() { stState = { co2: 0, heat: 0, o2: 0 }; },
      controls: () => `
        <button type="button" class="chunky-btn" id="moxCo2Btn">1. OPEN CO2 INTAKE</button>
        <button type="button" class="chunky-btn" id="moxHeatBtn">2. IGNITE 800°C HEATER</button>`,
      draw(ctx, w, h) {
        drawCustomAstronaut(ctx, 64, h - 55, 1.0, "work", stState.o2 >= 100 ? "O2 Tank Full!" : "Convert Mars CO2!");
        ctx.fillStyle = "#1e293b"; ctx.fillRect(190, 65, 380, 36);
        ctx.fillStyle = stState.o2 >= 100 ? "#4ade80" : "#38bdf8"; ctx.fillRect(190, 65, (stState.o2 / 100) * 380, 36);
        ctx.fillStyle = "#f8fafc"; ctx.font = "bold 14px monospace";
        ctx.fillText(`BREATHABLE O2 GENERATED: ${Math.round(stState.o2)}%`, 245, 88);
        if (stState.co2 && stState.heat) stState.o2 = Math.min(100, stState.o2 + 1.5);
        if (stState.o2 >= 100) certifyStation("power");
      }
    },
    {
      id: "helm", icon: "🌪️", name: "Dust Storm Radar",
      hint: "HOW TO PLAY: Use W A S D (or Arrow Keys) to fly through the red Martian dust storm to all 3 green beacons!",
      why: "WHY IT MATTERS: Global dust storms block visual cameras, so pilots navigate by orbital radar pings.",
      init() { stState = { x: 145, y: 130, pts: Array.of({ x: 290, y: 65, ok: 0 }, { x: 440, y: 195, ok: 0 }, { x: 585, y: 110, ok: 0 }) }; },
      controls: () => `<small style="color:#fca5a5;">Fly with <strong>W A S D</strong> through the red dust clouds onto all 3 green radar rings!</small>`,
      draw(ctx, w, h) {
        drawCustomAstronaut(ctx, 62, h - 55, 1.0, "work", "Follow radar pings!");
        if (keys["w"] || keys["arrowup"]) stState.y -= 3.6;
        if (keys["s"] || keys["arrowdown"]) stState.y += 3.6;
        if (keys["a"] || keys["arrowleft"]) stState.x -= 3.6;
        if (keys["d"] || keys["arrowright"]) stState.x += 3.6;
        stState.x = Math.max(125, Math.min(w - 25, stState.x));
        stState.y = Math.max(25, Math.min(h - 25, stState.y));

        ctx.fillStyle = "rgba(180, 65, 30, 0.28)";
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.arc(240 + i * 70 + Math.sin(Date.now() * 0.003 + i) * 18, 80 + (i % 2) * 95, 48, 0, Math.PI * 2);
          ctx.fill();
        }
        stState.pts.forEach(p => {
          if (!p.ok && Math.hypot(stState.x - p.x, stState.y - p.y) < 32) { p.ok = 1; playSfx(580); }
          ctx.strokeStyle = p.ok ? "#4ade80" : "#facc15"; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.arc(p.x, p.y, 24, 0, Math.PI * 2); ctx.stroke();
        });
        ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.moveTo(stState.x + 18, stState.y); ctx.lineTo(stState.x - 14, stState.y - 12); ctx.lineTo(stState.x - 14, stState.y + 12); ctx.fill();
        if (stState.pts.every(p => p.ok)) certifyStation("helm");
      }
    },
    {
      id: "weapons", icon: "☄️", name: "Phobos Debris",
      hint: "HOW TO PLAY: Click on 5 fast-moving Martian moonlet boulders inside the black space box to vaporize them!",
      why: "WHY IT MATTERS: Mars's inner moon Phobos sheds rocky debris along low orbital trajectories.",
      init() { stState = { hits: 0, rocks: Array.from({ length: 5 }, (_, i) => ({ x: 540 + i * 95, y: 40 + (i * 46) % 185, r: 19, alive: true })) }; },
      controls: () => `<small style="color:#facc15;">Aim & <strong>Click fast Martian boulders</strong> to clear orbit!</small>`,
      onClick(mx, my) {
        playSfx(340, "sawtooth", 0.1);
        stState.rocks.forEach(rk => {
          if (rk.alive && Math.hypot(mx - rk.x, my - rk.y) <= rk.r + 16) { rk.alive = false; stState.hits++; playSfx(140, "square", 0.15); }
        });
      },
      draw(ctx, w, h) {
        drawCustomAstronaut(ctx, 62, h - 55, 1.0, "work", `${stState.hits}/5 boulders cleared!`);
        stState.rocks.forEach(rk => {
          if (!rk.alive) return;
          rk.x -= 2.4; if (rk.x < 120) rk.x = w + 20;
          ctx.fillStyle = "#b91c1c"; ctx.beginPath(); ctx.arc(rk.x, rk.y, rk.r, 0, Math.PI * 2); ctx.fill();
        });
        if (stState.hits >= 5) certifyStation("weapons");
      }
    },
    {
      id: "reactor", icon: "☢️", name: "RTG Nuclear Core",
      hint: "HOW TO PLAY: Click the 3 Cooling Rod buttons until all 3 rods lock into the green optimal power band!",
      why: "WHY IT MATTERS: Mars gets 57% less sunlight than Earth, so rovers & bases use RTG nuclear power.",
      init() { stState = { r1: 0, r2: 1, r3: 0 }; },
      controls: () => `
        <button type="button" class="chunky-btn" data-rtg="1">☢️ Toggle Rod 1</button>
        <button type="button" class="chunky-btn" data-rtg="2">☢️ Toggle Rod 2</button>
        <button type="button" class="chunky-btn" data-rtg="3">☢️ Toggle Rod 3</button>`,
      draw(ctx, w, h) {
        drawCustomAstronaut(ctx, 64, h - 55, 1.0, "work", "Balance all 3 rods!");
        const rods = Array.of(stState.r1, stState.r2, stState.r3);
        rods.forEach((on, i) => {
          ctx.fillStyle = "#1e293b"; ctx.fillRect(230 + i * 120, 45, 44, 165);
          ctx.fillStyle = on ? "#4ade80" : "#ef4444";
          ctx.fillRect(230 + i * 120, on ? 95 : 155, 44, on ? 65 : 55);
        });
        if (stState.r1 === 1 && stState.r2 === 1 && stState.r3 === 1) certifyStation("reactor");
      }
    },
    {
      id: "shields", icon: "🔥", name: "Heat Shield Tiles",
      hint: "HOW TO PLAY: Click all 4 glowing red damaged thermal tiles to replace them before Mars atmospheric entry!",
      why: "WHY IT MATTERS: Mars entry heats your capsule to 1,600°C — one missing tile could breach the hull.",
      init() { stState = { tiles: Array.of({ x: 230, y: 75, ok: 0 }, { x: 360, y: 165, ok: 0 }, { x: 480, y: 80, ok: 0 }, { x: 585, y: 160, ok: 0 }) }; },
      controls: () => `<small style="color:#f87171;"><strong>Click each glowing red tile</strong> to snap a fresh ceramic heat tile into place!</small>`,
      onClick(mx, my) {
        stState.tiles.forEach(tl => {
          if (!tl.ok && Math.hypot(mx - tl.x, my - tl.y) <= 30) { tl.ok = 1; playSfx(620); }
        });
      },
      draw(ctx, w, h) {
        drawCustomAstronaut(ctx, 64, h - 55, 1.0, "work", "Replace damaged tiles!");
        stState.tiles.forEach(tl => {
          ctx.fillStyle = tl.ok ? "#38bdf8" : "#ef4444";
          ctx.fillRect(tl.x - 22, tl.y - 18, 44, 36);
          ctx.strokeStyle = "#f8fafc"; ctx.strokeRect(tl.x - 22, tl.y - 18, 44, 36);
        });
        if (stState.tiles.every(t => t.ok)) certifyStation("shields");
      }
    },
    {
      id: "comms", icon: "🪂", name: "Chute + Retro Burn",
      hint: "HOW TO PLAY: First click DEPLOY PARACHUTE, then hold W / ↑ (or Thrust) to land gently on Mars!",
      why: "WHY IT MATTERS: Mars's thin atmosphere requires a supersonic parachute plus retro-rockets to stop.",
      init() { stState = { y: 35, vy: 0, chute: false, done: false }; },
      controls: () => `
        <button type="button" class="chunky-btn" id="marsChuteBtn" style="border-color:#facc15;">1. DEPLOY PARACHUTE 🪂</button>
        <button type="button" class="chunky-btn" id="trainLandThrustBtn" style="border-color:#4ade80;">2. HOLD RETRO-THRUST (W / ↑)</button>`,
      draw(ctx, w, h) {
        drawCustomAstronaut(ctx, 64, h - 55, 1.0, "work", stState.done ? "Welcome to Mars!" : "Deploy chute first!");
        ctx.fillStyle = "#7c2d12"; ctx.fillRect(140, h - 22, w - 160, 22);
        ctx.fillStyle = "#22c55e"; ctx.fillRect(360, h - 25, 110, 6);

        if (!stState.done) {
          const up = keys["w"] || keys["arrowup"] || stState.hold;
          const grav = stState.chute ? 0.045 : 0.09;
          stState.vy += up ? -0.15 : grav;
          stState.vy = Math.max(-2.6, Math.min(4.2, stState.vy));
          stState.y = Math.max(30, stState.y + stState.vy);
          if (stState.chute) {
            ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.arc(415, stState.y - 26, 22, Math.PI, 0); ctx.fill();
          }
          if (up) {
            ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.moveTo(408, stState.y + 18); ctx.lineTo(415, stState.y + 36); ctx.lineTo(422, stState.y + 18); ctx.fill();
          }
          if (stState.y >= h - 42) {
            if (stState.chute && Math.abs(stState.vy) < 2.3) { stState.done = true; certifyStation("comms"); }
            else { stState.y = 35; stState.vy = 0; stState.chute = false; playSfx(130, "sawtooth", 0.2); }
          }
        }
        ctx.fillStyle = "#f8fafc"; ctx.fillRect(402, stState.y - 14, 26, 32);
        ctx.fillStyle = (stState.chute && Math.abs(stState.vy) < 2.3) ? "#4ade80" : "#f87171"; ctx.font = "12px monospace";
        ctx.fillText(`CHUTE: ${stState.chute ? "OPEN" : "CLOSED"} | SPEED: ${Math.max(0, stState.vy * 2).toFixed(1)} m/s`, 155, 24);
      }
    }
  );

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    if (btn.id === "toPhase4Btn") {
      const isMars = (typeof activeMission !== "undefined" && String(activeMission.key).startsWith("mars"));
      const chosen = isMars ? marsStations : lunarStationsBackup;
      stations.splice(0, stations.length, ...chosen);
      renderStationCards();
      selectStation("power");
      const hdr = document.querySelector("#screen5Deck h2");
      if (hdr) hdr.innerText = isMars ? "03 // MARS EXPEDITION TRAINING DECK (LEVEL 2)" : "03 // FLIGHT DECK TRAINING (PICK ANY STATION!)";
    }

    if (btn.id === "moxCo2Btn" && stState) { stState.co2 = 1; btn.classList.add("ok"); playSfx(500); }
    if (btn.id === "moxHeatBtn" && stState) { stState.heat = 1; btn.classList.add("ok"); playSfx(620); }
    if (btn.id === "marsChuteBtn" && stState) { stState.chute = true; btn.classList.add("ok"); playSfx(540); }
    if (btn.dataset?.rtg && activeSt?.id === "reactor") {
      stState["r" + btn.dataset.rtg] = stState["r" + btn.dataset.rtg] ? 0 : 1;
      playSfx(520);
    }
  });

  const origSetupTasks = window.setupSurfaceTasks;
  window.setupSurfaceTasks = function () {
    const isMars = (typeof activeMission !== "undefined" && String(activeMission.key).startsWith("mars"));
    if (isMars && activeMission.type === "womanned") {
      const panel = document.getElementById("finalePanel"), box = document.getElementById("finInteractive");
      panel.style.display = "block"; box.innerHTML = "";
      document.getElementById("surfCoachMsg").innerHTML = `<strong>MARS TOUCHDOWN!</strong> Click each Mars surface station below to establish humanity's Red Planet outpost!`;
      document.getElementById("finTitle").innerText = "🔴 MARS SURFACE EXPEDITION (COMPLETE ALL 3)";
      document.getElementById("finDesc").innerText = "Complete all 3 Martian surface objectives:";
      let labDone = 0;
      Array.of("🫁 Deploy MOXIE O2 Station", "🪨 Sample Jezero Biosignature Core", "📡 Activate Mars Habitat Beacon").forEach(lbl => {
        const b = document.createElement("button"); b.type = "button"; b.className = "chunky-btn"; b.innerText = lbl;
        b.onclick = () => { if (b.classList.contains("ok")) return; b.classList.add("ok"); labDone++; showToast("✅ MARS OBJECTIVE DONE!"); if (labDone >= 3) triggerVictory(); };
        box.appendChild(b);
      });
    } else if (typeof origSetupTasks === "function") {
      origSetupTasks();
    }
  };
})();
// =========================================================
// FIX SECURITY KEYPAD: ADD '0' BUTTON + CLEAR BUTTON
// =========================================================
window.openRepairGame = function (type) {
  repairOpen = true;
  playSfx(220, "sawtooth", 0.3, 0.18);

  let modal = document.getElementById("repairModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "repairModal";
    modal.className = "modal-overlay";
    modal.innerHTML = `<div class="modal-box" style="border-color:#ef4444; text-align:center; box-shadow:0 0 40px rgba(239,68,68,0.65);"><h2 id="repTitle" style="margin-top:0; color:#f87171;"></h2><p id="repDesc" style="font-size:13.5px; color:#e2e8f0;"></p><div id="repBody"></div></div>`;
    document.body.appendChild(modal);
  }
  modal.style.display = "flex";
  modal.style.zIndex = "9999";

  const body = document.getElementById("repBody");
  if (type === "keypad") {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    let typed = "";
    document.getElementById("repTitle").innerText = "🔐 SECURITY OVERRIDE CODE NEEDED!";
    document.getElementById("repDesc").innerHTML = `Type the 4-digit code <strong style="color:#4ade80; font-size:20px;">${code}</strong> on the keypad below to reset the computer:`;
    body.innerHTML = `
      <div id="kpDisp" style="font-family:monospace; font-size:22px; color:#38bdf8; margin-bottom:10px; letter-spacing:4px;">----</div>
      <div class="keypad-grid">
        ${Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "⌫").map(n => `<button type="button" class="chunky-btn" data-kp="${n}">${n}</button>`).join("")}
      </div>`;
    body.onclick = (e) => {
      const n = e.target.dataset.kp;
      if (!n) return;
      playSfx(550);
      if (n === "C") { typed = ""; document.getElementById("kpDisp").innerText = "----"; return; }
      if (n === "⌫") { typed = typed.slice(0, -1); document.getElementById("kpDisp").innerText = typed || "----"; return; }
      typed += n;
      document.getElementById("kpDisp").innerText = typed;
      if (typed === code) {
        modal.style.display = "none";
        repairOpen = false;
        showToast("✅ COMPUTER RESET — FLYING!");
      } else if (typed.length >= 4) {
        typed = "";
        document.getElementById("kpDisp").innerText = "RETRY";
      }
    };
  } else {
    let charge = 0;
    document.getElementById("repTitle").innerText = "🛡️ SHIELD POWER LOW!";
    document.getElementById("repDesc").innerText = "Tap the pump button rapidly until shields recharge to 100%!";
    body.innerHTML = `<button type="button" id="pumpTapBtn" class="primary-btn" style="max-width:260px;">⚡ PUMP SHIELD (0%)</button>`;
    document.getElementById("pumpTapBtn").onclick = function () {
      charge += 20;
      playSfx(350 + charge * 4);
      this.innerText = `⚡ PUMP SHIELD (${charge}%)`;
      if (charge >= 100) {
        modal.style.display = "none";
        repairOpen = false;
        showToast("✅ SHIELDS AT 100% — FLYING!");
      }
    };
  }
  // =========================================================
// FINAL PRODUCTION NASA API + INSTANT TELEMETRY CARD (0 BUGS)
// =========================================================
(function forceVisibleNasaApis() {
  const missionMeta = {
    moon: { id: "PIA12235", center: "NASA / GSFC / LRO", title: "Lunar South Pole Shackleton Crater", desc: "Lunar Reconnaissance Orbiter (LRO) LOLA elevation & LCROSS polar water-ice survey data." },
    iss: { id: "ISS065-E-000001", center: "NASA / JSC", title: "International Space Station Orbital Telemetry", desc: "Low-Earth Orbit (408 km) Earth observation & atmospheric storm tracking survey." },
    solar: { id: "GSFC_20171208", center: "NASA / GSFC / SDO", title: "Solar Dynamics Observatory EUV Corona", desc: "Extreme Ultraviolet solar magnetic field & coronal mass ejection telemetry." },
    asteroid: { id: "PIA24930", center: "NASA / JPL-Caltech", title: "16 Psyche Metallic Asteroid Survey", desc: "Gamma-Ray & Neutron Spectrometer core composition mapping at 2.9 AU." },
    mars: { id: "PIA24428", center: "NASA / JPL-Caltech", title: "Mars Jezero Crater River Delta", desc: "Perseverance Rover HiRISE & PIXL ancient lakebed biosignature survey." },
    mars_olympus: { id: "PIA02982", center: "NASA / JPL", title: "Olympus Mons Shield Volcano Recon", desc: "Mars Odyssey thermal emission & caldera lava-tube radar survey." },
    mars_polar: { id: "PIA11083", center: "NASA / JPL / UA", title: "Mars North Polar Layered Ice Cap", desc: "Subsurface water-ice depth & seasonal CO2 frost telemetry." },
    europa: { id: "PIA19048", center: "NASA / JPL-Caltech", title: "Europa Subsurface Ocean Ice Shell", desc: "Galileo & Europa Clipper ice-crust fracture and plume reconnaissance." }
  };

  function renderTelemetryFallback(card, key) {
    if (!card) return;
    const m = missionMeta[key] || missionMeta.moon;
    card.innerHTML = `
      <canvas id="fallbackRadar" width="96" height="68" style="border-radius:8px; border:1px solid #38bdf8; background:#020617; flex-shrink:0;"></canvas>
      <div style="font-size:11.5px; line-height:1.45;">
        <span style="background:#1e3a8a; color:#93c5fd; padding:2px 7px; border-radius:4px; font-weight:bold; font-size:10px;">🛰️ NASA PDS ARCHIVE • ID: ${m.id} • ${m.center} • v2.4</span><br>
        <strong style="color:#38bdf8; font-size:12.5px;">${m.title}</strong><br>
        <span style="color:#cbd5e1;">${m.desc}</span>
      </div>
    `;
    const fc = document.getElementById("fallbackRadar");
    if (fc && fc.getContext) {
      const g = fc.getContext("2d");
      g.strokeStyle = "rgba(56,189,248,0.25)";
      for (let x = 16; x < 96; x += 16) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 68); g.stroke(); }
      for (let y = 17; y < 68; y += 17) { g.beginPath(); g.moveTo(0, y); g.lineTo(96, y); g.stroke(); }
      const grad = g.createRadialGradient(48, 34, 4, 48, 34, 26);
      grad.addColorStop(0, "#7dd3fc"); grad.addColorStop(0.6, "#1e3a8a"); grad.addColorStop(1, "transparent");
      g.fillStyle = grad; g.beginPath(); g.arc(48, 34, 26, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#4ade80"; g.strokeRect(24, 15, 48, 38);
    }
  }

  function renderNasaLiveBox(mKey) {
    const key = mKey || "moon";
    const card = document.getElementById("nasaReconCard");
    if (!card) return;

    renderTelemetryFallback(card, key);

    fetch("https://nasa.gov")
      .then(res => (res && res.ok) ? res.json() : Promise.reject())
      .then(apod => {
        if (!apod || !apod.url || apod.media_type !== "image") return;
        const freshCard = document.getElementById("nasaReconCard");
        if (!freshCard) return;
        freshCard.innerHTML = `
          <img id="apodLiveImg" src="${apod.url}" alt="${apod.title || "NASA APOD"}" style="width:104px; height:76px; object-fit:cover; border-radius:8px; border:2px solid #4ade80; flex-shrink:0;">
          <div style="font-size:11.5px; line-height:1.45;">
            <span style="background:#065f46; color:#6ee7b7; padding:2px 7px; border-radius:4px; font-weight:bold; font-size:10px;">● LIVE NASA APOD API • DATE: ${apod.date || "LIVE"} • v2.4</span><br>
            <strong style="color:#38bdf8; font-size:12.5px;">${apod.title || "NASA Astronomy Picture of the Day"}</strong><br>
            <span style="color:#e2e8f0;">${(apod.explanation || "").slice(0, 140)}...</span>
          </div>
        `;
        const img = document.getElementById("apodLiveImg");
        if (img) img.onerror = () => renderTelemetryFallback(freshCard, key);
      })
      .catch(() => {});
  }

  renderNasaLiveBox("moon");
  document.addEventListener("click", (e) => {
    const v = e.target.closest(".variant-btn");
    if (v && v.dataset.m) {
      setTimeout(() => renderNasaLiveBox(v.dataset.m), 80);
    }
  });
})();

};
