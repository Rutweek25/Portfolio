"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { ORBIT_SKILLS } from "@/data/skills";

// Helper: generate crisp 2D canvas texture for a skill label
function createLabelCanvasTexture(text, accentHex = "#4A83FF") {
  const canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 80;
  const ctx = canvas.getContext("2d");

  // High quality text rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Pill badge background
  const r = 36;
  const w = 290;
  const h = 72;
  const x = 5;
  const y = 4;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();

  // Badge background fill
  ctx.fillStyle = "rgba(10, 12, 18, 0.88)";
  ctx.fill();

  // Subtle border
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "rgba(74, 131, 255, 0.45)";
  ctx.stroke();

  // Glowing indicator dot
  ctx.beginPath();
  ctx.arc(38, y + h / 2, 6, 0, Math.PI * 2);
  ctx.fillStyle = accentHex;
  ctx.fill();

  // Label text
  ctx.font = "600 28px 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "#F9F8FF";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(text, 58, y + h / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// Helper: generate soft circular radial glow texture for core
function createGlowRadialTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(74, 131, 255, 0.9)");
  gradient.addColorStop(0.3, "rgba(59, 130, 246, 0.45)");
  gradient.addColorStop(0.7, "rgba(37, 99, 235, 0.12)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export default function SkillOrbit({
  skills = ORBIT_SKILLS,
  className = "",
  style = {},
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const speedScale = prefersReducedMotion ? 0.15 : 1.0;

    let width = container.clientWidth || 480;
    let height = container.clientHeight || 480;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

    const updateCameraDistance = (w) => {
      if (w < 420) {
        camera.position.z = 11.6;
      } else if (w < 640) {
        camera.position.z = 10.4;
      } else {
        camera.position.z = 9.4;
      }
    };
    updateCameraDistance(width);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Avoid duplicate canvas if hot reload or strict mode
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x4a83ff, 3, 20);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const dirLight = new THREE.DirectionalLight(0xe0e7ff, 1.5);
    dirLight.position.set(5, 8, 7);
    scene.add(dirLight);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 3. Central Glowing Core Sphere
    const coreGeo = new THREE.SphereGeometry(0.82, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0016ec,
      emissive: 0x4a83ff,
      emissiveIntensity: 0.95,
      roughness: 0.18,
      metalness: 0.25,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Radial Glow Billboard Halo
    const glowTex = createGlowRadialTexture();
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.75,
      depthWrite: false,
    });
    const glowSprite = new THREE.Sprite(glowMat);
    glowSprite.scale.set(3.4, 3.4, 1);
    rootGroup.add(glowSprite);

    // 4. Icosahedron Wireframe Shell
    const shellGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x4a83ff,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    rootGroup.add(shellMesh);

    // 5. Floating Dust Particles
    const particleCount = 85;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.0 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePos[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePos[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePos[i + 2] = radius * Math.cos(phi);
    }
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePos, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.038,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // 6. Orbital Rings Configuration
    // Skills partitioned into 3 concentric rings:
    // Ring 1: React, Node.js, Express, MongoDB
    // Ring 2: JavaScript, TypeScript, SQL, PostgreSQL
    // Ring 3: Java, Git, Docker, Jenkins
    const ringConfigs = [
      {
        radius: 2.35,
        tiltX: 0.42,
        tiltY: 0.2,
        tiltZ: 0.1,
        speed: 0.32 * speedScale,
        skills: skills.slice(3, 7), // React, Node.js, Express, MongoDB
        accent: "#60A5FA",
      },
      {
        radius: 3.3,
        tiltX: -0.45,
        tiltY: 0.35,
        tiltZ: 0.22,
        speed: -0.24 * speedScale, // Opposite direction for dynamic interplay
        skills: [skills[1], skills[2], skills[7], skills[8]], // JS, TS, SQL, Postgres
        accent: "#38BDF8",
      },
      {
        radius: 4.25,
        tiltX: 0.32,
        tiltY: -0.48,
        tiltZ: -0.15,
        speed: 0.19 * speedScale,
        skills: [skills[0], skills[9], skills[10], skills[11]], // Java, Git, Docker, Jenkins
        accent: "#818CF8",
      },
    ];

    const disposables = [];
    disposables.push(coreGeo, coreMat, glowTex, glowMat, shellGeo, shellMat, particleGeo, particleMat);

    // Store animated orbital nodes
    const orbitNodes = [];

    ringConfigs.forEach((ring) => {
      // Create Ring Tube Geometry
      const ringGeo = new THREE.TorusGeometry(ring.radius, 0.012, 16, 120);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(ring.accent),
        transparent: true,
        opacity: 0.35,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      disposables.push(ringGeo, ringMat);

      // Group holding the ring tilt
      const ringGroup = new THREE.Group();
      ringGroup.rotation.x = ring.tiltX;
      ringGroup.rotation.y = ring.tiltY;
      ringGroup.rotation.z = ring.tiltZ;
      ringGroup.add(ringMesh);
      rootGroup.add(ringGroup);

      // Create skill items along this ring
      const numSkills = ring.skills.length;
      ring.skills.forEach((skillName, idx) => {
        const initialAngle = (idx / numSkills) * Math.PI * 2;

        // Glowing orbit bead
        const beadGeo = new THREE.SphereGeometry(0.085, 16, 16);
        const beadMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: new THREE.Color(ring.accent),
          emissiveIntensity: 1.2,
          roughness: 0.1,
        });
        const beadMesh = new THREE.Mesh(beadGeo, beadMat);
        ringGroup.add(beadMesh);
        disposables.push(beadGeo, beadMat);

        // Tech Label Sprite
        const labelTex = createLabelCanvasTexture(skillName, ring.accent);
        const labelMat = new THREE.SpriteMaterial({
          map: labelTex,
          transparent: true,
          depthWrite: false,
        });
        const labelSprite = new THREE.Sprite(labelMat);
        labelSprite.scale.set(1.4, 0.38, 1);
        ringGroup.add(labelSprite);
        disposables.push(labelTex, labelMat);

        orbitNodes.push({
          ringGroup,
          beadMesh,
          labelSprite,
          radius: ring.radius,
          speed: ring.speed,
          angle: initialAngle,
        });
      });
    });

    // 7. Interactive Parallax & Pointer Movement
    const pointer = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      pointer.x = Math.max(-1, Math.min(1, nx));
      pointer.y = Math.max(-1, Math.min(1, ny));
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const nx = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        pointer.x = Math.max(-1, Math.min(1, nx));
        pointer.y = Math.max(-1, Math.min(1, ny));
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // 8. Animation Loop
    let animationFrameId;
    const startTime = performance.now();
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Parallax lerp
      targetRotation.x = pointer.y * 0.42;
      targetRotation.y = pointer.x * 0.6;
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;

      rootGroup.rotation.x = currentRotation.x;
      rootGroup.rotation.y = currentRotation.y;

      // Pulse breathing animation on central core
      const pulse = 1 + Math.sin(elapsedTime * 2.2) * 0.05;
      coreMesh.scale.set(pulse, pulse, pulse);
      glowSprite.scale.set(pulse * 3.4, pulse * 3.4, 1);

      // Wireframe shell slow rotation
      shellMesh.rotation.y = elapsedTime * 0.12 * speedScale;
      shellMesh.rotation.x = elapsedTime * 0.06 * speedScale;

      // Dust particles drift
      particles.rotation.y = elapsedTime * 0.03 * speedScale;

      // Update orbiting skills & compute front/back depth fading
      orbitNodes.forEach((node) => {
        node.angle += node.speed * 0.016;

        // Position on the ring circle
        const x = Math.cos(node.angle) * node.radius;
        const y = Math.sin(node.angle) * node.radius;

        // Bead position
        node.beadMesh.position.set(x, y, 0);

        // Label position slightly offset
        node.labelSprite.position.set(x, y + 0.28, 0);

        // Front/Back Depth Fading
        node.labelSprite.getWorldPosition(tempVec);
        tempVec.project(camera);

        // tempVec.z is -1 at near plane, +1 at far plane
        // Normalized depth: 1 = nearest to screen, 0 = farthest back
        const depthFactor = THREE.MathUtils.clamp(-tempVec.z * 0.5 + 0.5, 0, 1);

        // Depth alpha interpolation
        const opacity = THREE.MathUtils.lerp(0.32, 1.0, depthFactor);
        node.labelSprite.material.opacity = opacity;
        node.beadMesh.material.opacity = opacity;

        // Depth scale cue
        const scale = THREE.MathUtils.lerp(0.85, 1.12, depthFactor);
        node.labelSprite.scale.set(1.4 * scale, 0.38 * scale, 1);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 480;
      height = container.clientHeight || 480;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      updateCameraDistance(width);
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 10. Robust Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);

      disposables.forEach((item) => {
        if (item && typeof item.dispose === "function") {
          item.dispose();
        }
      });

      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [skills]);

  return (
    <div
      className={`relative w-full flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{
        minHeight: "340px",
        height: "100%",
        ...style,
      }}
    >
      <div
        ref={mountRef}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "560px",
          minHeight: "340px",
        }}
        aria-label="Interactive 3D Technology Orbit Visualization"
      />
    </div>
  );
}
