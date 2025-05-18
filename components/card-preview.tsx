"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/card"
import type { Card as CardType } from "@/lib/types"
import { X } from "lucide-react"

interface CardPreviewProps {
  card: CardType | null
  onClose: () => void
}

export function CardPreview({ card, onClose }: CardPreviewProps) {
  if (!card) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white p-6 rounded-lg shadow-xl relative border border-emerald-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-200"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-lg font-bold text-emerald-700 mb-4 text-center">Card Details</h3>

        <div className="flex flex-col items-center">
          <div className="transform scale-150 mb-8">
            <Card card={card} isPlayable={false} showDetails={true} />
          </div>

          <div className="space-y-2 w-full max-w-xs">
            <div className="bg-emerald-50 p-2 rounded-md border border-emerald-200">
              <h4 className="text-sm font-medium text-emerald-700">Basic Stats</h4>
              <p className="text-xs text-emerald-600">
                Attack: {card.attack} | Defense: {card.defense} | Energy Cost: {card.energyCost}
              </p>
            </div>

            <div className="bg-emerald-50 p-2 rounded-md border border-emerald-200">
              <h4 className="text-sm font-medium text-emerald-700">Type Advantage</h4>
              <p className="text-xs text-emerald-600">
                {card.type === "fire" && "Strong against Ice, weak against Water"}
                {card.type === "ice" && "Strong against Electric & Wind, weak against Fire"}
                {card.type === "electric" && "Strong against Water, weak against Earth"}
                {card.type === "water" && "Strong against Fire & Earth, weak against Electric"}
                {card.type === "earth" && "Strong against Electric, weak against Wind & Water"}
                {card.type === "wind" && "Strong against Earth, weak against Ice"}
              </p>
            </div>

            {card.special && (
              <div className="bg-emerald-50/50 p-2 rounded-md border border-emerald-200">
                <h4 className="text-sm font-medium text-emerald-700">Special Ability: {card.special.name}</h4>
                <p className="text-xs text-emerald-600">
                  {card.special.effect === "stun" &&
                    `Stuns the opponent for ${card.special.value || 1} turn${card.special.value !== 1 ? "s" : ""}, preventing them from playing a card.`}
                  {card.special.effect === "poison" &&
                    `Poisons the opponent for 3 turns, dealing ${card.special.value || 4} damage each turn.`}
                  {card.special.effect === "burn" &&
                    `Burns the opponent for 2 turns, dealing ${card.special.value || 3} damage each turn.`}
                  {card.special.effect === "heal" && `Heals you for ${card.special.value || 12} health points.`}
                  {card.special.effect === "energyBoost" &&
                    `Gives you ${card.special.value || 2} additional energy points.`}
                  {card.special.effect === "shield" &&
                    `Reduces damage taken by ${card.special.value || 5} for 1 turn.`}
                  {card.special.effect === "energyDrain" &&
                    `Drains ${card.special.value || 1} energy from your opponent.`}
                  {card.special.effect === "powerBoost" &&
                    `Increases your power meter by ${card.special.value || 20}%.`}
                  {card.special.effect === "doubleAttack" && "Deals double damage to your opponent."}
                </p>
              </div>
            )}

            {card.passive && (
              <div className="bg-emerald-50/50 p-2 rounded-md border border-emerald-200">
                <h4 className="text-sm font-medium text-emerald-700">Passive Ability</h4>
                <p className="text-xs text-emerald-600">
                  {card.passive.effect === "criticalChance" &&
                    `${card.passive.value}% chance to land a critical hit for 1.5x damage.`}
                  {card.passive.effect === "counterAttack" &&
                    `Counter-attacks with ${card.passive.value} damage when attacked.`}
                  {card.passive.effect === "energyRegen" &&
                    `Regenerates ${card.passive.value} additional energy each turn.`}
                  {card.passive.effect === "damageReduction" &&
                    `Reduces all incoming damage by ${card.passive.value}.`}
                </p>
              </div>
            )}

            {card.synergy && (
              <div className="bg-emerald-50/50 p-2 rounded-md border border-emerald-200">
                <h4 className="text-sm font-medium text-emerald-700">Synergy Effect</h4>
                <p className="text-xs text-emerald-600">
                  When played with a {card.synergy.type} card, gain +{card.synergy.value} {card.synergy.bonus}.
                </p>
              </div>
            )}

            <div className="bg-emerald-50 p-2 rounded-md border border-emerald-200">
              <h4 className="text-sm font-medium text-emerald-700">
                Rarity: {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
              </h4>
              <p className="text-xs text-emerald-600">
                {card.rarity === "common" && "A basic card with balanced stats."}
                {card.rarity === "uncommon" && "A slightly better card with improved stats."}
                {card.rarity === "rare" && "A powerful card with strong stats and abilities."}
                {card.rarity === "epic" && "A very powerful card with excellent stats and abilities."}
                {card.rarity === "legendary" && "An extremely powerful card with exceptional stats and abilities."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
