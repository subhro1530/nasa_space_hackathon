import { useState } from "react";
import ThreeDScene from "./ThreeDScene";
import ControlPanel from "./ControlPanel";
import { calculatePositions } from "./orrery";

export default function Home() {
  const [positions, setPositions] = useState(calculatePositions(0));

  const handleInput = (days) => {
    setPositions(calculatePositions(days));
  };

  return (
    <>
      <ControlPanel onSubmit={handleInput} />
      <ThreeDScene positions={positions} />
    </>
  );
}
