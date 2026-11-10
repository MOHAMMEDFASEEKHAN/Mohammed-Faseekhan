import {
  lazy,
  PropsWithChildren,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const techStackRef = useRef<HTMLDivElement>(null);
  const [shouldLoadTechStack, setShouldLoadTechStack] = useState(false);

  useEffect(() => {
    setSplitText();
    let resizeTimeout: number | undefined;
    const resizeHandler = () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        setSplitText();
        ScrollTrigger.refresh();
      }, 150);
    };
    window.addEventListener("resize", resizeHandler, { passive: true });
    return () => {
      window.clearTimeout(resizeTimeout);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = techStackRef.current;
    if (!section || shouldLoadTechStack) return;
    if (!("IntersectionObserver" in window)) {
      setShouldLoadTechStack(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadTechStack(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [shouldLoadTechStack]);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      <div className="container-main">
        <Landing>{children}</Landing>
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <div ref={techStackRef}>
          {shouldLoadTechStack ? (
            <Suspense fallback={<div className="techstack" aria-hidden="true" />}>
              <TechStack />
            </Suspense>
          ) : (
            <div className="techstack" aria-hidden="true" />
          )}
        </div>
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;
