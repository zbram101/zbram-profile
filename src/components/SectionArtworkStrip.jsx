import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";
import { useViewport } from "../hooks/useViewport";
import { getMotionPreset } from "../ui/motionPresets";

const PAGE_COUNT = 6;
const VARIANTS = ["neural", "pipeline", "radar", "circuit", "hex", "wave"];

function getTierPlacement(tier) {
  if (tier === "mobile") {
    return { x: 1.9, z: -1.28, scale: 0.5, yOffset: 1.02 };
  }

  if (tier === "tablet") {
    return { x: 2.34, z: -1.2, scale: 0.7, yOffset: 1.16 };
  }

  return { x: 2.76, z: -1.14, scale: 0.86, yOffset: 1.3 };
}

function Edge({ from, to, color = "#8cb3be", opacity = 0.24 }) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2;

  return (
    <mesh position={[midX, midY, 0]} rotation={[0, 0, angle]} renderOrder={-2}>
      <boxGeometry args={[length, 0.035, 0.035]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function Node({ position, accent = false, radius = 0.07 }) {
  return (
    <mesh position={position} renderOrder={-2}>
      <sphereGeometry args={[radius, 12, 12]} />
      <meshBasicMaterial
        color={accent ? "#dfa07a" : "#0d5c63"}
        transparent
        opacity={accent ? 0.74 : 0.68}
      />
    </mesh>
  );
}

function NeuralMotif({ index, registerRotor }) {
  const nodes = [
    [-1.48, 1.98, 0],
    [-0.84, 1.42, 0],
    [-0.14, 2.18, 0],
    [0.62, 1.56, 0],
    [1.36, 2.06, 0],
    [-1.12, 0.62, 0],
    [-0.22, 0.92, 0],
    [0.48, 0.42, 0],
    [1.32, 0.84, 0],
  ];

  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [1, 6], [2, 6], [3, 7], [4, 8],
    [5, 6], [6, 7], [7, 8], [1, 5], [2, 7], [3, 8],
  ];

  return (
    <>
      <group ref={registerRotor}>
        {edges.map(([left, right]) => (
          <Edge key={`neural-edge-${index}-${left}-${right}`} from={nodes[left]} to={nodes[right]} />
        ))}
      </group>
      {nodes.map((position, nodeIndex) => (
        <Node
          key={`neural-node-${index}-${nodeIndex}`}
          position={position}
          accent={nodeIndex % 3 === 0}
          radius={0.08}
        />
      ))}
    </>
  );
}

function PipelineMotif({ index, registerRotor }) {
  return (
    <>
      <group ref={registerRotor}>
        {Array.from({ length: 10 }).map((_, row) => (
          <mesh
            key={`pipe-row-${index}-${row}`}
            position={[0.28, 2.24 - row * 0.32, row % 2 === 0 ? 0.14 : -0.12]}
            rotation={[0, row % 2 === 0 ? 0.18 : -0.18, 0]}
            renderOrder={-2}
          >
            <boxGeometry args={[2.58 - row * 0.12, 0.11, 0.08]} />
            <meshBasicMaterial
              color={row % 3 === 0 ? "#dfa07a" : "#0d5c63"}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>
      {Array.from({ length: 6 }).map((_, point) => (
        <Node
          key={`pipe-node-${index}-${point}`}
          position={[-1.24 + point * 0.55, 0.38 + point * 0.34, 0]}
          accent={point % 2 === 0}
        />
      ))}
    </>
  );
}

function RadarMotif({ index, registerRotor }) {
  return (
    <>
      <group ref={registerRotor}>
        {[2.42, 1.84, 1.24].map((radius, ringIndex) => (
          <mesh key={`radar-ring-${index}-${ringIndex}`} rotation={[Math.PI / 2, 0, 0]} renderOrder={-2}>
            <ringGeometry args={[radius, radius + 0.045, 64]} />
            <meshBasicMaterial
              color={ringIndex === 1 ? "#dfa07a" : "#0d5c63"}
              transparent
              opacity={ringIndex === 1 ? 0.34 : 0.26}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]} renderOrder={-2}>
          <ringGeometry args={[0.24, 2.5, 3]} />
          <meshBasicMaterial color="#8cb3be" transparent opacity={0.24} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {Array.from({ length: 12 }).map((_, point) => {
        const angle = (Math.PI * 2 * point) / 12;
        const radius = point % 2 === 0 ? 2.22 : 1.46;
        return (
          <Node
            key={`radar-point-${index}-${point}`}
            position={[Math.cos(angle) * radius, 1.02 + Math.sin(angle) * radius, 0]}
            accent={point % 3 === 0}
            radius={0.065}
          />
        );
      })}
    </>
  );
}

function CircuitMotif({ index, registerRotor }) {
  const traces = [
    [[-1.58, 2.08, 0], [-0.42, 2.08, 0]],
    [[-0.42, 2.08, 0], [-0.42, 1.32, 0]],
    [[-0.42, 1.32, 0], [0.92, 1.32, 0]],
    [[0.92, 1.32, 0], [0.92, 0.56, 0]],
    [[0.92, 0.56, 0], [1.68, 0.56, 0]],
    [[-1.2, 0.62, 0], [0.08, 0.62, 0]],
    [[0.08, 0.62, 0], [0.08, 1.82, 0]],
    [[0.08, 1.82, 0], [1.32, 1.82, 0]],
  ];

  return (
    <>
      <group ref={registerRotor}>
        {traces.map(([from, to], traceIndex) => (
          <Edge
            key={`circuit-trace-${index}-${traceIndex}`}
            from={from}
            to={to}
            color={traceIndex % 2 === 0 ? "#0d5c63" : "#8cb3be"}
            opacity={0.4}
          />
        ))}
      </group>
      {Array.from({ length: 12 }).map((_, nodeIndex) => (
        <Node
          key={`circuit-node-${index}-${nodeIndex}`}
          position={[-1.5 + (nodeIndex % 4) * 1.06, 0.56 + Math.floor(nodeIndex / 4) * 0.72, 0]}
          accent={nodeIndex % 3 === 0}
        />
      ))}
    </>
  );
}

function HexMotif({ index, registerRotor }) {
  const rows = [
    [-1.22, 2.02, 3],
    [-1.72, 1.32, 4],
    [-1.22, 0.62, 3],
  ];

  return (
    <>
      <group ref={registerRotor}>
        {rows.map(([startX, y, count], rowIndex) =>
          Array.from({ length: count }).map((_, col) => {
            const x = startX + col * 1.02;
            return (
              <mesh key={`hex-cell-${index}-${rowIndex}-${col}`} position={[x, y, 0]} renderOrder={-2}>
                <ringGeometry args={[0.26, 0.31, 6]} />
                <meshBasicMaterial
                  color={(col + rowIndex) % 2 === 0 ? "#0d5c63" : "#dfa07a"}
                  transparent
                  opacity={0.44}
                  side={THREE.DoubleSide}
                />
              </mesh>
            );
          })
        )}
      </group>
      {rows.map(([startX, y, count], rowIndex) =>
        Array.from({ length: count }).map((_, col) => {
          const x = startX + col * 1.02;
          return (
            <Node
              key={`hex-node-${index}-${rowIndex}-${col}`}
              position={[x, y, 0]}
              accent={(col + rowIndex) % 2 === 1}
              radius={0.055}
            />
          );
        })
      )}
    </>
  );
}

function WaveMotif({ index, registerRotor }) {
  return (
    <>
      <group ref={registerRotor}>
        {Array.from({ length: 12 }).map((_, stripIndex) => {
          const x = -1.82 + stripIndex * 0.34;
          const y = 1.18 + Math.sin(stripIndex * 0.68) * 0.72;
          return (
            <mesh key={`wave-strip-${index}-${stripIndex}`} position={[x, y, 0]} rotation={[0, 0, Math.sin(stripIndex * 0.55) * 0.28]} renderOrder={-2}>
              <boxGeometry args={[0.28, 1.56 - (stripIndex % 3) * 0.22, 0.08]} />
              <meshBasicMaterial
                color={stripIndex % 2 === 0 ? "#0d5c63" : "#dfa07a"}
                transparent
                opacity={0.62}
              />
            </mesh>
          );
        })}
      </group>
      {Array.from({ length: 8 }).map((_, point) => (
        <Node
          key={`wave-node-${index}-${point}`}
          position={[-1.78 + point * 0.5, 0.38 + Math.cos(point * 0.75) * 0.52, 0]}
          accent={point % 2 === 0}
          radius={0.06}
        />
      ))}
    </>
  );
}

function ClusterByVariant({ variant, index, registerRotor }) {
  if (variant === "neural") {
    return <NeuralMotif index={index} registerRotor={registerRotor} />;
  }

  if (variant === "pipeline") {
    return <PipelineMotif index={index} registerRotor={registerRotor} />;
  }

  if (variant === "radar") {
    return <RadarMotif index={index} registerRotor={registerRotor} />;
  }

  if (variant === "circuit") {
    return <CircuitMotif index={index} registerRotor={registerRotor} />;
  }

  if (variant === "hex") {
    return <HexMotif index={index} registerRotor={registerRotor} />;
  }

  return <WaveMotif index={index} registerRotor={registerRotor} />;
}

function ArtworkCluster({ index, variant, pageY, baseX, baseZ, scale, reducedMotion, registerRoot, registerRotor }) {
  const xShift = (index % 2 === 0 ? -0.06 : 0.14);

  return (
    <group position={[baseX + xShift, pageY, baseZ]} scale={scale} ref={registerRoot} renderOrder={-2}>
      <mesh position={[0.1, 1.04, -0.18]} rotation={[Math.PI / 2, 0, 0]} renderOrder={-2}>
        <ringGeometry args={[1.6, 3.3, 64]} />
        <meshBasicMaterial color="#0d5c63" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.56, 1.1, -0.26]} rotation={[Math.PI / 2, 0, 0]} renderOrder={-2}>
        <ringGeometry args={[0.8, 2.05, 48]} />
        <meshBasicMaterial color="#dfa07a" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      <ClusterByVariant variant={variant} index={index} registerRotor={registerRotor} />

      <mesh position={[1.92, 1.06, 0.02]} renderOrder={-2}>
        <sphereGeometry args={[0.2, 14, 14]} />
        <meshBasicMaterial color="#dfa07a" transparent opacity={reducedMotion ? 0.16 : 0.24} />
      </mesh>
    </group>
  );
}

export const SectionArtworkStrip = () => {
  const { viewport } = useThree();
  const { tier } = useViewport();
  const reducedMotion = useReducedMotionPreference();
  const motionPreset = getMotionPreset({ intensity: "medium", reducedMotion });
  const rootRefs = useRef([]);
  const rotorRefs = useRef([]);
  const placement = getTierPlacement(tier);

  const sections = useMemo(
    () =>
      Array.from({ length: PAGE_COUNT }, (_, index) => ({
        index,
        variant: VARIANTS[index % VARIANTS.length],
        pageY: -viewport.height * index - placement.yOffset,
      })).filter((section) => section.index !== 1 && section.index !== 3),
    [viewport.height, placement.yOffset]
  );

  useFrame((state, delta) => {
    sections.forEach((section, index) => {
      const phase = section.index % 2 === 0 ? 1 : -1;
      const root = rootRefs.current[index];
      const rotor = rotorRefs.current[index];

      if (!root || !rotor) {
        return;
      }

      if (reducedMotion) {
        root.position.y = section.pageY;
        return;
      }

      const time = state.clock.getElapsedTime();
      const driftY = Math.sin(time * 0.42 + section.index * 0.6) * 0.03;
      const driftX = Math.cos(time * 0.18 + section.index) * 0.018;

      root.position.y = THREE.MathUtils.lerp(
        root.position.y,
        section.pageY + driftY,
        1 - Math.exp(-delta * 2.2)
      );
      root.position.x = THREE.MathUtils.lerp(
        root.position.x,
        placement.x + (section.index % 2 === 0 ? -0.06 : 0.14) + driftX,
        1 - Math.exp(-delta * 2.1)
      );
      root.rotation.y = THREE.MathUtils.lerp(
        root.rotation.y,
        phase * 0.08,
        1 - Math.exp(-delta * 1.8)
      );

      rotor.rotation.z += delta * motionPreset.scene.orbitSpeed * 0.34 * phase;
      rotor.rotation.y += delta * motionPreset.scene.autoRotateSpeed * 0.1;
    });
  });

  return (
    <group>
      {sections.map((section, index) => (
        <ArtworkCluster
          key={`section-artwork-${section.index}`}
          index={section.index}
          variant={section.variant}
          pageY={section.pageY}
          baseX={placement.x}
          baseZ={placement.z}
          scale={placement.scale}
          reducedMotion={reducedMotion}
          registerRoot={(node) => {
            rootRefs.current[index] = node;
          }}
          registerRotor={(node) => {
            rotorRefs.current[index] = node;
          }}
        />
      ))}
    </group>
  );
};
