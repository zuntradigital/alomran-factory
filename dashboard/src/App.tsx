import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext, useContext, useEffect, ReactNode } from 'react'

// ── AUTH ──────────────────────────────────────────────────────
interface AuthCtx { isLoggedIn: boolean; login:(e:string,p:string)=>boolean; logout:()=>void }
const AuthContext = createContext<AuthCtx>({ isLoggedIn:false, login:()=>false, logout:()=>{} })
function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('alomran_dash') === 'true')
  const login = (email: string, password: string) => {
    if (email === 'admin@alomranprecast.com' && password === 'alomran2024') {
      localStorage.setItem('alomran_dash', 'true'); setIsLoggedIn(true); return true
    }
    return false
  }
  const logout = () => { localStorage.removeItem('alomran_dash'); setIsLoggedIn(false) }
  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>
}
const useAuth = () => useContext(AuthContext)

// ── PROTECTED ─────────────────────────────────────────────────
function Protected({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />
}

// ── LOGIN ─────────────────────────────────────────────────────
function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!login(email, pass)) setErr('بيانات خاطئة — Invalid credentials')
  }

  return (
    <div style={{minHeight:'100vh',background:'#f0f2f5',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Cairo',sans-serif"}}>
      <div style={{background:'#fff',borderRadius:'16px',padding:'44px',width:'100%',maxWidth:'420px',boxShadow:'0 4px 32px rgba(0,0,0,0.1)'}}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{width:'52px',height:'52px',background:'#8B0020',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:'24px',margin:'0 auto 14px'}}>P</div>
          <h1 style={{fontSize:'1.3rem',fontWeight:800,color:'#1a1a1a',marginBottom:'4px'}}>لوحة التحكم</h1>
          <p style={{fontSize:'13px',color:'#888'}}>Al Omran Admin Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          <div>
            <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#444',marginBottom:'5px'}}>البريد الإلكتروني</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@alomranprecast.com"
              style={{width:'100%',padding:'11px 14px',border:'1.5px solid #ddd',borderRadius:'8px',fontSize:'14px',outline:'none',fontFamily:'inherit'}} required />
          </div>
          <div>
            <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#444',marginBottom:'5px'}}>كلمة المرور</label>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"
              style={{width:'100%',padding:'11px 14px',border:'1.5px solid #ddd',borderRadius:'8px',fontSize:'14px',outline:'none',fontFamily:'inherit'}} required />
          </div>
          {err && <p style={{color:'#dc2626',fontSize:'13px',textAlign:'center',fontWeight:600}}>{err}</p>}
          <button type="submit" style={{padding:'13px',background:'#8B0020',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',marginTop:'4px'}}>
            دخول | Login
          </button>
        </form>
        <p style={{textAlign:'center',fontSize:'11.5px',color:'#bbb',marginTop:'18px'}}>
          admin@alomranprecast.com / alomran2024
        </p>
      </div>
    </div>
  )
}

// ── SIDEBAR ───────────────────────────────────────────────────
function Sidebar({ active, setActive }: { active: string; setActive: (s:string)=>void }) {
  const { logout } = useAuth()
  const navItems = [
    { id:'overview',    icon:'⊞', labelAr:'نظرة عامة',     labelEn:'Overview'    },
    { id:'products',    icon:'◈', labelAr:'المنتجات',       labelEn:'Products'    },
    { id:'inquiries',   icon:'✉', labelAr:'الاستفسارات',   labelEn:'Inquiries'   },
    { id:'analytics',   icon:'▦', labelAr:'التحليلات',     labelEn:'Analytics'   },
  ]

  return (
    <aside style={{width:'240px',background:'#fff',borderLeft:'1px solid #eee',position:'fixed',top:0,right:0,bottom:0,display:'flex',flexDirection:'column',zIndex:100,fontFamily:"'Cairo',sans-serif"}}>
      {/* Logo */}
      <div style={{padding:'20px 16px',borderBottom:'1px solid #eee'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'38px',height:'38px',background:'#8B0020',borderRadius:'9px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:'18px'}}>P</div>
          <div style={{lineHeight:'1.25'}}>
            <span style={{display:'block',fontSize:'12.5px',fontWeight:700,color:'#1a1a1a'}}>مصنع العمران</span>
            <span style={{display:'block',fontSize:'10px',color:'#8B0020'}}>لوحة التحكم</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:'12px 10px',display:'flex',flexDirection:'column',gap:'3px'}}>
        <p style={{fontSize:'10.5px',fontWeight:700,color:'#aaa',textTransform:'uppercase',letterSpacing:'.07em',padding:'4px 10px',marginBottom:'4px'}}>الرئيسية</p>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',borderRadius:'8px',border:'none',background:active===item.id?'rgba(139,0,32,0.08)':'transparent',color:active===item.id?'#8B0020':'#374151',fontWeight:active===item.id?600:500,fontSize:'14px',cursor:'pointer',textAlign:'right',fontFamily:'inherit',transition:'background .15s'}}>
            <span style={{fontSize:'16px'}}>{item.icon}</span>
            <span>{item.labelAr}</span>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{padding:'10px',borderTop:'1px solid #eee'}}>
        <button onClick={() => window.open('http://localhost:5173','_blank')}
          style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',borderRadius:'8px',border:'none',background:'transparent',color:'#374151',fontSize:'14px',cursor:'pointer',width:'100%',textAlign:'right',fontFamily:'inherit'}}>
          <span>🌐</span><span>العودة للموقع</span>
        </button>
        <button onClick={logout}
          style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',borderRadius:'8px',border:'none',background:'transparent',color:'#dc2626',fontSize:'14px',cursor:'pointer',width:'100%',textAlign:'right',fontFamily:'inherit'}}>
          <span>→</span><span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
}

// ── KPI CARD ──────────────────────────────────────────────────
function KPICard({ label, value, change, changeUp, iconBg, icon }: { label:string; value:string; change:string; changeUp:boolean; iconBg:string; icon:string }) {
  return (
    <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #eee',display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
      <div>
        <div style={{fontSize:'12.5px',color:'#888',marginBottom:'8px'}}>{label}</div>
        <div style={{fontSize:'2rem',fontWeight:900,color:'#1a1a1a',lineHeight:'1'}}>{value}</div>
        <div style={{fontSize:'12px',fontWeight:600,marginTop:'6px',color:changeUp?'#16a34a':'#dc2626'}}>{change}</div>
      </div>
      <div style={{width:'44px',height:'44px',borderRadius:'10px',background:iconBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',flexShrink:0}}>{icon}</div>
    </div>
  )
}

// ── OVERVIEW PAGE ─────────────────────────────────────────────
function OverviewPage() {
  const inquiries = [
    { client:'محمد العتيبي',      product:'مقاعد BE-015',     date:'12 يونيو 2026', status:'جديد'          },
    { client:'شركة البناء الحديث', product:'حواجز CB-04',      date:'11 يونيو 2026', status:'قيد المراجعة'  },
    { client:'بلدية الرياض',       product:'حاويات TB-010',    date:'10 يونيو 2026', status:'مكتمل'         },
    { client:'مجموعة الأفق العقارية', product:'أحواض PL-012', date:'9 يونيو 2026',  status:'جديد'          },
    { client:'نادي الرياضة الدولي', product:'بوالرد BO-07',   date:'8 يونيو 2026',  status:'قيد المراجعة'  },
  ]

  const statusStyle = (s: string) => ({
    padding:'3px 10px', borderRadius:'100px', fontSize:'11.5px', fontWeight:700 as const,
    background: s==='جديد'?'#dcfce7': s==='قيد المراجعة'?'#fef9c3':'#e0e7ff',
    color: s==='جديد'?'#166534': s==='قيد المراجعة'?'#854d0e':'#3730a3',
  })

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'28px'}}>
        <h1 style={{fontSize:'1.5rem',fontWeight:800,color:'#1a1a1a'}}>لوحة التحكم</h1>
        <div style={{fontSize:'13px',color:'#888'}}>{new Date().toLocaleDateString('ar-SA',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
      </div>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'24px'}}>
        <KPICard label="إجمالي الطلبات"       value="247" change="↑ 12% هذا الشهر"  changeUp={true}  iconBg="rgba(139,0,32,0.08)"  icon="🛒" />
        <KPICard label="الاستفسارات الجديدة" value="38"  change="↑ 8% هذا الأسبوع" changeUp={true}  iconBg="rgba(22,163,74,0.08)"  icon="💬" />
        <KPICard label="المشاريع النشطة"      value="14"  change="+3 مشاريع جديدة"  changeUp={true}  iconBg="rgba(37,99,235,0.08)"   icon="📁" />
        <KPICard label="إجمالي المنتجات"      value="156" change="+12 منتج جديد"    changeUp={true}  iconBg="rgba(217,119,6,0.08)"   icon="📦" />
      </div>

      {/* Charts Row */}
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'16px',marginBottom:'16px'}}>
        {/* Bar Chart */}
        <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #eee'}}>
          <div style={{fontSize:'15px',fontWeight:700,marginBottom:'20px'}}>الطلبات الشهرية</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:'10px',height:'160px',paddingBottom:'8px'}}>
            {[['يناير',45],['فبراير',62],['مارس',58],['أبريل',75],['مايو',68],['يونيو',88],['يوليو',72]].map(([m,v])=>(
              <div key={m as string} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}>
                <div style={{width:'100%',background:'#8B0020',borderRadius:'4px 4px 0 0',height:`${(v as number)/88*140}px`,transition:'height .3s'}} />
                <span style={{fontSize:'10.5px',color:'#888'}}>{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart Placeholder */}
        <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #eee'}}>
          <div style={{fontSize:'15px',fontWeight:700,marginBottom:'20px'}}>توزيع المنتجات</div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {[['مقاعد',35,'#8B0020'],['طاولات',20,'#A0002A'],['حاويات',16,'#C8102E'],['أحواض زهور',14,'#E8A0A0'],['بوالرد',15,'#2C0010']].map(([cat,pct,color])=>(
              <div key={cat as string}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'12.5px',marginBottom:'4px'}}>
                  <span style={{fontWeight:600}}>{cat}</span>
                  <span style={{color:'#888'}}>{pct}%</span>
                </div>
                <div style={{height:'6px',background:'#f0f0f0',borderRadius:'3px'}}>
                  <div style={{height:'100%',width:`${pct}%`,background:color as string,borderRadius:'3px'}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #eee'}}>
        <div style={{fontSize:'15px',fontWeight:700,marginBottom:'16px'}}>أحدث الاستفسارات</div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13.5px'}}>
          <thead>
            <tr style={{background:'#f8f8f8'}}>
              {['العميل','نوع المنتج','التاريخ','الحالة','الإجراء'].map(h=>(
                <th key={h} style={{padding:'10px 14px',textAlign:'right',fontWeight:700,color:'#666',fontSize:'12px',borderBottom:'1px solid #eee'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inquiries.map((r,i)=>(
              <tr key={i} style={{borderBottom:'1px solid #f0f0f0'}}>
                <td style={{padding:'11px 14px',fontWeight:600}}>{r.client}</td>
                <td style={{padding:'11px 14px',color:'#555'}}>{r.product}</td>
                <td style={{padding:'11px 14px',color:'#888',fontSize:'12.5px'}}>{r.date}</td>
                <td style={{padding:'11px 14px'}}><span style={statusStyle(r.status)}>{r.status}</span></td>
                <td style={{padding:'11px 14px'}}>
                  <button style={{fontSize:'12.5px',color:'#8B0020',background:'none',border:'none',cursor:'pointer',fontWeight:600,fontFamily:'inherit'}}>عرض</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── PRODUCTS PAGE ─────────────────────────────────────────────
function ProductsPage() {
  const products = [
    {code:'BE-01',name:'مقعد كلاسيكي',cat:'مقاعد',dims:'L 200 W 50 H 50'},
    {code:'BE-015',name:'مقعد محيطي',cat:'مقاعد',dims:'L 175 W 175 H 80'},
    {code:'TA-01',name:'طاولة دائرية',cat:'طاولات',dims:'Outer D 100 H 80'},
    {code:'TB-01',name:'حاوية أسطوانية',cat:'حاويات نفايات',dims:'Outer D 50 H 80'},
    {code:'PL-01',name:'حوض مربع',cat:'أحواض زهور',dims:'L 60 W 60 H 60'},
    {code:'BO-07',name:'بوالرد مقبة',cat:'بوالرد',dims:'Outer D 45 H 70'},
    {code:'CB-05',name:'حاجز كبير',cat:'حواجز خرسانية',dims:'L 150 W 55 H 100'},
    {code:'WS-01',name:'مصد قصير',cat:'مصدات سيارات',dims:'L 100 W 25 H 15'},
  ]
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px'}}>
        <h1 style={{fontSize:'1.5rem',fontWeight:800}}>إدارة المنتجات</h1>
        <button style={{padding:'10px 20px',background:'#8B0020',color:'#fff',border:'none',borderRadius:'8px',fontSize:'13.5px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>+ إضافة منتج</button>
      </div>
      <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #eee'}}>
        <div style={{display:'flex',gap:'10px',marginBottom:'16px'}}>
          <input type="text" placeholder="بحث عن منتج..." style={{flex:1,padding:'9px 14px',border:'1px solid #ddd',borderRadius:'7px',fontSize:'13.5px',fontFamily:'inherit',outline:'none'}} />
          <select style={{padding:'9px 14px',border:'1px solid #ddd',borderRadius:'7px',fontSize:'13.5px',fontFamily:'inherit',outline:'none',background:'#fff'}}>
            <option>كل الفئات</option>
            <option>مقاعد</option><option>طاولات</option><option>حاويات نفايات</option>
          </select>
        </div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13.5px'}}>
          <thead>
            <tr style={{background:'#f8f8f8'}}>
              {['الكود','الاسم','الفئة','الأبعاد','الحالة','الإجراءات'].map(h=>(
                <th key={h} style={{padding:'10px 14px',textAlign:'right',fontWeight:700,color:'#666',fontSize:'12px',borderBottom:'1px solid #eee'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p=>(
              <tr key={p.code} style={{borderBottom:'1px solid #f0f0f0'}}>
                <td style={{padding:'11px 14px',fontFamily:'monospace',fontWeight:700,color:'#8B0020'}}>{p.code}</td>
                <td style={{padding:'11px 14px',fontWeight:600}}>{p.name}</td>
                <td style={{padding:'11px 14px',color:'#666'}}>{p.cat}</td>
                <td style={{padding:'11px 14px',color:'#888',fontFamily:'monospace',fontSize:'12px'}}>{p.dims}</td>
                <td style={{padding:'11px 14px'}}>
                  <span style={{padding:'3px 10px',borderRadius:'100px',fontSize:'11.5px',fontWeight:700,background:'#dcfce7',color:'#166534'}}>نشط</span>
                </td>
                <td style={{padding:'11px 14px',display:'flex',gap:'8px'}}>
                  <button style={{fontSize:'12.5px',color:'#8B0020',background:'none',border:'none',cursor:'pointer',fontWeight:600,fontFamily:'inherit'}}>تعديل</button>
                  <button style={{fontSize:'12.5px',color:'#dc2626',background:'none',border:'none',cursor:'pointer',fontFamily:'inherit'}}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── INQUIRIES PAGE ────────────────────────────────────────────
function InquiriesPage() {
  const all = [
    { name:'عبدالله الشمري',   email:'a.shamri@example.com',   phone:'+966501234567', product:'مقاعد BE-020',  date:'12/06/2026', status:'جديد'         },
    { name:'سارة الحربي',      email:'s.harbi@example.com',    phone:'+966507654321', product:'أحواض PL-05',   date:'11/06/2026', status:'قيد المراجعة' },
    { name:'خالد المطيري',     email:'k.mutairi@example.com',  phone:'+966509876543', product:'بوالرد BO-12',   date:'10/06/2026', status:'مكتمل'        },
    { name:'نورة القحطاني',    email:'n.qahtani@example.com',  phone:'+966512345678', product:'حواجز CB-04',    date:'09/06/2026', status:'جديد'         },
    { name:'فيصل العنزي',      email:'f.anazi@example.com',    phone:'+966523456789', product:'طاولات TA-03',   date:'08/06/2026', status:'قيد المراجعة' },
  ]
  const statusStyle = (s: string) => ({
    padding:'3px 10px', borderRadius:'100px', fontSize:'11.5px', fontWeight:700 as const,
    background: s==='جديد'?'#dcfce7': s==='قيد المراجعة'?'#fef9c3':'#e0e7ff',
    color: s==='جديد'?'#166534': s==='قيد المراجعة'?'#854d0e':'#3730a3',
  })
  return (
    <div>
      <h1 style={{fontSize:'1.5rem',fontWeight:800,marginBottom:'24px'}}>الاستفسارات وطلبات العروض</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px',marginBottom:'20px'}}>
        {[['إجمالي الاستفسارات','142','#8B0020'],['بانتظار الرد','38','#d97706'],['معدل التحويل','67%','#16a34a']].map(([l,v,c])=>(
          <div key={l as string} style={{background:'#fff',borderRadius:'12px',padding:'18px',border:'1px solid #eee'}}>
            <div style={{fontSize:'12.5px',color:'#888',marginBottom:'6px'}}>{l}</div>
            <div style={{fontSize:'2rem',fontWeight:900,color:c as string}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #eee'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
          <thead>
            <tr style={{background:'#f8f8f8'}}>
              {['الاسم','البريد الإلكتروني','الهاتف','المنتج المطلوب','التاريخ','الحالة'].map(h=>(
                <th key={h} style={{padding:'10px 12px',textAlign:'right',fontWeight:700,color:'#666',fontSize:'12px',borderBottom:'1px solid #eee'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {all.map((r,i)=>(
              <tr key={i} style={{borderBottom:'1px solid #f0f0f0'}}>
                <td style={{padding:'10px 12px',fontWeight:600}}>{r.name}</td>
                <td style={{padding:'10px 12px',color:'#666',fontSize:'12.5px'}}>{r.email}</td>
                <td style={{padding:'10px 12px',color:'#888',fontSize:'12.5px',fontFamily:'monospace'}}>{r.phone}</td>
                <td style={{padding:'10px 12px',color:'#555'}}>{r.product}</td>
                <td style={{padding:'10px 12px',color:'#888',fontSize:'12.5px'}}>{r.date}</td>
                <td style={{padding:'10px 12px'}}><span style={statusStyle(r.status)}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── ANALYTICS PAGE ────────────────────────────────────────────
function AnalyticsPage() {
  const topProducts = [
    {name:'BE-015 مقعد محيطي',val:48},
    {name:'TB-010 حاوية مزدوجة',val:38},
    {name:'PL-07 حوض دائري',val:32},
    {name:'BO-07 بوالرد مقبة',val:28},
    {name:'CB-04 حاجز وسط',val:24},
    {name:'WS-01 مصد قصير',val:19},
  ]
  const monthly = [28,35,32,45,38,52,47,55,62,58,70,65]
  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']

  return (
    <div>
      <h1 style={{fontSize:'1.5rem',fontWeight:800,marginBottom:'24px'}}>التحليلات والإحصاءات</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'16px'}}>
        {/* Top Products */}
        <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #eee'}}>
          <div style={{fontSize:'15px',fontWeight:700,marginBottom:'18px'}}>المنتجات الأكثر طلباً</div>
          {topProducts.map(p=>(
            <div key={p.name} style={{marginBottom:'12px'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px',marginBottom:'5px'}}>
                <span style={{fontWeight:600}}>{p.name}</span>
                <span style={{color:'#8B0020',fontWeight:700}}>{p.val}</span>
              </div>
              <div style={{height:'7px',background:'#f0f0f0',borderRadius:'4px'}}>
                <div style={{height:'100%',width:`${(p.val/48)*100}%`,background:'#8B0020',borderRadius:'4px',transition:'width .5s'}} />
              </div>
            </div>
          ))}
        </div>

        {/* Category donut */}
        <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #eee'}}>
          <div style={{fontSize:'15px',fontWeight:700,marginBottom:'18px'}}>الطلبات حسب الفئة</div>
          {[['مقاعد',30,'#8B0020'],['طاولات',18,'#A0002A'],['حاويات',16,'#C8102E'],['أحواض زهور',14,'#D94060'],['بوالرد',12,'#E8A0A0'],['حواجز',10,'#2C0010']].map(([cat,pct,color])=>(
            <div key={cat as string} style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
              <div style={{width:'12px',height:'12px',borderRadius:'3px',background:color as string,flexShrink:0}} />
              <span style={{fontSize:'13px',flex:1}}>{cat}</span>
              <span style={{fontSize:'13px',fontWeight:700,color:'#555'}}>{pct}%</span>
              <div style={{width:'80px',height:'6px',background:'#f0f0f0',borderRadius:'3px'}}>
                <div style={{height:'100%',width:`${pct}%`,background:color as string,borderRadius:'3px'}} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Annual chart */}
      <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #eee'}}>
        <div style={{fontSize:'15px',fontWeight:700,marginBottom:'20px'}}>أداء المبيعات السنوي 2025</div>
        <div style={{display:'flex',alignItems:'flex-end',gap:'8px',height:'180px'}}>
          {monthly.map((v,i)=>(
            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}>
              <div style={{width:'100%',background:'#8B0020',borderRadius:'4px 4px 0 0',height:`${(v/70)*160}px`,transition:'height .4s',opacity:i===new Date().getMonth()?1:0.65}} />
              <span style={{fontSize:'9.5px',color:'#888',writingMode:'vertical-rl' as const,textOrientation:'mixed' as const,transform:'rotate(180deg)',height:'40px',display:'flex',alignItems:'center'}}>{months[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── DASHBOARD LAYOUT ──────────────────────────────────────────
function DashboardLayout() {
  const [active, setActive] = useState('overview')

  const pages: Record<string, JSX.Element> = {
    overview:  <OverviewPage />,
    products:  <ProductsPage />,
    inquiries: <InquiriesPage />,
    analytics: <AnalyticsPage />,
  }

  return (
    <div style={{minHeight:'100vh',background:'#f0f2f5',fontFamily:"'Cairo',sans-serif",direction:'rtl'}}>
      <Sidebar active={active} setActive={setActive} />
      <main style={{marginRight:'240px',padding:'28px',minHeight:'100vh'}}>
        {pages[active]}
      </main>
    </div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Protected><DashboardLayout /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
