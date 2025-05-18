"use client"
import type { GamePhase } from "@/lib/types"
import { Clock, Sword, Wand2, Hourglass, Sparkles } from "lucide-react"

interface GamePhaseIndicatorProps {
  phase: GamePhase
  turn: "player" | "computer"
  timeLeft: number
}

export function GamePhaseIndicator({ phase, turn, timeLeft }: GamePhaseIndicatorProps) {
  const phaseIcons = {
    setup: <Sparkles className="h-4 w-4" />,
    draw: <Wand2 className="h-4 w-4" />,
    play: <Hourglass className="h-4 w-4" />,
    battle: <Sword className="h-4 w-4" />,
    end: <Clock className="h-4 w-4" />,
    tutorial: <Sparkles className="h-4 w-4" />,
  }

  const phaseColors = {
    setup: "bg-emerald-50 text-emerald-700 border-emerald-200",
    draw: "bg-emerald-100/50 text-emerald-700 border-emerald-300",
    play: "bg-emerald-50 text-emerald-700 border-emerald-200",
    battle: "bg-emerald-100/50 text-emerald-700 border-emerald-300",
    end: "bg-emerald-50 text-emerald-700 border-emerald-200",
    tutorial: "bg-emerald-50 text-emerald-700 border-emerald-200",
  }

  const phaseDescriptions = {
    setup: "Setting up the game...",
    draw: turn === "player" ? "Draw a card to begin your turn" : "Computer is drawing a card",
    play: turn === "player" ? "Play a card from your hand or pass" : "Computer is deciding which card to play",
    battle: "Cards are battling!",
    end: "Game over",
    tutorial: "Tutorial mode active",
  }

  return (
    <div className="space-y-3">
      <div className={`px-3 py-2 rounded-md ${phaseColors[phase]} font-medium text-sm border flex items-center`}>
        <span className="mr-2">{phaseIcons[phase]}</span>
        {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
      </div>

      <div className="text-sm text-emerald-600">{phaseDescriptions[phase]}</div>

      {phase === "play" && turn === "player" && (
        <div className="text-xs text-emerald-500 mt-1 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {timeLeft > 0 ? `${timeLeft} seconds remaining` : "Time's up!"}
        </div>
      )}
    </div>
  )
}
