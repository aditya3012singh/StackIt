import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const HeroParticles = () => {
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        particles: {
          number: { value: 60 },
          size: { 
            value: { min: 1, max: 4 },
            animation: {
              enable: true,
              speed: 2,
              sync: false
            }
          },
          color: { 
            value: ['#10b981', '#3b82f6', '#8b5cf6', '#06b6d4']
          },
          links: {
            enable: true,
            color: '#10b981',
            distance: 150,
            opacity: 0.4,
            width: 1,
          },
          move: { 
            enable: true, 
            speed: 1.5,
            direction: 'none',
            random: true,
            straight: false,
            outModes: {
              default: 'bounce'
            }
          },
          opacity: {
            value: { min: 0.3, max: 0.8 },
            animation: {
              enable: true,
              speed: 1,
              sync: false
            }
          }
        },
        background: { color: 'transparent' },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'repulse'
            }
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4
            }
          }
        }
      }}
      className="absolute inset-0 -z-10"
    />
  );
};

export default HeroParticles;