import { useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const options = [
  {
    icon: 'CreditCard',
    title: 'Кредит',
    subtitle: 'от 0.1% в месяц',
    desc: 'Партнёрские программы с ведущими банками. Первый взнос от 10%.',
    action: 'Рассчитать',
  },
  {
    icon: 'RefreshCw',
    title: 'Trade-In',
    subtitle: 'Оценка за 30 минут',
    desc: 'Зачтём вашу машину в счёт нового Hongqi. Честная рыночная оценка.',
    action: 'Оценить авто',
  },
  {
    icon: 'FileText',
    title: 'Лизинг',
    subtitle: 'для юридических лиц',
    desc: 'Выгодные условия лизинга с налоговыми преимуществами для бизнеса.',
    action: 'Узнать условия',
  },
  {
    icon: 'Shield',
    title: 'Страхование',
    subtitle: 'КАСКО и ОСАГО',
    desc: 'Специальные условия страхования для владельцев Hongqi.',
    action: 'Подробнее',
  },
];

export default function BuySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
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
        <div className="reveal flex items-center gap-4 mb-4">
          <span className="w-8 h-px bg-hq-red" />
          <span className="text-[10px] tracking-[0.4em] text-hq-gold uppercase font-body">Покупателям</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <h2 className="reveal delay-100 font-display text-5xl lg:text-7xl font-light text-white leading-none">
            Способы<br />приобретения
          </h2>
          <p className="reveal delay-200 font-body font-light text-white/40 text-sm max-w-xs">
            Индивидуальный подход к каждому клиенту. Прозрачные условия без скрытых платежей.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {options.map((opt, i) => (
            <div
              key={opt.title}
              className={`reveal delay-${(i + 1) * 100} group bg-[#050505] hover:bg-[#0d0d0d] p-8 lg:p-10 transition-all duration-500 relative overflow-hidden`}
            >
              <div className="absolute top-0 left-0 w-px h-0 bg-hq-gold group-hover:h-full transition-all duration-500" />
              
              <div className="w-12 h-12 border border-white/10 group-hover:border-hq-gold/40 flex items-center justify-center mb-6 transition-colors duration-300">
                <Icon name={opt.icon} fallback="Star" size={20} className="text-white/50 group-hover:text-hq-gold transition-colors duration-300" />
              </div>

              <h3 className="font-body font-medium text-white text-base mb-1">{opt.title}</h3>
              <p className="text-[10px] tracking-[0.2em] text-hq-gold uppercase font-body mb-4">{opt.subtitle}</p>
              <p className="font-body font-light text-white/50 text-sm leading-relaxed mb-8">{opt.desc}</p>

              <button className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-body text-white/40 group-hover:text-white transition-colors duration-300">
                {opt.action}
                <Icon name="ArrowRight" size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
