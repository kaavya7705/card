"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HealthBarProps {
  current: number
  max: number
  player: "player" | "computer"
}

export function HealthBar({ current, max, player }: HealthBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100))

  const healthColor =
    percentage > 60
      ? "bg-gradient-to-r from-emerald-400 to-green-500"
      : percentage > 30
        ? "bg-gradient-to-r from-amber-400 to-yellow-500"
        : "bg-gradient-to-r from-rose-400 to-red-500"

  return (
    <div className="w-32 h-3 bg-slate-700 rounded-full overflow-hidden shadow-inner border border-slate-600">
      <motion.div
        className={cn("h-full rounded-full", healthColor, player === "player" ? "origin-left" : "origin-right")}
        style={{ width: `${percentage}%` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  )
}
