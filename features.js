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