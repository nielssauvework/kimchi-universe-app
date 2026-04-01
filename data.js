// Ingredient data extracted from the kimchi diagram
// baseQty = amount per 1 head of napa cabbage, unit = display unit
const INGREDIENTS = {
  brining: {
    label: "Brining Ingredients",
    step: 1,
    icon: "💧",
    description: "Salt and prepare the cabbage base",
    items: [
      { id: "napa-cabbage", name: "Napa Cabbage", baseQty: 1, unit: "head", bulk: "20 EA", emoji: "🥬", essential: true, tags: ["vegetableBase"], isCabbage: true },
      { id: "coarse-salt", name: "Coarse Salt", baseQty: 200, unit: "g", bulk: "6 packs", emoji: "🧂", essential: true, tags: ["saltSource"] },
      { id: "water", name: "Water", baseQty: 2, unit: "L", bulk: null, emoji: "💧", essential: true, tags: [] },
    ]
  },
  seasoning: {
    label: "Seasoning Ingredients",
    step: 2,
    icon: "🔥",
    description: "Create the signature kimchi paste",
    items: [
      { id: "red-pepper", name: "Red Pepper Powder", baseQty: 60, unit: "g", bulk: "1000g", emoji: "🌶️", essential: true, tags: ["antimicrobial"] },
      { id: "minced-garlic", name: "Minced Garlic", baseQty: 30, unit: "g", bulk: "600g", emoji: "🧄", essential: true, tags: ["antimicrobial"] },
      { id: "fish-sauce", name: "Anchovy Fish Sauce", baseQty: 30, unit: "ml", bulk: "650ml", emoji: "🐟", essential: true, tags: ["fishBased"] },
      { id: "minced-ginger", name: "Minced Ginger", baseQty: 5, unit: "g", bulk: "1 EA", emoji: "🫚", essential: false, tags: ["antimicrobial"] },
      { id: "green-onion-s", name: "Green Onion", baseQty: 1, unit: "stalk", bulk: "3 EA", emoji: "🧅", essential: false, tags: ["vegetableBase"] },
    ]
  },
  additional: {
    label: "Additional Ingredients",
    step: 3,
    icon: "🌿",
    description: "Add depth and complexity",
    items: [
      { id: "radish", name: "Radish", baseQty: 150, unit: "g", bulk: "4 EA", emoji: "🫚", essential: false, tags: ["sugarSource", "vegetableBase"] },
      { id: "pear", name: "Pear", baseQty: 50, unit: "g", bulk: "8 EA", emoji: "🍐", essential: false, tags: ["sugarSource"] },
      { id: "green-onion-stalks", name: "Green Onion Stalks", baseQty: 5, unit: "stalks", bulk: "7 stalks", emoji: "🥬", essential: false, tags: ["vegetableBase"] },
      { id: "cooking-wine", name: "Cooking Wine / Soju", baseQty: 2, unit: "tbsp", bulk: "1 bottle", emoji: "🍶", essential: false, tags: ["alcoholSource"] },
      { id: "onion", name: "Onion", baseQty: 50, unit: "g", bulk: "5 EA", emoji: "🧅", essential: false, tags: ["sugarSource", "vegetableBase"] },
      { id: "seaweed", name: "Dried Seaweed (Dashima)", baseQty: 5, unit: "g", bulk: "1 pack", emoji: "🌿", essential: false, tags: ["vegetableBase"] },
      { id: "cashew-nut", name: "Cashew Nuts", baseQty: 20, unit: "g", bulk: "1 bag", emoji: "🥜", essential: false, tags: ["sugarSource"] },
      { id: "sesame-seeds", name: "Sesame Seeds", baseQty: 1, unit: "tbsp", bulk: "1 bag", emoji: "🫘", essential: false, tags: ["sugarSource"] },
      { id: "carrot", name: "Carrot", baseQty: 50, unit: "g", bulk: "3 EA", emoji: "🥕", essential: false, tags: ["sugarSource", "vegetableBase"] },
      { id: "chives", name: "Chives (Buchu)", baseQty: 50, unit: "g", bulk: "2 bunches", emoji: "🌱", essential: false, tags: ["vegetableBase"] },
      { id: "salted-shrimp", name: "Salted Shrimp (Saeujeot)", baseQty: 1, unit: "tbsp", bulk: "1 jar", emoji: "🦐", essential: false, tags: ["fishBased", "proteinSource"] },
      { id: "oyster", name: "Fresh Oysters", baseQty: 5, unit: "pieces", bulk: null, emoji: "🦪", essential: false, tags: ["fishBased", "proteinSource"] },
      { id: "chestnuts", name: "Chestnuts", baseQty: 3, unit: "pieces", bulk: "1 bag", emoji: "🌰", essential: false, tags: ["sugarSource"] },
      { id: "pine-nuts", name: "Pine Nuts", baseQty: 1, unit: "tbsp", bulk: "1 bag", emoji: "🌲", essential: false, tags: ["sugarSource"] },
    ]
  },
  feast: {
    label: "Feast Extras",
    step: 4,
    icon: "⭐",
    description: "Special ingredients for a grand batch",
    items: [
      { id: "rice-paste", name: "Glutinous Rice Paste", baseQty: 1, unit: "cup", bulk: null, emoji: "🍚", essential: false, tags: ["starchSource"] },
      { id: "soybean-paste", name: "Soybean Paste", baseQty: 1, unit: "tbsp", bulk: null, emoji: "🫘", essential: false, tags: ["fermentedBase"] },
      { id: "peppercorns", name: "Whole Peppercorns", baseQty: 1, unit: "tsp", bulk: null, emoji: "⚫", essential: false, tags: ["spiceSource"] },
    ]
  }
};

// Microorganism data
const MICROORGANISMS = [
  {
    id: "leuconostoc",
    name: "Leuconostoc",
    scientific: "Leuconostoc mesenteroides",
    role: "Fermentation Initiator",
    description: "Kicks off fermentation by producing CO₂ and lactic acid. Creates the initial tangy flavor and fizzy texture. Thrives in the salty, vegetable-rich environment of early kimchi.",
    benefits: [
      "Produces natural antimicrobial compounds that inhibit harmful bacteria",
      "Generates B-vitamins (B12, folate) during fermentation",
      "Supports gut health by lowering intestinal pH",
      "Creates dextrans that act as prebiotic fiber"
    ],
    activatedBy: ["saltSource", "vegetableBase", "sugarSource"],
    color: "#64d2ff",
    symbol: "⬡"
  },
  {
    id: "l-plantarum",
    name: "L. plantarum",
    scientific: "Lactobacillus plantarum",
    role: "Primary Fermenter",
    description: "The workhorse of kimchi fermentation. Takes over from Leuconostoc as acidity rises. Produces large amounts of lactic acid. Garlic and ginger help select for this species.",
    benefits: [
      "Strengthens the intestinal barrier and reduces gut permeability",
      "Shown to reduce cholesterol levels in clinical studies",
      "Produces antioxidants that help neutralize free radicals",
      "Supports immune function by stimulating natural killer cells",
      "May help reduce symptoms of irritable bowel syndrome (IBS)"
    ],
    activatedBy: ["antimicrobial", "vegetableBase", "starchSource"],
    color: "#30d158",
    symbol: "⬬"
  },
  {
    id: "l-brevis",
    name: "L. brevis",
    scientific: "Lactobacillus brevis",
    role: "Flavor Enhancer",
    description: "Produces CO₂ alongside lactic acid, contributing to bubbly texture and complex tanginess. Particularly active when natural sugars from fruits and vegetables are abundant.",
    benefits: [
      "Produces GABA (gamma-aminobutyric acid), which may reduce anxiety and improve sleep",
      "Enhances mineral absorption, especially iron and calcium",
      "Has anti-inflammatory properties that support digestive comfort",
      "Helps break down histamine, potentially reducing food sensitivities"
    ],
    activatedBy: ["sugarSource", "vegetableBase"],
    color: "#63e6be",
    symbol: "⬭"
  },
  {
    id: "l-sakei",
    name: "L. sakei",
    scientific: "Lactobacillus sakei",
    role: "Umami Producer",
    description: "Common in kimchi made with fish sauce or seafood. Contributes deep umami flavor and tolerates lower temperatures well, important during cold fermentation.",
    benefits: [
      "Produces bacteriocins that fight foodborne pathogens like Listeria",
      "Linked to improved nasal and sinus microbiome health",
      "Enhances protein digestibility through enzymatic breakdown",
      "Supports balanced oral and upper respiratory microbiota"
    ],
    activatedBy: ["fishBased", "proteinSource"],
    color: "#5e5ce6",
    symbol: "◆"
  },
  {
    id: "weissella",
    name: "Weissella",
    scientific: "Weissella spp.",
    role: "Early Colonizer",
    description: "One of the first bacteria active in fresh kimchi. Produces exopolysaccharides that contribute to texture. Activity depends on salt concentration and temperature.",
    benefits: [
      "Produces exopolysaccharides with prebiotic effects that feed beneficial gut bacteria",
      "Has shown anti-obesity effects in animal studies",
      "Contributes to skin health through anti-inflammatory metabolites",
      "Supports early microbial diversity in the ferment, improving overall probiotic richness"
    ],
    activatedBy: ["saltSource", "vegetableBase", "fermentedBase"],
    color: "#bf5af2",
    symbol: "⎔"
  },
  {
    id: "pediococcus",
    name: "Pediococcus",
    scientific: "Pediococcus spp.",
    role: "Acid Stabilizer",
    description: "Becomes prominent at higher salt concentrations and during extended fermentation. Helps stabilize acidity and contributes to preservation of well-aged kimchi.",
    benefits: [
      "Produces pediocin, a natural antimicrobial effective against Listeria",
      "Helps maintain long-term preservation and food safety",
      "Supports stable gut pH, creating a favorable environment for other probiotics",
      "May help reduce blood pressure through ACE-inhibitory peptides"
    ],
    activatedBy: ["saltSource", "spiceSource", "fermentedBase"],
    color: "#ff9f0a",
    symbol: "⬢"
  }
];
