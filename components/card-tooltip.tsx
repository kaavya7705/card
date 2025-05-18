import { motion, AnimatePresence } from "framer-motion"
import { Card as CardType } from "@/lib/types"
import { Card } from "./card"

interface CardTooltipProps {
  card: CardType | null
  position: { x: number; y: number } | null
}

export function CardTooltip({ card, position }: CardTooltipProps) {
  return (
    <AnimatePresence>
      {card && position && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: "fixed",
            left: position.x + 20, // Offset from cursor
            top: position.y + 20,
            zIndex: 50,
            pointerEvents: "none", // Prevents tooltip from interfering with hover
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="transform scale-150"> {/* Makes the preview 1.5x larger */}
            <Card card={card} isPlayable={false} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}