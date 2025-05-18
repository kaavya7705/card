export type CardType = "fire" | "ice" | "electric" | "water" | "earth" | "wind"
export type CardRarity = "common" | "uncommon" | "rare" | "epic" | "legendary"
export type GamePhase = "setup" | "draw" | "play" | "battle" | "end" | "tutorial"
export type AIDifficulty = "easy" | "medium" | "hard"
export type TutorialStep = "welcome" | "cards" | "types" | "energy" | "battle" | "special" | "status" | "complete"

export interface StatusEffect {
  type: "stun" | "poison" | "burn" | "shield" | "energyDrain" | "powerBoost"
  duration: number
  value?: number // For effects with variable values
}

export interface Card {
  id: string
  name: string
  type: CardType
  rarity: CardRarity
  attack: number
  defense: number
  energyCost: number
  description?: string
  special?: {
    name: string
    effect:
      | "stun"
      | "poison"
      | "burn"
      | "heal"
      | "energyBoost"
      | "shield"
      | "energyDrain"
      | "powerBoost"
      | "doubleAttack"
    value?: number // For effects with variable values
  }
  synergy?: {
    type: CardType
    bonus: "attack" | "defense" | "special"
    value: number
  }
  passive?: {
    effect: "criticalChance" | "counterAttack" | "energyRegen" | "damageReduction"
    value: number
  }
}

export interface GameSettings {
  aiDifficulty: AIDifficulty
  tutorialCompleted: boolean
  soundEnabled: boolean
  animationsEnabled: boolean
}

export interface PlayerState {
  health: number
  energy: number
  power: number
  deck: Card[]
  hand: Card[]
  field: Card | null
  statusEffects: StatusEffect[]
  discardPile: Card[]
  combo: number // Tracks consecutive successful plays
}

export interface GameState {
  player: PlayerState
  computer: PlayerState
  turn: "player" | "computer"
  phase: GamePhase
  timeLeft: number
  gameOver: boolean
  winner: "player" | "computer" | null
  battleLog: string[]
  animation: string | null
  battleResult: {
    playerDamage: number
    computerDamage: number
    playerAdvantage: boolean
    computerAdvantage: boolean
    criticalHit?: "player" | "computer" | null
  } | null
  settings: GameSettings
  tutorial: {
    active: boolean
    step: TutorialStep
    highlightElement: string | null
  }
}
