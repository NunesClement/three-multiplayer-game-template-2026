"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type MovementKeys = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
};

const TERRAIN_SIZE = 100;
const TERRAIN_RESOLUTION = 128;
const TREE_COUNT = 50;
const ROCK_COUNT = 25;
const WATER_LEVEL = 0;

export default function Island({ gameStarted }: { gameStarted: boolean }) {
  const { camera } = useThree();
  const playerRef = useRef<THREE.Group>(null);
  const velocityRef = useRef(new THREE.Vector3());

  const [keys, setKeys] = useState<MovementKeys>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  // Simplified noise function
  const generateNoise = (x: number, z: number) => {
    // Simple Perlin-like noise function
    const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2;
    const largeScale = Math.sin(x * 0.01) * Math.cos(z * 0.01) * 5;
    const mediumScale = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 1.5;
    return noise + largeScale + mediumScale;
  };

  // Create terrain geometry
  const terrainGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(
      TERRAIN_SIZE,
      TERRAIN_SIZE,
      TERRAIN_RESOLUTION,
      TERRAIN_RESOLUTION
    );

    const vertices = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 2];
      vertices[i + 1] = generateNoise(x, z);
    }

    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // Generate random trees
  const trees = useMemo(() => {
    const treePositions = [];
    for (let i = 0; i < TREE_COUNT; i++) {
      const x = Math.random() * TERRAIN_SIZE - TERRAIN_SIZE / 2;
      const z = Math.random() * TERRAIN_SIZE - TERRAIN_SIZE / 2;
      const y = getHeightAtPosition(x, z, terrainGeometry);
      if (y > WATER_LEVEL + 1) {
        treePositions.push({
          position: new THREE.Vector3(x, y, z),
          scale: 0.5 + Math.random() * 1.5,
          rotation: Math.random() * Math.PI * 2,
        });
      }
    }
    return treePositions;
  }, [terrainGeometry]);

  // Generate random rocks
  const rocks = useMemo(() => {
    const rockPositions = [];
    for (let i = 0; i < ROCK_COUNT; i++) {
      const x = Math.random() * TERRAIN_SIZE - TERRAIN_SIZE / 2;
      const z = Math.random() * TERRAIN_SIZE - TERRAIN_SIZE / 2;
      const y = getHeightAtPosition(x, z, terrainGeometry);
      if (y > WATER_LEVEL) {
        rockPositions.push({
          position: new THREE.Vector3(x, y, z),
          scale: 0.2 + Math.random() * 1.0,
          rotation: Math.random() * Math.PI * 2,
        });
      }
    }
    return rockPositions;
  }, [terrainGeometry]);

  // Generate lakes
  const lakes = useMemo(() => {
    const lakePositions = [];
    // Find local minima for lakes
    const lakeCount = 3 + Math.floor(Math.random() * 3);
    const checkDistance = 10;

    for (let i = 0; i < lakeCount; i++) {
      let attempts = 0;
      let found = false;

      while (!found && attempts < 50) {
        attempts++;
        const x = Math.random() * (TERRAIN_SIZE - 20) - (TERRAIN_SIZE / 2 - 10);
        const z = Math.random() * (TERRAIN_SIZE - 20) - (TERRAIN_SIZE / 2 - 10);
        const y = getHeightAtPosition(x, z, terrainGeometry);

        // Check if it's a local minimum
        let isMinimum = true;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dz = -1; dz <= 1; dz++) {
            if (dx === 0 && dz === 0) continue;
            const checkY = getHeightAtPosition(
              x + dx * checkDistance,
              z + dz * checkDistance,
              terrainGeometry
            );
            if (checkY < y) {
              isMinimum = false;
              break;
            }
          }
          if (!isMinimum) break;
        }

        if (isMinimum && y < 2) {
          const size = 5 + Math.random() * 15;
          lakePositions.push({
            position: new THREE.Vector3(x, y, z),
            size: size,
          });
          found = true;
        }
      }
    }

    return lakePositions;
  }, [terrainGeometry]);

  useEffect(() => {
    if (gameStarted && playerRef.current) {
      const startPosition = new THREE.Vector3(0, 5, 0);
      playerRef.current.position.copy(startPosition);
      camera.position.set(
        startPosition.x,
        startPosition.y + 5,
        startPosition.z + 10
      );
      camera.lookAt(startPosition);
    }
  }, [gameStarted, camera]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
          setKeys((prev) => ({ ...prev, forward: true }));
          break;
        case "KeyS":
          setKeys((prev) => ({ ...prev, backward: true }));
          break;
        case "KeyA":
          setKeys((prev) => ({ ...prev, left: true }));
          break;
        case "KeyD":
          setKeys((prev) => ({ ...prev, right: true }));
          break;
        case "Space":
          setKeys((prev) => ({ ...prev, jump: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
          setKeys((prev) => ({ ...prev, forward: false }));
          break;
        case "KeyS":
          setKeys((prev) => ({ ...prev, backward: false }));
          break;
        case "KeyA":
          setKeys((prev) => ({ ...prev, left: false }));
          break;
        case "KeyD":
          setKeys((prev) => ({ ...prev, right: false }));
          break;
        case "Space":
          setKeys((prev) => ({ ...prev, jump: false }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!gameStarted || !playerRef.current) return;

    const speed = 10;
    const jumpForce = 5;
    const gravity = -9.8;

    const player = playerRef.current;
    const velocity = velocityRef.current;

    // Apply movement based on keys
    const moveDirection = new THREE.Vector3();
    if (keys.forward) moveDirection.z -= 1;
    if (keys.backward) moveDirection.z += 1;
    if (keys.left) moveDirection.x -= 1;
    if (keys.right) moveDirection.x += 1;
    moveDirection.normalize().multiplyScalar(speed * delta);

    // Apply gravity and handle jumping
    velocity.y += gravity * delta;
    if (
      keys.jump &&
      player.position.y <=
        getHeightAtPosition(
          player.position.x,
          player.position.z,
          terrainGeometry
        ) +
          0.1
    ) {
      velocity.y = jumpForce;
    }

    // Update player position
    player.position.add(moveDirection);
    player.position.y += velocity.y * delta;

    // Terrain collision
    const terrainHeight = getHeightAtPosition(
      player.position.x,
      player.position.z,
      terrainGeometry
    );
    if (player.position.y < terrainHeight) {
      player.position.y = terrainHeight;
      velocity.y = 0;
    }

    // Update camera position
    camera.position.x = player.position.x;
    camera.position.y = player.position.y + 5;
    camera.position.z = player.position.z + 10;
    camera.lookAt(player.position);
  });

  return (
    <>
      <OrbitControls enablePan={false} enableZoom={false} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      <group ref={playerRef}>
        <mesh castShadow>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>

      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <primitive object={terrainGeometry} />
        <meshStandardMaterial color="#4caf50" roughness={0.8} />
      </mesh>

      {trees.map((tree, index) => (
        <Tree
          key={`tree-${index}`}
          position={tree.position}
          scale={tree.scale}
          rotation={tree.rotation}
        />
      ))}

      {rocks.map((rock, index) => (
        <Rock
          key={`rock-${index}`}
          position={rock.position}
          scale={rock.scale}
          rotation={rock.rotation}
        />
      ))}

      {lakes.map((lake, index) => (
        <Lake key={`lake-${index}`} position={lake.position} size={lake.size} />
      ))}
    </>
  );
}

function Tree({
  position,
  scale,
  rotation,
}: {
  position: THREE.Vector3;
  scale: number;
  rotation: number;
}) {
  return (
    <group position={position} rotation-y={rotation} scale={scale}>
      {/* Tree trunk */}
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.3, 1.5, 8]} />
        <meshStandardMaterial color="#5d4037" roughness={0.8} />
      </mesh>

      {/* Tree foliage - multiple layers for more natural look */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 2.3, 0]}>
        <coneGeometry args={[0.7, 1.5, 8]} />
        <meshStandardMaterial color="#388e3c" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 3, 0]}>
        <coneGeometry args={[0.4, 1, 8]} />
        <meshStandardMaterial color="#43a047" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Rock({
  position,
  scale,
  rotation,
}: {
  position: THREE.Vector3;
  scale: number;
  rotation: number;
}) {
  return (
    <group position={position} rotation-y={rotation} scale={scale}>
      <mesh castShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#757575" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Lake({ position, size }: { position: THREE.Vector3; size: number }) {
  return (
    <mesh
      position={[position.x, WATER_LEVEL + 0.1, position.z]}
      rotation-x={-Math.PI / 2}
    >
      <circleGeometry args={[size, 32]} />
      <meshStandardMaterial color="#1e88e5" transparent opacity={0.8} />
    </mesh>
  );
}

function getHeightAtPosition(
  x: number,
  z: number,
  geometry: THREE.BufferGeometry
): number {
  const positionAttribute = geometry.getAttribute(
    "position"
  ) as THREE.BufferAttribute;
  const vertices = positionAttribute.array as Float32Array;
  const width = Math.sqrt(positionAttribute.count);
  const size = TERRAIN_SIZE;

  // Make sure coordinates are within bounds
  const clampedX = Math.max(-size / 2, Math.min(size / 2, x));
  const clampedZ = Math.max(-size / 2, Math.min(size / 2, z));

  // Convert world coordinates to index in the grid
  const xIndex = Math.round(((clampedX + size / 2) / size) * (width - 1));
  const zIndex = Math.round(((clampedZ + size / 2) / size) * (width - 1));

  // Calculate the index in the position array
  const index = (zIndex * width + xIndex) * 3 + 1;

  // Check if index is valid
  if (index >= 0 && index < vertices.length) {
    return vertices[index];
  }

  return 0; // Default height if index is invalid
}
