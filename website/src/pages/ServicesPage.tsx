import { useLang } from '../context/LangContext'
import { useNavigate } from 'react-router-dom'

const services = [
  {
    titleAr: 'تصاميم مبتكرة',
    titleEn: 'Innovative Designs',
    descAr: 'تصاميم معاصرة تجمع بين الجماليات والوظيفة، مصممة لتحسين البيئات الحضرية.',
    descEn: 'Contemporary designs that combine aesthetics and functionality to enhance urban environments.',
    icon: '🎨',
  },
  {
    titleAr: 'جودة عالية',
    titleEn: 'Premium Quality',
    descAr: 'منتجات عالية الجودة مصنوعة من مواد أسمنتية متقدمة وركام رخام طبيعي.',
    descEn: 'High-quality products manufactured using advanced cement materials and natural marble aggregates.',
    icon: '⭐',
  },
  {
    titleAr: 'استدامة بيئية',
    titleEn: 'Sustainability',
    descAr: 'حلول مستدامة مسؤولة بيئياً، مصممة لإنشاء مجتمعات مستقبلية.',
    descEn: 'Environmentally responsible solutions designed for future-ready communities.',
    icon: '🌱',
  },
  {
    titleAr: 'تركيب احترافي',
    titleEn: 'Professional Installation',
    descAr: 'فريق متخصص يضمن التركيب الصحيح والدقيق لجميع المشاريع.',
    descEn: 'Specialized team ensuring precise installation for all projects.',
    icon: '🔧',
  },
  {
    titleAr: 'دعم فني كامل',
    titleEn: 'Full Technical Support',
    descAr: 'دعم فني شامل قبل وأثناء وبعد التركيب لضمان رضا العميل.',
    descEn: 'Comprehensive technical support before, during, and after installation.',
    icon: '🛠️',
  },
  {
    titleAr: 'مواد متقدمة',
    titleEn: 'Advanced Materials',
    descAr: 'استخدام الخرسانة عالية الأداء وملحقات أسمنتية متطورة.',
    descEn: 'High-performance concrete and advanced cement additives.',
    icon: '🏗️',
  },
]

const materials = [
  { nameAr: 'خرسانة', nameEn: 'Concrete', descAr: 'خرسانة رمادية أو بيضاء عالية الأداء', descEn: 'High-quality grey or white Portland cement' },
  { nameAr: 'ركام رخام طبيعي', nameEn: 'Natural Marble Aggregates', descAr: 'ألوان: أبيض، أسود، بيج، أصفر، رمادي، أخضر، أحمر', descEn: 'Colors: White, Black, Beige, Yellow, Gray, Green, Red' },
  { nameAr: 'تشطيبات السطح', nameEn: 'Surface Finishes', descAr: 'تشطيبات ملس من المصنع أو معالجة متقدمة', descEn: 'Off-Mould Finish or Polished Finish' },
  { nameAr: 'خرسانة مسبقة الصب', nameEn: 'Precast Concrete', descAr: 'منتجات عالية الجودة مصبوبة بدقة في المصنع', descEn: 'High-precision factory-cast products' },
]

export default function ServicesPage() {
  const { lang, isRTL } = useLang()
  const navigate = useNavigate()

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', minHeight: 'calc(100vh - 68px)' }}>

      {/* PAGE HEADER */}
      <div style={{ background: '#fff', minHeight: '130px', display: 'flex', alignItems: 'flex-end', paddingBottom: '28px', paddingLeft: '80px', paddingRight: '80px', borderBottom: '1px solid #eee' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>
            <span style={{ color: '#8B0020', cursor: 'pointer' }} onClick={() => navigate('/')}>
              {lang === 'ar' ? 'الرئيسية' : 'Home'}
            </span>
            {' / '}
            {lang === 'ar' ? 'خدماتنا' : 'Services'}
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#1a1a1a', margin: 0 }}>
            {lang === 'ar' ? 'خدماتنا المتميزة' : 'Our Premium Services'}
          </h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '5px' }}>
            {lang === 'ar'
              ? 'نقدم مجموعة شاملة من الخدمات المتخصصة لتحقيق رؤيتك المعمارية بأعلى معايير الجودة.'
              : 'Comprehensive specialized services to realize your architectural vision with the highest quality standards.'}
          </p>
        </div>
      </div>

      {/* SERVICES GRID */}
      <section style={{ padding: '68px 80px', background: '#fff' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#8B0020', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            {lang === 'ar' ? 'ما نقدمه' : 'What We Offer'}
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
            {lang === 'ar'
              ? <>{lang === 'ar' ? 'خدماتنا' : 'Services'} <span style={{ color: '#8B0020' }}>{lang === 'ar' ? 'المتكاملة' : ''}</span></>
              : <>Our <span style={{ color: '#8B0020' }}>Core Services</span></>
            }
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {services.map((svc, i) => (
            <div key={i}
              style={{ padding: '28px', background: '#f9f9f9', borderRadius: '12px', border: '1px solid #eee', transition: 'transform 0.25s, box-shadow 0.25s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = 'none' }}>
              <div style={{ fontSize: '36px', marginBottom: '14px' }}>{svc.icon}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#8B0020' }}>
                {lang === 'ar' ? svc.titleAr : svc.titleEn}
              </h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, margin: 0 }}>
                {lang === 'ar' ? svc.descAr : svc.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MATERIALS */}
      <section style={{ padding: '68px 80px', background: '#f8f8f8' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#8B0020', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            {lang === 'ar' ? 'الخامات' : 'Materials'}
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
            {lang === 'ar'
              ? <>المواد <span style={{ color: '#8B0020' }}>والخامات</span></>
              : <>Materials <span style={{ color: '#8B0020' }}>&amp; Finishes</span></>
            }
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {materials.map((mat, i) => (
            <div key={i} style={{ padding: '24px', background: '#fff', borderRadius: '10px', border: '1px solid #ddd' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px', color: '#1a1a1a' }}>
                {lang === 'ar' ? mat.nameAr : mat.nameEn}
              </h3>
              <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.6, margin: 0 }}>
                {lang === 'ar' ? mat.descAr : mat.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#8B0020', padding: '60px 80px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>
          {lang === 'ar' ? 'هل تحتاج إلى خدمة معينة؟' : 'Need a Specific Service?'}
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', marginBottom: '28px', maxWidth: '500px', margin: '0 auto 28px', lineHeight: 1.7 }}>
          {lang === 'ar'
            ? 'تواصل مع فريقنا للحصول على استشارة مجانية وحل مخصص لمشروعك.'
            : 'Contact our team for a free consultation and a tailored solution for your project.'}
        </p>
        <button onClick={() => navigate('/contact')}
          style={{ padding: '13px 32px', background: '#fff', color: '#8B0020', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          {lang === 'ar' ? 'تواصل معنا ←' : 'Contact Us →'}
        </button>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .svc-section { padding: 40px 20px !important; }
        }
      `}</style>
    </div>
  )
}
