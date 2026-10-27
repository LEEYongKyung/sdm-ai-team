import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReduced } from '../lib/motion';
import { HERO, MARQUEE_IMAGES, img } from '../lib/content';
import SplitText from '../components/SplitText';
import SafeElectricLogo from '../components/SafeElectricLogo';

const HERO_BG = `
  radial-gradient(75% 80% at 48% 38%, #0E7A50 0%, rgba(14,122,80,0) 70%),
  linear-gradient(180deg, #1BA874 0%, #149765 26%, #0E7A50 44%, #0A4F36 64%, #06241A 84%, #050B08 100%)
`;

const EDGE_FADE = 'radial-gradient(closest-side, #000 70%, transparent 100%)';

function MarqueeColumn({ images, className }) {
  const list = [...images, ...images];
  return (
    <div className={`flex w-1/2 flex-col gap-[2.5vw] ${className}`}>
      {list.map((src, i) => (
        <img key={i} src={src} alt="" loading="lazy" className="w-full rounded-lg border border-white/10 object-cover" />
      ))}
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const panelRef = useRef(null);
  const bgRef = useRef(null);
  const logoRef = useRef(null);
  const sideRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReduced()) {
      logoRef.current.style.setProperty('--reveal', '125%');
      return;
    }
    const ctx = gsap.context(() => {
      // 첫 화면: 로고 대각선 리빌 + 오른쪽 문구
      const reveal = { v: 0 };
      gsap.to(reveal, {
        v: 125,
        duration: 2.4,
        delay: 0.5,
        ease: 'power2.inOut',
        onUpdate: () => logoRef.current?.style.setProperty('--reveal', `${reveal.v}%`)
      });
      gsap.fromTo(logoRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.5 });
      gsap.fromTo(sideRef.current.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, delay: 1, ease: 'power2.out' });

      // 스크롤: 히어로가 줄어들고 뒤의 결과물 화면이 선명해짐
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true }
      });
      tl.to(panelRef.current, { scale: 0.5, borderRadius: 28, ease: 'power2.inOut', duration: 1 }, 0);
      gsap.set(bgRef.current, { filter: 'blur(24px)', opacity: 0.35 });
      tl.to(bgRef.current, { filter: 'blur(0px)', opacity: 1, ease: 'power2.out', duration: 0.25 }, 0.3);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Electric Logo는 자기 영역 안의 클릭에만 물결을 일으키므로,
  // 히어로 어디를 눌러도 그 지점에서 물결이 퍼지도록 로고 영역으로 클릭을 넘겨준다
  const forwardPointer = e => {
    const target = logoRef.current?.querySelector('canvas')?.parentElement;
    if (!target || target.contains(e.target)) return;
    target.dispatchEvent(new PointerEvent('pointerdown', { clientX: e.clientX, clientY: e.clientY, pointerId: e.pointerId, bubbles: false }));
  };

  const colA = MARQUEE_IMAGES;
  const colB = [...MARQUEE_IMAGES].reverse();

  return (
    <section id="top" ref={sectionRef} className="tall-section relative h-[230vh]">
      <div className="sticky-stage sticky top-0 h-screen min-h-[560px] overflow-hidden">
        <div ref={bgRef} className="absolute inset-0 flex gap-[2.5vw] overflow-hidden bg-ink px-[4vw]" aria-hidden="true">
          <MarqueeColumn images={colA} className="marquee-1" />
          <MarqueeColumn images={colB} className="marquee-2 -mt-[30%]" />
        </div>

        <div
          ref={panelRef}
          onPointerDown={forwardPointer}
          className="absolute inset-0 origin-center overflow-hidden will-change-transform"
          style={{ background: HERO_BG }}
        >
          <div className="relative z-[2] flex justify-between px-[4vw] pt-[clamp(110px,10vw,180px)] tab:flex-col tab:gap-8 tab:px-[5vw]">
            <SplitText
              as="h1"
              text={HERO.title.replace(', ', ',\n')}
              onScroll={false}
              delay={0.2}
              stagger={0.03}
              duration={0.8}
              className="w-[60%] text-[6.4vw] font-medium leading-[1.12] tracking-[-0.04em] tab:w-full tab:text-[10vw] mob:text-[12vw]"
            />
            <div ref={sideRef} className="flex flex-col justify-between gap-6 py-[1vw] text-end text-[1.3vw] leading-[1.35] tab:text-start tab:text-[3.4vw] mob:text-[4.4vw]">
              {HERO.side.map(line => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div
            ref={logoRef}
            className="hero-mask-reveal absolute bottom-[-20vh] left-1/2 z-[1] aspect-square w-[min(110vh,78vw)] -translate-x-1/2 tab:bottom-[-14vh] tab:w-[120vw] mob:w-[150vw]"
          >
            {/* 빛 번짐이 사각 영역에서 잘려 테두리처럼 보이지 않도록 가장자리를 원형으로 흐리게 한다 */}
            <SafeElectricLogo
              src={img('logo.png')}
              color="#C2FFF1"
              glowColor="#1FD8B6"
              scale={0.62}
              fill={0.18}
              style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
            />
          </div>

          <p className="absolute bottom-[3vw] left-[4vw] z-[2] flex items-center gap-3 text-[clamp(12px,0.85vw,14px)] text-white/60 tab:hidden">
            <span className="inline-block h-px w-10 bg-white/50" />
            스크롤해서 둘러보기
          </p>
        </div>
      </div>
    </section>
  );
}
