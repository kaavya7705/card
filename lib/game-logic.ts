import { v4 as uuidv4 } from "uuid"
import type { Card, CardType, CardRarity, AIDifficulty, PlayerState } from "@/lib/types"

// Generate a random card with enhanced logic
export function generateCard(player: "player" | "computer", preferredType?: CardType): Card {
  const types: CardType[] = ["fire", "ice", "electric", "water", "earth", "wind"]
  const rarities: CardRarity[] = [
    "common",
    "common",
    "common",
    "common",
    "common",
    "uncommon",
    "uncommon",
    "uncommon",
    "rare",
    "rare",
    "epic",
    "legendary",
  ]

  // Use preferred type if provided, otherwise random
  const type = preferredType || types[Math.floor(Math.random() * types.length)]

  // Weighted random selection for rarity
  const rarity = rarities[Math.floor(Math.random() * rarities.length)]

  // Stats based on rarity with more balanced progression for 50 health system
  const rarityMultiplier = {
    common: 1,
    uncommon: 1.2,
    rare: 1.5,
    epic: 1.8,
    legendary: 2.2,
  }

  // Base stats with some randomness but more balanced
  const baseAttack = Math.floor(Math.random() * 2) + 1 // 1-2
  const baseDefense = Math.floor(Math.random() * 1) + 1 // 1

  const attack = Math.floor(baseAttack * rarityMultiplier[rarity])
  const defense = Math.floor(baseDefense * rarityMultiplier[rarity])

  // Energy cost based on stats and rarity - INCREASED as requested
  // Increase energy costs by 1-2 points based on rarity
  const rarityEnergyBonus = {
    common: 1,
    uncommon: 1,
    rare: 2,
    epic: 2,
    legendary: 3,
  }

  const energyCost = Math.max(2, Math.min(8, Math.floor((attack + defense) / 3) + rarityEnergyBonus[rarity]))

  // Card descriptions based on type
  const typeDescriptions = {
    fire: "Burns with intense heat, strong against ice but weak to water.",
    ice: "Freezes opponents solid, strong against electric but weak to fire.",
    electric: "Shocks with lightning, strong against water but weak to earth.",
    water: "Flows with adaptability, strong against fire but weak to electric.",
    earth: "Stands firm and unyielding, strong against electric but weak to wind.",
    wind: "Moves with swift precision, strong against earth but weak to ice.",
  }

  // Special effects with more variety and balanced by rarity
  let special = undefined
  if (rarity !== "common") {
    const specialEffects = [
      { name: "Stun", effect: "stun" as const, value: 1 },
      { name: "Poison", effect: "poison" as const, value: 4 },
      { name: "Burn", effect: "burn" as const, value: 3 },
      { name: "Heal", effect: "heal" as const, value: 12 },
      { name: "Energy Boost", effect: "energyBoost" as const, value: 2 },
    ]

    // Add more powerful effects for higher rarities
    if (rarity === "rare" || rarity === "epic" || rarity === "legendary") {
      specialEffects.push(
        { name: "Shield", effect: "shield" as const, value: 5 },
        { name: "Energy Drain", effect: "energyDrain" as const, value: 1 },
      )
    }

    if (rarity === "epic" || rarity === "legendary") {
      specialEffects.push(
        { name: "Power Surge", effect: "powerBoost" as const, value: 20 },
        { name: "Double Strike", effect: "doubleAttack" as const },
      )
    }

    // Higher chance of special effect for higher rarity
    const specialChance = {
      uncommon: 0.4,
      rare: 0.7,
      epic: 0.9,
      legendary: 1,
    }

    if (Math.random() < specialChance[rarity]) {
      // For higher rarities, bias toward more powerful effects
      let effectPool = specialEffects
      if (rarity === "legendary") {
        // Legendary cards get more powerful effects more often
        effectPool = specialEffects.slice(specialEffects.length - 4)
      } else if (rarity === "epic") {
        // Epic cards exclude the most basic effects
        effectPool = specialEffects.slice(2)
      }

      special = effectPool[Math.floor(Math.random() * effectPool.length)]
    }
  }

  // Add passive abilities for rare+ cards
  let passive = undefined
  if ((rarity === "rare" || rarity === "epic" || rarity === "legendary") && Math.random() < 0.6) {
    const passiveEffects = [
      { effect: "criticalChance" as const, value: rarity === "legendary" ? 30 : rarity === "epic" ? 20 : 15 },
      { effect: "counterAttack" as const, value: rarity === "legendary" ? 3 : rarity === "epic" ? 2 : 1 },
      { effect: "energyRegen" as const, value: 1 },
      { effect: "damageReduction" as const, value: rarity === "legendary" ? 3 : rarity === "epic" ? 2 : 1 },
    ]

    passive = passiveEffects[Math.floor(Math.random() * passiveEffects.length)]
  }

  // Add synergy effects for uncommon+ cards
  let synergy = undefined
  if (rarity !== "common" && Math.random() < 0.4) {
    // Pick a type that's not the current card's type
    const otherTypes = types.filter((t) => t !== type)
    const synergyType = otherTypes[Math.floor(Math.random() * otherTypes.length)]

    const synergyEffects = [
      { bonus: "attack" as const, value: 2 },
      { bonus: "defense" as const, value: 2 },
      { bonus: "special" as const, value: 1 },
    ]

    synergy = {
      type: synergyType,
      ...synergyEffects[Math.floor(Math.random() * synergyEffects.length)],
    }
  }

  // Card names based on type and rarity
  const typeNames = {
    fire: [
      "Flame Sprite",
      "Ember Wisp",
      "Blaze Elemental",
      "Inferno Drake",
      "Phoenix Guardian",
      "Volcanic Titan",
      "Magma Lord",
      "Hellfire Dragon",
      "Solar Flare",
    ],
    ice: [
      "Frost Sprite",
      "Snow Wisp",
      "Glacier Elemental",
      "Blizzard Drake",
      "Frozen Guardian",
      "Arctic Titan",
      "Permafrost Lord",
      "Avalanche Dragon",
      "Winter's Wrath",
    ],
    electric: [
      "Spark Sprite",
      "Lightning Wisp",
      "Thunder Elemental",
      "Storm Drake",
      "Voltage Guardian",
      "Tempest Titan",
      "Thunderbolt Lord",
      "Lightning Dragon",
      "Static Surge",
    ],
    water: [
      "Droplet Sprite",
      "Mist Wisp",
      "Wave Elemental",
      "Tidal Drake",
      "Ocean Guardian",
      "Tsunami Titan",
      "Abyssal Lord",
      "Kraken",
      "Maelstrom",
    ],
    earth: [
      "Pebble Sprite",
      "Dust Wisp",
      "Boulder Elemental",
      "Terra Drake",
      "Mountain Guardian",
      "Tectonic Titan",
      "Quake Lord",
      "Stone Dragon",
      "Ancient Treant",
    ],
    wind: [
      "Breeze Sprite",
      "Gust Wisp",
      "Cyclone Elemental",
      "Zephyr Drake",
      "Sky Guardian",
      "Tornado Titan",
      "Tempest Lord",
      "Cloud Dragon",
      "Hurricane Force",
    ],
  }

  // Select name based on rarity - higher rarity gets more impressive names
  const nameOptions = typeNames[type]
  let nameIndex

  if (rarity === "legendary") {
    nameIndex = Math.floor(Math.random() * 3) + 6 // 6-8
  } else if (rarity === "epic") {
    nameIndex = Math.floor(Math.random() * 3) + 3 // 3-5
  } else {
    nameIndex = Math.floor(Math.random() * 3) // 0-2
  }

  const name = nameOptions[nameIndex]

  return {
    id: uuidv4(),
    name,
    type,
    rarity,
    attack,
    defense,
    energyCost,
    description: typeDescriptions[type],
    special,
    synergy,
    passive,
  }
}

// Generate a balanced deck of cards
export function generateDeck(player: "player" | "computer", aiDifficulty: AIDifficulty = "medium"): Card[] {
  const deck: Card[] = []
  const deckSize = 20

  // Ensure a good distribution of card types
  const types: CardType[] = ["fire", "ice", "electric", "water", "earth", "wind"]

  // For harder AI, create more strategic decks
  if (player === "computer" && aiDifficulty === "hard") {
    // Hard AI focuses on 2-3 types for better synergy
    const primaryTypes = types.sort(() => 0.5 - Math.random()).slice(0, 3)

    // Generate cards with a bias toward the primary types
    for (let i = 0; i < deckSize; i++) {
      const useMainType = Math.random() < 0.7 // 70% chance to use primary type
      if (useMainType) {
        const typeIndex = Math.floor(Math.random() * primaryTypes.length)
        deck.push(generateCard(player, primaryTypes[typeIndex]))
      } else {
        deck.push(generateCard(player))
      }
    }
  } else {
    // For player and easier AI, create a more balanced deck
    // Ensure at least 2 cards of each type
    types.forEach((type) => {
      deck.push(generateCard(player, type))
      deck.push(generateCard(player, type))
    })

    // Fill the rest randomly
    for (let i = deck.length; i < deckSize; i++) {
      deck.push(generateCard(player))
    }
  }

  // Ensure a good distribution of rarities
  const hasLegendary = deck.some((card) => card.rarity === "legendary")
  const epicCount = deck.filter((card) => card.rarity === "epic").length

  // Make sure player has at least one legendary and a few epics
  if (player === "player" && !hasLegendary) {
    // Replace a random card with a legendary
    const replaceIndex = Math.floor(Math.random() * deck.length)
    const randomType = types[Math.floor(Math.random() * types.length)]

    // Force generate a legendary card
    const legendaryCard = generateCard(player, randomType)
    legendaryCard.rarity = "legendary"

    // Boost its stats to ensure it's powerful
    legendaryCard.attack = Math.max(legendaryCard.attack, 8)
    legendaryCard.defense = Math.max(legendaryCard.defense, 5)

    deck[replaceIndex] = legendaryCard
  }

  // Ensure a few epic cards
  if (player === "player" && epicCount < 2) {
    for (let i = epicCount; i < 2; i++) {
      const replaceIndex = Math.floor(Math.random() * deck.length)
      // Skip if we'd replace the legendary
      if (deck[replaceIndex].rarity === "legendary") continue

      const randomType = types[Math.floor(Math.random() * types.length)]

      // Force generate an epic card
      const epicCard = generateCard(player, randomType)
      epicCard.rarity = "epic"

      // Boost its stats
      epicCard.attack = Math.max(epicCard.attack, 6)
      epicCard.defense = Math.max(epicCard.defense, 3)

      deck[replaceIndex] = epicCard
    }
  }

  return deck
}

// Calculate type advantage with enhanced system
export function calculateTypeAdvantage(attackerType: CardType, defenderType: CardType): number {
  const advantages: Record<CardType, CardType[]> = {
    fire: ["ice"],
    ice: ["electric", "wind"],
    electric: ["water"],
    water: ["fire", "earth"],
    earth: ["electric"],
    wind: ["earth"],
  }

  const disadvantages: Record<CardType, CardType[]> = {
    fire: ["water"],
    ice: ["fire"],
    electric: ["earth"],
    water: ["electric"],
    earth: ["wind", "water"],
    wind: ["ice"],
  }

  if (advantages[attackerType].includes(defenderType)) {
    return 1.5 // Super effective
  } else if (disadvantages[attackerType].includes(defenderType)) {
    return 0.75 // Not very effective
  }

  return 1 // Normal effectiveness
}

// Check for critical hit
export function checkCriticalHit(card: Card): boolean {
  // Base critical chance
  let criticalChance = 10

  // Add passive critical chance if the card has it
  if (card.passive && card.passive.effect === "criticalChance") {
    criticalChance += card.passive.value
  }

  return Math.random() * 100 < criticalChance
}

// Calculate damage
export function calculateDamage(
  attackerCard: Card,
  defenderCard: Card,
  typeMultiplier: number,
  isCritical: boolean,
): number {
  // Base damage is attacker's attack stat
  let damage = attackerCard.attack

  // Apply type advantage
  damage = Math.round(damage * typeMultiplier)

  // Apply critical hit
  if (isCritical) {
    damage = Math.round(damage * 1.5)
  }

  // Apply double attack special
  if (attackerCard.special && attackerCard.special.effect === "doubleAttack") {
    damage = damage * 2
  }

  // Subtract defender's defense
  damage = Math.max(0, damage - defenderCard.defense)

  // Apply damage reduction passive
  if (defenderCard.passive && defenderCard.passive.effect === "damageReduction") {
    damage = Math.max(0, damage - defenderCard.passive.value)
  }

  return damage
}

// Process counter attack
export function processCounterAttack(card: Card): number {
  if (card.passive && card.passive.effect === "counterAttack") {
    return card.passive.value
  }
  return 0
}

// Apply synergy bonuses
export function applySynergies(card: Card, cardsToCheck: Card[]): Card {
  if (!card.synergy) return card

  // Check if any cards in the discard pile match the synergy type
  const hasSynergyMatch = cardsToCheck.some((c) => c.type === card.synergy?.type)

  if (hasSynergyMatch) {
    const enhancedCard = { ...card }

    // Apply the synergy bonus
    if (card.synergy.bonus === "attack") {
      enhancedCard.attack += card.synergy.value
    } else if (card.synergy.bonus === "defense") {
      enhancedCard.defense += card.synergy.value
    }

    return enhancedCard
  }

  return card
}

// Computer AI decision making
export function getComputerMove(
  computerState: PlayerState,
  playerField: Card | null,
  difficulty: AIDifficulty,
): Card | null {
  // Filter cards that the computer can afford to play
  const playableCards = computerState.hand.filter((card) => card.energyCost <= computerState.energy)

  if (playableCards.length === 0) return null

  // Easy difficulty: play a random card
  if (difficulty === "easy") {
    return playableCards[Math.floor(Math.random() * playableCards.length)]
  }

  // Medium and Hard difficulties: make smarter decisions

  // If player has a card on the field, try to counter it
  if (playerField) {
    // Find cards with type advantage against player's card
    const advantageCards = playableCards.filter((card) => calculateTypeAdvantage(card.type, playerField.type) > 1)

    if (advantageCards.length > 0) {
      // Sort by attack value and pick the strongest
      advantageCards.sort((a, b) => b.attack - a.attack)
      return advantageCards[0]
    }

    // If no advantage cards, pick the card that can deal the most damage
    playableCards.sort((a, b) => {
      const damageA = calculateDamage(a, playerField, calculateTypeAdvantage(a.type, playerField.type), false)
      const damageB = calculateDamage(b, playerField, calculateTypeAdvantage(b.type, playerField.type), false)
      return damageB - damageA
    })

    return playableCards[0]
  }

  // If player has no card on the field, play the best value card
  // (attack + defense) / energy cost
  playableCards.sort((a, b) => {
    const valueA = (a.attack + a.defense) / a.energyCost
    const valueB = (b.attack + b.defense) / b.energyCost
    return valueB - valueA
  })

  // Hard difficulty: sometimes save energy for better cards
  if (difficulty === "hard" && computerState.energy < 5 && Math.random() < 0.3) {
    // 30% chance to pass if energy is low
    return null
  }

  return playableCards[0]
}
