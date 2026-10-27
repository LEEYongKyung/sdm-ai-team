import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReduced } from '../lib/motion';

// 글자 단위로 아래에서 올라오는 제목. 줄바꿈은 text 안의 '\n'
export default function SplitText({
  text,
  as: Tag = 'h2',
  className = '',
  stagger = 0.015,
  duration = 0.6,
  delay = 0,
  onScroll = true,
  scrub = false,
  start = 'top 85%'
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (prefersReduced()) return;
    const chars = ref.current.querySelectorAll('.split-char');
    const ctx = gsap.context(() => {
      const to = { yPercent: 0, duration, stagger, ease: 'power3.out', delay };
      if (onScroll) {
        to.scrollTrigger = scrub
          ? { trigger: ref.current, start, end: 'bottom 60%', scrub: 0.6 }
          : { trigger: ref.current, start, once: true };
      }
      gsap.fromTo(chars, { yPercent: 115 }, to);
    }, ref);
    return () => ctx.revert();
  }, [text, stagger, duration, delay, onScroll, scrub, start]);

  const lines = text.split('\n');

  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\n/g, ' ')}>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden="true">
          {line.split(' ').map((word, wi, arr) => (
            <span key={wi}>
              <span className="split-word">
                <span className="split-mask">
                  {[...word].map((ch, ci) => (
                    <span key={ci} className="split-char">{ch}</span>
                  ))}
                </span>
              </span>
              {wi < arr.length - 1 && ' '}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
