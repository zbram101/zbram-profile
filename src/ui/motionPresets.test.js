import { describe, expect, it } from "vitest";
import {
  MOTION_INTENSITY_PRESETS,
  REDUCED_MOTION_PRESET,
  getMotionPreset,
} from "./motionPresets";

describe("motion presets", () => {
  it("returns the medium preset by default", () => {
    expect(getMotionPreset()).toEqual(MOTION_INTENSITY_PRESETS.medium);
  });

  it("returns the requested intensity preset when available", () => {
    expect(getMotionPreset({ intensity: "subtle" })).toEqual(
      MOTION_INTENSITY_PRESETS.subtle
    );
  });

  it("falls back to medium for unknown intensity values", () => {
    expect(getMotionPreset({ intensity: "unknown" })).toEqual(
      MOTION_INTENSITY_PRESETS.medium
    );
  });

  it("returns reduced motion preset when reducedMotion is true", () => {
    expect(getMotionPreset({ intensity: "high", reducedMotion: true })).toEqual(
      REDUCED_MOTION_PRESET
    );
  });
});
