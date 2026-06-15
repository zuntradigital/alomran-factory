import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import logoImg from '../../assets/logo/logo.png'

export default function AdminLogin() {
  const { login, loginGoogle, loading } = useAuth()
  const navigate = useNavigate()

  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState('')
  const [info,      setInfo]      = useState('')
  const [busy,      setBusy]      = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetMail, setResetMail] = useState('')

  if (loading) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setBusy(true)
    const ok = await login(email, password)
    setBusy(false)
    if (ok) navigate('/admin')
    else setError('بريد إلكتروني أو كلمة مرور غير صحيحة')
  }

  const handleGoogle = async () => {
    setError(''); setBusy(true)
    const ok = await loginGoogle()
    setBusy(false)
    if (ok) navigate('/admin')
    else setError('فشل تسجيل الدخول بـ Google')
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setBusy(true)
    try {
      await sendPasswordResetEmail(auth, resetMail)
      setInfo('تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني')
      setShowReset(false)
    } catch {
      setError('تعذر إرسال البريد. تحقق من العنوان.')
    }
    setBusy(false)
  }

  const input: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '10px 14px',
    border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px',
    outline: 'none', fontFamily: 'inherit',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cairo', sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src={logoImg} alt="Al Omran Logo" style={{ width: '52px', height: '52px', margin: '0 auto 12px', display: 'block', objectFit: 'contain' }} />
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '4px' }}>لوحة التحكم | Admin</h1>
        </div>

        {info && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px', color: '#166534', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>{info}</div>}

        {showReset ? (
          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.6 }}>أدخل بريدك الإلكتروني لاستعادة كلمة المرور.</p>
            <input type="email" value={resetMail} onChange={e => setResetMail(e.target.value)} placeholder="email@example.com" style={input} required dir="ltr" />
            {error && <p style={{ color: '#dc2626', fontSize: '13px', margin: 0, textAlign: 'center' }}>{error}</p>}
            <button type="submit" disabled={busy} style={{ padding: '11px', background: busy ? '#aaa' : '#8B0020', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {busy ? 'جارٍ الإرسال...' : 'إرسال رابط الاستعادة'}
            </button>
            <button type="button" onClick={() => { setShowReset(false); setError('') }} style={{ background: 'none', border: 'none', color: '#8B0020', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>← العودة</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input type="email" placeholder="admin@alomranprecast.com" value={email} onChange={e => setEmail(e.target.value)} style={input} required dir="ltr" />
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={input} required />
            {error && <p style={{ color: '#dc2626', fontSize: '13px', textAlign: 'center', margin: 0 }}>{error}</p>}
            <button type="submit" disabled={busy} style={{ padding: '12px', background: busy ? '#aaa' : '#8B0020', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {busy ? 'جارٍ التحقق...' : 'دخول | Login'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: '#eee' }} />
              <span style={{ fontSize: '12px', color: '#aaa' }}>أو</span>
              <div style={{ flex: 1, height: '1px', background: '#eee' }} />
            </div>

            <button type="button" onClick={handleGoogle} disabled={busy}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px', background: '#fff', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 600, color: '#333' }}>
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.6 6.7 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.1 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.6 6.7 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5.1l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H5.9C9.4 37.1 16.1 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4-3.9 5.3l.1-.1 6.2 5.2C37 40 44 35 44 24c0-1.3-.1-2.7-.4-3.9z"/>
              </svg>
              تسجيل الدخول بـ Google
            </button>

            <button type="button" onClick={() => { setShowReset(true); setError('') }} style={{ background: 'none', border: 'none', color: '#8B0020', fontSize: '12.5px', cursor: 'pointer', fontFamily: 'inherit', padding: '4px' }}>
              نسيت كلمة المرور؟
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
