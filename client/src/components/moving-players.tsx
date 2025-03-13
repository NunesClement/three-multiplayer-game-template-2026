import { Character as Character3D } from "./character";
import { useSocketStore } from "./socket-utils";
import { Vector3 } from "three";
import { Character } from "../../../common-interfaces";

function Player({ character }: { character: Character }) {
  return (
    <mesh
      position={
        new Vector3(
          character.position.x,
          character.position.y,
          character.position.z
        )
      }
      rotation={[0, character.rotation, 0]} // Add rotation in Y-axis (yaw)
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

export const MovingPlayers = () => {
  const { characters, socket } = useSocketStore();

  return (
    <>
      {characters.map((character) =>
        character.id !== socket.id ? (
          <Player key={character.id} character={character} />
        ) : null
      )}
    </>
  );
};
