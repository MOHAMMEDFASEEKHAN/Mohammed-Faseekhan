import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setCharTimeline, setAllTimeline } from "../utils/GsapScroll";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  useEffect(() => {
    const container = canvasDiv.current;
    if (!container) return;

    const bounds = container.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);
    const scene = sceneRef.current;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.innerWidth > 768 && window.devicePixelRatio <= 1.5,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, window.innerWidth <= 768 ? 1 : 1.5)
    );
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, width / height, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    const light = setLighting(scene);
    const progress = setProgress(setLoading);
    const { loadCharacter } = setCharacter(renderer, scene, camera);
    const clock = new THREE.Clock();
    const mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };
    let model: THREE.Object3D | null = null;
    let headBone: THREE.Object3D | null = null;
    let screenLight: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let cleanupHover: (() => void) | undefined;
    let cleanupIntro: (() => void) | undefined;
    let frameId = 0;
    let disposed = false;
    let isVisible = false;
    let touchInterpolationTimeout: number | undefined;

    const renderFrame = () => {
      frameId = 0;
      if (disposed || document.hidden || !isVisible) return;

      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        if (screenLight) light.setPointLight(screenLight);
      }
      mixer?.update(clock.getDelta());
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(renderFrame);
    };
    const requestRender = () => {
      if (!frameId && !disposed && !document.hidden && isVisible) {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      } else {
        clock.getDelta();
        requestRender();
      }
    };
    const onResize = () => handleResize(renderer, camera, canvasDiv);
    const onMouseMove = (event: MouseEvent) =>
      handleMouseMove(event, (x, y) => Object.assign(mouse, { x, y }));
    const onTouchMove = (event: TouchEvent) =>
      handleTouchMove(event, (x, y) => Object.assign(mouse, { x, y }));
    const onTouchEnd = () => {
      mouse.x = 0;
      mouse.y = 0;
      interpolation = { x: 0.03, y: 0.03 };
      window.clearTimeout(touchInterpolationTimeout);
      touchInterpolationTimeout = window.setTimeout(() => {
        interpolation = { x: 0.1, y: 0.2 };
      }, 1000);
    };

    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              isVisible = entry.isIntersecting;
              if (isVisible) {
                clock.getDelta();
                requestRender();
              } else {
                window.cancelAnimationFrame(frameId);
                frameId = 0;
              }
            },
            { rootMargin: "100px" }
          )
        : null;
    if (observer) {
      observer.observe(container);
    } else {
      isVisible = true;
      requestRender();
    }

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.addEventListener("mousemove", onMouseMove, { passive: true });
    }
    const landingDiv = document.getElementById("landingDiv");
    landingDiv?.addEventListener("touchmove", onTouchMove, { passive: true });
    landingDiv?.addEventListener("touchend", onTouchEnd, { passive: true });

    void loadCharacter()
      .then((gltf) => {
        if (disposed || !gltf) return;

        setCharTimeline(gltf.scene, camera);
        setAllTimeline();
        const animations = setAnimations(gltf);
        if (hoverDivRef.current) {
          cleanupHover = animations.hover(gltf, hoverDivRef.current);
        }
        mixer = animations.mixer;
        model = gltf.scene;
        scene.add(model);
        headBone = model.getObjectByName("spine006") ?? null;
        screenLight = model.getObjectByName("screenlight") ?? null;

        void progress.loaded().then(() => {
          if (disposed) return;
          light.turnOnLights();
          cleanupIntro = animations.startIntro();
          requestRender();
        });
      })
      .catch((error: unknown) => {
        if (!disposed) {
          console.error("Unable to load the character scene:", error);
          progress.clear();
        }
      });

    return () => {
      disposed = true;
      observer?.disconnect();
      progress.cancel();
      cleanupHover?.();
      cleanupIntro?.();
      window.clearTimeout(touchInterpolationTimeout);
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("mousemove", onMouseMove);
      landingDiv?.removeEventListener("touchmove", onTouchMove);
      landingDiv?.removeEventListener("touchend", onTouchEnd);
      mixer?.stopAllAction();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value instanceof THREE.Texture) value.dispose();
            });
            material.dispose();
          });
        }
      });
      scene.clear();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [setLoading]);

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim"></div>
        <div className="character-hover" ref={hoverDivRef}></div>
      </div>
    </div>
  );
};

export default Scene;
