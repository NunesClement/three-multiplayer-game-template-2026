import { Character, socket } from "./socket-utils";
import { Vector3 } from "three";

function Cube({ character }: { character: Character }) {
  //   const ref = useRef<Mesh>(null);

  //   console.log({ character });
  //   useFrame(() => {
  //     if (ref.current) {
  //       ref.current.position.set(
  //         character.position.x,
  //         0.25,
  //         character.position.z
  //       );
  //     }
  //   });

  return (
    <mesh
      position={new Vector3(character.position.x, 0.25, character.position.z)}
    >
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

export function MovingCubes({ characters }: { characters: Character[] }) {
  return (
    <>
      {characters.map((character) =>
        character.id !== socket.id ? (
          <Cube key={character.id} character={character} />
        ) : null
      )}
    </>
  );
}
