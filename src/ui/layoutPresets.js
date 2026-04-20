import { getViewportTier } from "../hooks/useViewport";

export const RAIL_DENSITY_PRESETS = {
  mobile: "compact",
  tablet: "comfortable",
  desktop: "comfortable",
};

export const SCENE_LAYOUT_PRESETS = {
  skills: {
    mobile: { x: 3.15, z: -0.92, scale: 0.24, visible: true },
    tablet: { x: 4.35, z: -0.94, scale: 0.4, visible: true },
    desktop: { x: 5.15, z: -0.92, scale: 0.5, visible: true },
  },
  projects: {
    mobile: { x: 0, z: 0, scale: 0, visible: false },
    tablet: { x: 4.4, z: -1.05, scale: 0.28, visible: true },
    desktop: { x: 5.25, z: -1.02, scale: 0.38, visible: true },
  },
  workExp: {
    mobile: { x: 0, z: 0, scale: 0, visible: false },
    tablet: { x: 4.15, z: -0.46, scale: 0.48, visible: true },
    desktop: { x: 5.9, z: -0.48, scale: 0.66, visible: true },
  },
};

export function getRailDensity(width) {
  const tier = getViewportTier(width);
  return RAIL_DENSITY_PRESETS[tier];
}

export function getSceneLayoutPreset(sceneName, width) {
  const tier = getViewportTier(width);
  const sceneConfig = SCENE_LAYOUT_PRESETS[sceneName];

  if (!sceneConfig) {
    return null;
  }

  return sceneConfig[tier];
}
