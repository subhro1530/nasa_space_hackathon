import { toSeconds } from "./utils";

export const bodies = {
  Mercury: {
    orbitingBody: "Sun",
    radius: 0.39,
    orbitTime: toSeconds(88, "days"),
    initialTheta: 0,
  },
  Venus: {
    orbitingBody: "Sun",
    radius: 0.72,
    orbitTime: toSeconds(225, "days"),
    initialTheta: 0,
  },
  Earth: {
    orbitingBody: "Sun",
    radius: 1,
    orbitTime: toSeconds(1, "years"),
    initialTheta: 0,
  },
  // Add other planets similarly...
};
