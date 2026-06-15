import { useState, useEffect } from 'react'
import { apiGet, apiPut, apiDelete } from '../lib/api'
import { useToast, Skeleton } from '../components/Toast'

type SortKey = 'date_desc' | 'date_asc' | 'name' | 'status'

const STATUS_OPTIONS = [
  { value:'new',       label:'جديد',      bg:'#dcfce7', color:'#166534' },
  { value:'in_review', label:'قيد المراجعة', bg:'#fef9c3', color:'#854d0e' },
  { value:'replied',   label:'تم الرد',   bg:'#d1fae5', color:'#065f46' },
  { value:'completed', label:'مكتمل',     bg:'#e0e7ff', color:'#3730a3' },
]

function getStatusStyle(s: string) {
  return STATUS_OPTIONS.find(o => o.value === s) ?? { bg:'#f0f0f0', color:'#888', label:s }
}

function InquiryModal({ inquiry, onClose, onStatusChange }: {
  inquiry: any; onClose: () => void; onStatusChange: (id: string, status: string) => void
}) {
  const toast = useToast()
  const [status, setStatus] = useState(inquiry.status ?? 'new')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await apiPut(`/inquiries/${inquiry.id}`, { status })
      onStatusChange(inquiry.id, status)
      toast('تم تحديث الحالة')
    } catch (err: any) { toast(err.message ?? 'خطأ', 'error') }
    setSaving(false)
  }

  const st = getStatusStyle(inquiry.status)

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300 }} onClick={e => e.target===e.currentTarget&&onClose()}>
      <div style={{ background:'#fff', borderRadius:'16px', padding:'32px', width:'100%', maxWidth:'540px', boxShadow:'0 8px 40px rgba(0,0,0,0.18)', maxHeight:'90vh', overflowY:'auto', fontFamily:"'Cairo',sans-serif" }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'20px' }}>
          <h2 style={{ fontSize:'1.1rem', fontWeight:800, margin:0 }}>تفاصيل الاستفسار</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#888' }}>×</button>
        </div>

        {/* Status Badge */}
        <span style={{ padding:'4px 12px', borderRadius:'100px', fontSize:'12px', fontWeight:700, background:st.bg, color:st.color }}>
          {st.label}
        </span>

        <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginTop:'20px' }}>
          {[
            { label:'الاسم',               value: inquiry.name },
            { label:'البريد الإلكتروني',   value: inquiry.email, dir:'ltr' },
            { label:'الهاتف',              value: inquiry.phone || '—', dir:'ltr' },
            { label:'نوع المنتج المطلوب', value: inquiry.product || '—' },
            { label:'المصدر',              value: inquiry.source || '—' },
            { label:'التاريخ',             value: inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString('ar-SA') : '—' },
          ].map(({ label, value, dir }) => (
            <div key={label} style={{ display:'flex', gap:'12px', fontSize:'13.5px' }}>
              <span style={{ color:'#888', minWidth:'140px', flexShrink:0 }}>{label}:</span>
              <span style={{ fontWeight:600 }} dir={dir as any}>{value}</span>
            </div>
          ))}
          <div>
            <div style={{ color:'#888', fontSize:'13.5px', marginBottom:'8px' }}>الرسالة:</div>
            <div style={{ background:'#f8f8f8', borderRadius:'8px', padding:'12px 14px', fontSize:'13.5px', lineHeight:1.7, color:'#333' }}>{inquiry.message || '—'}</div>
          </div>
        </div>

        {/* Status Changer + Actions */}
        <div style={{ borderTop:'1px solid #f0f0f0', paddingTop:'20px', marginTop:'20px', display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap' }}>
          <select value={status} onChange={e=>setStatus(e.target.value)}
            style={{ flex:1, padding:'9px 12px', border:'1.5px solid #ddd', borderRadius:'8px', fontSize:'13px', fontFamily:'inherit', cursor:'pointer', outline:'none' }}>
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={save} disabled={saving || status===inquiry.status}
            style={{ padding:'9px 20px', background:saving||status===inquiry.status?'#aaa':'#8B0020', color:'#fff', border:'none', borderRadius:'8px', fontSize:'13px', fontWeight:700, cursor:saving||status===inquiry.status?'not-allowed':'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>
            {saving?'جارٍ...':'حفظ الحالة'}
          </button>
          <a href={`mailto:${inquiry.email}?subject=Re: استفسارك إلى مصنع العمران`}
            style={{ padding:'9px 16px', background:'#2563eb', color:'#fff', borderRadius:'8px', fontSize:'13px', fontWeight:700, textDecoration:'none', whiteSpace:'nowrap' }}>
            ✉ رد بالبريد
          </a>
        </div>
      </div>
    </div>
  )
}

export default function InquiriesPage() {
  const toast = useToast()
  const [inquiries,  setInquiries]  = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [search,     setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort,       setSort]       = useState<SortKey>('date_desc')
  const [modal,      setModal]      = useState<any | null>(null)
  const [confirmDel, setConfirmDel] = useState<any | null>(null)
  const [deleting,   setDeleting]   = useState(false)

  const load = async (silent = false) => {
    if (!silent) { setLoading(true); setError('') }
    try {
      const data = await apiGet('/inquiries')
      setInquiries(Array.isArray(data) ? data : [])
    } catch (err: any) {
      if (!silent) setError(err.message === 'network' ? 'تعذر الاتصال بالخادم' : `خطأ: ${err.message}`)
    } finally { if (!silent) setLoading(false) }
  }

  useEffect(() => {
    load()
    const timer = setInterval(() => load(true), 30_000)
    return () => clearInterval(timer)
  }, [])

  // Filter + Sort
  const q = search.toLowerCase()
  let visible = inquiries.filter(r => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchSearch = !q || [r.name, r.email, r.phone, r.message, r.product].some(v => v?.toLowerCase().includes(q))
    return matchStatus && matchSearch
  })

  if (sort === 'date_asc')  visible = [...visible].sort((a,b) => (a.createdAt??'').localeCompare(b.createdAt??''))
  if (sort === 'date_desc') visible = [...visible].sort((a,b) => (b.createdAt??'').localeCompare(a.createdAt??''))
  if (sort === 'name')      visible = [...visible].sort((a,b) => (a.name??'').localeCompare(b.name??''))
  if (sort === 'status')    visible = [...visible].sort((a,b) => (a.status??'').localeCompare(b.status??''))

  const handleStatusChange = (id: string, status: string) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  const handleDelete = async () => {
    if (!confirmDel) return
    setDeleting(true)
    try {
      await apiDelete(`/inquiries/${confirmDel.id}`)
      setInquiries(prev => prev.filter(i => i.id !== confirmDel.id))
      toast('تم حذف الاستفسار')
    } catch (err: any) { toast(err.message ?? 'فشل الحذف', 'error') }
    setDeleting(false); setConfirmDel(null)
  }

  const quickStatus = async (id: string, status: string) => {
    try {
      await apiPut(`/inquiries/${id}`, { status })
      handleStatusChange(id, status)
    } catch { /* silent */ }
  }

  const newCount = inquiries.filter(i => i.status === 'new').length

  return (
    <div style={{ fontFamily:"'Cairo',sans-serif" }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, margin:0 }}>الاستفسارات وطلبات العروض</h1>
          {newCount > 0 && <span style={{ background:'#dc2626', color:'#fff', borderRadius:'100px', padding:'3px 12px', fontSize:'12px', fontWeight:700 }}>{newCount} جديد</span>}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ fontSize:'12px', color:'#aaa' }}>يتحدث كل 30 ث</span>
          <button onClick={() => load()} style={{ padding:'8px 14px', background:'#f5f5f5', border:'1px solid #e0e0e0', borderRadius:'7px', fontSize:'13px', cursor:'pointer', fontFamily:'inherit' }}>↻ تحديث</button>
        </div>
      </div>

      {error && <div style={{ background:'#fff0f0', border:'1px solid #fca5a5', borderRadius:'8px', padding:'12px', color:'#dc2626', fontSize:'13px', marginBottom:'16px' }}>{error}</div>}

      {/* Summary Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'20px' }}>
        {[
          ['إجمالي الاستفسارات', inquiries.length,                                        '#8B0020'],
          ['جديدة',             inquiries.filter(i=>i.status==='new').length,              '#dc2626'],
          ['قيد المراجعة',     inquiries.filter(i=>i.status==='in_review').length,         '#d97706'],
          ['مكتملة',           inquiries.filter(i=>i.status==='completed'||i.status==='replied').length,'#16a34a'],
        ].map(([l,v,c]) => (
          <div key={l as string} style={{ background:'#fff', borderRadius:'12px', padding:'16px', border:'1px solid #eee' }}>
            <div style={{ fontSize:'12px', color:'#888', marginBottom:'6px' }}>{l}</div>
            <div style={{ fontSize:'1.8rem', fontWeight:900, color:c as string }}>{loading ? '…' : v}</div>
          </div>
        ))}
      </div>

      <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', border:'1px solid #eee' }}>
        {/* Filters */}
        <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:1, minWidth:'200px' }}>
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث بالاسم أو البريد أو الرسالة..."
              style={{ width:'100%', boxSizing:'border-box', padding:'9px 36px 9px 12px', border:'1px solid #ddd', borderRadius:'7px', fontSize:'13px', fontFamily:'inherit', outline:'none' }} />
            {search && <button onClick={()=>setSearch('')} style={{ position:'absolute', left:'8px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#aaa', fontSize:'14px' }}>×</button>}
          </div>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{ padding:'9px 12px', border:'1px solid #ddd', borderRadius:'7px', fontSize:'13px', fontFamily:'inherit', cursor:'pointer', outline:'none' }}>
            <option value="all">كل الحالات</option>
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={sort} onChange={e=>setSort(e.target.value as SortKey)} style={{ padding:'9px 12px', border:'1px solid #ddd', borderRadius:'7px', fontSize:'13px', fontFamily:'inherit', cursor:'pointer', outline:'none' }}>
            <option value="date_desc">الأحدث أولاً</option>
            <option value="date_asc">الأقدم أولاً</option>
            <option value="name">الاسم</option>
            <option value="status">الحالة</option>
          </select>
          <span style={{ fontSize:'13px', color:'#888', whiteSpace:'nowrap' }}>{loading ? '…' : `${visible.length} نتيجة`}</span>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {[...Array(6)].map((_,i) => <Skeleton key={i} h="44px" radius="6px" />)}
          </div>
        ) : visible.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:'40px', marginBottom:'12px' }}>💬</div>
            <div style={{ fontSize:'15px', fontWeight:700, color:'#555' }}>{search || statusFilter !== 'all' ? 'لا توجد نتائج' : 'لا توجد استفسارات بعد'}</div>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
              <thead>
                <tr style={{ background:'#f8f8f8' }}>
                  {['الاسم','البريد الإلكتروني','الهاتف','المنتج','التاريخ','الحالة','الإجراءات'].map(h => (
                    <th key={h} style={{ padding:'10px 12px', textAlign:'right', fontWeight:700, color:'#666', fontSize:'12px', borderBottom:'1px solid #eee', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((r, i) => {
                  const st = getStatusStyle(r.status)
                  return (
                    <tr key={r.id || i} onClick={() => setModal(r)} style={{ borderBottom:'1px solid #f5f5f5', cursor:'pointer', background:r.status==='new'?'#fffbf0':'#fff' }}
                      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=r.status==='new'?'#fef3c7':'#f8f8f8'}
                      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=r.status==='new'?'#fffbf0':'#fff'}>
                      <td style={{ padding:'10px 12px', fontWeight:600 }}>{r.name || '—'}</td>
                      <td style={{ padding:'10px 12px', color:'#666', fontSize:'12.5px', direction:'ltr' }}>{r.email || '—'}</td>
                      <td style={{ padding:'10px 12px', color:'#888', fontFamily:'monospace', fontSize:'12.5px', direction:'ltr' }}>{r.phone || '—'}</td>
                      <td style={{ padding:'10px 12px', color:'#555', maxWidth:'120px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.product || '—'}</td>
                      <td style={{ padding:'10px 12px', color:'#888', fontSize:'12px', whiteSpace:'nowrap' }}>
                        {r.createdAt ? new Date(r.createdAt).toLocaleString('ar-SA',{dateStyle:'short',timeStyle:'short'}) : '—'}
                      </td>
                      <td style={{ padding:'10px 12px' }}>
                        <span style={{ padding:'3px 10px', borderRadius:'100px', fontSize:'11.5px', fontWeight:700, background:st.bg, color:st.color, whiteSpace:'nowrap' }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding:'10px 12px' }} onClick={e=>e.stopPropagation()}>
                        <div style={{ display:'flex', gap:'5px', flexWrap:'nowrap' }}>
                          <a href={`mailto:${r.email}?subject=Re: استفسارك إلى مصنع العمران`}
                            style={{ padding:'4px 10px', background:'rgba(37,99,235,0.08)', color:'#2563eb', borderRadius:'5px', fontSize:'11.5px', textDecoration:'none', fontWeight:600, whiteSpace:'nowrap' }}>
                            ✉ رد
                          </a>
                          {r.status !== 'replied' && (
                            <button onClick={() => quickStatus(r.id, 'replied')}
                              style={{ padding:'4px 8px', background:'rgba(5,150,105,0.08)', color:'#065f46', border:'none', borderRadius:'5px', fontSize:'11.5px', cursor:'pointer', fontWeight:600, fontFamily:'inherit', whiteSpace:'nowrap' }}>
                              ✓ رد
                            </button>
                          )}
                          <button onClick={() => setConfirmDel(r)}
                            style={{ padding:'4px 8px', background:'rgba(220,38,38,0.06)', color:'#dc2626', border:'none', borderRadius:'5px', fontSize:'11.5px', cursor:'pointer', fontFamily:'inherit' }}>
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {modal && <InquiryModal inquiry={modal} onClose={() => setModal(null)} onStatusChange={handleStatusChange} />}

      {/* Delete Confirm */}
      {confirmDel && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300 }}>
          <div style={{ background:'#fff', borderRadius:'14px', padding:'28px 32px', maxWidth:'360px', width:'100%', boxShadow:'0 8px 32px rgba(0,0,0,0.15)', fontFamily:"'Cairo',sans-serif", textAlign:'center' }}>
            <div style={{ fontSize:'36px', marginBottom:'10px' }}>🗑️</div>
            <h3 style={{ fontWeight:800, marginBottom:'8px' }}>حذف الاستفسار</h3>
            <p style={{ color:'#555', fontSize:'14px', marginBottom:'20px' }}>هل تريد حذف استفسار <strong>{confirmDel.name}</strong>؟</p>
            <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
              <button onClick={handleDelete} disabled={deleting}
                style={{ padding:'10px 24px', background:deleting?'#aaa':'#dc2626', color:'#fff', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:700, cursor:deleting?'not-allowed':'pointer', fontFamily:'inherit' }}>
                {deleting ? 'جارٍ...' : 'حذف'}
              </button>
              <button onClick={() => setConfirmDel(null)} style={{ padding:'10px 24px', background:'#f5f5f5', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', cursor:'pointer', fontFamily:'inherit' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
