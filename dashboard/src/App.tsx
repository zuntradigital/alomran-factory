import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import logoImg from './assets/logo.png'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ProfileSettings from './pages/ProfileSettings'
import { apiGet, apiPost, apiPut, apiDelete } from './lib/api'
import { ToastProvider, useToast } from './components/Toast'
import OverviewPage  from './pages/OverviewPage'
import ProductsPage  from './pages/ProductsPage'
import InquiriesPage from './pages/InquiriesPage'
import AnalyticsPage from './pages/AnalyticsPage'

// ── LOGIN PAGE ────────────────────────────────────────────────
const LOGIN_PROGRESS = [
  { after: 0,    msg: 'جارٍ التحقق...'                    },
  { after: 3000, msg: 'جارٍ الاتصال بالخادم...'           },
  { after: 5000, msg: 'تقريباً...'                          },
  { after: 9000, msg: 'الاتصال بطيء، يُرجى الانتظار…'    },
] as const

function LoginPage() {
  const { user, loading, signIn, signInGoogle, resetPassword } = useAuth()
  const navigate = useNavigate()

  const [email,      setEmail]      = useState('')
  const [pass,       setPass]       = useState('')
  const [err,        setErr]        = useState('')
  const [info,       setInfo]       = useState('')
  const [busy,       setBusy]       = useState(false)
  const [progMsg,    setProgMsg]    = useState(LOGIN_PROGRESS[0].msg)
  const [showReset,  setShowReset]  = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  if (loading) return null
  if (user)    return <Navigate to="/" replace />

  const startProgress = () => {
    setProgMsg(LOGIN_PROGRESS[0].msg)
    const timers = LOGIN_PROGRESS.slice(1).map(({ after, msg }) => setTimeout(() => setProgMsg(msg), after))
    return () => timers.forEach(clearTimeout)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true)
    const clearProgress = startProgress()
    try {
      await signIn(email, pass)
      navigate('/')
    } catch (err: any) {
      const code = err.code ?? ''
      if (err.message === 'Connection timeout') setErr('انتهت مهلة الاتصال. تحقق من الإنترنت وحاول مرة أخرى.')
      else if (code.includes('wrong-password') || code.includes('invalid-credential') || code.includes('user-not-found')) setErr('بريد إلكتروني أو كلمة مرور غير صحيحة')
      else if (code.includes('too-many-requests')) setErr('تم تجاوز عدد المحاولات. حاول لاحقاً.')
      else setErr(err.message ?? 'حدث خطأ في تسجيل الدخول')
    }
    clearProgress(); setBusy(false); setProgMsg(LOGIN_PROGRESS[0].msg)
  }

  const handleGoogle = async () => {
    setErr(''); setBusy(true)
    const clearProgress = startProgress()
    try { await signInGoogle(); navigate('/') }
    catch (err: any) { setErr(err.message ?? 'فشل تسجيل الدخول بـ Google') }
    clearProgress(); setBusy(false); setProgMsg(LOGIN_PROGRESS[0].msg)
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true)
    try { await resetPassword(resetEmail); setInfo('تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني'); setShowReset(false) }
    catch { setErr('تعذر إرسال البريد. تحقق من العنوان.') }
    setBusy(false)
  }

  const inp: React.CSSProperties = { width:'100%', boxSizing:'border-box', padding:'11px 14px', border:'1.5px solid #ddd', borderRadius:'8px', fontSize:'14px', outline:'none', fontFamily:'inherit' }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#f5f5f5,#ebebeb)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Cairo',sans-serif"}}>
      <div style={{background:'#fff',borderRadius:'20px',padding:'44px',width:'100%',maxWidth:'420px',boxShadow:'0 8px 48px rgba(0,0,0,0.12)'}}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <img src={logoImg} alt="Al Omran Logo" style={{height:'54px',width:'auto',objectFit:'contain',margin:'0 auto 14px',display:'block'}} />
          <h1 style={{fontSize:'1.3rem',fontWeight:800,color:'#1a1a1a',marginBottom:'4px'}}>لوحة التحكم</h1>
          <p style={{fontSize:'13px',color:'#888',margin:0}}>Al Omran Admin Dashboard</p>
        </div>
        {info && <div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:'8px',padding:'10px 14px',color:'#166534',fontSize:'13px',marginBottom:'16px',textAlign:'center'}}>{info}</div>}
        {showReset ? (
          <form onSubmit={handleReset} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <p style={{fontSize:'13px',color:'#555',margin:0,lineHeight:1.6}}>أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.</p>
            <input type="email" value={resetEmail} onChange={e=>setResetEmail(e.target.value)} placeholder="email@example.com" style={inp} required dir="ltr" />
            {err && <p style={{color:'#dc2626',fontSize:'13px',margin:0,textAlign:'center',fontWeight:600}}>{err}</p>}
            <button type="submit" disabled={busy} style={{padding:'12px',background:busy?'#aaa':'#8B0020',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:700,cursor:busy?'not-allowed':'pointer',fontFamily:'inherit'}}>{busy?'جارٍ الإرسال...':'إرسال رابط إعادة التعيين'}</button>
            <button type="button" onClick={()=>{setShowReset(false);setErr('')}} style={{padding:'10px',background:'transparent',border:'none',color:'#8B0020',fontSize:'13px',cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>← العودة لتسجيل الدخول</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div>
              <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#444',marginBottom:'5px'}}>البريد الإلكتروني</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@alomranprecast.com" style={inp} required dir="ltr" />
            </div>
            <div>
              <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#444',marginBottom:'5px'}}>كلمة المرور</label>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" style={inp} required />
            </div>
            {err && <p style={{color:'#dc2626',fontSize:'13px',textAlign:'center',fontWeight:600,margin:0}}>{err}</p>}
            <button type="submit" disabled={busy} style={{padding:'13px',background:busy?'#aaa':'#8B0020',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:700,cursor:busy?'not-allowed':'pointer',fontFamily:'inherit',marginTop:'4px'}}>
              {busy ? progMsg : 'دخول | Login'}
            </button>
            <div style={{display:'flex',alignItems:'center',gap:'12px',margin:'4px 0'}}>
              <div style={{flex:1,height:'1px',background:'#eee'}} /><span style={{fontSize:'12px',color:'#aaa'}}>أو</span><div style={{flex:1,height:'1px',background:'#eee'}} />
            </div>
            <button type="button" onClick={handleGoogle} disabled={busy}
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',padding:'12px',background:'#fff',border:'1.5px solid #ddd',borderRadius:'8px',fontSize:'14px',cursor:busy?'not-allowed':'pointer',fontFamily:'inherit',fontWeight:600,color:'#333'}}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.6 6.7 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.1 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.6 6.7 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5.1l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H5.9C9.4 37.1 16.1 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4-3.9 5.3l.1-.1 6.2 5.2C37 40 44 35 44 24c0-1.3-.1-2.7-.4-3.9z"/>
              </svg>
              تسجيل الدخول بـ Google
            </button>
            <button type="button" onClick={()=>{setShowReset(true);setErr('')}} style={{background:'none',border:'none',color:'#8B0020',fontSize:'12.5px',cursor:'pointer',textAlign:'center',fontFamily:'inherit',padding:'4px'}}>نسيت كلمة المرور؟</button>
          </form>
        )}
      </div>
    </div>
  )
}

// ── SIDEBAR ───────────────────────────────────────────────────
function Sidebar({ active, setActive, newInquiries, sidebarOpen, setSidebarOpen }: { active: string; setActive: (s:string)=>void; newInquiries: number; sidebarOpen: boolean; setSidebarOpen: (v:boolean)=>void }) {
  const { user, signOut } = useAuth()
  const ROLE_LABELS: Record<string,string> = { admin:'مدير', editor:'محرر', viewer:'مشاهد' }

  const mainNav = [
    { id:'overview',  icon:'⊞', label:'نظرة عامة' },
    { id:'products',  icon:'◈', label:'المنتجات'   },
    { id:'inquiries', icon:'✉', label:'الاستفسارات', badge: newInquiries },
    { id:'analytics', icon:'▦', label:'التحليلات'  },
  ]
  const adminNav = [
    { id:'users',    icon:'👥', label:'المستخدمون'     },
    { id:'settings', icon:'⚙', label:'إعدادات الشركة' },
  ]
  const profileNav = [{ id:'profile', icon:'👤', label:'الملف الشخصي' }]

  const NavBtn = ({ item }: { item: { id:string; icon:string; label:string; badge?: number }}) => (
    <button onClick={()=>setActive(item.id)}
      style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',borderRadius:'8px',border:'none',background:active===item.id?'rgba(139,0,32,0.08)':'transparent',color:active===item.id?'#8B0020':'#374151',fontWeight:active===item.id?600:500,fontSize:'14px',cursor:'pointer',textAlign:'right',fontFamily:'inherit',transition:'background .15s',width:'100%'}}>
      <span style={{fontSize:'15px'}}>{item.icon}</span>
      <span style={{flex:1}}>{item.label}</span>
      {!!item.badge && <span style={{background:'#dc2626',color:'#fff',borderRadius:'100px',padding:'1px 7px',fontSize:'11px',fontWeight:700,minWidth:'20px',textAlign:'center'}}>{item.badge}</span>}
    </button>
  )

  return (
    <aside className={`dash-sidebar${sidebarOpen ? ' open' : ''}`} style={{width:'240px',background:'#fff',borderLeft:'1px solid #eee',position:'fixed',top:0,right:0,bottom:0,display:'flex',flexDirection:'column',zIndex:120,fontFamily:"'Cairo',sans-serif",transition:'transform 0.25s ease'}}>
      <div style={{padding:'16px',borderBottom:'1px solid #eee',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <img src={logoImg} alt="Al Omran Logo" style={{height:'40px',width:'auto',objectFit:'contain'}} />
          <div style={{lineHeight:'1.25'}}>
            <span style={{display:'block',fontSize:'12.5px',fontWeight:700,color:'#1a1a1a'}}>مصنع العمران</span>
            <span style={{display:'block',fontSize:'10px',color:'#8B0020'}}>لوحة التحكم</span>
          </div>
        </div>
        <button className="dash-sidebar-close" onClick={()=>setSidebarOpen(false)} aria-label="إغلاق القائمة" style={{display:'none',background:'none',border:'none',cursor:'pointer',fontSize:'18px',color:'#666',padding:'4px',lineHeight:1}}>✕</button>
      </div>
      <nav style={{flex:1,padding:'10px 8px',display:'flex',flexDirection:'column',gap:'2px',overflowY:'auto'}}>
        <p style={{fontSize:'10px',fontWeight:700,color:'#aaa',textTransform:'uppercase',letterSpacing:'.07em',padding:'4px 10px 6px',margin:0}}>الرئيسية</p>
        {mainNav.map(i=><NavBtn key={i.id} item={i}/>)}
        {user?.role === 'admin' && <>
          <p style={{fontSize:'10px',fontWeight:700,color:'#aaa',textTransform:'uppercase',letterSpacing:'.07em',padding:'12px 10px 4px',margin:0}}>الإدارة</p>
          {adminNav.map(i=><NavBtn key={i.id} item={i}/>)}
        </>}
        <p style={{fontSize:'10px',fontWeight:700,color:'#aaa',textTransform:'uppercase',letterSpacing:'.07em',padding:'12px 10px 4px',margin:0}}>الحساب</p>
        {profileNav.map(i=><NavBtn key={i.id} item={i}/>)}
      </nav>
      <div style={{padding:'10px 8px',borderTop:'1px solid #eee'}}>
        {user && (
          <div style={{padding:'8px 12px',marginBottom:'4px',borderRadius:'8px',background:'#f8f8f8'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#1a1a1a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.displayName ?? user.email}</div>
            <div style={{fontSize:'11px',color:'#8B0020',marginTop:'2px'}}>{ROLE_LABELS[user.role] ?? user.role}</div>
          </div>
        )}
        <button onClick={() => window.open('http://localhost:5173','_blank')} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 12px',borderRadius:'8px',border:'none',background:'transparent',color:'#374151',fontSize:'13px',cursor:'pointer',width:'100%',textAlign:'right',fontFamily:'inherit'}}>
          <span>🌐</span><span>العودة للموقع</span>
        </button>
        <button onClick={()=>signOut()} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 12px',borderRadius:'8px',border:'none',background:'transparent',color:'#dc2626',fontSize:'13px',cursor:'pointer',width:'100%',textAlign:'right',fontFamily:'inherit'}}>
          <span>→</span><span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
}

// ── USERS PAGE ────────────────────────────────────────────────
function UsersPage() {
  const toast = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ email:'', password:'', displayName:'', role:'editor' })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const d = await apiGet('/users')
      setUsers(Array.isArray(d) ? d : [])
    } catch (err: any) {
      setError(err.message === 'network' ? 'تعذر الاتصال بالخادم' : `خطأ: ${err.message}`)
    } finally { setLoading(false) }
  }
  useEffect(()=>{load()},[])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setFormError(''); setSaving(true)
    try {
      const d = await apiPost('/users', form)
      setUsers(prev=>[d,...prev]); setShowAdd(false); setForm({email:'',password:'',displayName:'',role:'editor'})
      toast('تم إضافة المستخدم بنجاح')
    } catch (err: any) { setFormError(err.message ?? 'حدث خطأ') }
    setSaving(false)
  }
  const toggleActive = async (u: any) => {
    try { await apiPut(`/users/${u.id}`, { active: !u.active }); setUsers(prev=>prev.map(x=>x.id===u.id?{...x,active:!u.active}:x)) } catch { /* silent */ }
  }
  const del = async (id:string, email:string) => {
    if (!confirm(`حذف ${email}؟`)) return
    try { await apiDelete(`/users/${id}`); setUsers(prev=>prev.filter(x=>x.id!==id)); toast('تم حذف المستخدم') } catch { /* silent */ }
  }
  const ROLE_LABELS: Record<string,string> = {admin:'مدير',editor:'محرر',viewer:'مشاهد'}
  const ROLE_COLORS: Record<string,string> = {admin:'#8B0020',editor:'#2563eb',viewer:'#16a34a'}

  return (
    <div style={{fontFamily:"'Cairo',sans-serif"}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px'}}>
        <h1 style={{fontSize:'1.5rem',fontWeight:800}}>إدارة المستخدمين</h1>
        <div style={{display:'flex',gap:'10px'}}>
          <button onClick={load} style={{padding:'9px 14px',background:'#f5f5f5',border:'1px solid #e0e0e0',borderRadius:'7px',fontSize:'13px',cursor:'pointer',fontFamily:'inherit'}}>↻ تحديث</button>
          <button onClick={()=>setShowAdd(true)} style={{padding:'9px 18px',background:'#8B0020',color:'#fff',border:'none',borderRadius:'7px',fontSize:'13.5px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>+ إضافة مستخدم</button>
        </div>
      </div>
      {error && <div style={{background:'#fff0f0',border:'1px solid #fca5a5',borderRadius:'8px',padding:'12px',color:'#dc2626',fontSize:'13px',marginBottom:'16px'}}>{error}</div>}
      {showAdd && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200}}>
          <div style={{background:'#fff',borderRadius:'16px',padding:'32px',width:'100%',maxWidth:'420px',boxShadow:'0 8px 40px rgba(0,0,0,0.15)',fontFamily:"'Cairo',sans-serif"}}>
            <h2 style={{fontSize:'1.1rem',fontWeight:800,marginBottom:'20px'}}>إضافة مستخدم جديد</h2>
            <form onSubmit={handleAdd} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              {([['الاسم الكامل','displayName','text'],['البريد الإلكتروني','email','email'],['كلمة المرور (8+)','password','password']] as [string,string,string][]).map(([l,k,t])=>(
                <div key={k}>
                  <label style={{display:'block',fontSize:'13px',fontWeight:600,marginBottom:'5px'}}>{l}</label>
                  <input type={t} value={(form as any)[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:'100%',boxSizing:'border-box',padding:'10px 12px',border:'1.5px solid #ddd',borderRadius:'8px',fontSize:'14px',outline:'none',fontFamily:'inherit'}} required />
                </div>
              ))}
              <div>
                <label style={{display:'block',fontSize:'13px',fontWeight:600,marginBottom:'5px'}}>الدور</label>
                <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} style={{width:'100%',padding:'10px 12px',border:'1.5px solid #ddd',borderRadius:'8px',fontSize:'14px',cursor:'pointer',fontFamily:'inherit'}}>
                  <option value="admin">مدير (Admin)</option>
                  <option value="editor">محرر (Editor)</option>
                  <option value="viewer">مشاهد (Viewer)</option>
                </select>
              </div>
              {formError && <p style={{color:'#dc2626',fontSize:'13px',margin:0}}>{formError}</p>}
              <div style={{display:'flex',gap:'10px',marginTop:'4px'}}>
                <button type="submit" disabled={saving} style={{flex:1,padding:'11px',background:saving?'#aaa':'#8B0020',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:700,cursor:saving?'not-allowed':'pointer',fontFamily:'inherit'}}>{saving?'جارٍ...':'إضافة'}</button>
                <button type="button" onClick={()=>{setShowAdd(false);setFormError('')}} style={{flex:1,padding:'11px',background:'#f5f5f5',border:'1px solid #ddd',borderRadius:'8px',fontSize:'14px',cursor:'pointer',fontFamily:'inherit'}}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #eee'}}>
        {loading ? <div style={{textAlign:'center',padding:'48px',color:'#888'}}>جارٍ التحميل…</div>
        : users.length===0 ? <div style={{textAlign:'center',padding:'48px',color:'#aaa'}}>لا يوجد مستخدمون</div>
        : (
          <div className="dash-users-table">
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px',minWidth:'600px'}}>
            <thead><tr style={{background:'#f8f8f8'}}>
              {['الاسم','البريد','الدور','الحالة','آخر دخول','الإجراءات'].map(h=>(
                <th key={h} style={{padding:'10px 12px',textAlign:'right',fontWeight:700,color:'#666',fontSize:'12px',borderBottom:'1px solid #eee'}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{users.map((u,i)=>(
              <tr key={u.id||i} style={{borderBottom:'1px solid #f5f5f5'}}>
                <td style={{padding:'10px 12px',fontWeight:600}}>{u.displayName||u.name||'—'}</td>
                <td style={{padding:'10px 12px',color:'#555',fontSize:'12.5px'}}>{u.email||'—'}</td>
                <td style={{padding:'10px 12px'}}><span style={{padding:'3px 10px',borderRadius:'100px',fontSize:'11.5px',fontWeight:700,background:`${ROLE_COLORS[u.role]||'#888'}18`,color:ROLE_COLORS[u.role]||'#888'}}>{ROLE_LABELS[u.role]||u.role}</span></td>
                <td style={{padding:'10px 12px'}}><span style={{padding:'3px 10px',borderRadius:'100px',fontSize:'11.5px',fontWeight:700,background:u.active!==false?'#dcfce7':'#fee2e2',color:u.active!==false?'#166534':'#dc2626'}}>{u.active!==false?'نشط':'معطل'}</span></td>
                <td style={{padding:'10px 12px',color:'#888',fontSize:'12px'}}>{u.lastLogin?new Date(u.lastLogin).toLocaleDateString('ar-SA'):'لم يدخل بعد'}</td>
                <td style={{padding:'10px 12px'}}><div style={{display:'flex',gap:'8px'}}>
                  <button onClick={()=>toggleActive(u)} style={{fontSize:'12px',color:u.active!==false?'#d97706':'#16a34a',background:'none',border:'none',cursor:'pointer',fontWeight:600,fontFamily:'inherit'}}>{u.active!==false?'تعطيل':'تفعيل'}</button>
                  <button onClick={()=>del(u.id,u.email)} style={{fontSize:'12px',color:'#dc2626',background:'none',border:'none',cursor:'pointer',fontFamily:'inherit'}}>حذف</button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── COMPANY SETTINGS PAGE ─────────────────────────────────────
function CompanySettingsPage() {
  const toast = useToast()
  const [settings, setSettings] = useState<any>(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')

  useEffect(()=>{
    apiGet('/settings/company')
      .then(d=>{setSettings(d);setLoading(false)})
      .catch((err: any)=>{setError(err.message==='network'?'تعذر الاتصال بالخادم':`خطأ: ${err.message}`);setLoading(false)})
  },[])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('')
    try { await apiPut('/settings/company', settings); toast('تم حفظ الإعدادات بنجاح') }
    catch (err: any) { setError(err.message ?? 'فشل الحفظ') }
    setSaving(false)
  }

  const set = (k:string,v:string) => setSettings((p:any)=>({...p,[k]:v}))
  const setSocial = (k:string,v:string) => setSettings((p:any)=>({...p,socialLinks:{...p.socialLinks,[k]:v}}))

  if (loading) return <div style={{textAlign:'center',padding:'60px',color:'#888'}}>جارٍ التحميل…</div>

  const Field = ({label,k,type='text'}:{label:string;k:string;type?:string}) => (
    <div>
      <label style={{display:'block',fontSize:'12.5px',fontWeight:600,color:'#555',marginBottom:'5px'}}>{label}</label>
      <input type={type} value={settings?.[k]||''} onChange={e=>set(k,e.target.value)} style={{width:'100%',boxSizing:'border-box',padding:'9px 12px',border:'1.5px solid #e0e0e0',borderRadius:'7px',fontSize:'13px',outline:'none',fontFamily:'inherit'}} />
    </div>
  )
  const Card = ({title,children}:{title:string;children:React.ReactNode}) => (
    <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #eee',marginBottom:'16px'}}>
      <h2 style={{fontSize:'14px',fontWeight:700,color:'#8B0020',marginBottom:'16px',borderBottom:'1px solid #f0f0f0',paddingBottom:'10px'}}>{title}</h2>
      <div className="dash-settings-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>{children}</div>
    </div>
  )

  return (
    <div style={{fontFamily:"'Cairo',sans-serif"}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px'}}>
        <h1 style={{fontSize:'1.5rem',fontWeight:800}}>إعدادات الشركة</h1>
      </div>
      {error && <div style={{background:'#fff0f0',border:'1px solid #fca5a5',borderRadius:'8px',padding:'12px',color:'#dc2626',fontSize:'13px',marginBottom:'16px'}}>{error}</div>}
      <form onSubmit={save}>
        <Card title="الاسم والشعار">
          <Field label="اسم الشركة (عربي)"    k="companyNameAr" />
          <Field label="اسم الشركة (إنجليزي)" k="companyNameEn" />
          <Field label="الشعار (عربي)"         k="taglineAr"     />
          <Field label="الشعار (إنجليزي)"      k="taglineEn"     />
        </Card>
        <Card title="معلومات التواصل">
          <Field label="البريد الإلكتروني"      k="contactEmail"      type="email" />
          <Field label="بريد الإشعارات"         k="notificationEmail" type="email" />
          <Field label="هاتف المصنع"            k="phoneFactory"               />
          <Field label="هاتف المقر الرئيسي"    k="phoneHeadOffice"            />
          <Field label="ساعات العمل"            k="workingHours"               />
          <Field label="الموقع الإلكتروني"      k="websiteUrl"                 />
        </Card>
        <Card title="العنوان والموقع">
          <Field label="العنوان (عربي)"     k="addressAr" />
          <Field label="العنوان (إنجليزي)" k="addressEn" />
        </Card>
        <Card title="وسائل التواصل الاجتماعي">
          {[['LinkedIn','linkedin'],['Facebook','facebook'],['Instagram','instagram'],['YouTube','youtube'],['Twitter / X','twitter']].map(([l,k])=>(
            <div key={k}>
              <label style={{display:'block',fontSize:'12.5px',fontWeight:600,color:'#555',marginBottom:'5px'}}>{l}</label>
              <input type="url" value={settings?.socialLinks?.[k]||''} onChange={e=>setSocial(k,e.target.value)} style={{width:'100%',boxSizing:'border-box',padding:'9px 12px',border:'1.5px solid #e0e0e0',borderRadius:'7px',fontSize:'13px',outline:'none',fontFamily:'inherit'}} />
            </div>
          ))}
        </Card>
        <button type="submit" disabled={saving} style={{padding:'12px 32px',background:saving?'#aaa':'#8B0020',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:700,cursor:saving?'not-allowed':'pointer',fontFamily:'inherit'}}>
          {saving?'جارٍ الحفظ...':'حفظ الإعدادات'}
        </button>
      </form>
    </div>
  )
}

// ── DASHBOARD LAYOUT ──────────────────────────────────────────
function DashboardLayout() {
  const [active, setActive] = useState('overview')
  const [newInquiries, setNewInquiries] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Poll for new inquiries count (lightweight)
  useEffect(() => {
    const check = () => apiGet('/inquiries').then((d: any[]) => {
      const count = Array.isArray(d) ? d.filter(i=>i.status==='new').length : 0
      setNewInquiries(count)
    }).catch(()=>{})
    check()
    const t = setInterval(check, 60_000) // every minute
    return () => clearInterval(t)
  }, [])

  const pages: Record<string, JSX.Element> = {
    overview:  <OverviewPage />,
    products:  <ProductsPage />,
    inquiries: <InquiriesPage />,
    analytics: <AnalyticsPage />,
    users:     <UsersPage />,
    settings:  <CompanySettingsPage />,
    profile:   <ProfileSettings />,
  }

  return (
    <div style={{minHeight:'100vh',background:'#f0f2f5',fontFamily:"'Cairo',sans-serif",direction:'rtl'}}>
      {/* Mobile top bar — hidden on desktop via CSS */}
      <header className="dash-mobile-bar" style={{display:'none',position:'fixed',top:0,left:0,right:0,height:'56px',background:'#fff',borderBottom:'1px solid #eee',zIndex:150,alignItems:'center',justifyContent:'space-between',padding:'0 16px'}}>
        <img src={logoImg} alt="Al Omran" style={{height:'36px',objectFit:'contain'}} />
        <button onClick={()=>setSidebarOpen(true)} aria-label="فتح القائمة" style={{background:'none',border:'none',cursor:'pointer',padding:'4px',fontSize:'22px',color:'#333',lineHeight:1}}>☰</button>
      </header>
      {/* Dim overlay shown behind the sidebar on mobile */}
      {sidebarOpen && <div onClick={()=>setSidebarOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:110}} />}
      <Sidebar active={active} setActive={(s)=>{setActive(s);setSidebarOpen(false)}} newInquiries={newInquiries} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="dash-main" style={{marginRight:'240px',padding:'28px',minHeight:'100vh'}}>
        {pages[active] ?? <OverviewPage />}
      </main>
      <style>{`
        @media (max-width: 768px) {
          .dash-mobile-bar { display: flex !important; }
          .dash-main { margin-right: 0 !important; padding: 72px 16px 24px !important; }
          .dash-sidebar { transform: translateX(100%); }
          .dash-sidebar.open { transform: translateX(0); }
          .dash-sidebar-close { display: block !important; }
          .dash-settings-grid { grid-template-columns: 1fr !important; }
          .dash-users-table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        }
      `}</style>
    </div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
