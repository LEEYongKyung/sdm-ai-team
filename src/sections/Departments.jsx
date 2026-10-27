import { useLayoutEffect, useRef } from 'react';
import { gsap, useReducedMotion } from '../lib/motion';
import { DEPARTMENTS } from '../lib/content';

// 부서 이름이 놓일 자리(%, 화면 기준) — 가운데 제목을 피해서 흩어 둔다
const SPOTS = [
  { left: 8, top: 20, size: 4.2 },
  { left: 62, top: 16, size: 3.4 },
  { left: 66, top: 70, size: 4.6 },
  { left: 8, top: 70, size: 3.6 },
  { left: 38, top: 84, size: 3 },
  { left: 36, top: 24, size: 2.8 }
];

export default function Departments() {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.dept-name');
      const wide = window.innerWidth > 1024;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom bottom', scrub: true }
      });
      // 2~3개씩 묶어서 흩어진 곳에서 모여들게 한다
      let t = 0;
      for (let i = 0; i < items.length; ) {
        const size = Math.min(items.length - i, gsap.utils.random(2, 3, 1));
        items.slice(i, i + size).forEach((el, k) => {
          tl.fromTo(
            el,
            { opacity: 0, x: wide ? gsap.utils.random(-180, 180) : 0, y: gsap.utils.random(-120, 120), scale: 0.6, filter: 'blur(12px)' },
            { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.2 },
            t + k * 0.4
          );
        });
        i += size;
        t += 1.6;
      }
      tl.fromTo('.dept-next', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, t);
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <section id="departments" className="bg-ink px-[5vw] py-[10vw] text-center">
        <h2 className="mb-10 text-[clamp(32px,4vw,64px)] font-medium">함께한 부서들</h2>
        <p className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-[clamp(22px,2.4vw,40px)] text-white/80">
          {DEPARTMENTS.map(d => (
            <span key={d}>{d}</span>
          ))}
        </p>
      </section>
    );
  }

  return (
    <section id="departments" ref={sectionRef} className="relative h-[220vh] bg-ink">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute left-1/2 top-1/2 z-[1] w-[90%] -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="mb-4 text-[clamp(13px,1vw,16px)] tracking-[0.2em] text-brand-mint">TOGETHER WITH</p>
          <h2 className="text-[clamp(36px,5vw,88px)] font-medium tracking-[-0.04em]">함께한 부서들</h2>
          <p className="dept-next mt-5 text-[clamp(15px,1.3vw,22px)] text-white/60">다음 차례는 여러분의 부서입니다</p>
        </div>
        <ul aria-label="함께한 부서 목록">
          {DEPARTMENTS.map((d, i) => {
            const s = SPOTS[i % SPOTS.length];
            return (
              <li
                key={d}
                className="dept-name absolute whitespace-nowrap font-medium tracking-[-0.03em] text-white/85 mob:!text-[7vw]"
                style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: `${s.size}vw` }}
              >
                {d}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
