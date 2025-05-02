'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function DanielPhoneFrame({ isTalking }: { isTalking: boolean }) {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (isTalking) return; // No blinking during speech

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150); // Blink duration
    }, 4000 + Math.random() * 2000); // Random interval between 4–6s

    return () => clearInterval(blinkInterval);
  }, [isTalking]);

  const avatarSrc = isTalking
    ? '/avatars/daniel-talking.png'
    : isBlinking
    ? '/avatars/daniel-blink.png'
    : '/avatars/daniel-idle.png';

  return (
    <motion.div
      animate={isTalking ? { rotate: [0, 2, -2, 2, 0], scale: [1, 1.05, 1] } : { rotate: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        repeat: isTalking ? Infinity : 0,
        ease: 'easeInOut',
      }}
      className="relative w-48 h-96 mx-auto mb-6"
    >
      {/* Phone frame background */}
      <Image
        src="/frame.png"
        alt="16-bit iPhone Frame"
        fill
        priority
        className="object-contain pointer-events-none"
      />

      {/* Avatar inside screen */}
      <div className="absolute inset-12 flex items-center justify-center">
        <Image
          src={avatarSrc}
          alt="Daniel Bot Avatar"
          width={96}
          height={96}
          className="rounded"
        />
      </div>
    </motion.div>
  );
}
