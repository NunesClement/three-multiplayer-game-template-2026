import { forwardRef } from "react"
import type { Group } from "three"

// This is a placeholder component that would normally load a GLTF model
// Since we can't include actual 3D models, we'll create a simple island with primitives
const IslandModel = forwardRef<Group>((props, ref) => {
  return (
    <group ref={ref} position={[0, 0, 0]} scale={[1, 1, 1]}>
      {/* Main island */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[15, 20, 2, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Sand */}
      <mesh position={[0, 2.01, 0]} receiveShadow>
        <cylinderGeometry args={[14, 14, 0.1, 32]} />
        <meshStandardMaterial color="#C2B280" />
      </mesh>

      {/* Grass */}
      <mesh position={[0, 2.06, 0]} receiveShadow>
        <cylinderGeometry args={[12, 12, 0.1, 32]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* Mountain */}
      <mesh position={[0, 6, 0]} castShadow>
        <coneGeometry args={[8, 8, 32]} />
        <meshStandardMaterial color="#696969" />
      </mesh>

      {/* Trees */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2
        const radius = 8
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return (
          <group key={i} position={[x, 2.1, z]}>
            {/* Tree trunk */}
            <mesh castShadow>
              <cylinderGeometry args={[0.2, 0.3, 1.5, 8]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Tree leaves */}
            <mesh position={[0, 1.5, 0]} castShadow>
              <coneGeometry args={[1, 2, 8]} />
              <meshStandardMaterial color="#006400" />
            </mesh>
          </group>
        )
      })}
    </group>
  )
})

IslandModel.displayName = "IslandModel"

export default IslandModel

