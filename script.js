// Load checklist from localStorage
function loadChecklist() {
  const saved = localStorage.getItem('roostChecklist');
  return saved ? JSON.parse(saved) : {};
}

// Save checklist to localStorage
function saveChecklist(data) {
  localStorage.setItem('roostChecklist', JSON.stringify(data));
}

function renderChecklist() {
  const checklistDiv = document.getElementById('checklist');
  checklistDiv.innerHTML = '';
  const saved = loadChecklist();
  CHICKENS.forEach(chicken => {
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

document.addEventListener('DOMContentLoaded', () => {
  renderChecklist();
  document.getElementById('clearBtn').addEventListener('click', () => {
    localStorage.removeItem('roostChecklist');
    renderChecklist();
  });
});