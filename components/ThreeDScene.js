import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import dynamic from 'next/dynamic';

export default function SolarSystem() {
  const mountRef = useRef(null);
  const [DatGUI, setDatGUI] = useState(null);

  useEffect(() => {
    // Ensure window exists (browser environment)
    if (typeof window === 'undefined') return;

    // Dynamically import dat.gui on client-side
    const loadDatGui = async () => {
      const dat = await import('dat.gui');
      setDatGUI(dat);
    };

    loadDatGui();

    // Scene setup
    const scene = new THREE.Scene();

    // Renderer setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(-50, 90, 150);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Load textures
    const starTexture = textureLoader.load('/textures/stars.jpg');
    const sunTexture = textureLoader.load('/textures/sun.jpg');
    const mercuryTexture = textureLoader.load('/textures/mercury.jpg');
    const venusTexture = textureLoader.load('/textures/venus.jpg');
    const earthTexture = textureLoader.load('/textures/earth.jpg');
    const marsTexture = textureLoader.load('/textures/mars.jpg');
    const jupiterTexture = textureLoader.load('/textures/jupiter.jpg');
    const saturnTexture = textureLoader.load('/textures/saturn.jpg');
    const uranusTexture = textureLoader.load('/textures/uranus.jpg');
    const neptuneTexture = textureLoader.load('/textures/neptune.jpg');
    const plutoTexture = textureLoader.load('/textures/pluto.jpg');
    const saturnRingTexture = textureLoader.load('/textures/saturn_ring.png');
    const uranusRingTexture = textureLoader.load('/textures/uranus_ring.png');

    // Background texture
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const cubeTexture = cubeTextureLoader.load([
      '/textures/stars.jpg',
      '/textures/stars.jpg',
      '/textures/stars.jpg',
      '/textures/stars.jpg',
      '/textures/stars.jpg',
      '/textures/stars.jpg',
    ]);
    scene.background = cubeTexture;

    // Sun
    const sunGeometry = new THREE.SphereGeometry(15, 50, 50);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Sunlight
    const sunLight = new THREE.PointLight(0xffffff, 4, 300);
    scene.add(sunLight);

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0);
    scene.add(ambientLight);

    // Function to create a circular path for planets
    const path_of_planets = [];
    function createLineLoopWithMesh(radius, color, width) {
      const material = new THREE.LineBasicMaterial({
        color: color,
        linewidth: width,
      });
      const geometry = new THREE.BufferGeometry();
      const lineLoopPoints = [];

      const numSegments = 100;
      for (let i = 0; i <= numSegments; i++) {
        const angle = (i / numSegments) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        lineLoopPoints.push(x, 0, z);
      }

      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(lineLoopPoints, 3)
      );
      const lineLoop = new THREE.LineLoop(geometry, material);
      scene.add(lineLoop);
      path_of_planets.push(lineLoop);
    }

    // Function to generate planets
    const generatePlanet = (size, texture, x, ring) => {
      const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
      const planetMaterial = new THREE.MeshStandardMaterial({
        map: texture,
      });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      const planetObj = new THREE.Object3D();
      planet.position.set(x, 0, 0);

      if (ring) {
        const ringGeometry = new THREE.RingGeometry(
          ring.innerRadius,
          ring.outerRadius,
          32
        );
        const ringMaterial = new THREE.MeshBasicMaterial({
          map: ring.texture,
          side: THREE.DoubleSide,
        });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        planetObj.add(ringMesh);
        ringMesh.position.set(x, 0, 0);
        ringMesh.rotation.x = -0.5 * Math.PI;
      }

      scene.add(planetObj);
      planetObj.add(planet);
      createLineLoopWithMesh(x, 0xffffff, 3);

      return {
        planetObj,
        planet,
      };
    };

    // Planets setup
    const planets = [
      generatePlanet(3.2, mercuryTexture, 28),
      generatePlanet(5.8, venusTexture, 44),
      generatePlanet(6, earthTexture, 62),
      generatePlanet(4, marsTexture, 78),
      generatePlanet(12, jupiterTexture, 100),
      generatePlanet(10, saturnTexture, 138, {
        innerRadius: 10,
        outerRadius: 20,
        texture: saturnRingTexture,
      }),
      generatePlanet(7, uranusTexture, 176, {
        innerRadius: 7,
        outerRadius: 12,
        texture: uranusRingTexture,
      }),
      generatePlanet(7, neptuneTexture, 200),
      generatePlanet(2.8, plutoTexture, 216),
    ];

    // Animate the scene
    const animate = () => {
      sun.rotateY(0.004);
      planets.forEach((planetData) => {
        planetData.planetObj.rotateY(0.004); // Rotation around sun
        planetData.planet.rotateY(0.01); // Planet self-rotation
      });

      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    // Handle window resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (DatGUI) {
        DatGUI.destroy(); // Ensure GUI is destroyed
      }
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [DatGUI]);

  return <div ref={mountRef} />;
}
