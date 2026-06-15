import { useState, useEffect } from 'react'
import { settingsAPI } from '../../utils/api'

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    settingsAPI.getCompany()
      .then(data => { setSettings(data); setLoading(false) })
      .catch(() => { setError('تعذر تحميل الإعدادات'); setLoading(false) })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const result = await settingsAPI.saveCompany(settings)
      if (result.error) { setError(result.error); setSaving(false); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { setError('فشل الحفظ') }
    setSaving(false)
  }

  const set = (key: string, value: string) => setSettings((prev: any) => ({ ...prev, [key]: value }))
  const setSocial = (key: string, value: string) => setSettings((prev: any) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }))

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>جارٍ التحميل…</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>إعدادات الشركة</h1>
        {saved && <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '14px' }}>✓ تم الحفظ بنجاح</span>}
      </div>

      {error && <div style={{ background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px', color: '#dc2626', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

      <form onSubmit={handleSave}>
        <Section title="الاسم والشعار">
          <Row label="اسم الشركة (عربي)"    value={settings.nameAr  || ''} onChange={v => set('nameAr',  v)} />
          <Row label="اسم الشركة (إنجليزي)" value={settings.nameEn  || ''} onChange={v => set('nameEn',  v)} />
          <Row label="الشعار (عربي)"         value={settings.taglineAr || ''} onChange={v => set('taglineAr', v)} />
          <Row label="الشعار (إنجليزي)"      value={settings.taglineEn || ''} onChange={v => set('taglineEn', v)} />
        </Section>

        <Section title="معلومات التواصل">
          <Row label="البريد الإلكتروني"              value={settings.email || ''}              onChange={v => set('email', v)} type="email" />
          <Row label="بريد الإشعارات (طلبات جديدة)"  value={settings.notificationEmail || ''} onChange={v => set('notificationEmail', v)} type="email" />
          <Row label="هاتف المصنع"                    value={settings.phone || ''}              onChange={v => set('phone', v)} />
          <Row label="هاتف المصنع (للاتصال)"          value={settings.phoneTel || ''}           onChange={v => set('phoneTel', v)} />
          <Row label="هاتف المقر الرئيسي"             value={settings.phone2 || ''}             onChange={v => set('phone2', v)} />
          <Row label="هاتف المقر الرئيسي (للاتصال)"  value={settings.phone2Tel || ''}          onChange={v => set('phone2Tel', v)} />
        </Section>

        <Section title="العنوان والموقع">
          <Row label="العنوان (عربي)"     value={settings.addressAr || ''} onChange={v => set('addressAr', v)} />
          <Row label="العنوان (إنجليزي)" value={settings.addressEn || ''} onChange={v => set('addressEn', v)} />
          <Row label="رابط Google Maps"  value={settings.mapsUrl   || ''} onChange={v => set('mapsUrl',   v)} />
          <Row label="الموقع الإلكتروني" value={settings.website   || ''} onChange={v => set('website',   v)} />
        </Section>

        <Section title="وسائل التواصل الاجتماعي">
          {[
            { key: 'linkedin',  label: 'LinkedIn'  },
            { key: 'facebook',  label: 'Facebook'  },
            { key: 'instagram', label: 'Instagram' },
            { key: 'youtube',   label: 'YouTube'   },
          ].map(({ key, label }) => (
            <Row key={key} label={label} value={settings.socialLinks?.[key] || ''} onChange={v => setSocial(key, v)} type="url" />
          ))}
        </Section>

        <button
          type="submit"
          disabled={saving}
          style={{ padding: '12px 32px', background: saving ? '#aaa' : '#8B0020', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </form>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #eee', marginBottom: '16px' }}>
      <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#8B0020', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>{title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#555', marginBottom: '5px' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', border: '1.5px solid #e0e0e0', borderRadius: '7px', fontSize: '13.5px', outline: 'none' }}
      />
    </div>
  )
}
