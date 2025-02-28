"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import Island from "@/components/island"

export default function Home() {
  return (
    <div className="w-full h-screen">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 75 }}>
        <Suspense fallback={null}>
          <Island gameStarted={true} />
        </Suspense>
      </Canvas>
    </div>
  )
}

