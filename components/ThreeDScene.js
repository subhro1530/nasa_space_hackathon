import * as THREE from "three";
import { useEffect } from "react";

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

    // Sun
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(geometry, material);
    scene.add(sun);

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

    camera.position.z = 5;

    // Animation loop
    const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      // Cleanup
      document.body.removeChild(renderer.domElement);
    };
  }, [positions]);

  return null;
}
