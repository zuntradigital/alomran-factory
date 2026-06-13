export default function AdminOverview() {
  const kpis = [
    { label: 'إجمالي الطلبات', value: '247', change: '↑ 12%', color: '#8B0020' },
    { label: 'الاستفسارات الجديدة', value: '38', change: '↑ 8%', color: '#16a34a' },
    { label: 'المشاريع النشطة', value: '14', change: '+3 جديد', color: '#2563eb' },
    { label: 'إجمالي المنتجات', value: '156', change: '+12 جديد', color: '#d97706' },
  ]
  return (
    <div>
      <h1 style={{fontSize:'1.5rem',fontWeight:'800',marginBottom:'24px'}}>لوحة التحكم</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'24px'}}>
        {kpis.map(k => (
          <div key={k.label} style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #eee'}}>
            <div style={{fontSize:'12px',color:'#666',marginBottom:'8px'}}>{k.label}</div>
            <div style={{fontSize:'2rem',fontWeight:'900',color:'#1a1a1a'}}>{k.value}</div>
            <div style={{fontSize:'12px',color:k.color,marginTop:'4px'}}>{k.change}</div>
          </div>
        ))}
      </div>
      <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #eee'}}>
        <h2 style={{fontSize:'15px',fontWeight:'700',marginBottom:'16px'}}>أحدث الاستفسارات</h2>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13.5px'}}>
          <thead>
            <tr style={{background:'#f8f8f8'}}>
              {['العميل','نوع المنتج','التاريخ','الحالة'].map(h=>(
                <th key={h} style={{padding:'10px 12px',textAlign:'right',fontWeight:'700',borderBottom:'1px solid #eee'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[['محمد العتيبي','مقاعد BE-015','12 يونيو 2026','جديد'],['شركة البناء الحديث','حواجز CB-04','11 يونيو 2026','قيد المراجعة'],['بلدية الرياض','حاويات TB-010','10 يونيو 2026','مكتمل']].map(([c,p,d,s])=>(
              <tr key={c} style={{borderBottom:'1px solid #eee'}}>
                <td style={{padding:'10px 12px'}}>{c}</td>
                <td style={{padding:'10px 12px'}}>{p}</td>
                <td style={{padding:'10px 12px'}}>{d}</td>
                <td style={{padding:'10px 12px'}}>
                  <span style={{padding:'3px 10px',borderRadius:'100px',fontSize:'11.5px',fontWeight:'700',background:s==='جديد'?'#dcfce7':s==='قيد المراجعة'?'#fef9c3':'#e0e7ff',color:s==='جديد'?'#166534':s==='قيد المراجعة'?'#854d0e':'#3730a3'}}>{s}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
