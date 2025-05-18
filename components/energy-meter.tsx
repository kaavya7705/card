"use client"

import { motion } from "framer-motion"

interface EnergyMeterProps {
  energy: number
  maxEnergy: number
}

export function EnergyMeter({ energy, maxEnergy }: EnergyMeterProps) {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center space-x-0.5">
        {Array.from({ length: maxEnergy }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className={`w-2 h-5 rounded-sm ${
              index < energy
                ? "bg-gradient-to-b from-yellow-300 to-amber-500 shadow-md shadow-amber-900/20"
                : "bg-slate-600"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-slate-300 ml-1">
        {energy}/{maxEnergy}
      </span>
    </div>
  )
}
