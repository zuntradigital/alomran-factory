import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface CompanySettings {
  companyNameAr:    string
  companyNameEn:    string
  taglineAr:        string
  taglineEn:        string
  contactEmail:     string
  notificationEmail:string
  phoneFactory:     string   // stored without spaces, e.g. +966501216075
  phoneHeadOffice:  string   // stored without spaces, e.g. +966112201773
  addressAr:        string
  addressEn:        string
  workingHours:     string
  websiteUrl:       string
  socialLinks: {
    linkedin:  string
    facebook:  string
    instagram: string
    youtube:   string
    twitter:   string
  }
}

export const DEFAULTS: CompanySettings = {
  companyNameAr:    'مصنع العمران للمنتجات الأسمنتية',
  companyNameEn:    'Al Omran Precast Factory',
  taglineAr:        'نصنع الحاضر ونبني المستقبل',
  taglineEn:        'Excellence in Precast Concrete Solutions',
  contactEmail:     'info@alomranprecast.com',
  notificationEmail:'info@alomranprecast.com',
  phoneFactory:     '+966501216075',
  phoneHeadOffice:  '+966112201773',
  addressAr:        'المدينة الصناعية الثانية، مصنع العمران، الرياض، المملكة العربية السعودية',
  addressEn:        '2nd Industrial City, Al Omran Precast Factory, Riyadh, KSA',
  workingHours:     'Sat–Wed: 8 AM – 4 PM | Thu: 8 AM – 1 PM',
  websiteUrl:       'https://www.opf-sa.com',
  socialLinks: {
    linkedin:  'https://www.linkedin.com/company/al-omran-precast/',
    facebook:  'https://www.facebook.com/alomranprecast/',
    instagram: 'https://www.instagram.com/alomranprecast/',
    youtube:   'https://www.youtube.com/@AlOmranPrecast',
    twitter:   '',
  },
}

const CACHE_KEY = 'alomran_company_settings_v2'

function loadCache(): CompanySettings {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch { /* ignore corrupt cache */ }
  return DEFAULTS
}

/** Format a phone string like +966501216075 to +966 50 121 6075 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('966') && digits.length === 12) {
    return `+966 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
  }
  return raw // return as-is if format is unexpected
}

export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings>(loadCache)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'company'),
      (snap) => {
        if (snap.exists()) {
          const merged: CompanySettings = { ...DEFAULTS, ...snap.data() as Partial<CompanySettings> }
          setSettings(merged)
          try { localStorage.setItem(CACHE_KEY, JSON.stringify(merged)) } catch { /* storage full */ }
        }
      },
      (err) => console.error('[useCompanySettings]', err.message)
    )
    return unsubscribe
  }, [])

  return settings
}
