/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Apex Works - Interactive 3D Hero Sports Car Visualizer
 * Built with Three.js. Supports 360-orbit dragging, mouse parallax tilt,
 * realistic automotive paint shaders, carbon fiber aero kits, glowing LED lights, and custom color switches.
 */

import * as THREE from 'three';

export function initHeroCarScene() {
  const container = document.getElementById('hero-car-wrap');
  if (!container) return;

  // 1. Scene & Camera
  const scene = new THREE.Scene();
  // Atmospheric depth
  scene.fog = new THREE.FogExp2(0x0a0b0e, 0.04);

  const width = container.clientWidth || 800;
  const height = container.clientHeight || 500;

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(4.8, 2.2, 5.8);
  camera.lookAt(0, 0.4, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // Clear previous canvas if any
  const oldCanvas = container.querySelector('canvas');
  if (oldCanvas) oldCanvas.remove();
  container.prepend(renderer.domElement);

  // 2. Studio Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  // Overhead Key Light
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
  keyLight.position.set(5, 8, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 25;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  // Cool Automotive Fill Light with Neon Electric Blue Glow
  const fillLight = new THREE.DirectionalLight(0x00f0ff, 2.2);
  fillLight.position.set(-6, 3, -4);
  scene.add(fillLight);

  // Vibrant Neon Orange Rim Light
  const rimLight = new THREE.DirectionalLight(0xff5500, 4.5);
  rimLight.position.set(-4, 2, 4);
  scene.add(rimLight);

  // Underglow Point Light (toggleable with multi-color radiance)
  const underglowLight = new THREE.PointLight(0x00f0ff, 5.0, 7);
  underglowLight.position.set(0, 0.15, 0);
  scene.add(underglowLight);

  // 3. Materials
  // Body paint material (changeable color)
  let currentPaintColor = 0xe63946; // Crimson Red default
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: currentPaintColor,
    metalness: 0.9,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 1.0,
  });

  const carbonMaterial = new THREE.MeshStandardMaterial({
    color: 0x181a1f,
    roughness: 0.4,
    metalness: 0.6,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x080a0e,
    transmission: 0.7,
    opacity: 0.95,
    transparent: true,
    roughness: 0.1,
    metalness: 0.1,
    reflectivity: 0.9,
  });

  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xd6f4ff,
    emissiveIntensity: 3.5,
  });

  const taillightMaterial = new THREE.MeshStandardMaterial({
    color: 0xff1e00,
    emissive: 0xff002b,
    emissiveIntensity: 4.0,
  });

  const wheelRimMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f232b,
    metalness: 0.9,
    roughness: 0.2,
  });

  const tireMaterial = new THREE.MeshStandardMaterial({
    color: 0x121316,
    roughness: 0.85,
  });

  const caliperMaterial = new THREE.MeshStandardMaterial({
    color: 0xff3c00,
    roughness: 0.2,
    metalness: 0.5,
  });

  const rotorMaterial = new THREE.MeshStandardMaterial({
    color: 0x949ba8,
    metalness: 0.95,
    roughness: 0.25,
  });

  // 4. Car Mesh Assembly
  const carGroup = new THREE.Group();
  scene.add(carGroup);

  // Lower chassis
  const chassisGeo = new THREE.BoxGeometry(2.1, 0.45, 4.4);
  const chassis = new THREE.Mesh(chassisGeo, bodyMaterial);
  chassis.position.y = 0.45;
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  carGroup.add(chassis);

  // Cabin / Roof (sleek fastback slope)
  const cabinGeo = new THREE.BoxGeometry(1.65, 0.55, 2.2);
  const cabin = new THREE.Mesh(cabinGeo, bodyMaterial);
  cabin.position.set(0, 0.88, -0.15);
  cabin.castShadow = true;
  carGroup.add(cabin);

  // Windshield & Rear glass
  const windshieldGeo = new THREE.BoxGeometry(1.58, 0.48, 0.8);
  const windshield = new THREE.Mesh(windshieldGeo, glassMaterial);
  windshield.position.set(0, 0.88, 0.65);
  windshield.rotation.x = -Math.PI / 6;
  carGroup.add(windshield);

  const rearGlassGeo = new THREE.BoxGeometry(1.58, 0.45, 0.9);
  const rearGlass = new THREE.Mesh(rearGlassGeo, glassMaterial);
  rearGlass.position.set(0, 0.88, -0.95);
  rearGlass.rotation.x = Math.PI / 7;
  carGroup.add(rearGlass);

  // Side windows
  const sideWindowGeo = new THREE.BoxGeometry(1.7, 0.38, 1.4);
  const sideWindow = new THREE.Mesh(sideWindowGeo, glassMaterial);
  sideWindow.position.set(0, 0.88, -0.15);
  carGroup.add(sideWindow);

  // Aggressive Hood Vent & Slopes
  const hoodSlopeGeo = new THREE.BoxGeometry(1.85, 0.2, 1.3);
  const hoodSlope = new THREE.Mesh(hoodSlopeGeo, bodyMaterial);
  hoodSlope.position.set(0, 0.55, 1.45);
  hoodSlope.rotation.x = Math.PI / 24;
  carGroup.add(hoodSlope);

  // Carbon Fiber Front Splitter
  const frontSplitterGeo = new THREE.BoxGeometry(2.25, 0.06, 0.7);
  const frontSplitter = new THREE.Mesh(frontSplitterGeo, carbonMaterial);
  frontSplitter.position.set(0, 0.16, 2.3);
  frontSplitter.castShadow = true;
  carGroup.add(frontSplitter);

  // Carbon Side Skirts
  const sideSkirtLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 3.2), carbonMaterial);
  sideSkirtLeft.position.set(1.12, 0.18, 0);
  sideSkirtLeft.castShadow = true;
  carGroup.add(sideSkirtLeft);

  const sideSkirtRight = sideSkirtLeft.clone();
  sideSkirtRight.position.x = -1.12;
  carGroup.add(sideSkirtRight);

  // Aggressive Rear GT Wing
  const wingBladeGeo = new THREE.BoxGeometry(2.2, 0.06, 0.45);
  const wingBlade = new THREE.Mesh(wingBladeGeo, carbonMaterial);
  wingBlade.position.set(0, 1.35, -2.1);
  wingBlade.rotation.x = -Math.PI / 28;
  wingBlade.castShadow = true;
  carGroup.add(wingBlade);

  // Wing uprights / struts
  const strutGeo = new THREE.BoxGeometry(0.06, 0.5, 0.2);
  const strutLeft = new THREE.Mesh(strutGeo, carbonMaterial);
  strutLeft.position.set(0.65, 1.1, -2.05);
  carGroup.add(strutLeft);
  const strutRight = strutLeft.clone();
  strutRight.position.x = -0.65;
  carGroup.add(strutRight);

  // Rear Diffuser
  const diffuserGeo = new THREE.BoxGeometry(1.9, 0.2, 0.5);
  const diffuser = new THREE.Mesh(diffuserGeo, carbonMaterial);
  diffuser.position.set(0, 0.22, -2.25);
  carGroup.add(diffuser);

  // Headlights (LED strips)
  const headlightLeft = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.15), headlightMaterial);
  headlightLeft.position.set(0.72, 0.52, 2.18);
  carGroup.add(headlightLeft);

  const headlightRight = headlightLeft.clone();
  headlightRight.position.x = -0.72;
  carGroup.add(headlightRight);

  // Taillight bar (Continuous Cyber-LED blade)
  const taillightBar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.07, 0.1), taillightMaterial);
  taillightBar.position.set(0, 0.62, -2.2);
  carGroup.add(taillightBar);

  // Quad Titanium Exhaust Tips
  const exhaustMat = new THREE.MeshStandardMaterial({
    color: 0x333b4d,
    metalness: 0.95,
    roughness: 0.2,
  });
  const exhaustGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.25, 16);
  exhaustGeo.rotateX(Math.PI / 2);

  const ex1 = new THREE.Mesh(exhaustGeo, exhaustMat);
  ex1.position.set(0.48, 0.22, -2.35);
  carGroup.add(ex1);
  const ex2 = new THREE.Mesh(exhaustGeo, exhaustMat);
  ex2.position.set(0.66, 0.22, -2.35);
  carGroup.add(ex2);
  const ex3 = new THREE.Mesh(exhaustGeo, exhaustMat);
  ex3.position.set(-0.48, 0.22, -2.35);
  carGroup.add(ex3);
  const ex4 = new THREE.Mesh(exhaustGeo, exhaustMat);
  ex4.position.set(-0.66, 0.22, -2.35);
  carGroup.add(ex4);

  // Helper to build 4 custom forged wheels with rotors & red calipers
  function createWheel(x: number, y: number, z: number, isRight: boolean) {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(x, y, z);

    // Tire
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.32, 28), tireMaterial);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Rim outer lip
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.33, 24), wheelRimMaterial);
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);

    // Brake rotor disc
    const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 20), rotorMaterial);
    rotor.rotation.z = Math.PI / 2;
    rotor.position.x = isRight ? 0.05 : -0.05;
    wheelGroup.add(rotor);

    // Brake caliper
    const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.12), caliperMaterial);
    caliper.position.set(isRight ? 0.06 : -0.06, 0.12, 0.08);
    wheelGroup.add(caliper);

    carGroup.add(wheelGroup);
  }

  // Position 4 Wheels (Wide stance)
  createWheel(1.12, 0.42, 1.45, true);   // Front Right
  createWheel(-1.12, 0.42, 1.45, false); // Front Left
  createWheel(1.14, 0.44, -1.35, true);  // Rear Right
  createWheel(-1.14, 0.44, -1.35, false);// Rear Left

  // 5. Turntable Showroom Platform & Shadow Plane
  const platformGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.15, 64);
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x0f1117,
    roughness: 0.35,
    metalness: 0.7,
  });
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.y = -0.08;
  platform.receiveShadow = true;
  scene.add(platform);

  // Platform rim LED ring
  const ringGeo = new THREE.TorusGeometry(3.62, 0.03, 16, 64);
  ringGeo.rotateX(Math.PI / 2);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xff3c00,
    emissive: 0xff3c00,
    emissiveIntensity: 2.0,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = -0.01;
  scene.add(ring);

  // 6. Interaction & Mouse Parallax
  let autoRotate = true;
  let targetRotationY = 0.6;
  let targetRotationX = 0;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let mouseTiltX = 0;
  let mouseTiltY = 0;

  const onPointerDown = (e: PointerEvent) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mouseTiltX = nx * 0.15;
    mouseTiltY = ny * 0.08;

    if (isDragging) {
      autoRotate = false;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.004;

      // Limit pitch
      targetRotationX = Math.max(-0.25, Math.min(0.35, targetRotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  };

  const onPointerUp = () => {
    isDragging = false;
  };

  container.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  // 7. Paint Switcher Logic
  const swatches = document.querySelectorAll<HTMLButtonElement>('.color-swatch');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const hex = swatch.dataset.color;
      if (hex) {
        currentPaintColor = parseInt(hex.replace('#', '0x'), 16);
        bodyMaterial.color.setHex(currentPaintColor);
        underglowLight.color.setHex(currentPaintColor);
        ringMat.color.setHex(currentPaintColor);
        ringMat.emissive.setHex(currentPaintColor);
      }
    });
  });

  // Lights toggle button
  const lightToggleBtn = document.getElementById('btn-toggle-lights');
  let lightsOn = true;
  if (lightToggleBtn) {
    lightToggleBtn.addEventListener('click', () => {
      lightsOn = !lightsOn;
      headlightMaterial.emissiveIntensity = lightsOn ? 3.5 : 0;
      taillightMaterial.emissiveIntensity = lightsOn ? 4.0 : 0;
      underglowLight.intensity = lightsOn ? 4.5 : 0;
      lightToggleBtn.classList.toggle('active', lightsOn);
    });
  }

  // Auto-rotate toggle button
  const rotateToggleBtn = document.getElementById('btn-toggle-rotate');
  if (rotateToggleBtn) {
    rotateToggleBtn.addEventListener('click', () => {
      autoRotate = !autoRotate;
      rotateToggleBtn.classList.toggle('active', autoRotate);
    });
  }

  // Reset View button
  const resetViewBtn = document.getElementById('btn-reset-view');
  if (resetViewBtn) {
    resetViewBtn.addEventListener('click', () => {
      targetRotationY = 0.6;
      targetRotationX = 0;
      autoRotate = true;
      if (rotateToggleBtn) rotateToggleBtn.classList.add('active');
    });
  }

  // 8. Animation Loop
  let reqId: number;
  const clock = new THREE.Clock();

  const animate = () => {
    reqId = requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (autoRotate && !isDragging) {
      targetRotationY += 0.35 * delta;
    }

    // Smooth lerping for car orientation and mouse tilt
    carGroup.rotation.y += (targetRotationY + mouseTiltX - carGroup.rotation.y) * 0.08;
    carGroup.rotation.x += (targetRotationX + mouseTiltY - carGroup.rotation.x) * 0.08;

    // Subtle gentle engine suspension hover
    carGroup.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.02;

    renderer.render(scene, camera);
  };
  animate();

  // Resize handler
  const onResize = () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  return () => {
    cancelAnimationFrame(reqId);
    window.removeEventListener('resize', onResize);
    container.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    renderer.dispose();
  };
}
