import * as THREE from 'three';
import { useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function ThreeDScene({ positions }) {
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    // Add directional light with higher intensity
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Increased intensity
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Optional: Add a light helper to visualize the light
    const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    scene.add(lightHelper);

    // Load and add the sun model
    const loader = new GLTFLoader();
    loader.load('/models/sun.glb', (gltf) => {
      const sun = gltf.scene;

      // Check and log model materials
      sun.traverse((child) => {
        if (child.isMesh) {
          console.log('Material:', child.material);
          // Ensure materials are set up correctly
          if (child.material.map === null) {
            child.material.color.set(0xffff00); // Default to yellow if no texture
          }
          // Ensure material is not using `MeshBasicMaterial` if lighting is used
          if (child.material instanceof THREE.MeshBasicMaterial) {
            child.material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
          }
        }
      });

      sun.position.set(0, 0, 0);
      sun.scale.set(1, 1, 1);
      scene.add(sun);

      // Rotatable sun
      const animate = function () {
        requestAnimationFrame(animate);
        sun.rotation.y += 0.01; // Rotate the sun around the y-axis
        renderer.render(scene, camera);
      };
      animate();
    }, undefined, (error) => {
      console.error('An error occurred loading the sun model:', error);
    });

    // Add a reference cube to ensure visibility
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add planets
    for (const body in positions) {
      const planetGeometry = new THREE.SphereGeometry(0.1, 32, 32);
      const planetMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      const { radius, angle } = positions[body];
      planet.position.set(
        radius * Math.cos(angle),
        0,
        radius * Math.sin(angle)
      );
      scene.add(planet);
    }

    // Camera setup
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0); // Ensure camera is looking at the center

    // Animation loop
    const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, [positions]);

  return null;
}
