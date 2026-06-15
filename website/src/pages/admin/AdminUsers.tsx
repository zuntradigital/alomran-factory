import { useState, useEffect } from 'react'
import { usersAPI } from '../../utils/api'

const ROLE_LABELS: Record<string, string> = { admin: 'مدير', editor: 'محرر', viewer: 'مشاهد' }
const ROLE_COLORS: Record<string, string> = { admin: '#8B0020', editor: '#2563eb', viewer: '#16a34a' }

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', displayName: '', role: 'editor' })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    usersAPI.getAll()
      .then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => { setError('تعذر التحميل'); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (form.password.length < 8) { setFormError('كلمة المرور يجب أن تكون 8 أحرف على الأقل'); return }
    setSaving(true)
    try {
      const result = await usersAPI.create(form)
      if (result.error) { setFormError(result.error); setSaving(false); return }
      setUsers(prev => [result, ...prev])
      setShowAdd(false)
      setForm({ email: '', password: '', displayName: '', role: 'editor' })
    } catch { setFormError('حدث خطأ') }
    setSaving(false)
  }

  const toggleActive = async (user: any) => {
    try {
      const result = await usersAPI.update(user.id, { active: !user.active })
      if (!result.error) setUsers(prev => prev.map(u => u.id === user.id ? { ...u, active: !user.active } : u))
    } catch { /* silent */ }
  }

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`حذف المستخدم ${email}؟`)) return
    try {
      const result = await usersAPI.delete(id)
      if (!result.error) setUsers(prev => prev.filter(u => u.id !== id))
    } catch { /* silent */ }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>إدارة المستخدمين</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={load} style={{ padding: '9px 14px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '7px', fontSize: '13px', cursor: 'pointer' }}>↻ تحديث</button>
          <button onClick={() => setShowAdd(true)} style={{ padding: '9px 18px', background: '#8B0020', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer' }}>+ إضافة مستخدم</button>
        </div>
      </div>

      {error && <div style={{ background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px', color: '#dc2626', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

      {/* Add User Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>إضافة مستخدم جديد</h2>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'الاسم الكامل', key: 'displayName', type: 'text',     placeholder: 'أحمد العمراني' },
                { label: 'البريد الإلكتروني', key: 'email', type: 'email',     placeholder: 'ahmed@alomranprecast.com' },
                { label: 'كلمة المرور (8 أحرف+)', key: 'password', type: 'password', placeholder: '••••••••' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px' }}>{label}</label>
                  <input type={type} placeholder={placeholder} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none' }} required />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px' }}>الدور</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                  <option value="admin">مدير (Admin)</option>
                  <option value="editor">محرر (Editor)</option>
                  <option value="viewer">مشاهد (Viewer)</option>
                </select>
              </div>
              {formError && <p style={{ color: '#dc2626', fontSize: '13px', margin: 0 }}>{formError}</p>}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: '11px', background: saving ? '#aaa' : '#8B0020', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'جارٍ الحفظ...' : 'إضافة'}
                </button>
                <button type="button" onClick={() => { setShowAdd(false); setFormError('') }} style={{ flex: 1, padding: '11px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #eee' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>جارٍ التحميل…</div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#aaa' }}>لا يوجد مستخدمون بعد</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8f8f8' }}>
                {['الاسم', 'البريد الإلكتروني', 'الدور', 'الحالة', 'آخر دخول', 'الإجراءات'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#666', fontSize: '12px', borderBottom: '1px solid #eee' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id || i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{u.displayName || u.name || '—'}</td>
                  <td style={{ padding: '10px 12px', color: '#555', fontSize: '12.5px' }}>{u.email || '—'}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11.5px', fontWeight: 700, background: `${ROLE_COLORS[u.role] || '#888'}18`, color: ROLE_COLORS[u.role] || '#888' }}>
                      {ROLE_LABELS[u.role] || u.role}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11.5px', fontWeight: 700, background: u.active !== false ? '#dcfce7' : '#fee2e2', color: u.active !== false ? '#166534' : '#dc2626' }}>
                      {u.active !== false ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#888', fontSize: '12px' }}>
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('ar-SA') : 'لم يدخل بعد'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => toggleActive(u)}
                        style={{ fontSize: '12px', color: u.active !== false ? '#d97706' : '#16a34a', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}>
                        {u.active !== false ? 'تعطيل' : 'تفعيل'}
                      </button>
                      <button onClick={() => handleDelete(u.id, u.email)}
                        style={{ fontSize: '12px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
