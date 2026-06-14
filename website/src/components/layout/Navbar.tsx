import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLang } from '../../context/LangContext'
import { Menu, X, Heart, ChevronDown } from 'lucide-react'
import logoImg from '../../assets/logo/logo.png'

const CRIMSON = '#8B0020'

type NavItem =
  | { type: 'link'; to: string; key: string; end?: boolean }
  | { type: 'services' }

const NAV_EN: NavItem[] = [
  { type: 'link', to: '/', key: 'nav.home', end: true },
  { type: 'link', to: '/about', key: 'nav.about' },
  { type: 'services' },
  { type: 'link', to: '/projects', key: 'nav.projects' },
  { type: 'link', to: '/products', key: 'nav.products' },
]

const NAV_AR: NavItem[] = [
  { type: 'link', to: '/', key: 'nav.home', end: true },
  { type: 'services' },
  { type: 'link', to: '/projects', key: 'nav.projects' },
  { type: 'link', to: '/products', key: 'nav.products' },
  { type: 'link', to: '/contact', key: 'nav.contact' },
  { type: 'link', to: '/about', key: 'nav.about' },
]

const SERVICES = [
  { ar: 'الخرسانة المسبقة الصب', en: 'Precast Concrete', icon: '🏗️' },
  { ar: 'الأثاث الحضري', en: 'Urban Furniture', icon: '🪑' },
  { ar: 'الواجهات المعمارية', en: 'Architectural Facades', icon: '🏛️' },
  { ar: 'تصميم الساحات العامة', en: 'Public Square Design', icon: '🌆' },
  { ar: 'الاستشارات الهندسية', en: 'Engineering Consultancy', icon: '📐' },
]

function linkStyle(isActive: boolean): React.CSSProperties {
  return {
    padding: '4px 14px',
    fontSize: '14px',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? CRIMSON : '#333',
    textDecoration: 'none',
    borderBottom: `2px solid ${isActive ? CRIMSON : 'transparent'}`,
    transition: 'color 0.2s',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  }
}

export default function Navbar() {
  const { t } = useTranslation()
  const { lang, toggleLang } = useLang()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const servicesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navItems = lang === 'ar' ? NAV_AR : NAV_EN

  function renderNavItem(item: NavItem, key: number) {
    if (item.type === 'link') {
      return (
        <NavLink
          key={key}
          to={item.to}
          end={item.end}
          style={({ isActive }) => linkStyle(isActive)}
        >
          {t(item.key)}
        </NavLink>
      )
    }

    return (
      <div key={key} ref={servicesRef} style={{ position: 'relative' }}
        onMouseEnter={() => setServicesOpen(true)}
        onMouseLeave={() => setServicesOpen(false)}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '4px 14px', fontSize: '14px',
          fontWeight: servicesOpen ? 700 : 500,
          color: servicesOpen ? CRIMSON : '#333',
          background: 'transparent', border: 'none',
          borderBottom: `2px solid ${servicesOpen ? CRIMSON : 'transparent'}`,
          cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.2s',
        }}>
          {t('nav.services')}
          <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: servicesOpen ? 'rotate(180deg)' : 'none' }} />
        </button>

        {servicesOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)',
            [lang === 'ar' ? 'right' : 'left']: 0,
            background: '#fff', border: '1px solid #eee', borderRadius: '12px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)', padding: '8px',
            minWidth: '220px', zIndex: 100,
          }}>
            {SERVICES.map((s, i) => (
              <button key={i}
                onClick={() => { navigate('/products'); setServicesOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                  padding: '9px 12px', background: 'transparent', border: 'none',
                  borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#333',
                  textAlign: lang === 'ar' ? 'right' : 'left', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fdf4f5')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <span>{s.icon}</span>
                <span>{lang === 'ar' ? s.ar : s.en}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <style>{`
        .nav-desktop-links { display: flex; align-items: center; }
        .nav-desktop-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .nav-hamburger { display: none; }
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-desktop-actions { display: none !important; }
          .nav-hamburger { display: flex !important; align-items: center; }
        }
      `}</style>
      <nav role="navigation" aria-label={lang === 'ar' ? 'القائمة الرئيسية' : 'Main navigation'} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px',
        background: '#fff',
        borderBottom: '1px solid #eee',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.08)' : 'none',
        transition: 'box-shadow 0.3s',
      }}>
        {/* LOGO */}
        <button
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, transition: 'transform 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none' }}
        >
          <img src={logoImg} alt="Al Omran Logo" style={{ width: '46px', height: '46px', flexShrink: 0, objectFit: 'contain' }} />
          <div style={{ lineHeight: 1.3 }}>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1a1a1a' }}>
              {lang === 'ar' ? 'مصنع العمران للخرسانة المسبقة' : 'Al Omran Precast Factory'}
            </span>
            <span style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: CRIMSON }}>
              {lang === 'ar' ? 'جودة لا تُضاهى منذ 2012' : 'Unmatched Quality Since 2012'}
            </span>
          </div>
        </button>

        {/* CENTER NAV LINKS — desktop only */}
        <div style={{ display: 'flex', alignItems: 'center' }} className="nav-desktop-links">
          {navItems.map((item, i) => renderNavItem(item, i))}
        </div>

        {/* RIGHT ACTIONS — desktop only */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }} className="nav-desktop-actions">
          {/* Language toggle */}
          <div style={{ display: 'flex', gap: '2px', background: '#f0f0f0', borderRadius: '7px', padding: '2px' }}>
            {(['en', 'ar'] as const).map((l) => (
              <button key={l}
                onClick={() => lang !== l && toggleLang()}
                style={{
                  padding: '3px 10px', borderRadius: '5px', border: 'none',
                  fontSize: '11px', fontWeight: 700,
                  cursor: lang === l ? 'default' : 'pointer',
                  background: lang === l ? '#fff' : 'transparent',
                  color: lang === l ? '#1a1a1a' : '#888',
                  boxShadow: lang === l ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Exclusive Offers — outlined crimson */}
          <button
            onClick={() => navigate('/products')}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '7px 16px', border: `1.5px solid ${CRIMSON}`, borderRadius: '7px',
              background: 'transparent', color: CRIMSON, fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fdf4f5')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Heart size={13} fill={CRIMSON} stroke={CRIMSON} />
            {t('nav.exclusive')}
          </button>

          {/* Contact Us — text link, EN only (in AR it's already in the center nav) */}
          {lang === 'en' && (
            <NavLink to="/contact"
              style={({ isActive }) => ({
                ...linkStyle(isActive),
                padding: '7px 10px',
                border: 'none',
              })}>
              Contact Us
            </NavLink>
          )}

          {/* Request a Quote — solid crimson */}
          <button
            onClick={() => navigate('/contact')}
            style={{
              padding: '8px 20px', border: 'none', borderRadius: '7px',
              background: CRIMSON, color: '#fff', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(139,0,32,0.35)',
              transition: 'box-shadow 0.2s, transform 0.2s',
              animation: 'navPulse 0.5s ease 2s 2',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 6px 18px rgba(139,0,32,0.5)'; el.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 4px 12px rgba(139,0,32,0.35)'; el.style.transform = 'none' }}
          >
            {t('nav.quote')}
          </button>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="nav-hamburger"
          aria-label={mobileOpen ? (lang === 'ar' ? 'إغلاق القائمة' : 'Close menu') : (lang === 'ar' ? 'فتح القائمة' : 'Open menu')}
          aria-expanded={mobileOpen}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: '68px', left: 0, right: 0, zIndex: 40,
          background: '#fff', borderBottom: '1px solid #eee',
          padding: '12px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          animation: 'slideDown 0.2s ease',
        }}>
          {navItems.map((item, i) => {
            if (item.type === 'services') {
              return (
                <button key={i} onClick={() => { navigate('/products'); setMobileOpen(false) }}
                  style={{ display: 'block', width: '100%', textAlign: lang === 'ar' ? 'right' : 'left', padding: '11px 12px', fontSize: '15px', fontWeight: 500, color: '#333', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  {t('nav.services')}
                </button>
              )
            }
            return (
              <NavLink key={i} to={item.to} end={item.end}
                onClick={() => setMobileOpen(false)}
                style={({ isActive }) => ({
                  display: 'block', padding: '11px 12px', fontSize: '15px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? CRIMSON : '#333', textDecoration: 'none', borderRadius: '8px',
                })}>
                {t(item.key)}
              </NavLink>
            )
          })}
          {lang === 'en' && (
            <NavLink to="/contact" onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({ display: 'block', padding: '11px 12px', fontSize: '15px', fontWeight: isActive ? 700 : 500, color: isActive ? CRIMSON : '#333', textDecoration: 'none', borderRadius: '8px' })}>
              Contact Us
            </NavLink>
          )}

          <div style={{ borderTop: '1px solid #eee', marginTop: '8px', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => { navigate('/products'); setMobileOpen(false) }}
              style={{ padding: '10px', border: `1.5px solid ${CRIMSON}`, borderRadius: '7px', background: 'transparent', color: CRIMSON, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              {t('nav.exclusive')}
            </button>
            <button onClick={() => { navigate('/contact'); setMobileOpen(false) }}
              style={{ padding: '10px', border: 'none', borderRadius: '7px', background: CRIMSON, color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              {t('nav.quote')}
            </button>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', paddingTop: '4px' }}>
              {(['en', 'ar'] as const).map((l) => (
                <button key={l} onClick={() => lang !== l && toggleLang()}
                  style={{ padding: '6px 20px', border: '1px solid #ddd', borderRadius: '6px', background: lang === l ? CRIMSON : '#fff', color: lang === l ? '#fff' : '#333', fontSize: '12px', fontWeight: 700, cursor: lang === l ? 'default' : 'pointer' }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
