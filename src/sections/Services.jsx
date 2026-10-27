import { useLayoutEffect, useRef } from 'react';
import { gsap, useReducedMotion } from '../lib/motion';
import { SERVICES } from '../lib/content';
import SplitText from '../components/SplitText';
import Icon from '../components/Icon';
import { useRequestModal } from '../components/RequestModal';

// 카드 → 요청서의 요청 유형
const TYPE_OF = {
  '문서·보고서 자동화': '문서·보고서 자동화',
  '매뉴얼 기반 업무 도우미 생성': '매뉴얼 기반 업무 도우미',
  'AI 시범 서비스 개발': 'AI 시범 서비스',
  '업무 지원 챗봇': '업무 지원 챗봇',
  '반복 업무 자동화': '반복 업무 자동화'
};

function ServiceCard({ s, index, fillRef, static: isStatic }) {
  const openModal = useRequestModal();
  const reveal = useRef({ v: -40 });

  const animate = to => {
    gsap.to(reveal.current, {
      v: to,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => fillRef.current[index]?.style.setProperty('--reveal', `${reveal.current.v}%`)
    });
  };

  return (
    <button
      type="button"
      onClick={() => openModal(TYPE_OF[s.title])}
      onMouseEnter={() => animate(100)}
      onMouseLeave={() => animate(-40)}
      onFocus={() => animate(100)}
      onBlur={() => animate(-40)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/20 bg-card p-[1.8vw] text-left tab:p-6 ${
        isStatic ? 'min-h-[320px]' : 'h-[min(28vw,52vh)] min-h-[300px] w-[27vw] shrink-0 tab:h-[min(62vw,46vh)] tab:w-[55vw] mob:w-[78vw]'
      }`}
    >
      <span ref={el => (fillRef.current[index] = el)} className="radial-mask-fill bg-grad absolute inset-0" />
      <span className="relative flex items-start justify-between">
        <span className="text-[clamp(14px,1vw,16px)] text-white/50 transition-colors group-hover:text-white/90">0{index + 1}</span>
        <span className="relative grid size-[3vw] min-h-11 min-w-11 place-items-center overflow-hidden rounded-full border border-white/30 transition-colors duration-300 group-hover:bg-white group-hover:text-black">
          <span className="transition-transform duration-300 ease-out group-hover:-translate-y-[150%] group-hover:translate-x-[150%]">
            <Icon name="arrow" size={20} />
          </span>
          <span className="absolute -translate-x-[150%] translate-y-[150%] transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0">
            <Icon name="arrow" size={20} />
          </span>
        </span>
      </span>
      <span className="relative block">
        <span className="mb-[1vw] block text-[clamp(22px,1.9vw,34px)] font-medium leading-tight tracking-[-0.03em] tab:mb-3">{s.title}</span>
        <span className="mb-[1.4vw] block text-[clamp(14px,1vw,17px)] leading-relaxed text-white/70 group-hover:text-white tab:mb-4">{s.desc}</span>
        <span className="block border-t border-white/15 pt-[1vw] text-[clamp(13px,0.9vw,15px)] text-white/55 group-hover:border-white/40 group-hover:text-white tab:pt-3">
          예) {s.example}
        </span>
      </span>
    </button>
  );
}

export default function Services() {
  const reduced = useReducedMotion();
  const rowRef = useRef(null);
  const fillRef = useRef([]);

  useLayoutEffect(() => {
    if (reduced) return;
    const mm = gsap.matchMedia();
    const make = (from, to) => () => {
      gsap.fromTo(rowRef.current, { xPercent: from }, { xPercent: to, ease: 'none', scrollTrigger: { trigger: '#services', start: 'top top', end: 'bottom bottom', scrub: true } });
    };
    mm.add('(min-width: 1026px)', make(55, -38));
    mm.add('(min-width: 768px) and (max-width: 1025px)', make(40, -72));
    mm.add('(max-width: 767px)', make(30, -82));
    return () => mm.revert();
  }, [reduced]);

  const intro = (
    <div className="relative flex w-full items-end justify-between gap-8 px-[4vw] tab:flex-col tab:items-start tab:gap-4 tab:px-[5vw]">
      <SplitText text={'이런 걸\n요청할 수 있어요'} className="text-[4.4vw] font-medium leading-[1.12] tracking-[-0.04em] tab:text-[7vw] mob:text-[10vw]" />
      <p className="max-w-[40ch] text-[clamp(15px,1.2vw,20px)] leading-relaxed text-white/65">
        아래 업무가 아니어도 괜찮습니다. 카드를 누르면 해당 유형으로 바로 요청서를 쓸 수 있어요.
      </p>
    </div>
  );

  if (reduced) {
    return (
      <section id="services" className="bg-ink pb-[8vw]">
        {intro}
        <div className="mt-12 grid grid-cols-3 gap-5 px-[4vw] tab:grid-cols-2 mob:grid-cols-1">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} s={s} index={i} fillRef={fillRef} static />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="relative h-[280vh] bg-ink">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-[3vw] overflow-hidden pt-[clamp(80px,6vw,110px)] tab:gap-8">
        {intro}
        <div ref={rowRef} className="flex w-max gap-[1.6vw] px-[4vw] will-change-transform tab:gap-[2.5vw] mob:gap-[5vw]">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} s={s} index={i} fillRef={fillRef} />
          ))}
        </div>
      </div>
    </section>
  );
}
