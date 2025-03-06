import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { SkinnedMesh } from "three";

type AnimationName = "idle" | "walk" | "run";

interface CharacterProps {
  animation: AnimationName;
  "position-y": number;
  scale: number;
  playerId: string; // Unique identifier for each player
}

export function Character({ animation, playerId, ...props }: CharacterProps) {
  const group = useRef(null);
  const { nodes, materials, animations } = useGLTF("/models/character.glb");
  const { actions } = useAnimations(animations, group);

  // Play the specified animation for this player's character
  useEffect(() => {
    const action = actions[animation];
    if (action) {
      action.reset().fadeIn(0.24).play();
      return () => {
        action.fadeOut(0.24);
      };
    }
  }, [animation, actions]);

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      name={`character-root-${playerId}`} // Unique root group name
    >
      <group name={`scene-${playerId}`}>
        <group name={`character-model-${playerId}`}>
          <primitive object={nodes._rootJoint} />
          <skinnedMesh
            name={`body-${playerId}`}
            geometry={(nodes.body as SkinnedMesh).geometry}
            material={materials.Material}
            skeleton={(nodes.body as SkinnedMesh).skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name={`eye-${playerId}`}
            geometry={(nodes.eye as SkinnedMesh).geometry}
            material={materials.Material}
            skeleton={(nodes.eye as SkinnedMesh).skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name={`hand-${playerId}`}
            geometry={(nodes["hand-"] as SkinnedMesh).geometry} // Consistent key
            material={materials.Material}
            skeleton={(nodes["hand-"] as SkinnedMesh).skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name={`leg-${playerId}`}
            geometry={(nodes.leg as SkinnedMesh).geometry}
            material={materials.Material}
            skeleton={(nodes.leg as SkinnedMesh).skeleton}
            castShadow
            receiveShadow
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/character.glb");
