/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 18-11-2025
 * Description: Animated dots background component similar to roadmap page
 */

'use client';

import { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  opacity: number;
}

export default function DotsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for sharp rendering
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    // Initial size setup with a small delay to ensure parent is rendered
    setTimeout(() => {
      setCanvasSize();
      initializeDots();
      animate();
    }, 0);

    // Create dots
    const dots: Dot[] = [];
    const dotCount = 80; // Number of dots
    const colors = [
      'rgba(30, 100, 171, 0.6)',    // Blue
      'rgba(51, 163, 161, 0.6)',    // Teal
      'rgba(143, 129, 238, 0.6)',   // Purple
      'rgba(59, 130, 246, 0.5)',    // Light blue
    ];

    // Initialize dots function
    const initializeDots = () => {
      dots.length = 0; // Clear existing dots
      const rect = canvas.getBoundingClientRect();

      for (let i = 0; i < dotCount; i++) {
        dots.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          radius: Math.random() * 3 + 2, // 2-5px radius
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.3, // Slow horizontal movement
          vy: (Math.random() - 0.5) * 0.3, // Slow vertical movement
          opacity: Math.random() * 0.5 + 0.3, // 0.3-0.8 opacity
        });
      }
    };

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Update and draw dots
      dots.forEach((dot) => {
        // Update position
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Wrap around screen edges
        if (dot.x < -10) dot.x = rect.width + 10;
        if (dot.x > rect.width + 10) dot.x = -10;
        if (dot.y < -10) dot.y = rect.height + 10;
        if (dot.y > rect.height + 10) dot.y = -10;

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.color.replace(/[\d.]+\)$/g, `${dot.opacity})`);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Handle window resize
    const handleResize = () => {
      setCanvasSize();
      initializeDots();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}

