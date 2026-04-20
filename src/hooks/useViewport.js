import { useEffect, useState } from "react";

export const VIEWPORT_BREAKPOINTS = {
  mobileMax: 767,
  tabletMax: 1199,
  minWidth: 390,
  maxWidth: 1440,
};

function getViewportWidth() {
  if (typeof window === "undefined") {
    return VIEWPORT_BREAKPOINTS.maxWidth;
  }

  return window.innerWidth;
}

export function getViewportTier(width) {
  if (width <= VIEWPORT_BREAKPOINTS.mobileMax) {
    return "mobile";
  }

  if (width <= VIEWPORT_BREAKPOINTS.tabletMax) {
    return "tablet";
  }

  return "desktop";
}

export function clampViewportWidth(
  width,
  minWidth = VIEWPORT_BREAKPOINTS.minWidth,
  maxWidth = VIEWPORT_BREAKPOINTS.maxWidth
) {
  return Math.min(Math.max(width, minWidth), maxWidth);
}

export function useViewport() {
  const [width, setWidth] = useState(getViewportWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tier = getViewportTier(width);

  return {
    width,
    tier,
    isTablet: tier === "tablet",
    isMobile: tier === "mobile",
    isDesktop: tier === "desktop",
  };
}

export function interpolateViewport(
  width,
  mobileValue,
  desktopValue,
  minWidth = VIEWPORT_BREAKPOINTS.minWidth,
  maxWidth = VIEWPORT_BREAKPOINTS.maxWidth
) {
  const clampedWidth = clampViewportWidth(width, minWidth, maxWidth);
  const progress = (clampedWidth - minWidth) / (maxWidth - minWidth);

  return mobileValue + (desktopValue - mobileValue) * progress;
}
