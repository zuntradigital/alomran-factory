import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'

export default function ServicesPage() {
  const { lang, isRTL } = useLang()
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  const services = [
    {
      id: 0,
      titleAr: 'تصاميم مبتكرة',
      titleEn: 'Innovative Designs',
      descAr: 'تصاميم معاصرة تجمع بين الجماليات والوظيفة، مصممة لتحسين البيئات الحضرية.',
      descEn: 'Contemporary designs combining aesthetics and functionality to enhance urban environments.',
      icon: '✨',
      colorAccent: '#8B0020',
      bgGradient: 'linear-gradient(135deg, rgba(139, 0, 32, 0.08) 0%, rgba(139, 0, 32, 0.02) 100%)',
    },
    {
      id: 1,
      titleAr: 'جودة عالية',
      titleEn: 'Premium Quality',
      descAr: 'منتجات عالية الجودة مصنوعة من مواد أسمنتية متقدمة وركام رخام طبيعي.',
      descEn: 'High-quality products using advanced cement materials and natural marble aggregates.',
      icon: '⭐',
      colorAccent: '#6B0018',
      bgGradient: 'linear-gradient(135deg, rgba(107, 0, 24, 0.08) 0%, rgba(107, 0, 24, 0.02) 100%)',
    },
    {
      id: 2,
      titleAr: 'استدامة بيئية',
      titleEn: 'Sustainability',
      descAr: 'حلول مستدامة مسؤولة بيئياً، مصممة لإنشاء مجتمعات مستقبلية.',
      descEn: 'Environmentally responsible solutions for future-ready communities.',
      icon: '🌱',
      colorAccent: '#2d8659',
      bgGradient: 'linear-gradient(135deg, rgba(45, 134, 89, 0.08) 0%, rgba(45, 134, 89, 0.02) 100%)',
    },
    {
      id: 3,
      titleAr: 'تركيب احترافي',
      titleEn: 'Professional Installation',
      descAr: 'فريق متخصص يضمن التركيب الصحيح والدقيق لجميع المشاريع.',
      descEn: 'Specialized team ensuring precise installation for all projects.',
      icon: '🔧',
      colorAccent: '#d4601f',
      bgGradient: 'linear-gradient(135deg, rgba(212, 96, 31, 0.08) 0%, rgba(212, 96, 31, 0.02) 100%)',
    },
    {
      id: 4,
      titleAr: 'دعم فني كامل',
      titleEn: 'Full Technical Support',
      descAr: 'دعم فني شامل قبل وأثناء وبعد التركيب لضمان رضا العميل.',
      descEn: 'Comprehensive technical support before, during, and after installation.',
      icon: '🛠️',
      colorAccent: '#1e3a8a',
      bgGradient: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(30, 58, 138, 0.02) 100%)',
    },
    {
      id: 5,
      titleAr: 'مواد متقدمة',
      titleEn: 'Advanced Materials',
      descAr: 'استخدام الخرسانة عالية الأداء وملحقات أسمنتية متطورة.',
      descEn: 'High-performance concrete and advanced cement additives.',
      icon: '🏗️',
      colorAccent: '#7c3aed',
      bgGradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0.02) 100%)',
    },
  ]

  const materials = [
    {
      nameAr: 'خرسانة',
      nameEn: 'Concrete',
      descAr: 'خرسانة رمادية أو بيضاء عالية الأداء',
      descEn: 'High-quality grey or white Portland cement',
      icon: '🪨',
    },
    {
      nameAr: 'ركام رخام طبيعي',
      nameEn: 'Natural Marble Aggregates',
      descAr: 'ألوان: أبيض، أسود، بيج، أصفر، رمادي، أخضر، أحمر',
      descEn: 'Colors: White, Black, Beige, Yellow, Gray, Green, Red',
      icon: '💎',
    },
    {
      nameAr: 'تشطيبات السطح',
      nameEn: 'Surface Finishes',
      descAr: 'تشطيبات ملس من المصنع أو معالجة متقدمة',
      descEn: 'Off-Mould Finish or Polished Finish',
      icon: '✨',
    },
    {
      nameAr: 'خرسانة مسبقة الصب',
      nameEn: 'Precast Concrete',
      descAr: 'منتجات عالية الجودة مصبوبة بدقة في المصنع',
      descEn: 'High-precision factory-cast products',
      icon: '🏭',
    },
  ]

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cardIndex = parseInt(entry.target.getAttribute('data-index') || '-1')
          if (cardIndex >= 0) {
            setVisibleCards((prev) => (prev.includes(cardIndex) ? prev : [...prev, cardIndex]))
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, { threshold: 0.2 })
    document.querySelectorAll('[data-index]').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', minHeight: 'calc(100vh - 68px)', paddingTop: '68px' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .service-card {
          transition: all 0.35s cubic-bezier(0.23, 1, 0.320, 1);
          border: 1px solid rgba(139, 0, 32, 0.1);
          position: relative;
          overflow: hidden;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(139, 0, 32, 0.12);
          border-color: rgba(139, 0, 32, 0.2);
        }

        .service-card:hover::before {
          opacity: 1;
        }

        .service-icon {
          display: inline-block;
          font-size: 42px;
          animation: iconFloat 3s ease-in-out infinite;
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .service-card:hover .service-icon {
          transform: scale(1.15) rotate(8deg);
          filter: drop-shadow(0 4px 12px rgba(139, 0, 32, 0.2));
        }

        .material-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(139, 0, 32, 0.08);
          position: relative;
        }

        .material-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #8B0020, transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .material-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(139, 0, 32, 0.08);
          border-color: rgba(139, 0, 32, 0.15);
        }

        .material-card:hover::after {
          opacity: 1;
        }

        .material-icon {
          display: inline-block;
          font-size: 32px;
          margin-bottom: 12px;
          transition: transform 0.3s ease;
        }

        .material-card:hover .material-icon {
          transform: scale(1.2) rotate(-6deg);
        }

        .cta-btn {
          display: inline-block;
          padding: 14px 32px;
          background: white;
          color: #8B0020;
          border-radius: 7px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (max-width: 768px) {
          .services-section-padding { padding: 48px 24px !important; }
          .hero-section-padding { padding: 56px 24px !important; }
          .cta-section-padding { padding: 52px 24px !important; }
        }

        @media (max-width: 480px) {
          .services-section-padding { padding: 36px 16px !important; }
          .hero-section-padding { padding: 40px 16px !important; }
          .cta-section-padding { padding: 40px 16px !important; }
        }
      `}</style>

      {/* Hero Section */}
      <section
        className="hero-section-padding"
        style={{
          background: 'linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%)',
          padding: '80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute',
          top: -50,
          right: isRTL ? 'auto' : -50,
          left: isRTL ? -50 : 'auto',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(139, 0, 32, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -100,
          left: isRTL ? 'auto' : -100,
          right: isRTL ? -100 : 'auto',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(139, 0, 32, 0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900,
            color: '#1a1a1a',
            marginBottom: '16px',
            animation: 'fadeInDown 0.7s ease-out',
          }}>
            {lang === 'ar' ? 'خدماتنا المتميزة' : 'Our Premium Services'}
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.8,
            animation: 'fadeInUp 0.7s ease-out 0.2s backwards',
          }}>
            {lang === 'ar'
              ? 'نقدم مجموعة شاملة من الخدمات المتخصصة لتحقيق رؤيتك المعمارية بأعلى معايير الجودة والاحترافية.'
              : 'We offer comprehensive specialized services to realize your architectural vision with highest quality standards and professionalism.'}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section
        className="services-section-padding"
        style={{
          padding: '80px',
          background: '#fff',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(139, 0, 32, 0.1), transparent)',
          pointerEvents: 'none',
        }} />

        <h2 style={{
          fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
          fontWeight: 800,
          marginBottom: '56px',
          textAlign: isRTL ? 'right' : 'left',
          color: '#1a1a1a',
        }}>
          {lang === 'ar' ? (
            <>{'خدماتنا '}<span style={{ color: '#8B0020' }}>{'المتخصصة'}</span></>
          ) : (
            <>{'Our '}<span style={{ color: '#8B0020' }}>{'Services'}</span></>
          )}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
        }}>
          {services.map((svc) => (
            <div
              key={svc.id}
              data-index={svc.id}
              className="service-card"
              style={{
                padding: '36px',
                background: `${svc.bgGradient}, #ffffff`,
                borderRadius: '14px',
                opacity: visibleCards.includes(svc.id) ? 1 : 0.3,
                animation: visibleCards.includes(svc.id)
                  ? `fadeInUp 0.7s ease-out ${svc.id * 0.1}s both`
                  : 'none',
              }}
            >
              <div style={{ height: '56px', display: 'flex', alignItems: 'center', marginBottom: '18px' }}>
                <span className="service-icon">{svc.icon}</span>
              </div>

              <h3 style={{
                fontSize: '17px',
                fontWeight: 700,
                marginBottom: '10px',
                color: svc.colorAccent,
              }}>
                {lang === 'ar' ? svc.titleAr : svc.titleEn}
              </h3>

              <p style={{
                fontSize: '14px',
                color: '#666',
                lineHeight: 1.75,
                margin: 0,
              }}>
                {lang === 'ar' ? svc.descAr : svc.descEn}
              </p>

              <div style={{
                marginTop: '18px',
                height: '2px',
                background: `linear-gradient(${isRTL ? '270deg' : '90deg'}, ${svc.colorAccent}, transparent)`,
                borderRadius: 1,
              }} />
            </div>
          ))}
        </div>
      </section>

      {/* Materials & Finishes */}
      <section
        className="services-section-padding"
        style={{
          padding: '80px',
          background: 'linear-gradient(135deg, #f9f9f9 0%, #f5f5f5 100%)',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(139, 0, 32, 0.1), transparent)',
          pointerEvents: 'none',
        }} />

        <h2 style={{
          fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
          fontWeight: 800,
          marginBottom: '56px',
          textAlign: isRTL ? 'right' : 'left',
          color: '#1a1a1a',
        }}>
          {lang === 'ar' ? (
            <>{'المواد و'}<span style={{ color: '#8B0020' }}>{'الخامات'}</span></>
          ) : (
            <>{'Materials & '}<span style={{ color: '#8B0020' }}>{'Finishes'}</span></>
          )}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
        }}>
          {materials.map((mat, i) => (
            <div
              key={i}
              className="material-card"
              style={{
                padding: '28px',
                background: '#ffffff',
                borderRadius: '12px',
                animation: `fadeInUp 0.7s ease-out ${0.3 + i * 0.1}s backwards`,
              }}
            >
              <div className="material-icon">{mat.icon}</div>
              <h3 style={{
                fontSize: '15px',
                fontWeight: 700,
                marginBottom: '8px',
                color: '#8B0020',
              }}>
                {lang === 'ar' ? mat.nameAr : mat.nameEn}
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#777',
                lineHeight: 1.7,
                margin: 0,
              }}>
                {lang === 'ar' ? mat.descAr : mat.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="cta-section-padding"
        style={{
          padding: '68px 80px',
          background: '#8B0020',
          color: 'white',
          textAlign: 'center',
          animation: 'fadeInUp 0.8s ease-out 0.4s backwards',
        }}
      >
        <h2 style={{
          fontSize: 'clamp(1.6rem, 2.5vw, 2rem)',
          fontWeight: 800,
          marginBottom: '16px',
        }}>
          {lang === 'ar' ? 'هل لديك مشروع في الذهن؟' : 'Have a Project in Mind?'}
        </h2>
        <p style={{
          fontSize: '15px',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto 28px',
          lineHeight: 1.7,
        }}>
          {lang === 'ar'
            ? 'تواصل معنا اليوم لمناقشة احتياجاتك والحصول على حل مخصص يتناسب مع رؤيتك.'
            : 'Contact us today to discuss your needs and get a customized solution for your vision.'}
        </p>
        <a href="/contact" className="cta-btn">
          {lang === 'ar' ? 'تواصل معنا' : 'Get in Touch'}
        </a>
      </section>
    </div>
  )
}
