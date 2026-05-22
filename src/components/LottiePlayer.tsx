import { useEffect, useRef } from 'react';

type LottiePlayerProps = {
  animationData?: any;
  path?: string;
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
};

export default function LottiePlayer({ animationData, path, loop = true, autoplay = true, style }: LottiePlayerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let anim: any;
    let mounted = true;
    (async () => {
      try {
        const lottie = await import('lottie-web');
        if (!mounted) return;
        anim = lottie.loadAnimation({
          container: ref.current as Element,
          renderer: 'svg',
          loop,
          autoplay,
          animationData: animationData ?? undefined,
          path: path ?? undefined
        });
      } catch (e) {
        // lottie not available; fail gracefully
      }
    })();
    return () => {
      mounted = false;
      if (anim) anim.destroy();
    };
  }, [animationData, path, loop, autoplay]);

  return <div ref={ref} style={{ width: 120, height: 120, ...style }} />;
}
