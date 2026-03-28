import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const testimonials = [
  {
    name: 'Андрей Соколов',
    role: 'Предприниматель, Москва',
    text: 'После семи лет за рулём немецких флагманов — пересел на H9 и не пожалел. Качество сборки, динамика и технологии на уровне. Особенно впечатлила акустика Meridian.',
    rating: 5,
    model: 'H9 Exclusive',
  },
  {
    name: 'Михаил Кравченко',
    role: 'Топ-менеджер, Санкт-Петербург',
    text: 'Тест-драйв занял 20 минут. На покупку решился на 21-й. Пневматическая подвеска превращает любую дорогу в автобан. Самый тихий салон, в котором я когда-либо ездил.',
    rating: 5,
    model: 'H9 Premium',
  },
  {
    name: 'Дмитрий Лебедев',
    role: 'Архитектор, Казань',
    text: 'Дизайн экстерьера — произведение искусства. Каждый раз, выходя из машины, оглядываюсь. Особенно ночью с включёнными ходовыми огнями — это зрелище.',
    rating: 5,
    model: 'H9 Premium',
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

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

  const auto = useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#080808] py-20 lg:py-32 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-24">
        <div className="reveal flex items-center gap-4 mb-4">
          <span className="w-8 h-px bg-hq-red" />
          <span className="text-[10px] tracking-[0.4em] text-hq-gold uppercase font-body">Отзывы</span>
        </div>
        <h2 className="reveal delay-100 font-display text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-none mb-16">
          Говорят владельцы
        </h2>

        <div className="grid lg:grid-cols-[1fr_2px_2fr] gap-10 lg:gap-16 items-start">
          {/* Left: navigation */}
          <div className="flex flex-col gap-0">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setActive(i)}
                className={`text-left py-5 border-b border-white/5 transition-all duration-300 group ${
                  active === i ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                }`}
              >
                <div className="flex items-center gap-3">
                  {active === i && <span className="w-3 h-px bg-hq-red flex-shrink-0" />}
                  <span className="font-body text-sm font-medium text-white">{t.name}</span>
                </div>
                <span className="text-[11px] text-white/40 font-body font-light mt-0.5 block">{t.role}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden lg:block bg-white/8" />

          {/* Right: testimonial */}
          <div className="reveal delay-200">
            <div className="flex gap-1 mb-6">
              {[...Array(testimonials[active].rating)].map((_, i) => (
                <Icon key={i} name="Star" size={12} className="text-hq-gold fill-current" />
              ))}
            </div>
            <blockquote className="font-display text-xl sm:text-2xl lg:text-3xl font-light text-white leading-relaxed mb-8">
              «{testimonials[active].text}»
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-hq-red/30 to-hq-gold/30 border border-hq-gold/20 flex items-center justify-center">
                <span className="font-display text-lg text-hq-gold font-light">
                  {testimonials[active].name[0]}
                </span>
              </div>
              <div>
                <p className="font-body text-sm font-medium text-white">{testimonials[active].name}</p>
                <p className="text-[10px] text-hq-gold tracking-wider font-body">{testimonials[active].model}</p>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2 mt-10">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-px transition-all duration-500 ${i === active ? 'bg-hq-red w-8' : 'bg-white/20 w-4'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}