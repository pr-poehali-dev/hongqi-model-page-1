import { useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const models = [
  {
    name: 'H9',
    category: 'Флагманский седан',
    price: 'от 7 990 000 ₽',
    tag: 'Флагман',
    image: 'https://cdn.poehali.dev/projects/d177c7f9-7e5b-4f92-96a2-0697c72723e4/files/c7cb4e90-2ad7-4f8c-b9c8-9ac282896e8e.jpg',
    active: true,
  },
  {
    name: 'E-HS9',
    category: 'Электрический SUV',
    price: 'от 9 200 000 ₽',
    tag: 'Электро',
    image: 'https://cdn.poehali.dev/projects/d177c7f9-7e5b-4f92-96a2-0697c72723e4/files/7fe90d38-da0b-441d-96eb-91357e535cfe.jpg',
    active: false,
  },
  {
    name: 'HS5',
    category: 'Премиальный SUV',
    price: 'от 4 990 000 ₽',
    tag: 'SUV',
    image: 'https://cdn.poehali.dev/projects/d177c7f9-7e5b-4f92-96a2-0697c72723e4/files/78c6fe82-c6a8-4aec-b7d8-cc08d7da6b7b.jpg',
    active: false,
  },
];

export default function ModelsSection() {
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
    <section id="models" ref={sectionRef} className="bg-[#0a0a0a] py-20 lg:py-32 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-20 gap-6">
          <div>
            <div className="reveal flex items-center gap-4 mb-4">
              <span className="w-8 h-px bg-hq-red" />
              <span className="text-[10px] tracking-[0.4em] text-hq-gold uppercase font-body">Линейка</span>
            </div>
            <h2 className="reveal delay-100 font-display text-5xl lg:text-7xl font-light text-white leading-none">
              Модели Hongqi
            </h2>
          </div>
          <p className="reveal delay-200 font-body font-light text-white/40 text-sm max-w-xs">
            Каждая модель — уникальный характер. Единая философия — безупречное превосходство.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/5">
          {models.map((model, i) => (
            <div
              key={model.name}
              className={`reveal delay-${(i + 1) * 100} group relative overflow-hidden bg-[#0a0a0a] hover:bg-[#0f0f0f] transition-all duration-500 cursor-pointer`}
            >
              {/* Active indicator */}
              {model.active && (
                <div className="absolute top-4 left-4 z-10 bg-hq-red text-white text-[9px] tracking-[0.25em] uppercase font-body px-3 py-1">
                  Вы смотрите
                </div>
              )}

              {/* Tag */}
              <div className="absolute top-4 right-4 z-10 border border-white/20 bg-black/40 text-white/60 text-[9px] tracking-[0.25em] uppercase font-body px-3 py-1 backdrop-blur-sm">
                {model.tag}
              </div>

              <div className="overflow-hidden aspect-[16/9]">
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
              </div>

              <div className="relative p-6 lg:p-8">
                <div className="flex items-end justify-between mb-2">
                  <span className="font-display text-4xl font-light text-white">{model.name}</span>
                  <span className="font-body text-sm font-light text-hq-gold">{model.price}</span>
                </div>
                <p className="text-[11px] tracking-[0.2em] text-white/40 uppercase font-body mb-6">{model.category}</p>
                <a
                  href="#"
                  className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-body text-white/60 group-hover:text-hq-red transition-colors duration-300"
                >
                  Узнать больше
                  <Icon name="ArrowRight" size={12} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Bottom hover line */}
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-hq-red to-hq-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
