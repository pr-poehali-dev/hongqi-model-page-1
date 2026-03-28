import { useEffect, useRef, useState, useCallback } from 'react';

type Part = {
  id: string;
  label: string;
  sublabel?: string;
  // позиция в сцене (px, сцена 700×380)
  x: number; y: number; w: number; h: number;
  rx?: string;
  // куда летит при разборке
  ex: number; ey: number;
  erx?: number; ery?: number;
  bg: string;
  stroke: string;
  z: number;
  ms: number; // transition-delay
  side?: 'l' | 'r' | 't' | 'b';
};

const PARTS: Part[] = [
  // ── Кузов (основа)
  { id:'body',    label:'Несущий кузов',      sublabel:'Высокопрочная сталь + алюминий',
    x:60,  y:155, w:580, h:130, rx:'10px 28px 8px 8px',
    ex:0,  ey:55,
    bg:'linear-gradient(180deg,#1c1c1c,#0e0e0e)',  stroke:'#2a2a2a', z:2, ms:260, side:'b' },
  // ── Пол / платформа
  { id:'floor',   label:'Платформа PHEV',     sublabel:'Батарея 25 кВт·ч',
    x:80,  y:280, w:540, h:26,  rx:'4px',
    ex:0,  ey:110, erx:10,
    bg:'linear-gradient(180deg,#111,#090909)',       stroke:'#c49a22', z:1, ms:300, side:'b' },
  // ── Крыша
  { id:'roof',    label:'Панорамная крыша',   sublabel:'1.4 м²  ·  UV‑защита',
    x:130, y:60,  w:380, h:100, rx:'20px 20px 4px 4px',
    ex:0,  ey:-200, erx:-22,
    bg:'linear-gradient(180deg,#1a1a1a,#111)',       stroke:'#333',    z:8, ms:0,   side:'t' },
  // ── Капот
  { id:'hood',    label:'Алюминиевый капот',  sublabel:'Снижение массы −18 кг',
    x:460, y:100, w:178, h:68,  rx:'4px 32px 4px 4px',
    ex:180, ey:-140, ery:12, erx:-18,
    bg:'linear-gradient(135deg,#1e1e1e,#141414)',    stroke:'#383838', z:7, ms:80,  side:'r' },
  // ── Крышка багажника
  { id:'trunk',   label:'Крышка багажника',   sublabel:'Электропривод · бесключевой доступ',
    x:62,  y:100, w:160, h:68,  rx:'32px 4px 4px 4px',
    ex:-180, ey:-130, ery:-12, erx:-18,
    bg:'linear-gradient(135deg,#1e1e1e,#141414)',    stroke:'#383838', z:7, ms:80,  side:'l' },
  // ── Лобовое стекло
  { id:'wf',      label:'Лобовое стекло',     sublabel:'HUD-проекция · обогрев',
    x:395, y:68,  w:120, h:112, rx:'2px 18px 2px 2px',
    ex:120, ey:-160, ery:18, erx:-30,
    bg:'linear-gradient(135deg,rgba(140,210,255,.07),rgba(140,210,255,.13))', stroke:'rgba(120,200,255,.35)', z:9, ms:40, side:'r' },
  // ── Заднее стекло
  { id:'wr',      label:'Заднее стекло',      sublabel:'Электроподогрев',
    x:185, y:68,  w:96,  h:100, rx:'18px 2px 2px 2px',
    ex:-110, ey:-140, ery:-16, erx:-28,
    bg:'linear-gradient(135deg,rgba(140,210,255,.07),rgba(140,210,255,.13))', stroke:'rgba(120,200,255,.35)', z:9, ms:40, side:'l' },
  // ── Передняя левая дверь
  { id:'dfl',     label:'Передняя дверь',     sublabel:'Мягкое закрытие · без ключа',
    x:380, y:155, w:145, h:125, rx:'2px 10px 10px 2px',
    ex:170, ey:0,  ery:38,
    bg:'linear-gradient(180deg,#1b1b1b,#111)',       stroke:'#c0251a', z:6, ms:120, side:'r' },
  // ── Задняя левая дверь
  { id:'drl',     label:'Задняя дверь',       sublabel:'Без рамки',
    x:240, y:155, w:135, h:125, rx:'2px 2px 2px 2px',
    ex:140, ey:10, ery:28,
    bg:'linear-gradient(180deg,#1b1b1b,#111)',       stroke:'#c49a22', z:5, ms:160, side:'r' },
  // ── Передняя правая дверь
  { id:'dfr',     label:'',
    x:175, y:155, w:145, h:125, rx:'10px 2px 2px 10px',
    ex:-170, ey:0, ery:-38,
    bg:'linear-gradient(180deg,#1b1b1b,#111)',       stroke:'#c0251a', z:6, ms:120, side:'l' },
  // ── Задняя правая дверь
  { id:'drr',     label:'',
    x:85,  y:155, w:135, h:125, rx:'2px',
    ex:-140, ey:10, ery:-28,
    bg:'linear-gradient(180deg,#1b1b1b,#111)',       stroke:'#c49a22', z:5, ms:160, side:'l' },
  // ── Передний бампер
  { id:'bf',      label:'Передний бампер',    sublabel:'Активный воздухозаборник',
    x:588, y:175, w:70,  h:90,  rx:'2px 18px 18px 2px',
    ex:200, ey:20, ery:20,
    bg:'linear-gradient(135deg,#1a1a1a,#0d0d0d)',   stroke:'#363636', z:4, ms:200, side:'r' },
  // ── Задний диффузор
  { id:'br',      label:'Задний диффузор',    sublabel:'Карбоновый элемент',
    x:42,  y:175, w:70,  h:90,  rx:'18px 2px 2px 18px',
    ex:-200, ey:20, ery:-20,
    bg:'linear-gradient(135deg,#1a1a1a,#0d0d0d)',   stroke:'#363636', z:4, ms:200, side:'l' },
  // ── Колесо ПЛ
  { id:'wfl',     label:'21″ кованые диски',  sublabel:'275/40 R21',
    x:488, y:268, w:90,  h:90,  rx:'50%',
    ex:110, ey:70, ery:15,
    bg:'radial-gradient(circle at 38% 38%,#252525,#0d0d0d)', stroke:'#444', z:3, ms:320, side:'r' },
  // ── Колесо ЗЛ
  { id:'wrl',     label:'',
    x:488, y:138, w:90,  h:90,  rx:'50%',
    ex:110, ey:-70, ery:15,
    bg:'radial-gradient(circle at 38% 38%,#252525,#0d0d0d)', stroke:'#444', z:3, ms:340, side:'r' },
  // ── Колесо ПП
  { id:'wfr',     label:'',
    x:122, y:268, w:90,  h:90,  rx:'50%',
    ex:-110, ey:70, ery:-15,
    bg:'radial-gradient(circle at 62% 38%,#252525,#0d0d0d)', stroke:'#444', z:3, ms:320, side:'l' },
  // ── Колесо ЗП
  { id:'wrr',     label:'',
    x:122, y:138, w:90,  h:90,  rx:'50%',
    ex:-110, ey:-70, ery:-15,
    bg:'radial-gradient(circle at 62% 38%,#252525,#0d0d0d)', stroke:'#444', z:3, ms:340, side:'l' },
];

const LABELED = PARTS.filter(p => p.label);

const SCENE_W = 700;
const SCENE_H = 380;

export default function CarExplodeSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const [exploded,  setExploded]  = useState(false);
  const [hov,       setHov]       = useState<string|null>(null);
  const [visible,   setVisible]   = useState(false);
  const [autoFired, setAutoFired] = useState(false);
  const [scale,     setScale]     = useState(1);

  // Адаптивный масштаб сцены
  const updateScale = useCallback(() => {
    if (!wrapperRef.current) return;
    const available = wrapperRef.current.clientWidth;
    setScale(Math.min(1, available / SCENE_W));
  }, []);

  useEffect(() => {
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [updateScale]);

  // reveal + auto-demo on first enter
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        if (!autoFired) {
          setAutoFired(true);
          setTimeout(() => setExploded(true),  600);
          setTimeout(() => setExploded(false), 3200);
        }
      }
    }, { threshold: 0.25 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [autoFired]);

  const hovPart = PARTS.find(p => p.id === hov);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#050505] py-20 lg:py-28 overflow-hidden"
    >
      {/* glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: exploded
            ? 'radial-gradient(ellipse 80% 60% at 50% 55%, rgba(192,37,26,.10) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 50% 40% at 50% 55%, rgba(192,37,26,.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1920px] mx-auto px-6 lg:px-24">
        {/* header */}
        <div
          className="mb-10"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'all .8s ease' }}
        >
          <div className="flex items-center gap-4 mb-3">
            <span className="w-8 h-px bg-hq-red" />
            <span className="text-[10px] tracking-[.4em] text-hq-gold uppercase font-body">Конструкция</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2 className="font-display text-3xl sm:text-5xl lg:text-7xl font-light text-white leading-none">
              Взрыв-схема<br/><span className="text-hq-red">кузова</span>
            </h2>
            {/* toggle button */}
            <button
              onClick={() => setExploded(v => !v)}
              className="flex items-center gap-3 border text-[10px] sm:text-[11px] tracking-[.2em] uppercase font-body px-5 sm:px-7 py-2.5 sm:py-3 transition-all duration-400 self-start lg:self-auto"
              style={{
                borderColor:  exploded ? '#c49a22' : '#c0251a',
                color:        '#fff',
                background:   exploded ? 'rgba(196,154,34,.08)' : 'rgba(192,37,26,.12)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full transition-colors duration-300"
                style={{ background: exploded ? '#c49a22' : '#c0251a' }}
              />
              {exploded ? 'Собрать кузов' : 'Разобрать кузов'}
            </button>
          </div>
        </div>

        {/* ── 3-D сцена ──────────────────────────────────────────────── */}
        <div
          ref={wrapperRef}
          style={{ opacity: visible ? 1 : 0, transition: 'opacity .6s ease .2s', width: '100%' }}
        >
          {/* outer perspective wrapper — масштабируется под ширину экрана */}
          <div
            style={{
              width:  '100%',
              height: `${SCENE_H * scale + (exploded ? 120 * scale : 0)}px`,
              position: 'relative',
              perspective: `${1100 * scale}px`,
              perspectiveOrigin: '50% 42%',
              transition: 'height .65s ease',
              overflow: 'visible',
            }}
          >
            {/* сцена фиксированного размера, масштабируется через scale */}
            <div
              style={{
                position:   'absolute',
                left:       '50%',
                top:        0,
                width:      `${SCENE_W}px`,
                height:     `${SCENE_H}px`,
                transformOrigin: 'top center',
                transform:  `translateX(-50%) scale(${scale}) rotateX(${exploded ? 8 : 18}deg) rotateY(${exploded ? 12 : 0}deg)`,
                transformStyle: 'preserve-3d',
                transition: 'transform .9s cubic-bezier(.4,0,.2,1)',
              }}
            >
              {PARTS.map(part => {
                const isHov = hov === part.id;
                const eased = exploded ? 1 : 0;   // instant — CSS handles timing via delay+duration

                return (
                  <div
                    key={part.id}
                    onMouseEnter={() => part.label ? setHov(part.id) : undefined}
                    onMouseLeave={() => setHov(null)}
                    style={{
                      position:   'absolute',
                      left:       part.x,
                      top:        part.y,
                      width:      part.w,
                      height:     part.h,
                      borderRadius: part.rx ?? '2px',
                      background: part.bg,
                      border:     `1px solid ${isHov ? part.stroke : part.stroke+'88'}`,
                      boxShadow:  isHov
                        ? `0 0 22px ${part.stroke}55, inset 0 1px 0 rgba(255,255,255,.06)`
                        : exploded
                          ? `0 16px 48px rgba(0,0,0,.7)`
                          : `0 2px 8px rgba(0,0,0,.5)`,
                      transform:  exploded
                        ? `translate3d(${part.ex}px,${part.ey}px,0px) rotateY(${part.ery ?? 0}deg) rotateX(${part.erx ?? 0}deg) scale(${isHov ? 1.03 : 1})`
                        : `translate3d(0,0,0) rotateY(0deg) rotateX(0deg) scale(${isHov ? 1.02 : 1})`,
                      transition: `transform .65s cubic-bezier(.34,1.1,.64,1) ${part.ms}ms, box-shadow .3s ease, border-color .25s ease`,
                      zIndex:     part.z + (isHov ? 30 : 0),
                      cursor:     part.label ? 'pointer' : 'default',
                      willChange: 'transform',
                    }}
                  >
                    {/* inner grid lines for body/floor */}
                    {(part.id === 'body' || part.id === 'floor') && (
                      <div style={{
                        position:'absolute', inset:0, borderRadius:'inherit', pointerEvents:'none',
                        backgroundImage: 'repeating-linear-gradient(90deg,transparent,transparent 19.9%,rgba(255,255,255,.025) 20%)',
                      }}/>
                    )}
                    {/* glass shimmer */}
                    {(part.id === 'wf' || part.id === 'wr' || part.id === 'roof') && (
                      <div style={{
                        position:'absolute', inset:0, borderRadius:'inherit', pointerEvents:'none',
                        background:'linear-gradient(135deg,rgba(255,255,255,.05) 0%,transparent 60%)',
                      }}/>
                    )}
                    {/* wheel spokes */}
                    {part.id.startsWith('w') && ['wfl','wrl','wfr','wrr'].includes(part.id) && (
                      <>
                        {[0,45,90,135].map(d => (
                          <div key={d} style={{
                            position:'absolute', left:'50%', top:'50%', width:'44%', height:'1px',
                            background:'rgba(255,255,255,.13)', transformOrigin:'0 50%',
                            transform:`rotate(${d + (exploded ? 90 : 0)}deg)`,
                            transition:'transform .8s ease',
                          }}/>
                        ))}
                        <div style={{
                          position:'absolute', left:'25%', top:'25%', width:'50%', height:'50%',
                          borderRadius:'50%', background:'radial-gradient(#1a1a1a,#080808)',
                          border:'1px solid rgba(255,255,255,.08)',
                        }}/>
                      </>
                    )}

                    {/* label badge — visible when exploded */}
                    {part.label && exploded && (
                      <div
                        style={{
                          position: 'absolute',
                          ...(part.side==='r' ? {left:'calc(100% + 6px)', top:'50%', transform:'translateY(-50%)'} : {}),
                          ...(part.side==='l' ? {right:'calc(100% + 6px)', top:'50%', transform:'translateY(-50%)'} : {}),
                          ...(part.side==='t' ? {bottom:'calc(100% + 6px)', left:'50%', transform:'translateX(-50%)'} : {}),
                          ...(part.side==='b' ? {top:'calc(100% + 6px)', left:'50%', transform:'translateX(-50%)'} : {}),
                          whiteSpace: 'nowrap',
                          pointerEvents: 'none',
                          animation: 'labelFadeIn .4s ease forwards',
                          zIndex: 99,
                        }}
                      >
                        <div style={{
                          background:'rgba(6,6,6,.95)',
                          border:`1px solid ${part.stroke}55`,
                          padding:'4px 8px',
                        }}>
                          <div style={{ color: part.stroke, fontSize:'9px', letterSpacing:'.25em', fontFamily:'Golos Text,sans-serif', textTransform:'uppercase' }}>
                            {part.label}
                          </div>
                          {part.sublabel && (
                            <div style={{ color:'rgba(255,255,255,.35)', fontSize:'8px', marginTop:'2px', fontFamily:'Golos Text,sans-serif' }}>
                              {part.sublabel}
                            </div>
                          )}
                        </div>
                        {/* connector dot */}
                        <div style={{
                          position:'absolute', borderRadius:'50%', width:'4px', height:'4px',
                          background: part.stroke,
                          ...(part.side==='r' ? {left:'-7px', top:'50%', transform:'translateY(-50%)'} : {}),
                          ...(part.side==='l' ? {right:'-7px', top:'50%', transform:'translateY(-50%)'} : {}),
                          ...(part.side==='t' ? {bottom:'-7px', left:'50%', transform:'translateX(-50%)'} : {}),
                          ...(part.side==='b' ? {top:'-7px', left:'50%', transform:'translateX(-50%)'} : {}),
                        }}/>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* ground shadow */}
              <div style={{
                position:'absolute', left:'8%', top:'88%', width:'84%', height:'6%',
                background:'radial-gradient(ellipse,rgba(0,0,0,.55) 0%,transparent 70%)',
                transition:'opacity .6s ease, transform .6s ease',
                opacity: exploded ? .2 : .7,
                transform: exploded ? 'scaleY(.4)' : 'scaleY(1)',
                pointerEvents:'none',
              }}/>
            </div>
          </div>

          {/* legend row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-white/5 mt-8">
            {LABELED.slice(0,6).map(part => (
              <div
                key={part.id}
                className="bg-[#060606] hover:bg-[#0f0f0f] px-4 py-3.5 flex items-center gap-2.5 cursor-pointer transition-colors group"
                onMouseEnter={() => setHov(part.id)}
                onMouseLeave={() => setHov(null)}
              >
                <span className="w-2 h-2 flex-shrink-0 rounded-sm" style={{ background: part.stroke }}/>
                <span className="text-[10px] font-body tracking-wider text-white/50 group-hover:text-white transition-colors leading-snug">
                  {part.label}
                </span>
              </div>
            ))}
          </div>

          {/* parts counter */}
          <div
            className="flex items-center justify-end gap-4 mt-5"
            style={{ opacity: exploded ? 1 : 0, transition: 'opacity .5s ease .4s' }}
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
            <span className="font-display text-2xl text-hq-gold font-light">{PARTS.length}</span>
            <span className="text-[10px] tracking-[.3em] text-white/30 uppercase font-body">элементов кузова</span>
          </div>
        </div>
      </div>

      {/* keyframe for label fade-in */}
      <style>{`
        @keyframes labelFadeIn {
          from { opacity:0; transform: translateY(-50%) scale(.92); }
          to   { opacity:1; transform: translateY(-50%) scale(1); }
        }
      `}</style>
    </section>
  );
}