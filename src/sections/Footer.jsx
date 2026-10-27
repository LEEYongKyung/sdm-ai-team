import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReduced } from '../lib/motion';
import { TEAM, img } from '../lib/content';
import { useRequestModal } from '../components/RequestModal';
import PillButton from '../components/PillButton';
import Icon from '../components/Icon';

export default function Footer() {
  const ref = useRef(null);
  const cardRef = useRef(null);
  const openModal = useRequestModal();

  useLayoutEffect(() => {
    if (prefersReduced() || window.innerWidth <= 1025) return;
    const tween = gsap.fromTo(
      cardRef.current,
      { yPercent: 20 },
      { yPercent: 0, ease: 'power1.out', scrollTrigger: { trigger: ref.current, start: 'top 60%', end: 'bottom bottom', scrub: true } }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <footer id="contact" ref={ref} className="relative overflow-hidden bg-ink px-[4vw] pb-[3vw] pt-[10vw] tab:px-[5vw] mob:pt-[20vw]">
      <div className="pointer-events-none absolute inset-x-0 bottom-[-20%] h-[90%]" aria-hidden="true">
        <div className="absolute bottom-0 left-[10%] h-[80%] w-[55%] rounded-full bg-[#149765] opacity-70 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] h-[70%] w-[45%] rounded-full bg-[#1FD8B6] opacity-40 blur-[120px]" />
      </div>
      <div ref={cardRef} className="relative z-[1] flex flex-col gap-16 rounded-[2rem] border border-white/30 bg-black/10 px-12 py-12 backdrop-blur-2xl tab:px-8 tab:py-12 mob:px-6">
        <div className="flex items-start justify-between gap-16 tab:flex-col">
          <div className="flex items-center gap-4">
            <img src={img('logo.png')} alt="서대문구" className="h-[clamp(48px,4.5vw,80px)] w-auto" />
            <div>
              <p className="text-[clamp(13px,1vw,16px)] text-white/70">서대문구 {TEAM.dept}</p>
              <p className="text-[clamp(24px,2.2vw,38px)] font-medium leading-tight">{TEAM.name}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-[2vw] tab:items-start tab:gap-8">
            <p className="text-end text-[3.2vw] font-medium leading-[1.2] tracking-[-0.04em] tab:text-start tab:text-[6vw] mob:text-[8.5vw]">
              머릿속 아이디어,
              <br />
              일단 말씀해 주세요
            </p>
            <PillButton onClick={() => openModal()}>협업 요청하기</PillButton>
          </div>
        </div>
        <div className="flex items-end justify-between gap-8 border-t border-white/20 pt-8 text-[clamp(13px,0.95vw,16px)] text-white/70 tab:flex-col tab:items-start">
          <div className="flex flex-wrap gap-x-10 gap-y-3">
            <a href={`tel:${TEAM.phone}`} className="under-parent flex items-center gap-2 hover:text-white">
              <Icon name="phone" size={16} />
              <span className="under-line">{TEAM.phone}</span>
            </a>
            <span>
              {TEAM.dept} {TEAM.name}
            </span>
          </div>
          <p className="text-white/45">© 2026 서대문구 {TEAM.dept} {TEAM.name}</p>
        </div>
      </div>
    </footer>
  );
}
