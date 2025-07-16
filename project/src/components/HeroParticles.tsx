// import { useCallback } from 'react';
// import Particles from '@tsparticles/react';
// import { loadSlim } from '@tsparticles/slim';

// const HeroParticles = () => {
//   const particlesInit = useCallback(async (engine: any) => {
//     await loadSlim(engine);
//   }, []);

//   return (
//     <Particles
//       id="tsparticles"
//       init={particlesInit}
//       options={{
//         fullScreen: { enable: false },
//         particles: {
//           number: { value: 60 },
//           size: { 
//             value: { min: 1, max: 4 },
//             animation: {
//               enable: true,
//               speed: 2,
//               sync: false
//             }
//           },
//           color: { 
//             value: ['#10b981', '#3b82f6', '#8b5cf6', '#06b6d4']
//           },
//           links: {
//             enable: true,
//             color: '#10b981',
//             distance: 150,
//             opacity: 0.4,
//             width: 1,
//           },
//           move: { 
//             enable: true, 
//             speed: 1.5,
//             direction: 'none',
//             random: true,
//             straight: false,
//             outModes: {
//               default: 'bounce'
//             }
//           },
//           opacity: {
//             value: { min: 0.3, max: 0.8 },
//             animation: {
//               enable: true,
//               speed: 1,
//               sync: false
//             }
//           }
//         },
//         background: { color: 'transparent' },
//         interactivity: {
//           events: {
//             onHover: {
//               enable: true,
//               mode: 'repulse'
//             }
//           },
//           modes: {
//             repulse: {
//               distance: 100,
//               duration: 0.4
//             }
//           }
//         }
//       }}
//       className="absolute inset-0 -z-10"
//     />
//   );
// };

// export default HeroParticles;

import React, { useEffect, useRef } from 'react';

const HeroParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default HeroParticles;