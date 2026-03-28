import Icon from '@/components/ui/icon';

const footerLinks = {
  'Модели': ['Hongqi H9', 'Hongqi E-HS9', 'Hongqi HS5', 'Hongqi H5', 'Все модели'],
  'Покупателям': ['Конфигуратор', 'Тест-драйв', 'Финансирование', 'Trade-In', 'Страхование'],
  'Владельцам': ['Техническое обслуживание', 'Гарантия', 'Запчасти и аксессуары', 'Контакт-центр', 'Мобильное приложение'],
  'Компания': ['О бренде', 'История Hongqi', 'Пресс-центр', 'Карьера', 'Партнёрам'],
};

export default function HongqiFooter() {
  return (
    <footer className="bg-[#060606] border-t border-white/5">
      {/* Main footer content */}
      <div className="max-w-[1920px] mx-auto px-6 lg:px-24 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-8 lg:gap-8">
          {/* Brand column */}
          <div>
            <div className="flex flex-col mb-6">
              <span className="font-display text-2xl font-light tracking-[0.3em] text-white">HONGQI</span>
              <span className="text-[9px] tracking-[0.4em] text-hq-gold font-body font-light mt-0.5">红旗 · Premium</span>
            </div>
            <p className="font-body font-light text-white/40 text-sm leading-relaxed max-w-xs mb-8">
              Hongqi — флагманский автомобильный бренд Китая. Более 70 лет мастерства, воплощённых в каждом автомобиле.
            </p>
            {/* Social */}
            <div className="flex gap-4">
              {[
                { icon: 'MessageCircle', label: 'Telegram' },
                { icon: 'Youtube', label: 'YouTube' },
                { icon: 'Linkedin', label: 'VK' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-9 h-9 border border-white/12 flex items-center justify-center text-white/40 hover:border-hq-red hover:text-white transition-all duration-300"
                  title={social.label}
                >
                  <Icon name={social.icon} fallback="Share2" size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-body mb-5">{category}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm font-body font-light text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Dealer finder strip */}
      <div className="border-t border-white/5">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-24 py-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Icon name="MapPin" size={16} className="text-hq-red flex-shrink-0" />
            <span className="text-sm font-body font-light text-white/60">
              Официальные дилеры в 40+ городах России
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="tel:88007007070" className="flex items-center gap-3 text-white hover:text-hq-gold transition-colors">
              <Icon name="Phone" size={14} className="text-hq-gold" />
              <span className="font-body text-sm tracking-wider">8 800 700-70-70</span>
            </a>
            <span className="hidden sm:block w-px h-5 bg-white/10 self-center" />
            <span className="text-white/30 text-sm font-body">Бесплатно по России</span>
          </div>
          <button className="flex items-center gap-2 border border-white/15 text-white/60 hover:text-white hover:border-white/40 text-[11px] tracking-[0.2em] uppercase font-body px-5 py-2.5 transition-all">
            <Icon name="MapPin" size={12} />
            Найти дилера
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-24 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] font-body text-white/25">
            © 2024 Hongqi Russia. Все права защищены. Цены указаны с учётом НДС и могут быть изменены.
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-6">
            {['Политика конфиденциальности', 'Условия использования', 'Cookie'].map((link) => (
              <a key={link} href="#" className="text-[11px] font-body text-white/25 hover:text-white/60 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}