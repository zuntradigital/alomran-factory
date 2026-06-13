import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const items = [
    { to: '/admin',            label: 'نظرة عامة', end: true },
    { to: '/admin/products',   label: 'المنتجات'            },
    { to: '/admin/inquiries',  label: 'الاستفسارات'         },
    { to: '/admin/analytics',  label: 'التحليلات'           },
  ]

  return (
    <div style={{minHeight:'100vh',background:'#f3f4f6',display:'flex'}}>
      <aside style={{width:'240px',background:'#fff',borderLeft:'1px solid #eee',position:'fixed',top:0,right:0,bottom:0,padding:'20px 12px',display:'flex',flexDirection:'column',gap:'4px'}}>
        <div style={{padding:'8px 12px 20px',borderBottom:'1px solid #eee',marginBottom:'8px'}}>
          <span style={{fontSize:'13px',fontWeight:'700'}}>مصنع العمران</span>
        </div>
        {items.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            style={({isActive})=>({display:'block',padding:'10px 14px',borderRadius:'8px',fontSize:'14px',fontWeight:'500',color:isActive?'#8B0020':'#374151',background:isActive?'rgba(139,0,32,0.08)':'transparent',textDecoration:'none'})}>
            {item.label}
          </NavLink>
        ))}
        <div style={{marginTop:'auto',borderTop:'1px solid #eee',paddingTop:'12px',display:'flex',flexDirection:'column',gap:'4px'}}>
          <button onClick={()=>navigate('/')} style={{padding:'10px 14px',borderRadius:'8px',fontSize:'14px',background:'none',border:'none',cursor:'pointer',textAlign:'right',color:'#374151'}}>العودة للموقع</button>
          <button onClick={()=>{logout();navigate('/admin/login')}} style={{padding:'10px 14px',borderRadius:'8px',fontSize:'14px',background:'none',border:'none',cursor:'pointer',textAlign:'right',color:'#dc2626'}}>تسجيل الخروج</button>
        </div>
      </aside>
      <main style={{flex:1,marginRight:'240px',padding:'28px'}}>
        <Outlet />
      </main>
    </div>
  )
}
