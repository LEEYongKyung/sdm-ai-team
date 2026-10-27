// 참조 사이트의 알약형 버튼: 왼쪽 점이 호버 시 버튼 전체로 퍼진다
export default function PillButton({ children, onClick, className = '', type = 'button', disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/20 bg-white py-3 pl-4 pr-6 text-[clamp(14px,1.05vw,18px)] text-[#111] transition-colors duration-500 hover:text-white disabled:opacity-60 ${className}`}
    >
      <span className="relative z-[1] size-2.5 shrink-0">
        <span className="bg-grad absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[60]" />
      </span>
      <span className="relative z-[2] font-medium">{children}</span>
    </button>
  );
}
