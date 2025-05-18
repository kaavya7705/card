"use client"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { AIDifficulty } from "@/lib/types"

interface SettingsPanelProps {
  settings: {
    aiDifficulty: AIDifficulty
    tutorialCompleted: boolean
    soundEnabled: boolean
    animationsEnabled: boolean
  }
  onDifficultyChange: (difficulty: AIDifficulty) => void
  onToggleAnimations: () => void
  onShowTutorial: () => void
}

export function SettingsPanel({
  settings,
  onDifficultyChange,
  onToggleAnimations,
  onShowTutorial,
}: SettingsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-emerald-700">AI Difficulty</h3>
        <RadioGroup
          defaultValue={settings.aiDifficulty}
          onValueChange={(value) => onDifficultyChange(value as AIDifficulty)}
          className="bg-emerald-50 p-3 rounded-md border border-emerald-200"
        >
          <div className="flex items-center space-x-2 py-1">
            <RadioGroupItem value="easy" id="easy" className="border-emerald-500 text-emerald-500" />
            <Label htmlFor="easy" className="text-emerald-700">
              Easy
            </Label>
          </div>
          <div className="flex items-center space-x-2 py-1">
            <RadioGroupItem value="medium" id="medium" className="border-emerald-500 text-emerald-500" />
            <Label htmlFor="medium" className="text-emerald-700">
              Medium
            </Label>
          </div>
          <div className="flex items-center space-x-2 py-1">
            <RadioGroupItem value="hard" id="hard" className="border-emerald-500 text-emerald-500" />
            <Label htmlFor="hard" className="text-emerald-700">
              Hard
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-emerald-700">Game Settings</h3>
        <div className="space-y-2 bg-emerald-50 p-3 rounded-md border border-emerald-200">
          <div className="flex items-center justify-between py-1">
            <Label htmlFor="animations" className="text-emerald-700">
              Animations
            </Label>
            <Switch
              id="animations"
              checked={settings.animationsEnabled}
              onCheckedChange={onToggleAnimations}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-emerald-200">
        <Button
          onClick={onShowTutorial}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-md border border-emerald-400/50"
        >
          Show Tutorial
        </Button>
      </div>
    </div>
  )
}
