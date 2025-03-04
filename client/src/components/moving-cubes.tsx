import { useRef } from "react";
import { Character } from "./socket-utils";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

function Cube({ character }: { character: Character }) {
  const ref = useRef<Mesh>(null);

  console.log({ character });
  useFrame(() => {
    if (ref.current) {
      ref.current.position.set(
        character.position.x,
        0.25,
        character.position.z
      );
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

export function MovingCubes({ characters }: { characters: Character[] }) {
  return (
    <>
      {characters.map((character) => (
        <Cube key={character.id} character={character} />
      ))}
    </>
  );
}
