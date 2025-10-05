// Advanced features and utilities for the chicken checklist

// Chicken categories for progress tracking
const CHICKEN_CATEGORIES = {
  'Basic': ['Chicken Chicken', 'Bone White Chicken', 'Clay Chicken', 'Flint Chicken', 'Glass Chicken', 
            'Gunpowder Chicken', 'Leather Chicken', 'Log Chicken', 'Sand Chicken', 'Snowball Chicken', 'String Chicken'],
  'Dyes': ['Cactus Green Chicken', 'Cocoa Brown Chicken', 'Cyan Chicken', 'Gray Chicken', 'Ink Black Chicken', 
           'Lapis Blue Chicken', 'Light Blue Chicken', 'Light Gray Chicken', 'Lime Chicken', 'Magenta Chicken', 
           'Orange Chicken', 'Pink Chicken', 'Purple Chicken', 'Red Chicken', 'Yellow Chicken'],
  'Metals': ['Copper Chicken', 'Gold Chicken', 'Iron Chicken', 'Steel Chicken', 'Tin Chicken'],
  'Alloys': ['Conductive Iron Chicken', 'Dark Steel Chicken', 'Elecrical Steel Chicken', 'Energetic Alloy Chicken', 
             'Pulsating Iron Chicken', 'Redstone Alloy Chicken', 'Soularium Chicken', 'Vibrant Alloy Chicken'],
  'Tinkers': ['Ardite Chicken', 'Blue Slime Chicken', 'Bronze Chicken', 'Cobalt Chicken', 'Knight Slime Chicken', 
              'Magma Slime Chicken', 'Manyullyn Chicken', 'Pig Iron Chicken', 'Purple Slime Chicken', 'Slime Chicken'],
  'Magic': ['Elementium Chicken', 'ManaSteel Chicken', 'Terrasteel Chicken'],
  'Endgame': ['Awakened Draconium Chicken', 'Draconium Chicken'],
  'Special': ['Blaze Rod Chicken', 'Ender Pearl Chicken', 'Ghast Tear Chicken', 'Lava Chicken', 'Magma Cream Chicken', 
              'Nether Wart Chicken', 'Obsidian Chicken', 'Prismarine Crystal Chicken', 'Prismarine Shard Chicken', 
              'Water Chicken', 'Diamond Chicken', 'Emerald Chicken', 'Redstone Chicken', 'Redstone Crystal Chicken', 
              'Blood Chicken', 'Osmium Chicken', 'Rubber Chicken', 'Salt Chicken', 'Silicon Chicken', 'Sulfur Chicken', 
              'Chickenosto Chicken', 'Demon Metal Chicken', 'Lunar Reactive Dust Chicken', 'Magical Wood Chicken', 
              'Moonstone Chicken', 'Smart Chicken', 'Stoneburnt Chicken', 'Xp Chicken']
};

// Calculate progress statistics
function calculateProgress() {
  const saved = loadChecklist();
  const total = CHICKENS.length;
  const completed = CHICKENS.filter(chicken => saved[chicken]).length;
  const percentage = Math.round((completed / total) * 100);
  
  const categoryProgress = {};
  for (const [category, chickens] of Object.entries(CHICKEN_CATEGORIES)) {
    const categoryCompleted = chickens.filter(chicken => saved[chicken]).length;
    categoryProgress[category] = {
      completed: categoryCompleted,
      total: chickens.length,
      percentage: Math.round((categoryCompleted / chickens.length) * 100)
    };
  }
  
  return {
    completed,
    total,
    percentage,
    categories: categoryProgress
  };
}

// Update progress display
function updateProgressDisplay() {
  const progress = calculateProgress();
  
  // Update progress bar
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  
  progressFill.style.width = `${progress.percentage}%`;
  progressText.textContent = `${progress.completed}/${progress.total} (${progress.percentage}%)`;
  
  // Update category stats
  const categoryStats = document.getElementById('category-stats');
  categoryStats.innerHTML = '';
  
  for (const [category, stats] of Object.entries(progress.categories)) {
    const statDiv = document.createElement('div');
    statDiv.className = 'category-stat';
    statDiv.innerHTML = `<strong>${category}:</strong> ${stats.completed}/${stats.total} (${stats.percentage}%)`;
    categoryStats.appendChild(statDiv);
  }
}

// Get chicken type (found, crafted, bred)
function getChickenType(chickenName) {
  const recipe = getBreedingRecipe(chickenName);
  if (recipe.length === 1) {
    if (recipe[0].includes('Found')) return 'found';
    if (recipe[0].includes('Craft')) return 'crafted';
    return 'special';
  }
  return 'bred';
}

// Filter chickens based on search and filters
function filterChickens(searchTerm = '', typeFilter = 'all', statusFilter = 'all', difficultyFilter = 'all') {
  const saved = loadChecklist();
  
  return CHICKENS.filter(chicken => {
    // Search filter
    if (searchTerm && !chicken.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (typeFilter !== 'all') {
      const chickenType = getChickenType(chicken);
      if (chickenType !== typeFilter) return false;
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      const isCompleted = !!saved[chicken];
      if (statusFilter === 'completed' && !isCompleted) return false;
      if (statusFilter === 'uncompleted' && isCompleted) return false;
    }
    
    // Difficulty filter
    if (difficultyFilter !== 'all') {
      const depth = getBreedingDepth(chicken);
      if (difficultyFilter === 'easy' && depth > 2) return false;
      if (difficultyFilter === 'medium' && (depth < 3 || depth > 5)) return false;
      if (difficultyFilter === 'hard' && depth < 6) return false;
    }
    
    return true;
  });
}

// Get chickens that can be bred with current collection
function getBreedableChickens() {
  const saved = loadChecklist();
  const ownedChickens = CHICKENS.filter(chicken => saved[chicken]);
  const breedable = [];
  
  for (const chicken of CHICKENS) {
    if (saved[chicken]) continue; // Already have it
    
    const recipe = getBreedingRecipe(chicken);
    if (recipe.length === 2) {
      const [parent1, parent2] = recipe;
      if (saved[parent1] && saved[parent2]) {
        breedable.push({
          name: chicken,
          parents: [parent1, parent2],
          category: getChickenCategory(chicken)
        });
      }
    }
  }
  
  return breedable;
}

// Get category of a chicken
function getChickenCategory(chickenName) {
  for (const [category, chickens] of Object.entries(CHICKEN_CATEGORIES)) {
    if (chickens.includes(chickenName)) return category;
  }
  return 'Other';
}

// Find optimal breeding path to a target chicken
function findOptimalPath(targetChicken) {
  const saved = loadChecklist();
  const path = [];
  const visited = new Set();
  
  function buildPath(chicken) {
    if (visited.has(chicken)) return [];
    visited.add(chicken);
    
    if (saved[chicken]) {
      return []; // Already have this chicken
    }
    
    const recipe = getBreedingRecipe(chicken);
    if (recipe.length === 1) {
      return [{ chicken, method: recipe[0], priority: 1 }];
    }
    
    const [parent1, parent2] = recipe;
    const path1 = buildPath(parent1);
    const path2 = buildPath(parent2);
    
    return [...path1, ...path2, { 
      chicken, 
      method: `Breed: ${parent1} + ${parent2}`,
      priority: Math.max(getBreedingDepth(parent1), getBreedingDepth(parent2)) + 1
    }];
  }
  
  const fullPath = buildPath(targetChicken);
  
  // Sort by priority (base chickens first)
  return fullPath.sort((a, b) => a.priority - b.priority);
}

// Export data as JSON
function exportData() {
  const data = {
    checklist: loadChecklist(),
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chicken-checklist-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Import data from JSON
function importData(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.checklist) {
        saveChecklist(data.checklist);
        renderFilteredChecklist();
        updateProgressDisplay();
        updateRecommendations();
        alert('Data imported successfully!');
      } else {
        alert('Invalid file format');
      }
    } catch (error) {
      alert('Error reading file: ' + error.message);
    }
  };
  reader.readAsText(file);
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  
  const button = document.getElementById('theme-toggle');
  button.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  
  // Save preference
  localStorage.setItem('darkMode', isDark);
}

// Load dark mode preference
function loadDarkModePreference() {
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) {
    document.body.classList.add('dark-mode');
    const button = document.getElementById('theme-toggle');
    if (button) button.textContent = '☀️ Light Mode';
  }
}

// Achievement System
const ACHIEVEMENTS = {
  // Progress milestones
  'first-steps': { name: '🐣 First Steps', description: 'Breed your first 10 chickens', threshold: 10, type: 'total' },
  'getting-serious': { name: '🐔 Getting Serious', description: 'Breed 25 chickens', threshold: 25, type: 'total' },
  'master-breeder': { name: '🏆 Master Breeder', description: 'Breed 50 chickens', threshold: 50, type: 'total' },
  'chicken-lord': { name: '👑 Chicken Lord', description: 'Breed all 81 chickens!', threshold: 81, type: 'total' },
  
  // Category completions
  'basic-master': { name: '⚪ Basic Master', description: 'Complete all Basic chickens', threshold: 1, type: 'category', category: 'Basic' },
  'colorful': { name: '🌈 Colorful', description: 'Complete all Dye chickens', threshold: 1, type: 'category', category: 'Dyes' },
  'metalworker': { name: '⚙️ Metalworker', description: 'Complete all Metal chickens', threshold: 1, type: 'category', category: 'Metals' },
  'alchemist': { name: '🧪 Alchemist', description: 'Complete all Alloy chickens', threshold: 1, type: 'category', category: 'Alloys' },
  'tinker': { name: '🔨 Tinker', description: 'Complete all Tinkers chickens', threshold: 1, type: 'category', category: 'Tinkers' },
  'wizard': { name: '🧙 Wizard', description: 'Complete all Magic chickens', threshold: 1, type: 'category', category: 'Magic' },
  'endgame-champion': { name: '🐉 Endgame Champion', description: 'Complete all Endgame chickens', threshold: 1, type: 'category', category: 'Endgame' },
  'specialist': { name: '⭐ Specialist', description: 'Complete all Special chickens', threshold: 1, type: 'category', category: 'Special' },
  
  // Breeding achievements  
  'speed-breeder': { name: '⚡ Speed Breeder', description: 'Unlock 10 breedable chickens at once', threshold: 10, type: 'breedable' },
  'efficiency-expert': { name: '📈 Efficiency Expert', description: 'Unlock 20 breedable chickens at once', threshold: 20, type: 'breedable' }
};

function getUnlockedAchievements() {
  return JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
}

function saveUnlockedAchievements(achievements) {
  localStorage.setItem('unlockedAchievements', JSON.stringify(achievements));
}

function checkAchievements() {
  const progress = calculateProgress();
  const breedable = getBreedableChickens();
  const unlocked = getUnlockedAchievements();
  const newAchievements = [];
  
  for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
    if (unlocked.includes(id)) continue;
    
    let achieved = false;
    
    if (achievement.type === 'total') {
      achieved = progress.completed >= achievement.threshold;
    } else if (achievement.type === 'category') {
      const categoryProgress = progress.categories[achievement.category];
      achieved = categoryProgress && categoryProgress.percentage === 100;
    } else if (achievement.type === 'breedable') {
      achieved = breedable.length >= achievement.threshold;
    }
    
    if (achieved) {
      newAchievements.push(id);
      unlocked.push(id);
      showAchievementNotification(achievement);
    }
  }
  
  if (newAchievements.length > 0) {
    saveUnlockedAchievements(unlocked);
    updateAchievementDisplay();
  }
  
  return newAchievements;
}

function showAchievementNotification(achievement) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <div class="achievement-icon">🏆</div>
    <div class="achievement-content">
      <div class="achievement-title">${achievement.name}</div>
      <div class="achievement-desc">${achievement.description}</div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Remove after 4 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function updateAchievementDisplay() {
  const achievementGrid = document.getElementById('achievement-grid');
  if (!achievementGrid) return;
  
  const unlocked = getUnlockedAchievements();
  achievementGrid.innerHTML = '';
  
  for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
    const isUnlocked = unlocked.includes(id);
    const achievementDiv = document.createElement('div');
    achievementDiv.className = `achievement ${isUnlocked ? 'unlocked' : 'locked'}`;
    achievementDiv.innerHTML = `
      <div class="achievement-icon">${isUnlocked ? '🏆' : '🔒'}</div>
      <div class="achievement-name">${achievement.name}</div>
      <div class="achievement-description">${achievement.description}</div>
    `;
    achievementGrid.appendChild(achievementDiv);
  }
}

// Priority Queue System
function calculateChickenPriority(chickenName) {
  const saved = loadChecklist();
  
  // Already have it - no priority
  if (saved[chickenName]) return -1;
  
  let score = 0;
  
  try {
    // 1. How many other chickens need this one (dependency score)
    const dependencyCount = CHICKENS.filter(chicken => {
      const recipe = getBreedingRecipe(chicken);
      return recipe.length === 2 && (recipe[0] === chickenName || recipe[1] === chickenName);
    }).length;
    score += dependencyCount * 10;
    
    // 2. Breeding depth (easier = higher priority)
    const depth = getBreedingDepth(chickenName);
    score += Math.max(0, 10 - depth);
    
    // 3. Category completion bonus
    const category = getChickenCategory(chickenName);
    const categoryProgress = calculateProgress().categories[category];
    if (categoryProgress) {
      const completionBonus = (categoryProgress.percentage / 100) * 5;
      score += completionBonus;
    }
    
    // 4. Can we breed it right now?
    const recipe = getBreedingRecipe(chickenName);
    if (recipe.length === 2) {
      const [parent1, parent2] = recipe;
      const canBreed = saved[parent1] && saved[parent2];
      if (canBreed) score += 20; // High priority for immediately breedable
      else {
        // Check how close we are to being able to breed it
        const parent1Available = saved[parent1] || getBreedingDepth(parent1) <= 2;
        const parent2Available = saved[parent2] || getBreedingDepth(parent2) <= 2;
        if (parent1Available && parent2Available) score += 10;
      }
    } else if (recipe.length === 1) {
      // Base chicken - high priority
      score += 15;
    }
    
    // Add a small base score so no chicken gets completely filtered out
    score += 1;
    
  } catch (error) {
    console.error('Error calculating priority for', chickenName, error);
    return 1; // Return minimal score instead of filtering out
  }
  
  return score;
}

function getPriorityQueue() {
  const saved = loadChecklist();
  const unownedChickens = CHICKENS.filter(chicken => !saved[chicken]);
  
  console.log('Unowned chickens:', unownedChickens.length);
  
  const prioritized = unownedChickens.map(chicken => {
    const priority = calculateChickenPriority(chicken);
    return {
      name: chicken,
      priority: priority,
      recipe: getBreedingRecipe(chicken),
      category: getChickenCategory(chicken),
      depth: getBreedingDepth(chicken),
      canBreedNow: (() => {
        const recipe = getBreedingRecipe(chicken);
        if (recipe.length === 2) {
          return saved[recipe[0]] && saved[recipe[1]];
        }
        return recipe.length === 1; // Base chicken
      })()
    };
  }).filter(chicken => chicken.priority > 0); // Only filter out negative priorities (already owned)
  
  console.log('Prioritized chickens before sort:', prioritized.length);
  
  // Sort by priority (highest first)
  prioritized.sort((a, b) => b.priority - a.priority);
  
  console.log('Top 5 prioritized chickens:', prioritized.slice(0, 5));
  
  return prioritized;
}

function updatePriorityQueue() {
  const priorityList = document.getElementById('priority-list');
  if (!priorityList) {
    console.error('Priority list element not found!');
    return;
  }
  
  console.log('Updating priority queue...');
  const queue = getPriorityQueue().slice(0, 10); // Top 10
  console.log('Priority queue:', queue);
  
  priorityList.innerHTML = '';
  
  if (queue.length === 0) {
    priorityList.innerHTML = '<div class="priority-item">� Start breeding some base chickens to see priority recommendations!</div>';
    return;
  }
  
  queue.forEach((chicken, index) => {
    const item = document.createElement('div');
    item.className = `priority-item ${chicken.canBreedNow ? 'can-breed' : ''}`;
    
    const recipeText = chicken.recipe.length === 2 
      ? `${chicken.recipe[0]} + ${chicken.recipe[1]}`
      : chicken.recipe[0];
    
    const statusIcon = chicken.canBreedNow ? '✅' : 
                      chicken.depth <= 2 ? '🔶' : '🔴';
    
    item.innerHTML = `
      <div class="priority-rank">#${index + 1}</div>
      <div class="priority-content">
        <div class="priority-name">${statusIcon} ${chicken.name}</div>
        <div class="priority-recipe">${recipeText}</div>
        <div class="priority-meta">
          ${chicken.category} • Gen ${chicken.depth} • Priority: ${chicken.priority}
        </div>
      </div>
    `;
    
    // Click to scroll to chicken in main list
    item.addEventListener('click', () => {
      const chickenElements = document.querySelectorAll('.chicken-item label');
      for (const el of chickenElements) {
        if (el.textContent === chicken.name) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.click();
          break;
        }
      }
    });
    
    priorityList.appendChild(item);
  });
}

// Enhanced Statistics Dashboard
function generateDetailedStats() {
  const saved = loadChecklist();
  const progress = calculateProgress();
  
  // Breeding difficulty distribution
  const difficultyDistribution = { easy: 0, medium: 0, hard: 0, extreme: 0 };
  const completedByDifficulty = { easy: 0, medium: 0, hard: 0, extreme: 0 };
  
  CHICKENS.forEach(chicken => {
    const depth = getBreedingDepth(chicken);
    const isCompleted = saved[chicken];
    
    let difficulty;
    if (depth <= 2) difficulty = 'easy';
    else if (depth <= 4) difficulty = 'medium';
    else if (depth <= 6) difficulty = 'hard';
    else difficulty = 'extreme';
    
    difficultyDistribution[difficulty]++;
    if (isCompleted) completedByDifficulty[difficulty]++;
  });
  
  // Type distribution
  const typeDistribution = { found: 0, crafted: 0, bred: 0 };
  const completedByType = { found: 0, crafted: 0, bred: 0 };
  
  CHICKENS.forEach(chicken => {
    const type = getChickenType(chicken);
    const isCompleted = saved[chicken];
    
    typeDistribution[type]++;
    if (isCompleted) completedByType[type]++;
  });
  
  // Dependency analysis
  const dependencyCount = {};
  CHICKENS.forEach(chicken => {
    const dependents = CHICKENS.filter(c => {
      const recipe = getBreedingRecipe(c);
      return recipe.length === 2 && (recipe[0] === chicken || recipe[1] === chicken);
    });
    dependencyCount[chicken] = dependents.length;
  });
  
  const mostImportantChickens = Object.entries(dependencyCount)
    .filter(([chicken]) => !saved[chicken])
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([chicken, count]) => ({ chicken, dependents: count }));
  
  return {
    difficulty: { distribution: difficultyDistribution, completed: completedByDifficulty },
    type: { distribution: typeDistribution, completed: completedByType },
    mostImportant: mostImportantChickens,
    categories: progress.categories,
    overall: progress
  };
}

function createProgressBar(percentage, className = '') {
  return `
    <div class="mini-progress-bar ${className}">
      <div class="mini-progress-fill" style="width: ${percentage}%"></div>
      <span class="mini-progress-text">${percentage}%</span>
    </div>
  `;
}

function updateDetailedStats() {
  const statsContainer = document.getElementById('detailed-stats');
  if (!statsContainer) return;
  
  const stats = generateDetailedStats();
  
  statsContainer.innerHTML = `
    <div class="stats-grid">
      <!-- Category Progress -->
      <div class="stats-card">
        <h4>📊 Category Progress</h4>
        <div class="category-progress">
          ${Object.entries(stats.categories).map(([category, data]) => `
            <div class="category-row">
              <span class="category-label">${category}</span>
              ${createProgressBar(data.percentage, 'category-bar')}
              <span class="category-count">${data.completed}/${data.total}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Difficulty Analysis -->
      <div class="stats-card">
        <h4>⚡ Difficulty Analysis</h4>
        <div class="difficulty-stats">
          ${Object.entries(stats.difficulty.distribution).map(([difficulty, total]) => {
            const completed = stats.difficulty.completed[difficulty];
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            const difficultyEmoji = {
              easy: '🟢', medium: '🟡', hard: '🟠', extreme: '🔴'
            }[difficulty];
            
            return `
              <div class="difficulty-row">
                <span class="difficulty-label">${difficultyEmoji} ${difficulty.toUpperCase()}</span>
                ${createProgressBar(percentage, `difficulty-${difficulty}`)}
                <span class="difficulty-count">${completed}/${total}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- Type Distribution -->
      <div class="stats-card">
        <h4>🎯 Type Distribution</h4>
        <div class="type-stats">
          ${Object.entries(stats.type.distribution).map(([type, total]) => {
            const completed = stats.type.completed[type];
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            const typeEmoji = { found: '🌍', crafted: '🔨', bred: '🐔' }[type];
            
            return `
              <div class="type-row">
                <span class="type-label">${typeEmoji} ${type.toUpperCase()}</span>
                ${createProgressBar(percentage, `type-${type}`)}
                <span class="type-count">${completed}/${total}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- Most Important Missing -->
      <div class="stats-card">
        <h4>🔑 Most Important Missing</h4>
        <div class="important-missing">
          ${stats.mostImportant.length > 0 ? stats.mostImportant.map(({ chicken, dependents }) => `
            <div class="missing-item">
              <span class="missing-name">${chicken}</span>
              <span class="missing-impact">Unlocks ${dependents} chickens</span>
            </div>
          `).join('') : '<div class="missing-item">🎉 All key chickens obtained!</div>'}
        </div>
      </div>
    </div>
  `;
}

// Enhanced Search Features
function searchByIngredient(ingredientChicken) {
  return CHICKENS.filter(chicken => {
    const recipe = getBreedingRecipe(chicken);
    return recipe.length === 2 && (recipe[0] === ingredientChicken || recipe[1] === ingredientChicken);
  });
}

function findWhatNeedsChicken(targetChicken) {
  return CHICKENS.filter(chicken => {
    const recipe = getBreedingRecipe(chicken);
    return recipe.length === 2 && (recipe[0] === targetChicken || recipe[1] === targetChicken);
  });
}

function findAllUsesForChicken(chickenName) {
  const directUses = findWhatNeedsChicken(chickenName);
  const indirectUses = new Set();
  
  // Find chains where this chicken is used
  function findChains(chicken, depth = 0) {
    if (depth > 10) return; // Prevent infinite loops
    
    const uses = findWhatNeedsChicken(chicken);
    uses.forEach(user => {
      indirectUses.add(user);
      findChains(user, depth + 1);
    });
  }
  
  findChains(chickenName);
  
  return {
    direct: directUses,
    all: Array.from(indirectUses),
    totalImpact: indirectUses.size
  };
}

function performAdvancedSearch(query, searchType = 'name') {
  const saved = loadChecklist();
  
  switch (searchType) {
    case 'ingredient':
      return searchByIngredient(query).map(chicken => ({
        chicken,
        relevance: `Can breed: ${chicken}`,
        type: 'ingredient-use'
      }));
      
    case 'uses':
      const uses = findAllUsesForChicken(query);
      return uses.direct.map(chicken => ({
        chicken,
        relevance: `Needs: ${query}`,
        type: 'chicken-use'
      }));
      
    case 'available':
      const breedable = getBreedableChickens();
      return breedable.filter(rec => 
        rec.parents.some(parent => parent.toLowerCase().includes(query.toLowerCase()))
      ).map(rec => ({
        chicken: rec.name,
        relevance: `Can breed with: ${rec.parents.join(' + ')}`,
        type: 'breedable'
      }));
      
    case 'missing-for':
      const recipe = getBreedingRecipe(query);
      if (recipe.length === 2) {
        const missing = recipe.filter(parent => !saved[parent]);
        return missing.map(chicken => ({
          chicken,
          relevance: `Needed for: ${query}`,
          type: 'missing-ingredient'
        }));
      }
      return [];
      
    default:
      return CHICKENS.filter(chicken => 
        chicken.toLowerCase().includes(query.toLowerCase())
      ).map(chicken => ({
        chicken,
        relevance: 'Name match',
        type: 'name'
      }));
  }
}

function updateAdvancedSearchResults(results, searchType) {
  const resultsContainer = document.getElementById('advanced-search-results');
  if (!resultsContainer) return;
  
  if (results.length === 0) {
    resultsContainer.innerHTML = '<div class="search-result">No results found</div>';
    return;
  }
  
  resultsContainer.innerHTML = results.map(result => `
    <div class="search-result" data-chicken="${result.chicken}">
      <span class="result-chicken">${result.chicken}</span>
      <span class="result-relevance">${result.relevance}</span>
      <span class="result-type">${result.type}</span>
    </div>
  `).join('');
  
  // Add click handlers to scroll to chickens
  resultsContainer.querySelectorAll('.search-result').forEach(result => {
    result.addEventListener('click', () => {
      const chickenName = result.dataset.chicken;
      const chickenElements = document.querySelectorAll('.chicken-item label');
      for (const el of chickenElements) {
        if (el.textContent === chickenName) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.click();
          break;
        }
      }
    });
  });
}

function setupAdvancedSearch() {
  const searchInput = document.getElementById('advanced-search-input');
  const searchType = document.getElementById('advanced-search-type');
  const searchBtn = document.getElementById('advanced-search-btn');
  
  if (!searchInput || !searchType || !searchBtn) return;
  
  function doSearch() {
    const query = searchInput.value.trim();
    const type = searchType.value;
    
    if (!query) {
      document.getElementById('advanced-search-results').innerHTML = '';
      return;
    }
    
    const results = performAdvancedSearch(query, type);
    updateAdvancedSearchResults(results, type);
  }
  
  searchBtn.addEventListener('click', doSearch);
  searchInput.addEventListener('input', doSearch);
  searchType.addEventListener('change', doSearch);
}