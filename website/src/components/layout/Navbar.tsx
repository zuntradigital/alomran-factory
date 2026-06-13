import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLang } from '../../context/LangContext'
import { Heart, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { t } = useTranslation()
  const { lang, toggleLang } = useLang()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { to: '/',         label: t('nav.home')     },
    { to: '/about',    label: t('nav.about')    },
    { to: '/products', label: t('nav.products') },
    { to: '/projects', label: t('nav.projects') },
    { to: '/contact',  label: t('nav.contact')  },
  ]

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200 h-[68px] flex items-center px-8 justify-between transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
        <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
          <div className="w-[42px] h-[42px] rounded-lg flex items-center justify-center text-white font-black text-[22px]" style={{background:'#8B0020'}}>P</div>
          <div className="leading-tight text-start">
            <span className="block text-[13px] font-bold text-gray-900">{lang === 'ar' ? 'مصنع العمران للمنتجات الأسمنتية' : 'Al Omran Cement Products'}</span>
            <span className="block text-[10px] font-medium" style={{color:'#8B0020'}}>{t('footer.tagline')}</span>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-0.5">
          {links.map((l, i) => (
            <NavLink key={i} to={l.to} end={l.to === '/'}
              className={({ isActive }) => `px-3.5 py-1.5 text-[13.5px] font-medium rounded transition-colors ${isActive ? 'border-b-2 rounded-none' : 'text-gray-700 hover:bg-gray-100'}`}
              style={({ isActive }) => isActive ? { color: '#8B0020', borderColor: '#8B0020' } : {}}
            >{l.label}</NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate('/products')} className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 border-[1.5px] rounded-md text-[13px] font-semibold transition-all hover:text-white" style={{borderColor:'#8B0020',color:'#8B0020'}}
            onMouseEnter={e => (e.currentTarget.style.background='#8B0020')}
            onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
            <Heart size={14} />{t('nav.exclusive')}
          </button>
          <button onClick={toggleLang} className="px-3 py-1.5 border-[1.5px] border-gray-300 rounded text-[12.5px] font-bold text-gray-600 hover:border-[#8B0020] transition-all" style={{}}>
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>
          <button onClick={() => navigate('/contact')} className="hidden md:block px-4 py-2 text-white text-[13px] font-bold rounded-md transition-colors" style={{background:'#8B0020'}}>
            {t('nav.quote')}
          </button>
          <button onClick={() => setOpen(!open)} className="md:hidden p-1">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed top-[68px] inset-x-0 z-40 bg-white border-b border-gray-200 px-5 py-3 flex flex-col gap-1 shadow-lg md:hidden">
          {links.map((l, i) => (
            <NavLink key={i} to={l.to} onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg text-[15px] font-medium hover:bg-gray-100 transition-colors">
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  )
}
