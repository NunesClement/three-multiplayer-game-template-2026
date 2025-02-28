"use client"

import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Stats } from "@react-three/drei"
import Island from "@/components/island"
import Instructions from "@/components/instructions"

export default function GameScene() {
  const [showInstructions, setShowInstructions] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        setShowInstructions(true)
        setGameStarted(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const startGame = () => {
    setShowInstructions(false)
    setGameStarted(true)
  }

  return (
    <div className="h-screen w-full">
      <Canvas shadows camera={{ position: [0, 2, 10], fov: 50 }}>
        <Island gameStarted={gameStarted} />
        {process.env.NODE_ENV === "development" && <Stats />}
      </Canvas>

      {showInstructions && <Instructions onStart={startGame} />}
    </div>
  )
}

