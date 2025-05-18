"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { StatusEffect } from "@/lib/types"
import { Zap, Skull, Flame, Shield, Battery, Sparkles } from "lucide-react"
import { GameTooltip } from "./game-tooltip"

interface StatusEffectsProps {
  effects: StatusEffect[]
}

export function StatusEffects({ effects }: StatusEffectsProps) {
  if (effects.length === 0) return null

  const effectIcons = {
    stun: <Zap className="h-3 w-3 text-white" />,
    poison: <Skull className="h-3 w-3 text-white" />,
    burn: <Flame className="h-3 w-3 text-white" />,
    shield: <Shield className="h-3 w-3 text-white" />,
    energyDrain: <Battery className="h-3 w-3 text-white" />,
    powerBoost: <Sparkles className="h-3 w-3 text-white" />,
  }

  const effectColors = {
    stun: "bg-gradient-to-br from-amber-400 to-yellow-500",
    poison: "bg-gradient-to-br from-emerald-500 to-green-600",
    burn: "bg-gradient-to-br from-rose-500 to-red-600",
    shield: "bg-gradient-to-br from-sky-500 to-blue-600",
    energyDrain: "bg-gradient-to-br from-violet-500 to-purple-600",
    powerBoost: "bg-gradient-to-br from-emerald-500 to-green-600",
  }

  const effectDescriptions = {
    stun: "Stunned: Skip next turn",
    poison: (effect: StatusEffect) =>
      `Poisoned: Take ${effect.value || 4} damage per turn for ${effect.duration} turns`,
    burn: (effect: StatusEffect) => `Burned: Take ${effect.value || 3} damage per turn for ${effect.duration} turns`,
    shield: (effect: StatusEffect) => `Shielded: Reduce damage by ${effect.value || 5} for ${effect.duration} turns`,
    energyDrain: "Energy Drained: -1 energy next turn",
    powerBoost: "Power Boosted: Gain extra power next turn",
  }

  return (
    <div className="flex space-x-1">
      <AnimatePresence>
        {effects.map((effect, index) => (
          <GameTooltip
            key={`${effect.type}-${index}`}
            content={
              typeof effectDescriptions[effect.type] === "function"
                ? (effectDescriptions[effect.type] as (effect: StatusEffect) => string)(effect)
                : effectDescriptions[effect.type] as string
            }
          >
            <motion.div
              className={`w-6 h-6 rounded-full ${effectColors[effect.type]} flex items-center justify-center shadow-sm border border-white/20`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              {effectIcons[effect.type]}
              <span className="absolute -bottom-1 -right-1 bg-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-emerald-800 font-bold border border-emerald-200 shadow-sm">
                {effect.duration}
              </span>
            </motion.div>
          </GameTooltip>
        ))}
      </AnimatePresence>
    </div>
  )
}
