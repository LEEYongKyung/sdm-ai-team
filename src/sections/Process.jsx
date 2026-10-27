import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReduced } from '../lib/motion';
import { PROCESS } from '../lib/content';
import SplitText from '../components/SplitText';
import StringLine from '../components/StringLine';
import Icon from '../components/Icon';

// AI 생성 이미지가 준비되면 PROCESS 항목에 img를 넣어 교체한다
function StepVisual({ step, index }) {
  if (step.img) return <img src={step.img} alt="" className="h-full w-full object-cover" />;
  const angle = 120 + index * 40;
  return (
    <div
      className="relative grid h-full w-full place-items-center overflow-hidden"
      style={{ background: `linear-gradient(${angle}deg, #06241A 0%, #0E7A50 55%, #1FD8B6 130%)` }}
    >
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.35) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
      <div className="absolute -right-[10%] -top-[30%] size-[70%] rounded-full bg-[#1FD8B6]/30 blur-3xl" />
      <span className="absolute bottom-[6%] left-[6%] text-[5vw] font-bold leading-none text-white/15">{step.no}</span>
      <Icon name={step.icon} size={96} strokeWidth={1} className="relative text-[#C2FFF1]" />
    </div>
  );
}

export default function Process() {
  const sectionRef = useRef(null);
  const previewRef = useRef(null);
  const visualsRef = useRef([]);
  const linesRef = useRef([]);
  const current = useRef(-1);

  useLayoutEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      linesRef.current.forEach(el =>
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.inOut', scrollTrigger: { trigger: el, start: 'top 88%' } })
      );
      gsap.fromTo('.step-row', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.step-list', start: 'top 80%' } });
      gsap.set(visualsRef.current, { scale: 0.6, opacity: 0 });
      gsap.set(previewRef.current, { yPercent: -50, opacity: 0, scale: 0.8 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const move = useRef(null);
  const onListMove = e => {
    if (prefersReduced()) return;
    if (!move.current) {
      move.current = {
        x: gsap.quickTo(previewRef.current, 'x', { duration: 0.6, ease: 'power3.out' }),
        y: gsap.quickTo(previewRef.current, 'y', { duration: 0.6, ease: 'power3.out' })
      };
    }
    const r = sectionRef.current.getBoundingClientRect();
    move.current.x(e.clientX - r.left + 36);
    move.current.y(e.clientY - r.top);
  };

  const show = i => {
    if (prefersReduced() || i === current.current) return;
    const prev = current.current;
    current.current = i;
    gsap.to(previewRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.6)' });
    if (prev >= 0) gsap.to(visualsRef.current[prev], { scale: 1.1, opacity: 0, duration: 0.45, ease: 'power2.out' });
    gsap.set(visualsRef.current[i], { zIndex: 10 + i });
    gsap.fromTo(visualsRef.current[i], { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.6)' });
  };

  const hide = () => {
    if (prefersReduced()) return;
    if (current.current >= 0) gsap.to(visualsRef.current[current.current], { opacity: 0, duration: 0.3 });
    current.current = -1;
    gsap.to(previewRef.current, { opacity: 0, scale: 0.8, duration: 0.3 });
  };

  return (
    <section id="process" ref={sectionRef} className="relative bg-ink px-[10vw] py-[9vw] tab:px-[5vw] tab:py-[14vw]">
      <div className="mb-[6vw] flex items-end justify-between gap-8 tab:flex-col tab:items-start">
        <SplitText text="협업 절차" className="text-[5vw] font-medium tracking-[-0.04em] tab:text-[7vw] mob:text-[10vw]" />
        <p className="max-w-[34ch] text-[clamp(15px,1.15vw,19px)] leading-relaxed text-white/60">
          요청부터 적용까지, 담당자와 계속 이야기 나누며 진행합니다.
        </p>
      </div>

      <div className="step-list relative" onMouseMove={onListMove} onMouseLeave={hide}>
        <div ref={el => (linesRef.current[0] = el)} className="origin-left">
          <StringLine />
        </div>
        {PROCESS.map((step, i) => (
          <div key={step.no}>
            <div
              className="step-row group grid cursor-default grid-cols-[8vw_1fr_1.1fr] items-center gap-[3vw] py-[2.6vw] tab:grid-cols-[56px_1fr] tab:gap-4 tab:py-8"
              onMouseEnter={() => show(i)}
            >
              <span className="text-[clamp(14px,1.1vw,18px)] text-white/40 transition-colors group-hover:text-brand-mint">{step.no}</span>
              <h3 className="text-[clamp(24px,2.6vw,46px)] font-medium tracking-[-0.03em] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-3">
                {step.title}
              </h3>
              <p className="text-[clamp(14px,1.05vw,18px)] leading-relaxed text-white/55 transition-colors group-hover:text-white/85 tab:col-start-2">{step.desc}</p>
            </div>
            <div ref={el => (linesRef.current[i + 1] = el)} className="origin-left">
              <StringLine />
            </div>
          </div>
        ))}
      </div>

      <div
        ref={previewRef}
        className="pointer-events-none absolute left-0 top-0 z-20 h-[18vw] w-[28vw] overflow-hidden rounded-xl opacity-0 shadow-2xl tab:hidden"
        aria-hidden="true"
      >
        {PROCESS.map((step, i) => (
          <div key={step.no} ref={el => (visualsRef.current[i] = el)} className="absolute inset-0">
            <StepVisual step={step} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
