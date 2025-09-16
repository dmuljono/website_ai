// components/ShootingStars.tsx
'use client';
import { useEffect, useState } from 'react';

interface Star {
  id: number;
  top: number;
  left: number;
}

export default function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prev) => [
        ...prev,
        {
          id: Date.now(),
          top: Math.random() * 30, // spawn in upper 30% of screen
          left: Math.random() * 100, // anywhere across screen width
        },
      ]);
    }, 1000); // new star every ~3s

    return () => clearInterval(interval);
  }, []);

  const handleEnd = (id: number) =>
    setStars((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <span
          key={star.id}
          className="shooting-star"
          onAnimationEnd={() => handleEnd(star.id)}
          style={{
            top: `${star.top}vh`,
            left: `${star.left}vw`,
          }}
        />
      ))}
      <style jsx>{`
        .shooting-star {
          position: absolute;
          width: 100px;
          height: 2px;
          background: linear-gradient(to right, white, transparent);
          transform: rotate(-45deg); /* aligns with movement */
          animation: shoot 1.0s ease-out forwards;
        }

        @keyframes shoot {
          from {
            opacity: 1;
            transform: translate(0, 0) rotate(-45deg);
          }
          to {
            opacity: 0;
            transform: translate(-500px, 500px) rotate(-45deg);
          }
        }
      `}</style>
    </div>
  );
}
