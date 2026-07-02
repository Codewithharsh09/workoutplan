(function(){
  // ---------- DEFAULT CONFIG ----------
  const defaultConfig = {
    startWeight: 62,
    goalWeight: 68,
    calorieTarget: 3000,
    proteinTarget: 140,
    customMeals: [],
    dayToGroup: { 0:"rest", 1:"backBiceps", 2:"legsShoulders", 3:"chestTriceps", 4:"backBiceps", 5:"legsShoulders", 6:"chestTriceps" },
    workoutData: {
      backBiceps: {
        title: "Back + Biceps",
        day: "Monday & Thursday",
        groups: [
          { name:"Back", exercises:[
            {name:"Wide Grip Lat Pulldown", sets:4, reps:"8–12"},
            {name:"Seated Cable Row(both grip)", sets:4, reps:"8–12"},
            {name:"Straight Arm Pulldown(rope)", sets:3, reps:"12–15"},
            {name:"Dumbell Shrugs", sets:3, reps:"12–15"}
          ]},
          { name:"Biceps", exercises:[
            {name:"Barbell Curl", sets:4, reps:"8–10"},
            {name:"Preacher Curl", sets:3, reps:"10–12"},
            {name:"Hammer Curl", sets:3, reps:"10–12"},
            {name:"Reverse Grip EZ-Bar Curl", sets:3, reps:"10–12"}
          ]},
           { name:"Forearms", exercises:[
            {name:"Wrist Curl", sets:3, reps:"15"},
            {name:"Reverse Wrist Curl", sets:3, reps:"15"},
            {name:"Dumbbell Wrist Rotation", sets:3, reps:"15"}
          ]},
        ]
      },
      chestTriceps: {
        title: "Chest + Triceps",
        day: "Wednesday & Saturday",
        groups: [
          { name:"Chest", exercises:[
            {name:"Incline Bench Press", sets:4, reps:"6–8"},
            {name:"Flat Bench Press", sets:4, reps:"6–8"},
            {name:"Decline Bench Press", sets:3, reps:"8–10"},
            {name:"Incline Bench(Db)", sets:3, reps:"8–10"},
            {name:"Cable Pec Fly", sets:3, reps:"12–15"}
          ]},
          { name:"Triceps", exercises:[
            {name:"Rope Pushdown", sets:4, reps:"10–12"},
            {name:"Skull Crusher (Flat Bench)", sets:3, reps:"10–12"},
            {name:"Close Grip flat Bench Press", sets:3, reps:"8–10"}
          ]},
           { name:"Abs", exercises:[
            {name:"Floor Crunches", sets:3, reps:"15"},
            {name:"Weighted Leg Raise", sets:3, reps:"12–15"},
            {name:"Side Plank", sets:3, reps:"45 sec/side"}
          ]}
        ]
      },
      legsShoulders: {
        title: "Legs + Shoulders",
        day: "Tuesday & Friday",
        groups: [
          { name:"Legs", exercises:[
            {name:"Sumo Squat", sets:3, reps:"10–12"},
            {name:"Leg Press", sets:4, reps:"6–8"},
            {name:"Leg extension(opt.)", sets:4, reps:"6–8"},
            {name:"Leg Curl", sets:3, reps:"12–15"},
            {name:"Hip Thrust", sets:3, reps:"10–12"}
          ]},
          { name:"Calves", exercises:[
            {name:"Seated Calf Raise", sets:4, reps:"15–20"}
          ]},
          { name:"Shoulders", exercises:[
            {name:"Seated Dumbbell Press", sets:4, reps:"8–10"},
            {name:"Lateral Raise", sets:4, reps:"12–15"},
            {name:"Face Pull", sets:3, reps:"15"}
          ]},
        ]
      },
      rest: { title:"Rest Day", day:"Sunday", groups: [] }
    }
  };

  let config = loadConfig();

  // Add workoutData if not present
  if (!config.workoutData) {
    config.workoutData = JSON.parse(JSON.stringify(defaultConfig.workoutData));
  }
  if (!config.dayToGroup) {
    config.dayToGroup = JSON.parse(JSON.stringify(defaultConfig.dayToGroup));
  }

  const dayLabels = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const dayToGroup = config.dayToGroup; // live reference — mutations auto-persist via saveConfig

  let meals = [
    { time:"07:30", name:"Oats 80g + Milk 300ml + 2 Bananas", kcal:640, protein:23, default:true },
    { time:"11:00", name:"Roasted Chana 50g", kcal:180, protein:10, default:true },
    { time:"14:00", name:"5 Roti + Dal + Sabji + Dahi", kcal:840, protein:35, default:true },
    { time:"17:00", name:"2 Bananas + Roasted Chana 50g", kcal:360, protein:12, default:true },
    { time:"18:30", name:"1 Banana", kcal:90, protein:1, default:true },
    { divider:"🏋  TRAINING WINDOW · 7:00–9:00 PM" },
    { time:"21:15", name:"4 Eggs", kcal:280, protein:24, default:true },
    { time:"22:00", name:"4 Roti + Dal + Sabji", kcal:670, protein:27, default:true },
    { time:"23:00", name:"Milk 300ml", kcal:160, protein:10, default:true }
  ];

  // ---------- STORAGE FUNCTIONS ----------
  function getDailyStateKey(){
    const today = new Date().toISOString().split('T')[0];
    return 'workoutDailyState_' + today;
  }

  function saveDailyState(){
    const state = {
      exState: exState,
      mealState: mealState,
      soyaDone: soyaDone,
      sleepDone: sleepDone,
      waterFilled: waterFilled,
      sleepHours: sleepHours,
      weight: parseFloat((typeof weightInput !== 'undefined' && weightInput.value) ? weightInput.value : (config.startWeight || 0))
    };
    localStorage.setItem(getDailyStateKey(), JSON.stringify(state));
  }

  function loadDailyState(){
    const stored = localStorage.getItem(getDailyStateKey());
    if (stored){
      const state = JSON.parse(stored);
      // Merge exState safely: keep current structure but copy boolean values where possible
      if (state.exState && typeof state.exState === 'object'){
        Object.keys(exState).forEach(g => {
          if (Array.isArray(exState[g]) && Array.isArray(state.exState[g])){
            const len = Math.min(exState[g].length, state.exState[g].length);
            for (let i=0;i<len;i++) exState[g][i] = !!state.exState[g][i];
          }
        });
      }
      // Merge mealState without changing length
      if (Array.isArray(state.mealState) && Array.isArray(mealState)){
        const len = Math.min(mealState.length, state.mealState.length);
        for (let i=0;i<len;i++) mealState[i] = !!state.mealState[i];
      }
      soyaDone = !!state.soyaDone;
      sleepDone = !!state.sleepDone;
      waterFilled = state.waterFilled || 0;
      sleepHours = state.sleepHours || 0;
      if (typeof state.weight !== 'undefined'){
        try { document.getElementById('weightInput').value = state.weight; } catch(e){}
      }
    }
  }

  function loadConfig(){
    const stored = localStorage.getItem('workoutConfig');
    return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(defaultConfig));
  }

  function saveConfig(cfg){
    localStorage.setItem('workoutConfig', JSON.stringify(cfg));
  }

  // Auto-calculate calories based on weight
  function calculateCalories(weight) {
    // Harris-Benedict formula adjusted for bulking
    const tdee = 1.375 * (10 * weight + 6.25 * 180 - 5 * 30 + 5); // assuming 180cm height, 30yo male
    return Math.round(tdee * 1.1); // 10% surplus for lean bulk
  }

  function calculateProtein(weight) {
    return Math.round(weight * 2.2); // 2.2g per kg for muscle building
  }

  // ---------- state ----------
  let currentGroup = "backBiceps";
  let exState = {};
  let mealState = meals.map(() => false);
  let soyaDone = false;
  let sleepDone = false;
  let waterFilled = 0;
  let sleepHours = 0;

  Object.keys(config.workoutData).forEach(g => {
    const count = config.workoutData[g].groups.reduce((sum, grp) => sum + grp.exercises.length, 0);
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
  const settingsModal = document.getElementById('settingsModal');
  const settingsBtn = document.getElementById('settingsBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');

  // ---------- MODAL TABS ----------
  document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabName = e.target.dataset.tab;
      document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.modal-tab-content').forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      document.getElementById('tab-' + tabName).classList.add('active');
    });
  });

  // ---------- SETTINGS MODAL ----------
  let savedScrollY = 0;

  settingsBtn.addEventListener('click', () => {
    openSettingsModal();
  });

  function closeSettingsModal(){
    settingsModal.classList.remove('open');
    document.body.classList.remove('modal-open');
    document.documentElement.classList.remove('modal-open');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);
  }

  closeSettingsBtn.addEventListener('click', closeSettingsModal);

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeSettingsModal();
  });

  function openSettingsModal(){
    savedScrollY = window.pageYOffset || window.scrollY || 0;
    document.body.style.top = `-${savedScrollY}px`;
    document.body.classList.add('modal-open');
    document.documentElement.classList.add('modal-open');

    document.getElementById('startWeightInput').value = config.startWeight;
    document.getElementById('goalWeightInput').value = config.goalWeight;
    document.getElementById('calorieTargetInput').value = config.calorieTarget;
    document.getElementById('proteinTargetInput').value = config.proteinTarget;
    
    updateCalorieCalcInfo();
    renderMealsList();
    renderExercisesList();
    settingsModal.classList.add('open');
  }

  function updateCalorieCalcInfo(){
    const startWeight = parseFloat(document.getElementById('startWeightInput').value);
    const goalWeight = parseFloat(document.getElementById('goalWeightInput').value);
    const weight = !isNaN(goalWeight) ? goalWeight : (!isNaN(startWeight) ? startWeight : config.startWeight);
    const suggestedCal = calculateCalories(weight);
    const suggestedPro = calculateProtein(weight);
    document.getElementById('calorieCalcInfo').innerHTML = 
      `<strong>🧮 Suggested for ${weight}kg:</strong><br>` +
      `Calories: ${suggestedCal} kcal/day | Protein: ${suggestedPro}g/day<br>` +
      `<small>Formula: TDEE × 1.1 (lean bulk) & ${weight}kg × 2.2g/kg</small>`;
  }

  document.getElementById('startWeightInput').addEventListener('change', updateCalorieCalcInfo);
  document.getElementById('goalWeightInput').addEventListener('change', updateCalorieCalcInfo);

  function updateTargetLabels(){
    document.getElementById('kcalTargetText').textContent = '/ ' + config.calorieTarget;
    document.getElementById('proteinTargetText').textContent = '/ ' + config.proteinTarget + 'g';
  }

  // ---------- MEALS MANAGEMENT ----------
  function renderMealsList(){
    const defaultContainer = document.getElementById('defaultMealsList');
    const customContainer = document.getElementById('customMealsList');
    
    defaultContainer.innerHTML = '';
    customContainer.innerHTML = '';
    
    meals.forEach((m, idx) => {
      if (m.divider) return;
      const item = document.createElement('div');
      item.className = 'modal-item';
      item.innerHTML = `<div class="modal-item-info">
        <strong>${m.time} — ${m.name}</strong><br>
        <small>${m.kcal} kcal · ${m.protein}g P</small>
      </div>`;
      
      const actions = document.createElement('div');
      actions.className = 'modal-item-actions';
      
      if (!m.default) {
        const editBtn = document.createElement('button');
        editBtn.className = 'modal-item-edit';
        editBtn.textContent = '✎';
        editBtn.onclick = () => editMeal(idx);
        actions.appendChild(editBtn);
        
        const delBtn = document.createElement('button');
        delBtn.className = 'modal-item-close';
        delBtn.textContent = '✕';
        delBtn.onclick = () => {
          meals.splice(idx, 1);
          mealState.splice(idx, 1);
          renderMealsList();
        };
        actions.appendChild(delBtn);
      } else {
        const editBtn = document.createElement('button');
        editBtn.className = 'modal-item-edit';
        editBtn.textContent = '✎';
        editBtn.onclick = () => editMeal(idx);
        actions.appendChild(editBtn);
      }
      
      item.appendChild(actions);
      (m.default ? defaultContainer : customContainer).appendChild(item);
    });
  }

  function editMeal(idx){
    const m = meals[idx];
    const form = `
      <div class="edit-form" id="editMealForm">
        <h3 style="margin:0 0 12px; font-size:13px;">Edit Meal</h3>
        <div class="edit-form-row">
          <div class="edit-form-field">
            <label>Time</label>
            <input type="time" class="modal-input" id="editMealTime" value="${m.time}">
          </div>
          <div class="edit-form-field">
            <label>Meal Name</label>
            <input type="text" class="modal-input" id="editMealName" value="${m.name}">
          </div>
        </div>
        <div class="edit-form-row">
          <div class="edit-form-field">
            <label>Calories (kcal)</label>
            <input type="number" class="modal-input" id="editMealKcal" min="0" max="2000" value="${m.kcal}">
          </div>
          <div class="edit-form-field">
            <label>Protein (g)</label>
            <input type="number" class="modal-input" id="editMealProtein" min="0" max="150" value="${m.protein}">
          </div>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="modal-btn" onclick="document.getElementById('editMealForm').remove()">Cancel</button>
          <button class="modal-btn primary" onclick="saveMealEdit(${idx})">Save</button>
        </div>
      </div>
    `;
    const container = document.getElementById('tab-meals');
    const existing = document.getElementById('editMealForm');
    if (existing) existing.remove();
    const formEl = document.createElement('div');
    formEl.innerHTML = form;
    container.insertBefore(formEl.firstElementChild, container.firstChild);
  }

  window.saveMealEdit = function(idx){
    meals[idx].time = document.getElementById('editMealTime').value;
    meals[idx].name = document.getElementById('editMealName').value;
    meals[idx].kcal = parseInt(document.getElementById('editMealKcal').value);
    meals[idx].protein = parseInt(document.getElementById('editMealProtein').value);
    document.getElementById('editMealForm').remove();
    renderMealsList();
  };

  document.getElementById('addMealBtn').addEventListener('click', () => {
    const name = document.getElementById('newMealName').value.trim();
    const time = document.getElementById('newMealTime').value;
    const kcal = parseInt(document.getElementById('newMealKcal').value) || 0;
    const protein = parseInt(document.getElementById('newMealProtein').value) || 0;

    if (!name){
      alert('Please enter a meal name');
      return;
    }

    meals.push({ time, name, kcal, protein, custom: true });
    mealState.push(false);
    document.getElementById('newMealName').value = '';
    document.getElementById('newMealTime').value = '12:00';
    document.getElementById('newMealKcal').value = '';
    document.getElementById('newMealProtein').value = '';
    renderMealsList();
    renderDiet();
    updateDashboard();
  });

  // ---------- EXERCISES MANAGEMENT ----------
  function deleteWorkoutGroup(key){
    if (!confirm('Delete "' + config.workoutData[key].title + '" and all its exercises?')) return;
    Object.keys(dayToGroup).forEach(d => {
      if (dayToGroup[d] === key) dayToGroup[d] = 'rest';
    });
    delete config.workoutData[key];
    delete exState[key];
    if (currentGroup === key){ currentGroup = 'rest'; renderWorkout(); }
    saveConfig(config);
    renderExercisesList();
  }
  window.deleteWorkoutGroup = deleteWorkoutGroup;

  function renderExercisesList(){
    const container = document.getElementById('exercisesList');
    container.innerHTML = '';

    const dayNamesShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    // Build groupKey → assigned day names map for dropdown labels
    const groupDays = {};
    Object.keys(dayToGroup).forEach(d => {
      const key = dayToGroup[d];
      if (key !== 'rest'){
        if (!groupDays[key]) groupDays[key] = [];
        groupDays[key].push(parseInt(d));
      }
    });

    // ─── 1. ADD EXERCISE TO WORKOUT (primary action, shown first) ───
    const addForm = document.createElement('div');
    addForm.className = 'edit-form';
    addForm.style.marginBottom = '16px';

    const workoutOptions = Object.keys(config.workoutData)
      .filter(k => k !== 'rest')
      .map(k => {
        const daysStr = groupDays[k] ? groupDays[k].map(d => dayNamesShort[d]).join(', ') : 'Unassigned';
        return `<option value="${k}">${config.workoutData[k].title} (${daysStr})</option>`;
      }).join('');

    addForm.innerHTML = `
      <h3 style="margin:0 0 4px; font-size:13px;">Add Exercise to Workout</h3>
      <p style="margin:0 0 12px; font-size:11px; color:var(--chalk-dim);">Pick the workout, enter a muscle group name (e.g. Forearm), then add your exercise.</p>
      <div class="edit-form-row">
        <div class="edit-form-field">
          <label>Workout</label>
          <select class="modal-input" id="newExerciseDay">${workoutOptions}</select>
        </div>
        <div class="edit-form-field">
          <label>Muscle Group</label>
          <input type="text" class="modal-input" id="newExerciseGroup" placeholder="e.g. Forearm">
        </div>
      </div>
      <div class="edit-form-row">
        <div class="edit-form-field">
          <label>Exercise Name</label>
          <input type="text" class="modal-input" id="newExerciseName" placeholder="e.g. Wrist Curl">
        </div>
        <div class="edit-form-field">
          <label>Sets</label>
          <input type="number" class="modal-input" id="newExerciseSets" min="1" max="10" value="3">
        </div>
        <div class="edit-form-field">
          <label>Reps</label>
          <input type="text" class="modal-input" id="newExerciseReps" placeholder="8-12">
        </div>
      </div>
      <button class="modal-add-btn" id="addExerciseBtn">➕ Add Exercise</button>
    `;
    container.appendChild(addForm);

    // Pre-select the workout currently shown on the viewed day
    const sel = addForm.querySelector('#newExerciseDay');
    if (sel && currentGroup !== 'rest' && config.workoutData[currentGroup]) sel.value = currentGroup;

    addForm.querySelector('#addExerciseBtn').addEventListener('click', () => {
      const day      = addForm.querySelector('#newExerciseDay').value;
      const groupName = addForm.querySelector('#newExerciseGroup').value.trim();
      const name     = addForm.querySelector('#newExerciseName').value.trim();
      const sets     = parseInt(addForm.querySelector('#newExerciseSets').value) || 3;
      const reps     = addForm.querySelector('#newExerciseReps').value.trim() || '8-12';

      if (!name || !groupName){ alert('Please enter exercise name and muscle group'); return; }

      const targetDay = config.workoutData[day];
      let group = targetDay.groups.find(g => g.name.toLowerCase() === groupName.toLowerCase());
      if (!group){
        targetDay.groups.push({ name: groupName, exercises: [] });
        group = targetDay.groups[targetDay.groups.length - 1];
      }
      group.exercises.push({ name, sets, reps });

      // Extend exState without resetting existing checked boxes
      if (!exState[day]) exState[day] = [];
      const newCount = targetDay.groups.reduce((s, g) => s + g.exercises.length, 0);
      while (exState[day].length < newCount) exState[day].push(false);

      addForm.querySelector('#newExerciseName').value = '';
      addForm.querySelector('#newExerciseGroup').value = '';
      addForm.querySelector('#newExerciseSets').value = '3';
      addForm.querySelector('#newExerciseReps').value = '';
      renderExercisesList();
      renderWorkout();
      saveConfig(config);
    });

    // ─── 2. CREATE NEW WORKOUT GROUP (collapsible, secondary action) ───
    let muscleMode = 'single';

    const createToggleBtn = document.createElement('button');
    createToggleBtn.style.cssText = 'width:100%; padding:10px 14px; background:var(--surface-2); border:1px solid var(--steel); color:var(--chalk-dim); border-radius:8px; cursor:pointer; font-size:12px; font-weight:600; text-align:left; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;';
    createToggleBtn.innerHTML = '<span>+ Create New Workout Group</span><span>▼</span>';
    container.appendChild(createToggleBtn);

    const createForm = document.createElement('div');
    createForm.className = 'edit-form';
    createForm.style.cssText = 'display:none; margin-bottom:16px;';
    createForm.innerHTML = `
      <div style="background:var(--surface); border:1px solid var(--hazard-dim); border-radius:6px; padding:10px 12px; margin-bottom:14px; font-size:11px; color:var(--chalk-dim); line-height:1.6;">
        ⚠️ <strong style="color:var(--chalk);">Only use this to create a brand-new workout plan.</strong><br>
        To add Forearm or any muscle to an existing day, use <strong style="color:var(--hazard);">Add Exercise to Workout</strong> above — type the muscle name in the Muscle Group field.
      </div>
      <div style="display:flex; gap:8px; margin-bottom:12px;">
        <button id="btnSingle" style="flex:1; padding:8px; background:var(--hazard); color:#1d1a10; border:none; border-radius:6px; font-weight:700; font-size:12px; cursor:pointer;">Single Muscle</button>
        <button id="btnDouble" style="flex:1; padding:8px; background:var(--surface-2); color:var(--chalk-dim); border:1px solid var(--steel); border-radius:6px; font-weight:700; font-size:12px; cursor:pointer;">Double Muscle</button>
      </div>
      <div class="edit-form-row">
        <div class="edit-form-field">
          <label>Muscle 1</label>
          <input type="text" class="modal-input" id="newGroupMuscle1" placeholder="e.g. Arms">
        </div>
        <div class="edit-form-field" id="muscle2Field" style="display:none;">
          <label>Muscle 2</label>
          <input type="text" class="modal-input" id="newGroupMuscle2" placeholder="e.g. Shoulders">
        </div>
      </div>
      <label style="font-size:11px; color:var(--chalk-dim); text-transform:uppercase; letter-spacing:0.06em; display:block; margin-bottom:4px;">Assign Days</label>
      <p style="margin:0 0 8px; font-size:10px; color:var(--rust);">Selecting a day replaces its current workout on that day (data is NOT deleted).</p>
      <div id="dayAssignRow" style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;"></div>
      <button class="modal-add-btn" id="createGroupBtn" style="margin-bottom:0;">+ Create Group</button>
    `;
    container.appendChild(createForm);

    let createOpen = false;
    createToggleBtn.addEventListener('click', () => {
      createOpen = !createOpen;
      createForm.style.display = createOpen ? '' : 'none';
      createToggleBtn.innerHTML = '<span>' + (createOpen ? '− Create New Workout Group' : '+ Create New Workout Group') + '</span><span>' + (createOpen ? '▲' : '▼') + '</span>';
    });

    // Day checkboxes — show current assignment so user knows what will be replaced
    const dayAssignRow = createForm.querySelector('#dayAssignRow');
    for (let d = 0; d < 7; d++){
      const curKey = dayToGroup[d];
      const hasCur = curKey && curKey !== 'rest' && config.workoutData[curKey];
      const curTitle = hasCur ? config.workoutData[curKey].title : '';

      const lbl = document.createElement('label');
      lbl.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:2px; cursor:pointer; padding:6px 10px; background:var(--surface-2); border:1px solid ' + (hasCur ? 'var(--hazard-dim)' : 'var(--steel)') + '; border-radius:6px;';

      const row = document.createElement('div');
      row.style.cssText = 'display:flex; align-items:center; gap:4px; font-size:12px;';
      const cb = document.createElement('input');
      cb.type = 'checkbox'; cb.className = 'day-assign-cb'; cb.value = d;
      cb.style.accentColor = 'var(--hazard)';
      row.appendChild(cb);
      row.appendChild(document.createTextNode(dayNamesShort[d]));
      lbl.appendChild(row);

      if (curTitle){
        const sub = document.createElement('span');
        sub.style.cssText = 'font-size:9px; color:var(--hazard); max-width:64px; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;';
        sub.textContent = curTitle;
        lbl.appendChild(sub);
      }
      dayAssignRow.appendChild(lbl);
    }

    // Mode toggle
    const btnSingle = createForm.querySelector('#btnSingle');
    const btnDouble = createForm.querySelector('#btnDouble');
    const muscle2Field = createForm.querySelector('#muscle2Field');
    function setMuscleMode(mode){
      muscleMode = mode;
      const on  = 'flex:1; padding:8px; background:var(--hazard); color:#1d1a10; border:none; border-radius:6px; font-weight:700; font-size:12px; cursor:pointer;';
      const off = 'flex:1; padding:8px; background:var(--surface-2); color:var(--chalk-dim); border:1px solid var(--steel); border-radius:6px; font-weight:700; font-size:12px; cursor:pointer;';
      btnSingle.style.cssText = mode === 'single' ? on : off;
      btnDouble.style.cssText  = mode === 'double' ? on : off;
      muscle2Field.style.display = mode === 'double' ? '' : 'none';
    }
    btnSingle.addEventListener('click', () => setMuscleMode('single'));
    btnDouble.addEventListener('click', () => setMuscleMode('double'));

    createForm.querySelector('#createGroupBtn').addEventListener('click', () => {
      const muscle1 = createForm.querySelector('#newGroupMuscle1').value.trim();
      const muscle2 = muscleMode === 'double' ? createForm.querySelector('#newGroupMuscle2').value.trim() : '';
      const selectedDays = [...createForm.querySelectorAll('.day-assign-cb:checked')].map(cb => parseInt(cb.value));
      if (!muscle1){ alert('Please enter at least one muscle name'); return; }
      if (muscleMode === 'double' && !muscle2){ alert('Please enter Muscle 2 name'); return; }

      // Warn before replacing existing non-rest days
      const replacedDays = selectedDays.filter(d => dayToGroup[d] && dayToGroup[d] !== 'rest' && config.workoutData[dayToGroup[d]]);
      if (replacedDays.length){
        const names = replacedDays.map(d => dayNamesShort[d] + ' (' + config.workoutData[dayToGroup[d]].title + ')').join(', ');
        if (!confirm('These days will switch to the new workout:\n' + names + '\n\nExisting workout data is NOT deleted — those exercises remain in the list below. Continue?')) return;
      }

      const title = muscle2 ? muscle1 + ' + ' + muscle2 : muscle1;
      const key = 'custom_' + Date.now();
      config.workoutData[key] = {
        title,
        day: selectedDays.length ? selectedDays.map(d => dayNamesShort[d]).join(' & ') : 'Unassigned',
        groups: muscle2 ? [{ name: muscle1, exercises: [] }, { name: muscle2, exercises: [] }] : [{ name: muscle1, exercises: [] }],
        custom: true
      };
      selectedDays.forEach(d => { dayToGroup[d] = key; });
      exState[key] = [];

      saveConfig(config);
      renderExercisesList();
      renderWorkout();
    });

    // ─── 3. EXISTING WORKOUT GROUPS LIST ───
    Object.keys(config.workoutData).forEach(groupKey => {
      if (groupKey === 'rest') return;

      const isCustom = !!config.workoutData[groupKey].custom;
      const daysLabel = groupDays[groupKey] ? groupDays[groupKey].map(d => dayNamesShort[d]).join(', ') : 'Unassigned';

      const section = document.createElement('div');
      section.className = 'modal-section collapsible';

      const labelEl = document.createElement('label');
      labelEl.className = 'modal-label';
      labelEl.innerHTML = config.workoutData[groupKey].title +
        '<span style="font-size:10px; color:var(--steel); font-weight:400; margin-left:8px; text-transform:none;">(' + daysLabel + ')</span>';
      section.appendChild(labelEl);

      const content = document.createElement('div');
      content.className = 'section-content';

      // ── Assign Days panel (available for ALL groups) ──
      const assignToggle = document.createElement('button');
      assignToggle.style.cssText = 'background:none; border:1px solid var(--steel); color:var(--chalk-dim); border-radius:6px; padding:5px 12px; cursor:pointer; font-size:11px; margin-bottom:12px;';
      assignToggle.textContent = '📅 Assign Days';
      content.appendChild(assignToggle);

      const assignPanel = document.createElement('div');
      assignPanel.style.cssText = 'display:none; margin-bottom:14px;';

      const cbRow = document.createElement('div');
      cbRow.style.cssText = 'display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px;';

      for (let d = 0; d < 7; d++){
        const curKey   = dayToGroup[d];
        const isThis   = curKey === groupKey;
        const hasOther = curKey && curKey !== 'rest' && curKey !== groupKey && config.workoutData[curKey];
        const otherTitle = hasOther ? config.workoutData[curKey].title : '';

        const lbl = document.createElement('label');
        lbl.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:2px; cursor:pointer; padding:6px 10px; background:var(--surface-2); border:1px solid ' + (isThis ? 'var(--hazard)' : hasOther ? 'var(--hazard-dim)' : 'var(--steel)') + '; border-radius:6px;';

        const cbWrap = document.createElement('div');
        cbWrap.style.cssText = 'display:flex; align-items:center; gap:4px; font-size:12px;';
        const dayCb = document.createElement('input');
        dayCb.type = 'checkbox'; dayCb.value = d; dayCb.checked = isThis;
        dayCb.style.accentColor = 'var(--hazard)';
        cbWrap.appendChild(dayCb);
        cbWrap.appendChild(document.createTextNode(dayNamesShort[d]));
        lbl.appendChild(cbWrap);

        if (otherTitle){
          const sub = document.createElement('span');
          sub.style.cssText = 'font-size:9px; color:var(--hazard); max-width:64px; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;';
          sub.textContent = otherTitle;
          lbl.appendChild(sub);
        }
        cbRow.appendChild(lbl);
      }
      assignPanel.appendChild(cbRow);

      const saveAssignBtn = document.createElement('button');
      saveAssignBtn.style.cssText = 'width:100%; padding:8px; background:var(--hazard); color:#1d1a10; border:none; border-radius:6px; cursor:pointer; font-size:12px; font-weight:700;';
      saveAssignBtn.textContent = 'Save Day Assignment';
      saveAssignBtn.onclick = () => {
        const checked   = [...cbRow.querySelectorAll('input[type=checkbox]:checked')].map(c => parseInt(c.value));
        const unchecked = [...cbRow.querySelectorAll('input[type=checkbox]:not(:checked)')].map(c => parseInt(c.value));
        unchecked.forEach(d => { if (dayToGroup[d] === groupKey) dayToGroup[d] = 'rest'; });
        checked.forEach(d  => { dayToGroup[d] = groupKey; });
        config.workoutData[groupKey].day = checked.map(d => dayNamesShort[d]).join(' & ') || 'Unassigned';
        saveConfig(config);
        renderExercisesList();
        renderWorkout();
      };
      assignPanel.appendChild(saveAssignBtn);
      content.appendChild(assignPanel);

      assignToggle.addEventListener('click', () => {
        const open = assignPanel.style.display !== 'none';
        assignPanel.style.display = open ? 'none' : '';
        assignToggle.textContent = open ? '📅 Assign Days' : '📅 Close';
      });

      // ── Delete button (custom groups only) ──
      if (isCustom){
        const delBtn = document.createElement('button');
        delBtn.style.cssText = 'display:block; margin-bottom:12px; background:var(--rust); color:#fff; border:none; border-radius:6px; padding:6px 14px; cursor:pointer; font-size:12px; font-weight:600;';
        delBtn.textContent = '✕ Delete Group';
        delBtn.onclick = () => deleteWorkoutGroup(groupKey);
        content.appendChild(delBtn);
      }

      config.workoutData[groupKey].groups.forEach((group, gIdx) => {
        const groupTitle = document.createElement('h4');
        groupTitle.style.cssText = 'margin:16px 0 8px; color:var(--hazard); font-size:12px;';
        groupTitle.textContent = group.name;
        content.appendChild(groupTitle);

        group.exercises.forEach((ex, eIdx) => {
          const item = document.createElement('div');
          item.className = 'modal-item';
          item.innerHTML = `<div class="modal-item-info">
            <strong>${ex.name}</strong><br>
            <small>${ex.sets} sets \xd7 ${ex.reps} reps</small>
          </div>`;

          const actions = document.createElement('div');
          actions.className = 'modal-item-actions';

          const editBtn = document.createElement('button');
          editBtn.className = 'modal-item-edit';
          editBtn.textContent = '✎';
          editBtn.onclick = () => editExercise(groupKey, gIdx, eIdx);
          actions.appendChild(editBtn);

          const exDelBtn = document.createElement('button');
          exDelBtn.className = 'modal-item-close';
          exDelBtn.textContent = '✕';
          exDelBtn.onclick = () => deleteExercise(groupKey, gIdx, eIdx);
          actions.appendChild(exDelBtn);

          item.appendChild(actions);
          content.appendChild(item);
        });
      });

      section.appendChild(content);
      labelEl.addEventListener('click', () => section.classList.toggle('collapsed'));
      container.appendChild(section);
    });
  }

  function editExercise(groupKey, gIdx, eIdx){
    const ex = config.workoutData[groupKey].groups[gIdx].exercises[eIdx];
    const form = `
      <div class="edit-form" id="editExForm">
        <h3 style="margin:0 0 12px; font-size:13px;">Edit Exercise</h3>
        <div class="edit-form-row">
          <div class="edit-form-field">
            <label>Exercise Name</label>
            <input type="text" class="modal-input" id="editExName" value="${ex.name}">
          </div>
        </div>
        <div class="edit-form-row">
          <div class="edit-form-field">
            <label>Sets</label>
            <input type="number" class="modal-input" id="editExSets" min="1" max="10" value="${ex.sets}">
          </div>
          <div class="edit-form-field">
            <label>Reps (e.g., 8-12 or 15)</label>
            <input type="text" class="modal-input" id="editExReps" value="${ex.reps}">
          </div>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="modal-btn" onclick="document.getElementById('editExForm').remove()">Cancel</button>
          <button class="modal-btn primary" onclick="saveExEdit('${groupKey}', ${gIdx}, ${eIdx})">Save</button>
        </div>
      </div>
    `;
    const container = document.getElementById('tab-exercises');
    const existing = document.getElementById('editExForm');
    if (existing) existing.remove();
    const formEl = document.createElement('div');
    formEl.innerHTML = form;
    container.insertBefore(formEl.firstElementChild, container.firstChild);
  }

  window.saveExEdit = function(groupKey, gIdx, eIdx){
    config.workoutData[groupKey].groups[gIdx].exercises[eIdx].name = document.getElementById('editExName').value;
    config.workoutData[groupKey].groups[gIdx].exercises[eIdx].sets = parseInt(document.getElementById('editExSets').value);
    config.workoutData[groupKey].groups[gIdx].exercises[eIdx].reps = document.getElementById('editExReps').value;
    document.getElementById('editExForm').remove();
    saveConfig(config);
    renderExercisesList();
    renderWorkout();
    updateDashboard();
  };

  window.deleteExercise = function(groupKey, gIdx, eIdx){
    if (confirm('Delete this exercise?')){
      config.workoutData[groupKey].groups[gIdx].exercises.splice(eIdx, 1);
      
      // If group is now empty, remove the group
      if (config.workoutData[groupKey].groups[gIdx].exercises.length === 0){
        config.workoutData[groupKey].groups.splice(gIdx, 1);
      }
      
      saveConfig(config);
      renderExercisesList();
      renderWorkout();
      updateDashboard();
    }
  };

  saveSettingsBtn.addEventListener('click', () => {
    const startWeight = parseFloat(document.getElementById('startWeightInput').value);
    const goalWeight = parseFloat(document.getElementById('goalWeightInput').value);
    const calorieTarget = parseInt(document.getElementById('calorieTargetInput').value);
    const proteinTarget = parseInt(document.getElementById('proteinTargetInput').value);

    if (isNaN(startWeight) || isNaN(goalWeight) || isNaN(calorieTarget) || isNaN(proteinTarget)){
      alert('Please fill all fields with valid numbers');
      return;
    }
    if (startWeight >= goalWeight){
      alert('Start weight must be less than goal weight');
      return;
    }

    config.startWeight = startWeight;
    config.goalWeight = goalWeight;
    config.calorieTarget = calorieTarget;
    config.proteinTarget = proteinTarget;
    saveConfig(config);

    document.getElementById('startWeight').textContent = startWeight;
    document.getElementById('goalWeight').textContent = goalWeight;
    document.getElementById('weightInput').min = Math.max(55, startWeight - 5);
    document.getElementById('weightInput').max = goalWeight + 5;

    const weightValue = parseFloat(document.getElementById('weightInput').value);
    if (isNaN(weightValue) || weightValue < config.startWeight || weightValue > config.goalWeight) {
      document.getElementById('weightInput').value = config.startWeight;
    }

    drawBarbellTicks();
    updateBarbell();
    updateTargetLabels();
    settingsModal.classList.remove('open');
    renderDiet();
    updateDashboard();
  });

  // ---------- day nav ----------
  const todayIdx = new Date().getDay();
  for (let i = 1; i <= 7; i++) {
    const idx = i % 7;
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
    const data = config.workoutData[currentGroup];
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
          saveDailyState();
          renderWorkout();
        });

        const name = document.createElement('span');
        name.className = 'ex-name';
        name.textContent = ex.name;

        const sets = document.createElement('span');
        sets.className = 'ex-sets mono';
        sets.textContent = ex.sets + ' × ' + ex.reps;

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
        saveDailyState();
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
    saveDailyState();
    updateDashboard();
  });

  const waterInput = document.getElementById('waterInput');
  const sleepInput = document.getElementById('sleepInput');
  waterInput.addEventListener('input', () => {
    waterFilled = Math.round(parseFloat(waterInput.value || 0) * 2);
    saveDailyState();
    renderBottles();
    updateDashboard();
  });
  sleepInput.addEventListener('input', () => {
    sleepHours = parseFloat(sleepInput.value || 0);
    sleepDone = sleepHours >= 8;
    document.getElementById('sleepCheck').classList.toggle('checked', sleepDone);
    document.getElementById('sleepCheck').setAttribute('aria-checked', String(sleepDone));
    saveDailyState();
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
    document.getElementById('kcalFill').style.width = Math.min(100, (kcal/config.calorieTarget)*100) + '%';
    document.getElementById('proteinFill').style.width = Math.min(100, (protein/config.proteinTarget)*100) + '%';

    const waterL = (waterFilled * 0.5).toFixed(1);
    document.getElementById('waterValue').textContent = waterL;
    waterInput.value = waterL;

    const workoutTotal = currentGroup === 'rest' ? 1 : exState[currentGroup].length;
    const workoutDone = currentGroup === 'rest' ? 1 : exState[currentGroup].filter(Boolean).length;
    const workoutFrac = workoutTotal ? workoutDone/workoutTotal : 0;

    const mealCount = meals.filter(m => !m.divider).length;
    const mealDone = mealState.filter(Boolean).length + (soyaDone ? 1 : 0);
    const dietFrac = Math.min(1, mealDone / (mealCount + 1));

    const waterFrac = Math.min(1, waterFilled / 8);
    const sleepFrac = sleepHours >= 8 ? 1 : sleepHours / 8;

    const readiness = Math.round(((workoutFrac + dietFrac + waterFrac + sleepFrac) / 4) * 100);
    document.getElementById('readinessValue').textContent = readiness + '%';
  }

  // ---------- weight / barbell loader ----------
  const weightInput = document.getElementById('weightInput');
  const barFill = document.getElementById('barFill');
  const plateMarker = document.getElementById('plateMarker');
  const barbellStatus = document.getElementById('barbellStatus');
  const ticksG = document.getElementById('ticks');

  function drawBarbellTicks(){
    ticksG.innerHTML = '';
    const min = Math.floor(config.startWeight);
    const max = Math.ceil(config.goalWeight);
    for (let kg = min; kg <= max; kg++){
      const x = 40 + ((kg-min)/(max-min)) * 520;
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
  }

  function updateBarbell(){
    const w = parseFloat(weightInput.value);
    const min = config.startWeight;
    const max = config.goalWeight;
    const clamped = Math.max(min, Math.min(max, isNaN(w) ? min : w));
    const frac = (clamped - min) / (max - min);
    const x = 40 + frac * 520;
    barFill.setAttribute('width', Math.max(0, x - 40));
    plateMarker.setAttribute('cx', x);

    if (isNaN(w)){
      barbellStatus.textContent = 'Log your weight to start tracking.';
      barbellStatus.classList.remove('win');
    } else if (w >= max){
      barbellStatus.textContent = 'Goal hit — ' + max + 'kg+. Time to set a new target. 🎉';
      barbellStatus.classList.add('win');
    } else if (w <= min){
      barbellStatus.textContent = (min - w).toFixed(1) + 'kg below baseline — every gram from here counts.';
      barbellStatus.classList.remove('win');
    } else {
      barbellStatus.textContent = (max - w).toFixed(1) + 'kg to go — stay the course.';
      barbellStatus.classList.remove('win');
    }
  }
  weightInput.addEventListener('input', () => { updateBarbell(); saveDailyState(); });

  // ---------- reset / print ----------
  document.getElementById('resetBtn').addEventListener('click', () => {
    exState[currentGroup] = exState[currentGroup].map(() => false);
    mealState = mealState.map(() => false);
    soyaDone = false;
    sleepDone = false;
    sleepHours = 0;
    waterFilled = 0;
    document.getElementById('soyaCheck').classList.remove('checked');
    document.getElementById('soyaCheck').setAttribute('aria-checked','false');
    document.getElementById('sleepCheck').classList.remove('checked');
    document.getElementById('sleepCheck').setAttribute('aria-checked','false');
    document.getElementById('sleepInput').value = '0';
    document.getElementById('waterInput').value = '0';
    saveDailyState();
    renderBottles();
    renderWorkout();
    renderDiet();
    updateDashboard();
  });

  document.getElementById('printBtn').addEventListener('click', () => window.print());

  document.getElementById('resetPlanBtn').addEventListener('click', () => {
    if (!confirm('Reset the entire plan to default? This deletes all your customizations (weight, calories, meals, exercises) and today\'s progress. This cannot be undone.')) return;
    Object.keys(localStorage)
      .filter(key => key === 'workoutConfig' || key.startsWith('workoutDailyState_'))
      .forEach(key => localStorage.removeItem(key));
    location.reload();
  });

  // ---------- init ----------
  document.getElementById('footerYear').textContent = new Date().getFullYear();
  loadDailyState();
  document.getElementById('waterInput').value = (waterFilled * 0.5).toFixed(1);
  document.getElementById('sleepInput').value = sleepHours;
  document.getElementById('startWeight').textContent = config.startWeight;
  document.getElementById('goalWeight').textContent = config.goalWeight;
  const wInputEl = document.getElementById('weightInput');
  if (!wInputEl.value || wInputEl.value === '0') wInputEl.value = config.startWeight;
  document.getElementById('weightInput').min = Math.max(55, config.startWeight - 5);
  document.getElementById('weightInput').max = config.goalWeight + 5;
  drawBarbellTicks();
  updateTargetLabels();
  selectDay(todayIdx);
  renderDiet();
  renderBottles();
  updateBarbell();
  updateDashboard();
})();
