import { useLang } from '../../context/LangContext'
import { useNavigate } from 'react-router-dom'
import logoWhiteImg from '../../assets/logo/logo-white.png'
import { useCompanySettings, formatPhone } from '../../hooks/useCompanySettings'

export default function Footer() {
  const { lang, isRTL } = useLang()
  const navigate = useNavigate()
  const s = useCompanySettings()

  const quickLinks = [
    { labelAr: 'الرئيسية', labelEn: 'Home', path: '/' },
    { labelAr: 'من نحن', labelEn: 'About Us', path: '/about' },
    { labelAr: 'الأخبار', labelEn: 'News', path: '/news' },
    { labelAr: 'الوظائف', labelEn: 'Careers', path: '/' },
    { labelAr: 'التنزيلات', labelEn: 'Downloads', path: '/' },
    { labelAr: 'الأسئلة الشائعة', labelEn: 'FAQ', path: '/' },
  ]

  const services = [
    { labelAr: 'أثاث حضري', labelEn: 'Urban Furniture', path: '/products' },
    { labelAr: 'واجهات معمارية', labelEn: 'Architectural Facades', path: '/products' },
    { labelAr: 'خرسانة مسبقة الصب', labelEn: 'Precast Concrete', path: '/products' },
    { labelAr: 'حجر مصنّع', labelEn: 'Engineered Stone', path: '/products' },
    { labelAr: 'ساحات عامة', labelEn: 'Public Squares', path: '/products' },
    { labelAr: 'حلول مخصصة', labelEn: 'Custom Solutions', path: '/contact' },
  ]

  const socialLinks = [
    { icon: 'in', label: 'LinkedIn',  url: s.socialLinks.linkedin  },
    { icon: 'f',  label: 'Facebook',  url: s.socialLinks.facebook  },
    { icon: 'ig', label: 'Instagram', url: s.socialLinks.instagram },
    { icon: 'yt', label: 'YouTube',   url: s.socialLinks.youtube   },
    { icon: 'X',  label: 'Twitter',   url: s.socialLinks.twitter   },
  ].filter(l => l.url)

  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(s.addressEn)}`
  const phoneTel  = s.phoneFactory.replace(/\s/g, '')
  const phone2Tel = s.phoneHeadOffice.replace(/\s/g, '')

  const linkBtn: React.CSSProperties = {
    background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)',
    cursor: 'pointer', fontSize: '12.5px', padding: 0,
    transition: 'color 0.2s ease', display: 'block', textAlign: 'inherit',
  }

  return (
    <footer style={{ background: '#1a1a1a', color: 'rgba(255,255,255,0.55)', direction: isRTL ? 'rtl' : 'ltr' }}>
      <style>{`
        @media (min-width: 769px) and (max-width: 1200px) {
          .ft-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
        }
        @media (max-width: 768px) {
          .ft-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .ft-bottom { flex-direction: column !important; gap: 12px !important; text-align: center !important; }
          .ft-top { padding: 32px 20px 20px !important; }
        }
      `}</style>

      {/* Top Section */}
      <div className="ft-top" style={{ padding: '48px 80px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="ft-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1.4fr', gap: '36px', marginBottom: '40px' }}>

          {/* Col 1 — Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img
                src={logoWhiteImg}
                alt="Al Omran Logo"
                style={{ width: '36px', height: '36px', flexShrink: 0, objectFit: 'contain' }}
              />
              <div>
                <span style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>
                  {lang === 'ar' ? s.companyNameAr : s.companyNameEn}
                </span>
                <span style={{ display: 'block', fontSize: '10px', color: '#8B0020' }}>
                  {lang === 'ar' ? s.taglineAr : s.taglineEn}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '12.5px', lineHeight: 1.75, margin: '0 0 16px 0' }}>
              {lang === 'ar'
                ? 'نشكّل مستقبل التصميم العمراني من خلال الحلول الخرسانية المبتكرة والمستدامة.'
                : 'Shaping the future of urban design through innovative and sustainable precast concrete solutions.'}
            </p>
            <div style={{ display: 'flex', gap: '7px' }}>
              {socialLinks.map(({ icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  style={{
                    width: '32px', height: '32px', borderRadius: '7px',
                    background: 'rgba(255,255,255,0.08)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.65)',
                    textDecoration: 'none', transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = '#8B0020'
                    el.style.color = 'white'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.08)'
                    el.style.color = 'rgba(255,255,255,0.65)'
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 14px 0' }}>
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {quickLinks.map(link => (
                <li key={link.labelEn}>
                  <button
                    style={linkBtn}
                    onClick={() => navigate(link.path)}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)' }}
                  >
                    {lang === 'ar' ? link.labelAr : link.labelEn}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 14px 0' }}>
              {lang === 'ar' ? 'خدماتنا' : 'Our Services'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {services.map(service => (
                <li key={service.labelEn}>
                  <button
                    style={linkBtn}
                    onClick={() => navigate(service.path)}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)' }}
                  >
                    {lang === 'ar' ? service.labelAr : service.labelEn}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact Info */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 14px 0' }}>
              {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                  📍 {lang === 'ar' ? 'العنوان' : 'Location'}
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', lineHeight: 1.6, transition: 'color 0.2s ease', display: 'block' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#8B0020' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)' }}
                >
                  {lang === 'ar' ? s.addressAr : s.addressEn}
                </a>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                  📞 {lang === 'ar' ? 'الهاتف' : 'Phone'}
                </div>
                <a
                  href={`tel:${phoneTel}`}
                  dir="ltr"
                  style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s ease', display: 'block' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#8B0020' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)' }}
                >
                  {formatPhone(s.phoneFactory)}
                </a>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                  ✉️ {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </div>
                <a
                  href={`mailto:${s.contactEmail}`}
                  dir="ltr"
                  style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s ease', display: 'block' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#8B0020' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)' }}
                >
                  {s.contactEmail}
                </a>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block', marginTop: '4px', padding: '6px 14px',
                  border: '1px solid rgba(255,255,255,0.18)', borderRadius: '5px',
                  fontSize: '11.5px', color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none', transition: 'all 0.2s ease', width: 'fit-content',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = '#8B0020'
                  el.style.color = 'white'
                  el.style.borderColor = '#8B0020'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'transparent'
                  el.style.color = 'rgba(255,255,255,0.65)'
                  el.style.borderColor = 'rgba(255,255,255,0.18)'
                }}
              >
                {lang === 'ar' ? '→ الحصول على الاتجاهات' : 'Get Directions →'}
              </a>
            </div>
          </div>

          {/* Col 5 — Newsletter */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 14px 0' }}>
              {lang === 'ar' ? 'تحديثات أخيرة' : 'Stay Updated'}
            </h4>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 0 12px 0' }}>
              {lang === 'ar'
                ? 'اشترك لتستقبل أحدث الأخبار والعروض الحصرية.'
                : 'Subscribe to receive latest news, insights and exclusive offers.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <input
                type="email"
                placeholder={lang === 'ar' ? 'بريدك الإلكتروني' : 'Your email address'}
                style={{
                  width: '100%', padding: '9px 11px',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '6px', color: '#fff', fontSize: '12px', outline: 'none',
                  boxSizing: 'border-box', transition: 'all 0.2s ease',
                } as React.CSSProperties}
                onFocus={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.borderColor = '#8B0020'
                }}
                onBlur={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                }}
              />
              <button
                style={{
                  width: '100%', padding: '9px', background: '#8B0020', color: '#fff',
                  border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none' }}
              >
                {lang === 'ar' ? 'اشترك ←' : 'Subscribe →'}
              </button>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="ft-bottom"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: '12px', color: 'rgba(255,255,255,0.45)',
          }}
        >
          <span>
            © 2024 {lang === 'ar' ? 'مصنع العمران للمنتجات الأسمنتية. جميع الحقوق محفوظة.' : 'Al Omran Precast Factory. All rights reserved.'}
          </span>
          <div style={{ display: 'flex', gap: '18px' }}>
            {[
              lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy',
              lang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions',
            ].map(label => (
              <a
                key={label}
                href="#"
                style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)' }}
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
