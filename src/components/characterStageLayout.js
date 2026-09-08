// Coordinates follow the captured seated animation (metres, facing +Z).
export const workstation = {
  desk: [0, .668, .62],
  desktop: [1.2, .06, .78],
  laptop: [-.04, .044, .075],
  keyboard: { width: .6, depth: .22, offset: [0, .015, -.025] },
  seat: [0, .435, .04],
  backrest: [0, .745, -.185],
  pivotZ: -.28,
};

export function stageCameraDistance(animation, closeup, aspect) {
  const halfFov = 17 * Math.PI / 180;
  if (animation === 'Typing') {
    // Include the desk's depth as it swings toward the camera on a full turn.
    return Math.max(closeup ? 3.3 : 3.9, .98 / (Math.tan(halfFov) * aspect) + .8);
  }
  return Math.max(closeup ? 2.15 : 3.7, 1.6 / (2 * Math.tan(halfFov) * aspect));
}
