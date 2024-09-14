import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function SolarSystem() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Scene and Renderer
    const scene = new THREE.Scene();
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerWidth, containerHeight);
    mountRef.current.appendChild(renderer.domElement);
    renderer.domElement.id = "c";

    function createRing(innerRadius) {
      const outerRadius = innerRadius + 0.5;
      const thetaSegments = 100;
      const geometry = new THREE.RingGeometry(
        innerRadius,
        outerRadius,
        thetaSegments
      );
      const material = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = Math.PI / 2;
      return mesh;
    }

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      85,
      containerWidth / containerHeight,
      0.1,
      1000
    );
    camera.position.z = 250;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 12;
    controls.maxDistance = 1000;

    // Sun and lighting
    const sunGeometry = new THREE.SphereGeometry(15, 50, 50);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("textures/sun_hd.jpg"),
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    const pointLight = new THREE.PointLight(0xffffff, 1, 0); // Bright white light
    pointLight.position.copy(sun.position);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Low ambient light
    scene.add(ambientLight);

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Create planets with adjusted distances
    const distanceFactor = 50; // Dividing factor to scale distances
    const planetsData = [
      {
        name: "Mercury",
        radius: 2.4,
        distance: 0.39 * distanceFactor,
        speed: 4.15,
        texture: "textures/mercury_hd.jpg",
      },
      {
        name: "Venus",
        radius: 6,
        distance: 0.72 * distanceFactor,
        speed: 1.62,
        texture: "textures/venus_hd.jpg",
      },
      {
        name: "Earth",
        radius: 6.4,
        distance: 1.0 * distanceFactor,
        speed: 1.0,
        texture: "textures/earth_hd.jpg",
      },
      {
        name: "Mars",
        radius: 3.4,
        distance: 1.52 * distanceFactor,
        speed: 0.53,
        texture: "textures/mars_hd.jpg",
      },
      {
        name: "Jupiter",
        radius: 12,
        distance: 5.2 * distanceFactor,
        speed: 0.084,
        texture: "textures/jupiter_hd.jpg",
      },
      {
        name: "Saturn",
        radius: 10,
        distance: 9.58 * distanceFactor,
        speed: 0.033,
        texture: "textures/saturn_hd.jpg",
      },
      {
        name: "Uranus",
        radius: 7,
        distance: 19.2 * distanceFactor,
        speed: 0.011,
        texture: "textures/uranus_hd.jpg",
      },
      {
        name: "Neptune",
        radius: 6.8,
        distance: 30.0 * distanceFactor,
        speed: 0.006,
        texture: "textures/neptune_hd.jpg",
      },
    ];

    const planets = [];

    planetsData.forEach(({ radius, distance, texture }) => {
      const planetGeometry = new THREE.SphereGeometry(radius, 32, 32);
      const planetMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture),
      });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);

      const orbitGroup = new THREE.Object3D(); // Orbit pivot
      orbitGroup.add(planet);
      planet.position.set(distance, 0, 0);
      const planetOrbit = createRing(distance);
      scene.add(planetOrbit);
      scene.add(orbitGroup);
      planets.push({ planet, orbitGroup });
    });

    // Skybox
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const cubeTexture = cubeTextureLoader.load([
      "skybox/space_ft.png",
      "skybox/space_bk.png",
      "skybox/space_up.png",
      "skybox/space_dn.png",
      "skybox/space_rt.png",
      "skybox/space_lf.png",
    ]);
    scene.background = cubeTexture;

    // Animate
    const animate = () => {
      planets.forEach((data, i) => {
        const { planet, orbitGroup } = data;
        // Rotation (spin around own axis)
        planet.rotation.y += 0.01;

        // Revolution (orbit around sun)
        orbitGroup.rotation.y += planetsData[i].speed * 0.001;
      });

      sun.rotation.y += 0.004; // Rotate the Sun

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      renderer.dispose();
    };
  }, []); // Only run once, when the component mounts

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
