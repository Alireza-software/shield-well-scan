// VaccineShield Pro — shared app shell, state, and helpers
(function () {
  const DISEASES = [
    "Polio","Measles","Tuberculosis (BCG)","Diphtheria","Tetanus",
    "Pertussis","Hepatitis B","Hib","Rotavirus","Pneumococcal","Typhoid","Rubella"
  ];

  const VACCINES = [
    { code: "OPV",   name: "Oral Polio Vaccine",      disease: "Polio",          batch: "POL-2025-014", mfg: "2025-02-10", exp: "2026-08-10", qty: 1240 },
    { code: "BCG",   name: "BCG",                     disease: "Tuberculosis",   batch: "BCG-2025-022", mfg: "2025-01-05", exp: "2026-12-31", qty: 860 },
    { code: "MR",    name: "Measles-Rubella",         disease: "Measles/Rubella",batch: "MR-2025-031",  mfg: "2025-03-18", exp: "2026-09-18", qty: 540 },
    { code: "PENTA", name: "Pentavalent (DPT+HepB+Hib)", disease: "Diphtheria/Tetanus/Pertussis/HepB/Hib", batch: "PEN-2025-009", mfg: "2025-04-02", exp: "2026-10-02", qty: 720 },
    { code: "PCV",   name: "Pneumococcal Conjugate",  disease: "Pneumococcal",   batch: "PCV-2025-018", mfg: "2025-02-28", exp: "2026-08-28", qty: 412 },
    { code: "ROTA",  name: "Rotavirus",               disease: "Rotavirus",      batch: "ROT-2025-006", mfg: "2025-05-11", exp: "2026-11-11", qty: 312 },
    { code: "TY",    name: "Typhoid Conjugate",       disease: "Typhoid",        batch: "TY-2025-002",  mfg: "2025-05-22", exp: "2026-11-22", qty: 198 },
    { code: "TT",    name: "Tetanus Toxoid",          disease: "Tetanus",        batch: "TT-2025-041",  mfg: "2025-03-10", exp: "2026-09-10", qty: 64  },
  ];

  const SEED_PATIENTS = [
    { id: "VS-1001", name: "Ayaan Khan", father: "Bilal Khan", mother: "Hina Khan", contact: "0300-1234567", dob: "2024-03-12", gender: "Male", district: "Karachi East", uc: "UC-12", doses: ["OPV","BCG"] },
    { id: "VS-1002", name: "Zara Ali",   father: "Tariq Ali", mother: "Mehreen Ali", contact: "0301-7654321", dob: "2023-11-02", gender: "Female", district: "Lahore",   uc: "UC-04", doses: ["BCG","PENTA","OPV"] },
    { id: "VS-1003", name: "Hamza Iqbal",father: "Imran Iqbal",mother: "Nadia Iqbal", contact: "0345-9988776", dob: "2024-06-21", gender: "Male", district: "Islamabad", uc: "UC-08", doses: [] },
  ];

  function init(key, value) {
    if (localStorage.getItem(key) === null) localStorage.setItem(key, JSON.stringify(value));
  }
  init("vs_patients", SEED_PATIENTS);
  init("vs_inventory", VACCINES);
  init("vs_activity", [
    { time: Date.now()-1000*60*12, text: "Nurse Sara administered PENTA dose to VS-1002", type: "success" },
    { time: Date.now()-1000*60*45, text: "Cold chain unit #3 temperature normalized (4.2°C)", type: "info" },
    { time: Date.now()-1000*60*120, text: "Low stock alert: Tetanus Toxoid (TT-2025-041)", type: "warn" },
    { time: Date.now()-1000*60*180, text: "End-of-day reconciliation submitted by Dr. Khan", type: "success" },
  ]);
  init("vs_theme", "light");

  // Apply theme
  document.documentElement.setAttribute("data-theme", JSON.parse(localStorage.getItem("vs_theme")));

  const NAV = [
    { group: "Operations", items: [
      { href: "dashboard.html",      icon: "fa-chart-line",      label: "Dashboard" },
      { href: "patient-intake.html", icon: "fa-user-plus",       label: "Patient Intake POS" },
      { href: "scanner.html",        icon: "fa-qrcode",          label: "QR / Barcode Scanner" },
      { href: "reconciliation.html", icon: "fa-clipboard-check", label: "End of Day" },
    ]},
    { group: "Supply Chain", items: [
      { href: "inventory.html",      icon: "fa-boxes-stacked",   label: "Vaccine Inventory" },
      { href: "cold-chain.html",     icon: "fa-temperature-low", label: "Cold Chain" },
    ]},
    { group: "Engagement", items: [
      { href: "notifications.html",  icon: "fa-bell",            label: "Notifications" },
      { href: "testimonials.html",   icon: "fa-star",            label: "Field Feedback" },
    ]},
    { group: "Insights", items: [
      { href: "reports.html",        icon: "fa-file-lines",      label: "Reports & Audit" },
      { href: "settings.html",       icon: "fa-gear",            label: "Settings" },
    ]},
  ];

  function renderShell({ active, title, subtitle, actions }) {
    const session = JSON.parse(localStorage.getItem("vs_session") || "null");
    if (!session) { window.location.href = "login.html"; return; }

    const initials = session.name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();

    const sidebar = `
      <aside class="sidebar">
        <div class="brand">
          <div class="logo"><i class="fa-solid fa-shield-virus"></i></div>
          <div>
            <h1>VaccineShield <span style="color:#60a5fa">Pro</span></h1>
            <small>Immunization Platform</small>
          </div>
        </div>
        ${NAV.map(g => `
          <div class="nav-section">
            <div class="label">${g.group}</div>
            ${g.items.map(it => `
              <a class="nav-item ${it.href===active?'active':''}" href="${it.href}">
                <i class="fa-solid ${it.icon}"></i><span>${it.label}</span>
              </a>`).join("")}
          </div>
        `).join("")}
        <div style="margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,.08);font-size:11px;color:#64748b;text-align:center">
          v1.0.0 · © VaccineShield Pro
        </div>
      </aside>`;

    const topbar = `
      <header class="topbar">
        <div class="search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input id="globalSearch" placeholder="Search patients, batches, vaccines, reports…" />
        </div>
        <div class="actions">
          <button class="icon-btn" id="themeToggle" title="Toggle theme"><i class="fa-solid fa-moon"></i></button>
          <button class="icon-btn" title="Notifications"><i class="fa-solid fa-bell"></i><span class="dot"></span></button>
          <button class="icon-btn" title="Help"><i class="fa-solid fa-circle-question"></i></button>
          <div class="user-chip">
            <div class="avatar">${initials}</div>
            <div class="meta"><div><b>${session.name}</b></div><small>${session.role}</small></div>
            <button class="icon-btn" id="logoutBtn" title="Logout" style="width:30px;height:30px"><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
          </div>
        </div>
      </header>`;

    const head = `
      <div class="page-head">
        <div>
          <h2>${title}</h2>
          <p>${subtitle||""}</p>
        </div>
        <div>${actions||""}</div>
      </div>`;

    document.body.classList.add("has-shell");
    document.body.innerHTML = `
      <div class="app-shell">
        ${sidebar}
        <div class="main">
          ${topbar}
          <div class="page" id="pageRoot">
            ${head}
            <div id="pageBody"></div>
          </div>
        </div>
      </div>`;

    document.getElementById("logoutBtn").onclick = () => {
      localStorage.removeItem("vs_session");
      window.location.href = "login.html";
    };
    document.getElementById("themeToggle").onclick = () => {
      const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", cur);
      localStorage.setItem("vs_theme", JSON.stringify(cur));
    };
  }

  function logActivity(text, type="info") {
    const arr = JSON.parse(localStorage.getItem("vs_activity")||"[]");
    arr.unshift({ time: Date.now(), text, type });
    localStorage.setItem("vs_activity", JSON.stringify(arr.slice(0,40)));
  }

  function toast(msg, type="info") {
    let t = document.createElement("div");
    t.style.cssText = `position:fixed;top:20px;right:20px;background:var(--surface);border:1px solid var(--border);border-left:4px solid ${type==='success'?'#10b981':type==='warn'?'#f59e0b':type==='danger'?'#ef4444':'#2563eb'};padding:12px 16px;border-radius:10px;box-shadow:0 10px 30px -8px rgba(0,0,0,.2);z-index:1000;font-size:14px;font-weight:500;animation:fadeUp .3s`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(()=> t.remove(), 2800);
  }

  function fmtTime(ts) {
    const d = (Date.now() - ts) / 1000;
    if (d < 60) return Math.floor(d)+"s ago";
    if (d < 3600) return Math.floor(d/60)+"m ago";
    if (d < 86400) return Math.floor(d/3600)+"h ago";
    return new Date(ts).toLocaleDateString();
  }

  window.VS = { DISEASES, renderShell, logActivity, toast, fmtTime,
    getPatients: () => JSON.parse(localStorage.getItem("vs_patients")||"[]"),
    savePatients: (a) => localStorage.setItem("vs_patients", JSON.stringify(a)),
    getInventory: () => JSON.parse(localStorage.getItem("vs_inventory")||"[]"),
    saveInventory: (a) => localStorage.setItem("vs_inventory", JSON.stringify(a)),
    getActivity: () => JSON.parse(localStorage.getItem("vs_activity")||"[]"),
  };
})();
