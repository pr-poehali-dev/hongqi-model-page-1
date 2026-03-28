import { useEffect, useRef, useState } from 'react';

const specGroups = [
  {
    label: 'Двигатель и трансмиссия',
    specs: [
      { name: 'Тип двигателя', value: 'PHEV Plug-in Hybrid' },
      { name: 'Бензиновый двигатель', value: '3.0 V6 Турбо, 449 л.с.' },
      { name: 'Электродвигатель', value: '160 кВт' },
      { name: 'Суммарная мощность', value: '449 л.с. / 830 Н·м' },
      { name: 'Коробка передач', value: '8-ступ. авт. ZF 8HP' },
      { name: 'Привод', value: 'Полный AWD' },
    ],
  },
  {
    label: 'Динамика',
    specs: [
      { name: 'Разгон 0–100 км/ч', value: '3.9 с' },
      { name: 'Макс. скорость', value: '250 км/ч' },
      { name: 'Запас хода (PHEV)', value: '800 км' },
      { name: 'Чисто электрический', value: '60 км' },
      { name: 'Расход топлива', value: '2.0 л/100 км' },
      { name: 'Ёмкость батареи', value: '25 кВт·ч' },
    ],
  },
  {
    label: 'Размеры и масса',
    specs: [
      { name: 'Длина', value: '5 137 мм' },
      { name: 'Ширина', value: '1 904 мм' },
      { name: 'Высота', value: '1 493 мм' },
      { name: 'Колёсная база', value: '3 060 мм' },
      { name: 'Снаряжённая масса', value: '2 278 кг' },
      { name: 'Объём багажника', value: '430 л' },
    ],
  },
  {
    label: 'Ходовая часть',
    specs: [
      { name: 'Подвеска передняя', value: 'Двойной поперечный рычаг' },
      { name: 'Подвеска задняя', value: 'Многорычажная пневмо' },
      { name: 'Тормоза передние', value: '390 мм перфор. диск' },
      { name: 'Тормоза задние', value: '360 мм перфор. диск' },
      { name: 'Размер шин', value: '275/40 R21' },
      { name: 'Диски', value: '21" кованые' },
    ],
  },
];

export default function SpecsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeGroup, setActiveGroup] = useState(0);

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
    <section id="specs" ref={sectionRef} className="bg-[#060606] py-20 lg:py-32 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-24">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="reveal flex items-center gap-4 mb-4">
              <span className="w-8 h-px bg-hq-red" />
              <span className="text-[10px] tracking-[0.4em] text-hq-gold uppercase font-body">Характеристики</span>
            </div>
            <h2 className="reveal delay-100 font-display text-3xl sm:text-5xl lg:text-7xl font-light text-white leading-none">
              Технические<br />данные
            </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-0">
          {/* Left: group tabs */}
          <div className="reveal flex lg:flex-col overflow-x-auto lg:overflow-visible border-b lg:border-b-0 lg:border-r border-white/8 mb-8 lg:mb-0">
            {specGroups.map((group, i) => (
              <button
                key={group.label}
                onClick={() => setActiveGroup(i)}
                className={`relative flex-shrink-0 lg:flex-shrink text-left px-0 lg:px-0 py-3 lg:py-5 pr-8 lg:pr-0 mr-6 lg:mr-0 text-[11px] lg:text-sm tracking-wider font-body transition-all duration-300 whitespace-nowrap lg:whitespace-normal ${
                  activeGroup === i
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <span className="flex items-center gap-3">
                  {activeGroup === i && <span className="hidden lg:inline-block w-5 h-px bg-hq-red flex-shrink-0" />}
                  {group.label}
                </span>
                {activeGroup === i && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-hq-red lg:hidden" />
                )}
              </button>
            ))}
          </div>

          {/* Right: specs table */}
          <div className="reveal delay-200 lg:pl-16">
            {specGroups[activeGroup].specs.map((spec, i) => (
              <div
                key={spec.name}
                className="flex items-center justify-between py-4 border-b border-white/5 group hover:bg-white/2 px-2 -mx-2 transition-colors"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="font-body text-sm text-white/50 font-light">{spec.name}</span>
                <span className="font-body text-sm text-white font-medium text-right">{spec.value}</span>
              </div>
            ))}

            {/* Download button */}
            <div className="mt-8">
              <button className="flex items-center gap-3 border border-white/15 text-white/60 hover:text-white hover:border-white/40 text-[11px] tracking-[0.2em] uppercase font-body px-6 py-3 transition-all duration-300">
                <span>Полные характеристики PDF</span>
                <span>↓</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom highlighted stats */}
        <div className="reveal delay-300 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 mt-16 lg:mt-24">
          {[
            { value: '449', unit: 'л.с.', label: 'Пиковая мощность' },
            { value: '830', unit: 'Н·м', label: 'Крутящий момент' },
            { value: '3.9', unit: 'с', label: '0 до 100 км/ч' },
            { value: '800', unit: 'км', label: 'Запас хода' },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#060606] p-8 lg:p-10 group hover:bg-[#0d0d0d] transition-all">
              <span className="font-display text-3xl sm:text-5xl lg:text-6xl font-light text-white group-hover:text-hq-gold transition-colors">
                {stat.value}
              </span>
              <span className="font-display text-2xl text-hq-red ml-2">{stat.unit}</span>
              <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase mt-3 font-body">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}