'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type IdlePose = 'center' | 'left' | 'right';

export default function DanielPhoneFrame({ isTalking }: { isTalking: boolean }) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [talkingFrame, setTalkingFrame] = useState<string>('daniel-idle.png');
  const [idlePose, setIdlePose] = useState<IdlePose>('center');

  // Blink while idle
  useEffect(() => {
    if (isTalking) return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [isTalking]);

  // Subtle idle pose change
  useEffect(() => {
    if (isTalking) return;

    const idleInterval = setInterval(() => {
      const poses: IdlePose[] = ['center', 'left', 'right'];
      const randomPose = poses[Math.floor(Math.random() * poses.length)];
      setIdlePose(randomPose);
    }, 6000 + Math.random() * 3000);

    return () => clearInterval(idleInterval);
  }, [isTalking]);

  // Random talking frame while talking
  useEffect(() => {
    let mouthInterval: NodeJS.Timeout | null = null;

    if (isTalking) {
      const frames = [
        'daniel-talking1.png',
        'daniel-talking-half.png',
        'daniel-talking2.png',
        'daniel-talking3.png',
        'daniel-talking4.png',
      ];

      mouthInterval = setInterval(() => {
        const next = frames[Math.floor(Math.random() * frames.length)];
        setTalkingFrame(next);
      }, 200);
    } else {
      setTalkingFrame('daniel-idle.png');
    }

    return () => {
      if (mouthInterval) clearInterval(mouthInterval);
    };
  }, [isTalking]);

  // Final avatar image path
  let avatarSrc = '/avatars/daniel-idle.png';

  if (isTalking) {
    avatarSrc = `/avatars/${talkingFrame}`;
  } else if (isBlinking) {
    avatarSrc = '/avatars/daniel-blink.png';
  } else {
    if (idlePose === 'left') avatarSrc = '/avatars/daniel-idle-left.png';
    else if (idlePose === 'right') avatarSrc = '/avatars/daniel-idle-right.png';
    else avatarSrc = '/avatars/daniel-idle.png';
  }

  return (
    <div className="relative w-50 h-100 mx-auto mb-6">
      <Image
        src="/frame.png"
        alt="Pixel iPhone Frame"
        fill
        priority
        className="object-contain pointer-events-none"
      />
      <div className="absolute inset-12 flex items-center justify-center">
        <Image
          src={avatarSrc}
          alt="Daniel Bot Avatar"
          width={96}
          height={96}
          className="rounded -translate-y-5"
        />
      </div>
    </div>
  );
}
