import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logoImg from '../../assets/logo/logo.png'

export default function AdminLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const items = [
    { to: '/admin',             label: 'نظرة عامة',     icon: '⊞', end: true },
    { to: '/admin/products',    label: 'المنتجات',       icon: '◈'            },
    { to: '/admin/inquiries',   label: 'الاستفسارات',   icon: '✉'            },
    { to: '/admin/analytics',   label: 'التحليلات',     icon: '▦'            },
    { to: '/admin/users',       label: 'المستخدمون',    icon: '👥'           },
    { to: '/admin/settings',    label: 'إعدادات الشركة', icon: '⚙'           },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', fontFamily: "'Cairo', sans-serif" }}>
      <aside style={{ width: '240px', background: '#fff', borderLeft: '1px solid #eee', position: 'fixed', top: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Logo */}
        <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logoImg} alt="Al Omran Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            <div style={{ lineHeight: 1.25 }}>
              <span style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1a1a1a' }}>مصنع العمران</span>
              <span style={{ display: 'block', fontSize: '10px', color: '#8B0020' }}>لوحة التحكم</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.07em', padding: '4px 10px 6px', margin: 0 }}>الرئيسية</p>
          {items.slice(0, 4).map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
                borderRadius: '8px', fontSize: '14px', fontWeight: isActive ? 600 : 500,
                color: isActive ? '#8B0020' : '#374151', background: isActive ? 'rgba(139,0,32,0.08)' : 'transparent',
                textDecoration: 'none', transition: 'background .15s',
              })}>
              <span style={{ fontSize: '15px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.07em', padding: '12px 10px 6px', margin: 0 }}>الإدارة</p>
          {items.slice(4).map(item => (
            <NavLink key={item.to} to={item.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
                borderRadius: '8px', fontSize: '14px', fontWeight: isActive ? 600 : 500,
                color: isActive ? '#8B0020' : '#374151', background: isActive ? 'rgba(139,0,32,0.08)' : 'transparent',
                textDecoration: 'none', transition: 'background .15s',
              })}>
              <span style={{ fontSize: '15px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '10px 8px', borderTop: '1px solid #eee' }}>
          {user && (
            <div style={{ padding: '8px 12px', marginBottom: '4px', fontSize: '12px', color: '#888' }}>
              <div style={{ fontWeight: 600, color: '#333' }}>{user.displayName || user.email}</div>
              <div style={{ fontSize: '11px', color: '#8B0020' }}>{user.role === 'admin' ? 'مدير' : user.role}</div>
            </div>
          )}
          <button
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#374151', fontSize: '14px', cursor: 'pointer', width: '100%', textAlign: 'right' }}>
            <span>🌐</span><span>العودة للموقع</span>
          </button>
          <button
            onClick={() => { logout(); navigate('/admin/login') }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#dc2626', fontSize: '14px', cursor: 'pointer', width: '100%', textAlign: 'right' }}>
            <span>→</span><span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, marginRight: '240px', padding: '28px', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  )
}
