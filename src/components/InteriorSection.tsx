import { useEffect, useRef } from 'react';

const interiorImage = 'https://cdn.poehali.dev/projects/d177c7f9-7e5b-4f92-96a2-0697c72723e4/files/c0618590-464c-48bb-bb3b-374c145a30fe.jpg';

const interiorPoints = [
  { x: '30%', y: '35%', title: 'Панель управления', desc: 'Три дисплея суммарно 42" с голосовым управлением' },
  { x: '55%', y: '55%', title: 'Кресла Nappa', desc: 'Кожа ручной отделки с 16-точечным массажем' },
  { x: '72%', y: '42%', title: 'Ambient Light', desc: '64-цветная подсветка с 8 сценариями' },
];

export default function InteriorSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
              el.classList.add('visible');
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#050505] py-20 lg:py-32 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Left: text */}
          <div className="lg:w-5/12">
            <div className="reveal flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-hq-red" />
              <span className="text-[10px] tracking-[0.4em] text-hq-gold uppercase font-body">Интерьер</span>
            </div>
            <h2 className="reveal delay-100 font-display text-5xl lg:text-7xl font-light text-white leading-none mb-8">
              Мир<br />внутри
            </h2>
            <p className="reveal delay-200 font-body font-light text-white/60 text-base leading-relaxed mb-10">
              Салон H9 — это sanctum. Пространство, где технология не мешает жизни, а обогащает её. Где каждая поверхность приятна на ощупь, каждый звук гармоничен.
            </p>

            {/* Feature list */}
            <div className="reveal delay-300 flex flex-col gap-4">
              {[
                'Панорамная крыша 1.4 м²',
                'Система вентиляции с ароматизацией',
                'Meridian Horizon Sound System',
                'Охлаждение и нагрев всех сидений',
                'Цифровой ассистент водителя',
              ].map((item) => (
                <div key={item} className="flex items-center gap-4 text-sm font-body font-light text-white/70">
                  <span className="w-4 h-px bg-hq-red flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right: image with hotspots */}
          <div className="reveal-right lg:w-7/12 relative">
            <div className="relative overflow-hidden">
              <img
                src={interiorImage}
                alt="Hongqi H9 интерьер"
                className="w-full h-auto object-cover"
              />
              {/* Hotspots (hidden on mobile) */}
              {interiorPoints.map((point, i) => (
                <div
                  key={i}
                  className="hidden lg:block absolute group cursor-pointer"
                  style={{ left: point.x, top: point.y }}
                >
                  <div className="relative">
                    <div className="w-3 h-3 border-2 border-hq-gold bg-hq-gold/30 rounded-full animate-pulse" />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#0d0d0d]/90 border border-hq-gold/30 p-3 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <p className="text-[11px] font-body font-medium text-hq-gold tracking-wider mb-1">{point.title}</p>
                      <p className="text-[10px] font-body text-white/60 leading-tight">{point.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Gold accent line */}
            <div className="h-0.5 bg-gradient-to-r from-hq-red via-hq-gold to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
