import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import i18n from '../i18n'

interface LangContextType {
  lang: 'ar' | 'en'
  toggleLang: () => void
  isRTL: boolean
}

const LangContext = createContext<LangContextType>({
  lang: 'ar',
  toggleLang: () => {},
  isRTL: true,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<'ar' | 'en'>('ar')

  const toggleLang = () => {
    const next = lang === 'ar' ? 'en' : 'ar'
    setLang(next)
    i18n.changeLanguage(next)
  }

  useEffect(() => {
    const html = document.documentElement
    html.lang = lang
    html.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.body.classList.toggle('en', lang === 'en')
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, toggleLang, isRTL: lang === 'ar' }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
