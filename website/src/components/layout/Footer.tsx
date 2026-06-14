import { useLang } from '../../context/LangContext'
import { useNavigate } from 'react-router-dom'

const hover = (color: string) => ({
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.color = '#fff' },
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.color = color },
})

export default function Footer() {
  const { lang } = useLang()
  const navigate = useNavigate()
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  const quickLinks = [
    ['/', lang === 'ar' ? 'الرئيسية' : 'Home'],
    ['/about', lang === 'ar' ? 'من نحن' : 'About Us'],
    ['#', lang === 'ar' ? 'الوظائف' : 'Careers'],
    ['#', lang === 'ar' ? 'التنزيلات' : 'Downloads'],
    ['#', lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'],
    ['/contact', lang === 'ar' ? 'تواصل معنا' : 'Contact Us'],
  ]

  const services = lang === 'ar'
    ? ['أثاث حضري', 'واجهات معمارية', 'خرسانة مسبقة الصب', 'حجر مصنّع', 'ساحات عامة وممرات', 'حلول مخصصة']
    : ['Urban Furniture', 'Architectural Facades', 'Precast Concrete', 'Engineered Stone', 'Public Squares & Walkways', 'Custom Solutions']

  const otherLinks = lang === 'ar'
    ? ['المدونة', 'الشركاء', 'الأسئلة الشائعة', 'تواصل معنا']
    : ['Blog', 'Partners', 'FAQ', 'Contact Us']

  const linkStyle: React.CSSProperties = {
    fontSize: '12.5px', background: 'none', border: 'none',
    color: 'rgba(255,255,255,0.55)', cursor: 'pointer', padding: 0,
    transition: 'color 0.2s', display: 'block', textAlign: 'inherit',
  }

  return (
    <footer style={{ background: '#1a1a1a', color: 'rgba(255,255,255,0.55)', direction: dir }}>
      <style>{`
        @media (min-width: 769px) and (max-width: 1200px) {
          .ft-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
        }
        @media (max-width: 768px) {
          .ft-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .ft-bottom { flex-direction: column !important; gap: 12px !important; text-align: center !important; }
          footer > div { padding: 32px 20px 20px !important; }
        }
      `}</style>
      <div style={{ padding: '48px 80px 24px' }}>

        {/* Top 5-column grid */}
        <div className="ft-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1.4fr', gap: '36px', marginBottom: '40px' }}>

          {/* Col 1 — Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img src="/src/assets/logo/logo-icon-white.svg" alt="Al Omran Logo" style={{ width: '36px', height: '36px', flexShrink: 0 }} />
              <div>
                <span style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>
                  {lang === 'ar' ? 'مصنع العمران للمنتجات الأسمنتية' : 'Al Omran Cement Products'}
                </span>
                <span style={{ display: 'block', fontSize: '10px', color: '#8B0020' }}>
                  {lang === 'ar' ? 'جودة وابتكار' : 'Quality & Innovation'}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '12.5px', lineHeight: 1.75, marginBottom: '16px' }}>
              {lang === 'ar'
                ? 'نبني مستقبلاً أفضل للمدن من خلال حلول خرسانية مبتكرة ومستدامة.'
                : 'Building a better future for cities through innovative and sustainable concrete solutions.'}
            </p>
            <div style={{ display: 'flex', gap: '7px' }}>
              {['in', 'f', 'ig', 'yt'].map(s => (
                <a key={s} href="#"
                  style={{ width: '32px', height: '32px', borderRadius: '7px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'background 0.2s, color 0.2s' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.16)'; el.style.color = '#fff' }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.08)'; el.style.color = 'rgba(255,255,255,0.65)' }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {quickLinks.map(([to, label]) => (
                <li key={label}>
                  <button style={linkStyle} onClick={() => navigate(to)} {...hover('rgba(255,255,255,0.55)')}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              {lang === 'ar' ? 'خدماتنا' : 'Our Services'}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {services.map(s => (
                <li key={s}>
                  <span style={{ fontSize: '12.5px', cursor: 'pointer', transition: 'color 0.2s' }} {...hover('rgba(255,255,255,0.55)')}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Other Links */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              {lang === 'ar' ? 'روابط أخرى' : 'Other Links'}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {otherLinks.map(s => (
                <li key={s}>
                  <span style={{ fontSize: '12.5px', cursor: 'pointer', transition: 'color 0.2s' }} {...hover('rgba(255,255,255,0.55)')}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5 — Contact + Mini Newsletter */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <div style={{ fontSize: '12.5px', lineHeight: 1.85, marginBottom: '16px' }}>
              <p>{lang === 'ar' ? 'المدينة الصناعية الثانية، الرياض' : '2nd Industrial City, Riyadh'}</p>
              <p>+966 11 123 4567</p>
              <p>info@alomranprecast.com</p>
            </div>
            <input
              type="email"
              placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Your email address'}
              style={{ width: '100%', padding: '8px 11px', marginBottom: '6px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff', fontSize: '12px', outline: 'none', boxSizing: 'border-box' } as React.CSSProperties}
            />
            <button style={{ width: '100%', padding: '8px', background: '#8B0020', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              {lang === 'ar' ? 'اشترك ←' : 'Subscribe →'}
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="ft-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
          <span>
            © 2024 {lang === 'ar' ? 'مصنع العمران للمنتجات الأسمنتية. جميع الحقوق محفوظة.' : 'Al Omran Factory. All rights reserved.'}
          </span>
          <div style={{ display: 'flex', gap: '18px' }}>
            {[
              lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy',
              lang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions',
            ].map(label => (
              <a key={label} href="#" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
