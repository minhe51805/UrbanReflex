/**
 * Author: AI Assistant
 * Create at: 15-11-2025
 * Description: Elegant canvas particle animation with soft, gentle movements suitable for all ages
 * Features: Floating particles, connecting lines, smooth animations on white background
 */

'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface CanvasParticlesProps {
  children: ReactNode;
  className?: string;
  particleCount?: number;
  particleColor?: string;
  lineColor?: string;
  particleSize?: number;
  connectionDistance?: number;
  speed?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export default function CanvasParticles({
  children,
  className = '',
  particleCount = 50,
  particleColor = 'rgba(100, 150, 200, 0.6)',
  lineColor = 'rgba(100, 150, 200, 0.15)',
  particleSize = 2.5,
  connectionDistance = 150,
  speed = 0.3,
}: CanvasParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for sharp rendering
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    // Initialize with a small delay to ensure parent is rendered
    setTimeout(() => {
      resizeCanvas();
      initParticles();
      animate();
    }, 0);

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const rect = canvas.getBoundingClientRect();

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: Math.random() * particleSize + 1,
        });
      }
    };

    // Animation loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > rect.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > rect.height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(rect.width, particle.x));
        particle.y = Math.max(0, Math.min(rect.height, particle.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = lineColor.replace('0.15', opacity.toString());
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleCount, particleColor, lineColor, particleSize, connectionDistance, speed]);

  return (
    <div className={`relative ${className}`}>
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'transparent' }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
