import { useEffect, useState } from 'react';

function detectTouchDevice() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches || navigator.maxTouchPoints > 0;
}

export default function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(detectTouchDevice);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const coarse = window.matchMedia('(pointer: coarse)');
    const hoverNone = window.matchMedia('(hover: none)');
    const update = () => setIsTouchDevice(detectTouchDevice());

    coarse.addEventListener?.('change', update);
    hoverNone.addEventListener?.('change', update);
    window.addEventListener('resize', update);

    return () => {
      coarse.removeEventListener?.('change', update);
      hoverNone.removeEventListener?.('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return isTouchDevice;
}
