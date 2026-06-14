import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { useNavigate } from 'react-router-dom'
import { products, categories } from '../data/products'
import type { Product } from '../types'

export default function ProductsPage() {
  const { lang, isRTL } = useLang()
  const navigate = useNavigate()
  const [cat, setCat] = useState('all')
  const [selected, setSelected] = useState<Product | null>(null)

  const filtered = cat === 'all' ? products : products.filter(p => p.category === cat)

  return (
    <div>
      {/* PAGE HEADER */}
      <div style={{ background: '#fff', minHeight: '130px', display: 'flex', alignItems: 'flex-end', paddingBottom: '28px', paddingLeft: '80px', paddingRight: '80px', borderBottom: '1px solid #eee' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>
            <span style={{ color: '#8B0020', cursor: 'pointer' }} onClick={() => navigate('/')}>{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
            {' / '}
            {lang === 'ar' ? 'المنتجات' : 'Products'}
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#1a1a1a', margin: 0 }}>
            {lang === 'ar' ? 'كتالوج المنتجات' : 'Product Catalog'}
          </h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '5px' }}>
            {lang === 'ar'
              ? `${filtered.length} منتج من أصل ${products.length}`
              : `Showing ${filtered.length} of ${products.length} products`}
          </p>
        </div>
      </div>

      <div style={{ padding: '32px 80px' }}>
        {/* CATALOG DOWNLOAD BANNER */}
        <div style={{
          padding: '20px 24px', background: '#8B0020', borderRadius: '10px',
          marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '16px',
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}>
          <span style={{ fontSize: '28px', flexShrink: 0 }}>📄</span>
          <div style={{ flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '3px' }}>
              {lang === 'ar' ? 'تحميل الكتالوج الكامل' : 'Download Complete Catalog'}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
              {lang === 'ar' ? 'PDF بصيغة عالية الجودة مع جميع المنتجات والمواد' : 'High-quality PDF with all products and materials'}
            </div>
          </div>
          <a
            href="/alomran-catalog.pdf"
            download="alomran-catalog.pdf"
            style={{
              padding: '10px 22px', background: '#fff', color: '#8B0020',
              borderRadius: '7px', fontWeight: 700, fontSize: '13.5px',
              textDecoration: 'none', flexShrink: 0, transition: 'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f0f0f0' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#fff' }}
          >
            {lang === 'ar' ? '⬇ تحميل' : '⬇ Download'}
          </a>
        </div>

        {/* CATEGORY FILTERS */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {categories.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              style={{
                padding: '7px 18px', border: '1.5px solid',
                borderColor: cat === c.id ? '#8B0020' : '#ddd',
                borderRadius: '100px',
                background: cat === c.id ? '#8B0020' : '#fff',
                color: cat === c.id ? '#fff' : '#444',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
              }}>
              {lang === 'ar' ? c.nameAr : c.nameEn}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {filtered.map(p => (
            <div key={p.code} onClick={() => setSelected(p)}
              style={{ background: '#fff', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', transition: 'transform .2s, box-shadow .2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = 'none' }}>
              <div style={{ aspectRatio: '4/3', background: '#f5f5f5', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={p.image}
                  alt={lang === 'ar' ? p.nameAr : p.nameEn}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3' }}
                />
                <span style={{ position: 'absolute', top: '9px', right: '9px', background: '#8B0020', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', fontFamily: 'monospace' }}>
                  {p.code}
                </span>
              </div>
              <div style={{ padding: '13px' }}>
                <div style={{ fontSize: '11px', color: '#8B0020', fontWeight: 700, marginBottom: '3px' }}>
                  {lang === 'ar' ? p.categoryAr : p.categoryEn}
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, marginBottom: '3px' }}>
                  {lang === 'ar' ? p.nameAr : p.nameEn}
                </div>
                <div style={{ fontSize: '11px', color: '#aaa', fontFamily: 'monospace' }}>
                  {p.dimensions}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCT MODAL */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: '14px', maxWidth: '520px', width: '100%', maxHeight: '88vh', overflowY: 'auto', padding: '26px', position: 'relative' }}>
            <button onClick={() => setSelected(null)}
              style={{ position: 'absolute', top: '13px', right: '13px', background: '#f5f5f5', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✕
            </button>

            <div style={{ background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
              <img
                src={selected.image}
                alt={lang === 'ar' ? selected.nameAr : selected.nameEn}
                style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain', padding: '12px' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2' }}
              />
            </div>

            <span style={{ background: 'rgba(139,0,32,0.1)', color: '#8B0020', fontSize: '11.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
              {selected.code}
            </span>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '9px 0 3px' }}>
              {lang === 'ar' ? selected.nameAr : selected.nameEn}
            </h2>
            <p style={{ fontSize: '12.5px', color: '#8B0020', fontWeight: 600, marginBottom: '15px' }}>
              {lang === 'ar' ? selected.categoryAr : selected.categoryEn}
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <tbody>
                {[
                  [lang === 'ar' ? 'الكود' : 'Code', selected.code],
                  [lang === 'ar' ? 'الأبعاد (سم)' : 'Dimensions (cm)', selected.dimensions],
                  [lang === 'ar' ? 'المادة' : 'Material', lang === 'ar' ? 'خرسانة مسبقة الصب عالية الأداء' : 'High-Performance Precast Concrete'],
                  [lang === 'ar' ? 'خيارات التشطيب' : 'Finish Options', lang === 'ar' ? 'مصقول / صنفرة / بدون تشطيب' : 'Polished / Sand-Blasted / Off-Mold'],
                ].map(([k, v]) => (
                  <tr key={k as string} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 11px', fontWeight: 700, background: '#f8f8f8', width: '40%' }}>{k}</td>
                    <td style={{ padding: '8px 11px', fontFamily: 'monospace' }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={() => { setSelected(null); navigate('/contact') }}
              style={{ width: '100%', marginTop: '15px', padding: '11px', background: '#8B0020', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
              {lang === 'ar' ? 'طلب عرض سعر لهذا المنتج ←' : 'Request Quote for This Product →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
