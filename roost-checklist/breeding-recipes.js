// Breeding recipes for Project Overpowered chickens
// Format: "Result Chicken": ["Parent 1", "Parent 2"] or ["Method"]
const BREEDING_RECIPES = {
  // Base Chickens (Found naturally or crafted)
  "Chicken Chicken": ["Found naturally in world"],
  "Flint Chicken": ["Found naturally in world"],
  "Log Chicken": ["Found naturally in world"],
  "Nether Quartz Chicken": ["Found in Nether"],
  "Sand Chicken": ["Found naturally in world"],
  "Soul Sand Chicken": ["Found in Nether"],
  "Smart Chicken": ["Unobtainable"],
  
  // Crafted Base Chickens (Dye + Egg)
  "Bone White Chicken": ["Craft: Bonemeal + Egg"],
  "Cactus Green Chicken": ["Craft: Green Dye + Egg"],
  "Ink Black Chicken": ["Craft: Ink Sac + Egg"],
  "Lapis Blue Chicken": ["Craft: Lapis Lazuli + Egg"],
  "Red Chicken": ["Craft: Red Dye + Egg"],
  "Yellow Chicken": ["Craft: Yellow Dye + Egg"],
  
  // Bred Chickens (Confirmed recipes)
  "Coal Chicken": ["Flint Chicken", "Log Chicken"],
  "Cocoa Brown Chicken": ["Red Chicken", "Cactus Green Chicken"],
  "Cyan Chicken": ["Lapis Blue Chicken", "Cactus Green Chicken"],
  "Glowstone Chicken": ["Nether Quartz Chicken", "Yellow Chicken"],
  "Gray Chicken": ["Ink Black Chicken", "Bone White Chicken"],
  "Gunpowder Chicken": ["Sand Chicken", "Flint Chicken"],
  "Iron Chicken": ["Flint Chicken", "Bone White Chicken"],
  "Light Blue Chicken": ["Bone White Chicken", "Lapis Blue Chicken"],
  "Lime Chicken": ["Cactus Green Chicken", "Bone White Chicken"],
  "Orange Chicken": ["Red Chicken", "Yellow Chicken"],
  "Pink Chicken": ["Red Chicken", "Bone White Chicken"],
  "Purple Chicken": ["Lapis Blue Chicken", "Red Chicken"],
  "Redstone Chicken": ["Red Chicken", "Sand Chicken"],
  "Snowball Chicken": ["Lapis Blue Chicken", "Log Chicken"],
  "String Chicken": ["Ink Black Chicken", "Log Chicken"],
  "Clay Chicken": ["Snowball Chicken", "Sand Chicken"],
  "Glass Chicken": ["Nether Quartz Chicken", "Redstone Chicken"],
  "Gold Chicken": ["Iron Chicken", "Yellow Chicken"],
  "Lava Chicken": ["Coal Chicken", "Nether Quartz Chicken"],
  "Leather Chicken": ["String Chicken", "Cocoa Brown Chicken"],
  "Magenta Chicken": ["Purple Chicken", "Pink Chicken"],
  "Nether Wart Chicken": ["Cocoa Brown Chicken", "Glowstone Chicken"],
  "Light Gray Chicken": ["Gray Chicken", "Bone White Chicken"],
  "Water Chicken": ["Gunpowder Chicken", "Snowball Chicken"],
  "Conductive Iron Chicken": ["Redstone Chicken", "Iron Chicken"],
  "Copper Chicken": ["Yellow Chicken", "Cocoa Brown Chicken"],
  "Osmium Chicken": ["Iron Chicken", "Nether Quartz Chicken"],
  "Rubber Chicken": ["Log Chicken", "Orange Chicken"],
  "Steel Chicken": ["Iron Chicken", "Coal Chicken"],
  "Sulfur Chicken": ["Gunpowder Chicken", "Flint Chicken"],
  "Blaze Rod Chicken": ["Gold Chicken", "Lava Chicken"],
  "Diamond Chicken": ["Glass Chicken", "Gold Chicken"],
  "Slime Chicken": ["Clay Chicken", "Cactus Green Chicken"],
  "Energetic Alloy Chicken": ["Gold Chicken", "Glowstone Chicken"],
  "Obsidian Chicken": ["Water Chicken", "Lava Chicken"],
  "Prismarine Shard Chicken": ["Water Chicken", "Lapis Blue Chicken"],
  "Salt Chicken": ["Water Chicken", "Lava Chicken"],
  "Silicon Chicken": ["Clay Chicken", "Sand Chicken"],
  "Soularium Chicken": ["Soul Sand Chicken", "Gold Chicken"],
  "Tin Chicken": ["Bone White Chicken", "Clay Chicken"],
  "Emerald Chicken": ["Diamond Chicken", "Cactus Green Chicken"],
  "Ender Pearl Chicken": ["Diamond Chicken", "Nether Wart Chicken"],
  "Ghast Tear Chicken": ["Bone White Chicken", "Blaze Rod Chicken"],
  "Magma Cream Chicken": ["Slime Chicken", "Blaze Rod Chicken"],
  "Blood Chicken": ["Slime Chicken", "Red Chicken"],
  "Blue Slime Chicken": ["Slime Chicken", "Lapis Blue Chicken"],
  "Bronze Chicken": ["Copper Chicken", "Tin Chicken"],
  "Dark Steel Chicken": ["Iron Chicken", "Obsidian Chicken"],
  "Elecrical Steel Chicken": ["Iron Chicken", "Silicon Chicken"],
  "Redstone Alloy Chicken": ["Redstone Chicken", "Silicon Chicken"],
  "Ardite Chicken": ["Blaze Rod Chicken", "Magma Cream Chicken"],
  "Cobalt Chicken": ["Nether Wart Chicken", "Ghast Tear Chicken"],
  "Magma Slime Chicken": ["Slime Chicken", "Magma Cream Chicken"],
  "ManaSteel Chicken": ["Iron Chicken", "Ghast Tear Chicken"],
  "Prismarine Crystal Chicken": ["Water Chicken", "Emerald Chicken"],
  "Manyullyn Chicken": ["Ardite Chicken", "Cobalt Chicken"],
  "Magical Wood Chicken": ["Log Chicken", "Xp Chicken"],
  "Draconium Chicken": ["Pig Iron Chicken", "Ender Pearl Chicken"],
  "Xp Chicken": ["Emerald Chicken", "Cactus Green Chicken"],
  "Vibrant Alloy Chicken": ["Energetic Alloy Chicken", "Ender Pearl Chicken"],
  "Purple Slime Chicken": ["Blood Chicken", "Lapis Blue Chicken"],
  "Pulsating Iron Chicken": ["Iron Chicken", "Ender Pearl Chicken"],
  "Pig Iron Chicken": ["Blood Chicken", "Iron Chicken"],
  "Redstone Crystal Chicken": ["Redstone Chicken", "Prismarine Crystal Chicken"],
  "Terrasteel Chicken": ["Ender Pearl Chicken", "Prismarine Crystal Chicken"],
  "Elementium Chicken": ["ManaSteel Chicken", "Terrasteel Chicken"],
  "Knight Slime Chicken": ["Manyullyn Chicken", "Pig Iron Chicken"],
  "Lunar Reactive Dust Chicken": ["Redstone Crystal Chicken", "Lapis Blue Chicken"],
  "Stoneburnt Chicken": ["Redstone Crystal Chicken", "Gold Chicken"],
  "Moonstone Chicken": ["Lunar Reactive Dust Chicken", "Blaze Rod Chicken"],
  "Demon Metal Chicken": ["Magical Wood Chicken", "Moonstone Chicken"],
  
  // Special Chickens
  "Awakened Draconium Chicken": ["Craft: 8 Awakened Draconium Ingots surrounding Normal Chicken"],
  "Chickenosto Chicken": ["Crafted"]
};

// Function to get breeding recipe for a chicken
function getBreedingRecipe(chickenName) {
  const recipe = BREEDING_RECIPES[chickenName];
  if (!recipe) return ["Unknown method"];
  
  // If it's a single method (crafting/finding), return as-is
  if (recipe.length === 1) return recipe;
  
  // If it's breeding (two parents), return as-is
  return recipe;
}

// Function to get all chickens that can be bred from a specific parent
function getChildrenOf(parentChicken) {
  const children = [];
  for (const [child, parents] of Object.entries(BREEDING_RECIPES)) {
    if (parents.length === 2 && parents.includes(parentChicken)) {
      children.push(child);
    }
  }
  return children;
}