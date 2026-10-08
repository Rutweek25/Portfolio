"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function InteractiveSculpture3D({ setCursorState, style }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 360;
    let height = container.clientHeight || 360;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.2;

    // 2. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 3. Lighting (Warm Minimalist Studio)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.6);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf2efe9, 1.2);
    fillLight.position.set(-6, 2, 4);
    scene.add(fillLight);

    // Subtle warm vermilion rim light matching the editorial palette
    const rimLight = new THREE.DirectionalLight(0xe14e2a, 1.2);
    rimLight.position.set(-4, -5, -4);
    scene.add(rimLight);

    // 4. Sculpture Geometry & Materials
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Primary Torus Knot Sculpture
    const knotGeometry = new THREE.TorusKnotGeometry(1.25, 0.38, 160, 32, 2, 3);
    const knotMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfaf8f4,
      roughness: 0.18,
      metalness: 0.08,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
      transmission: 0.25,
      ior: 1.45,
      reflectivity: 0.5
    });
    const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
    rootGroup.add(knotMesh);

    // Architectural Geodesic Wireframe Cage
    const cageGeometry = new THREE.IcosahedronGeometry(2.1, 1);
    const cageMaterial = new THREE.MeshBasicMaterial({
      color: 0x121316,
      wireframe: true,
      transparent: true,
      opacity: 0.09
    });
    const cageMesh = new THREE.Mesh(cageGeometry, cageMaterial);
    rootGroup.add(cageMesh);

    // Concentric Delicate Orbit Rings
    const ringGeo1 = new THREE.TorusGeometry(2.4, 0.012, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xe14e2a,
      transparent: true,
      opacity: 0.3
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI * 0.35;
    rootGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.7, 0.009, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x8c929e,
      transparent: true,
      opacity: 0.25
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI * 0.45;
    ring2.rotation.z = Math.PI * 0.2;
    rootGroup.add(ring2);

    // Delicate Floating Particles
    const particleCount = 65;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 6;
      particlePos[i + 1] = (Math.random() - 0.5) * 6;
      particlePos[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x121316,
      size: 0.035,
      transparent: true,
      opacity: 0.25
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // 5. Buttery Smooth Physics & Interaction Engine
    let mouse = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };
    let currentRotation = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };
    let isDragging = false;
    let previousPointer = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.x = normX;
      mouse.y = normY;
    };

    const handlePointerDown = (e) => {
      isDragging = true;
      previousPointer.x = e.clientX;
      previousPointer.y = e.clientY;
      dragVelocity = { x: 0, y: 0 };
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPointer.x;
      const deltaY = e.clientY - previousPointer.y;
      previousPointer.x = e.clientX;
      previousPointer.y = e.clientY;

      dragVelocity.x = deltaX * 0.007;
      dragVelocity.y = deltaY * 0.007;

      currentRotation.y += dragVelocity.x;
      currentRotation.x += dragVelocity.y;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    // Scroll linkage
    let scrollRotation = 0;
    const handleScroll = () => {
      scrollRotation = window.scrollY * 0.001;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 6. Animation Loop (60/120 FPS Buttery Flow)
    const startTime = performance.now();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Autonomous subtle breathing float
      const ambientFloatX = Math.sin(elapsedTime * 0.5) * 0.15;
      const ambientFloatY = Math.cos(elapsedTime * 0.4) * 0.15;

      // Friction damping on drag momentum
      if (!isDragging) {
        dragVelocity.x *= 0.94;
        dragVelocity.y *= 0.94;
        currentRotation.y += dragVelocity.x;
        currentRotation.x += dragVelocity.y;

        // Mouse target with lerp
        targetRotation.x = mouse.y * 0.45 + ambientFloatX + scrollRotation * 0.8;
        targetRotation.y = mouse.x * 0.65 + ambientFloatY + scrollRotation;

        // Ultra-buttery linear interpolation (lerp factor 0.045)
        currentRotation.x += (targetRotation.x - currentRotation.x) * 0.045;
        currentRotation.y += (targetRotation.y - currentRotation.y) * 0.045;
      }

      rootGroup.rotation.x = currentRotation.x;
      rootGroup.rotation.y = currentRotation.y;
      rootGroup.rotation.z = scrollRotation * 0.4;

      // Orbit counter-rotations for kinetic depth
      cageMesh.rotation.y = elapsedTime * 0.08;
      ring1.rotation.z = elapsedTime * 0.12;
      ring2.rotation.x = elapsedTime * 0.09;
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Observer
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 360;
      height = container.clientHeight || 360;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("scroll", handleScroll);

      knotGeometry.dispose();
      knotMaterial.dispose();
      cageGeometry.dispose();
      cageMaterial.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      onMouseEnter={() => setCursorState?.({ text: "DRAG 3D", isHovering: true })}
      onMouseLeave={() => setCursorState?.({ text: "", isHovering: false })}
      style={{
        width: "100%",
        height: "100%",
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        userSelect: "none",
        touchAction: "none",
        ...style
      }}
    />
  );
}
