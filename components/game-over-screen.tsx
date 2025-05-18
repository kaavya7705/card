"use client"
import { motion } from "framer-motion"
import { Trophy, XCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"
import { useEffect } from "react"

interface GameOverScreenProps {
  isOpen: boolean
  winner: "player" | "computer" | null
  onPlayAgain: () => void
  playerHealth: number
  computerHealth: number
}

export function GameOverScreen({ isOpen, winner, onPlayAgain, playerHealth, computerHealth }: GameOverScreenProps) {
  useEffect(() => {
    if (isOpen && winner === "player") {
      // Trigger confetti animation for player victory
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [isOpen, winner])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-lg border-2 border-slate-600 shadow-xl max-w-md w-full"
      >
        {winner === "player" ? (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 border-4 border-cyan-400">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Victory!
            </h2>
            <p className="text-slate-300 mb-6">
              Congratulations! You have defeated your opponent with your strategic card play!
            </p>
            <div className="flex justify-between items-center mb-6 px-4">
              <div className="text-center">
                <div className="text-sm text-slate-400">Your Health</div>
                <div className="text-xl font-bold text-green-500">{playerHealth}/50</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400">Computer Health</div>
                <div className="text-xl font-bold text-rose-500">{computerHealth}/50</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-4 border-4 border-rose-400">
              <XCircle className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">
              Defeat
            </h2>
            <p className="text-slate-300 mb-6">
              You've been defeated this time. Study your opponent's strategy and try again!
            </p>
            <div className="flex justify-between items-center mb-6 px-4">
              <div className="text-center">
                <div className="text-sm text-slate-400">Your Health</div>
                <div className="text-xl font-bold text-rose-500">{playerHealth}/50</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400">Computer Health</div>
                <div className="text-xl font-bold text-green-500">{computerHealth}/50</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={onPlayAgain}
            className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white shadow-md border border-cyan-500/50"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
