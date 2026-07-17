const RING_CIRC = 578.05

export default function TimerRing({ minutes, seconds, progress, label }) {
  return (
    <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] flex items-center justify-center">
      <svg className="absolute inset-0 ring-glow" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="#34e6a8"
          strokeWidth="4"
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          strokeDasharray={RING_CIRC}
          strokeDashoffset={RING_CIRC * progress}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div className="flex flex-col items-center gap-4">
        <div
          className="font-display font-extrabold text-6xl sm:text-7xl tracking-tight tabular-nums flex items-baseline gap-1"
          aria-live="polite"
        >
          <span>{minutes}</span>
          <span className="text-white/40 -mt-2">:</span>
          <span>{seconds}</span>
        </div>
        <span className="text-xs sm:text-sm glass rounded-full px-4 py-1.5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {label}
        </span>
      </div>
    </div>
  )
}
