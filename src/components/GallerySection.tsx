import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const images = [
  {
    src: 'https://cdn.poehali.dev/projects/d177c7f9-7e5b-4f92-96a2-0697c72723e4/files/7fe90d38-da0b-441d-96eb-91357e535cfe.jpg',
    label: 'Фронтальный вид',
    tag: 'Экстерьер',
  },
  {
    src: 'https://cdn.poehali.dev/projects/d177c7f9-7e5b-4f92-96a2-0697c72723e4/files/c7cb4e90-2ad7-4f8c-b9c8-9ac282896e8e.jpg',
    label: 'Профиль',
    tag: 'Экстерьер',
  },
  {
    src: 'https://cdn.poehali.dev/projects/d177c7f9-7e5b-4f92-96a2-0697c72723e4/files/c0618590-464c-48bb-bb3b-374c145a30fe.jpg',
    label: 'Интерьер',
    tag: 'Салон',
  },
  {
    src: 'https://cdn.poehali.dev/projects/d177c7f9-7e5b-4f92-96a2-0697c72723e4/files/78c6fe82-c6a8-4aec-b7d8-cc08d7da6b7b.jpg',
    label: 'Задняя часть',
    tag: 'Экстерьер',
  },
];

const tabs = ['Все', 'Экстерьер', 'Салон'];

export default function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('Все');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeTab === 'Все' ? images : images.filter((img) => img.tag === activeTab);

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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight' && lightbox !== null) setLightbox((lightbox + 1) % images.length);
      if (e.key === 'ArrowLeft' && lightbox !== null) setLightbox((lightbox - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox]);

  return (
    <section id="gallery" ref={sectionRef} className="bg-[#050505] py-20 lg:py-32 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-24">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div>
            <div className="reveal flex items-center gap-4 mb-4">
              <span className="w-8 h-px bg-hq-red" />
              <span className="text-[10px] tracking-[0.4em] text-hq-gold uppercase font-body">Фотографии</span>
            </div>
            <h2 className="reveal delay-100 font-display text-5xl lg:text-7xl font-light text-white leading-none">
              Галерея
            </h2>
          </div>

          {/* Tabs */}
          <div className="reveal delay-200 flex gap-0 border border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase font-body transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-hq-red text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {filtered.map((img, i) => (
            <div
              key={img.src}
              className={`reveal delay-${Math.min((i + 1) * 100, 400)} group relative overflow-hidden cursor-pointer aspect-[4/3]`}
              onClick={() => setLightbox(images.indexOf(img))}
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[9px] tracking-[0.3em] text-hq-gold uppercase font-body">{img.tag}</span>
                <p className="text-white text-sm font-body font-light mt-1">{img.label}</p>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Icon name="Expand" size={16} className="text-white/80" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 text-white/70 hover:text-white z-10">
            <Icon name="X" size={24} />
          </button>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 p-2"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length); }}
          >
            <Icon name="ChevronLeft" size={32} />
          </button>
          <img
            src={images[lightbox].src}
            alt={images[lightbox].label}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 p-2"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length); }}
          >
            <Icon name="ChevronRight" size={32} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === lightbox ? 'bg-hq-red w-6' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
