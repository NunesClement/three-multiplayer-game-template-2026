import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Object3D } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

type AnimationName = "idle" | "walk" | "run";

interface CharacterProps {
  animation: AnimationName;
  "position-y": number;
  scale: number;
  playerId: string; // Unique identifier for each player
}

export function Character({ animation, playerId, ...props }: CharacterProps) {
  const group = useRef<Object3D>(null);
  const [model, setModel] = useState<Object3D | null>(null);
  const { scene, animations } = useGLTF("/models/character.glb");
  const { actions, mixer } = useAnimations(animations, group);

  // Clone the model once on component mount
  useEffect(() => {
    if (scene && !model) {
      // Use SkeletonUtils.clone for proper skinned mesh cloning
      const clonedScene = clone(scene);
      setModel(clonedScene);
    }
  }, [scene, model]);

  // Play the specified animation for this player's character
  useEffect(() => {
    if (!actions || !mixer) return;

    const action = actions[animation];
    if (action) {
      // Stop any currently playing animations
      mixer.stopAllAction();

      action.reset().fadeIn(0.24).play();
      return () => {
        action.fadeOut(0.24);
      };
    }
  }, [animation, actions, mixer]);

  // Only render when model is ready
  if (!model) return null;

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      name={`character-instance-${playerId}`} // Unique root group name
    >
      {/* Use the cloned model instead of recreating mesh structure */}
      <primitive object={model} />
    </group>
  );
}

// Preload the model to avoid loading delays
useGLTF.preload("/models/character.glb");
