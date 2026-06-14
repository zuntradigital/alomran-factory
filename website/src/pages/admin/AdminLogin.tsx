import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(email, password)) navigate('/admin')
    else setError('بيانات خاطئة — Invalid credentials')
  }

  return (
    <div style={{minHeight:'100vh',background:'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:'16px',padding:'40px',width:'100%',maxWidth:'400px',boxShadow:'0 4px 24px rgba(0,0,0,0.1)'}}>
        <div style={{textAlign:'center',marginBottom:'28px'}}>
          <img src="/src/assets/logo/logo-icon.svg" alt="Al Omran Logo" style={{width:'48px',height:'48px',margin:'0 auto 12px',display:'block'}} />
          <h1 style={{fontSize:'1.2rem',fontWeight:'800'}}>لوحة التحكم | Admin</h1>
        </div>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          <input type="email" placeholder="admin@alomranprecast.com" value={email} onChange={e=>setEmail(e.target.value)}
            style={{padding:'10px 14px',border:'1.5px solid #ddd',borderRadius:'8px',fontSize:'14px',outline:'none'}} required />
          <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}
            style={{padding:'10px 14px',border:'1.5px solid #ddd',borderRadius:'8px',fontSize:'14px',outline:'none'}} required />
          {error && <p style={{color:'#dc2626',fontSize:'13px',textAlign:'center'}}>{error}</p>}
          <button type="submit" style={{padding:'12px',background:'#8B0020',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>
            دخول | Login
          </button>
        </form>
        <p style={{textAlign:'center',fontSize:'11px',color:'#999',marginTop:'16px'}}>
          admin@alomranprecast.com / alomran2024
        </p>
      </div>
    </div>
  )
}
