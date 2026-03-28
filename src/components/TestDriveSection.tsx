import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

export default function TestDriveSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', city: '', date: '' });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="test-drive" ref={sectionRef} className="relative bg-[#080808] py-20 lg:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-hq-red/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-hq-red/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-[1920px] mx-auto px-6 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left */}
          <div>
            <div className="reveal flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-hq-red" />
              <span className="text-[10px] tracking-[0.4em] text-hq-gold uppercase font-body">Тест-драйв</span>
            </div>
            <h2 className="reveal delay-100 font-display text-5xl lg:text-7xl font-light text-white leading-none mb-8">
              Почувствуйте<br />
              <span className="text-hq-red">мощь</span>
            </h2>
            <p className="reveal delay-200 font-body font-light text-white/60 text-base leading-relaxed max-w-md mb-12">
              Слова и цифры — лишь намёки. Настоящее знакомство с Hongqi H9 начинается за рулём. Запишитесь на персональный тест-драйв в ближайшем дилерском центре.
            </p>

            {/* Benefits */}
            <div className="reveal delay-300 flex flex-col gap-5">
              {[
                { icon: 'Clock', text: '60 минут персонального вождения' },
                { icon: 'MapPin', text: 'Маршрут по вашему выбору' },
                { icon: 'User', text: 'Личный консультант бренда' },
                { icon: 'Gift', text: 'Подарок за участие' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-4">
                  <div className="w-8 h-8 border border-hq-red/40 flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} fallback="Star" size={14} className="text-hq-red" />
                  </div>
                  <span className="text-sm font-body font-light text-white/70">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="reveal-right">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-16 h-16 border border-hq-gold/40 flex items-center justify-center mb-6">
                  <Icon name="Check" size={24} className="text-hq-gold" />
                </div>
                <h3 className="font-display text-3xl text-white font-light mb-3">Заявка принята</h3>
                <p className="text-white/50 text-sm font-body font-light">
                  Наш менеджер свяжется с вами в течение 2 часов для подтверждения времени и места
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] tracking-[0.25em] text-white/40 uppercase font-body">Ваше имя</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Имя Фамилия"
                      className="bg-transparent border border-white/12 text-white text-sm font-body font-light px-4 py-3 placeholder:text-white/25 focus:border-hq-red outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] tracking-[0.25em] text-white/40 uppercase font-body">Телефон</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+7 (___) ___-__-__"
                      className="bg-transparent border border-white/12 text-white text-sm font-body font-light px-4 py-3 placeholder:text-white/25 focus:border-hq-red outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.25em] text-white/40 uppercase font-body">Город</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="bg-[#0d0d0d] border border-white/12 text-white text-sm font-body font-light px-4 py-3 focus:border-hq-red outline-none transition-colors appearance-none"
                  >
                    <option value="">Выберите город</option>
                    <option value="moscow">Москва</option>
                    <option value="spb">Санкт-Петербург</option>
                    <option value="kazan">Казань</option>
                    <option value="krasnodar">Краснодар</option>
                    <option value="ekb">Екатеринбург</option>
                    <option value="nsk">Новосибирск</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.25em] text-white/40 uppercase font-body">Желаемая дата</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="bg-transparent border border-white/12 text-white text-sm font-body font-light px-4 py-3 focus:border-hq-red outline-none transition-colors [color-scheme:dark]"
                  />
                </div>

                <div className="mt-2 flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full bg-hq-red text-white text-[11px] tracking-[0.25em] uppercase font-body font-medium py-4 hover:bg-hq-red/80 transition-all duration-300 shimmer-gold"
                  >
                    Записаться на тест-драйв
                  </button>
                  <p className="text-[10px] text-white/25 font-body text-center leading-relaxed">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
