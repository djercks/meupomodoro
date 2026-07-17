export default function Footer() {
  return (
    <footer className="flex items-center justify-between flex-wrap gap-3 pt-4">
      <button className="glass rounded-full pl-1.5 pr-4 py-1.5 flex items-center gap-2 text-xs hover:bg-white/10 transition">
        <span className="w-7 h-7 rounded-full bg-[#5865F2] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M20.3 4.4A19.7 19.7 0 0 0 15.6 3l-.3.5a14 14 0 0 1 4 1.6 15.9 15.9 0 0 0-13.6 0A14 14 0 0 1 9.7 3.5L9.4 3a19.6 19.6 0 0 0-4.7 1.4C1.6 8.9 1 13.2 1.3 17.4a19.8 19.8 0 0 0 6 3l.9-1.3a12.7 12.7 0 0 1-2-1c.2-.1.3-.2.5-.3a14.1 14.1 0 0 0 12 0l.5.3c-.6.4-1.3.7-2 1l.9 1.3a19.7 19.7 0 0 0 6-3c.4-4.9-.6-9.1-3.1-13zM8.5 14.9c-1 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.8.9 1.7 1.9c0 1-.8 1.9-1.7 1.9zm7 0c-1 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9c0 1-.7 1.9-1.7 1.9z" />
          </svg>
        </span>
        <span className="text-left leading-tight">
          <span className="block font-semibold">Junte-se à comunidade</span>
          <span className="block text-white/50 text-[10px] uppercase tracking-wide">Diga olá</span>
        </span>
      </button>
      <div className="flex items-center gap-5 text-[11px] uppercase tracking-widest text-white/50">
        <button className="hover:text-white transition">Sobre</button>
        <button className="hover:text-white transition">Desafio de hoje</button>
      </div>
    </footer>
  )
}
