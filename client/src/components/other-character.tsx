import { useMemo, useRef } from "react";
import { Group, MathUtils, Vector3 } from "three";
import { Character } from "./character";

export function OtherCharacter(props: { position: Vector3 }) {
  const position = useMemo(() => props.position, [props.position]);

  const container = useRef<Group>(null);

  if (!container.current) {
    return;
  }

  container.current.rotation.x = MathUtils.lerp(
    container.current.rotation.x,
    position.x,
    0.1
  );

  container.current.rotation.z = MathUtils.lerp(
    container.current.rotation.z,
    position.z,
    0.1
  );

  return (
    // <RigidBody colliders={false} lockRotations ref={rb}>
    //   <group ref={container} position={position}>
    //     <Character scale={0.18} position-y={-0.25} animation={"idle"} />
    //   </group>
    //   <CapsuleCollider args={[0.08, 0.15]} />
    // </RigidBody>

    <group ref={container} position={position}>
      <Character scale={0.18} position-y={-0.25} animation={"idle"} />
    </group>
  );
}
