import { Character as Character3D } from "./character";
import { Character, socket, useSocketStore } from "./socket-utils";
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
    <mesh>
      <mesh
        position-y={0.15}
        position={new Vector3(character.position.x, 0.25, character.position.z)}
      >
        <Character3D
          scale={0.18}
          position-y={-0.25}
          animation="idle"
          playerId={character.id || "myself"}
        />
      </mesh>
    </mesh>
  );
}

export const MovingCubes = () => {
  const { characters, chats } = useSocketStore();

  console.log({ characters, chats });

  return (
    <>
      {characters.map((character) =>
        character.id !== socket.id ? (
          <Cube key={character.id} character={character} />
        ) : null
      )}
    </>
  );
};
