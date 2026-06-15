import { useState, useEffect } from 'react'
import { productsAPI, inquiriesAPI } from '../../utils/api'

export default function AdminOverview() {
  const [products, setProducts] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    Promise.all([productsAPI.getAll(), inquiriesAPI.getAll()]).then(([p, i]) => {
      setProducts(Array.isArray(p) ? p : [])
      setInquiries(Array.isArray(i) ? i : [])
      setLoading(false)
    }).catch(() => { setError('تعذر الاتصال بالخادم'); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const newCount       = inquiries.filter(i => i.status === 'new').length
  const today          = new Date().toISOString().slice(0, 10)
  const todayCount     = inquiries.filter(i => i.createdAt?.slice(0, 10) === today).length
  const recentInquiries = inquiries.slice(0, 5)

  const statusLabel = (s: string) => s === 'new' ? 'جديد' : s === 'completed' ? 'مكتمل' : 'قيد المراجعة'
  const statusStyle = (s: string): React.CSSProperties => ({
    padding: '3px 10px', borderRadius: '100px', fontSize: '11.5px', fontWeight: 700,
    background: s === 'new' ? '#dcfce7' : s === 'completed' ? '#e0e7ff' : '#fef9c3',
    color:      s === 'new' ? '#166534' : s === 'completed' ? '#3730a3' : '#854d0e',
  })

  const kpis = [
    { label: 'إجمالي المنتجات',     value: loading ? '…' : String(products.length),  color: '#d97706', icon: '📦' },
    { label: 'إجمالي الاستفسارات', value: loading ? '…' : String(inquiries.length),  color: '#16a34a', icon: '💬' },
    { label: 'استفسارات جديدة',    value: loading ? '…' : String(newCount),          color: '#8B0020', icon: '🔔' },
    { label: 'اليوم',              value: loading ? '…' : String(todayCount),         color: '#2563eb', icon: '📅' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>لوحة التحكم</h1>
        <button onClick={load} style={{ padding: '8px 14px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '7px', fontSize: '13px', cursor: 'pointer' }}>↻ تحديث</button>
      </div>

      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', color: '#dc2626', fontSize: '13px', marginBottom: '20px' }}>{error}</div>
      )}

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{k.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1a1a1a' }}>{k.value}</div>
            </div>
            <div style={{ fontSize: '24px' }}>{k.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Inquiries */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #eee' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>أحدث الاستفسارات</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#888' }}>جارٍ التحميل…</div>
        ) : recentInquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#aaa', fontSize: '14px' }}>لا توجد استفسارات بعد</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: '#f8f8f8' }}>
                {['العميل', 'البريد', 'المنتج', 'التاريخ', 'الحالة'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#666', fontSize: '12px', borderBottom: '1px solid #eee' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentInquiries.map((r, i) => (
                <tr key={r.id || i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{r.name || '—'}</td>
                  <td style={{ padding: '10px 12px', color: '#666', fontSize: '12.5px' }}>{r.email || '—'}</td>
                  <td style={{ padding: '10px 12px', color: '#555' }}>{r.product || '—'}</td>
                  <td style={{ padding: '10px 12px', color: '#888', fontSize: '12px' }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('ar-SA') : '—'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={statusStyle(r.status)}>{statusLabel(r.status)}</span>
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
