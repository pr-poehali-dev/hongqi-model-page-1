import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const colors = [
  { name: 'Обсидиановый чёрный', hex: '#0d0d0d', border: '#333', image: 'https://cdn.poehali.dev/projects/d177c7f9-7e5b-4f92-96a2-0697c72723e4/files/c7cb4e90-2ad7-4f8c-b9c8-9ac282896e8e.jpg' },
  { name: 'Лунное серебро', hex: '#c8c8c8', border: '#aaa', image: 'https://cdn.poehali.dev/projects/d177c7f9-7e5b-4f92-96a2-0697c72723e4/files/7fe90d38-da0b-441d-96eb-91357e535cfe.jpg' },
  { name: 'Глубокий гранат', hex: '#6b1515', border: '#8b2020', image: 'https://cdn.poehali.dev/projects/d177c7f9-7e5b-4f92-96a2-0697c72723e4/files/78c6fe82-c6a8-4aec-b7d8-cc08d7da6b7b.jpg' },
  { name: 'Полярная белизна', hex: '#e8e8e8', border: '#ccc', image: 'https://cdn.poehali.dev/projects/d177c7f9-7e5b-4f92-96a2-0697c72723e4/files/7fe90d38-da0b-441d-96eb-91357e535cfe.jpg' },
];

const interiors = [
  { name: 'Чёрная кожа Nappa', accent: '#1a1a1a' },
  { name: 'Кремовый кашемир', accent: '#d4c4a8' },
  { name: 'Красно-чёрный биколор', accent: '#8b1515' },
];

const packages = [
  { name: 'Базовая', price: '7 990 000', features: ['Климат-контроль 4-зон', 'Panorama roof', 'Meridian 16 спикеров'] },
  { name: 'Premium', price: '9 490 000', features: ['Массаж 4 сидений', 'HUD дисплей', 'Meridian 23 спикера', 'Ночное видение'] },
  { name: 'Exclusive', price: '11 990 000', features: ['Все опции Premium', 'Холодильник задний', 'Персональный аромат', 'Эксклюзивный цвет'] },
];

export default function ConfiguratorSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeColor, setActiveColor] = useState(0);
  const [activeInterior, setActiveInterior] = useState(0);
  const [activePackage, setActivePackage] = useState(1);
  const [activeStep, setActiveStep] = useState(0);

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

  const steps = ['Цвет', 'Интерьер', 'Комплектация'];

  return (
    <section id="configurator" ref={sectionRef} className="bg-[#080808] py-20 lg:py-32 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-24">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="reveal flex items-center gap-4 mb-4">
              <span className="w-8 h-px bg-hq-red" />
              <span className="text-[10px] tracking-[0.4em] text-hq-gold uppercase font-body">Конфигуратор</span>
            </div>
            <h2 className="reveal delay-100 font-display text-3xl sm:text-5xl lg:text-7xl font-light text-white leading-none">
              Создайте<br />свой H9
            </h2>
            <div className="lg:hidden font-display text-2xl text-hq-gold font-light">{packages[activePackage].price} ₽</div>
          </div>
          <div className="reveal delay-200 font-body text-right hidden lg:block">
            <span className="text-white/40 text-sm">Текущая конфигурация:</span>
            <div className="font-display text-3xl text-hq-gold font-light mt-1">
              {packages[activePackage].price} ₽
            </div>
          </div>
        </div>

        {/* Step tabs */}
        <div className="reveal delay-200 flex border-b border-white/8 mb-10 lg:mb-16 overflow-x-auto">
          {steps.map((step, i) => (
            <button
              key={step}
              onClick={() => setActiveStep(i)}
              className={`relative flex items-center gap-3 px-6 lg:px-8 py-4 text-[11px] tracking-[0.2em] uppercase font-body transition-all whitespace-nowrap ${
                activeStep === i ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center border text-[10px] font-body transition-all ${
                activeStep === i ? 'border-hq-red text-hq-red' : 'border-white/20 text-white/30'
              }`}>{i + 1}</span>
              {step}
              {activeStep === i && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-hq-red to-hq-gold" />
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Car preview */}
          <div className="reveal relative">
            <div className="relative overflow-hidden aspect-[4/3] sm:aspect-[16/9] bg-gradient-to-b from-[#0d0d0d] to-[#050505]">
              <img
                src={colors[activeColor].image}
                alt="Hongqi H9 configurator"
                className="w-full h-full object-cover transition-all duration-700"
              />
              {/* Color overlay tint */}
              <div
                className="absolute inset-0 mix-blend-color transition-all duration-700 opacity-20"
                style={{ backgroundColor: colors[activeColor].hex }}
              />
              <div className="absolute bottom-4 left-4 border border-white/10 bg-black/60 px-3 py-2">
                <span className="text-[9px] tracking-[0.25em] text-white/60 uppercase font-body">
                  {colors[activeColor].name}
                </span>
              </div>
            </div>

            {/* Interior preview strip */}
            <div className="mt-3 h-2" style={{ background: `linear-gradient(90deg, ${interiors[activeInterior].accent}, transparent)` }} />
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] text-white/40 tracking-wider font-body uppercase">Салон:</span>
              <span className="text-[10px] text-white/70 tracking-wider font-body">{interiors[activeInterior].name}</span>
            </div>
          </div>

          {/* Right: Options */}
          <div className="reveal delay-200">
            {/* Color step */}
            {activeStep === 0 && (
              <div>
                <h3 className="font-body text-sm tracking-[0.2em] text-white/60 uppercase mb-6">Выберите цвет</h3>
                <div className="flex flex-col gap-3">
                  {colors.map((color, i) => (
                    <button
                      key={color.name}
                      onClick={() => setActiveColor(i)}
                      className={`flex items-center gap-4 p-4 border transition-all duration-300 ${
                        activeColor === i ? 'border-hq-red bg-hq-red/5' : 'border-white/8 hover:border-white/20'
                      }`}
                    >
                      <div
                        className="w-8 h-8 flex-shrink-0"
                        style={{ backgroundColor: color.hex, border: `1px solid ${color.border}` }}
                      />
                      <span className="font-body text-sm text-white/80 flex-1 text-left">{color.name}</span>
                      {activeColor === i && <Icon name="Check" size={14} className="text-hq-red" />}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setActiveStep(1)}
                  className="mt-8 flex items-center gap-2 text-hq-red text-[11px] tracking-[0.2em] uppercase font-body hover:gap-4 transition-all"
                >
                  Следующий шаг <Icon name="ArrowRight" size={14} />
                </button>
              </div>
            )}

            {/* Interior step */}
            {activeStep === 1 && (
              <div>
                <h3 className="font-body text-sm tracking-[0.2em] text-white/60 uppercase mb-6">Выберите интерьер</h3>
                <div className="flex flex-col gap-3">
                  {interiors.map((interior, i) => (
                    <button
                      key={interior.name}
                      onClick={() => setActiveInterior(i)}
                      className={`flex items-center gap-4 p-4 border transition-all duration-300 ${
                        activeInterior === i ? 'border-hq-red bg-hq-red/5' : 'border-white/8 hover:border-white/20'
                      }`}
                    >
                      <div className="w-8 h-8 flex-shrink-0" style={{ backgroundColor: interior.accent }} />
                      <span className="font-body text-sm text-white/80 flex-1 text-left">{interior.name}</span>
                      {activeInterior === i && <Icon name="Check" size={14} className="text-hq-red" />}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setActiveStep(2)}
                  className="mt-8 flex items-center gap-2 text-hq-red text-[11px] tracking-[0.2em] uppercase font-body hover:gap-4 transition-all"
                >
                  Следующий шаг <Icon name="ArrowRight" size={14} />
                </button>
              </div>
            )}

            {/* Package step */}
            {activeStep === 2 && (
              <div>
                <h3 className="font-body text-sm tracking-[0.2em] text-white/60 uppercase mb-6">Выберите комплектацию</h3>
                <div className="flex flex-col gap-4">
                  {packages.map((pkg, i) => (
                    <button
                      key={pkg.name}
                      onClick={() => setActivePackage(i)}
                      className={`flex items-start gap-4 p-5 border text-left transition-all duration-300 ${
                        activePackage === i ? 'border-hq-red bg-hq-red/5' : 'border-white/8 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-4 h-4 border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                        activePackage === i ? 'border-hq-red bg-hq-red' : 'border-white/30'
                      }`}>
                        {activePackage === i && <div className="w-1.5 h-1.5 bg-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-body text-sm font-medium text-white">{pkg.name}</span>
                          <span className="font-display text-lg text-hq-gold font-light">{pkg.price} ₽</span>
                        </div>
                        <ul className="flex flex-col gap-1">
                          {pkg.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-[11px] text-white/50 font-body">
                              <span className="w-1 h-1 bg-hq-red flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </button>
                  ))}
                </div>
                <button className="mt-8 w-full bg-hq-red text-white text-[11px] tracking-[0.25em] uppercase font-body py-4 hover:bg-hq-red/80 transition-all duration-300 shimmer-gold">
                  Оформить заявку — {packages[activePackage].price} ₽
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}