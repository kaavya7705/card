import { GameBoard } from "@/components/game-board"

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-emerald-50 to-green-100 overflow-auto">
      <div className="min-h-screen w-full">
        <GameBoard />
      </div>
    </main>
  )
}
