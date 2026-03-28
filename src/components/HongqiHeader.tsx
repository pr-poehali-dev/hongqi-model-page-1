import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const navItems = [
  { label: 'Модели', href: '#models' },
  { label: 'Автомобили в наличии', href: '#stock' },
  { label: 'Покупателям', href: '#buyers' },
  { label: 'Владельцам', href: '#owners' },
  { label: 'Дилеры', href: '#dealers' },
  { label: 'О бренде', href: '#about' },
];

export default function HongqiHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#080808]/95 backdrop-blur-md border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="flex flex-col items-start">
              <span className="font-display text-2xl lg:text-3xl font-light tracking-[0.3em] text-white leading-none">
                HONGQI
              </span>
              <span className="text-[9px] tracking-[0.4em] text-hq-gold font-body font-light mt-0.5 uppercase">
                红旗 · Premium
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative text-[13px] font-body font-normal tracking-[0.08em] text-white/70 hover:text-white transition-colors duration-300 uppercase group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-hq-red to-hq-gold group-hover:w-full transition-all duration-400 ease-out" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-5">
            <button className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors group" title="Избранное">
              <Icon name="Heart" size={18} />
              <span className="text-[11px] tracking-wider font-body hidden xl:block">Избранное</span>
            </button>
            <button className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors group" title="Сравнение">
              <Icon name="GitCompare" size={18} />
              <span className="text-[11px] tracking-wider font-body hidden xl:block">Сравнение</span>
            </button>
            <div className="w-px h-5 bg-white/10" />
            <button className="shimmer-gold flex items-center gap-2 border border-hq-red text-white text-[11px] tracking-[0.15em] uppercase font-body font-medium px-5 py-2.5 hover:bg-hq-red transition-all duration-300">
              Тест-драйв
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#080808] flex flex-col pt-20">
          <nav className="flex flex-col px-6 py-8 gap-1">
            {navItems.map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-4 text-lg font-body font-light tracking-wider text-white/80 border-b border-white/5 flex items-center justify-between"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {item.label}
                <Icon name="ChevronRight" size={16} className="text-hq-gold" />
              </a>
            ))}
          </nav>
          <div className="px-6 mt-4 flex flex-col gap-3">
            <button className="flex items-center gap-3 text-white/60 py-3">
              <Icon name="Heart" size={18} />
              <span className="font-body text-sm tracking-wider">Избранное</span>
            </button>
            <button className="flex items-center gap-3 text-white/60 py-3">
              <Icon name="GitCompare" size={18} />
              <span className="font-body text-sm tracking-wider">Сравнение авто</span>
            </button>
            <button className="mt-4 w-full border border-hq-red text-white text-sm tracking-[0.15em] uppercase font-body py-4 hover:bg-hq-red transition-all">
              Записаться на тест-драйв
            </button>
          </div>
        </div>
      )}
    </>
  );
}
