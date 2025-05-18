"use client"

import { motion } from "framer-motion"

interface ComputerHandProps {
  cardCount: number
}

export function ComputerHand({ cardCount }: ComputerHandProps) {
  return (
    <div className="relative w-full">
      {/* Hand visual effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[500px] h-[150px] bg-gradient-to-t from-emerald-100/30 to-transparent rounded-b-[250px] z-0"></div>

      {/* Cards in hand */}
      <div className="relative z-20 flex justify-center">
        <div className="flex justify-center items-center">
          {Array.from({ length: cardCount }).map((_, index) => {
            // Calculate the fan effect - more cards means less spread
            const spreadFactor = Math.min(10, 20 / cardCount)
            const rotateAngle = (index - Math.floor(cardCount / 2)) * spreadFactor
            const xOffset = (index - Math.floor(cardCount / 2)) * 20

            return (
              <motion.div
                key={index}
                className="w-14 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-md border-2 border-emerald-400/50 flex items-center justify-center shadow-md"
                initial={{ opacity: 0, y: -20, rotateZ: rotateAngle }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotateZ: rotateAngle,
                  x: xOffset,
                }}
                whileHover={{ y: 5 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                style={{
                  transformOrigin: "top center",
                  zIndex: index,
                  marginLeft: index > 0 ? "-30px" : "0", // Overlap cards to save space
                }}
              >
                <div className="text-white font-bold text-xl">?</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
