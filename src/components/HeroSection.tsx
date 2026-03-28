import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

const heroImage = 'https://cdn.poehali.dev/projects/d177c7f9-7e5b-4f92-96a2-0697c72723e4/files/7fe90d38-da0b-441d-96eb-91357e535cfe.jpg';

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[580px] lg:min-h-[1080px] overflow-hidden bg-[#050505]">
      {/* Background */}
      <div
        className="absolute inset-0 scale-110"
        style={{ transform: `translateY(${scrollY * 0.2}px) scale(1.1)` }}
      >
        <img
          src={heroImage}
          alt="Hongqi H9"
          className="w-full h-full object-cover object-center opacity-60 lg:opacity-70"
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-[#050505]/20 lg:via-[#050505]/40 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40" />
      </div>

      {/* Glow */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-hq-red/5 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-8 lg:px-24 max-w-[1920px] mx-auto">
        <div className="max-w-xl lg:max-w-3xl">

          {/* Badge */}
          <div className={`inline-flex items-center gap-2 sm:gap-3 mb-4 lg:mb-8 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="text-[9px] sm:text-[10px] tracking-[0.35em] text-hq-gold uppercase font-body">
              Флагманский седан
            </span>
            <span className="w-5 sm:w-8 h-px bg-hq-gold/50" />
            <span className="text-[9px] sm:text-[10px] tracking-[0.35em] text-white/40 uppercase font-body">
              2024
            </span>
          </div>

          {/* Title */}
          <h1 className={`font-display font-light leading-none mb-2 transition-all duration-1000 delay-150 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="block text-[52px] sm:text-[72px] lg:text-[120px] xl:text-[160px] text-white tracking-tight">
              Hongqi
            </span>
            <span
              className="block text-[68px] sm:text-[90px] lg:text-[150px] xl:text-[200px] text-transparent bg-clip-text"
              style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}
            >
              H9
            </span>
          </h1>

          {/* Divider */}
          <div className={`flex items-center gap-3 mb-4 lg:mb-8 transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="h-px bg-gradient-to-r from-hq-red to-hq-gold w-10 sm:w-16 flex-shrink-0" />
            <span className="text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] text-white/50 uppercase font-body">
              Мастерство без компромиссов
            </span>
          </div>

          {/* Description — скрыто на самых маленьких */}
          <p className={`hidden sm:block text-white/60 font-body font-light text-sm lg:text-base leading-relaxed max-w-lg mb-8 lg:mb-14 transition-all duration-1000 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Флагманский седан нового поколения. Вершина технологического совершенства, воплощённая в каждой детали.
          </p>

          {/* CTAs */}
          <div className={`flex flex-row gap-3 transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button className="shimmer-gold group flex items-center justify-center gap-2 bg-hq-red text-white text-[10px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-body font-medium px-5 sm:px-8 py-3 sm:py-4 hover:bg-hq-red/80 transition-all duration-300">
              Конфигуратор
              <Icon name="ArrowRight" size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group flex items-center justify-center gap-2 border border-white/20 text-white text-[10px] sm:text-[11px] tracking-[0.15em] uppercase font-body font-light px-5 sm:px-8 py-3 sm:py-4 hover:border-white/50 transition-all duration-300">
              Тест-драйв
              <Icon name="ChevronRight" size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom stats desktop */}
        <div className={`absolute bottom-8 lg:bottom-12 left-6 lg:left-24 right-6 lg:right-24 items-end justify-between transition-all duration-1000 delay-700 hidden lg:flex ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex gap-12">
            {[
              { value: '3.9', unit: 'с', label: 'Разгон 0–100' },
              { value: '250', unit: 'км/ч', label: 'Макс. скорость' },
              { value: '449', unit: 'л.с.', label: 'Мощность' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-display text-4xl font-light text-white leading-none">
                  {stat.value}<span className="text-xl text-hq-gold ml-1">{stat.unit}</span>
                </span>
                <span className="text-[10px] tracking-[0.25em] text-white/40 uppercase mt-1 font-body">{stat.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-white/40 hover:text-white/80 transition-colors animate-bounce"
          >
            <span className="text-[9px] tracking-[0.3em] uppercase font-body">Прокрутить</span>
            <Icon name="ChevronDown" size={16} />
          </button>
        </div>

        {/* Mobile stats */}
        <div className={`lg:hidden absolute bottom-5 left-5 right-5 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-between items-end">
            {[
              { value: '3.9', unit: 'с', label: '0–100' },
              { value: '449', unit: 'л.с.', label: 'Мощность' },
              { value: '250', unit: 'км/ч', label: 'Максимум' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="font-display text-xl font-light text-white leading-none">
                  {stat.value}<span className="text-sm text-hq-gold ml-0.5">{stat.unit}</span>
                </span>
                <span className="text-[8px] tracking-wider text-white/40 uppercase font-body mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 h-px bg-gradient-to-r from-hq-red/30 via-hq-gold/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}
