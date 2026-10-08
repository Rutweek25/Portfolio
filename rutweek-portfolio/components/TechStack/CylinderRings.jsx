"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

/**
 * CylinderRings — stacked text ribbons wrapped around a cylinder.
 * Each ring auto-rotates (alternating direction), fades out toward the silhouette edges,
 * pauses nothing on hover, and is clickable.
 *
 * Needs only: react + three. No GSAP / ScrollTrigger.
 * Fonts used on the canvas (load them in your CSS / <link>): Montserrat, JetBrains Mono, Bebas Neue.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TEX_W = 6144;
const TEX_H = 640;
const REPEATS = 2;
const BLOCK_W = TEX_W / REPEATS;

const RADIUS = 3.8;
const BAND_H = (2 * Math.PI * RADIUS) / (TEX_W / TEX_H);
const GAP = 0.18;
const PITCH = BAND_H + GAP;
const ELEVATION = THREE.MathUtils.degToRad(17);
const CAMERA_FOV = 38;

const ROTATION_SPEEDS = [0.32, 0.45, 0.26, 0.38];
const START_ANGLES = [0, 2.4, 4.4, 1.2];

const FONT_DISPLAY = `"Montserrat", "Arial Black", "Helvetica Neue", sans-serif`;
const FONT_SANS = `"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
const FONT_MONO = `"JetBrains Mono", ui-monospace, Menlo, monospace`;
const FONT_CONDENSED = `"Bebas Neue", "Oswald", "Arial Narrow", Impact, sans-serif`;

const DEFAULT_CONFIGS = [
  { accent: "#a9dc98", specItems: ["Spec one", "Spec two", "Spec three", "Spec four"] },
  { accent: "#8fb8e3", specItems: ["Spec one", "Spec two", "Spec three", "Spec four"] },
  { accent: "#ff6a6a", specItems: ["Spec one", "Spec two", "Spec three", "Spec four"] },
  { accent: "#e8dcc5", specItems: ["Spec one", "Spec two", "Spec three", "Spec four"] }
];

// ---------------------------------------------------------------------------
// Canvas helpers
// ---------------------------------------------------------------------------
function fitFontSize(ctx, text, fontFn, maxW, start, min) {
  let size = start;
  while (size > min) {
    ctx.font = fontFn(size);
    if (ctx.measureText(text).width <= maxW) break;
    size -= 4;
  }
  return size;
}

function wrapLines(ctx, text, maxW, maxLines) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    let last = lines[maxLines - 1];
    while (ctx.measureText(last + "…").width > maxW && last.length > 1) last = last.slice(0, -1);
    lines[maxLines - 1] = last.trimEnd() + "…";
  }
  return lines;
}

function createBandTexture(item, config, scale, anisotropy) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(TEX_W * scale);
  canvas.height = Math.round(TEX_H * scale);
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  const P = 90;
  const left = -BLOCK_W / 2 + P;
  const right = BLOCK_W / 2 - P;

  const title = String(item.title || "").toUpperCase();
  const badgeText = String(item.category || "").toUpperCase();

  ctx.font = `400 52px ${FONT_CONDENSED}`;
  const badgeW = badgeText ? ctx.measureText(badgeText).width + 60 : 0;

  const titleMaxW = right - left - badgeW - 80;
  const titleSize = fitFontSize(ctx, title, (s) => `900 ${s}px ${FONT_DISPLAY}`, titleMaxW, 210, 75);
  ctx.font = `900 ${titleSize}px ${FONT_DISPLAY}`;
  const titleW = ctx.measureText(title).width;

  const COL_A_W = 1130;
  const COL_B_W = 700;
  const GUT = 55;
  const colAx = left;
  const div1x = colAx + COL_A_W + GUT;
  const colBx = div1x + GUT;
  const div2x = colBx + COL_B_W + GUT;
  const colCx = div2x + GUT;
  const colCw = right - colCx;

  ctx.font = `500 38px ${FONT_SANS}`;
  const descLines = wrapLines(ctx, item.description || "", COL_A_W, 4);

  const specs = config.specItems || [];
  const specSize = specs.reduce(
    (min, s) => Math.min(min, fitFontSize(ctx, s, (sz) => `500 ${sz}px ${FONT_MONO}`, COL_B_W, 34, 22)),
    34
  );

  const words = String(item.metrics || "").split(/\s+/).filter(Boolean);
  const metricBig = words.slice(0, 2).join(" ");
  const metricRest = words.slice(2).join(" ");
  const metricSize = fitFontSize(ctx, metricBig, (s) => `900 ${s}px ${FONT_DISPLAY}`, colCw, 76, 38);
  ctx.font = `500 34px ${FONT_SANS}`;
  const metricLines = wrapLines(ctx, metricRest, colCw, 3);

  const drawBlock = (cx) => {
    ctx.save();
    ctx.translate(cx, 0);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = config.accent;
    ctx.font = `900 ${titleSize}px ${FONT_DISPLAY}`;
    ctx.fillText(title, left, 230);
    ctx.fillRect(left, 252, titleW, 6);

    if (badgeText) {
      const bx = right - badgeW;
      const by = 90;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(bx, by, badgeW, 85, 10);
      else ctx.rect(bx, by, badgeW, 85);
      ctx.fill();
      ctx.fillStyle = "#0a0a0a";
      ctx.font = `400 52px ${FONT_CONDENSED}`;
      ctx.fillText(badgeText, bx + 30, by + 60);
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.font = `500 38px ${FONT_SANS}`;
    descLines.forEach((l, i) => ctx.fillText(l, colAx, 340 + i * 54));

    ctx.fillStyle = config.accent;
    ctx.fillRect(div1x, 300, 4, 230);
    ctx.fillRect(div2x, 300, 4, 230);

    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = `500 ${specSize}px ${FONT_MONO}`;
    specs.forEach((s, i) => ctx.fillText(s, colBx, 340 + i * 54));

    ctx.fillStyle = config.accent;
    ctx.font = `900 ${metricSize}px ${FONT_DISPLAY}`;
    ctx.fillText(metricBig, colCx, 360);
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    ctx.font = `500 34px ${FONT_SANS}`;
    metricLines.forEach((l, i) => ctx.fillText(l, colCx, 425 + i * 46));

    ctx.restore();
  };

  for (let k = 0; k <= REPEATS; k++) drawBlock(k * BLOCK_W);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = anisotropy;
  return texture;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function CylinderRings({
  items = [],
  configs = DEFAULT_CONFIGS,
  onSelect,
  setCursorState,
  style
}) {
  const containerRef = useRef(null);

  const onSelectRef = useRef(onSelect);
  const cursorRef = useRef(setCursorState);
  useEffect(() => {
    onSelectRef.current = onSelect;
    cursorRef.current = setCursorState;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !items.length) return;

    const N = items.length;
    let disposed = false;
    let width = container.clientWidth || 1;
    let height = container.clientHeight || 1;

    const reduceMotion = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const motionScale = reduceMotion ? 0.2 : 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, width / height, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "pan-y";
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, BAND_H, 160, 1, true);
    const materials = [];
    const textures = [];
    const bands = [];
    const frontMeshes = [];

    const applyEdgeFade = (mat) => {
      mat.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader
          .replace("#include <common>", "#include <common>\nvarying float vFacing;")
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
             vec3 nView = normalize(normalMatrix * normal);
             vec3 pView = (modelViewMatrix * vec4(position, 1.0)).xyz;
             vFacing = abs(dot(nView, normalize(-pView)));`
          );
        shader.fragmentShader = shader.fragmentShader
          .replace("#include <common>", "#include <common>\nvarying float vFacing;")
          .replace(
            "#include <map_fragment>",
            `#include <map_fragment>
             diffuseColor.a *= smoothstep(0.02, 0.5, vFacing);`
          );
      };
      mat.customProgramCacheKey = () => "ring-edge-fade";
    };

    const makeMat = (map, side, baseOpacity) => {
      const mat = new THREE.MeshBasicMaterial({
        map,
        side,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        toneMapped: false
      });
      mat.userData.baseOpacity = baseOpacity;
      applyEdgeFade(mat);
      return mat;
    };

    const buildBands = () => {
      const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      const scale = Math.min(1, renderer.capabilities.maxTextureSize / TEX_W);

      items.forEach((item, idx) => {
        const config = {
          ...configs[idx % configs.length],
          ...(item.accent ? { accent: item.accent } : {}),
          ...(item.specItems ? { specItems: item.specItems } : {})
        };
        const texture = createBandTexture(item, config, scale, aniso);
        textures.push(texture);

        const frontMat = makeMat(texture, THREE.FrontSide, 1);
        const backMat = makeMat(texture, THREE.BackSide, 0.4);
        materials.push(frontMat, backMat);

        const group = new THREE.Group();
        group.position.y = ((N - 1) / 2 - idx) * PITCH;

        const back = new THREE.Mesh(geometry, backMat);
        back.renderOrder = 0;
        const front = new THREE.Mesh(geometry, frontMat);
        front.renderOrder = 1;
        front.userData = { index: idx };

        group.add(back, front);
        root.add(group);

        const angle = START_ANGLES[idx % START_ANGLES.length];
        group.rotation.y = angle;
        bands.push({
          group,
          angle,
          dir: idx % 2 === 0 ? 1 : -1,
          speed: ROTATION_SPEEDS[idx % ROTATION_SPEEDS.length]
        });
        frontMeshes.push(front);
      });
    };

    const fontLoads = Promise.all([
      document.fonts.load(`900 100px "Montserrat"`),
      document.fonts.load(`500 40px "Montserrat"`),
      document.fonts.load(`500 40px "JetBrains Mono"`),
      document.fonts.load(`400 66px "Bebas Neue"`)
    ]).catch(() => {});
    Promise.race([fontLoads, new Promise((r) => setTimeout(r, 2500))]).then(() => {
      if (!disposed) buildBands();
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredIdx = -1;

    const pickIndex = (e) => {
      if (!frontMeshes.length) return -1;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(frontMeshes, false);
      return hits.length ? hits[0].object.userData.index : -1;
    };

    const setHover = (idx) => {
      if (idx === hoveredIdx) return;
      const wasOn = hoveredIdx >= 0;
      hoveredIdx = idx;
      const isOn = idx >= 0;
      if (wasOn !== isOn) {
        cursorRef.current?.(isOn ? { text: "SEE MORE", isHovering: true } : { text: "", isHovering: false });
        renderer.domElement.style.cursor = isOn ? "pointer" : "default";
      }
    };

    const onPointerMove = (e) => setHover(pickIndex(e));
    const onPointerLeave = () => setHover(-1);
    const onClick = (e) => {
      const idx = pickIndex(e);
      if (idx >= 0 && items[idx]) onSelectRef.current?.(items[idx]);
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);
    renderer.domElement.addEventListener("click", onClick);

    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(container);

    let lastTime = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    let intro = 0;
    let introDone = false;
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!visible) return;

      let e = 1;
      if (!bands.length) {
        e = 0;
      } else if (!introDone) {
        intro = Math.min(1, intro + dt / 1.6);
        e = easeOut(intro);
        materials.forEach((m) => {
          m.opacity = m.userData.baseOpacity * e;
        });
        if (intro >= 1) introDone = true;
      }
      const swirl = reduceMotion ? 0 : 1.6;

      bands.forEach((b) => {
        b.angle += b.dir * b.speed * motionScale * dt;
        b.group.rotation.y = b.angle + (1 - e) * b.dir * swirl;
      });

      renderer.render(scene, camera);
    };
    animate();

    const fitCamera = () => {
      const aspect = width / height;
      camera.aspect = aspect;

      const halfTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const stackH = N * BAND_H + (N - 1) * GAP;
      const needH = stackH * Math.cos(ELEVATION) + 2 * RADIUS * Math.sin(ELEVATION);
      const needW = 2 * RADIUS;

      const distV = (needH * 1.02) / (2 * halfTan);
      const distH = (needW * 1.05) / (2 * halfTan * aspect);
      const dist = Math.max(distV, distH);

      camera.position.set(0, dist * Math.sin(ELEVATION), dist * Math.cos(ELEVATION));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };

    const handleResize = () => {
      width = container.clientWidth || 1;
      height = container.clientHeight || 1;
      renderer.setSize(width, height);
      fitCamera();
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    handleResize();

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();

      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      renderer.domElement.removeEventListener("click", onClick);
      cursorRef.current?.({ text: "", isHovering: false });

      geometry.dispose();
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [items, configs]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
        ...style
      }}
    />
  );
}
