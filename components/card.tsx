"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { CardType, CardRarity } from "@/lib/types"
import { Zap, Flame, Snowflake, Droplets, Leaf, Wind, Shield, Battery, Sparkles } from "lucide-react"
import { useState } from "react"
import type { JSX } from "react/jsx-runtime"

interface CardProps {
  card: {
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
      effect: string
      value?: number
    }
    synergy?: {
      type: CardType
      bonus: string
      value: number
    }
    passive?: {
      effect: string
      value: number
    }
  }
  onClick?: () => void
  isPlayable?: boolean
  isActive?: boolean
  hasAdvantage?: boolean
  onHover?: () => void
  onLeave?: () => void
  showDetails?: boolean
  onMouseMove?: (event: React.MouseEvent) => void
}

export function Card({
  card,
  onClick,
  isPlayable = true,
  isActive = false,
  hasAdvantage = false,
  onHover,
  onLeave,
  showDetails = false,
  onMouseMove,
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Card type colors
  const typeColors = {
    fire: "from-red-500 to-orange-500",
    ice: "from-blue-400 to-cyan-500",
    electric: "from-yellow-400 to-amber-500",
    water: "from-blue-500 to-sky-500",
    earth: "from-green-600 to-emerald-500",
    wind: "from-teal-400 to-cyan-500",
  }

  // Card rarity styles
  const rarityStyles = {
    common: "border-indigo-400 bg-gradient-to-b from-indigo-200 to-indigo-300 shadow-md",
    uncommon: "border-green-400 bg-gradient-to-b from-green-50 to-green-100 shadow-md shadow-green-900/10",
    rare: "border-blue-400 bg-gradient-to-b from-blue-50 to-blue-100 shadow-md shadow-blue-900/10",
    epic: "border-purple-400 bg-gradient-to-b from-purple-50 to-purple-100 shadow-lg shadow-purple-900/20",
    legendary: "border-pink-400 bg-gradient-to-b from-pink-50 to-pink-100 shadow-xl shadow-pink-900/30",
  }

  // Card type icons
  const typeIcons = {
    fire: <Flame className="h-4 w-4 text-red-500" />,
    ice: <Snowflake className="h-4 w-4 text-blue-500" />,
    electric: <Zap className="h-4 w-4 text-yellow-500" />,
    water: <Droplets className="h-4 w-4 text-blue-500" />,
    earth: <Leaf className="h-4 w-4 text-green-500" />,
    wind: <Wind className="h-4 w-4 text-teal-500" />,
  }

  // Special effect icons
  const specialIcons: Record<string, JSX.Element> = {
    stun: <Zap className="h-3 w-3 text-yellow-500" />,
    poison: <Leaf className="h-3 w-3 text-green-500" />,
    burn: <Flame className="h-3 w-3 text-red-500" />,
    heal: <Sparkles className="h-3 w-3 text-pink-500" />,
    energyBoost: <Battery className="h-3 w-3 text-yellow-500" />,
    shield: <Shield className="h-3 w-3 text-blue-500" />,
    energyDrain: <Battery className="h-3 w-3 text-purple-500" />,
    powerBoost: <Sparkles className="h-3 w-3 text-indigo-500" />,
    doubleAttack: <Zap className="h-3 w-3 text-orange-500" />,
  }

  // Animation for legendary cards
  const legendaryAnimation =
    card.rarity === "legendary"
      ? {
          animate: {
            boxShadow: [
              "0 0 5px 2px rgba(236, 72, 153, 0.2)",
              "0 0 15px 5px rgba(236, 72, 153, 0.4)",
              "0 0 5px 2px rgba(236, 72, 153, 0.2)",
            ],
            transition: {
              duration: 2,
              repeat: Infinity, // Use Infinity instead of Number.POSITIVE_INFINITY
            },
          },
        }
      : {}

  // Special effect descriptions
  const getSpecialDescription = (effect: string, value?: number) => {
    switch (effect) {
      case "stun":
        return "Stuns opponent for 1 turn"
      case "poison":
        return `Deals ${value || 4} damage for 3 turns`
      case "burn":
        return `Deals ${value || 3} damage for 2 turns`
      case "heal":
        return `Heals ${value || 12} health points`
      case "energyBoost":
        return `Gain ${value || 2} energy points`
      case "shield":
        return `Reduces damage by ${value || 5} for 1 turn`
      case "energyDrain":
        return `Drains ${value || 1} energy from opponent`
      case "powerBoost":
        return `Gain ${value || 20}% power meter`
      case "doubleAttack":
        return "Deals double damage"
      default:
        return "Special effect"
    }
  }

  // Passive effect descriptions
  const getPassiveDescription = (effect: string, value: number) => {
    switch (effect) {
      case "criticalChance":
        return `${value}% chance for critical hit`
      case "counterAttack":
        return `Counter with ${value} damage when attacked`
      case "energyRegen":
        return `Gain ${value} extra energy per turn`
      case "damageReduction":
        return `Reduce all damage by ${value}`
      default:
        return "Passive effect"
    }
  }

  return (
    <motion.div
      className={cn(
        "w-24 h-32 rounded-lg overflow-hidden border-2 relative z-10",
        "hover:z-50", // Add this to ensure hovered card appears above others
        isPlayable ? "cursor-pointer" : "cursor-default",
        !isPlayable && "opacity-90",
        isActive && "ring-2 ring-pink-500",
        hasAdvantage && "ring-2 ring-green-500",
        rarityStyles[card.rarity],
      )}
      onClick={isPlayable ? onClick : undefined}
      initial={{ scale: 1 }}
      whileHover={{
        scale: 1.5,
        transition: { duration: 0.2 },
        zIndex: 50,
      }}
      whileTap={isPlayable ? { scale: 0.95 } : {}}
      {...legendaryAnimation}
    >
      {/* Card header */}
      <div className={`bg-gradient-to-r ${typeColors[card.type]} p-1 flex justify-between items-center`}>
        <span className="font-bold text-white text-xs truncate drop-shadow-md">{card.name}</span>
        <span className="text-xs bg-white/90 text-amber-800 rounded-full px-1 py-0.5 font-medium shadow-sm">
          {card.energyCost}⚡
        </span>
      </div>

      {/* Card body */}
      <div className="p-1 flex flex-col justify-between h-[calc(100%-1.5rem)]">
        {/* Card type */}
        <div className="flex justify-center items-center mb-1 bg-indigo-100 rounded-md py-0.5 shadow-sm">
          <span className="mr-1">{typeIcons[card.type]}</span>
          <span className="text-xs text-indigo-700 capitalize font-medium">{card.type}</span>
        </div>

        {/* Card stats */}
        <div className="grid grid-cols-2 gap-1 mb-1">
          <div className="bg-red-50 rounded-md px-1 py-0.5 text-center shadow-sm border border-red-200">
            <span className="text-xs text-red-600 font-medium">ATK</span>
            <div className="font-bold text-red-700 text-xs">{card.attack}</div>
          </div>
          <div className="bg-blue-50 rounded-md px-1 py-0.5 text-center shadow-sm border border-blue-200">
            <span className="text-xs text-blue-600 font-medium">DEF</span>
            <div className="font-bold text-blue-700 text-xs">{card.defense}</div>
          </div>
        </div>

        {/* Card special */}
        {card.special && (
          <div className="bg-purple-50 rounded-md px-1 py-0.5 text-center mt-1 shadow-sm border border-purple-200 relative">
            <div className="flex items-center justify-center">
              {specialIcons[card.special.effect] && <span className="mr-1">{specialIcons[card.special.effect]}</span>}
              <span className="text-xs text-purple-700 font-medium truncate">{card.special.name}</span>
            </div>
          </div>
        )}

        {/* Card rarity */}
        <div className="flex justify-end">
          <span
            className={cn(
              "text-xs px-1 py-0.5 rounded-full font-medium",
              card.rarity === "common" && "text-indigo-600 bg-indigo-100",
              card.rarity === "uncommon" && "text-green-700 bg-green-100",
              card.rarity === "rare" && "text-blue-700 bg-blue-100",
              card.rarity === "epic" && "text-purple-700 bg-purple-100",
              card.rarity === "legendary" && "text-pink-700 bg-pink-100",
            )}
          >
            {card.rarity.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Keep only essential animations and effects */}
      {card.rarity === "legendary" && (
        <motion.div
          className="absolute inset-0 bg-pink-500/10 pointer-events-none"
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity, // Use Infinity instead of Number.POSITIVE_INFINITY
            repeatType: "reverse",
          }}
        />
      )}
    </motion.div>
  )
}
