import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const ROLE_LABELS: Record<string, string> = { admin: 'مدير', editor: 'محرر', viewer: 'مشاهد' }

export default function ProfileSettings() {
  const { user, updateDisplayName, changePassword, signOut } = useAuth()

  const [name, setName]       = useState(user?.displayName ?? '')
  const [nameSaving, setNameSaving]   = useState(false)
  const [nameMsg,    setNameMsg]      = useState('')

  const [curPwd,  setCurPwd]  = useState('')
  const [newPwd,  setNewPwd]  = useState('')
  const [newPwd2, setNewPwd2] = useState('')
  const [pwdSaving, setPwdSaving] = useState(false)
  const [pwdMsg,    setPwdMsg]    = useState('')
  const [pwdError,  setPwdError]  = useState('')

  const handleNameSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameMsg('')
    setNameSaving(true)
    try {
      await updateDisplayName(name.trim())
      setNameMsg('✓ تم تحديث الاسم بنجاح')
    } catch (err: any) {
      setNameMsg('✗ ' + (err.message ?? 'حدث خطأ'))
    }
    setNameSaving(false)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdError('')
    setPwdMsg('')
    if (newPwd !== newPwd2) { setPwdError('كلمتا المرور غير متطابقتين'); return }
    if (newPwd.length < 8)  { setPwdError('يجب أن تكون كلمة المرور 8 أحرف على الأقل'); return }
    setPwdSaving(true)
    try {
      await changePassword(curPwd, newPwd)
      setPwdMsg('✓ تم تغيير كلمة المرور بنجاح')
      setCurPwd(''); setNewPwd(''); setNewPwd2('')
    } catch (err: any) {
      const code = err.code ?? ''
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setPwdError('كلمة المرور الحالية غير صحيحة')
      } else {
        setPwdError(err.message ?? 'حدث خطأ')
      }
    }
    setPwdSaving(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '10px 14px',
    border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '14px',
    outline: 'none', fontFamily: 'inherit',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '5px',
  }
  const cardStyle: React.CSSProperties = {
    background: '#fff', borderRadius: '12px', padding: '24px',
    border: '1px solid #eee', marginBottom: '16px',
  }

  return (
    <div style={{ maxWidth: '560px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>إعدادات الملف الشخصي</h1>

      {/* Account Info */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#8B0020', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>معلومات الحساب</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888' }}>البريد الإلكتروني</span>
            <span style={{ fontWeight: 600, direction: 'ltr' }}>{user?.email ?? '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888' }}>الدور</span>
            <span style={{ padding: '2px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, background: 'rgba(139,0,32,0.08)', color: '#8B0020' }}>
              {ROLE_LABELS[user?.role ?? 'viewer'] ?? user?.role}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888' }}>مزود المصادقة</span>
            <span style={{ fontWeight: 600 }}>Firebase Auth</span>
          </div>
        </div>
      </div>

      {/* Change Display Name */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#8B0020', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>الاسم المعروض</h2>
        <form onSubmit={handleNameSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={labelStyle}>الاسم الكامل</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} required />
          </div>
          {nameMsg && (
            <p style={{ color: nameMsg.startsWith('✓') ? '#16a34a' : '#dc2626', fontSize: '13px', margin: 0, fontWeight: 600 }}>{nameMsg}</p>
          )}
          <button type="submit" disabled={nameSaving}
            style={{ alignSelf: 'flex-start', padding: '10px 24px', background: nameSaving ? '#aaa' : '#8B0020', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: nameSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {nameSaving ? 'جارٍ الحفظ...' : 'حفظ الاسم'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#8B0020', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>تغيير كلمة المرور</h2>
        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={labelStyle}>كلمة المرور الحالية</label>
            <input type="password" value={curPwd}  onChange={e => setCurPwd(e.target.value)}  placeholder="••••••••" style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>كلمة المرور الجديدة</label>
            <input type="password" value={newPwd}  onChange={e => setNewPwd(e.target.value)}  placeholder="8 أحرف على الأقل" style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>تأكيد كلمة المرور الجديدة</label>
            <input type="password" value={newPwd2} onChange={e => setNewPwd2(e.target.value)} placeholder="••••••••" style={inputStyle} required />
          </div>
          {pwdError && <p style={{ color: '#dc2626', fontSize: '13px', margin: 0, fontWeight: 600 }}>{pwdError}</p>}
          {pwdMsg   && <p style={{ color: '#16a34a', fontSize: '13px', margin: 0, fontWeight: 600 }}>{pwdMsg}</p>}
          <button type="submit" disabled={pwdSaving}
            style={{ alignSelf: 'flex-start', padding: '10px 24px', background: pwdSaving ? '#aaa' : '#8B0020', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: pwdSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {pwdSaving ? 'جارٍ التغيير...' : 'تغيير كلمة المرور'}
          </button>
        </form>
        <p style={{ fontSize: '12px', color: '#aaa', marginTop: '12px', marginBottom: 0 }}>
          ملاحظة: تعمل هذه الميزة فقط مع حسابات البريد الإلكتروني/كلمة المرور، وليس Google.
        </p>
      </div>

      {/* Sign Out */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#dc2626', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>تسجيل الخروج</h2>
        <button
          onClick={() => signOut()}
          style={{ padding: '10px 24px', background: '#fff', color: '#dc2626', border: '1.5px solid #dc2626', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          تسجيل الخروج من جميع الأجهزة
        </button>
      </div>
    </div>
  )
}
