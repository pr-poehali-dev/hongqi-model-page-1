import { useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const features = [
  {
    icon: 'Zap',
    title: 'Гибридная система',
    desc: 'Plug-in гибрид с суммарной мощностью 449 л.с. Запас хода 60 км в чисто электрическом режиме.',
    metric: '449 л.с.',
  },
  {
    icon: 'Shield',
    title: 'Активная безопасность',
    desc: 'Система предупреждения о столкновении с автоматическим торможением. 12 ультразвуковых датчиков.',
    metric: '5★ NCAP',
  },
  {
    icon: 'Cpu',
    title: 'Цифровая кабина',
    desc: 'Три экрана суммарной диагональю 42". Голосовое управление на русском языке. OTA-обновления.',
    metric: '42" экраны',
  },
  {
    icon: 'Volume2',
    title: 'Meridian Audio',
    desc: '23 динамика премиум-акустики Meridian с технологией Horizon Sound Stage. Объёмный звук в салоне.',
    metric: '23 динамика',
  },
  {
    icon: 'Wind',
    title: 'Адаптивная подвеска',
    desc: 'Пневматическая подвеска с четырьмя регулировками жёсткости. Клиренс от 100 до 210 мм.',
    metric: '4 режима',
  },
  {
    icon: 'Eye',
    title: 'Ночное видение',
    desc: 'Инфракрасная камера с распознаванием пешеходов. Дальность обнаружения — до 300 метров.',
    metric: '300 м',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el) => {
              el.classList.add('visible');
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="bg-[#060606] py-20 lg:py-32 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-24">
        {/* Header */}
        <div className="reveal flex items-center gap-4 mb-6">
          <span className="w-8 h-px bg-hq-red" />
          <span className="text-[10px] tracking-[0.4em] text-hq-gold uppercase font-body">Технологии</span>
        </div>
        <h2 className="reveal delay-100 font-display text-3xl sm:text-5xl lg:text-7xl font-light text-white leading-none mb-4">
          Преимущества
        </h2>
        <p className="reveal delay-200 font-body font-light text-white/50 text-sm lg:text-base max-w-lg mb-16 lg:mb-24">
          Каждая система H9 разработана с единственной целью — превзойти ваши ожидания.
        </p>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`reveal delay-${Math.min((i + 1) * 100, 600)} group bg-[#060606] hover:bg-[#0d0d0d] p-5 sm:p-8 lg:p-10 transition-all duration-500 cursor-pointer relative overflow-hidden`}
            >
              {/* Hover accent */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-hq-red to-hq-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 border border-hq-red/30 flex items-center justify-center group-hover:border-hq-red transition-colors duration-300">
                  <Icon name={feature.icon} fallback="Star" size={18} className="text-hq-red" />
                </div>
                <span className="font-display text-lg text-hq-gold/60 group-hover:text-hq-gold transition-colors font-light">
                  {feature.metric}
                </span>
              </div>

              <h3 className="font-body font-medium text-white text-base tracking-wide mb-3">
                {feature.title}
              </h3>
              <p className="font-body font-light text-white/50 text-sm leading-relaxed group-hover:text-white/70 transition-colors">
                {feature.desc}
              </p>

              {/* Bottom arrow */}
              <div className="mt-6 flex items-center gap-2 text-hq-red/0 group-hover:text-hq-red transition-all duration-300">
                <span className="text-[10px] tracking-[0.2em] uppercase font-body">Подробнее</span>
                <Icon name="ArrowRight" size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}