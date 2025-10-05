// Load checklist from localStorage
function loadChecklist() {
  const saved = localStorage.getItem('roostChecklist');
  return saved ? JSON.parse(saved) : {};
}

// Save checklist to localStorage
function saveChecklist(data) {
  localStorage.setItem('roostChecklist', JSON.stringify(data));
}

// Current filtered chicken list
let currentFilteredChickens = [...CHICKENS];

function renderFilteredChecklist() {
  const checklistDiv = document.getElementById('checklist');
  checklistDiv.innerHTML = '';
  const saved = loadChecklist();
  
  currentFilteredChickens.forEach(chicken => {
    const item = document.createElement('div');
    item.className = 'chicken-item';
    
    // Main content div (checkbox + label)
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!saved[chicken];
    checkbox.addEventListener('change', () => {
      saved[chicken] = checkbox.checked;
      saveChecklist(saved);
      updateProgressDisplay();
      updateRecommendations();
      updatePriorityQueue();
      updateDetailedStats();
      checkAchievements();
    });
    
    const label = document.createElement('label');
    label.textContent = chicken;
    label.style.cursor = 'pointer';
    
    // Add breeding info div
    const breedingInfo = document.createElement('div');
    breedingInfo.className = 'breeding-info';
    breedingInfo.style.display = 'none';
    breedingInfo.style.fontSize = '0.8em';
    breedingInfo.style.color = '#666';
    
    const recipe = getBreedingRecipe(chicken);
    if (recipe.length === 1) {
      breedingInfo.innerHTML = recipe[0];
    } else {
      breedingInfo.innerHTML = `Breed: ${recipe[0]} + ${recipe[1]}`;
    }
    
    // Add "Show Tree" button for bred chickens
    if (recipe.length === 2) {
      const treeButton = document.createElement('button');
      treeButton.className = 'show-tree-btn';
      treeButton.textContent = 'Show Tree';
      treeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCraftingTree(chicken, item);
      });
      breedingInfo.appendChild(treeButton);
    }
    
    // Toggle breeding info on click
    label.addEventListener('click', () => {
      breedingInfo.style.display = breedingInfo.style.display === 'none' ? 'block' : 'none';
    });
    
    mainContent.appendChild(checkbox);
    mainContent.appendChild(label);
    item.appendChild(mainContent);
    item.appendChild(breedingInfo);
    checklistDiv.appendChild(item);
  });
}

function renderChecklist() {
  renderFilteredChecklist();
}

function toggleCraftingTree(chickenName, itemElement) {
  let treeDiv = itemElement.querySelector('.crafting-tree');
  
  if (treeDiv) {
    // Tree exists, remove it
    treeDiv.remove();
    return;
  }
  
  // Create and show crafting tree
  treeDiv = document.createElement('div');
  treeDiv.className = 'crafting-tree';
  
  // Build the tree
  const tree = buildCraftingTree(chickenName);
  
  // Use the visual tree rendering
  const treeHtml = renderVisualCraftingTree(tree);
  
  // Get stats
  const baseRequirements = getBaseRequirements(chickenName);
  const depth = getBreedingDepth(chickenName);
  
  // Create stats display
  const statsDiv = document.createElement('div');
  statsDiv.className = 'tree-stats';
  statsDiv.innerHTML = `
    <strong>📊 Breeding Statistics:</strong><br>
    🔢 <strong>Generations:</strong> ${depth} levels deep<br>
    🧪 <strong>Base Requirements:</strong> ${baseRequirements.size} unique chickens<br>
    📝 <strong>Required Base Chickens:</strong><br>
    ${Array.from(baseRequirements).map(chicken => `  • ${chicken}`).join('<br>')}
  `;
  
  // Add title and tree
  treeDiv.innerHTML = '<h4 style="margin: 0 0 1rem 0; color: #333;">🌳 Complete Breeding Tree</h4>' + treeHtml;
  treeDiv.appendChild(statsDiv);
  
  itemElement.appendChild(treeDiv);
}

function applyFilters() {
  const searchTerm = document.getElementById('search-box').value;
  const typeFilter = document.getElementById('type-filter').value;
  const statusFilter = document.getElementById('status-filter').value;
  const difficultyFilter = document.getElementById('difficulty-filter').value;
  
  currentFilteredChickens = filterChickens(searchTerm, typeFilter, statusFilter, difficultyFilter);
  renderFilteredChecklist();
}

function updateRecommendations() {
  const breedable = getBreedableChickens();
  const recommendationsDiv = document.getElementById('recommendations');
  
  if (breedable.length === 0) {
    recommendationsDiv.innerHTML = '<p style="color: #666; font-style: italic;">Complete more base chickens to unlock breeding recommendations!</p>';
    return;
  }
  
  recommendationsDiv.innerHTML = '';
  breedable.slice(0, 6).forEach(rec => {
    const recDiv = document.createElement('div');
    recDiv.className = 'recommendation';
    recDiv.innerHTML = `
      <strong>${rec.name}</strong><br>
      <small>${rec.parents[0]} + ${rec.parents[1]}</small><br>
      <em>${rec.category}</em>
    `;
    recDiv.addEventListener('click', () => {
      // Scroll to chicken in list
      const chickenElements = document.querySelectorAll('.chicken-item label');
      for (const el of chickenElements) {
        if (el.textContent === rec.name) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.click(); // Show breeding info
          break;
        }
      }
    });
    recommendationsDiv.appendChild(recDiv);
  });
}

function populateTargetSelector() {
  const select = document.getElementById('target-chicken');
  CHICKENS.forEach(chicken => {
    const option = document.createElement('option');
    option.value = chicken;
    option.textContent = chicken;
    select.appendChild(option);
  });
}

function showOptimalPath() {
  const targetChicken = document.getElementById('target-chicken').value;
  if (!targetChicken) return;
  
  const path = findOptimalPath(targetChicken);
  const pathDiv = document.getElementById('optimal-path');
  
  if (path.length === 0) {
    pathDiv.innerHTML = '<p style="color: #4caf50;">✅ You already have this chicken!</p>';
  } else {
    pathDiv.innerHTML = `
      <h4>📋 Optimal Breeding Path for ${targetChicken}:</h4>
      <ol>
        ${path.map(step => `<li><strong>${step.chicken}</strong><br><small>${step.method}</small></li>`).join('')}
      </ol>
      <p><strong>Total steps:</strong> ${path.length}</p>
    `;
  }
  
  pathDiv.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  // Load dark mode preference
  loadDarkModePreference();
  
  // Initial render
  renderChecklist();
  updateProgressDisplay();
  updateRecommendations();
  updatePriorityQueue();
  updateDetailedStats();
  updateAchievementDisplay();
  populateTargetSelector();
  setupAdvancedSearch();
  
  // Check achievements on load
  checkAchievements();
  
  // Event listeners
  document.getElementById('theme-toggle').addEventListener('click', toggleDarkMode);
  
  document.getElementById('search-box').addEventListener('input', applyFilters);
  document.getElementById('type-filter').addEventListener('change', applyFilters);
  document.getElementById('status-filter').addEventListener('change', applyFilters);
  document.getElementById('difficulty-filter').addEventListener('change', applyFilters);
  
  document.getElementById('export-btn').addEventListener('click', exportData);
  document.getElementById('import-btn').addEventListener('click', () => {
    document.getElementById('import-input').click();
  });
  document.getElementById('import-input').addEventListener('change', (e) => {
    if (e.target.files[0]) {
      importData(e.target.files[0]);
    }
  });
  
  document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all progress?')) {
      localStorage.removeItem('roostChecklist');
      localStorage.removeItem('unlockedAchievements');
      renderFilteredChecklist();
      updateProgressDisplay();
      updateRecommendations();
      updatePriorityQueue();
      updateDetailedStats();
      updateAchievementDisplay();
    }
  });
  
  document.getElementById('optimize-btn').addEventListener('click', showOptimalPath);
});