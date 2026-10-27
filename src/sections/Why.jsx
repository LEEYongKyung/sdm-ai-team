import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReduced } from '../lib/motion';
import { WHY } from '../lib/content';
import SplitText from '../components/SplitText';
import Icon from '../components/Icon';

export default function Why() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.why-card',
        { opacity: 0, yPercent: 12 },
        { opacity: 1, yPercent: 0, stagger: 0.08, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: '.why-grid', start: 'top 80%' } }
      );
      gsap.fromTo(
        '.why-line',
        { scaleX: 0 },
        { scaleX: 1, stagger: 0.08, duration: 1.2, ease: 'power2.inOut', scrollTrigger: { trigger: '.why-grid', start: 'top 70%' } }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="why" ref={ref} className="relative bg-ink pb-[10vw] pt-[18vw] tab:pt-[24vw]">
      <div className="mb-[6vw] text-center">
        <SplitText text="왜 AI운영지원팀인가요?" className="text-[5vw] font-medium tracking-[-0.04em] tab:text-[7vw] mob:text-[9vw]" />
        <p className="mt-[1.4vw] text-[clamp(15px,1.3vw,22px)] text-white/60 mob:mt-4">기획부터 개발, 자문까지 한 팀에서 함께합니다</p>
      </div>
      <div className="why-grid grid grid-cols-3 gap-[4vw] px-[4vw] tab:grid-cols-1 tab:gap-14 tab:px-[5vw]">
        {WHY.map(item => (
          <div key={item.title} className="why-card flex flex-col">
            <Icon name={item.icon} size={32} className="mb-[2.4vw] text-brand-mint tab:mb-6" />
            <h3 className="mb-[1.4vw] text-[clamp(20px,1.6vw,28px)] font-medium leading-snug tab:mb-3">{item.title}</h3>
            <p className="mb-[4vw] flex-1 text-[clamp(15px,1.05vw,18px)] leading-relaxed text-white/65 tab:mb-8">{item.desc}</p>
            <span className="why-line block h-px w-full origin-left bg-white/20" />
          </div>
        ))}
      </div>
    </section>
  );
}
