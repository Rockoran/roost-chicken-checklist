// Crafting tree functionality for Project Overpowered chickens
// This builds a complete dependency tree showing all required chickens

// Function to build a complete crafting tree for a chicken
function buildCraftingTree(chickenName, depth = 0, visited = new Set()) {
  // Prevent infinite loops
  if (visited.has(chickenName)) {
    return { name: chickenName, type: 'circular', children: [] };
  }
  
  visited.add(chickenName);
  
  const recipe = getBreedingRecipe(chickenName);
  
  // Base case: found naturally, crafted, or unobtainable
  if (recipe.length === 1) {
    const type = recipe[0].includes('Found') ? 'found' : 
                recipe[0].includes('Craft') ? 'crafted' : 
                recipe[0].includes('Unobtainable') ? 'unobtainable' : 'special';
    return {
      name: chickenName,
      type: type,
      recipe: recipe[0],
      children: []
    };
  }
  
  // Recursive case: bred from two parents
  const [parent1, parent2] = recipe;
  const children = [
    buildCraftingTree(parent1, depth + 1, new Set(visited)),
    buildCraftingTree(parent2, depth + 1, new Set(visited))
  ];
  
  return {
    name: chickenName,
    type: 'bred',
    recipe: `${parent1} + ${parent2}`,
    children: children
  };
}

// Function to render the crafting tree as HTML with proper tree structure
function renderCraftingTree(tree, depth = 0, isLast = true, prefix = '') {
  let html = '';
  
  // Create the tree structure with proper branching
  const connector = depth === 0 ? '' : (isLast ? '└── ' : '├── ');
  const nextPrefix = depth === 0 ? '' : prefix + (isLast ? '    ' : '│   ');
  
  const typeClass = `tree-${tree.type}`;
  
  // Add icon based on type
  const icon = tree.type === 'found' ? '🌍' :
               tree.type === 'crafted' ? '🔨' :
               tree.type === 'bred' ? '🐔' :
               tree.type === 'unobtainable' ? '❌' :
               tree.type === 'circular' ? '🔄' : '⭐';
  
  html += `<div class="tree-node ${typeClass}">`;
  html += `<span class="tree-prefix">${prefix}${connector}</span>`;
  html += `<span class="tree-icon">${icon}</span>`;
  html += `<span class="tree-name">${tree.name}</span>`;
  
  if (tree.recipe && tree.type !== 'bred') {
    html += `<span class="tree-recipe"> (${tree.recipe})</span>`;
  }
  
  html += '</div>';
  
  // Recursively render children with proper tree structure
  if (tree.children && tree.children.length > 0) {
    tree.children.forEach((child, index) => {
      const isLastChild = index === tree.children.length - 1;
      html += renderCraftingTree(child, depth + 1, isLastChild, nextPrefix);
    });
  }
  
  return html;
}

// Enhanced function to render a more visual tree structure
function renderVisualCraftingTree(tree, depth = 0) {
  let html = '';
  
  // Root node styling
  if (depth === 0) {
    html += `<div class="tree-root">`;
    html += `<div class="tree-target">🎯 <strong>${tree.name}</strong></div>`;
    if (tree.children && tree.children.length > 0) {
      html += `<div class="tree-branches">`;
      tree.children.forEach((child, index) => {
        html += `<div class="tree-branch">`;
        html += renderVisualCraftingTreeBranch(child, 1);
        html += `</div>`;
      });
      html += `</div>`;
    }
    html += `</div>`;
  }
  
  return html;
}

function renderVisualCraftingTreeBranch(tree, depth) {
  const typeClass = `tree-${tree.type}`;
  const icon = tree.type === 'found' ? '🌍' :
               tree.type === 'crafted' ? '🔨' :
               tree.type === 'bred' ? '🐔' :
               tree.type === 'unobtainable' ? '❌' :
               tree.type === 'circular' ? '🔄' : '⭐';
  
  let html = `<div class="tree-node-visual ${typeClass}" style="margin-left: ${(depth-1) * 30}px;">`;
  
  // Add connecting lines
  if (depth > 1) {
    html += `<div class="tree-connector">└─</div>`;
  }
  
  html += `<div class="tree-content">`;
  html += `<span class="tree-icon">${icon}</span>`;
  html += `<span class="tree-name">${tree.name}</span>`;
  
  if (tree.recipe && tree.type !== 'bred') {
    html += `<div class="tree-recipe-detail">${tree.recipe}</div>`;
  }
  html += `</div>`;
  html += `</div>`;
  
  // Render children
  if (tree.children && tree.children.length > 0) {
    tree.children.forEach(child => {
      html += renderVisualCraftingTreeBranch(child, depth + 1);
    });
  }
  
  return html;
}

// Function to get all unique base requirements for a chicken
function getBaseRequirements(chickenName, requirements = new Set(), visited = new Set()) {
  if (visited.has(chickenName)) return requirements;
  visited.add(chickenName);
  
  const recipe = getBreedingRecipe(chickenName);
  
  // If it's a base chicken (found/crafted), add to requirements
  if (recipe.length === 1) {
    requirements.add(chickenName);
    return requirements;
  }
  
  // Recursively get requirements from parents
  const [parent1, parent2] = recipe;
  getBaseRequirements(parent1, requirements, visited);
  getBaseRequirements(parent2, requirements, visited);
  
  return requirements;
}

// Function to calculate breeding depth (how many generations deep)
function getBreedingDepth(chickenName, visited = new Set()) {
  if (visited.has(chickenName)) return 0;
  visited.add(chickenName);
  
  const recipe = getBreedingRecipe(chickenName);
  
  // Base case
  if (recipe.length === 1) return 0;
  
  // Get max depth from parents
  const [parent1, parent2] = recipe;
  const depth1 = getBreedingDepth(parent1, new Set(visited));
  const depth2 = getBreedingDepth(parent2, new Set(visited));
  
  return Math.max(depth1, depth2) + 1;
}