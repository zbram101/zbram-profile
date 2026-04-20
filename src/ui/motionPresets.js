const MOTION_INTENSITY_PRESETS = {
  subtle: {
    sectionReveal: { offsetY: 24, duration: 0.7, delay: 0.12 },
    panelReveal: { offsetY: 20, scaleFrom: 0.985, duration: 0.55, delayStep: 0.05 },
    hover: { lift: 4, scale: 1.002, tiltX: 1.1, tiltY: 1.2, sweepOpacity: 0.25 },
    ambient: { shiftX: 12, shiftY: 8, duration: 16 },
    scene: { autoRotateSpeed: 0.05, orbitSpeed: 0.06, smoothing: 3.4 },
  },
  medium: {
    sectionReveal: { offsetY: 36, duration: 0.86, delay: 0.18 },
    panelReveal: { offsetY: 28, scaleFrom: 0.975, duration: 0.68, delayStep: 0.07 },
    hover: { lift: 7, scale: 1.004, tiltX: 2.1, tiltY: 2.4, sweepOpacity: 0.36 },
    ambient: { shiftX: 18, shiftY: 12, duration: 13.5 },
    scene: { autoRotateSpeed: 0.08, orbitSpeed: 0.12, smoothing: 4 },
  },
  high: {
    sectionReveal: { offsetY: 44, duration: 1, delay: 0.2 },
    panelReveal: { offsetY: 34, scaleFrom: 0.965, duration: 0.8, delayStep: 0.09 },
    hover: { lift: 9, scale: 1.006, tiltX: 2.6, tiltY: 2.9, sweepOpacity: 0.42 },
    ambient: { shiftX: 22, shiftY: 16, duration: 11.5 },
    scene: { autoRotateSpeed: 0.11, orbitSpeed: 0.15, smoothing: 4.4 },
  },
};

const REDUCED_MOTION_PRESET = {
  sectionReveal: { offsetY: 8, duration: 0.32, delay: 0.03 },
  panelReveal: { offsetY: 8, scaleFrom: 1, duration: 0.28, delayStep: 0 },
  hover: { lift: 1, scale: 1, tiltX: 0, tiltY: 0, sweepOpacity: 0.08 },
  ambient: { shiftX: 0, shiftY: 0, duration: 0 },
  scene: { autoRotateSpeed: 0.01, orbitSpeed: 0.01, smoothing: 2.4 },
};

export function getMotionPreset({ intensity = "medium", reducedMotion = false } = {}) {
  if (reducedMotion) {
    return REDUCED_MOTION_PRESET;
  }

  return MOTION_INTENSITY_PRESETS[intensity] || MOTION_INTENSITY_PRESETS.medium;
}

export { MOTION_INTENSITY_PRESETS, REDUCED_MOTION_PRESET };
