"use client"

import { motion } from "framer-motion"

interface TurnTimerProps {
  timeLeft: number
  maxTime: number
}

export function TurnTimer({ timeLeft, maxTime }: TurnTimerProps) {
  const percentage = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100))

  const timerColor =
    percentage > 60
      ? "bg-gradient-to-r from-green-400 to-green-500"
      : percentage > 30
        ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
        : "bg-gradient-to-r from-red-400 to-red-500"

  return (
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-2 shadow-sm">
        <span className="text-gray-800 font-bold">{timeLeft}</span>
      </div>
      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className={timerColor}
          style={{ width: `${percentage}%`, height: "100%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}
