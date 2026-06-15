import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts'
import { apiGet } from '../lib/api'
import { Skeleton } from '../components/Toast'

const CAT_AR: Record<string,string> = {
  BE:'مقاعد', TA:'طاولات', TB:'حاويات', PL:'أحواض', BO:'بوالرد', CB:'حواجز', WS:'مصدات', SS:'درج', ST:'بلاطات',
}

const STATUS_COLORS: Record<string,string> = {
  new:'#dc2626', in_review:'#d97706', replied:'#16a34a', completed:'#2563eb',
}
const STATUS_AR: Record<string,string> = {
  new:'جديد', in_review:'قيد المراجعة', replied:'تم الرد', completed:'مكتمل',
}

type Range = '7d' | '30d' | '90d' | 'all'

function downloadCSV(data: any[], filename: string) {
  if (!data.length) return
  const keys = Object.keys(data[0])
  const rows = [
    keys.join(','),
    ...data.map(r => keys.map(k => `"${String(r[k] ?? '').replace(/"/g,'""')}"`).join(',')),
  ]
  const blob = new Blob(['﻿' + rows.join('\n')], { type:'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href:url, download:filename })
  a.click(); URL.revokeObjectURL(url)
}

export default function AnalyticsPage() {
  const [products,  setProducts]  = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [range,     setRange]     = useState<Range>('30d')

  useEffect(() => {
    Promise.all([apiGet('/products').catch(()=>[]), apiGet('/inquiries').catch(()=>[])]).then(([p,i]) => {
      setProducts(Array.isArray(p) ? p : [])
      setInquiries(Array.isArray(i) ? i : [])
      setLoading(false)
    })
  }, [])

  // Filter inquiries by date range
  const rangeMs: Record<Range,number|null> = { '7d':7*864e5, '30d':30*864e5, '90d':90*864e5, all:null }
  const cutoff   = rangeMs[range] ? new Date(Date.now() - rangeMs[range]!).toISOString() : ''
  const filteredI = cutoff ? inquiries.filter(i => (i.createdAt??'') >= cutoff) : inquiries

  // Derived charts data

  // 1. Products by category (bar)
  const catMap: Record<string,number> = {}
  products.forEach(p => { catMap[p.category] = (catMap[p.category]??0)+1 })
  const catData = Object.entries(catMap).map(([cat,count]) => ({ cat:CAT_AR[cat]||cat, count })).sort((a,b)=>b.count-a.count)

  // 2. Inquiries by status (pie)
  const statusMap: Record<string,number> = {}
  filteredI.forEach(i => { statusMap[i.status||'new'] = (statusMap[i.status||'new']??0)+1 })
  const pieData = Object.entries(statusMap).map(([status,count]) => ({ name:STATUS_AR[status]||status, value:count, status }))

  // 3. Inquiries over time (line) — group by date
  const today = new Date(); today.setHours(0,0,0,0)
  const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 60
  const lineData: { date:string; count:number }[] = []
  for (let d = days-1; d >= 0; d--) {
    const dt = new Date(today); dt.setDate(dt.getDate()-d)
    const key = dt.toISOString().slice(0,10)
    lineData.push({ date: dt.toLocaleDateString('ar-SA',{month:'short',day:'numeric'}), count: 0, _key: key } as any)
  }
  filteredI.forEach(inq => {
    const key = (inq.createdAt??'').slice(0,10)
    const entry = (lineData as any[]).find(d => d._key === key)
    if (entry) entry.count++
  })

  // KPI
  const today2 = new Date().toISOString().slice(0,10)
  const weekAgo = new Date(Date.now()-7*864e5).toISOString()
  const kpis = [
    { label:'إجمالي المنتجات',     value:products.length,                                         color:'#8B0020' },
    { label:'إجمالي الاستفسارات', value:inquiries.length,                                         color:'#16a34a' },
    { label:'هذا الأسبوع',        value:inquiries.filter(i=>(i.createdAt??'')>weekAgo).length,   color:'#2563eb' },
    { label:'جديدة (بانتظار رد)', value:inquiries.filter(i=>i.status==='new').length,            color:'#dc2626' },
  ]

  return (
    <div style={{ fontFamily:"'Cairo',sans-serif" }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, margin:0 }}>التحليلات والإحصاءات</h1>
        <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
          <select value={range} onChange={e=>setRange(e.target.value as Range)}
            style={{ padding:'8px 12px', border:'1px solid #ddd', borderRadius:'7px', fontSize:'13px', fontFamily:'inherit', cursor:'pointer', outline:'none' }}>
            <option value="7d">آخر 7 أيام</option>
            <option value="30d">آخر 30 يوم</option>
            <option value="90d">آخر 3 أشهر</option>
            <option value="all">كل الوقت</option>
          </select>
          <button onClick={() => downloadCSV(inquiries.map(({id,name,email,phone,product,message,status,createdAt})=>({id,name,email,phone,product,message,status,createdAt})), `inquiries-${today2}.csv`)}
            style={{ padding:'8px 16px', background:'#f5f5f5', border:'1px solid #e0e0e0', borderRadius:'7px', fontSize:'13px', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>
            ⬇ تصدير CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'24px' }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background:'#fff', borderRadius:'12px', padding:'18px', border:'1px solid #eee' }}>
            <div style={{ fontSize:'12px', color:'#888', marginBottom:'6px' }}>{k.label}</div>
            <div style={{ fontSize:'2rem', fontWeight:900, color:k.color }}>
              {loading ? <Skeleton h="28px" w="60px" /> : k.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
        {/* Bar: Products per Category */}
        <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', border:'1px solid #eee' }}>
          <div style={{ fontWeight:700, fontSize:'14px', marginBottom:'16px' }}>المنتجات حسب الفئة</div>
          {loading ? <Skeleton h="200px" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={catData} margin={{ top:5, right:10, bottom:5, left:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="cat" tick={{ fontSize:11, fontFamily:"'Cairo',sans-serif" }} />
                <YAxis tick={{ fontSize:11 }} />
                <Tooltip contentStyle={{ fontFamily:"'Cairo',sans-serif", fontSize:'13px' }} />
                <Bar dataKey="count" fill="#8B0020" radius={[4,4,0,0]} name="عدد المنتجات" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie: Inquiries by Status */}
        <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', border:'1px solid #eee' }}>
          <div style={{ fontWeight:700, fontSize:'14px', marginBottom:'16px' }}>الاستفسارات حسب الحالة</div>
          {loading ? <Skeleton h="200px" /> : pieData.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:'#aaa', fontSize:'13px' }}>لا توجد بيانات في هذه الفترة</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                  {pieData.map((entry, idx) => <Cell key={idx} fill={STATUS_COLORS[entry.status] ?? '#888'} />)}
                </Pie>
                <Tooltip contentStyle={{ fontFamily:"'Cairo',sans-serif", fontSize:'13px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Line: Inquiries over Time */}
      <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', border:'1px solid #eee' }}>
        <div style={{ fontWeight:700, fontSize:'14px', marginBottom:'16px' }}>الاستفسارات عبر الزمن</div>
        {loading ? <Skeleton h="220px" /> : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData} margin={{ top:5, right:20, bottom:5, left:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize:10, fontFamily:"'Cairo',sans-serif" }} interval={Math.floor(lineData.length/8)} />
              <YAxis tick={{ fontSize:11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontFamily:"'Cairo',sans-serif", fontSize:'13px' }} />
              <Line type="monotone" dataKey="count" stroke="#8B0020" strokeWidth={2.5} dot={false} name="الاستفسارات" activeDot={{ r:5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
        <div style={{ marginTop:'8px', fontSize:'12px', color:'#aaa', textAlign:'center' }}>
          {filteredI.length === 0 ? 'لا توجد استفسارات في هذه الفترة' : `إجمالي ${filteredI.length} استفسار في الفترة المحددة`}
        </div>
      </div>
    </div>
  )
}
