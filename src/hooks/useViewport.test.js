import { describe, expect, it } from "vitest";
import {
  VIEWPORT_BREAKPOINTS,
  clampViewportWidth,
  getViewportTier,
  interpolateViewport,
} from "./useViewport";

describe("useViewport utilities", () => {
  it("maps viewport widths to mobile/tablet/desktop tiers at boundaries", () => {
    expect(getViewportTier(390)).toBe("mobile");
    expect(getViewportTier(VIEWPORT_BREAKPOINTS.mobileMax)).toBe("mobile");
    expect(getViewportTier(VIEWPORT_BREAKPOINTS.mobileMax + 1)).toBe("tablet");
    expect(getViewportTier(VIEWPORT_BREAKPOINTS.tabletMax)).toBe("tablet");
    expect(getViewportTier(VIEWPORT_BREAKPOINTS.tabletMax + 1)).toBe("desktop");
  });

  it("clamps viewport widths to configured min and max", () => {
    expect(clampViewportWidth(200)).toBe(VIEWPORT_BREAKPOINTS.minWidth);
    expect(clampViewportWidth(900)).toBe(900);
    expect(clampViewportWidth(2200)).toBe(VIEWPORT_BREAKPOINTS.maxWidth);
  });

  it("interpolates values across viewport width range", () => {
    expect(interpolateViewport(390, 10, 20)).toBe(10);
    expect(interpolateViewport(1440, 10, 20)).toBe(20);
    expect(interpolateViewport((390 + 1440) / 2, 10, 20)).toBeCloseTo(15, 5);
  });
});
