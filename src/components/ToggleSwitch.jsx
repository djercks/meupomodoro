export default function ToggleSwitch({ checked, onChange, disabled = false, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`w-10 h-6 rounded-full relative transition flex-shrink-0 ${
        disabled ? 'bg-white/10 cursor-not-allowed' : checked ? 'bg-[var(--accent)]' : 'bg-white/15'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
          checked ? 'left-4.5' : 'left-0.5'
        }`}
        style={{ left: checked ? '18px' : '2px' }}
      />
    </button>
  )
}
