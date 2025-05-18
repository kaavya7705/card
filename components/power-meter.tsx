"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PowerMeterProps {
  power: number
  maxPower: number
  player: "player" | "computer"
  onClick?: () => void
  isUsable?: boolean
}

export function PowerMeter({ power, maxPower, player, onClick, isUsable = false }: PowerMeterProps) {
  const percentage = Math.max(0, Math.min(100, (power / maxPower) * 100))

  const playerColor =
    player === "player"
      ? "#0ea5e9" // sky-500
      : "#f43f5e" // rose-500

  return (
    <div
      className={cn(
        "relative w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center shadow-md",
        isUsable && "cursor-pointer hover:ring-2 hover:ring-cyan-300",
      )}
      onClick={isUsable ? onClick : undefined}
    >
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#475569" // slate-600
          strokeWidth="3"
          strokeDasharray="100, 100"
        />
        <motion.path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={playerColor}
          strokeWidth="3"
          strokeDasharray={`${percentage}, 100`}
          initial={{ strokeDasharray: "0, 100" }}
          animate={{ strokeDasharray: `${percentage}, 100` }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-200 font-bold">
        {power === maxPower ? "⚡" : `${Math.floor(percentage)}%`}
      </span>

      {isUsable && (
        <motion.div
          className="absolute inset-0 rounded-full bg-cyan-500/20"
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
    </div>
  )
}
