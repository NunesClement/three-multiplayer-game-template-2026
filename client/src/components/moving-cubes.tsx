import { Character as Character3D } from "./character";
import { Character, useSocketStore } from "./socket-utils";
import { Vector3 } from "three";

function Cube({ character }: { character: Character }) {
  return (
    <mesh
      position-y={0.15}
      position={new Vector3(character.position.x, 0.25, character.position.z)}
      name="myself-mesh"
    >
      <Character3D
        scale={0.18}
        position-y={-0.25}
        animation={character.animation}
        playerId={character.id || "myself"}
      />
    </mesh>
  );
}

export const MovingCubes = () => {
  const { characters, socket } = useSocketStore();

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
