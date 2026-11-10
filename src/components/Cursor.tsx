import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;

    const moveX = gsap.quickTo(cursor, "x", {
      duration: 0.16,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(cursor, "y", {
      duration: 0.16,
      ease: "power3.out",
    });
    const onMouseMove = (event: MouseEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
    };
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cursor]")
    );
    const enterHandlers = new Map<HTMLElement, () => void>();
    const leaveHandlers = new Map<HTMLElement, () => void>();

    targets.forEach((element) => {
      const onEnter = () => {
        if (element.dataset.cursor === "icons") {
          const rect = element.getBoundingClientRect();
          cursor.classList.add("cursor-icons");
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
          moveX(rect.left);
          moveY(rect.top);
        } else if (element.dataset.cursor === "disable") {
          cursor.classList.add("cursor-disable");
        }
      };
      const onLeave = () =>
        cursor.classList.remove("cursor-disable", "cursor-icons");
      enterHandlers.set(element, onEnter);
      leaveHandlers.set(element, onLeave);
      element.addEventListener("pointerenter", onEnter);
      element.addEventListener("pointerleave", onLeave);
    });
    document.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      targets.forEach((element) => {
        element.removeEventListener("pointerenter", enterHandlers.get(element)!);
        element.removeEventListener("pointerleave", leaveHandlers.get(element)!);
      });
      gsap.killTweensOf(cursor);
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
