import { useEffect, useRef, useState, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────────────────
   Каждая «деталь» кузова — прямоугольник с:
   - assembled: финальная позиция в 3D-сцене (left, top, width, height, rotateX, rotateY, rotateZ, translateZ)
   - exploded: сдвиг от собранного положения (dx, dy, dz + доп. rotX/Y/Z)
   Управление: scroll внутри sticky-секции (0–1) → progress
───────────────────────────────────────────────────────────────────────── */

type BodyPart = {
  id: string;
  label: string;
  sublabel?: string;
  // Assembled CSS position (% внутри 800×450 сцены)
  left: number; top: number; width: number; height: number;
  borderRadius?: string;
  // Assembled 3D transform
  aRx?: number; aRy?: number; aRz?: number; aZ?: number;
  // Exploded delta
  eX: number; eY: number; eZ: number;
  eRx?: number; eRy?: number; eRz?: number;
  // Visual
  bg: string;
  border: string;
  zIndex: number;
  delay: number; // transition delay ms
  labelSide?: 'left' | 'right' | 'top' | 'bottom';
};

const PARTS: BodyPart[] = [
  /* ── Крыша ───────────────────────────────────────────────────── */
  {
    id: 'roof',
    label: 'Панорамная крыша',
    sublabel: '1.4 м²  ·  UV-защита',
    left: 22, top: 4, width: 56, height: 16,
    borderRadius: '18px 18px 4px 4px',
    aRx: -8, aRy: 0, aRz: 0, aZ: 80,
    eX: 0, eY: -220, eZ: 160, eRx: -30,
    bg: 'linear-gradient(180deg,#1a1a1a 0%,#111 100%)',
    border: '#2a2a2a', zIndex: 10, delay: 0,
    labelSide: 'top',
  },
  /* ── Капот ───────────────────────────────────────────────────── */
  {
    id: 'hood',
    label: 'Алюминиевый капот',
    sublabel: 'Снижение массы −18 кг',
    left: 55, top: 16, width: 34, height: 14,
    borderRadius: '4px 24px 4px 4px',
    aRx: -10, aRy: 4, aRz: 0, aZ: 40,
    eX: 140, eY: -160, eZ: 120, eRx: -25, eRy: 20,
    bg: 'linear-gradient(135deg,#1e1e1e 0%,#141414 100%)',
    border: '#333', zIndex: 9, delay: 80,
    labelSide: 'right',
  },
  /* ── Багажник ────────────────────────────────────────────────── */
  {
    id: 'trunk',
    label: 'Крышка багажника',
    sublabel: 'Электропривод',
    left: 11, top: 16, width: 28, height: 13,
    borderRadius: '24px 4px 4px 4px',
    aRx: -10, aRy: -4, aRz: 0, aZ: 40,
    eX: -140, eY: -160, eZ: 120, eRx: -25, eRy: -20,
    bg: 'linear-gradient(135deg,#1e1e1e 0%,#141414 100%)',
    border: '#333', zIndex: 9, delay: 80,
    labelSide: 'left',
  },
  /* ── Кузов (основной слой) ───────────────────────────────────── */
  {
    id: 'body',
    label: 'Несущий кузов',
    sublabel: 'Высокопрочная сталь + Al',
    left: 8, top: 22, width: 84, height: 38,
    borderRadius: '12px 28px 8px 8px',
    aRx: -6, aRy: 0, aRz: 0, aZ: 0,
    eX: 0, eY: 40, eZ: -60,
    bg: 'linear-gradient(180deg,#181818 0%,#0e0e0e 100%)',
    border: '#2a2a2a', zIndex: 5, delay: 200,
    labelSide: 'bottom',
  },
  /* ── Передние двери ──────────────────────────────────────────── */
  {
    id: 'door-fl',
    label: 'Передняя дверь',
    sublabel: 'Мягкое закрытие',
    left: 53, top: 22, width: 18, height: 32,
    borderRadius: '2px 10px 2px 2px',
    aRx: -6, aRy: 2, aRz: 0, aZ: 20,
    eX: 120, eY: 0, eZ: 140, eRy: 45,
    bg: 'linear-gradient(180deg,#1a1a1a 0%,#111 100%)',
    border: '#c0251a', zIndex: 8, delay: 120,
    labelSide: 'right',
  },
  {
    id: 'door-fr',
    label: '',
    left: 29, top: 22, width: 18, height: 32,
    borderRadius: '10px 2px 2px 2px',
    aRx: -6, aRy: -2, aRz: 0, aZ: 20,
    eX: -120, eY: 0, eZ: 140, eRy: -45,
    bg: 'linear-gradient(180deg,#1a1a1a 0%,#111 100%)',
    border: '#c0251a', zIndex: 8, delay: 120,
    labelSide: 'left',
  },
  /* ── Задние двери ────────────────────────────────────────────── */
  {
    id: 'door-rl',
    label: 'Задняя дверь',
    sublabel: 'Без рамки',
    left: 36, top: 22, width: 16, height: 32,
    borderRadius: '2px 2px 2px 2px',
    aRx: -6, aRy: 1, aRz: 0, aZ: 20,
    eX: 100, eY: 20, eZ: 100, eRy: 35,
    bg: 'linear-gradient(180deg,#1a1a1a 0%,#111 100%)',
    border: '#c49a22', zIndex: 7, delay: 160,
    labelSide: 'right',
  },
  {
    id: 'door-rr',
    label: '',
    left: 48, top: 22, width: 16, height: 32,
    borderRadius: '2px 2px 2px 2px',
    aRx: -6, aRy: -1, aRz: 0, aZ: 20,
    eX: -100, eY: 20, eZ: 100, eRy: -35,
    bg: 'linear-gradient(180deg,#1a1a1a 0%,#111 100%)',
    border: '#c49a22', zIndex: 7, delay: 160,
    labelSide: 'left',
  },
  /* ── Бамперы ─────────────────────────────────────────────────── */
  {
    id: 'bumper-f',
    label: 'Передний бампер',
    sublabel: 'Активный воздухозаборник',
    left: 73, top: 34, width: 18, height: 18,
    borderRadius: '2px 14px 14px 2px',
    aRx: -6, aRy: 8, aRz: 0, aZ: 10,
    eX: 200, eY: 20, eZ: 60, eRy: 30,
    bg: 'linear-gradient(135deg,#1a1a1a 0%,#0d0d0d 100%)',
    border: '#3a3a3a', zIndex: 6, delay: 240,
    labelSide: 'right',
  },
  {
    id: 'bumper-r',
    label: 'Задний диффузор',
    sublabel: 'Карбоновый элемент',
    left: 9, top: 34, width: 18, height: 18,
    borderRadius: '14px 2px 2px 14px',
    aRx: -6, aRy: -8, aRz: 0, aZ: 10,
    eX: -200, eY: 20, eZ: 60, eRy: -30,
    bg: 'linear-gradient(135deg,#1a1a1a 0%,#0d0d0d 100%)',
    border: '#3a3a3a', zIndex: 6, delay: 240,
    labelSide: 'left',
  },
  /* ── Пол / платформа ─────────────────────────────────────────── */
  {
    id: 'floor',
    label: 'Платформа PHEV',
    sublabel: 'Батарея 25 кВт·ч · 500 кг·м²',
    left: 10, top: 56, width: 80, height: 10,
    borderRadius: '4px',
    aRx: -4, aRy: 0, aRz: 0, aZ: -40,
    eX: 0, eY: 100, eZ: -200, eRx: 20,
    bg: 'linear-gradient(180deg,#111 0%,#0a0a0a 100%)',
    border: '#c49a22', zIndex: 3, delay: 280,
    labelSide: 'bottom',
  },
  /* ── Передние колёса ─────────────────────────────────────────── */
  {
    id: 'wheel-fl',
    label: '21" кованые диски',
    sublabel: '275/40 R21',
    left: 62, top: 54, width: 14, height: 22,
    borderRadius: '50%',
    aRx: 0, aRy: 8, aRz: 0, aZ: -20,
    eX: 140, eY: 60, eZ: -120, eRy: 40,
    bg: 'radial-gradient(circle at 40% 40%,#2a2a2a 0%,#111 60%,#0a0a0a 100%)',
    border: '#444', zIndex: 4, delay: 320,
    labelSide: 'right',
  },
  {
    id: 'wheel-rl',
    label: '',
    left: 62, top: 28, width: 14, height: 22,
    borderRadius: '50%',
    aRx: 0, aRy: 8, aRz: 0, aZ: -20,
    eX: 140, eY: -60, eZ: -100, eRy: 40,
    bg: 'radial-gradient(circle at 40% 40%,#2a2a2a 0%,#111 60%,#0a0a0a 100%)',
    border: '#444', zIndex: 4, delay: 340,
    labelSide: 'right',
  },
  /* ── Задние колёса ───────────────────────────────────────────── */
  {
    id: 'wheel-fr',
    label: '',
    left: 24, top: 54, width: 14, height: 22,
    borderRadius: '50%',
    aRx: 0, aRy: -8, aRz: 0, aZ: -20,
    eX: -140, eY: 60, eZ: -120, eRy: -40,
    bg: 'radial-gradient(circle at 60% 40%,#2a2a2a 0%,#111 60%,#0a0a0a 100%)',
    border: '#444', zIndex: 4, delay: 320,
    labelSide: 'left',
  },
  {
    id: 'wheel-rr',
    label: '',
    left: 24, top: 28, width: 14, height: 22,
    borderRadius: '50%',
    aRx: 0, aRy: -8, aRz: 0, aZ: -20,
    eX: -140, eY: -60, eZ: -100, eRy: -40,
    bg: 'radial-gradient(circle at 60% 40%,#2a2a2a 0%,#111 60%,#0a0a0a 100%)',
    border: '#444', zIndex: 4, delay: 340,
    labelSide: 'left',
  },
  /* ── Лобовое стекло ──────────────────────────────────────────── */
  {
    id: 'windshield',
    label: 'Лобовое стекло',
    sublabel: 'HUD-проекция',
    left: 45, top: 8, width: 20, height: 18,
    borderRadius: '2px 12px 2px 2px',
    aRx: -16, aRy: 4, aRz: -4, aZ: 60,
    eX: 80, eY: -180, eZ: 200, eRx: -40, eRy: 20,
    bg: 'linear-gradient(135deg,rgba(100,180,255,0.06) 0%,rgba(100,200,255,0.12) 100%)',
    border: 'rgba(100,200,255,0.25)', zIndex: 11, delay: 40,
    labelSide: 'right',
  },
  /* ── Заднее стекло ───────────────────────────────────────────── */
  {
    id: 'rear-glass',
    label: 'Заднее стекло',
    sublabel: 'Электроподогрев',
    left: 35, top: 8, width: 16, height: 16,
    borderRadius: '12px 2px 2px 2px',
    aRx: -14, aRy: -4, aRz: 4, aZ: 60,
    eX: -80, eY: -160, eZ: 180, eRx: -35, eRy: -20,
    bg: 'linear-gradient(135deg,rgba(100,180,255,0.06) 0%,rgba(100,200,255,0.12) 100%)',
    border: 'rgba(100,200,255,0.25)', zIndex: 11, delay: 40,
    labelSide: 'left',
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function CarExplodeSection() {
  const stickyRef   = useRef<HTMLDivElement>(null);
  const containerRef= useRef<HTMLDivElement>(null);
  const [progress, setProgress]   = useState(0);   // 0 = assembled, 1 = exploded
  const [inView,   setInView]     = useState(false);
  const [hovered,  setHovered]    = useState<string | null>(null);
  const [manualMode, setManual]   = useState(false);

  /* ── Scroll-driven progress ─────────────────────────────────── */
  const onScroll = useCallback(() => {
    if (!containerRef.current || manualMode) return;
    const rect   = containerRef.current.getBoundingClientRect();
    const total  = containerRef.current.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const raw    = Math.max(0, Math.min(1, scrolled / total));
    setProgress(raw);
  }, [manualMode]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  /* ── InView detect ──────────────────────────────────────────── */
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.1 });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Hover label ────────────────────────────────────────────── */
  const hovPart = PARTS.find(p => p.id === hovered && p.label);

  /* ── Manual toggle for mobile ───────────────────────────────── */
  const toggleManual = () => {
    setManual(true);
    setProgress(p => p > 0.5 ? 0 : 1);
  };

  const p = easeInOut(Math.min(1, progress * 1.8)); // speed up early
  const pSlow = easeInOut(progress);

  /* ── Rotation of whole scene (slow spin) ────────────────────── */
  const sceneRotY = lerp(0, 18, pSlow);

  return (
    /* Tall container — scroll space */
    <div
      ref={containerRef}
      className="relative"
      style={{ height: '340vh' }}
    >
      {/* Sticky viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-[#050505]"
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700"
            style={{
              width:  `${lerp(300, 800, p)}px`,
              height: `${lerp(200, 500, p)}px`,
              background: `radial-gradient(ellipse, rgba(192,37,26,${lerp(0.04, 0.12, p)}) 0%, transparent 70%)`,
            }}
          />
          {/* Gold glow appears on explode */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700"
            style={{
              width:  `${lerp(0, 600, p)}px`,
              height: `${lerp(0, 600, p)}px`,
              opacity: p,
              background: 'radial-gradient(ellipse, rgba(196,154,34,0.06) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Header — fades in */}
        <div
          className="absolute top-20 left-6 lg:left-24 z-20"
          style={{ opacity: inView ? 1 : 0, transform: `translateY(${inView ? 0 : 20}px)`, transition: 'all 0.8s ease' }}
        >
          <div className="flex items-center gap-4 mb-3">
            <span className="w-8 h-px bg-hq-red" />
            <span className="text-[10px] tracking-[0.4em] text-hq-gold uppercase font-body">Конструкция</span>
          </div>
          <h2 className="font-display text-4xl lg:text-6xl font-light text-white leading-none">
            Взрыв-схема<br />
            <span className="text-hq-red">кузова</span>
          </h2>
        </div>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5 z-20">
          <div
            className="h-full bg-gradient-to-r from-hq-red to-hq-gold transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Status label */}
        <div className="absolute top-6 right-6 lg:right-24 z-20 flex flex-col items-end gap-1">
          <span className="text-[9px] tracking-[0.35em] text-white/30 uppercase font-body">
            {p < 0.1 ? 'Собран' : p > 0.85 ? 'Разобран' : 'Разборка...'}
          </span>
          <div className="flex items-center gap-2">
            {PARTS.filter(pt => pt.label).slice(0, 6).map((pt, i) => (
              <div
                key={pt.id}
                className="w-1 rounded-full transition-all duration-500"
                style={{
                  height: `${lerp(4, 12, Math.max(0, p * 3 - i * 0.4))}px`,
                  backgroundColor: pt.border,
                  opacity: Math.min(1, p * 3 - i * 0.3),
                }}
              />
            ))}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={toggleManual}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 lg:hidden flex items-center gap-2 border border-hq-red text-white text-[10px] tracking-[0.2em] uppercase font-body px-5 py-2.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-hq-red" />
          {progress > 0.5 ? 'Собрать' : 'Разобрать'}
        </button>

        {/* Scroll hint — fades out */}
        <div
          className="hidden lg:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2 transition-all duration-500"
          style={{ opacity: progress < 0.1 ? 1 : 0 }}
        >
          <span className="text-[9px] tracking-[0.35em] text-white/30 uppercase font-body">Прокручивайте</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent animate-bounce" />
        </div>

        {/* ── 3D Scene ─────────────────────────────────────────── */}
        <div
          className="relative mx-auto"
          style={{
            width: '100%',
            maxWidth: '860px',
            height: '480px',
            perspective: '1200px',
            perspectiveOrigin: '50% 46%',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${lerp(14, 6, p)}deg) rotateY(${sceneRotY}deg)`,
              transition: 'transform 0.08s linear',
              position: 'relative',
            }}
          >
            {PARTS.map((part) => {
              const isHov = hovered === part.id;
              const ep = easeInOut(Math.max(0, Math.min(1, p)));

              const tx = lerp(0, part.eX, ep);
              const ty = lerp(0, part.eY, ep);
              const tz = lerp(part.aZ ?? 0, (part.aZ ?? 0) + part.eZ, ep);
              const rx = lerp(part.aRx ?? 0, (part.aRx ?? 0) + (part.eRx ?? 0), ep);
              const ry = lerp(part.aRy ?? 0, (part.aRy ?? 0) + (part.eRy ?? 0), ep);
              const rz = lerp(part.aRz ?? 0, (part.aRz ?? 0) + (part.eRz ?? 0), ep);

              const glowScale = isHov ? 1.03 : 1;

              return (
                <div
                  key={part.id}
                  onMouseEnter={() => part.label && setHovered(part.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    position: 'absolute',
                    left:   `${part.left}%`,
                    top:    `${part.top}%`,
                    width:  `${part.width}%`,
                    height: `${part.height}%`,
                    borderRadius: part.borderRadius ?? '2px',
                    background:   part.bg,
                    border:       `1px solid ${isHov ? part.border : part.border + '77'}`,
                    boxShadow:    isHov
                      ? `0 0 24px ${part.border}55, 0 0 2px ${part.border}99`
                      : ep > 0.3
                        ? `0 ${lerp(0, 20, ep)}px ${lerp(0, 60, ep)}px rgba(0,0,0,0.6)`
                        : 'none',
                    transform: `translate3d(${tx}px,${ty}px,${tz}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${glowScale})`,
                    transformStyle: 'preserve-3d',
                    transition: `transform ${isHov ? 0.15 : 0.06}s ${isHov ? 'ease' : 'linear'}, box-shadow 0.2s ease, border-color 0.2s ease`,
                    zIndex: part.zIndex + (isHov ? 50 : 0),
                    cursor: part.label ? 'pointer' : 'default',
                    backfaceVisibility: 'hidden',
                    willChange: 'transform',
                  }}
                >
                  {/* Inner detail lines */}
                  {(part.id === 'body' || part.id === 'floor') && (
                    <div style={{
                      position: 'absolute', inset: 0, borderRadius: 'inherit',
                      background: 'repeating-linear-gradient(90deg, transparent, transparent 19.9%, rgba(255,255,255,0.02) 20%)',
                    }}/>
                  )}
                  {/* Glass reflection */}
                  {(part.id === 'windshield' || part.id === 'rear-glass' || part.id === 'roof') && (
                    <div style={{
                      position: 'absolute', inset: 0, borderRadius: 'inherit',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 50%, transparent 100%)',
                    }}/>
                  )}
                  {/* Wheel spokes */}
                  {part.id.startsWith('wheel') && (
                    <>
                      {[0,60,120,180,240,300].map(deg => (
                        <div key={deg} style={{
                          position: 'absolute',
                          left: '50%', top: '50%',
                          width: '48%', height: '1px',
                          background: 'rgba(255,255,255,0.12)',
                          transformOrigin: '0 50%',
                          transform: `rotate(${deg + lerp(0, 180, p)}deg)`,
                          transition: 'transform 0.1s linear',
                        }}/>
                      ))}
                      <div style={{
                        position: 'absolute', left: '30%', top: '30%', width: '40%', height: '40%',
                        borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)',
                        background: 'radial-gradient(circle, #1a1a1a, #0a0a0a)',
                      }}/>
                    </>
                  )}

                  {/* Label badge — visible when exploded */}
                  {part.label && ep > 0.4 && (
                    <div style={{
                      position: 'absolute',
                      ...(part.labelSide === 'right' ? { right: '-2px', top: '50%', transform: 'translate(100%,-50%)' } : {}),
                      ...(part.labelSide === 'left'  ? { left:  '-2px', top: '50%', transform: 'translate(-100%,-50%)' } : {}),
                      ...(part.labelSide === 'top'   ? { top: '-2px', left: '50%', transform: 'translate(-50%,-100%)' } : {}),
                      ...(part.labelSide === 'bottom'? { bottom: '-2px', left: '50%', transform: 'translate(-50%,100%)' } : {}),
                      pointerEvents: 'none',
                      opacity: Math.min(1, (ep - 0.4) * 5),
                      transition: 'opacity 0.3s',
                      zIndex: 100,
                    }}>
                      <div style={{
                        background: 'rgba(8,8,8,0.92)',
                        border: `1px solid ${part.border}55`,
                        padding: '4px 8px',
                        whiteSpace: 'nowrap',
                      }}>
                        <div style={{ color: part.border, fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'Golos Text, sans-serif', textTransform: 'uppercase' }}>
                          {part.label}
                        </div>
                        {part.sublabel && (
                          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px', marginTop: '1px', fontFamily: 'Golos Text, sans-serif' }}>
                            {part.sublabel}
                          </div>
                        )}
                      </div>
                      {/* Connector line */}
                      <div style={{
                        position: 'absolute',
                        ...(part.labelSide === 'right' ? { left: 0, top: '50%', width: '6px', height: '1px', transform: 'translateY(-50%)' } : {}),
                        ...(part.labelSide === 'left'  ? { right: 0, top: '50%', width: '6px', height: '1px', transform: 'translateY(-50%)' } : {}),
                        ...(part.labelSide === 'top'   ? { bottom: 0, left: '50%', width: '1px', height: '6px', transform: 'translateX(-50%)' } : {}),
                        ...(part.labelSide === 'bottom'? { top: 0, left: '50%', width: '1px', height: '6px', transform: 'translateX(-50%)' } : {}),
                        background: part.border + '88',
                      }}/>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Ground shadow */}
            <div
              style={{
                position: 'absolute',
                left: '10%', top: '75%',
                width: '80%', height: '8%',
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
                transform: `translate3d(0,0,-80px) scaleY(${lerp(1, 0.3, p)})`,
                opacity: lerp(0.7, 0.15, p),
                transition: 'transform 0.06s linear, opacity 0.06s linear',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* Parts counter */}
        <div
          className="absolute bottom-16 lg:bottom-10 right-6 lg:right-24 z-20 text-right"
          style={{ opacity: p > 0.15 ? 1 : 0, transition: 'opacity 0.5s' }}
        >
          <div className="font-display text-3xl text-hq-gold font-light">
            {Math.round(p * PARTS.length)}<span className="text-lg text-white/30">/{PARTS.length}</span>
          </div>
          <div className="text-[9px] tracking-[0.3em] text-white/30 uppercase font-body mt-0.5">элементов</div>
        </div>
      </div>
    </div>
  );
}
