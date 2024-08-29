// orrery.js
import { bodies } from "./bodies";

export const calculatePositions = (days) => {
  const positions = {};
  const elapsedSeconds = days * 86400; // Convert days to seconds

  for (const body in bodies) {
    const { radius, orbitTime, initialTheta } = bodies[body];
    const angle =
      (initialTheta + (elapsedSeconds / orbitTime) * 2 * Math.PI) %
      (2 * Math.PI);
    positions[body] = { radius, angle };
  }

  return positions;
};
