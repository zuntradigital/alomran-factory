import { useState, useEffect } from 'react'
import { apiGet } from '../lib/api'

const CAT_AR: Record<string, string> = {
  BE:'مقاعد', TA:'طاولات', TB:'حاويات نفايات', PL:'أحواض زهور',
  BO:'بوالرد', CB:'حواجز خرسانية', WS:'مصدات سيارات', SS:'درج السلم', ST:'بلاطات خرسانية',
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'الآن'
  if (m < 60) return `منذ ${m} دقيقة`
  const h = Math.floor(m / 60)
  if (h < 24) return `منذ ${h} ساعة`
  return `منذ ${Math.floor(h / 24)} يوم`
}

export default function OverviewPage() {
  const [products,  setProducts]  = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')

  const load = async () => {
    setLoading(true); setError('')
    try {
      const [p, i] = await Promise.all([apiGet('/products'), apiGet('/inquiries')])
      setProducts(Array.isArray(p) ? p : [])
      setInquiries(Array.isArray(i) ? i : [])
    } catch (err: any) {
      setError(err.message === 'network' ? 'تعذر الاتصال بالخادم — تأكد من تشغيل الخادم' : `خطأ: ${err.message}`)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const today     = new Date().toISOString().slice(0, 10)
  const weekAgo   = new Date(Date.now() - 7 * 86_400_000).toISOString()
  const newInq    = inquiries.filter(i => i.status === 'new').length
  const todayInq  = inquiries.filter(i => i.createdAt?.slice(0, 10) === today).length
  const weekInq   = inquiries.filter(i => (i.createdAt ?? '') > weekAgo).length

  // Products per category
  const catCounts: Record<string, number> = {}
  products.forEach(p => { catCounts[p.category] = (catCounts[p.category] ?? 0) + 1 })
  const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const statusLabel = (s: string) => s === 'new' ? 'جديد' : s === 'completed' ? 'مكتمل' : s === 'replied' ? 'تم الرد' : 'قيد المراجعة'
  const statusBg    = (s: string) => s === 'new' ? '#dcfce7' : s === 'completed' ? '#e0e7ff' : s === 'replied' ? '#d1fae5' : '#fef9c3'
  const statusColor = (s: string) => s === 'new' ? '#166534' : s === 'completed' ? '#3730a3' : s === 'replied' ? '#065f46' : '#854d0e'

  const kpis = [
    { label:'إجمالي المنتجات',     value: products.length,   icon:'📦', color:'#d97706' },
    { label:'إجمالي الاستفسارات', value: inquiries.length,  icon:'💬', color:'#16a34a' },
    { label:'استفسارات جديدة',    value: newInq,            icon:'🔔', color:'#dc2626' },
    { label:'استفسارات اليوم',    value: todayInq,          icon:'📅', color:'#2563eb' },
    { label:'هذا الأسبوع',        value: weekInq,           icon:'📈', color:'#7c3aed' },
  ]

  return (
    <div style={{ fontFamily:"'Cairo',sans-serif" }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:'#1a1a1a', margin:0 }}>لوحة التحكم</h1>
          <p style={{ fontSize:'13px', color:'#888', margin:'4px 0 0' }}>
            {new Date().toLocaleDateString('ar-SA', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </p>
        </div>
        <button onClick={load} style={{ padding:'8px 16px', background:'#f5f5f5', border:'1px solid #e0e0e0', borderRadius:'8px', fontSize:'13px', cursor:'pointer', fontFamily:'inherit' }}>
          ↻ تحديث
        </button>
      </div>

      {error && (
        <div style={{ background:'#fff0f0', border:'1px solid #fca5a5', borderRadius:'8px', padding:'12px 16px', color:'#dc2626', fontSize:'13px', marginBottom:'20px' }}>{error}</div>
      )}

      {/* KPI Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'14px', marginBottom:'24px' }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background:'#fff', borderRadius:'12px', padding:'18px 16px', border:'1px solid #eee' }}>
            <div style={{ fontSize:'22px', marginBottom:'8px' }}>{k.icon}</div>
            <div style={{ fontSize:'1.8rem', fontWeight:900, color:k.color }}>
              {loading ? <div style={{ width:'40px', height:'28px', background:'#e8e8e8', borderRadius:'4px', animation:'skeleton-pulse 1.4s infinite' }} /> : k.value}
            </div>
            <div style={{ fontSize:'12px', color:'#888', marginTop:'4px' }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
        {/* Recent Inquiries */}
        <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', border:'1px solid #eee' }}>
          <div style={{ fontWeight:700, fontSize:'14px', marginBottom:'16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>أحدث الاستفسارات</span>
            {newInq > 0 && <span style={{ background:'#dc2626', color:'#fff', borderRadius:'100px', padding:'2px 10px', fontSize:'11px', fontWeight:700 }}>{newInq} جديد</span>}
          </div>
          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {[1,2,3,4,5].map(i => <div key={i} style={{ height:'44px', background:'#e8e8e8', borderRadius:'6px', animation:'skeleton-pulse 1.4s infinite' }} />)}
            </div>
          ) : inquiries.length === 0 ? (
            <div style={{ textAlign:'center', padding:'32px', color:'#aaa', fontSize:'13px' }}>لا توجد استفسارات بعد</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
              {inquiries.slice(0, 7).map((r, i) => (
                <div key={r.id || i} style={{ padding:'10px 0', borderBottom:'1px solid #f5f5f5', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'10px' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:'13px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.name || '—'}</div>
                    <div style={{ fontSize:'12px', color:'#888', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.message?.slice(0, 40) || '—'}</div>
                  </div>
                  <div style={{ textAlign:'left', flexShrink:0 }}>
                    <span style={{ padding:'2px 8px', borderRadius:'100px', fontSize:'11px', fontWeight:700, background:statusBg(r.status), color:statusColor(r.status) }}>
                      {statusLabel(r.status)}
                    </span>
                    <div style={{ fontSize:'11px', color:'#aaa', marginTop:'3px', direction:'ltr' }}>{timeAgo(r.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Products by Category */}
        <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', border:'1px solid #eee' }}>
          <div style={{ fontWeight:700, fontSize:'14px', marginBottom:'16px' }}>المنتجات حسب الفئة</div>
          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {[1,2,3,4,5].map(i => <div key={i} style={{ height:'32px', background:'#e8e8e8', borderRadius:'6px', animation:'skeleton-pulse 1.4s infinite' }} />)}
            </div>
          ) : topCats.length === 0 ? (
            <div style={{ textAlign:'center', padding:'32px', color:'#aaa', fontSize:'13px' }}>لا توجد منتجات</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {topCats.map(([cat, count]) => {
                const pct = Math.round((count / products.length) * 100)
                return (
                  <div key={cat}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'13px', marginBottom:'5px' }}>
                      <span style={{ fontWeight:600 }}>{CAT_AR[cat] || cat}</span>
                      <span style={{ color:'#888' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height:'6px', background:'#f0f0f0', borderRadius:'3px' }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:'#8B0020', borderRadius:'3px', transition:'width .5s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
