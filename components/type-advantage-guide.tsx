"use client"
import { Flame, Snowflake, Zap, Droplets, Leaf, Wind } from "lucide-react"

// Define type for valid card types
type CardType = 'fire' | 'ice' | 'electric' | 'water' | 'earth' | 'wind';

// Define interface for advantage object
interface TypeAdvantage {
  type: CardType;
  strong: CardType[];
  weak: CardType[];
}

export function TypeAdvantageGuide() {
  const typeIcons = {
    fire: <Flame className="h-4 w-4 text-red-600" />,
    ice: <Snowflake className="h-4 w-4 text-sky-500" />,
    electric: <Zap className="h-4 w-4 text-amber-500" />,
    water: <Droplets className="h-4 w-4 text-blue-600" />,
    earth: <Leaf className="h-4 w-4 text-emerald-600" />,
    wind: <Wind className="h-4 w-4 text-cyan-600" />,
  } as const;

  const advantages: TypeAdvantage[] = [
    { type: "fire", strong: ["ice"], weak: ["water"] },
    { type: "ice", strong: ["electric", "wind"], weak: ["fire"] },
    { type: "electric", strong: ["water"], weak: ["earth"] },
    { type: "water", strong: ["fire", "earth"], weak: ["electric"] },
    { type: "earth", strong: ["electric"], weak: ["wind", "water"] },
    { type: "wind", strong: ["earth"], weak: ["ice"] },
  ];

  return (
    <div className="p-3">
      <p className="text-gray-700 mb-4 leading-relaxed">
        Each card type has advantages and disadvantages against other types. When a card attacks a type it's strong
        against, it deals 1.5x damage! When attacking a type it's weak against, it deals only 0.75x damage.
      </p>

      <div className="grid grid-cols-1 gap-3">
        {advantages.map((advantage) => (
          <div
            key={advantage.type}
            className="flex items-center p-4 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 shadow-sm border border-gray-200">
              {typeIcons[advantage.type]}
            </div>

            <div className="ml-4 flex-1">
              <div className="text-sm font-semibold capitalize text-gray-800">{advantage.type}</div>

              <div className="flex items-center text-xs text-gray-600 mt-2">
                <span className="font-medium text-emerald-600">Strong vs:</span>
                <div className="flex items-center ml-2 space-x-2">
                  {advantage.strong.map((type) => (
                    <div key={type} className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
                      {typeIcons[type]}
                      <span className="ml-1 capitalize">{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center text-xs text-gray-600 mt-1">
                <span className="font-medium text-rose-600">Weak vs:</span>
                <div className="flex items-center ml-2 space-x-2">
                  {advantage.weak.map((type) => (
                    <div key={type} className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
                      {typeIcons[type]}
                      <span className="ml-1 capitalize">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
