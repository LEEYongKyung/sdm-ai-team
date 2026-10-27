import { useEffect, useRef } from 'react';
import { gsap, prefersReduced } from '../lib/motion';

// 마우스가 지나가면 줄처럼 휘었다가 탄성 있게 돌아오는 구분선
export default function StringLine({ color = 'rgba(255,255,255,0.3)' }) {
  const pathRef = useRef(null);
  const hitRef = useRef(null);
  const point = useRef({ x: 500, y: 50 });

  useEffect(() => {
    const path = pathRef.current;
    const hit = hitRef.current;
    const draw = () => path.setAttribute('d', `M0,50 Q${point.current.x},${point.current.y} 1000,50`);
    draw();
    if (prefersReduced()) return;

    const onMove = e => {
      const r = hit.getBoundingClientRect();
      gsap.killTweensOf(point.current);
      point.current.x = ((e.clientX - r.left) / r.width) * 1000;
      point.current.y = 50 + (e.clientY - (r.top + r.height / 2)) * 1.4;
      draw();
    };
    const onLeave = () => {
      gsap.to(point.current, { y: 50, duration: 1.6, ease: 'elastic.out(1, 0.2)', onUpdate: draw });
    };
    hit.addEventListener('mousemove', onMove);
    hit.addEventListener('mouseleave', onLeave);
    return () => {
      hit.removeEventListener('mousemove', onMove);
      hit.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="string-line" aria-hidden="true">
      <div ref={hitRef} className="hit" />
      <svg viewBox="0 0 1000 100" preserveAspectRatio="none">
        <path ref={pathRef} style={{ stroke: color }} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
