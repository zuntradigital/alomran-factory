import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info'
export type ToastFn = (msg: string, type?: ToastType) => void
interface Toast { id: number; msg: string; type: ToastType }

const Ctx = createContext<ToastFn>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Toast[]>([])

  const toast = useCallback<ToastFn>((msg, type = 'success') => {
    const id = Date.now()
    setList(prev => [...prev, { id, msg, type }])
    setTimeout(() => setList(prev => prev.filter(t => t.id !== id)), 3600)
  }, [])

  const bg: Record<ToastType, string> = {
    success: '#16a34a',
    error:   '#dc2626',
    info:    '#2563eb',
  }
  const icon: Record<ToastType, string> = { success: '✓', error: '✗', info: 'ℹ' }

  return (
    <Ctx.Provider value={toast}>
      {children}
      <style>{`
        @keyframes toast-in { from { opacity:0; transform:translateY(-12px) scale(.96); } to { opacity:1; transform:none; } }
        @keyframes skeleton-pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
      `}</style>
      <div style={{ position:'fixed', top:'20px', left:'50%', transform:'translateX(-50%)', zIndex:99999, display:'flex', flexDirection:'column', gap:'8px', pointerEvents:'none', minWidth:'280px' }}>
        {list.map(t => (
          <div key={t.id} style={{
            padding:'12px 20px', borderRadius:'10px', fontSize:'14px', fontWeight:600,
            color:'#fff', fontFamily:"'Cairo',sans-serif", background:bg[t.type],
            boxShadow:'0 4px 20px rgba(0,0,0,0.18)', animation:'toast-in .25s ease',
            display:'flex', alignItems:'center', gap:'8px',
          }}>
            <span style={{ fontWeight:800 }}>{icon[t.type]}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)

// Reusable skeleton block
export function Skeleton({ w = '100%', h = '14px', radius = '4px', style = {} }: { w?: string; h?: string; radius?: string; style?: React.CSSProperties }) {
  return <div style={{ width:w, height:h, borderRadius:radius, background:'#e8e8e8', animation:'skeleton-pulse 1.4s ease-in-out infinite', ...style }} />
}
