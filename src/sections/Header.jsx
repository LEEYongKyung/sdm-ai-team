import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReduced, scrollToTarget } from '../lib/motion';
import { TEAM, img } from '../lib/content';
import { useRequestModal } from '../components/RequestModal';
import PillButton from '../components/PillButton';

const NAV = [
  ['#cases', '해낸 일'],
  ['#services', '요청 가능 업무'],
  ['#process', '협업 절차'],
  ['#faq', '자주 묻는 질문']
];

export default function Header() {
  const ref = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const openModal = useRequestModal();

  useLayoutEffect(() => {
    if (prefersReduced()) return;
    const tween = gsap.fromTo(ref.current, { yPercent: -60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1.5 });
    return () => tween.kill();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-[4vw] py-[1.4vw] transition-[backdrop-filter,background-color] duration-500 tab:px-[5vw] tab:py-4 ${
        scrolled ? 'bg-black/30 backdrop-blur-lg' : ''
      }`}
    >
      <a href="#top" onClick={e => (e.preventDefault(), scrollToTarget('#top'))} className="flex items-center gap-3">
        <span className="grid size-[clamp(38px,2.9vw,50px)] place-items-center rounded-full bg-white">
          <img src={img('logo.png')} alt="서대문구" className="w-[72%]" />
        </span>
        <span className="leading-tight">
          <span className="block text-[clamp(11px,0.75vw,13px)] text-white/60">서대문구 {TEAM.dept}</span>
          <span className="block text-[clamp(15px,1.1vw,19px)] font-medium">{TEAM.name}</span>
        </span>
      </a>
      <nav className="flex items-center gap-[2.4vw]">
        <ul className="flex gap-[2vw] text-[clamp(14px,0.95vw,16px)] text-white/75 tab:hidden">
          {NAV.map(([href, label]) => (
            <li key={href}>
              <a href={href} onClick={e => (e.preventDefault(), scrollToTarget(href))} className="under-line hover:text-white">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <PillButton onClick={() => openModal()}>협업 요청하기</PillButton>
      </nav>
    </header>
  );
}
