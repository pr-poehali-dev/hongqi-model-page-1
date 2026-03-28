import { useEffect, useRef } from 'react';

const sideImage = 'https://cdn.poehali.dev/projects/d177c7f9-7e5b-4f92-96a2-0697c72723e4/files/c7cb4e90-2ad7-4f8c-b9c8-9ac282896e8e.jpg';

export default function OverviewSection() {
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
    <section id="overview" ref={sectionRef} className="bg-[#080808] py-20 lg:py-32 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-24">
        {/* Section label */}
        <div className="reveal flex items-center gap-4 mb-16 lg:mb-24">
          <span className="w-8 h-px bg-hq-red" />
          <span className="text-[10px] tracking-[0.4em] text-hq-gold uppercase font-body">О модели</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left: text */}
          <div>
            <h2 className="reveal font-display text-5xl lg:text-7xl xl:text-8xl font-light text-white leading-none mb-8">
              Новая эра<br />
              <span className="text-hq-red">величия</span>
            </h2>
            <p className="reveal delay-200 font-body font-light text-white/60 text-base lg:text-lg leading-relaxed mb-8 max-w-lg">
              Hongqi H9 — это не просто автомобиль. Это заявление. Воплощение 70-летнего наследия флагманского китайского бренда, переосмысленное через призму современных технологий и дизайна мирового класса.
            </p>
            <p className="reveal delay-300 font-body font-light text-white/40 text-sm leading-relaxed max-w-lg">
              Каждая деталь кузова sculpted вручную. Каждый шов салона прошит мастерами. Каждая система разработана, чтобы предугадывать ваши желания раньше, чем вы их осознаете.
            </p>

            {/* Key numbers */}
            <div className="reveal delay-400 grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/8">
              {[
                { num: '70+', text: 'лет истории' },
                { num: '168', text: 'патентов' },
                { num: '12', text: 'наград дизайна' },
              ].map((item) => (
                <div key={item.num} className="flex flex-col">
                  <span className="font-display text-3xl lg:text-4xl font-light text-hq-gold">{item.num}</span>
                  <span className="text-[10px] tracking-[0.25em] text-white/40 uppercase font-body mt-1">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: image */}
          <div className="reveal-right relative">
            <div className="relative overflow-hidden aspect-[4/3]">
              <img
                src={sideImage}
                alt="Hongqi H9 профиль"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              {/* Gold frame accent */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-hq-red to-hq-gold" />
              <div className="absolute top-4 right-4 border border-hq-gold/30 px-3 py-1.5">
                <span className="text-[9px] tracking-[0.3em] text-hq-gold uppercase font-body">H9 · 2024</span>
              </div>
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-[#0d0d0d] border border-white/8 p-5 hidden lg:block">
              <span className="text-[9px] tracking-[0.3em] text-hq-gold uppercase font-body block mb-2">Базовая цена</span>
              <span className="font-display text-2xl text-white font-light">от 7 990 000 ₽</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
