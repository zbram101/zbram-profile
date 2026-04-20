import { describe, expect, it } from "vitest";
import { getRailDensity, getSceneLayoutPreset } from "./layoutPresets";

describe("layout presets", () => {
  it("maps width to rail density tiers", () => {
    expect(getRailDensity(390)).toBe("compact");
    expect(getRailDensity(900)).toBe("comfortable");
    expect(getRailDensity(1280)).toBe("comfortable");
  });

  it("hides heavy scene accents on mobile", () => {
    const mobileProjects = getSceneLayoutPreset("projects", 390);
    const desktopProjects = getSceneLayoutPreset("projects", 1440);

    expect(mobileProjects.visible).toBe(false);
    expect(desktopProjects.visible).toBe(true);
  });

  it("returns null for unknown scene names", () => {
    expect(getSceneLayoutPreset("unknown", 900)).toBeNull();
  });
});
