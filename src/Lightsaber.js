import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function Lightsaber() {
  const containerRef = useRef(null);
  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);

  useEffect(() => {
    const container = containerRef.current;

    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create a lightsaber model (example: a simple cylinder)
    const geometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const lightsaber = new THREE.Mesh(geometry, material);
    scene.add(lightsaber);

    // Handle device orientation changes
    const handleOrientation = (event) => {
      // Map device orientation alpha and beta to lightsaber rotation
      const alphaRotation = event.alpha * (Math.PI / 180);
      const betaRotation = event.beta * (Math.PI / 180);

      setAlpha(alphaRotation);
      setBeta(betaRotation);
    };

    window.addEventListener('deviceorientation', handleOrientation);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Apply lightsaber rotation based on device orientation
      lightsaber.rotation.z = alpha;
      lightsaber.rotation.x = beta;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up on unmount
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      scene.remove(lightsaber);
      geometry.dispose();
      material.dispose();
    };
  }, [alpha, beta]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

export default Lightsaber;
