/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Apex Works - 3D Preloader Module
 * Uses Three.js to render a high-performance rotating alloy wheel, drilled rotor,
 * and Brembo-style brake caliper assembly bathed in vibrant multi-color neon lighting.
 */

import * as THREE from 'three';
import gsap from 'gsap';

export function initThreeLoader(onFinished: () => void) {
  const container = document.getElementById('loader-canvas-box');
  const percentEl = document.getElementById('loader-percentage');
  const fillBar = document.getElementById('loader-bar-fill');
  const preloaderEl = document.getElementById('preloader');

  if (!container || !percentEl || !fillBar || !preloaderEl) {
    onFinished();
    return;
  }

  // 1. Scene setup
  const scene = new THREE.Scene();
  const width = container.clientWidth || 300;
  const height = container.clientHeight || 300;

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 0, 5.2);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // 2. Vibrant Multi-Color Neon Studio Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
  scene.add(ambientLight);

  // Key Electric Blue / Cyan Light
  const cyanLight = new THREE.DirectionalLight(0x00f0ff, 4.0);
  cyanLight.position.set(4, 5, 4);
  scene.add(cyanLight);

  // Neon Orange / Crimson Rim Light
  const orangeLight = new THREE.DirectionalLight(0xff5500, 4.5);
  orangeLight.position.set(-4, -3, 3);
  scene.add(orangeLight);

  // Ultraviolet Backlight
  const purpleLight = new THREE.PointLight(0xa855f7, 5.0, 10);
  purpleLight.position.set(0, 0, -2);
  scene.add(purpleLight);

  // 3. Wheel Assembly Group
  const wheelGroup = new THREE.Group();
  scene.add(wheelGroup);

  // Materials with metallic reflections
  const tireMaterial = new THREE.MeshStandardMaterial({
    color: 0x14161c,
    roughness: 0.85,
    metalness: 0.1,
  });

  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0xebedf5,
    metalness: 0.9,
    roughness: 0.2,
  });

  const rotorMaterial = new THREE.MeshStandardMaterial({
    color: 0x9ca3af,
    metalness: 0.95,
    roughness: 0.25,
  });

  const caliperMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0055,
    metalness: 0.45,
    roughness: 0.2,
  });

  // Outer Tire
  const tireGeo = new THREE.TorusGeometry(1.6, 0.45, 24, 48);
  const tire = new THREE.Mesh(tireGeo, tireMaterial);
  wheelGroup.add(tire);

  // Outer Rim Lip
  const rimLipGeo = new THREE.TorusGeometry(1.35, 0.08, 16, 48);
  const rimLip = new THREE.Mesh(rimLipGeo, rimMaterial);
  wheelGroup.add(rimLip);

  // Rim Hub / Center Cap
  const hubGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.2, 32);
  hubGeo.rotateX(Math.PI / 2);
  const hub = new THREE.Mesh(hubGeo, rimMaterial);
  wheelGroup.add(hub);

  // 5 Twin-Spokes
  const spokeCount = 5;
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i * Math.PI * 2) / spokeCount;
    const spokeGeo = new THREE.BoxGeometry(0.12, 1.15, 0.1);
    
    // Spoke 1
    const spoke1 = new THREE.Mesh(spokeGeo, rimMaterial);
    spoke1.position.set(
      Math.sin(angle + 0.1) * 0.72,
      Math.cos(angle + 0.1) * 0.72,
      0.02
    );
    spoke1.rotation.z = -angle - 0.1;
    wheelGroup.add(spoke1);

    // Spoke 2
    const spoke2 = new THREE.Mesh(spokeGeo, rimMaterial);
    spoke2.position.set(
      Math.sin(angle - 0.1) * 0.72,
      Math.cos(angle - 0.1) * 0.72,
      0.02
    );
    spoke2.rotation.z = -angle + 0.1;
    wheelGroup.add(spoke2);
  }

  // Drilled Brake Rotor Disc
  const rotorGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.06, 40);
  rotorGeo.rotateX(Math.PI / 2);
  const rotor = new THREE.Mesh(rotorGeo, rotorMaterial);
  rotor.position.z = -0.15;
  wheelGroup.add(rotor);

  // Racing Brake Caliper (Brembo style with vibrant multi-color specular highlights)
  const caliperGroup = new THREE.Group();
  const caliperGeo = new THREE.BoxGeometry(0.36, 0.88, 0.32);
  const caliperMesh = new THREE.Mesh(caliperGeo, caliperMaterial);
  caliperGroup.add(caliperMesh);
  caliperGroup.position.set(0.85, 0.45, -0.05);
  caliperGroup.rotation.z = -Math.PI / 5;
  scene.add(caliperGroup); // Caliper stays relatively stationary while wheel spins

  // 4. Render loop
  let animationFrameId: number;
  let isRunning = true;

  const animate = () => {
    if (!isRunning) return;
    animationFrameId = requestAnimationFrame(animate);

    // Spin wheel
    wheelGroup.rotation.z -= 0.05;
    // 3D dynamic perspective tilt
    wheelGroup.rotation.y = Math.sin(Date.now() * 0.0035) * 0.3;
    wheelGroup.rotation.x = Math.cos(Date.now() * 0.0035) * 0.18;

    // Orbiting light intensity for neon shimmer
    cyanLight.intensity = 3.5 + Math.sin(Date.now() * 0.005) * 1.0;
    orangeLight.intensity = 4.0 + Math.cos(Date.now() * 0.005) * 1.0;

    renderer.render(scene, camera);
  };
  animate();

  // 5. Progress Counter Simulation
  const progressObj = { value: 0 };
  gsap.to(progressObj, {
    value: 100,
    duration: 1.6,
    ease: 'power2.inOut',
    onUpdate: () => {
      const current = Math.floor(progressObj.value);
      percentEl.textContent = `${current}%`;
      fillBar.style.width = `${current}%`;
    },
    onComplete: () => {
      // Smooth exit animation
      gsap.timeline({
        onComplete: () => {
          isRunning = false;
          cancelAnimationFrame(animationFrameId);
          renderer.dispose();
          if (preloaderEl.parentNode) {
            preloaderEl.style.display = 'none';
          }
          onFinished();
        }
      })
      .to(wheelGroup.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 0.5,
        ease: 'back.in(1.7)',
      }, 0)
      .to(preloaderEl, {
        opacity: 0,
        duration: 0.55,
        ease: 'power3.out',
      }, 0.15);
    }
  });

  // Handle Resize
  const handleResize = () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', handleResize);
}
