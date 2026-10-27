import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, lockScroll, prefersReduced } from '../lib/motion';
import { REQUEST_TYPES, TEAM } from '../lib/content';
import Icon from './Icon';
import PillButton from './PillButton';

const RequestContext = createContext(() => {});
export const useRequestModal = () => useContext(RequestContext);

const EMPTY = { dept: '', name: '', phone: '', type: '', content: '', schedule: '' };

export function RequestProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [presetType, setPresetType] = useState('');
  const openModal = useCallback((type = '') => {
    setPresetType(type);
    setOpen(true);
  }, []);

  return (
    <RequestContext.Provider value={openModal}>
      {children}
      {open && <RequestModal presetType={presetType} onClose={() => setOpen(false)} />}
    </RequestContext.Provider>
  );
}

const toText = f =>
  [
    `[AI협업요청] ${f.dept} - ${f.type}`,
    '',
    `부서명: ${f.dept}`,
    `담당자: ${f.name}`,
    `내선번호: ${f.phone}`,
    `요청 유형: ${f.type}`,
    `희망 일정: ${f.schedule || '-'}`,
    '',
    '요청 내용:',
    f.content
  ].join('\n');

function RequestModal({ presetType, onClose }) {
  const [form, setForm] = useState({ ...EMPTY, type: presetType });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed
  const [copied, setCopied] = useState(false);
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const firstRef = useRef(null);
  const closing = useRef(false);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (prefersReduced()) return onClose();
    gsap
      .timeline({ onComplete: onClose })
      .to(panelRef.current, { xPercent: 100, duration: 0.5, ease: 'power3.in' })
      .to(rootRef.current, { opacity: 0, duration: 0.25 }, '-=0.15');
  }, [onClose]);

  useLayoutEffect(() => {
    lockScroll(true);
    if (!prefersReduced()) {
      gsap.fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(panelRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.7, ease: 'power3.out' });
    }
    firstRef.current?.focus({ preventScroll: true });
    return () => lockScroll(false);
  }, []);

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json().catch(() => ({}));
      setStatus(res.ok && data.ok ? 'sent' : 'failed');
    } catch {
      setStatus('failed');
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toText(form));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex justify-end bg-black/60 backdrop-blur-sm"
      onMouseDown={e => e.target === e.currentTarget && close()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-title"
    >
      <div
        ref={panelRef}
        data-lenis-prevent
        className="relative flex h-full w-[min(560px,100%)] flex-col overflow-y-auto border-l border-white/15 bg-[#0d0d0d] px-10 py-10 mob:px-6"
      >
        <div className="mb-10 flex items-start justify-between gap-6">
          <div>
            <p className="mb-2 text-sm text-white/50">{TEAM.dept} {TEAM.name}</p>
            <h2 id="request-title" className="text-[clamp(26px,2.2vw,36px)] font-medium leading-tight">
              협업 요청서
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="닫기"
            className="bg-grad grid size-12 shrink-0 place-items-center rounded-full text-white transition-transform duration-300 hover:rotate-90"
          >
            <Icon name="close" size={20} strokeWidth={2} />
          </button>
        </div>

        {status === 'sent' ? (
          <div className="flex flex-1 flex-col justify-center gap-4">
            <p className="text-grad text-3xl font-medium">요청서가 전달되었어요</p>
            <p className="leading-relaxed text-white/70">
              확인 후 적어주신 내선번호로 연락드리겠습니다. 급한 일은 {TEAM.phone}로 전화 주세요.
            </p>
            <div className="mt-6">
              <PillButton onClick={close}>닫기</PillButton>
            </div>
          </div>
        ) : status === 'failed' ? (
          <div className="flex flex-col gap-5">
            <p className="text-xl font-medium">메일 전송이 원활하지 않아요</p>
            <p className="leading-relaxed text-white/70">
              작성하신 내용은 그대로 남아 있습니다. 아래 내용을 복사해 <b className="text-white">{TEAM.mail}</b>로 보내주시거나{' '}
              <b className="text-white">{TEAM.phone}</b>로 전화 주세요.
            </p>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-white/15 bg-white/5 p-4 text-sm leading-relaxed text-white/80">
              {toText(form)}
            </pre>
            <div className="flex flex-wrap gap-3">
              <PillButton onClick={copy}>{copied ? '복사했어요' : '요청 내용 복사'}</PillButton>
              <button type="button" onClick={() => setStatus('idle')} className="under-line px-2 text-white/70 hover:text-white">
                다시 작성하기
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-7">
            <p className="-mt-4 text-white/60">정리가 덜 됐어도 괜찮습니다. 떠오르는 대로 적어주세요.</p>
            <div className="grid grid-cols-2 gap-6 mob:grid-cols-1">
              <label className="block">
                <span className="text-sm text-white/60">부서명 *</span>
                <input ref={firstRef} className="field" required value={form.dept} onChange={set('dept')} placeholder="예) 재난안전과" />
              </label>
              <label className="block">
                <span className="text-sm text-white/60">담당자 *</span>
                <input className="field" required value={form.name} onChange={set('name')} placeholder="성명·직급" />
              </label>
              <label className="block">
                <span className="text-sm text-white/60">내선번호 *</span>
                <input className="field" required value={form.phone} onChange={set('phone')} placeholder="예) 1234" inputMode="tel" />
              </label>
              <label className="block">
                <span className="text-sm text-white/60">희망 일정</span>
                <input className="field" value={form.schedule} onChange={set('schedule')} placeholder="예) 12월 중" />
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-white/60">요청 유형 *</span>
              <select className="field" required value={form.type} onChange={set('type')}>
                <option value="" disabled>선택해 주세요</option>
                {REQUEST_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-white/60">요청 내용 *</span>
              <textarea
                className="field min-h-[140px] resize-y"
                required
                value={form.content}
                onChange={set('content')}
                placeholder="어떤 업무에서, 무엇이 불편하거나 해보고 싶은지 적어주세요."
              />
            </label>
            <div className="flex items-center justify-between gap-4 pt-2 mob:flex-col mob:items-start">
              <p className="text-sm text-white/45">문의 {TEAM.phone}</p>
              <PillButton type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? '보내는 중…' : '요청서 보내기'}
              </PillButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
