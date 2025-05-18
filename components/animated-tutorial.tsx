"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/card"
import { generateCard } from "@/lib/game-logic"
import { ChevronRight, ChevronLeft, X, Info } from "lucide-react"
import type { TutorialStep } from "@/lib/types"

interface AnimatedTutorialProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  currentStep: TutorialStep
  onStepChange: (step: TutorialStep) => void
}

export function AnimatedTutorial({ isOpen, onClose, onComplete, currentStep, onStepChange }: AnimatedTutorialProps) {
  const [demoCard] = useState(generateCard("player", "fire"))
  const [demoCardWater] = useState(generateCard("player", "water"))
  const [demoCardIce] = useState(generateCard("player", "ice"))
  const [animationPlaying, setAnimationPlaying] = useState(false)

  // Force legendary for demo
  demoCard.rarity = "legendary"
  demoCard.attack = 8
  demoCard.defense = 5
  demoCard.special = { name: "Inferno", effect: "burn", value: 3 }

  demoCardWater.type = "water"
  demoCardWater.name = "Tidal Wave"

  demoCardIce.type = "ice"
  demoCardIce.name = "Frost Nova"

  const steps: Record<
    TutorialStep,
    {
      title: string
      content: React.ReactNode
      animation: React.ReactNode
    }
  > = {
    welcome: {
      title: "Welcome to DuelForge!",
      content: (
        <div className="space-y-4 text-black">
          <p>
            Welcome to Card Battle Arena, a strategic card game where you'll battle against the computer using elemental
            cards with unique abilities!
          </p>
          <p>
            This tutorial will guide you through the basics of gameplay. You can revisit it anytime from the help menu.
          </p>
        </div>
      ),
      animation: (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center h-64"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotateZ: [0, -5, 0, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <Card card={demoCard} isPlayable={false} showDetails={true} />
          </motion.div>
        </motion.div>
      ),
    },
    cards: {
      title: "Understanding Cards",
      content: (
        <div className="space-y-4">
          <p>Each card has several key attributes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-bold text-red-600">Attack (ATK)</span>: How much damage the card can deal
            </li>
            <li>
              <span className="font-bold text-blue-600">Defense (DEF)</span>: How much damage the card can block
            </li>
            <li>
              <span className="font-bold text-yellow-600">Energy Cost</span>: How much energy is required to play the
              card
            </li>
            <li>
              <span className="font-bold text-purple-600">Special Ability</span>: Unique effects that can turn the tide
              of battle
            </li>
          </ul>
          <p>
            Cards also have different rarities: Common, Uncommon, Rare, Epic, and Legendary. Higher rarity cards are
            more powerful!
          </p>
        </div>
      ),
      animation: (
        <div className="relative h-64 flex justify-center items-center">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Card card={demoCard} isPlayable={false} showDetails={true} />
          </motion.div>

          <motion.div
            className="absolute top-12 -left-4 bg-red-100 px-2 py-1 rounded-md border border-red-300 shadow-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-sm font-bold text-red-600 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
              Attack
            </div>
          </motion.div>

          <motion.div
            className="absolute top-24 -left-4 bg-blue-100 px-2 py-1 rounded-md border border-blue-300 shadow-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="text-sm font-bold text-blue-600 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              Defense
            </div>
          </motion.div>

          <motion.div
            className="absolute top-4 -right-4 bg-yellow-100 px-2 py-1 rounded-md border border-yellow-300 shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
          >
            <div className="text-sm font-bold text-yellow-600 flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
              Energy Cost
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-12 -right-4 bg-purple-100 px-2 py-1 rounded-md border border-purple-300 shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2 }}
          >
            <div className="text-sm font-bold text-purple-600 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
              Special Ability
            </div>
          </motion.div>
        </div>
      ),
    },
    types: {
      title: "Elemental Types & Advantages",
      content: (
        <div className="space-y-4">
          <p>Cards belong to six elemental types, each with strengths and weaknesses:</p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            <li className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span> Fire beats Ice
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span> Ice beats Electric & Wind
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span> Electric beats Water
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-cyan-500 rounded-full mr-1"></span> Water beats Fire & Earth
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span> Earth beats Electric
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-teal-500 rounded-full mr-1"></span> Wind beats Earth
            </li>
          </ul>
          <p>
            When attacking a card of a type you're strong against, you'll deal{" "}
            <span className="font-bold text-green-600">1.5x damage</span>!
          </p>
          <p>
            When attacking a card of a type you're weak against, you'll deal{" "}
            <span className="font-bold text-red-600">0.75x damage</span>.
          </p>
        </div>
      ),
      animation: (
        <div className="h-64 flex justify-center items-center">
          <div className="relative">
            <motion.div
              initial={{ x: -80 }}
              animate={animationPlaying ? { x: 0 } : { x: -80 }}
              transition={{ duration: 1 }}
              className="absolute z-10"
            >
              <Card card={demoCard} isPlayable={false} />
            </motion.div>

            <motion.div
              initial={{ x: 80 }}
              animate={animationPlaying ? { x: 0 } : { x: 80 }}
              transition={{ duration: 1 }}
            >
              <Card card={demoCardIce} isPlayable={false} />
            </motion.div>

            {animationPlaying && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                transition={{ delay: 1, duration: 1.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-2xl font-bold text-green-500 bg-white/80 px-3 py-1 rounded-md shadow-lg">
                  SUPER EFFECTIVE!
                </div>
              </motion.div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-4"
            onClick={() => {
              setAnimationPlaying(true)
              setTimeout(() => setAnimationPlaying(false), 3000)
            }}
            disabled={animationPlaying}
          >
            Play Animation
          </Button>
        </div>
      ),
    },
    energy: {
      title: "Energy System",
      content: (
        <div className="space-y-4">
          <p>Energy is the resource you use to play cards. Each card costs a specific amount of energy to play.</p>
          <p>You start with 3 energy and gain 1 energy at the beginning of each turn, up to a maximum of 10.</p>
          <p>
            Strategic energy management is key to victory! Some cards have special abilities that can give you extra
            energy or drain your opponent's energy.
          </p>
        </div>
      ),
      animation: (
        <div className="h-64 flex justify-center items-center">
          <div className="relative">
            <motion.div className="mb-8 flex items-center justify-center">
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 w-64 h-8 rounded-full overflow-hidden relative">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-200 to-yellow-300"
                  initial={{ width: "30%" }}
                  animate={{ width: ["30%", "40%", "50%", "60%", "70%"] }}
                  transition={{
                    duration: 5,
                    times: [0, 0.2, 0.4, 0.6, 0.8],
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 1,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-black font-bold shadow-inner">
                  Energy
                </div>
              </div>
            </motion.div>

            <div className="flex space-x-4">
              <motion.div whileHover={{ y: -10 }} className="relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-100 px-2 py-1 rounded-full border border-yellow-300 shadow-md">
                  <span className="text-xs font-bold text-yellow-700">2⚡</span>
                </div>
                <Card card={{ ...demoCard, energyCost: 2 }} isPlayable={true} />
              </motion.div>

              <motion.div whileHover={{ y: -10 }} className="relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-100 px-2 py-1 rounded-full border border-yellow-300 shadow-md">
                  <span className="text-xs font-bold text-yellow-700">3⚡</span>
                </div>
                <Card card={{ ...demoCardWater, energyCost: 3 }} isPlayable={true} />
              </motion.div>

              <motion.div whileHover={{ y: -10 }} className="relative opacity-50">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-100 px-2 py-1 rounded-full border border-red-300 shadow-md">
                  <span className="text-xs font-bold text-red-700">5⚡</span>
                </div>
                <Card card={{ ...demoCardIce, energyCost: 5 }} isPlayable={false} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-100 px-2 py-1 rounded-md border border-red-300 shadow-md">
                    <span className="text-xs font-bold text-red-700">Not enough energy!</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      ),
    },
    battle: {
      title: "Battle Mechanics",
      content: (
        <div className="space-y-4">
          <p>When both players have played a card, the battle phase begins!</p>
          <p>Cards attack each other simultaneously. The damage dealt is calculated as:</p>
          <div className="bg-gray-100 p-2 rounded-md text-sm">
            <code>Damage = (Attack × Type Bonus) - Opponent's Defense</code>
          </div>
          <p>
            Cards can also trigger <span className="font-bold text-yellow-600">Critical Hits</span> for 1.5x damage!
          </p>
          <p>After battle, both cards are discarded and any special effects are applied.</p>
        </div>
      ),
      animation: (
        <div className="h-64 flex justify-center items-center">
          <div className="relative">
            <div className="flex space-x-16 items-center">
              <motion.div
                animate={
                  animationPlaying
                    ? {
                        x: [0, 40, 0],
                        rotateZ: [0, 15, 0],
                      }
                    : {}
                }
                transition={{ duration: 1.5 }}
              >
                <Card card={demoCard} isPlayable={false} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  animationPlaying
                    ? {
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }
                    : {}
                }
                transition={{ duration: 1.5 }}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div className="text-2xl font-bold text-red-500 bg-white/80 px-3 py-1 rounded-md shadow-lg">VS</div>
              </motion.div>

              <motion.div
                animate={
                  animationPlaying
                    ? {
                        x: [0, -40, 0],
                        rotateZ: [0, -15, 0],
                      }
                    : {}
                }
                transition={{ duration: 1.5 }}
              >
                <Card card={demoCardWater} isPlayable={false} />
              </motion.div>
            </div>

            {animationPlaying && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: [0, 1, 0], y: [20, 0, -20] }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="absolute left-1/4 bottom-0"
                >
                  <div className="text-lg font-bold text-red-500">-6</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: [0, 1, 0], y: [20, 0, -20] }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="absolute right-1/4 bottom-0"
                >
                  <div className="text-lg font-bold text-red-500">-4</div>
                </motion.div>
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              onClick={() => {
                setAnimationPlaying(true)
                setTimeout(() => setAnimationPlaying(false), 3000)
              }}
              disabled={animationPlaying}
            >
              Play Battle Animation
            </Button>
          </div>
        </div>
      ),
    },
    special: {
      title: "Special Abilities & Powers",
      content: (
        <div className="space-y-4">
          <p>Many cards have special abilities that trigger after battle:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>
              <span className="font-bold text-purple-600">Stun</span>: Prevents opponent from playing a card next turn
            </li>
            <li>
              <span className="font-bold text-green-600">Poison</span>: Deals 4 damage per turn for 3 turns
            </li>
            <li>
              <span className="font-bold text-red-600">Burn</span>: Deals 3 damage per turn for 2 turns
            </li>
            <li>
              <span className="font-bold text-blue-600">Shield</span>: Reduces damage taken by 5 for 1 turn
            </li>
            <li>
              <span className="font-bold text-yellow-600">Energy Boost</span>: Gives you 2 additional energy
            </li>
            <li>
              <span className="font-bold text-indigo-600">Double Attack</span>: Deals double damage
            </li>
          </ul>
          <p>
            You also have a <span className="font-bold text-purple-600">Special Power</span> that charges over time.
            When full, you can unleash a devastating attack!
          </p>
        </div>
      ),
      animation: (
        <div className="h-64 flex justify-center items-center">
          <div className="relative">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                card={{
                  ...demoCard,
                  special: { name: "Inferno", effect: "burn", value: 3 },
                }}
                isPlayable={false}
                showDetails={true}
              />
            </motion.div>

            {animationPlaying && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1] }}
                transition={{ duration: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  className="absolute inset-0 bg-red-500/30 rounded-md"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: 2 }}
                />

                <motion.div
                  animate={{ y: [0, -5, 0, -5, 0] }}
                  transition={{ duration: 2, repeat: 2 }}
                  className="text-xl font-bold text-red-600 bg-white/80 px-3 py-1 rounded-md shadow-lg"
                >
                  BURN!
                </motion.div>
              </motion.div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              onClick={() => {
                setAnimationPlaying(true)
                setTimeout(() => setAnimationPlaying(false), 5000)
              }}
              disabled={animationPlaying}
            >
              Activate Special
            </Button>
          </div>
        </div>
      ),
    },
    status: {
      title: "Status Effects",
      content: (
        <div className="space-y-4">
          <p>Status effects can dramatically change the course of battle:</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-yellow-50 p-2 rounded-md border border-yellow-200">
              <div className="font-bold text-yellow-700 mb-1">Stun</div>
              <p className="text-yellow-600">Skip your next turn completely</p>
            </div>
            <div className="bg-green-50 p-2 rounded-md border border-green-200">
              <div className="font-bold text-green-700 mb-1">Poison</div>
              <p className="text-green-600">Take 4 damage for 3 turns</p>
            </div>
            <div className="bg-red-50 p-2 rounded-md border border-red-200">
              <div className="font-bold text-red-700 mb-1">Burn</div>
              <p className="text-red-600">Take 3 damage for 2 turns</p>
            </div>
            <div className="bg-blue-50 p-2 rounded-md border border-blue-200">
              <div className="font-bold text-blue-700 mb-1">Shield</div>
              <p className="text-blue-600">Reduce damage by 5 for 1 turn</p>
            </div>
          </div>
          <p>Status effects are shown as icons next to your health bar. Hover over them to see details.</p>
        </div>
      ),
      animation: (
        <div className="h-64 flex justify-center items-center">
          <div className="relative">
            <div className="flex space-x-3 mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs text-gray-800 font-bold border border-gray-200 shadow-sm">
                  1
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15.5 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
                  <path d="M20 14c.5 0 1.5 0 2 -1" />
                  <path d="M18 18c.5 1 1.5 3 3 3" />
                  <path d="M15 18c-1 0 -4 -1 -4 -4c0 -3 2 -4 2 -6c0 -1 0 -3 -2 -3c-1.9 0 -3 1.3 -3.5 2.5" />
                  <path d="M5 21c-.5 -1 -2 -3 -2 -6c0 -1.5 1 -3 3 -3c2.5 0 2.5 3 4.5 3c.5 0 1 0 1.5 -.5" />
                  <path d="M12 11c0 -1.5 -.5 -3 -1.5 -4" />
                </svg>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs text-gray-800 font-bold border border-gray-200 shadow-sm">
                  3
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 12c2 -2.96 0 -7 -1 -8c0 3.038 -1.773 4.741 -3 6c-1.226 1.26 -2 3.24 -2 5a6 6 0 1 0 12 0c0 -1.532 -1.056 -3.94 -2 -5c-1.786 3 -3 4.5 -4 2z" />
                </svg>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs text-gray-800 font-bold border border-gray-200 shadow-sm">
                  2
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
                </svg>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs text-gray-800 font-bold border border-gray-200 shadow-sm">
                  1
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white p-3 rounded-lg border border-gray-200 shadow-md max-w-xs"
            >
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15.5 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
                    <path d="M20 14c.5 0 1.5 0 2 -1" />
                    <path d="M18 18c.5 1 1.5 3 3 3" />
                    <path d="M15 18c-1 0 -4 -1 -4 -4c0 -3 2 -4 2 -6c0 -1 0 -3 -2 -3c-1.9 0 -3 1.3 -3.5 2.5" />
                    <path d="M5 21c-.5 -1 -2 -3 -2 -6c0 -1.5 1 -3 3 -3c2.5 0 2.5 3 4.5 3c.5 0 1 0 1.5 -.5" />
                    <path d="M12 11c0 -1.5 -.5 -3 -1.5 -4" />
                  </svg>
                </div>
                <div className="font-bold text-green-700">Poison</div>
              </div>
              <p className="text-sm text-gray-600">
                You are poisoned! You will take 4 damage at the start of your next 3 turns.
              </p>
            </motion.div>
          </div>
        </div>
      ),
    },
    complete: {
      title: "Ready to Play!",
      content: (
        <div className="space-y-4">
          <p>Congratulations! You now know the basics of Card Battle Arena.</p>
          <p>Remember these key strategies:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use type advantages to deal more damage</li>
            <li>Manage your energy efficiently</li>
            <li>Save powerful cards for the right moment</li>
            <li>Pay attention to status effects</li>
            <li>Build combos with synergistic cards</li>
          </ul>
          <p className="font-medium text-indigo-600">Good luck, and may the best strategist win!</p>
        </div>
      ),
      animation: (
        <div className="h-64 flex justify-center items-center">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotateZ: [0, -5, 0, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="relative"
          >
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.95, 1, 0.95],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-md blur-xl"
            />
            <Card
              card={{
                ...demoCard,
                rarity: "legendary",
                attack: 10,
                defense: 8,
                special: { name: "Ultimate Inferno", effect: "doubleAttack" },
              }}
              isPlayable={false}
              showDetails={true}
            />

            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <span className="text-black font-bold">★</span>
            </motion.div>
          </motion.div>
        </div>
      ),
    },
  }

  const stepOrder: TutorialStep[] = ["welcome", "cards", "types", "energy", "battle", "special", "status", "complete"]

  const currentStepIndex = stepOrder.indexOf(currentStep)

  const goToNextStep = () => {
    if (currentStepIndex < stepOrder.length - 1) {
      onStepChange(stepOrder[currentStepIndex + 1])
    } else {
      onComplete()
    }
  }

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      onStepChange(stepOrder[currentStepIndex - 1])
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-black mr-3">
              <Info className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Tutorial: {steps[currentStep].title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100 text-black">
              {steps[currentStep].content}
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={goToPrevStep}
                disabled={currentStepIndex === 0}
                className="flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center space-x-1">
                {stepOrder.map((step, index) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStepIndex
                        ? "bg-indigo-500"
                        : index < currentStepIndex
                          ? "bg-indigo-300"
                          : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={goToNextStep}
                className="flex items-center bg-gradient-to-r from-indigo-500 to-purple-500 text-black"
              >
                {currentStepIndex === stepOrder.length - 1 ? "Start Playing" : "Next"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-lg border border-gray-200 overflow-hidden">
            {steps[currentStep].animation}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
