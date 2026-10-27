import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReduced } from '../lib/motion';
import { FAQ } from '../lib/content';
import SplitText from '../components/SplitText';
import Icon from '../components/Icon';

export default function Faq() {
  const ref = useRef(null);
  const [open, setOpen] = useState(0);

  useLayoutEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.faq-item').forEach(el =>
        gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="faq" ref={ref} className="bg-ink px-[16vw] py-[8vw] tab:px-[5vw] tab:py-[14vw]">
      <SplitText text="자주 묻는 질문" className="mb-[5vw] text-center text-[5vw] font-medium tracking-[-0.04em] tab:text-[7vw] mob:text-[10vw]" />
      <ul className="border-t border-white/15">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={item.q} className={`faq-item border-b border-white/15 ${isOpen ? 'acc-open' : ''}`}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-6 py-[1.8vw] text-left text-[clamp(17px,1.5vw,26px)] tab:py-6"
                >
                  {item.q}
                  <span className={`grid size-10 shrink-0 place-items-center rounded-full border border-white/25 transition-all duration-500 ${isOpen ? 'bg-grad rotate-45 border-transparent' : ''}`}>
                    <Icon name="plus" size={18} />
                  </span>
                </button>
              </h3>
              <div id={`faq-${i}`} className="acc-body" role="region">
                <div>
                  <p className="max-w-[60ch] pb-[2vw] text-[clamp(15px,1.1vw,18px)] leading-relaxed text-white/65 tab:pb-6">{item.a}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
