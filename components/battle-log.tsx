"use client"
import { forwardRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface BattleLogProps {
  messages: string[]
}

export const BattleLog = forwardRef<HTMLDivElement, BattleLogProps>(({ messages }, ref) => {
  return (
    <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-md h-full">
      <h3 className="text-sm font-semibold text-emerald-700 mb-2 uppercase tracking-wider flex items-center">
        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
        Battle Log
      </h3>
      <div
        ref={ref}
        className="space-y-1 overflow-y-auto h-[calc(100%-28px)] pr-1 scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-emerald-100"
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={`${message}-${index}`}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-emerald-700 py-1.5 px-3 rounded-md even:bg-emerald-50"
            >
              {message}
            </motion.div>
          ))}
        </AnimatePresence>
        {messages.length === 0 && (
          <div className="text-sm text-emerald-500 italic py-2 px-3">Game events will appear here...</div>
        )}
      </div>
    </div>
  )
})

BattleLog.displayName = "BattleLog"
