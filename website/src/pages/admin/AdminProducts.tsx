import { useState, useEffect } from 'react'
import { productsAPI } from '../../utils/api'

const CATEGORIES = [
  { id: 'all', label: 'كل الفئات' },
  { id: 'BE', label: 'مقاعد' },
  { id: 'TA', label: 'طاولات' },
  { id: 'TB', label: 'حاويات نفايات' },
  { id: 'PL', label: 'أحواض زهور' },
  { id: 'BO', label: 'بوالرد' },
  { id: 'CB', label: 'حواجز خرسانية' },
  { id: 'WS', label: 'مصدات سيارات' },
  { id: 'SS', label: 'درج السلم' },
  { id: 'ST', label: 'بلاطات خرسانية' },
]

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    setError('')
    productsAPI.getAll()
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => { setError('تعذر الاتصال بالخادم'); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const q = search.toLowerCase()
  const filtered = products.filter(p => {
    const matchCat = catFilter === 'all' || p.category === catFilter
    const matchSearch = !q
      || (p.code || '').toLowerCase().includes(q)
      || (p.nameAr || '').includes(search)
      || (p.nameEn || '').toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`حذف المنتج ${code}؟`)) return
    setDeleting(id)
    try {
      await productsAPI.delete(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch {
      alert('فشل الحذف')
    }
    setDeleting(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2px' }}>إدارة المنتجات</h1>
          <span style={{ fontSize: '13px', color: '#888' }}>{loading ? '…' : `${products.length} منتج في قاعدة البيانات`}</span>
        </div>
        <button onClick={load} style={{ padding: '9px 16px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '7px', fontSize: '13px', cursor: 'pointer' }}>↻ تحديث</button>
      </div>

      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', color: '#dc2626', fontSize: '13px', marginBottom: '16px' }}>{error}</div>
      )}

      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالكود أو الاسم..."
            style={{ flex: 1, minWidth: '160px', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '7px', fontSize: '13px', outline: 'none' }}
          />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '7px', fontSize: '13px', cursor: 'pointer' }}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          {(search || catFilter !== 'all') && (
            <button onClick={() => { setSearch(''); setCatFilter('all') }}
              style={{ padding: '8px 12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '7px', fontSize: '13px', cursor: 'pointer' }}>
              ✕ مسح
            </button>
          )}
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '12.5px', color: '#888' }}>{loading ? '' : `${filtered.length} نتيجة`}</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>جارٍ التحميل…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#aaa', fontSize: '14px' }}>
            {search || catFilter !== 'all' ? 'لا توجد نتائج' : 'لا توجد منتجات بعد'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8f8f8' }}>
                {['الكود', 'الاسم (عربي)', 'الاسم (إنجليزي)', 'الفئة', 'الأبعاد', 'الإجراءات'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#666', fontSize: '12px', borderBottom: '1px solid #eee' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id || i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: '#8B0020' }}>{p.code || '—'}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{p.nameAr || '—'}</td>
                  <td style={{ padding: '10px 12px', color: '#555' }}>{p.nameEn || '—'}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, background: 'rgba(139,0,32,0.08)', color: '#8B0020' }}>{p.category || '—'}</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#888', fontFamily: 'monospace', fontSize: '12px' }}>{p.dimensions || '—'}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <button
                      onClick={() => handleDelete(p.id, p.code)}
                      disabled={deleting === p.id}
                      style={{ fontSize: '12px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      {deleting === p.id ? '...' : 'حذف'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
