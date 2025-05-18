"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/card"
import { HealthBar } from "@/components/health-bar"
import { EnergyMeter } from "@/components/energy-meter"
import { StatusEffects } from "@/components/status-effects"
import { PowerMeter } from "@/components/power-meter"
import { GamePhaseIndicator } from "@/components/game-phase-indicator"
import { BattleLog } from "@/components/battle-log"
import { TypeAdvantageGuide } from "@/components/type-advantage-guide"
import { GameOverScreen } from "@/components/game-over-screen"
import { GameTooltip } from "@/components/game-tooltip"
import { CardPreview } from "@/components/card-preview"
import { AnimatedTutorial } from "@/components/animated-tutorial"
import { SettingsPanel } from "@/components/settings-panel"
import { PlayerHand } from "@/components/player-hand"
import { ComputerHand } from "@/components/computer-hand"
import type { Card as CardType, StatusEffect, GameState, AIDifficulty, TutorialStep } from "@/lib/types"
import {
  generateDeck,
  getComputerMove,
  calculateTypeAdvantage,
  checkCriticalHit,
  calculateDamage,
  processCounterAttack,
  applySynergies,
} from "@/lib/game-logic"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Settings, HelpCircle, Info, RotateCcw, Swords, Shield, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function GameBoard() {
  const { toast } = useToast()

  
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    player: {
      health: 50,
      energy: 3,
      power: 0,
      deck: [],
      hand: [],
      field: null,
      statusEffects: [],
      discardPile: [],
      combo: 0,
    },
    computer: {
      health: 50,
      energy: 3,
      power: 0,
      deck: [],
      hand: [],
      field: null,
      statusEffects: [],
      discardPile: [],
      combo: 0,
    },
    turn: "player",
    phase: "setup",
    timeLeft: 30,
    gameOver: false,
    winner: null,
    battleLog: [],
    animation: null,
    battleResult: null,
    settings: {
      aiDifficulty: "medium",
      tutorialCompleted: false,
      soundEnabled: false,
      animationsEnabled: true,
    },
    tutorial: {
      active: false,
      step: "welcome",
      highlightElement: null,
    },
  })

  // UI state
  const [previewCard, setPreviewCard] = useState<CardType | null>(null)
  const [showTypeGuide, setShowTypeGuide] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const battleLogRef = useRef<HTMLDivElement>(null)

  // Initialize game
  useEffect(() => {
    if (gameState.phase === "setup") {
      const newPlayerDeck = generateDeck("player", gameState.settings.aiDifficulty)
      const newComputerDeck = generateDeck("computer", gameState.settings.aiDifficulty)

      setGameState((prev) => ({
        ...prev,
        player: {
          ...prev.player,
          deck: newPlayerDeck.slice(5),
          hand: newPlayerDeck.slice(0, 5),
        },
        computer: {
          ...prev.computer,
          deck: newComputerDeck.slice(5),
          hand: newComputerDeck.slice(0, 5),
        },
        phase: "draw",
        battleLog: ["Game started! Draw your first card to begin."],
      }))
    }
  }, [gameState.phase])

  // Timer effect
  useEffect(() => {
    if (
      gameState.gameOver ||
      gameState.phase === "setup" ||
      gameState.phase === "battle" ||
      gameState.phase === "tutorial"
    )
      return

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else {
          // Auto-play for player if time runs out
          if (prev.turn === "player" && prev.phase === "play") {
            toast({
              title: "Time's up!",
              description: "A card has been automatically played for you.",
            })

            // Find a playable card
            const playableCards = prev.player.hand.filter((card) => card.energyCost <= prev.player.energy)

            if (playableCards.length > 0) {
              // Play the card with the best value (attack + defense / energy cost)
              const bestCard = playableCards.sort((a, b) => {
                const valueA = (a.attack + a.defense) / a.energyCost
                const valueB = (b.attack + b.defense) / b.energyCost
                return valueB - valueA
              })[0]

              // Play the best card
              const updatedHand = prev.player.hand.filter((c) => c.id !== bestCard.id)

              return {
                ...prev,
                player: {
                  ...prev.player,
                  field: bestCard,
                  hand: updatedHand,
                  energy: prev.player.energy - bestCard.energyCost,
                },
                phase: prev.computer.field ? "battle" : "play",
                turn: prev.computer.field ? prev.turn : "computer",
                timeLeft: 30,
                battleLog: [`Time's up! ${bestCard.name} was automatically played for you.`, ...prev.battleLog].slice(
                  0,
                  8,
                ),
              }
            } else {
              // Auto-pass turn if no playable cards
              return {
                ...prev,
                turn: "computer",
                phase: "draw",
                timeLeft: 30,
                battleLog: ["Time's up! You had no playable cards and passed your turn.", ...prev.battleLog].slice(
                  0,
                  8,
                ),
              }
            }
          }
          return prev
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState.timeLeft, gameState.turn, gameState.phase, gameState.gameOver, toast])

  // Computer's turn
  useEffect(() => {
    const computerTurn = () => {
      setGameState((prev) => {
        // Check if computer is stunned
        if (prev.computer.statusEffects.some((effect) => effect.type === "stun")) {
          return {
            ...prev,
            turn: "player" as const, // explicitly type as "player"
            phase: "draw",
            timeLeft: 30,
            battleLog: ["Computer is stunned and skips their turn!", ...prev.battleLog].slice(0, 8),
          }
        }

        // Computer tries to use special power if available
        if (prev.computer.power >= 100) {
          // Computer special power: Deal 20 damage and apply poison
          const updatedState: GameState = {
            // explicitly type the return value
            ...prev,
            player: {
              ...prev.player,
              health: Math.max(prev.player.health - 10, 0),
              statusEffects: [...prev.player.statusEffects, { type: "poison" as const, duration: 2, value: 2 }],
            },
            computer: {
              ...prev.computer,
              power: 0,
            },
            animation: "special",
            turn: "player" as const, // explicitly type as "player"
            phase: "draw",
            timeLeft: 30,
            battleLog: ["Computer used its SPECIAL POWER! Dealt 10 damage and poisoned you!", ...prev.battleLog].slice(
              0,
              8,
            ),
          }

          // Clear animation after delay
          setTimeout(() => {
            setGameState((prev) => ({
              ...prev,
              animation: null,
            }))
          }, 1500)

          return updatedState
        }

        // Computer plays a card
        const move = getComputerMove(prev.computer, prev.player.field, prev.settings.aiDifficulty)

        if (move) {
          // Play the card
          const updatedComputerHand = prev.computer.hand.filter((c) => c.id !== move.id)

          return {
            ...prev,
            computer: {
              ...prev.computer,
              field: move,
              hand: updatedComputerHand,
              energy: prev.computer.energy - move.energyCost,
            },
            battleLog: [`Computer played ${move.name} (${move.type} type).`, ...prev.battleLog].slice(0, 8),
            // If player has already played a card, go to battle phase
            phase: prev.player.field ? "battle" : prev.phase,
            turn: prev.player.field ? prev.turn : ("player" as const),
          }
        } else {
          // Computer passes
          return {
            ...prev,
            turn: "player",
            phase: "draw",
            timeLeft: 30,
            battleLog: ["Computer passes their turn.", ...prev.battleLog].slice(0, 8),
          }
        }
      })
    }

    if (gameState.turn === "computer" && gameState.phase === "draw" && !gameState.gameOver) {
      // Computer draws a card
      const drawTimeout = setTimeout(() => {
        drawCard("computer")
      }, 1000)

      return () => clearTimeout(drawTimeout)
    }

    if (gameState.turn === "computer" && gameState.phase === "play" && !gameState.gameOver) {
      const computerTurnTimeout = setTimeout(() => {
        computerTurn()
      }, 1500)

      return () => clearTimeout(computerTurnTimeout)
    }
  }, [gameState.turn, gameState.phase, gameState.gameOver])

  // Battle phase
  useEffect(() => {
    if (gameState.phase === "battle" && gameState.player.field && gameState.computer.field) {
      const battleTimeout = setTimeout(() => {
        resolveBattle()
      }, 1500)

      return () => clearTimeout(battleTimeout)
    }
  }, [gameState.phase, gameState.player.field, gameState.computer.field])

  // Check for game over
  useEffect(() => {
    if (gameState.player.health <= 0 || gameState.computer.health <= 0) {
      setGameState((prev) => {
        if (prev.player.health <= 0) {
          return {
            ...prev,
            gameOver: true,
            winner: "computer",
            player: {
              ...prev.player,
              health: 0, // Ensure health doesn't go below 0
            },
          }
        } else if (prev.computer.health <= 0) {
          return {
            ...prev,
            gameOver: true,
            winner: "player",
            computer: {
              ...prev.computer,
              health: 0, // Ensure health doesn't go below 0
            },
          }
        }
        return prev
      })
    }
  }, [gameState.player.health, gameState.computer.health])

  // Scroll battle log to bottom when new messages are added
  useEffect(() => {
    if (battleLogRef.current) {
      battleLogRef.current.scrollTop = 0
    }
  }, [gameState.battleLog])

  // Draw a card
  const drawCard = (player: "player" | "computer") => {
    setGameState((prev) => {
      const playerState = prev[player] as typeof prev.player

      // Check if deck is empty
      if (playerState.deck.length === 0) {
        // In a real game, we would reshuffle the discard pile
        // For this demo, we'll just generate a new deck
        const newDeck = generateDeck(player, prev.settings.aiDifficulty)

        const updatedState: GameState = {
          ...prev,
          [player]: {
            ...playerState,
            deck: newDeck,
          },
          battleLog: [
            `${player === "player" ? "Your" : "Computer's"} deck is empty! Reshuffling discarded cards...`,
            ...prev.battleLog,
          ].slice(0, 8),
        }

        return updatedState
      }

      // Draw a card
      const newCard = playerState.deck[0]
      const updatedHand = [...playerState.hand, newCard]
      const updatedDeck = playerState.deck.slice(1)

      // Add energy each turn (max 10)
      let updatedEnergy = Math.min(playerState.energy + 1, 10)

      // Add extra energy from passive ability
      if (playerState.field && playerState.field.passive && playerState.field.passive.effect === "energyRegen") {
        updatedEnergy = Math.min(updatedEnergy + playerState.field.passive.value, 10)
      }

      // Increase power meter
      const updatedPower = Math.min(playerState.power + 10, 100)

      // Process status effects
      const { updatedHealth, updatedStatusEffects, effectsApplied, updatedBattleLog } =
        processStatusEffects<StatusEffect>(playerState.health, playerState.statusEffects, player, prev.battleLog)

      const newBattleLog = [
        `${player === "player" ? "You" : "Computer"} drew a card.${player === "player" ? " Play a card or pass your turn." : ""}`,
        ...updatedBattleLog,
      ].slice(0, 8)

      // Ensure health doesn't exceed 50
      const cappedHealth = Math.min(updatedHealth, 50)

      return {
        ...prev,
        [player]: {
          ...playerState,
          health: cappedHealth,
          energy: updatedEnergy,
          power: updatedPower,
          deck: updatedDeck,
          hand: updatedHand,
          statusEffects: updatedStatusEffects,
        },
        phase: "play",
        animation: effectsApplied ? "statusEffect" : prev.animation,
        battleLog: newBattleLog,
      }
    })

    // Clear status effect animation after delay
    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        animation: null,
      }))
    }, 1000)
  }

  // Process status effects
  const processStatusEffects = <T extends StatusEffect>(
    health: number,
    statusEffects: StatusEffect[],
    player: "player" | "computer",
    battleLog: string[],
  ): {
    updatedHealth: number
    updatedStatusEffects: StatusEffect[]
    effectsApplied: boolean
    updatedBattleLog: string[]
  } => {
    let updatedHealth = health
    const newEffects = [...statusEffects]
    let effectsApplied = false
    let updatedBattleLog = [...battleLog]

    // Apply damage from effects like poison or burn
    newEffects.forEach((effect) => {
      if (effect.type === "poison") {
        updatedHealth = Math.max(updatedHealth - (effect.value || 4), 0)
        updatedBattleLog = [
          `${player === "player" ? "You take" : "Computer takes"} ${effect.value || 4} damage from poison.`,
          ...updatedBattleLog,
        ].slice(0, 8)
        effectsApplied = true
      } else if (effect.type === "burn") {
        updatedHealth = Math.max(updatedHealth - (effect.value || 3), 0)
        updatedBattleLog = [
          `${player === "player" ? "You take" : "Computer takes"} ${effect.value || 3} damage from burn.`,
          ...updatedBattleLog,
        ].slice(0, 8)
        effectsApplied = true
      }

      // Reduce duration
      effect.duration--
    })

    // Remove expired effects
    const updatedEffects = newEffects.filter((effect) => effect.duration > 0)
    if (newEffects.length !== updatedEffects.length) {
      const expiredEffects = newEffects.filter((effect) => effect.duration <= 0)
      expiredEffects.forEach((effect) => {
        updatedBattleLog = [
          `${player === "player" ? "Your" : "Computer's"} ${effect.type} effect has worn off.`,
          ...updatedBattleLog,
        ].slice(0, 8)
      })
    }

    return {
      updatedHealth,
      updatedStatusEffects: updatedEffects,
      effectsApplied,
      updatedBattleLog,
    }
  }

  // Play a card
  const playCard = (card: CardType, player: "player" | "computer") => {
    setGameState((prev) => {
      const playerState = prev[player]
      const opponentState = prev[player === "player" ? "computer" : "player"]

      // Check if player has enough energy
      if (playerState.energy < card.energyCost) {
        if (player === "player") {
          toast({
            title: "Not enough energy!",
            description: `This card requires ${card.energyCost} energy. You have ${playerState.energy}.`,
            variant: "destructive",
          })
        }
        return prev
      }

      // Check if player is stunned
      if (playerState.statusEffects.some((effect) => effect.type === "stun")) {
        return {
          ...prev,
          turn: player === "player" ? "computer" : "player",
          phase: "draw",
          timeLeft: 30,
          battleLog: [
            `${player === "player" ? "You are" : "Computer is"} stunned and cannot play a card this turn.`,
            ...prev.battleLog,
          ].slice(0, 8),
        }
      }

      // Apply synergy bonuses if applicable
      let enhancedCard = card
      if (card.synergy) {
        // Check for synergy with cards in discard pile
        const cardsToCheck = [...playerState.discardPile]
        if (playerState.field) cardsToCheck.push(playerState.field)

        enhancedCard = applySynergies(card, cardsToCheck)
      }

      // Play the card
      const updatedHand = playerState.hand.filter((c) => c.id !== card.id)

      // Check if opponent has a card on the field
      const goToBattle = opponentState.field !== null

      return {
        ...prev,
        [player]: {
          ...playerState,
          field: enhancedCard,
          hand: updatedHand,
          energy: playerState.energy - card.energyCost,
          // Increment combo if playing multiple cards in a row
          combo: playerState.combo + 1,
        },
        phase: goToBattle ? "battle" : "play",
        turn: goToBattle ? prev.turn : player === "player" ? "computer" : "player",
        timeLeft: 30,
        battleLog: [
          `${player === "player" ? "You" : "Computer"} played ${card.name} (${card.type} type).`,
          ...(goToBattle ? ["Both players have played a card. Battle phase begins!"] : []),
          ...prev.battleLog,
        ].slice(0, 8),
      }
    })
  }

  // Resolve battle between cards
  const resolveBattle = () => {
    setGameState((prev) => {
      if (!prev.player.field || !prev.computer.field) return prev

      // Get cards with any enhancements
      const playerCard = prev.player.field
      const computerCard = prev.computer.field

      // Calculate type advantages
      const playerTypeMultiplier = calculateTypeAdvantage(playerCard.type, computerCard.type)
      const computerTypeMultiplier = calculateTypeAdvantage(computerCard.type, playerCard.type)

      // Check for critical hits
      const playerCritical = checkCriticalHit(playerCard)
      const computerCritical = checkCriticalHit(computerCard)

      // Calculate damage with all modifiers
      const playerDamage = calculateDamage(playerCard, computerCard, playerTypeMultiplier, playerCritical)

      const computerDamage = calculateDamage(computerCard, playerCard, computerTypeMultiplier, computerCritical)

      // Check for counter attacks
      const playerCounterDamage = processCounterAttack(playerCard)
      const computerCounterDamage = processCounterAttack(computerCard)

      // Calculate total damage
      const totalPlayerDamage = computerDamage + (playerCounterDamage > 0 ? playerCounterDamage : 0)
      const totalComputerDamage = playerDamage + (computerCounterDamage > 0 ? computerCounterDamage : 0)

      // Store battle result for display
      const battleResult: {
        playerDamage: number
        computerDamage: number
        playerAdvantage: boolean
        computerAdvantage: boolean
        criticalHit: "player" | "computer" | null
      } = {
        playerDamage: totalPlayerDamage,
        computerDamage: totalComputerDamage,
        playerAdvantage: playerTypeMultiplier > 1,
        computerAdvantage: computerTypeMultiplier > 1,
        criticalHit: playerCritical ? "player" : computerCritical ? "computer" : null,
      }

      // Create battle log messages
      const battleLogMessages = []

      // Type advantage messages
      if (playerTypeMultiplier > 1) {
        battleLogMessages.push(
          `Your ${playerCard.type} card is super effective against ${computerCard.type}! (${playerTypeMultiplier}x damage)`,
        )
      } else if (playerTypeMultiplier < 1) {
        battleLogMessages.push(
          `Your ${playerCard.type} card is not very effective against ${computerCard.type}. (${playerTypeMultiplier}x damage)`,
        )
      }

      if (computerTypeMultiplier > 1) {
        battleLogMessages.push(
          `Computer's ${computerCard.type} card is super effective against ${playerCard.type}! (${computerTypeMultiplier}x damage)`,
        )
      } else if (computerTypeMultiplier < 1) {
        battleLogMessages.push(
          `Computer's ${computerCard.type} card is not very effective against ${playerCard.type}. (${computerTypeMultiplier}x damage)`,
        )
      }

      // Critical hit messages
      if (playerCritical) {
        battleLogMessages.push("CRITICAL HIT! Your attack deals 1.5x damage!")
      }

      if (computerCritical) {
        battleLogMessages.push("CRITICAL HIT! Computer's attack deals 1.5x damage!")
      }

      // Counter attack messages
      if (playerCounterDamage > 0) {
        battleLogMessages.push(`Your card counters with ${playerCounterDamage} damage!`)
      }

      if (computerCounterDamage > 0) {
        battleLogMessages.push(`Computer's card counters with ${computerCounterDamage} damage!`)
      }

      // Damage dealt messages
      battleLogMessages.push(`You dealt ${totalComputerDamage} damage to the computer.`)
      battleLogMessages.push(`Computer dealt ${totalPlayerDamage} damage to you.`)

      return {
        ...prev,
        animation: "attack",
        battleResult,
        battleLog: [...battleLogMessages, ...prev.battleLog].slice(0, 8),
      }
    })

    // Apply damage after animation
    setTimeout(() => {
      setGameState((prev) => {
        if (!prev.battleResult || !prev.player.field || !prev.computer.field) return prev

        const { playerDamage, computerDamage } = prev.battleResult

        // Update health - ensure it doesn't go below 0
        const updatedPlayerHealth = Math.max(prev.player.health - playerDamage, 0)
        const updatedComputerHealth = Math.max(prev.computer.health - computerDamage, 0)

        // Move cards to discard pile
        const updatedPlayerDiscardPile = [...prev.player.discardPile, prev.player.field]
        const updatedComputerDiscardPile = [...prev.computer.discardPile, prev.computer.field]

        // Apply special effects
        const {
          playerStatusEffects,
          computerStatusEffects,
          playerHealth,
          computerHealth,
          playerEnergy,
          computerEnergy,
          playerPower,
          computerPower,
          effectMessages,
        } = applySpecialEffects(
          prev.player.field,
          prev.computer.field,
          updatedPlayerHealth,
          updatedComputerHealth,
          prev.player.statusEffects,
          prev.computer.statusEffects,
          prev.player.energy,
          prev.computer.energy,
          prev.player.power,
          prev.computer.power,
        )

        // Ensure health doesn't exceed 50
        const cappedPlayerHealth = Math.min(playerHealth, 50)
        const cappedComputerHealth = Math.min(computerHealth, 50)

        return {
          ...prev,
          player: {
            ...prev.player,
            health: cappedPlayerHealth,
            field: null,
            statusEffects: playerStatusEffects,
            discardPile: updatedPlayerDiscardPile,
            energy: playerEnergy,
            power: playerPower,
            combo: 0, // Reset combo after battle
          },
          computer: {
            ...prev.computer,
            health: cappedComputerHealth,
            field: null,
            statusEffects: computerStatusEffects,
            discardPile: updatedComputerDiscardPile,
            energy: computerEnergy,
            power: computerPower,
            combo: 0, // Reset combo after battle
          },
          animation: null,
          battleResult: null,
          turn: "player",
          phase: "draw",
          timeLeft: 30,
          battleLog: [...effectMessages, ...prev.battleLog].slice(0, 8),
        }
      })
    }, 2000)
  }

  // Apply special effects from cards
  const applySpecialEffects = (
    playerCard: CardType,
    computerCard: CardType,
    playerHealth: number,
    computerHealth: number,
    playerStatusEffects: StatusEffect[],
    computerStatusEffects: StatusEffect[],
    playerEnergy: number,
    computerEnergy: number,
    playerPower: number,
    computerPower: number,
  ) => {
    const updatedPlayerStatusEffects = [...playerStatusEffects]
    const updatedComputerStatusEffects = [...computerStatusEffects]
    let updatedPlayerHealth = playerHealth
    let updatedComputerHealth = computerHealth
    let updatedPlayerEnergy = playerEnergy
    let updatedComputerEnergy = computerEnergy
    let updatedPlayerPower = playerPower
    let updatedComputerPower = computerPower
    const effectMessages: string[] = []

    // Apply player card special effects
    if (playerCard.special) {
      switch (playerCard.special.effect) {
        case "stun":
          updatedComputerStatusEffects.push({
            type: "stun",
            duration: playerCard.special.value || 1,
          })
          effectMessages.push(`Your ${playerCard.name} stunned the computer for ${playerCard.special.value || 1} turn!`)
          break
        case "poison":
          updatedComputerStatusEffects.push({
            type: "poison",
            duration: 3,
            value: playerCard.special.value || 4,
          })
          effectMessages.push(
            `Your ${playerCard.name} poisoned the computer for 3 turns! (${playerCard.special.value || 4} damage per turn)`,
          )
          break
        case "burn":
          updatedComputerStatusEffects.push({
            type: "burn",
            duration: 2,
            value: playerCard.special.value || 3,
          })
          effectMessages.push(
            `Your ${playerCard.name} burned the computer for 2 turns! (${playerCard.special.value || 3} damage per turn)`,
          )
          break
        case "heal":
          updatedPlayerHealth = Math.min(updatedPlayerHealth + (playerCard.special.value || 12), 50) // Cap at 50
          effectMessages.push(`Your ${playerCard.name} healed you for ${playerCard.special.value || 12} health!`)
          break
        case "energyBoost":
          updatedPlayerEnergy = Math.min(updatedPlayerEnergy + (playerCard.special.value || 2), 10)
          effectMessages.push(`Your ${playerCard.name} gave you ${playerCard.special.value || 2} additional energy!`)
          break
        case "shield":
          updatedPlayerStatusEffects.push({
            type: "shield",
            duration: 1,
            value: playerCard.special.value || 5,
          })
          effectMessages.push(
            `Your ${playerCard.name} shielded you from ${playerCard.special.value || 5} damage for 1 turn!`,
          )
          break
        case "energyDrain":
          updatedComputerEnergy = Math.max(updatedComputerEnergy - (playerCard.special.value || 1), 0)
          effectMessages.push(
            `Your ${playerCard.name} drained ${playerCard.special.value || 1} energy from the computer!`,
          )
          break
        case "powerBoost":
          updatedPlayerPower = Math.min(updatedPlayerPower + (playerCard.special.value || 20), 100)
          effectMessages.push(`Your ${playerCard.name} boosted your power meter by ${playerCard.special.value || 20}%!`)
          break
      }
    }

    // Apply computer card special effects
    if (computerCard.special) {
      switch (computerCard.special.effect) {
        case "stun":
          updatedPlayerStatusEffects.push({
            type: "stun",
            duration: computerCard.special.value || 1,
          })
          effectMessages.push(
            `Computer's ${computerCard.name} stunned you for ${computerCard.special.value || 1} turn!`,
          )
          break
        case "poison":
          updatedPlayerStatusEffects.push({
            type: "poison",
            duration: 3,
            value: computerCard.special.value || 4,
          })
          effectMessages.push(
            `Computer's ${computerCard.name} poisoned you for 3 turns! (${computerCard.special.value || 4} damage per turn)`,
          )
          break
        case "burn":
          updatedPlayerStatusEffects.push({
            type: "burn",
            duration: 2,
            value: computerCard.special.value || 3,
          })
          effectMessages.push(
            `Computer's ${computerCard.name} burned you for 2 turns! (${computerCard.special.value || 3} damage per turn)`,
          )
          break
        case "heal":
          updatedComputerHealth = Math.min(updatedComputerHealth + (computerCard.special.value || 12), 50) // Cap at 50
          effectMessages.push(
            `Computer's ${computerCard.name} healed it for ${computerCard.special.value || 12} health!`,
          )
          break
        case "energyBoost":
          updatedComputerEnergy = Math.min(updatedComputerEnergy + (computerCard.special.value || 2), 10)
          effectMessages.push(
            `Computer's ${computerCard.name} gave it ${computerCard.special.value || 2} additional energy!`,
          )
          break
        case "shield":
          updatedComputerStatusEffects.push({
            type: "shield",
            duration: 1,
            value: computerCard.special.value || 5,
          })
          effectMessages.push(
            `Computer's ${computerCard.name} shielded it from ${computerCard.special.value || 5} damage for 1 turn!`,
          )
          break
        case "energyDrain":
          updatedPlayerEnergy = Math.max(updatedPlayerEnergy - (computerCard.special.value || 1), 0)
          effectMessages.push(
            `Computer's ${computerCard.name} drained ${computerCard.special.value || 1} energy from you!`,
          )
          break
        case "powerBoost":
          updatedComputerPower = Math.min(updatedComputerPower + (computerCard.special.value || 20), 100)
          effectMessages.push(
            `Computer's ${computerCard.name} boosted its power meter by ${computerCard.special.value || 20}%!`,
          )
          break
      }
    }

    return {
      playerStatusEffects: updatedPlayerStatusEffects,
      computerStatusEffects: updatedComputerStatusEffects,
      playerHealth: updatedPlayerHealth,
      computerHealth: updatedComputerHealth,
      playerEnergy: updatedPlayerEnergy,
      computerEnergy: updatedComputerEnergy,
      playerPower: updatedPlayerPower,
      computerPower: updatedComputerPower,
      effectMessages,
    }
  }

  // Reset game
  const resetGame = () => {
    setGameState((prev) => ({
      player: {
        health: 50,
        energy: 3,
        power: 0,
        deck: [],
        hand: [],
        field: null,
        statusEffects: [],
        discardPile: [],
        combo: 0,
      },
      computer: {
        health: 50,
        energy: 3,
        power: 0,
        deck: [],
        hand: [],
        field: null,
        statusEffects: [],
        discardPile: [],
        combo: 0,
      },
      turn: "player",
      phase: "setup",
      timeLeft: 30,
      gameOver: false,
      winner: null,
      battleLog: [],
      animation: null,
      battleResult: null,
      settings: prev.settings,
      tutorial: {
        active: false,
        step: "welcome",
        highlightElement: null,
      },
    }))
  }

  // Update AI difficulty
  const updateAIDifficulty = (difficulty: AIDifficulty) => {
    setGameState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        aiDifficulty: difficulty,
      },
    }))
  }

  // Toggle animations
  const toggleAnimations = () => {
    setGameState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        animationsEnabled: !prev.settings.animationsEnabled,
      },
    }))
  }

  // Handle tutorial step change
  const handleTutorialStepChange = (step: TutorialStep) => {
    setGameState((prev) => ({
      ...prev,
      tutorial: {
        ...prev.tutorial,
        step,
      },
    }))
  }

  // Complete tutorial
  const completeTutorial = () => {
    setGameState((prev) => ({
      ...prev,
      tutorial: {
        ...prev.tutorial,
        active: false,
      },
      settings: {
        ...prev.settings,
        tutorialCompleted: true,
      },
    }))
  }

  // Use special power
  const useSpecialPower = useCallback(
    (player: "player" | "computer") => {
      setGameState((prev) => {
        if (player === "player" && prev.player.power < 100) {
          toast({
            title: "Power meter not full!",
            description: "You need 100% power to use your special ability.",
            variant: "destructive",
          })
          return prev
        }

        if (player === "player") {
          // Player special power: Deal 10 damage and apply stun
          return {
            ...prev,
            computer: {
              ...prev.computer,
              health: Math.max(prev.computer.health - 10, 0),
              statusEffects: [...prev.computer.statusEffects, { type: "stun", duration: 1 }],
            },
            player: {
              ...prev.player,
              power: 0,
            },
            animation: "special",
            battleLog: [
              "You used your SPECIAL POWER! Dealt 10 damage and stunned the computer!",
              ...prev.battleLog,
            ].slice(0, 8),
          }
        } else if (prev.computer.power >= 100) {
          // Computer special power: Deal 10 damage and apply poison
          return {
            ...prev,
            player: {
              ...prev.player,
              health: Math.max(prev.player.health - 10, 0),
              statusEffects: [...prev.player.statusEffects, { type: "poison", duration: 2, value: 2 }],
            },
            computer: {
              ...prev.computer,
              power: 0,
            },
            animation: "special",
            battleLog: ["Computer used its SPECIAL POWER! Dealt 10 damage and poisoned you!", ...prev.battleLog].slice(
              0,
              8,
            ),
          }
        }

        return prev
      })

      // Clear animation after delay
      setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          animation: null,
        }))
      }, 1500)
    },
    [toast],
  )

  const handlePlayerPowerClick = () => {
    if (gameState.turn === "player" && gameState.player.power >= 100) {
      useSpecialPower("player")
    }
  }

  return (
    <div className="container mx-auto px-2 py-2 max-w-[1400px] min-h-screen overflow-auto flex flex-col bg-gradient-to-b from-emerald-100 to-green-200">
      {/* Animated Tutorial */}
      <AnimatedTutorial
        isOpen={gameState.tutorial.active}
        onClose={() => completeTutorial()}
        onComplete={() => completeTutorial()}
        currentStep={gameState.tutorial.step}
        onStepChange={handleTutorialStepChange}
      />

      {/* Type advantage guide dialog */}
      <Dialog open={showTypeGuide} onOpenChange={setShowTypeGuide}>
        <DialogContent className="bg-white border-indigo-700 text-indigo-100 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-700">Type Advantage Chart</DialogTitle>
          </DialogHeader>
          <TypeAdvantageGuide />
        </DialogContent>
      </Dialog>

      {/* Settings panel */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-indigo-950 border-indigo-700 text-indigo-800 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-pink-400">Game Settings</DialogTitle>
          </DialogHeader>
          <SettingsPanel
            settings={gameState.settings}
            onDifficultyChange={updateAIDifficulty}
            onToggleAnimations={toggleAnimations}
            onShowTutorial={() => {
              setShowSettings(false)
              setGameState((prev) => ({
                ...prev,
                tutorial: {
                  ...prev.tutorial,
                  active: true,
                  step: "welcome",
                },
              }))
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Game over overlay */}
      <GameOverScreen
        isOpen={gameState.gameOver}
        winner={gameState.winner}
        onPlayAgain={resetGame}
        playerHealth={gameState.player.health}
        computerHealth={gameState.computer.health}
      />

      {/* Card preview */}
      <CardPreview card={previewCard} onClose={() => setPreviewCard(null)} />

      {/* Game header with title and settings */}
      <div className="flex justify-between items-center bg-white p-2 rounded-lg shadow-md border border-emerald-200 mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center shadow-md mr-3">
            <Swords className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-emerald-800">
            DuelForge
          </h1>
        </div>
      </div>

      {/* Main game area - using grid for better layout control */}
      <div className="flex-1 grid grid-cols-12 gap-2 min-h-0">
        {/* Left sidebar - Game info */}
        <div className="col-span-3 flex flex-col gap-2 overflow-hidden">
          {/* Game phase indicator */}
          <div className="bg-white p-2 rounded-lg border border-emerald-200 shadow-md">
            <h3 className="text-sm font-semibold text-emerald-700 mb-2 uppercase tracking-wider">Game Status</h3>
            <GamePhaseIndicator phase={gameState.phase} turn={gameState.turn} timeLeft={gameState.timeLeft} />

            <div className="flex justify-between mt-3">
              <Button
                onClick={() => setShowTypeGuide(true)}
                variant="outline"
                size="sm"
                className="bg-green-200  text-green-700 shadow-md border border-green-300"
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                Type Chart
              </Button>

              <Button
                onClick={() => {
                  setGameState((prev) => ({
                    ...prev,
                    tutorial: {
                      ...prev.tutorial,
                      active: true,
                      step: "welcome",
                    },
                  }))
                }}
                variant="outline"
                size="sm"
                className="bg-green-200  text-green-700 shadow-md border border-green-300"
              >
                <Info className="h-4 w-4 mr-1" />
                Tutorial
              </Button>
            </div>
          </div>

          {/* Game controls */}
          <div className="bg-white p-2 rounded-lg border border-green-300 shadow-lg">
            <h3 className="text-sm font-semibold text-pink-400 mb-2 uppercase tracking-wider">Game Controls</h3>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white border border-green-300 flex items-center justify-center mr-2 shadow-md">
                    <span className="text-green-700 font-bold">{gameState.timeLeft}</span>
                  </div>
                  <div className="text-sm font-medium px-3 py-1 rounded-full bg-white text-green-700 shadow-md border border-green-300">
                    {gameState.turn === "player" ? "Your Turn" : "Computer's Turn"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                {gameState.turn === "player" && gameState.phase === "draw" && (
                  <Button
                    onClick={() => drawCard("player")}
                    className="bg-green-200  text-green-700 shadow-md border border-green-300"
                  >
                    Draw Card
                  </Button>
                )}

                {gameState.turn === "player" && gameState.phase === "play" && (
                  <Button
                    onClick={() => {
                      setGameState((prev) => ({
                        ...prev,
                        turn: "computer",
                        phase: "draw",
                        timeLeft: 30,
                        battleLog: ["You passed your turn.", ...prev.battleLog].slice(0, 8),
                      }))
                    }}
                    variant="outline"
                    className="bg-green-200  text-green-700 shadow-md border border-green-300"
                  >
                    Pass Turn
                  </Button>
                )}

                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="bg-green-200  text-green-700 shadow-md border border-green-300"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Restart Game
                </Button>
              </div>
            </div>
          </div>

          {/* Battle log - flex-1 to take remaining height */}
          <div className="flex-1 min-h-0">
            <BattleLog messages={gameState.battleLog} ref={battleLogRef} />
          </div>
        </div>

        {/* Center - Game board */}
        <div className="col-span-6 flex flex-col min-h-0">
          {/* Computer's side */}
          <div className="bg-white p-3 rounded-t-lg border border-emerald-200 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold mr-3 shadow-md border-2 border-emerald-400">
                  AI
                </div>
                <div>
                  <h3 className="font-semibold text-black text-base">
                    Computer ({gameState.settings.aiDifficulty})
                  </h3>
                  <div className="flex items-center">
                    <HealthBar current={gameState.computer.health} max={50} player="computer" />
                    <span className="ml-2 text-sm text-black">{gameState.computer.health}/50</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <GameTooltip content="Energy is used to play cards. Computer gains 1 energy each turn.">
                  <div>
                    <EnergyMeter energy={gameState.computer.energy} maxEnergy={10} />
                  </div>
                </GameTooltip>

                <GameTooltip content="Power meter fills by 10% each turn. At 100%, the computer can use a special ability.">
                  <div>
                    <PowerMeter power={gameState.computer.power} maxPower={100} player="computer" />
                  </div>
                </GameTooltip>

                <StatusEffects effects={gameState.computer.statusEffects} />
              </div>
            </div>

            {/* Computer's hand */}
            <ComputerHand cardCount={gameState.computer.hand.length} />

            {/* Computer's field */}
            <div className="flex justify-center mb-2 h-36 relative ">
              {gameState.computer.field ? (
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative">
                  <Card
                    card={gameState.computer.field}
                    isPlayable={false}
                    isActive={gameState.phase === "battle"}
                    hasAdvantage={gameState.battleResult?.computerAdvantage || false}
                    onHover={() => setPreviewCard(gameState.computer.field)}
                    onLeave={() => setPreviewCard(null)}
                  />

                  {gameState.animation === "attack" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5 }}
                      className="absolute inset-0 bg-emerald-500/30 rounded-md flex items-center justify-center"
                    >
                      <span className="text-white font-bold text-2xl">ATTACK!</span>
                    </motion.div>
                  )}

                  {gameState.animation === "special" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5 }}
                      className="absolute inset-0 bg-green-500/50 rounded-md flex items-center justify-center"
                    >
                      <span className="text-white font-bold text-2xl">SPECIAL!</span>
                    </motion.div>
                  )}

                  {gameState.battleResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-8 left-0 right-0 text-center"
                    >
                      <span
                        className={`font-bold ${gameState.battleResult.computerDamage > 0 ? "text-rose-500" : "text-indigo-400"}`}
                      >
                        {gameState.battleResult.computerDamage > 0
                          ? `-${gameState.battleResult.computerDamage}`
                          : "Blocked!"}
                      </span>
                    </motion.div>
                  )}

                  {/* Critical hit indicator */}
                  {gameState.battleResult?.criticalHit === "computer" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.2, 1], opacity: [0, 1] }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 px-2 py-1 rounded-md shadow-md"
                    >
                      <span className="text-xs font-bold text-white">CRITICAL!</span>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="w-28 h-36 border-2 border-dashed border-emerald-300 rounded-md flex items-center justify-center bg-emerald-50">
  <span className="text-emerald-500 text-sm">No Card</span>
</div>
              )}

              {/* Battle indicator */}
              {gameState.phase === "battle" && gameState.player.field && gameState.computer.field && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                >
                  <div className="text-2xl font-bold text-pink-500 bg-indigo-900/80 px-4 py-2 rounded-full backdrop-blur-sm border border-pink-500/50">
                    VS
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Battle arena divider */}
         <div className="h-3 bg-gradient-to-r from-emerald-400 to-green-500 relative">
  <div className="absolute inset-0 bg-white/20"></div>
</div>

          {/* Player's side */}
          <div className="bg-white p-3 rounded-b-lg border border-indigo-600 shadow-lg flex-1 flex flex-col">
            {/* Player's field */}
            <div className="flex justify-center mb-2 h-36 relative">
              {gameState.player.field ? (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative">
                  <Card
                    card={gameState.player.field}
                    isPlayable={false}
                    isActive={gameState.phase === "battle"}
                    hasAdvantage={gameState.battleResult?.playerAdvantage || false}
                    onHover={() => setPreviewCard(gameState.player.field)}
                    onLeave={() => setPreviewCard(null)}
                  />

                  {gameState.animation === "attack" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5 }}
                      className="absolute inset-0 bg-pink-500/30 rounded-md flex items-center justify-center"
                    >
                      <span className="text-white font-bold text-2xl">ATTACK!</span>
                    </motion.div>
                  )}

                  {gameState.animation === "special" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5 }}
                      className="absolute inset-0 bg-purple-500/50 rounded-md flex items-center justify-center"
                    >
                      <span className="text-white font-bold text-2xl">SPECIAL!</span>
                    </motion.div>
                  )}

                  {gameState.battleResult && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-8 left-0 right-0 text-center"
                    >
                      <span
                        className={`font-bold ${gameState.battleResult.playerDamage > 0 ? "text-rose-500" : "text-indigo-400"}`}
                      >
                        {gameState.battleResult.playerDamage > 0
                          ? `-${gameState.battleResult.playerDamage}`
                          : "Blocked!"}
                      </span>
                    </motion.div>
                  )}

                  {/* Critical hit indicator */}
                  {gameState.battleResult?.criticalHit === "player" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.2, 1], opacity: [0, 1] }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 px-2 py-1 rounded-md shadow-md"
                    >
                      <span className="text-xs font-bold text-white">CRITICAL!</span>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="w-28 h-36 border-2 border-dashed border-emerald-300 rounded-md flex items-center justify-center bg-emerald-50">
  <span className="text-emerald-500 text-sm">No Card</span>
</div>
              )}
            </div>

            {/* Player controls and hand container */}
            <div className="flex flex-col flex-1 justify-end">
              {/* Player's hand - with draw card button integrated */}
              <div className="flex items-center justify-center mb-2">
                {/* {gameState.turn === "player" && gameState.phase === "draw" && (
                  <Button
                    onClick={() => drawCard("player")}
                    className="bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-500 hover:to-purple-600 text-white shadow-md border border-pink-500/50 absolute z-10 top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    Draw Card
                  </Button>
                )} */}
                <div className="w-full">
                  <PlayerHand
                    cards={gameState.player.hand}
                    isPlayable={gameState.turn === "player" && gameState.phase === "play"}
                    onCardClick={(card) => playCard(card, "player")}
                    onCardHover={setPreviewCard}
                    playerEnergy={gameState.player.energy}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3 shadow-lg border-2 border-pink-400">
                    P1
                  </div>
                  <div>
                    <h3 className="font-semibold text-black text-base">You</h3>
                    <div className="flex items-center">
                      <HealthBar current={gameState.player.health} max={50} player="player" />
                      <span className="ml-2 text-sm text-black">{gameState.player.health}/50</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <StatusEffects effects={gameState.player.statusEffects} />

                  <GameTooltip content="Power meter fills by 10% each turn. At 100%, click to use your special ability: Deal 10 damage and stun your opponent!">
                    <div>
                      <PowerMeter
                        power={gameState.player.power}
                        maxPower={100}
                        player="player"
                        onClick={handlePlayerPowerClick}
                        isUsable={gameState.turn === "player" && gameState.player.power >= 100}
                      />
                    </div>
                  </GameTooltip>

                  <GameTooltip content="Energy is used to play cards. You gain 1 energy each turn.">
                    <div>
                      <EnergyMeter energy={gameState.player.energy} maxEnergy={10} />
                    </div>
                  </GameTooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar - Card info and stats */}
        <div className="col-span-3 flex flex-col gap-2 overflow-hidden">
          {/* Card stats and info */}
          <div className="bg-white p-2 rounded-lg border border-emerald-200 shadow-md">
            <h3 className="text-sm font-semibold text-emerald-700 mb-2 uppercase tracking-wider">Card Stats</h3>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <div className="flex items-center mb-1">
                    <Swords className="h-4 w-4 text-emerald-600 mr-1" />
                    <span className="text-sm font-medium text-emerald-700">Attack Types</span>
                  </div>
                  <div className="text-xs text-emerald-600">
                    Cards deal damage based on their attack value and type advantage.
                  </div>
                </div>

                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <div className="flex items-center mb-1">
                    <Shield className="h-4 w-4 text-emerald-600 mr-1" />
                    <span className="text-sm font-medium text-emerald-700">Defense</span>
                  </div>
                  <div className="text-xs text-emerald-600">
                    Defense reduces incoming damage from opponent's attacks.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deck information - flex-1 to take remaining space */}
          <div className="flex-1 bg-white p-2 rounded-lg border border-emerald-200 shadow-md min-h-0">
            <h3 className="text-sm font-semibold text-emerald-700 mb-2 uppercase tracking-wider">Deck Status</h3>

            <div className="space-y-2 overflow-auto">
              <div className="flex justify-between items-center">
                <span className="text-sm text-emerald-600">Your Deck:</span>
                <span className="text-sm font-medium text-emerald-700">{gameState.player.deck.length} cards</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-emerald-600">Your Hand:</span>
                <span className="text-sm font-medium text-emerald-700">{gameState.player.hand.length} cards</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-emerald-600">Discard Pile:</span>
                <span className="text-sm font-medium text-emerald-700">{gameState.player.discardPile.length} cards</span>
              </div>

              <div className="h-1 bg-emerald-200 rounded-full my-2"></div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-emerald-600">Computer's Deck:</span>
                <span className="text-sm font-medium text-emerald-700">{gameState.computer.deck.length} cards</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-emerald-600">Computer's Hand:</span>
                <span className="text-sm font-medium text-emerald-700">{gameState.computer.hand.length} cards</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
