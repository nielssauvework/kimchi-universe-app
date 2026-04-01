// Ingredient data extracted from the kimchi diagram
const INGREDIENTS = {
  brining: {
    label: "Brining Ingredients",
    step: 1,
    icon: "💧",
    description: "Salt and prepare the cabbage base",
    items: [
      { id: "napa-cabbage", name: "Napa Cabbage", amount: "1 head", bulk: "20 EA", emoji: "🥬", essential: true, tags: ["vegetableBase"] },
      { id: "coarse-salt", name: "Coarse Salt", amount: "~1 cup (200g)", bulk: "6 packs", emoji: "🧂", essential: true, tags: ["saltSource"] },
      { id: "water", name: "Water", amount: "~2L", bulk: null, emoji: "💧", essential: true, tags: [] },
    ]
  },
  seasoning: {
    label: "Seasoning Ingredients",
    step: 2,
    icon: "🔥",
    description: "Create the signature kimchi paste",
    items: [
      { id: "red-pepper", name: "Red Pepper Powder", amount: "~½ cup (50-70g)", bulk: "1000g", emoji: "🌶️", essential: true, tags: ["antimicrobial"] },
      { id: "minced-garlic", name: "Minced Garlic", amount: "~2 tbsp (30g)", bulk: "600g", emoji: "🧄", essential: true, tags: ["antimicrobial"] },
      { id: "ginger-slices", name: "Ginger Slices", amount: "~2-3 slices", bulk: null, emoji: "🫚", essential: false, tags: ["antimicrobial"] },
      { id: "fish-sauce", name: "Anchovy Fish Sauce", amount: "~2 tbsp (30ml)", bulk: "650ml", emoji: "🐟", essential: true, tags: ["fishBased"] },
      { id: "minced-ginger", name: "Minced Ginger", amount: "~1 tsp (5g)", bulk: "1 EA", emoji: "🫚", essential: false, tags: ["antimicrobial"] },
      { id: "green-onion-s", name: "Green Onion", amount: "1 stalk", bulk: "3 EA", emoji: "🧅", essential: false, tags: ["vegetableBase"] },
    ]
  },
  additional: {
    label: "Additional Ingredients",
    step: 3,
    icon: "🌿",
    description: "Add depth and complexity",
    items: [
      { id: "radish", name: "Radish", amount: "~¼ (150g)", bulk: "4 EA", emoji: "🥕", essential: false, tags: ["sugarSource", "vegetableBase"] },
      { id: "pear", name: "Pear", amount: "~¼ (50g)", bulk: "8 EA", emoji: "🍐", essential: false, tags: ["sugarSource"] },
      { id: "green-onion-stalks", name: "Green Onion Stalks", amount: "~5-6 stalks", bulk: "7 stalks", emoji: "🧅", essential: false, tags: ["vegetableBase"] },
      { id: "cooking-wine", name: "Cooking Wine / Soju", amount: "2 tbsp", bulk: "1 bottle", emoji: "🍶", essential: false, tags: ["alcoholSource"] },
      { id: "pork", name: "Pork", amount: "200g", bulk: "700g", emoji: "🥩", essential: false, tags: ["proteinSource"] },
      { id: "salt-extra", name: "Salt", amount: "½ spoon", bulk: null, emoji: "🧂", essential: false, tags: ["saltSource"] },
      { id: "onion", name: "Onion", amount: "~¼ (50g)", bulk: "5 EA", emoji: "🧅", essential: false, tags: ["sugarSource", "vegetableBase"] },
      { id: "garlic-cloves", name: "Garlic Cloves", amount: "3-4 cloves", bulk: null, emoji: "🧄", essential: false, tags: ["antimicrobial"] },
    ]
  },
  feast: {
    label: "Feast Extras",
    step: 4,
    icon: "⭐",
    description: "Special ingredients for a grand batch",
    items: [
      { id: "rice-paste", name: "Glutinous Rice Paste", amount: "1 cup", bulk: null, emoji: "🍚", essential: false, tags: ["starchSource"] },
      { id: "soybean-paste", name: "Soybean Paste", amount: "1 tbsp", bulk: null, emoji: "🫘", essential: false, tags: ["fermentedBase"] },
      { id: "peppercorns", name: "Whole Peppercorns", amount: "1 tsp", bulk: null, emoji: "⚫", essential: false, tags: ["spiceSource"] },
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
