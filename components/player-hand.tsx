"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/card"
import type { Card as CardType } from "@/lib/types"

interface PlayerHandProps {
  cards: CardType[]
  isPlayable: boolean
  onCardClick: (card: CardType) => void
  onCardHover: (card: CardType | null) => void
  playerEnergy: number
}

export function PlayerHand({ cards, isPlayable, onCardClick, onCardHover, playerEnergy }: PlayerHandProps) {
  return (
    <div className="relative w-full">
      {/* Hand visual effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[500px] h-[150px] bg-gradient-to-t from-emerald-100/30 to-transparent rounded-t-[250px] z-0"></div>

      {/* Cards in hand */}
      <div className="relative z-20 flex justify-center">
        <div className="flex justify-center items-center bg-white/5 rounded-t-xl px-4 py-2">
          <AnimatePresence>
            {cards.map((card, index) => {
              // Calculate the fan effect - more cards means less spread
              const spreadFactor = Math.min(8, 15 / cards.length)
              const rotateAngle = (index - Math.floor(cards.length / 2)) * spreadFactor
              const xOffset = (index - Math.floor(cards.length / 2)) * 15

              return (
                <motion.div
                  key={card.id}
                  initial={{ y: 20, opacity: 0, rotateZ: rotateAngle }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    rotateZ: rotateAngle,
                    x: xOffset,
                  }}
                  exit={{ y: -20, opacity: 0 }}
                  whileHover={{ 
                    y: -20, 
                    scale: 1.1, 
                    rotateZ: 0, 
                    zIndex: 30,
                    transition: { 
                      duration: 0.2,
                      ease: "easeOut"
                    }
                  }}
                  style={{
                    transformOrigin: "bottom center",
                    zIndex: index,
                    marginLeft: index > 0 ? "-50px" : "0", // Overlap cards more to save space
                  }}
                >
                  <div className="relative">
                    <Card
                      card={card}
                      onClick={() => isPlayable && playerEnergy >= card.energyCost && onCardClick(card)}
                      isPlayable={isPlayable && playerEnergy >= card.energyCost}
                      onHover={() => onCardHover(card)}
                      onLeave={() => onCardHover(null)}
                    />
                    {isPlayable && playerEnergy < card.energyCost && (
                      <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                        <span className="text-xs text-white font-medium px-2 py-1 bg-red-500/80 rounded">
                          Not enough energy
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Empty hand message */}
      {cards.length === 0 && (
        <div className="flex justify-center items-center h-36">
          <div className="text-emerald-600 text-sm bg-emerald-50 px-4 py-2 rounded-md border border-emerald-200">
            Your hand is empty. Draw a card!
          </div>
        </div>
      )}
    </div>
  )
}
