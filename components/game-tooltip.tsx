"use client"
import { type ReactNode, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface GameTooltipProps {
  children: ReactNode
  content: ReactNode
}

export function GameTooltip({ children, content }: GameTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 rounded-md shadow-lg border border-slate-600 text-xs text-slate-200"
          >
            {content}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800 border-r border-b border-slate-600"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
