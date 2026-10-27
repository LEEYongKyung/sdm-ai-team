import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, scrollToTarget, useReducedMotion } from '../lib/motion';
import { CASES, CASE_FACTS } from '../lib/content';
import SplitText from '../components/SplitText';

const GRAD_BG = 'linear-gradient(90deg, #149765 0%, #0F8A6A 55%, #12A88E 100%)';

// 결과물 캡처가 가로로 넓어서 글은 위 띠에, 화면은 아래에 잘리지 않게 통째로 둔다
function CaseCard({ c, index }) {
  return (
    <article className="flex h-full w-full flex-col tab:h-auto overflow-hidden rounded-2xl bg-[#F3F6F4] text-[#0c1a14]">
      <div className="flex items-end gap-[2.4vw] px-[2.4vw] pb-[1.4vw] pt-[1.8vw] tab:flex-col tab:items-start tab:gap-3 tab:p-5">
        <div className="min-w-0 shrink-0">
          <div className="mb-[0.8vw] flex flex-wrap items-center gap-2 text-[clamp(12px,0.85vw,14px)] tab:mb-2">
            <span className="rounded-full bg-[#149765] px-3 py-1 font-medium text-white">{c.dept}</span>
            <span className="rounded-full border border-[#0c1a14]/15 px-3 py-1 text-[#0c1a14]/70">{c.tags}</span>
          </div>
          <h3 className="text-[clamp(22px,2vw,36px)] font-bold leading-[1.2] tracking-[-0.03em]">{c.title}</h3>
        </div>
        <dl className="grid min-w-0 flex-1 grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-l border-[#0c1a14]/10 pl-[2vw] text-[clamp(13px,0.9vw,15px)] leading-snug tab:order-last tab:w-full tab:border-l-0 tab:border-t tab:pl-0 tab:pt-3">
          <dt className="text-[#0c1a14]/45">기존</dt>
          <dd>{c.before}</dd>
          <dt className="text-[#0c1a14]/45">개선</dt>
          <dd>{c.after}</dd>
        </dl>
        <div className="shrink-0 text-right tab:text-left">
          {c.metric ? (
            <>
              <p className="text-[clamp(12px,0.8vw,14px)] text-[#0c1a14]/55">{c.metric.label}</p>
              <p className="mt-1 flex items-baseline justify-end gap-2 text-[clamp(26px,2.6vw,46px)] font-bold leading-none tracking-[-0.04em] tab:justify-start">
                {c.metric.from && (
                  <>
                    <span className="text-[#0c1a14]/35">{c.metric.from}</span>
                    <span className="text-[0.6em] text-[#0c1a14]/35">→</span>
                  </>
                )}
                <span className="text-[#0E7A50]">{c.metric.to}</span>
              </p>
              <p className="mt-1.5 text-[clamp(12px,0.8vw,14px)] text-[#0c1a14]/55">{c.note}</p>
            </>
          ) : (
            <p className="text-[clamp(18px,1.5vw,26px)] font-bold text-[#0E7A50]">{c.note}</p>
          )}
        </div>
      </div>
      <div className="relative min-h-0 flex-1 bg-[#E3EBE6] tab:flex-none tab:p-3">
        <img
          src={c.img}
          alt={`${c.title} 프로그램 화면`}
          loading={index ? 'lazy' : 'eager'}
          className="absolute inset-[clamp(12px,1.4vw,24px)] h-[calc(100%-2*clamp(12px,1.4vw,24px))] w-[calc(100%-2*clamp(12px,1.4vw,24px))] object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.18)] tab:static tab:h-auto tab:w-full"
        />
      </div>
    </article>
  );
}

export default function Cases() {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const arcRef = useRef(null);
  const cardsRef = useRef([]);
  const progressRef = useRef(null);
  const stRef = useRef(null);
  const [active, setActive] = useState(0);
  const n = CASES.length;

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;
      // 밝기 시작값을 정해 두지 않으면 'none'이 brightness(0)으로 해석돼 전환 중 카드가 검게 보인다
      gsap.set(cards, { filter: 'brightness(1)' });
      gsap.set(cards.slice(1), { yPercent: 115 });
      gsap.set(progressRef.current, { scaleY: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '10% top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: self => setActive(Math.round(self.progress * (n - 1)))
        }
      });
      const st = (stRef.current = tl.scrollTrigger);

      // 카드 맞춤: GSAP snap은 Lenis와 방향 판단이 어긋나 뒤로 되돌아가므로,
      // 스크롤이 멈추면 마지막으로 굴린 방향의 카드 위치로 직접 이동한다
      const onScrollEnd = () => {
        if (!st.isActive) return;
        const raw = st.progress * (n - 1);
        const nearest = Math.round(raw);
        if (Math.abs(raw - nearest) < 0.01) return;
        const idx = st.direction > 0 ? Math.ceil(raw - 0.15) : Math.floor(raw + 0.15);
        const target = st.start + ((st.end - st.start) * Math.min(Math.max(idx, 0), n - 1)) / (n - 1);
        scrollToTarget(target, { duration: 0.7 });
      };
      ScrollTrigger.addEventListener('scrollEnd', onScrollEnd);
      tl.to(progressRef.current, { scaleY: 1, ease: 'none', duration: n - 1 }, 0);
      for (let i = 0; i < n - 1; i++) {
        tl.to(cards[i + 1], { yPercent: 0, ease: 'power2.inOut', duration: 1 }, i);
        tl.to(cards[i], { filter: 'brightness(0.3)', scale: 0.94, ease: 'power2.inOut', duration: 1 }, i);
      }

      // 섹션 위쪽 곡선 띠
      gsap.set(arcRef.current, { clipPath: 'ellipse(150% 100% at 50% 100%)' });
      gsap.to(arcRef.current, {
        clipPath: 'ellipse(60% 100% at 50% 100%)',
        yPercent: -70,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: '30% bottom', scrub: true }
      });

      return () => ScrollTrigger.removeEventListener('scrollEnd', onScrollEnd);
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced, n]);

  const goTo = i => {
    const st = stRef.current;
    if (!st) return;
    scrollToTarget(st.start + ((st.end - st.start) * i) / (n - 1));
  };

  if (reduced) {
    return (
      <section id="cases" className="px-[4vw] py-[8vw]" style={{ background: GRAD_BG }}>
        <h2 className="mb-10 text-[clamp(32px,4vw,64px)] font-medium">우리가 해낸 일</h2>
        <div className="flex flex-col gap-8">
          {CASES.map((c, i) => (
            <div key={c.title} className="h-[70vh] min-h-[480px] tab:h-auto tab:min-h-0">
              <CaseCard c={c} index={i} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="cases" ref={sectionRef} className="relative text-white" style={{ height: `${n * 90 + 40}vh` }}>
      <div ref={arcRef} className="pointer-events-none absolute left-0 top-0 z-[2] h-[50vh] w-full will-change-[clip-path]" style={{ background: GRAD_BG }} />
      <div className="sticky top-0 z-[3] flex h-screen gap-[3vw] overflow-hidden px-[4vw] pb-[4vw] pt-[clamp(96px,8vw,150px)] tab:flex-col tab:px-[5vw]" style={{ background: GRAD_BG }}>
        <div className="flex w-[24%] shrink-0 flex-col justify-between tab:w-full">
          <div>
            <SplitText text="우리가 해낸 일" className="mb-[3vw] text-[clamp(30px,3.4vw,60px)] font-medium tracking-[-0.04em]" />
            <ol className="relative flex flex-col gap-[2.4vw] pl-6 tab:hidden">
              <span className="absolute left-[4px] top-2 h-[calc(100%-1rem)] w-px bg-white/30" />
              <span ref={progressRef} className="absolute left-[4px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-white" />
              {CASES.map((c, i) => (
                <li key={c.title}>
                  <button type="button" onClick={() => goTo(i)} className="group relative text-left">
                    <span
                      className={`absolute -left-6 top-[0.45em] size-[9px] rounded-full border transition-colors duration-300 ${
                        i <= active ? 'border-white bg-white' : 'border-white/50 bg-[#12907A]'
                      }`}
                    />
                    <span className={`block text-[clamp(16px,1.3vw,22px)] transition-opacity ${i === active ? 'opacity-100' : 'opacity-60 group-hover:opacity-90'}`}>
                      {c.title}
                    </span>
                    <span className="block text-[clamp(12px,0.85vw,14px)] text-white/70">{c.dept}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <ul className="flex flex-wrap gap-2 text-[clamp(12px,0.8vw,14px)] tab:hidden [@media(max-height:760px)]:hidden">
            {CASE_FACTS.map(f => (
              <li key={f} className="rounded-full border border-white/40 px-3 py-1.5 text-white/90">{f}</li>
            ))}
          </ul>
        </div>
        <div className="relative flex-1">
          {CASES.map((c, i) => (
            <div key={c.title} ref={el => (cardsRef.current[i] = el)} className="absolute inset-0 will-change-transform tab:flex tab:items-center" style={{ zIndex: i + 1 }}>
              <CaseCard c={c} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
