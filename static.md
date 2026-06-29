# Template for workout plan
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lean Bulk Protocol · 62 → 68kg</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#15140f;
    --surface:#201e18;
    --surface-2:#2a271f;
    --steel:#4a463c;
    --steel-soft:#36332a;
    --chalk:#ede7d8;
    --chalk-dim:#a39d8c;
    --hazard:#f4c430;
    --hazard-dim:#7a6420;
    --rust:#c45c3a;
    --go:#7c9a5a;
  }

  *{ box-sizing:border-box; }
  html{ scroll-behavior:smooth; }
  body{
    margin:0;
    background:var(--bg);
    background-image:
      radial-gradient(circle at 15% 0%, rgba(244,196,48,0.06), transparent 40%),
      repeating-linear-gradient(135deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 2px, transparent 2px, transparent 6px);
    color:var(--chalk);
    font-family:'Inter', sans-serif;
    line-height:1.55;
  }

  .page{ max-width:880px; margin:0 auto; padding:28px 20px 60px; }

  h1,h2,h3{ font-family:'Oswald', sans-serif; text-transform:uppercase; letter-spacing:0.02em; margin:0; }

  .mono{ font-family:'JetBrains Mono', monospace; }

  a{ color:var(--hazard); }

  :focus-visible{ outline:2px solid var(--hazard); outline-offset:3px; border-radius:4px; }

  /* ---------- HERO ---------- */
  .hero{
    text-align:center;
    padding:18px 0 32px;
    border-bottom:1px solid var(--steel-soft);
    margin-bottom:28px;
  }
  .hero-eyebrow{
    font-family:'JetBrains Mono', monospace;
    color:var(--hazard);
    font-size:12px;
    letter-spacing:0.22em;
    margin:0 0 10px;
  }
  .hero-title{
    font-size:clamp(40px, 9vw, 68px);
    font-weight:700;
    line-height:0.98;
    color:var(--chalk);
  }
  .hero-title .arrow{ color:var(--steel); font-weight:500; padding:0 6px; }
  .hero-title .goal-num{ color:var(--hazard); }
  .hero-title .unit{ font-size:0.4em; color:var(--chalk-dim); margin-left:4px; letter-spacing:0.05em; }
  .hero-sub{ color:var(--chalk-dim); margin:10px 0 0; font-size:15px; }

  /* ---------- BARBELL LOADER (signature element) ---------- */
  .bar-loader{
    margin:30px auto 0;
    max-width:560px;
    background:var(--surface);
    border:1px solid var(--steel-soft);
    border-radius:14px;
    padding:20px 22px 16px;
  }
  .bar-loader-head{
    display:flex; justify-content:space-between; align-items:baseline; gap:10px; flex-wrap:wrap;
  }
  .bar-loader-head label{ font-size:13px; color:var(--chalk-dim); }
  #weightInput{
    width:84px;
    background:var(--surface-2);
    border:1px solid var(--steel);
    color:var(--hazard);
    font-family:'JetBrains Mono', monospace;
    font-weight:700;
    font-size:16px;
    padding:5px 8px;
    border-radius:6px;
    text-align:center;
  }
  #barbellSvg{ width:100%; height:auto; display:block; margin-top:14px; }
  #barbellStatus{
    font-family:'JetBrains Mono', monospace;
    font-size:13px;
    color:var(--chalk-dim);
    text-align:center;
    margin:10px 0 0;
  }
  #barbellStatus.win{ color:var(--go); }

  /* ---------- DAY NAV ---------- */
  .day-nav{
    display:flex;
    gap:6px;
    overflow-x:auto;
    padding:4px 2px 18px;
    margin-bottom:6px;
  }
  .day-btn{
    flex:1 1 0;
    min-width:48px;
    background:var(--surface);
    border:1px solid var(--steel-soft);
    color:var(--chalk-dim);
    font-family:'JetBrains Mono', monospace;
    font-size:12px;
    letter-spacing:0.06em;
    padding:10px 4px;
    border-radius:8px;
    cursor:pointer;
    position:relative;
    transition:background 0.15s, color 0.15s, border-color 0.15s;
  }
  .day-btn:hover{ border-color:var(--steel); color:var(--chalk); }
  .day-btn.active{
    background:var(--hazard);
    color:#1d1a10;
    border-color:var(--hazard);
    font-weight:700;
  }
  .day-btn .today-dot{
    position:absolute; top:4px; right:6px;
    width:5px; height:5px; border-radius:50%;
    background:var(--rust);
  }
  .day-btn.active .today-dot{ background:#1d1a10; }

  /* ---------- CARDS ---------- */
  .card{
    background:var(--surface);
    border:1px solid var(--steel-soft);
    border-radius:14px;
    padding:22px 22px 24px;
    margin-bottom:22px;
  }
  .card h2{ font-size:22px; color:var(--chalk); }
  .card-meta{ font-size:13px; color:var(--chalk-dim); margin:4px 0 18px; }

  /* workout header / progress */
  .workout-header{
    display:flex; justify-content:space-between; align-items:flex-start; gap:14px; flex-wrap:wrap;
  }
  .progress-pill{
    font-family:'JetBrains Mono', monospace;
    font-size:13px;
    background:var(--surface-2);
    border:1px solid var(--steel-soft);
    color:var(--hazard);
    padding:5px 12px;
    border-radius:999px;
    white-space:nowrap;
  }
  .progress-track{
    height:6px; background:var(--surface-2); border-radius:999px; overflow:hidden; margin:12px 0 20px;
  }
  .progress-fill{
    height:100%; width:0%; background:var(--hazard);
    transition:width 0.25s ease;
  }
  .progress-fill.full{ background:var(--go); }

  .muscle-group{ margin-bottom:18px; }
  .muscle-group:last-child{ margin-bottom:0; }
  .muscle-group h3{
    font-size:14px; color:var(--chalk-dim); letter-spacing:0.1em;
    margin-bottom:8px; padding-bottom:6px; border-bottom:1px solid var(--steel-soft);
  }

  .ex-row{
    display:flex; align-items:center; gap:12px;
    padding:9px 4px;
    border-bottom:1px dashed var(--steel-soft);
  }
  .ex-row:last-child{ border-bottom:none; }
  .ex-row.done .ex-name{ color:var(--chalk-dim); text-decoration:line-through; text-decoration-color:var(--steel); }
  .ex-row.done .ex-sets{ color:var(--steel); }

  .checkbox{
    width:20px; height:20px; flex:0 0 auto;
    border:2px solid var(--steel);
    border-radius:5px;
    cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    background:transparent;
    transition:background 0.15s, border-color 0.15s;
  }
  .checkbox.checked{ background:var(--hazard); border-color:var(--hazard); }
  .checkbox.checked::after{
    content:"✓"; color:#1d1a10; font-size:13px; font-weight:700;
  }

  .ex-name{ flex:1 1 auto; font-size:14.5px; color:var(--chalk); }
  .ex-sets{ font-family:'JetBrains Mono', monospace; font-size:13px; color:var(--hazard); white-space:nowrap; }

  .rest-day{
    text-align:center; padding:30px 10px; color:var(--chalk-dim);
  }
  .rest-day .big-emoji{ font-size:34px; margin-bottom:8px; }

  /* ---------- DIET ---------- */
  .meal-row{
    display:flex; align-items:center; gap:12px;
    padding:11px 4px;
    border-bottom:1px dashed var(--steel-soft);
  }
  .meal-row:last-child{ border-bottom:none; }
  .meal-time{
    font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--chalk-dim);
    width:78px; flex:0 0 auto;
  }
  .meal-name{ flex:1 1 auto; font-size:14.5px; color:var(--chalk); }
  .meal-row.done .meal-name{ color:var(--chalk-dim); text-decoration:line-through; text-decoration-color:var(--steel); }
  .meal-macro{
    font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--steel);
    white-space:nowrap;
  }
  .meal-row.done .meal-macro{ color:var(--hazard); }
  .meal-divider{
    text-align:center; padding:10px 0; color:var(--rust);
    font-family:'JetBrains Mono', monospace; font-size:12px; letter-spacing:0.08em;
  }
  .extra-row{
    display:flex; align-items:center; gap:12px; margin-top:14px; padding-top:14px;
    border-top:1px solid var(--steel-soft);
  }
  .extra-row .ex-name{ font-size:14px; }

  /* ---------- DASHBOARD ---------- */
  .gauges{
    display:grid; grid-template-columns:repeat(2, 1fr); gap:14px; margin-top:6px;
  }
  .gauge{
    background:var(--surface-2); border:1px solid var(--steel-soft); border-radius:10px;
    padding:14px 16px;
  }
  .gauge-label{ font-size:12px; color:var(--chalk-dim); letter-spacing:0.06em; text-transform:uppercase; margin-bottom:6px; }
  .gauge-value{ font-family:'JetBrains Mono', monospace; font-size:18px; color:var(--chalk); font-weight:700; }
  .gauge-value .target{ font-size:12px; color:var(--chalk-dim); font-weight:500; }
  .gauge .progress-track{ margin:10px 0 0; }

  .bottles{ display:flex; gap:5px; margin-top:10px; flex-wrap:wrap; }
  .bottle{
    width:24px; height:34px; border:2px solid var(--steel); border-radius:5px 5px 3px 3px;
    cursor:pointer; background:transparent; position:relative;
    transition:background 0.15s, border-color 0.15s;
  }
  .bottle::before{
    content:""; position:absolute; top:-6px; left:50%; transform:translateX(-50%);
    width:8px; height:6px; background:var(--steel); border-radius:1px;
  }
  .bottle.filled{ background:var(--hazard); border-color:var(--hazard); }
  .bottle.filled::before{ background:var(--hazard); }

  .sleep-toggle{
    display:flex; align-items:center; gap:10px; margin-top:8px; cursor:pointer;
  }
  .sleep-toggle .checkbox{ width:18px; height:18px; }
  .sleep-toggle span{ font-size:13px; color:var(--chalk-dim); }

  .readiness{
    margin-top:16px; padding-top:16px; border-top:1px solid var(--steel-soft);
    display:flex; align-items:baseline; justify-content:space-between;
  }
  .readiness-label{ font-size:13px; color:var(--chalk-dim); letter-spacing:0.06em; text-transform:uppercase; }
  .readiness-value{ font-family:'JetBrains Mono', monospace; font-size:24px; color:var(--hazard); font-weight:700; }

  /* ---------- ACTIONS / FOOTER ---------- */
  .actions{ display:flex; gap:10px; justify-content:center; margin:6px 0 28px; flex-wrap:wrap; }
  .action-btn{
    background:transparent; border:1px solid var(--steel); color:var(--chalk-dim);
    font-family:'JetBrains Mono', monospace; font-size:12.5px; letter-spacing:0.05em;
    padding:10px 18px; border-radius:8px; cursor:pointer;
    transition:border-color 0.15s, color 0.15s;
  }
  .action-btn:hover{ border-color:var(--hazard); color:var(--hazard); }

  footer{ text-align:center; color:var(--steel); font-size:12px; padding-bottom:10px; }

  @media (max-width: 480px){
    .gauges{ grid-template-columns:1fr; }
    .meal-time{ width:60px; font-size:11px; }
  }

  @media (prefers-reduced-motion: reduce){
    *{ transition:none !important; scroll-behavior:auto !important; }
  }

  @media print{
    body{ background:#fff; color:#111; }
    .day-nav, .actions, #weightInput{ display:none; }
    .card, .bar-loader{ border:1px solid #ccc; background:#fff; }
    .hero-title, .hero-title .goal-num{ color:#111; }
  }
</style>
</head>
<body>
<div class="page">

  <header class="hero">
    <p class="hero-eyebrow">8–12 WEEK PROTOCOL · LEAN MUSCLE GAIN</p>
    <h1 class="hero-title">62<span class="arrow">→</span><span class="goal-num">68</span><span class="unit">KG</span></h1>
    <p class="hero-sub">Bigger chest. Wider shoulders. Bigger arms. Built one logged set at a time.</p>

    <div class="bar-loader">
      <div class="bar-loader-head">
        <label for="weightInput">Today's weigh-in (kg)</label>
        <input type="number" id="weightInput" min="55" max="75" step="0.1" value="62">
      </div>
      <svg id="barbellSvg" viewBox="0 0 600 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="40" y1="55" x2="560" y2="55" stroke="#36332a" stroke-width="10" stroke-linecap="round"/>
        <rect id="barFill" x="40" y="50" width="0" height="10" rx="5" fill="#f4c430"/>
        <g id="ticks" font-family="JetBrains Mono, monospace" font-size="11" fill="#a39d8c"></g>
        <circle id="plateMarker" cx="40" cy="55" r="13" fill="#f4c430" stroke="#15140f" stroke-width="3"/>
      </svg>
      <p id="barbellStatus" class="mono">Log your weight to start tracking.</p>
    </div>
  </header>

  <nav class="day-nav" id="dayNav" aria-label="Day selector"></nav>

  <section class="card workout-card">
    <div class="workout-header">
      <div>
        <h2 id="workoutTitle">—</h2>
        <p class="card-meta" id="workoutMeta">—</p>
      </div>
      <div class="progress-pill mono" id="workoutProgressText">0/0</div>
    </div>
    <div class="progress-track"><div class="progress-fill" id="workoutProgressFill"></div></div>
    <div id="workoutContent"></div>
  </section>

  <section class="card diet-card">
    <h2>Fuel Schedule</h2>
    <p class="card-meta">Tap each meal as you finish it — calories &amp; protein below update live. Values are close estimates for tracking, not lab-precise.</p>
    <div id="dietList"></div>
    <div class="extra-row">
      <button class="checkbox" id="soyaCheck" role="checkbox" aria-checked="false" aria-label="Soya chunks 50g dry, daily"></button>
      <span class="ex-name">Soya Chunks 50g (Dry Weight) — daily extra</span>
      <span class="meal-macro mono">180 kcal · 26g P</span>
    </div>
  </section>

  <section class="card dashboard-card">
    <h2>Daily Targets</h2>
    <div class="gauges">
      <div class="gauge">
        <div class="gauge-label">Calories</div>
        <div class="gauge-value"><span id="kcalValue">0</span> <span class="target">/ 2800–3200</span></div>
        <div class="progress-track"><div class="progress-fill" id="kcalFill"></div></div>
      </div>
      <div class="gauge">
        <div class="gauge-label">Protein</div>
        <div class="gauge-value"><span id="proteinValue">0</span>g <span class="target">/ 130–145g</span></div>
        <div class="progress-track"><div class="progress-fill" id="proteinFill"></div></div>
      </div>
      <div class="gauge">
        <div class="gauge-label">Water</div>
        <div class="gauge-value"><span id="waterValue">0.0</span>L <span class="target">/ 4L</span></div>
        <div class="bottles" id="bottles"></div>
      </div>
      <div class="gauge">
        <div class="gauge-label">Sleep</div>
        <div class="gauge-value">Target: 8 hrs</div>
        <label class="sleep-toggle">
          <button class="checkbox" id="sleepCheck" role="checkbox" aria-checked="false" aria-label="Got 8 hours sleep last night"></button>
          <span>Got 8 hrs last night</span>
        </label>
      </div>
    </div>
    <div class="readiness">
      <span class="readiness-label">Today's readiness</span>
      <span class="readiness-value mono" id="readinessValue">0%</span>
    </div>
  </section>

  <div class="actions">
    <button class="action-btn" id="resetBtn">Reset Today</button>
    <button class="action-btn" id="printBtn">Print Plan</button>
  </div>

  <footer>
    Goal: 66–68kg in 8–12 weeks · This tracker resets when the page reloads — it's a same-session helper, not a logbook.
  </footer>
</div>

<script>
(function(){
  const workoutData = {
    backBiceps: {
      title: "Back + Biceps",
      day: "Monday & Thursday",
      groups: [
        { name:"Back", exercises:[
          {name:"Wide Grip Lat Pulldown", sets:"4 × 8–12"},
          {name:"Seated Cable Row", sets:"4 × 8–12"},
          {name:"Chest Supported Row", sets:"3 × 10–12"},
          {name:"One Arm Dumbbell Row", sets:"3 × 10"},
          {name:"Face Pull", sets:"3 × 15"}
        ]},
        { name:"Biceps", exercises:[
          {name:"Barbell Curl", sets:"4 × 8–10"},
          {name:"Incline Dumbbell Curl", sets:"3 × 10–12"},
          {name:"Hammer Curl", sets:"3 × 10–12"},
          {name:"Reverse Grip EZ-Bar Curl", sets:"3 × 12–15"}
        ]}
      ]
    },
    chestTriceps: {
      title: "Chest + Triceps",
      day: "Tuesday & Friday",
      groups: [
        { name:"Chest", exercises:[
          {name:"Incline Bench Press", sets:"4 × 6–8"},
          {name:"Flat Bench Press", sets:"4 × 6–8"},
          {name:"Incline Dumbbell Press", sets:"3 × 8–10"},
          {name:"Cable Fly", sets:"3 × 12–15"}
        ]},
        { name:"Triceps", exercises:[
          {name:"Rope Pushdown", sets:"4 × 10–12"},
          {name:"Overhead Rope Extension", sets:"3 × 10–12"},
          {name:"Dips", sets:"3 Sets"}
        ]}
      ]
    },
    legsShouldersAbs: {
      title: "Legs + Shoulders + Abs",
      day: "Wednesday & Saturday",
      groups: [
        { name:"Legs", exercises:[
          {name:"Squat", sets:"4 × 6–8"},
          {name:"Leg Press", sets:"4 × 10–12"},
          {name:"Romanian Deadlift", sets:"3 × 8–10"},
          {name:"Leg Extension", sets:"3 × 12–15"},
          {name:"Leg Curl", sets:"3 × 12–15"},
          {name:"Standing Calf Raise", sets:"4 × 15–20"}
        ]},
        { name:"Shoulders", exercises:[
          {name:"Seated Dumbbell Press", sets:"4 × 8–10"},
          {name:"Lateral Raise", sets:"5 × 12–15"},
          {name:"Rear Delt Fly", sets:"4 × 15"},
          {name:"Front Plate Raise", sets:"3 × 15"}
        ]},
        { name:"Abs", exercises:[
          {name:"Hanging Leg Raise", sets:"3 × 15"},
          {name:"Cable Crunch", sets:"3 × 15"},
          {name:"Plank", sets:"3 × 60 sec"}
        ]}
      ]
    },
    rest: { title:"Rest Day", day:"Sunday", groups: [] }
  };

  const dayLabels = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const dayToGroup = { 0:"rest", 1:"backBiceps", 2:"chestTriceps", 3:"legsShouldersAbs", 4:"backBiceps", 5:"chestTriceps", 6:"legsShouldersAbs" };

  const meals = [
    { time:"7:30 AM", name:"Oats 80g + Milk 300ml + 2 Bananas", kcal:640, protein:23 },
    { time:"11:00 AM", name:"Roasted Chana 50g", kcal:180, protein:10 },
    { time:"2:00 PM", name:"5 Roti + Dal + Sabji + Dahi", kcal:840, protein:35 },
    { time:"5:00 PM", name:"2 Bananas + Roasted Chana 50g", kcal:360, protein:12 },
    { time:"6:30 PM", name:"1 Banana", kcal:90, protein:1 },
    { divider:"🏋  TRAINING WINDOW · 7:00–9:00 PM" },
    { time:"9:15 PM", name:"4 Eggs", kcal:280, protein:24 },
    { time:"10:00 PM", name:"4 Roti + Dal + Sabji", kcal:670, protein:27 },
    { time:"11:00 PM", name:"Milk 300ml", kcal:160, protein:10 }
  ];

  // ---------- state ----------
  let currentGroup = "backBiceps";
  let exState = {};      // exState[group] = array of booleans
  let mealState = meals.map(() => false);
  let soyaDone = false;
  let sleepDone = false;
  let waterFilled = 0;   // 0..8 (0.5L each)

  Object.keys(workoutData).forEach(g => {
    const count = workoutData[g].groups.reduce((sum, grp) => sum + grp.exercises.length, 0);
    exState[g] = new Array(count).fill(false);
  });

  // ---------- elements ----------
  const dayNav = document.getElementById('dayNav');
  const workoutTitle = document.getElementById('workoutTitle');
  const workoutMeta = document.getElementById('workoutMeta');
  const workoutContent = document.getElementById('workoutContent');
  const workoutProgressText = document.getElementById('workoutProgressText');
  const workoutProgressFill = document.getElementById('workoutProgressFill');
  const dietList = document.getElementById('dietList');
  const bottlesEl = document.getElementById('bottles');

  // ---------- day nav ----------
  const todayIdx = new Date().getDay();
  for (let i = 1; i <= 7; i++) {
    const idx = i % 7; // 1..6,0 => Mon..Sun
    const btn = document.createElement('button');
    btn.className = 'day-btn';
    btn.textContent = dayLabels[idx];
    btn.dataset.day = idx;
    btn.setAttribute('aria-pressed', 'false');
    if (idx === todayIdx) {
      const dot = document.createElement('span');
      dot.className = 'today-dot';
      btn.appendChild(dot);
    }
    btn.addEventListener('click', () => selectDay(idx));
    dayNav.appendChild(btn);
  }

  function selectDay(dayIdx){
    currentGroup = dayToGroup[dayIdx];
    [...dayNav.children].forEach(b => {
      const active = Number(b.dataset.day) === dayIdx;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    renderWorkout();
  }

  // ---------- workout rendering ----------
  function renderWorkout(){
    const data = workoutData[currentGroup];
    workoutTitle.textContent = data.title;
    workoutMeta.textContent = data.day;
    workoutContent.innerHTML = '';

    if (currentGroup === 'rest'){
      workoutContent.innerHTML = '<div class="rest-day"><div class="big-emoji">😴</div>Recovery day. Eat your protein, hit your water, get your 8 hours — growth happens here too.</div>';
      workoutProgressText.textContent = '—';
      workoutProgressFill.style.width = '0%';
      workoutProgressFill.classList.remove('full');
      return;
    }

    let exIndex = 0;
    data.groups.forEach(group => {
      const groupEl = document.createElement('div');
      groupEl.className = 'muscle-group';
      const h3 = document.createElement('h3');
      h3.textContent = group.name;
      groupEl.appendChild(h3);

      group.exercises.forEach(ex => {
        const i = exIndex;
        const row = document.createElement('div');
        row.className = 'ex-row';
        if (exState[currentGroup][i]) row.classList.add('done');

        const cb = document.createElement('button');
        cb.className = 'checkbox' + (exState[currentGroup][i] ? ' checked' : '');
        cb.setAttribute('role','checkbox');
        cb.setAttribute('aria-checked', String(exState[currentGroup][i]));
        cb.setAttribute('aria-label', ex.name);
        cb.addEventListener('click', () => {
          exState[currentGroup][i] = !exState[currentGroup][i];
          renderWorkout();
        });

        const name = document.createElement('span');
        name.className = 'ex-name';
        name.textContent = ex.name;

        const sets = document.createElement('span');
        sets.className = 'ex-sets mono';
        sets.textContent = ex.sets;

        row.appendChild(cb);
        row.appendChild(name);
        row.appendChild(sets);
        groupEl.appendChild(row);
        exIndex++;
      });

      workoutContent.appendChild(groupEl);
    });

    const total = exState[currentGroup].length;
    const done = exState[currentGroup].filter(Boolean).length;
    workoutProgressText.textContent = done + '/' + total;
    const pct = total ? (done/total)*100 : 0;
    workoutProgressFill.style.width = pct + '%';
    workoutProgressFill.classList.toggle('full', done === total && total > 0);
  }

  // ---------- diet rendering ----------
  function renderDiet(){
    dietList.innerHTML = '';
    meals.forEach((m, i) => {
      if (m.divider){
        const d = document.createElement('div');
        d.className = 'meal-divider';
        d.textContent = m.divider;
        dietList.appendChild(d);
        return;
      }
      const row = document.createElement('div');
      row.className = 'meal-row' + (mealState[i] ? ' done' : '');

      const cb = document.createElement('button');
      cb.className = 'checkbox' + (mealState[i] ? ' checked' : '');
      cb.setAttribute('role','checkbox');
      cb.setAttribute('aria-checked', String(mealState[i]));
      cb.setAttribute('aria-label', m.name);
      cb.addEventListener('click', () => {
        mealState[i] = !mealState[i];
        renderDiet();
        updateDashboard();
      });

      const time = document.createElement('span');
      time.className = 'meal-time mono';
      time.textContent = m.time;

      const name = document.createElement('span');
      name.className = 'meal-name';
      name.textContent = m.name;

      const macro = document.createElement('span');
      macro.className = 'meal-macro mono';
      macro.textContent = m.kcal + ' kcal · ' + m.protein + 'g P';

      row.appendChild(cb);
      row.appendChild(time);
      row.appendChild(name);
      row.appendChild(macro);
      dietList.appendChild(row);
    });
  }

  document.getElementById('soyaCheck').addEventListener('click', function(){
    soyaDone = !soyaDone;
    this.classList.toggle('checked', soyaDone);
    this.setAttribute('aria-checked', String(soyaDone));
    updateDashboard();
  });

  // ---------- water bottles ----------
  for (let i = 0; i < 8; i++){
    const b = document.createElement('button');
    b.className = 'bottle';
    b.setAttribute('aria-label', 'Half litre of water ' + (i+1));
    b.addEventListener('click', () => {
      waterFilled = (i < waterFilled) ? i : i + 1;
      renderBottles();
      updateDashboard();
    });
    bottlesEl.appendChild(b);
  }
  function renderBottles(){
    [...bottlesEl.children].forEach((b, i) => b.classList.toggle('filled', i < waterFilled));
  }

  // ---------- sleep toggle ----------
  document.getElementById('sleepCheck').addEventListener('click', function(){
    sleepDone = !sleepDone;
    this.classList.toggle('checked', sleepDone);
    this.setAttribute('aria-checked', String(sleepDone));
    updateDashboard();
  });

  // ---------- dashboard ----------
  function updateDashboard(){
    let kcal = 0, protein = 0;
    meals.forEach((m, i) => { if (!m.divider && mealState[i]){ kcal += m.kcal; protein += m.protein; } });
    if (soyaDone){ kcal += 180; protein += 26; }

    document.getElementById('kcalValue').textContent = kcal;
    document.getElementById('proteinValue').textContent = protein;
    document.getElementById('kcalFill').style.width = Math.min(100, (kcal/3200)*100) + '%';
    document.getElementById('proteinFill').style.width = Math.min(100, (protein/145)*100) + '%';

    const waterL = (waterFilled * 0.5).toFixed(1);
    document.getElementById('waterValue').textContent = waterL;

    // readiness score: average of workout%, diet checked fraction, water fraction, sleep
    const workoutTotal = currentGroup === 'rest' ? 1 : exState[currentGroup].length;
    const workoutDone = currentGroup === 'rest' ? 1 : exState[currentGroup].filter(Boolean).length;
    const workoutFrac = workoutTotal ? workoutDone/workoutTotal : 0;

    const mealCount = meals.filter(m => !m.divider).length;
    const mealDone = mealState.filter(Boolean).length + (soyaDone ? 1 : 0);
    const dietFrac = Math.min(1, mealDone / (mealCount + 1));

    const waterFrac = waterFilled / 8;
    const sleepFrac = sleepDone ? 1 : 0;

    const readiness = Math.round(((workoutFrac + dietFrac + waterFrac + sleepFrac) / 4) * 100);
    document.getElementById('readinessValue').textContent = readiness + '%';
  }

  // ---------- weight / barbell loader ----------
  const weightInput = document.getElementById('weightInput');
  const barFill = document.getElementById('barFill');
  const plateMarker = document.getElementById('plateMarker');
  const barbellStatus = document.getElementById('barbellStatus');
  const ticksG = document.getElementById('ticks');

  // draw static ticks 62..68
  for (let kg = 62; kg <= 68; kg++){
    const x = 40 + ((kg-62)/6) * 520;
    const tick = document.createElementNS("http://www.w3.org/2000/svg","line");
    tick.setAttribute('x1', x); tick.setAttribute('x2', x);
    tick.setAttribute('y1', 40); tick.setAttribute('y2', 70);
    tick.setAttribute('stroke', '#4a463c'); tick.setAttribute('stroke-width','2');
    ticksG.appendChild(tick);
    const label = document.createElementNS("http://www.w3.org/2000/svg","text");
    label.setAttribute('x', x); label.setAttribute('y', 90);
    label.setAttribute('text-anchor','middle');
    label.textContent = kg;
    ticksG.appendChild(label);
  }

  function updateBarbell(){
    const w = parseFloat(weightInput.value);
    const clamped = Math.max(62, Math.min(68, isNaN(w) ? 62 : w));
    const frac = (clamped - 62) / 6;
    const x = 40 + frac * 520;
    barFill.setAttribute('width', Math.max(0, x - 40));
    plateMarker.setAttribute('cx', x);

    if (isNaN(w)){
      barbellStatus.textContent = 'Log your weight to start tracking.';
      barbellStatus.classList.remove('win');
    } else if (w >= 68){
      barbellStatus.textContent = 'Goal hit — 68kg+. Time to set a new target. 🎉';
      barbellStatus.classList.add('win');
    } else if (w <= 62){
      barbellStatus.textContent = (62 - w).toFixed(1) + 'kg below baseline — every gram from here counts.';
      barbellStatus.classList.remove('win');
    } else {
      barbellStatus.textContent = (68 - w).toFixed(1) + 'kg to go — stay the course.';
      barbellStatus.classList.remove('win');
    }
  }
  weightInput.addEventListener('input', updateBarbell);

  // ---------- reset / print ----------
  document.getElementById('resetBtn').addEventListener('click', () => {
    exState[currentGroup] = exState[currentGroup].map(() => false);
    mealState = mealState.map(() => false);
    soyaDone = false;
    sleepDone = false;
    waterFilled = 0;
    document.getElementById('soyaCheck').classList.remove('checked');
    document.getElementById('soyaCheck').setAttribute('aria-checked','false');
    document.getElementById('sleepCheck').classList.remove('checked');
    document.getElementById('sleepCheck').setAttribute('aria-checked','false');
    renderBottles();
    renderWorkout();
    renderDiet();
    updateDashboard();
  });

  document.getElementById('printBtn').addEventListener('click', () => window.print());

  // ---------- init ----------
  selectDay(todayIdx);
  renderDiet();
  renderBottles();
  updateBarbell();
  updateDashboard();
})();
</script>
</body>
</html>