import { useState, useEffect } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '../lib/api'
import { useToast, Skeleton } from '../components/Toast'

const CATEGORIES = [
  { id:'BE', arLabel:'مقاعد',           enLabel:'Benches',            arCat:'مقاعد',            enCat:'Benches'            },
  { id:'TA', arLabel:'طاولات',           enLabel:'Tables',             arCat:'طاولات',            enCat:'Tables'             },
  { id:'TB', arLabel:'حاويات نفايات',   enLabel:'Trash Bins',         arCat:'حاويات نفايات',    enCat:'Trash Bins'         },
  { id:'PL', arLabel:'أحواض زهور',      enLabel:'Planters',           arCat:'أحواض زهور',       enCat:'Planters'           },
  { id:'BO', arLabel:'بوالرد',           enLabel:'Bollards',           arCat:'بوالرد',            enCat:'Bollards'           },
  { id:'CB', arLabel:'حواجز خرسانية',   enLabel:'Concrete Barriers',  arCat:'حواجز خرسانية',   enCat:'Concrete Barriers'  },
  { id:'WS', arLabel:'مصدات سيارات',    enLabel:'Wheel Stoppers',     arCat:'مصدات سيارات',     enCat:'Wheel Stoppers'     },
  { id:'SS', arLabel:'درج السلم',       enLabel:'Stepping Stones',    arCat:'درج السلم',        enCat:'Stepping Stones'    },
  { id:'ST', arLabel:'بلاطات خرسانية', enLabel:'Steps/Slabs',        arCat:'بلاطات خرسانية',  enCat:'Steps/Slabs'        },
]

const PAGE_SIZE = 20
const EMPTY_FORM = { code:'', nameAr:'', nameEn:'', category:'BE', dimensions:'', image:'', active:true }

interface ProductForm { code:string; nameAr:string; nameEn:string; category:string; dimensions:string; image:string; active:boolean }

function ProductModal({ product, onClose, onSaved }: {
  product: any | null   // null = add, object = edit
  onClose: () => void
  onSaved: (p: any, isNew: boolean) => void
}) {
  const toast  = useToast()
  const isEdit = !!product?.id
  const [form, setForm]   = useState<ProductForm>(() => product ? {
    code: product.code ?? '', nameAr: product.nameAr ?? '', nameEn: product.nameEn ?? '',
    category: product.category ?? 'BE', dimensions: product.dimensions ?? '',
    image: product.image ?? '', active: product.active !== false,
  } : { ...EMPTY_FORM })
  const [saving, setSaving]   = useState(false)
  const [errors, setErrors]   = useState<Partial<ProductForm>>({})

  const set = (k: keyof ProductForm, v: string | boolean) => {
    setForm(prev => ({ ...prev, [k]: v }))
    setErrors(prev => ({ ...prev, [k]: '' }))
  }

  const validate = (): boolean => {
    const e: Partial<ProductForm> = {}
    if (!form.code.trim())   e.code   = 'الكود مطلوب'
    if (!form.nameAr.trim()) e.nameAr = 'الاسم العربي مطلوب'
    if (!form.nameEn.trim()) e.nameEn = 'الاسم الإنجليزي مطلوب'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    const cat = CATEGORIES.find(c => c.id === form.category)!
    const payload = {
      code: form.code.trim().toUpperCase(),
      nameAr: form.nameAr.trim(),
      nameEn: form.nameEn.trim(),
      category: form.category,
      categoryAr: cat.arCat,
      categoryEn: cat.enCat,
      dimensions: form.dimensions.trim() || '—',
      image: form.image.trim() || `/products/${form.code.trim()}.png`,
      active: form.active,
    }
    try {
      const result = isEdit
        ? await apiPut(`/products/${product.id}`, payload)
        : await apiPost('/products', payload)
      onSaved({ ...payload, id: isEdit ? product.id : result.id }, !isEdit)
      toast(isEdit ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح')
      onClose()
    } catch (err: any) {
      toast(err.message ?? 'حدث خطأ', 'error')
    }
    setSaving(false)
  }

  const inp: React.CSSProperties = {
    width:'100%', boxSizing:'border-box', padding:'9px 12px',
    border:'1.5px solid #ddd', borderRadius:'8px', fontSize:'14px', outline:'none', fontFamily:'inherit',
  }
  const lbl: React.CSSProperties = { display:'block', fontSize:'12.5px', fontWeight:600, color:'#444', marginBottom:'5px' }
  const errStyle: React.CSSProperties = { color:'#dc2626', fontSize:'12px', marginTop:'3px' }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'#fff', borderRadius:'16px', padding:'32px', width:'100%', maxWidth:'520px', boxShadow:'0 8px 40px rgba(0,0,0,0.18)', maxHeight:'90vh', overflowY:'auto', fontFamily:"'Cairo',sans-serif" }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
          <h2 style={{ fontSize:'1.1rem', fontWeight:800, margin:0 }}>{isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#888', lineHeight:1 }}>×</button>
        </div>
        <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            <div>
              <label style={lbl}>كود المنتج *</label>
              <input type="text" value={form.code} onChange={e=>set('code',e.target.value)} placeholder="BE-01" style={inp} />
              {errors.code && <p style={errStyle}>{errors.code}</p>}
            </div>
            <div>
              <label style={lbl}>الفئة *</label>
              <select value={form.category} onChange={e=>set('category',e.target.value)} style={{ ...inp, cursor:'pointer' }}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.arLabel} ({c.id})</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={lbl}>الاسم (عربي) *</label>
            <input type="text" value={form.nameAr} onChange={e=>set('nameAr',e.target.value)} placeholder="مقعد BE-01" style={inp} />
            {errors.nameAr && <p style={errStyle}>{errors.nameAr}</p>}
          </div>
          <div>
            <label style={lbl}>الاسم (إنجليزي) *</label>
            <input type="text" value={form.nameEn} onChange={e=>set('nameEn',e.target.value)} placeholder="Bench BE-01" style={inp} dir="ltr" />
            {errors.nameEn && <p style={errStyle}>{errors.nameEn}</p>}
          </div>
          <div>
            <label style={lbl}>الأبعاد</label>
            <input type="text" value={form.dimensions} onChange={e=>set('dimensions',e.target.value)} placeholder="L 200 W 50 H 50" style={inp} dir="ltr" />
          </div>
          <div>
            <label style={lbl}>مسار الصورة</label>
            <input type="text" value={form.image} onChange={e=>set('image',e.target.value)} placeholder="/products/BE-01.png" style={inp} dir="ltr" />
          </div>
          <label style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'14px', cursor:'pointer' }}>
            <input type="checkbox" checked={form.active} onChange={e=>set('active',e.target.checked)} style={{ width:'16px', height:'16px' }} />
            نشط (ظاهر في الموقع)
          </label>
          <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
            <button type="submit" disabled={saving} style={{ flex:1, padding:'12px', background:saving?'#aaa':'#8B0020', color:'#fff', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:700, cursor:saving?'not-allowed':'pointer', fontFamily:'inherit' }}>
              {saving ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}
            </button>
            <button type="button" onClick={onClose} style={{ flex:1, padding:'12px', background:'#f5f5f5', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', cursor:'pointer', fontFamily:'inherit' }}>
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const toast = useToast()
  const [products,   setProducts]   = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [search,     setSearch]     = useState('')
  const [catFilter,  setCatFilter]  = useState('all')
  const [page,       setPage]       = useState(1)
  const [modal,      setModal]      = useState<{ type:'add'|'edit'; product?:any } | null>(null)
  const [confirmDel, setConfirmDel] = useState<any | null>(null)
  const [deleting,   setDeleting]   = useState(false)

  const load = async () => {
    setLoading(true); setError('')
    try {
      const data = await apiGet('/products')
      setProducts(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err.message === 'network' ? 'تعذر الاتصال بالخادم' : `خطأ: ${err.message}`)
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  // Filter
  const q = search.toLowerCase()
  const filtered = products.filter(p => {
    const matchCat = catFilter === 'all' || p.category === catFilter
    const matchQ   = !q || [p.code, p.nameAr, p.nameEn, p.category].some(v => v?.toLowerCase().includes(q))
    return matchCat && matchQ
  })

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Reset page when filter changes
  const handleSearch = (v: string) => { setSearch(v); setPage(1) }
  const handleCat    = (v: string) => { setCatFilter(v); setPage(1) }

  // Category counts
  const catCount: Record<string, number> = {}
  products.forEach(p => { catCount[p.category] = (catCount[p.category] ?? 0) + 1 })

  // CRUD handlers
  const handleSaved = (p: any, isNew: boolean) => {
    if (isNew) setProducts(prev => [{ ...p, createdAt: new Date().toISOString() }, ...prev])
    else       setProducts(prev => prev.map(x => x.id === p.id ? { ...x, ...p } : x))
  }

  const handleDelete = async () => {
    if (!confirmDel) return
    setDeleting(true)
    try {
      await apiDelete(`/products/${confirmDel.id}`)
      setProducts(prev => prev.filter(p => p.id !== confirmDel.id))
      toast('تم حذف المنتج بنجاح')
    } catch (err: any) {
      toast(err.message ?? 'فشل الحذف', 'error')
    }
    setDeleting(false)
    setConfirmDel(null)
  }

  const catOptions = [{ id:'all', label:'كل الفئات', count: products.length }, ...CATEGORIES.map(c => ({ id:c.id, label:c.arLabel, count:catCount[c.id]??0 }))]

  return (
    <div style={{ fontFamily:"'Cairo',sans-serif" }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, margin:'0 0 2px' }}>إدارة المنتجات</h1>
          <span style={{ fontSize:'13px', color:'#888' }}>{loading ? '…' : `${products.length} منتج في قاعدة البيانات`}</span>
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={load} style={{ padding:'9px 16px', background:'#f5f5f5', border:'1px solid #e0e0e0', borderRadius:'8px', fontSize:'13px', cursor:'pointer', fontFamily:'inherit' }}>↻ تحديث</button>
          <button onClick={() => setModal({ type:'add' })} style={{ padding:'9px 20px', background:'#8B0020', color:'#fff', border:'none', borderRadius:'8px', fontSize:'13.5px', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>+ إضافة منتج</button>
        </div>
      </div>

      {error && <div style={{ background:'#fff0f0', border:'1px solid #fca5a5', borderRadius:'8px', padding:'12px 16px', color:'#dc2626', fontSize:'13px', marginBottom:'16px' }}>{error}</div>}

      <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', border:'1px solid #eee' }}>
        {/* Filters */}
        <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:1, minWidth:'200px' }}>
            <input type="text" value={search} onChange={e=>handleSearch(e.target.value)} placeholder="بحث بالكود أو الاسم..."
              style={{ width:'100%', boxSizing:'border-box', padding:'9px 36px 9px 12px', border:'1px solid #ddd', borderRadius:'7px', fontSize:'13.5px', fontFamily:'inherit', outline:'none' }} />
            {search && (
              <button onClick={()=>handleSearch('')} style={{ position:'absolute', left:'8px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#aaa', fontSize:'14px', padding:'0' }}>×</button>
            )}
          </div>
          <select value={catFilter} onChange={e=>handleCat(e.target.value)} style={{ padding:'9px 12px', border:'1px solid #ddd', borderRadius:'7px', fontSize:'13.5px', fontFamily:'inherit', outline:'none', cursor:'pointer' }}>
            {catOptions.map(c => <option key={c.id} value={c.id}>{c.label} ({c.count})</option>)}
          </select>
          <span style={{ fontSize:'13px', color:'#888', whiteSpace:'nowrap' }}>
            {loading ? '…' : `${filtered.length} نتيجة`}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {[...Array(8)].map((_,i) => <Skeleton key={i} h="42px" radius="6px" />)}
          </div>
        ) : paged.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:'40px', marginBottom:'12px' }}>📦</div>
            <div style={{ fontSize:'15px', fontWeight:700, color:'#555' }}>{search || catFilter !== 'all' ? 'لا توجد نتائج' : 'لا توجد منتجات بعد'}</div>
            {!search && catFilter === 'all' && (
              <button onClick={() => setModal({ type:'add' })} style={{ marginTop:'16px', padding:'10px 24px', background:'#8B0020', color:'#fff', border:'none', borderRadius:'8px', fontSize:'13px', cursor:'pointer', fontFamily:'inherit', fontWeight:700 }}>+ إضافة أول منتج</button>
            )}
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13.5px' }}>
              <thead>
                <tr style={{ background:'#f8f8f8' }}>
                  {['الكود','الاسم (عربي)','الاسم (إنجليزي)','الفئة','الأبعاد','الحالة','الإجراءات'].map(h => (
                    <th key={h} style={{ padding:'10px 14px', textAlign:'right', fontWeight:700, color:'#666', fontSize:'12px', borderBottom:'1px solid #eee', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((p, i) => (
                  <tr key={p.id || i} style={{ borderBottom:'1px solid #f0f0f0' }}>
                    <td style={{ padding:'11px 14px', fontFamily:'monospace', fontWeight:700, color:'#8B0020', whiteSpace:'nowrap' }}>{p.code || '—'}</td>
                    <td style={{ padding:'11px 14px', fontWeight:600 }}>{p.nameAr || '—'}</td>
                    <td style={{ padding:'11px 14px', color:'#555' }}>{p.nameEn || '—'}</td>
                    <td style={{ padding:'11px 14px' }}>
                      <span style={{ padding:'2px 8px', borderRadius:'100px', fontSize:'11.5px', fontWeight:700, background:'rgba(139,0,32,0.08)', color:'#8B0020' }}>{p.category || '—'}</span>
                    </td>
                    <td style={{ padding:'11px 14px', color:'#888', fontFamily:'monospace', fontSize:'12px', whiteSpace:'nowrap' }}>{p.dimensions || '—'}</td>
                    <td style={{ padding:'11px 14px' }}>
                      <span style={{ padding:'3px 10px', borderRadius:'100px', fontSize:'11.5px', fontWeight:700, background:p.active!==false?'#dcfce7':'#fee2e2', color:p.active!==false?'#166534':'#dc2626' }}>
                        {p.active !== false ? 'نشط' : 'مخفي'}
                      </span>
                    </td>
                    <td style={{ padding:'11px 14px' }}>
                      <div style={{ display:'flex', gap:'6px' }}>
                        <button onClick={() => setModal({ type:'edit', product:p })}
                          style={{ padding:'5px 12px', background:'rgba(139,0,32,0.06)', color:'#8B0020', border:'1px solid rgba(139,0,32,0.15)', borderRadius:'6px', fontSize:'12px', cursor:'pointer', fontWeight:600, fontFamily:'inherit', whiteSpace:'nowrap' }}>
                          ✏️ تعديل
                        </button>
                        <button onClick={() => setConfirmDel(p)}
                          style={{ padding:'5px 12px', background:'rgba(220,38,38,0.06)', color:'#dc2626', border:'1px solid rgba(220,38,38,0.15)', borderRadius:'6px', fontSize:'12px', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>
                          🗑️ حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', marginTop:'20px', flexWrap:'wrap' }}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
              style={{ padding:'7px 14px', background:page===1?'#f0f0f0':'#fff', border:'1px solid #ddd', borderRadius:'7px', cursor:page===1?'not-allowed':'pointer', fontSize:'13px', fontFamily:'inherit', color:page===1?'#bbb':'#333' }}>
              ← السابق
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const pg = totalPages <= 7 ? i+1 : page <= 4 ? i+1 : page+i-3
              if (pg < 1 || pg > totalPages) return null
              return (
                <button key={pg} onClick={() => setPage(pg)}
                  style={{ padding:'7px 12px', background:pg===page?'#8B0020':'#fff', color:pg===page?'#fff':'#333', border:'1px solid',borderColor:pg===page?'#8B0020':'#ddd', borderRadius:'7px', cursor:'pointer', fontSize:'13px', fontFamily:'inherit', fontWeight:pg===page?700:400 }}>
                  {pg}
                </button>
              )
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
              style={{ padding:'7px 14px', background:page===totalPages?'#f0f0f0':'#fff', border:'1px solid #ddd', borderRadius:'7px', cursor:page===totalPages?'not-allowed':'pointer', fontSize:'13px', fontFamily:'inherit', color:page===totalPages?'#bbb':'#333' }}>
              التالي →
            </button>
            <span style={{ fontSize:'12px', color:'#888' }}>صفحة {page} من {totalPages}</span>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <ProductModal product={modal.product ?? null} onClose={() => setModal(null)} onSaved={handleSaved} />
      )}

      {/* Delete Confirmation */}
      {confirmDel && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300 }}>
          <div style={{ background:'#fff', borderRadius:'14px', padding:'28px 32px', maxWidth:'380px', width:'100%', boxShadow:'0 8px 32px rgba(0,0,0,0.15)', fontFamily:"'Cairo',sans-serif", textAlign:'center' }}>
            <div style={{ fontSize:'36px', marginBottom:'12px' }}>🗑️</div>
            <h3 style={{ fontWeight:800, fontSize:'1rem', marginBottom:'8px' }}>حذف المنتج</h3>
            <p style={{ color:'#555', fontSize:'14px', marginBottom:'24px' }}>
              هل أنت متأكد من حذف المنتج <strong style={{ color:'#8B0020' }}>{confirmDel.code}</strong>؟<br/>
              لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
              <button onClick={handleDelete} disabled={deleting}
                style={{ padding:'10px 24px', background:deleting?'#aaa':'#dc2626', color:'#fff', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:700, cursor:deleting?'not-allowed':'pointer', fontFamily:'inherit' }}>
                {deleting ? 'جارٍ الحذف...' : 'نعم، احذف'}
              </button>
              <button onClick={() => setConfirmDel(null)} style={{ padding:'10px 24px', background:'#f5f5f5', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', cursor:'pointer', fontFamily:'inherit' }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
