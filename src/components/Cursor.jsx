import { useEffect, useRef, useState } from "react";

const CURSOR_SPEED = 0.08;

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;

export const Cursor = () => {
  const cursorOutline = useRef();
  const [hoverButton, setHoverButton] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const animate = () => {
    if (!cursorOutline.current) {
      return;
    }

    let distX = mouseX - outlineX;
    let distY = mouseY - outlineY;

    outlineX = outlineX + distX * CURSOR_SPEED;
    outlineY = outlineY + distY * CURSOR_SPEED;

    cursorOutline.current.style.left = `${outlineX}px`;
    cursorOutline.current.style.top = `${outlineY}px`;
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const supportsFinePointer =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    setEnabled(Boolean(supportsFinePointer));

    if (!supportsFinePointer) {
      return undefined;
    }

    const onMouseMove = (event) => {
      mouseX = event.pageX;
      mouseY = event.pageY;
    };

    document.addEventListener("mousemove", onMouseMove);

    const animateEvent = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animateEvent);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const onMouseOver = (event) => {
      const target = event.target;
      const tagName = target?.tagName?.toLowerCase?.();
      const parentTagName = target?.parentElement?.tagName?.toLowerCase?.();

      if (
        tagName === "button" ||
        parentTagName === "button" ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "a"
      ) {
        setHoverButton(true);
      } else {
        setHoverButton(false);
      }
    };

    document.addEventListener("mouseover", onMouseOver);

    return () => {
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <div
        className={`z-50 fixed -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-transform
        ${
          hoverButton
            ? "h-6 w-6 border border-[#be6841]/70 bg-transparent"
            : "h-3.5 w-3.5 bg-[#0f5c62]/85"
        }`}
        ref={cursorOutline}
      ></div>
    </>
  );
};
