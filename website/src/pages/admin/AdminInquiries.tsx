import { useState, useEffect } from 'react'
import { inquiriesAPI } from '../../utils/api'

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = (silent = false) => {
    if (!silent) { setLoading(true); setError('') }
    inquiriesAPI.getAll()
      .then(data => { setInquiries(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => { if (!silent) { setError('تعذر الاتصال بالخادم'); setLoading(false) } })
  }

  useEffect(() => {
    load()
    const timer = setInterval(() => load(true), 30000)
    return () => clearInterval(timer)
  }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      await inquiriesAPI.updateStatus(id, status)
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    } catch { /* silent */ }
  }

  const statusLabel  = (s: string) => s === 'new' ? 'جديد' : s === 'completed' ? 'مكتمل' : 'قيد المراجعة'
  const statusBg     = (s: string) => s === 'new' ? '#dcfce7' : s === 'completed' ? '#e0e7ff' : '#fef9c3'
  const statusColor  = (s: string) => s === 'new' ? '#166534' : s === 'completed' ? '#3730a3' : '#854d0e'

  const newCount       = inquiries.filter(i => i.status === 'new').length
  const completedCount = inquiries.filter(i => i.status === 'completed').length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>الاستفسارات وطلبات العروض</h1>
          {newCount > 0 && (
            <span style={{ background: '#dc2626', color: '#fff', borderRadius: '100px', padding: '2px 10px', fontSize: '12px', fontWeight: 700 }}>
              {newCount} جديد
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11.5px', color: '#aaa' }}>يتحدث كل 30 ث</span>
          <button onClick={() => load()} style={{ padding: '8px 14px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '7px', fontSize: '13px', cursor: 'pointer' }}>↻ تحديث</button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', color: '#dc2626', fontSize: '13px', marginBottom: '16px' }}>{error}</div>
      )}

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '20px' }}>
        {([
          ['إجمالي الاستفسارات', inquiries.length, '#8B0020'],
          ['بانتظار الرد',       newCount,          '#d97706'],
          ['مكتملة',            completedCount,     '#16a34a'],
        ] as [string, number, string][]).map(([l, v, c]) => (
          <div key={l} style={{ background: '#fff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #eee' }}>
            <div style={{ fontSize: '12.5px', color: '#888', marginBottom: '6px' }}>{l}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: c }}>{loading ? '…' : v}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #eee' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>جارٍ التحميل…</div>
        ) : inquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#aaa', fontSize: '14px' }}>لا توجد استفسارات بعد</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8f8f8' }}>
                {['الاسم', 'البريد', 'الهاتف', 'المنتج', 'التاريخ', 'الحالة', 'الإجراءات'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#666', fontSize: '12px', borderBottom: '1px solid #eee' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inquiries.map((r, i) => (
                <>
                  <tr
                    key={r.id || i}
                    style={{ borderBottom: expanded === r.id ? 'none' : '1px solid #f5f5f5', background: r.status === 'new' ? '#fffbf0' : '#fff', cursor: 'pointer' }}
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  >
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{r.name || '—'}</td>
                    <td style={{ padding: '10px 12px', color: '#666', fontSize: '12.5px' }}>{r.email || '—'}</td>
                    <td style={{ padding: '10px 12px', color: '#888', fontFamily: 'monospace', fontSize: '12px' }}>{r.phone || '—'}</td>
                    <td style={{ padding: '10px 12px', color: '#555' }}>{r.product || '—'}</td>
                    <td style={{ padding: '10px 12px', color: '#888', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {r.createdAt ? new Date(r.createdAt).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11.5px', fontWeight: 700, background: statusBg(r.status), color: statusColor(r.status) }}>
                        {statusLabel(r.status)}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                        {r.status !== 'in_review' && (
                          <button onClick={() => updateStatus(r.id, 'in_review')}
                            style={{ fontSize: '11.5px', color: '#854d0e', background: '#fef9c3', border: 'none', borderRadius: '5px', padding: '3px 8px', cursor: 'pointer', fontWeight: 600 }}>
                            مراجعة
                          </button>
                        )}
                        {r.status !== 'completed' && (
                          <button onClick={() => updateStatus(r.id, 'completed')}
                            style={{ fontSize: '11.5px', color: '#166534', background: '#dcfce7', border: 'none', borderRadius: '5px', padding: '3px 8px', cursor: 'pointer', fontWeight: 600 }}>
                            مكتمل
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expanded === r.id && (
                    <tr key={`${r.id}-exp`} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td colSpan={7} style={{ padding: '12px 14px 16px', background: '#fafafa', fontSize: '13px', color: '#333', lineHeight: 1.7 }}>
                        <strong style={{ color: '#8B0020' }}>الرسالة: </strong>{r.message || '—'}
                        {r.source && <span style={{ marginRight: '16px', fontSize: '11px', color: '#aaa' }}>المصدر: {r.source}</span>}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
