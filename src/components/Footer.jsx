export default function Footer() {
  return (
    <footer className="flex items-center justify-between flex-wrap gap-3 pt-4">
      <a
        href="https://t.me/+DUPRhKR6905hM2Nh"
        target="_blank"
        rel="noopener noreferrer"
        className="glass rounded-full pl-1.5 pr-4 py-1.5 flex items-center gap-2 text-xs hover:bg-white/10 transition"
      >
        <span className="w-7 h-7 rounded-full bg-[#26A5E4] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M21.9 4.3 18.6 20c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9L18 7.5c.4-.4-.1-.6-.6-.2L8.1 13.4l-4.8-1.5c-1-.3-1-1 .2-1.5L20.6 3.5c.9-.3 1.6.2 1.3.8z" />
          </svg>
        </span>
        <span className="text-left leading-tight">
          <span className="block font-semibold">Junte-se à comunidade</span>
          <span className="block text-white/50 text-[10px] uppercase tracking-wide">Diga olá</span>
        </span>
      </a>
      <div className="flex items-center gap-5 text-[11px] uppercase tracking-widest text-white/50">
        <button className="hover:text-white transition">Sobre</button>
        <button className="hover:text-white transition">Desafio de hoje</button>
      </div>
    </footer>
  )
}
