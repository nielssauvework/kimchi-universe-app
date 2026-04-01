// State
const state = {
  selectedIngredients: new Set(),
  currentStep: 0,
  currentTab: 'ingredients',
  cabbageHeads: 1,
  ingredientAmounts: {} // { ingredientId: currentQty }
};

// Category keys in order
const CATEGORIES = ['brining', 'seasoning', 'additional', 'feast'];

// Initialize default amounts based on cabbage heads
function initAmounts() {
  for (const cat of CATEGORIES) {
    for (const item of INGREDIENTS[cat].items) {
      if (!item.isCabbage) {
        state.ingredientAmounts[item.id] = roundQty(item.baseQty * state.cabbageHeads);
      }
    }
  }
}

// Round quantity for clean display
function roundQty(qty) {
  if (qty >= 100) return Math.round(qty);
  if (qty >= 10) return Math.round(qty * 10) / 10;
  if (qty >= 1) return Math.round(qty * 10) / 10;
  return Math.round(qty * 100) / 100;
}

// Get step size for +/- based on unit and base quantity
function getStepSize(item) {
  const unit = item.unit;
  if (unit === 'g' || unit === 'ml') {
    if (item.baseQty >= 100) return 50;
    if (item.baseQty >= 20) return 10;
    return 5;
  }
  if (unit === 'L') return 0.5;
  if (unit === 'tbsp') return 1;
  if (unit === 'tsp') return 0.5;
  if (unit === 'cup') return 0.5;
  if (unit === 'stalks' || unit === 'pieces') return 1;
  if (unit === 'stalk' || unit === 'head') return 1;
  return 1;
}

// Format amount for display
function formatAmount(id) {
  const item = findItem(id);
  if (!item) return '';
  if (item.isCabbage) return `${state.cabbageHeads} ${state.cabbageHeads === 1 ? 'head' : 'heads'}`;
  const qty = state.ingredientAmounts[id];
  if (qty === undefined) return '';
  // Clean up display
  const displayQty = Number.isInteger(qty) ? qty : qty.toFixed(1).replace(/\.0$/, '');
  return `${displayQty} ${item.unit}`;
}

// Find an ingredient item by id
function findItem(id) {
  for (const cat of CATEGORIES) {
    const found = INGREDIENTS[cat].items.find(i => i.id === id);
    if (found) return found;
  }
  return null;
}

// Update cabbage heads and recalculate all amounts
function setCabbageHeads(count) {
  state.cabbageHeads = Math.max(1, Math.min(20, count));
  initAmounts();
  updateUI();
}

// Adjust individual ingredient amount
function adjustAmount(id, delta, event) {
  if (event) event.stopPropagation();
  const item = findItem(id);
  if (!item || item.isCabbage) return;
  const step = getStepSize(item);
  const newQty = Math.max(step, roundQty(state.ingredientAmounts[id] + delta * step));
  state.ingredientAmounts[id] = newQty;
  updateUI();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initAmounts();
  renderStepIndicators();
  renderIngredientSteps();
  preselectEssentials();
  setupTabNavigation();
  updateUI();
});

// Pre-select essential ingredients
function preselectEssentials() {
  for (const cat of CATEGORIES) {
    for (const item of INGREDIENTS[cat].items) {
      if (item.essential) {
        state.selectedIngredients.add(item.id);
      }
    }
  }
}

// Tab navigation
function setupTabNavigation() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab !== 'ingredients' && state.selectedIngredients.size === 0) return;
      state.currentTab = tab;
      updateUI();
    });
  });
}

// Render step indicators
function renderStepIndicators() {
  const container = document.getElementById('step-indicators');
  container.innerHTML = '';

  CATEGORIES.forEach((cat, i) => {
    const data = INGREDIENTS[cat];
    const shortLabels = ['Brine', 'Season', 'Extras', 'Feast'];

    const dot = document.createElement('div');
    dot.className = 'step-dot' + (i === state.currentStep ? ' active' : '') + (i < state.currentStep ? ' completed' : '');
    dot.innerHTML = `
      <div class="step-dot-circle">${i < state.currentStep ? '✓' : data.step}</div>
      <div class="step-dot-label">${shortLabels[i]}</div>
    `;
    dot.addEventListener('click', () => {
      state.currentStep = i;
      updateUI();
    });
    container.appendChild(dot);

    if (i < CATEGORIES.length - 1) {
      const line = document.createElement('div');
      line.className = 'step-line' + (i < state.currentStep ? ' filled' : '');
      container.appendChild(line);
    }
  });
}

// Render ingredient steps
function renderIngredientSteps() {
  const container = document.getElementById('ingredient-steps');
  container.innerHTML = '';

  // Cabbage head selector (always visible at top)
  const selector = document.createElement('div');
  selector.className = 'cabbage-selector';
  selector.id = 'cabbage-selector';
  selector.innerHTML = `
    <div class="cabbage-selector-left">
      <span class="cabbage-emoji">🥬</span>
      <div>
        <div class="cabbage-selector-title">Cabbage Heads</div>
        <div class="cabbage-selector-hint">Adjusts all ingredient amounts</div>
      </div>
    </div>
    <div class="cabbage-selector-controls">
      <button class="qty-btn" onclick="setCabbageHeads(state.cabbageHeads - 1)">−</button>
      <span class="cabbage-count">${state.cabbageHeads}</span>
      <button class="qty-btn" onclick="setCabbageHeads(state.cabbageHeads + 1)">+</button>
    </div>
  `;
  container.appendChild(selector);

  CATEGORIES.forEach((cat, i) => {
    const data = INGREDIENTS[cat];
    const section = document.createElement('div');
    section.className = 'step-section' + (i === state.currentStep ? ' active' : '');
    section.id = `step-${i}`;

    section.innerHTML = `
      <div class="step-header">
        <div class="step-icon">${data.icon}</div>
        <div>
          <div class="step-number">Step ${data.step}</div>
          <div class="step-title">${data.label}</div>
        </div>
      </div>
      <div class="step-description">${data.description}</div>
      <div class="ingredient-grid">
        ${data.items.map(item => `
          <div class="ingredient-card ${state.selectedIngredients.has(item.id) ? 'selected' : ''}"
               data-id="${item.id}" onclick="toggleIngredient('${item.id}')">
            <div class="ingredient-emoji">${item.emoji}</div>
            <div class="ingredient-name">${item.name}</div>
            <div class="ingredient-amount-row">
              ${item.isCabbage ? `
                <span class="ingredient-amount">${formatAmount(item.id)}</span>
              ` : `
                <button class="qty-btn-sm" onclick="adjustAmount('${item.id}', -1, event)">−</button>
                <span class="ingredient-amount">${formatAmount(item.id)}</span>
                <button class="qty-btn-sm" onclick="adjustAmount('${item.id}', 1, event)">+</button>
              `}
            </div>
            ${item.bulk ? `<div class="ingredient-bulk">Bulk: ${item.bulk}</div>` : ''}
            ${item.essential ? '<div class="ingredient-essential">Essential</div>' : ''}
          </div>
        `).join('')}
      </div>
    `;

    container.appendChild(section);
  });
}

// Toggle ingredient selection
function toggleIngredient(id) {
  if (state.selectedIngredients.has(id)) {
    state.selectedIngredients.delete(id);
  } else {
    state.selectedIngredients.add(id);
  }
  updateUI();
}

// Calculate microorganism activity
function calculateActivity(microbe) {
  const selectedTags = new Set();
  for (const cat of CATEGORIES) {
    for (const item of INGREDIENTS[cat].items) {
      if (state.selectedIngredients.has(item.id)) {
        item.tags.forEach(t => selectedTags.add(t));
      }
    }
  }

  const matches = microbe.activatedBy.filter(t => selectedTags.has(t)).length;
  const total = microbe.activatedBy.length;
  if (total === 0) return { level: 'Dormant', scale: 0, color: '#666' };

  const ratio = matches / total;
  if (ratio === 0) return { level: 'Dormant', scale: 0, color: '#666' };
  if (ratio < 0.4) return { level: 'Low Activity', scale: 0.25, color: '#0a84ff' };
  if (ratio < 0.7) return { level: 'Moderate', scale: 0.5, color: '#ffd60a' };
  if (ratio < 1.0) return { level: 'High Activity', scale: 0.75, color: '#ff9f0a' };
  return { level: 'Dominant', scale: 1, color: '#ff453a' };
}

// Render microbiome screen
function renderMicrobiome() {
  const container = document.getElementById('microbiome-content');
  const microbeData = MICROORGANISMS.map(m => ({ ...m, activity: calculateActivity(m) }))
    .sort((a, b) => b.activity.scale - a.activity.scale);

  const activeCount = microbeData.filter(m => m.activity.scale > 0).length;
  const leadFermenter = microbeData[0]?.activity.scale > 0 ? microbeData[0].name : 'None';

  let summaryText = '';
  if (activeCount === 0) summaryText = 'Select more ingredients to activate fermentation microorganisms.';
  else if (activeCount <= 2) summaryText = 'A basic fermentation profile. Consider adding more variety for complexity.';
  else summaryText = 'A rich and diverse microbial community will develop, creating complex flavors.';

  container.innerHTML = `
    <div class="section-header">
      <div class="section-title">Your Microbiome</div>
      <div class="section-subtitle">Based on your ingredient selection, these micro-organisms will become active during fermentation:</div>
    </div>

    ${microbeData.map(m => `
      <div class="microbe-card ${m.activity.level === 'Dormant' ? 'dormant' : ''}"
           onclick="this.classList.toggle('expanded')"
           style="border-color: ${m.activity.scale > 0 ? m.color + '4d' : 'var(--border)'}">
        <div class="microbe-top">
          <div class="microbe-icon" style="background: ${m.color}22">
            <span style="color: ${m.color}">${m.symbol}</span>
          </div>
          <div class="microbe-info">
            <div class="microbe-name">${m.name}</div>
            <div class="microbe-scientific">${m.scientific}</div>
            <div class="microbe-role" style="color: ${m.color}">${m.role}</div>
          </div>
          <button class="info-btn" onclick="event.stopPropagation(); showBenefits('${m.id}')" title="Health benefits">i</button>
          <div class="activity-badge" style="background: ${m.activity.color}33; color: ${m.activity.scale === 0 ? '#666' : '#fff'}">
            ${m.activity.level}
          </div>
        </div>
        <div class="activity-bar-bg">
          <div class="activity-bar-fill" style="width: ${m.activity.scale * 100}%; background: linear-gradient(90deg, ${m.color}, ${m.activity.color})"></div>
        </div>
        <div class="microbe-description">${m.description}</div>
      </div>
    `).join('')}

    <div class="summary-card">
      <div class="summary-header">✨ Fermentation Profile</div>
      <div class="summary-stats">
        <div class="stat-box">
          <label>Active Species</label>
          <span>${activeCount}/${microbeData.length}</span>
        </div>
        <div class="stat-box">
          <label>Lead Fermenter</label>
          <span>${leadFermenter}</span>
        </div>
      </div>
      <div class="summary-text">${summaryText}</div>
    </div>
  `;
}

// Generate recipe
function generateRecipe() {
  const selected = new Set(state.selectedIngredients);
  const steps = [];
  let stepNum = 1;

  // Helper to get selected items from a category
  const getSelected = (cat) => INGREDIENTS[cat].items.filter(i => selected.has(i.id));

  // Step 1: Brining
  const brining = getSelected('brining');
  if (brining.length > 0) {
    steps.push({
      num: stepNum++, title: 'Brine the Cabbage', duration: '6-8 hours',
      instructions: 'Cut the napa cabbage lengthwise into quarters. Dissolve coarse salt in water to create a brine solution. Rub salt between each leaf, concentrating more on the thick white stems. Submerge the cabbage in the brine, weigh it down with a plate, and let it sit for 6-8 hours or overnight. The cabbage should be wilted and bendable when ready. Rinse thoroughly 3 times and drain well.',
      ingredients: brining
    });
  }

  // Step 2: Seasoning paste
  const seasoning = getSelected('seasoning');
  const feast = getSelected('feast');
  const hasRicePaste = selected.has('rice-paste');
  if (seasoning.length > 0) {
    let instr = 'In a large mixing bowl, combine the red pepper powder';
    if (selected.has('minced-garlic')) instr += ', minced garlic';
    if (selected.has('minced-ginger')) instr += ', ginger';
    if (selected.has('fish-sauce')) instr += ', anchovy fish sauce';
    if (hasRicePaste) instr += ', and glutinous rice paste for extra body and sweetness';
    instr += '. Mix into a smooth, thick paste. The paste should be vibrant red and aromatic.';

    const pasteIngredients = [...seasoning];
    if (hasRicePaste) pasteIngredients.push(INGREDIENTS.feast.items.find(i => i.id === 'rice-paste'));

    steps.push({
      num: stepNum++, title: 'Make the Seasoning Paste', duration: '15 minutes',
      instructions: instr, ingredients: pasteIngredients
    });
  }

  // Step 3: Additional ingredients
  const additional = getSelected('additional');
  if (additional.length > 0) {
    const parts = [];
    if (selected.has('radish')) parts.push('julienne the radish into thin matchsticks');
    if (selected.has('pear')) parts.push('grate the pear finely (adds natural sweetness and aids fermentation)');
    if (selected.has('green-onion-stalks')) parts.push('cut green onions into 1-inch pieces');
    if (selected.has('onion')) parts.push('thinly slice the onion');
    if (selected.has('seaweed')) parts.push('soak dried seaweed briefly and cut into small pieces');
    if (selected.has('cashew-nut')) parts.push('roughly chop the cashew nuts');
    if (selected.has('sesame-seeds')) parts.push('lightly toast the sesame seeds');
    if (selected.has('carrot')) parts.push('julienne the carrot into thin matchsticks');
    if (selected.has('chives')) parts.push('cut chives into 1-inch pieces');
    if (selected.has('salted-shrimp')) parts.push('add salted shrimp for deep umami flavor');
    if (selected.has('oyster')) parts.push('rinse and add fresh oysters (adds rich umami and brininess)');
    if (selected.has('chestnuts')) parts.push('slice chestnuts thinly');
    if (selected.has('pine-nuts')) parts.push('add pine nuts for a subtle nutty richness');

    let instr = 'Prepare the additional ingredients: ' + parts.join('; ') + '. ';
    instr += 'Toss all prepared vegetables and additions with the seasoning paste until evenly coated.';

    steps.push({
      num: stepNum++, title: 'Prepare & Mix Additions', duration: '20 minutes',
      instructions: instr, ingredients: additional
    });
  }

  // Step 4: Assembly
  steps.push({
    num: stepNum++, title: 'Assemble the Kimchi', duration: '30 minutes',
    instructions: 'Take each piece of brined cabbage and spread the seasoning mixture between every leaf, working from the outer leaves inward. Be generous but even with the paste distribution. Once fully coated, fold each quarter into a tight bundle and pack firmly into a clean jar or fermentation container. Press down to remove air pockets and ensure the brine rises to cover the kimchi.',
    ingredients: []
  });

  // Step 5: Ferment
  let fermentInstr = 'Seal the container, leaving a small gap for gas to escape. Leave at room temperature (18-22°C) for 1-2 days to kickstart fermentation.';
  if (selected.has('soybean-paste')) {
    fermentInstr += ' The soybean paste will introduce additional cultures for a more complex flavor profile.';
  }
  fermentInstr += ' You should see small bubbles forming — this means the lactic acid bacteria are active. Once the kimchi tastes pleasantly tangy, transfer to the refrigerator. It will continue to slowly ferment and develop deeper flavors over weeks.';

  steps.push({
    num: stepNum++, title: 'Ferment & Enjoy', duration: '1-2 days + ongoing',
    instructions: fermentInstr, ingredients: []
  });

  return steps;
}

// Render recipe screen
function renderRecipe() {
  const container = document.getElementById('recipe-content');
  const allItems = [];
  for (const cat of CATEGORIES) {
    const items = INGREDIENTS[cat].items.filter(i => state.selectedIngredients.has(i.id));
    if (items.length > 0) allItems.push({ label: INGREDIENTS[cat].label, items });
  }

  const steps = generateRecipe();

  container.innerHTML = `
    <div class="section-header">
      <div class="section-title">Your Kimchi Recipe</div>
      <div class="section-subtitle" style="color: var(--accent)">${state.selectedIngredients.size} ingredients selected · ${state.cabbageHeads} cabbage ${state.cabbageHeads === 1 ? 'head' : 'heads'}</div>
    </div>

    <div class="recipe-ingredient-summary">
      <h3>📋 Ingredients</h3>
      ${allItems.map(group => `
        <div class="recipe-category-title">${group.label}</div>
        ${group.items.map(item => `
          <div class="recipe-ingredient-row">
            <span>${item.emoji}</span>
            <span>${item.name}</span>
            <span class="amount">${formatAmount(item.id)}</span>
          </div>
        `).join('')}
      `).join('')}
    </div>

    ${steps.map(step => `
      <div class="recipe-step-card">
        <div class="recipe-step-top">
          <div class="recipe-step-number">${step.num}</div>
          <div>
            <div class="recipe-step-title">${step.title}</div>
            ${step.duration ? `<div class="recipe-step-duration">🕐 ${step.duration}</div>` : ''}
          </div>
        </div>
        <div class="recipe-step-instructions">${step.instructions}</div>
        ${step.ingredients.length > 0 ? `
          <div class="recipe-step-chips">
            ${step.ingredients.map(i => `<span class="recipe-chip">${i.emoji} ${i.name} · ${formatAmount(i.id)}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `).join('')}

    <div class="tips-card">
      <h3>💡 Fermentation Tips</h3>
      <div class="tip-row"><div class="tip-dot"></div><div>Keep kimchi submerged in its brine to prevent mold</div></div>
      <div class="tip-row"><div class="tip-dot"></div><div>Burp your jar daily during room-temp fermentation</div></div>
      <div class="tip-row"><div class="tip-dot"></div><div>Taste after 1-2 days; refrigerate when it reaches desired tanginess</div></div>
      <div class="tip-row"><div class="tip-dot"></div><div>Kimchi deepens in flavor over weeks in the fridge</div></div>
      <div class="tip-row"><div class="tip-dot"></div><div>Use clean utensils every time to prevent contamination</div></div>
    </div>
  `;
}

// Show benefits modal
function showBenefits(microbeId) {
  const microbe = MICROORGANISMS.find(m => m.id === microbeId);
  if (!microbe) return;

  const header = document.getElementById('benefits-header');
  header.innerHTML = `
    <div class="benefits-header-icon" style="background: ${microbe.color}22">
      <span style="color: ${microbe.color}">${microbe.symbol}</span>
    </div>
    <div class="benefits-header-text">
      <h2>${microbe.name}</h2>
      <p>${microbe.scientific}</p>
    </div>
    <button class="benefits-close" onclick="closeBenefits()">&times;</button>
  `;

  const body = document.getElementById('benefits-body');
  body.innerHTML = `
    <div class="benefits-label">&#x2764;&#xFE0F; Health Benefits</div>
    ${microbe.benefits.map(b => `
      <div class="benefit-item">
        <div class="benefit-check" style="background: ${microbe.color}22; color: ${microbe.color}">&#x2713;</div>
        <div class="benefit-text">${b}</div>
      </div>
    `).join('')}
  `;

  const overlay = document.getElementById('benefits-overlay');
  overlay.classList.add('visible');
}

// Close benefits modal
function closeBenefits(event) {
  const overlay = document.getElementById('benefits-overlay');
  overlay.classList.remove('visible');
}

// Update all UI
function updateUI() {
  // Update tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const tab = btn.dataset.tab;
    btn.classList.toggle('active', tab === state.currentTab);
    btn.classList.toggle('disabled', tab !== 'ingredients' && state.selectedIngredients.size === 0);
  });

  // Update screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${state.currentTab}`).classList.add('active');

  // Update subtitle
  const subtitles = { ingredients: 'Ingredients', microbiome: 'Microbiome', recipe: 'Recipe' };
  document.getElementById('tab-subtitle').textContent = subtitles[state.currentTab];

  // Update badge
  const badge = document.getElementById('ingredient-count');
  if (state.selectedIngredients.size > 0) {
    badge.style.display = 'flex';
    badge.textContent = state.selectedIngredients.size;
  } else {
    badge.style.display = 'none';
  }

  // Update step indicators
  renderStepIndicators();

  // Re-render ingredient steps (to update amounts)
  renderIngredientSteps();

  // Update ingredient cards
  document.querySelectorAll('.step-section').forEach((section, i) => {
    section.classList.toggle('active', i === state.currentStep);
  });
  document.querySelectorAll('.ingredient-card').forEach(card => {
    card.classList.toggle('selected', state.selectedIngredients.has(card.dataset.id));
  });

  // Render other screens when active
  if (state.currentTab === 'microbiome') renderMicrobiome();
  if (state.currentTab === 'recipe') renderRecipe();
}
