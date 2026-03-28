import { useEffect, useRef, useState } from 'react';

/* ── Описание «деталей» двигателя ──────────────────────────────────────────
   Каждая деталь задаётся как SVG-path или простая фигура + transform для
   «разобранного» состояния (exploded) и «собранного» (assembled).
   Анимация управляется CSS transition через data-атрибут.
──────────────────────────────────────────────────────────────────────────── */

type Part = {
  id: string;
  label: string;
  // assembled position (SVG viewBox 0 0 600 400)
  ax: number; ay: number;
  // exploded offset
  ex: number; ey: number;
  w: number; h: number;
  rx?: number; // border-radius
  color: string;
  borderColor: string;
  delay: number; // ms
  labelX?: number; labelY?: number;
};

const PARTS: Part[] = [
  // ── Блок цилиндров (основание)
  { id: 'block',    label: 'Блок цилиндров',    ax: 170, ay: 160, ex: 0,    ey: 80,  w: 260, h: 90,  rx: 2, color: '#1a1a1a', borderColor: '#333', delay: 0 },
  // ── Поддон картера
  { id: 'sump',     label: 'Поддон картера',     ax: 200, ay: 248, ex: 0,    ey: 120, w: 200, h: 28,  rx: 1, color: '#111', borderColor: '#2a2a2a', delay: 60 },
  // ── Головка блока цилиндров
  { id: 'head',     label: 'ГБЦ',                ax: 175, ay: 110, ex: 0,    ey: -90, w: 250, h: 52,  rx: 2, color: '#1e1e1e', borderColor: '#3a3a3a', delay: 100 },
  // ── Клапанная крышка
  { id: 'cover',    label: 'Клапанная крышка',   ax: 185, ay: 78,  ex: 0,    ey: -160,w: 230, h: 34,  rx: 2, color: '#161616', borderColor: '#c0251a', delay: 160 },
  // ── Коленвал
  { id: 'crank',    label: 'Коленвал',           ax: 195, ay: 182, ex: -200, ey: 40,  w: 210, h: 14,  rx: 7, color: '#8b0000', borderColor: '#c0251a', delay: 200 },
  // ── Поршень 1
  { id: 'piston1',  label: 'Поршень',            ax: 215, ay: 165, ex: -180, ey: -80, w: 36, h: 22,   rx: 2, color: '#888', borderColor: '#aaa', delay: 240 },
  // ── Поршень 2
  { id: 'piston2',  label: '',                   ax: 265, ay: 165, ex: -80,  ey: -120,w: 36, h: 22,   rx: 2, color: '#888', borderColor: '#aaa', delay: 260 },
  // ── Поршень 3
  { id: 'piston3',  label: '',                   ax: 315, ay: 165, ex: 80,   ey: -120,w: 36, h: 22,   rx: 2, color: '#888', borderColor: '#aaa', delay: 280 },
  // ── Поршень 4 (V6: 4 видимых)
  { id: 'piston4',  label: '',                   ax: 365, ay: 165, ex: 180,  ey: -80, w: 36, h: 22,   rx: 2, color: '#888', borderColor: '#aaa', delay: 300 },
  // ── Турбина
  { id: 'turbo',    label: 'Турбонагнетатель',   ax: 430, ay: 148, ex: 220,  ey: -60, w: 68, h: 68,   rx: 34, color: '#1a1a1a', borderColor: '#c49a22', delay: 340 },
  // ── Турбина — крыльчатка (декор)
  { id: 'turbofan', label: '',                   ax: 451, ay: 169, ex: 230,  ey: -55, w: 26, h: 26,   rx: 13, color: '#c49a22', borderColor: '#f5c842', delay: 360 },
  // ── Выпускной коллектор
  { id: 'exhaust',  label: 'Выпускной коллектор',ax: 150, ay: 198, ex: -220, ey: 60,  w: 20, h: 54,   rx: 2, color: '#c0251a', borderColor: '#e03030', delay: 380 },
  // ── Впускной коллектор
  { id: 'intake',   label: 'Впускной коллектор', ax: 430, ay: 125, ex: 220,  ey: -100,w: 60, h: 16,   rx: 2, color: '#1e1e1e', borderColor: '#666', delay: 400 },
  // ── Масляный насос
  { id: 'oilpump',  label: 'Масляный насос',     ax: 200, ay: 242, ex: -160, ey: 100, w: 44, h: 20,   rx: 2, color: '#222', borderColor: '#c49a22', delay: 440 },
  // ── ТНВД
  { id: 'fuelpump', label: 'ТНВД',               ax: 350, ay: 112, ex: 160,  ey: -140,w: 44, h: 30,   rx: 2, color: '#1a1a1a', borderColor: '#666', delay: 460 },
  // ── Распредвал
  { id: 'camshaft', label: 'Распредвал',         ax: 185, ay: 126, ex: -200, ey: -110,w: 230, h: 10,  rx: 5, color: '#c49a22', borderColor: '#f5c842', delay: 480 },
  // ── Ремень ГРМ (цепь)
  { id: 'timing',   label: 'Цепь ГРМ',           ax: 430, ay: 162, ex: 240,  ey: 40,  w: 14, h: 80,   rx: 2, color: '#333', borderColor: '#555', delay: 500 },
];

const BOLT_POSITIONS = [
  [175,158],[220,158],[270,158],[320,158],[370,158],[415,158],
  [175,247],[220,247],[270,247],[320,247],[370,247],[415,247],
];

export default function EngineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef    = useRef<SVGSVGElement>(null);
  const [exploded, setExploded] = useState(false);
  const [inView,   setInView]   = useState(false);
  const [hoverId,  setHoverId]  = useState<string | null>(null);
  const [autoPlayed, setAutoPlayed] = useState(false);

  /* Intersection observer — запускает авто-анимацию при входе во viewport */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!autoPlayed) {
            setTimeout(() => {
              setExploded(true);
              setTimeout(() => { setExploded(false); setAutoPlayed(true); }, 2200);
            }, 600);
          }
        }
      },
      { threshold: 0.35 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [autoPlayed]);

  /* reveal при входе */
  useEffect(() => {
    if (!inView) return;
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }, [inView]);

  const hovered = PARTS.find((p) => p.id === hoverId);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#060606] py-20 lg:py-32 overflow-hidden"
    >
      {/* subtle red glow behind engine */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[600px] h-[300px] bg-hq-red/6 blur-[120px] pointer-events-none" />

      <div className="max-w-[1920px] mx-auto px-6 lg:px-24">
        {/* Header */}
        <div className="reveal flex items-center gap-4 mb-4">
          <span className="w-8 h-px bg-hq-red" />
          <span className="text-[10px] tracking-[0.4em] text-hq-gold uppercase font-body">Инженерия</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-4">
          <h2 className="reveal delay-100 font-display text-3xl sm:text-5xl lg:text-7xl font-light text-white leading-none">
            Сердце<br /><span className="text-hq-red">3.0 V6</span>
          </h2>
          <p className="reveal delay-200 font-body font-light text-white/40 text-sm max-w-xs">
            Турбированный V6 — 449 л.с., 830 Н·м крутящего момента. Разберите и соберите каждую деталь.
          </p>
        </div>

        {/* Engine SVG canvas */}
        <div className="reveal delay-300 relative flex flex-col items-center">
          {/* Control button */}
          <div className="flex gap-3 mb-6 self-end">
            <button
              onClick={() => setExploded((v) => !v)}
              className={`flex items-center gap-3 border text-[11px] tracking-[0.2em] uppercase font-body px-6 py-2.5 transition-all duration-300 ${
                exploded
                  ? 'border-hq-gold text-hq-gold hover:bg-hq-gold/10'
                  : 'border-hq-red text-white hover:bg-hq-red'
              }`}
            >
              <span className={`w-2 h-2 rounded-full transition-colors ${exploded ? 'bg-hq-gold' : 'bg-hq-red'}`} />
              {exploded ? 'Собрать двигатель' : 'Разобрать двигатель'}
            </button>
          </div>

          {/* Tooltip */}
          <div
            className={`absolute top-0 left-0 z-10 pointer-events-none transition-all duration-300 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {hovered?.label && (
              <div className="bg-[#0d0d0d]/95 border border-hq-gold/30 px-4 py-2 text-[11px] font-body text-hq-gold tracking-wider whitespace-nowrap">
                {hovered.label}
              </div>
            )}
          </div>

          {/* SVG Engine */}
          <div className="w-full max-w-[640px] mx-auto select-none">
            <svg
              ref={svgRef}
              viewBox="0 0 600 360"
              className="w-full h-auto"
              style={{ filter: 'drop-shadow(0 0 40px rgba(192,37,26,0.15))' }}
            >
              {/* Grid background */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
                </pattern>
                <radialGradient id="glow-red" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#c0251a" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#c0251a" stopOpacity="0"/>
                </radialGradient>
                <filter id="part-glow">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              <rect width="600" height="360" fill="url(#grid)"/>
              <ellipse cx="300" cy="200" rx="220" ry="100" fill="url(#glow-red)"/>

              {/* Render parts */}
              {PARTS.map((part) => {
                const isHov = hoverId === part.id;
                const tx = exploded ? part.ex : 0;
                const ty = exploded ? part.ey : 0;

                return (
                  <g
                    key={part.id}
                    style={{
                      transform: `translate(${tx}px, ${ty}px)`,
                      transition: `transform ${exploded ? 0.55 : 0.45}s cubic-bezier(0.34,1.2,0.64,1) ${part.delay}ms, opacity 0.4s ease ${part.delay}ms`,
                      opacity: inView ? 1 : 0,
                      cursor: part.label ? 'pointer' : 'default',
                    }}
                    onMouseEnter={() => part.label && setHoverId(part.id)}
                    onMouseLeave={() => setHoverId(null)}
                  >
                    <rect
                      x={part.ax}
                      y={part.ay}
                      width={part.w}
                      height={part.h}
                      rx={part.rx ?? 0}
                      fill={isHov ? part.borderColor + '33' : part.color}
                      stroke={isHov ? part.borderColor : part.borderColor + '88'}
                      strokeWidth={isHov ? 1.5 : 0.8}
                      style={{ filter: isHov ? 'drop-shadow(0 0 6px ' + part.borderColor + '66)' : 'none' }}
                    />
                    {/* Label inside big parts */}
                    {part.label && part.w > 80 && (
                      <text
                        x={part.ax + part.w / 2}
                        y={part.ay + part.h / 2 + 4}
                        textAnchor="middle"
                        fill={isHov ? '#fff' : 'rgba(255,255,255,0.3)'}
                        fontSize="7"
                        fontFamily="'Golos Text', sans-serif"
                        letterSpacing="1"
                        style={{ transition: 'fill 0.2s', pointerEvents: 'none', textTransform: 'uppercase' }}
                      >
                        {part.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Bolts */}
              {BOLT_POSITIONS.map(([bx, by], i) => (
                <g
                  key={`bolt-${i}`}
                  style={{
                    transform: exploded ? `translate(0px, ${i % 2 === 0 ? -10 : 10}px)` : 'translate(0,0)',
                    transition: `transform 0.4s ease ${i * 30}ms`,
                  }}
                >
                  <circle cx={bx} cy={by} r="3" fill="#111" stroke="#444" strokeWidth="0.7"/>
                  <line x1={bx - 1.5} y1={by} x2={bx + 1.5} y2={by} stroke="#555" strokeWidth="0.5"/>
                  <line x1={bx} y1={by - 1.5} x2={bx} y2={by + 1.5} stroke="#555" strokeWidth="0.5"/>
                </g>
              ))}

              {/* Connectors — видны только в разобранном состоянии */}
              {exploded && PARTS.filter(p => p.label).map((part) => (
                <line
                  key={`conn-${part.id}`}
                  x1={part.ax + part.w / 2}
                  y1={part.ay + part.h / 2}
                  x2={part.ax + part.w / 2 + part.ex * 0.4}
                  y2={part.ay + part.h / 2 + part.ey * 0.4}
                  stroke={part.borderColor}
                  strokeWidth="0.5"
                  strokeDasharray="3 4"
                  opacity="0.25"
                  style={{ transition: 'opacity 0.3s ease 0.5s' }}
                />
              ))}

              {/* Center label */}
              <text x="300" y="340" textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="8"
                fontFamily="'Golos Text', sans-serif" letterSpacing="3">
                HONGQI · 3.0L V6 TWIN-TURBO HYBRID · 449 HP
              </text>
            </svg>
          </div>

          {/* Parts legend — desktop */}
          <div className="hidden lg:grid grid-cols-4 gap-px bg-white/5 w-full mt-8">
            {PARTS.filter(p => p.label).slice(0, 8).map((part) => (
              <div
                key={part.id}
                className="bg-[#060606] hover:bg-[#0f0f0f] px-5 py-4 flex items-center gap-3 cursor-pointer transition-colors group"
                onMouseEnter={() => setHoverId(part.id)}
                onMouseLeave={() => setHoverId(null)}
              >
                <span
                  className="w-2 h-2 flex-shrink-0 rounded-sm"
                  style={{ backgroundColor: part.borderColor }}
                />
                <span className="text-[11px] font-body text-white/50 group-hover:text-white transition-colors tracking-wider">
                  {part.label}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile legend */}
          <div className="lg:hidden flex flex-wrap gap-3 mt-6 justify-center">
            {PARTS.filter(p => p.label).map((part) => (
              <span
                key={part.id}
                className="flex items-center gap-1.5 text-[10px] font-body text-white/40 tracking-wider"
              >
                <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: part.borderColor }} />
                {part.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}