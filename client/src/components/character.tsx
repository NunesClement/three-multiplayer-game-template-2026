import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { SkinnedMesh, Vector3 } from "three";

type AnimationName = "idle" | "walk" | "run";

interface CharacterProps {
  animation: AnimationName;
  "position-y": number;
  scale: number;
  position?: Vector3;
  playerId: string; // Added playerId prop
}

export function Character({ animation, playerId, ...props }: CharacterProps) {
  const group = useRef(null);
  const { nodes, materials, animations } = useGLTF("/models/character.glb");
  const { actions } = useAnimations(animations, group);

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
    <group ref={group} {...props} dispose={null} name={`main-${playerId}`}>
      <group name={`Scene-${playerId}`}>
        <group name={`fall_guys-${playerId}`}>
          <primitive object={nodes._rootJoint} />
          <skinnedMesh
            name={`body-${playerId}`} // Unique name for each player
            geometry={(nodes.body as SkinnedMesh).geometry}
            material={materials.Material}
            skeleton={(nodes.body as SkinnedMesh).skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name={`eye-${playerId}`} // Unique name for each player
            geometry={(nodes.eye as SkinnedMesh).geometry}
            material={materials.Material}
            skeleton={(nodes.eye as SkinnedMesh).skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name={`hand-${playerId}`} // Unique name for each player
            geometry={(nodes[`hand-`] as SkinnedMesh).geometry}
            material={materials.Material}
            skeleton={(nodes[`hand-`] as SkinnedMesh).skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name={`leg-${playerId}`} // Unique name for each player
            geometry={(nodes.leg as SkinnedMesh).geometry}
            skeleton={(nodes.leg as SkinnedMesh).skeleton}
            material={materials.Material}
            castShadow
            receiveShadow
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/character.glb");
