import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { useNavigate } from 'react-router-dom'

const PRODUCTS = [
  {code:'BE-01',ar:'مقعد كلاسيكي',en:'Classic Bench',cat:'BE',cAr:'مقاعد',cEn:'Benches',dims:'L 200 W 50 H 50',img:'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=70'},
  {code:'BE-05',ar:'مقعد حديث بخشب',en:'Modern Wood Bench',cat:'BE',cAr:'مقاعد',cEn:'Benches',dims:'L 180 W 50 H 50',img:'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=70'},
  {code:'BE-015',ar:'مقعد محيطي بالشجرة',en:'Tree Surround Bench',cat:'BE',cAr:'مقاعد',cEn:'Benches',dims:'L 175 W 175 H 80',img:'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=70'},
  {code:'BE-019',ar:'مقعد بظهر',en:'Bench with Backrest',cat:'BE',cAr:'مقاعد',cEn:'Benches',dims:'L 180 W 50 H 85',img:'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=70'},
  {code:'BE-026',ar:'مقعد استلقاء',en:'Lounge Bench',cat:'BE',cAr:'مقاعد',cEn:'Benches',dims:'L 180 W 50 H 90',img:'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=70'},
  {code:'TA-01',ar:'طاولة دائرية',en:'Round Table',cat:'TA',cAr:'طاولات',cEn:'Tables',dims:'Outer D 100 H 80',img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70'},
  {code:'TA-03',ar:'طاولة شطرنج',en:'Chess Table',cat:'TA',cAr:'طاولات',cEn:'Tables',dims:'L 80 W 80 H 70',img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70'},
  {code:'TA-07',ar:'طاولة بنج بونج',en:'Ping Pong Table',cat:'TA',cAr:'طاولات',cEn:'Tables',dims:'L 274 W 152 H 76',img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70'},
  {code:'TB-01',ar:'حاوية أسطوانية',en:'Cylindrical Bin',cat:'TB',cAr:'حاويات نفايات',cEn:'Trash Bins',dims:'Outer D 50 H 80',img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70'},
  {code:'TB-04',ar:'حاوية مربعة',en:'Square Bin',cat:'TB',cAr:'حاويات نفايات',cEn:'Trash Bins',dims:'L 50 W 50 H 100',img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70'},
  {code:'TB-011',ar:'حاوية مزدوجة',en:'Double Bin',cat:'TB',cAr:'حاويات نفايات',cEn:'Trash Bins',dims:'L 75 W 40 H 85',img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70'},
  {code:'PL-01',ar:'حوض مربع',en:'Square Planter',cat:'PL',cAr:'أحواض زهور',cEn:'Planters',dims:'L 60 W 60 H 60',img:'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=70'},
  {code:'PL-03',ar:'حوض نصف كروي',en:'Bowl Planter',cat:'PL',cAr:'أحواض زهور',cEn:'Planters',dims:'Outer D 90 H 55',img:'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=70'},
  {code:'PL-07',ar:'حوض دائري',en:'Round Planter',cat:'PL',cAr:'أحواض زهور',cEn:'Planters',dims:'Outer D 90 H 70',img:'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=70'},
  {code:'BO-01',ar:'بوالرد دائري',en:'Round Bollard',cat:'BO',cAr:'بوالرد',cEn:'Bollards',dims:'Outer D 40 H 60',img:'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400&q=70'},
  {code:'BO-07',ar:'بوالرد مقبة',en:'Domed Bollard',cat:'BO',cAr:'بوالرد',cEn:'Bollards',dims:'Outer D 45 H 70',img:'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400&q=70'},
  {code:'CB-01',ar:'حاجز خرساني صغير',en:'Small Barrier',cat:'CB',cAr:'حواجز خرسانية',cEn:'Concrete Barriers',dims:'L 100 W 50 H 50',img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70'},
  {code:'CB-05',ar:'حاجز خرساني كبير',en:'Large Barrier',cat:'CB',cAr:'حواجز خرسانية',cEn:'Concrete Barriers',dims:'L 150 W 55 H 100',img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70'},
  {code:'WS-01',ar:'مصد سيارات قصير',en:'Short Wheel Stopper',cat:'WS',cAr:'مصدات سيارات',cEn:'Wheel Stoppers',dims:'L 100 W 25 H 15',img:'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=70'},
  {code:'WS-04',ar:'مصد سيارات طويل',en:'Long Wheel Stopper',cat:'WS',cAr:'مصدات سيارات',cEn:'Wheel Stoppers',dims:'L 180 W 30 H 20',img:'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=70'},
  {code:'SS-01',ar:'درجة سلم كبيرة',en:'Large Stair Step',cat:'SS',cAr:'درج السلم',cEn:'Stepping Stones',dims:'L 100 W 35 H 15',img:'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=400&q=70'},
  {code:'ST-05',ar:'بلاطة خرسانية',en:'Concrete Slab',cat:'ST',cAr:'بلاطات خرسانية',cEn:'Steps/Slabs',dims:'L 100 W 40 H 6',img:'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=400&q=70'},
]

const CATS = [
  {id:'all',ar:'الكل',en:'All'},
  {id:'BE',ar:'مقاعد',en:'Benches'},
  {id:'TA',ar:'طاولات',en:'Tables'},
  {id:'TB',ar:'حاويات نفايات',en:'Trash Bins'},
  {id:'PL',ar:'أحواض زهور',en:'Planters'},
  {id:'BO',ar:'بوالرد',en:'Bollards'},
  {id:'CB',ar:'حواجز خرسانية',en:'Barriers'},
  {id:'WS',ar:'مصدات سيارات',en:'Wheel Stoppers'},
  {id:'SS',ar:'درج السلم',en:'Steps'},
  {id:'ST',ar:'بلاطات خرسانية',en:'Slabs'},
]

export default function ProductsPage() {
  const { lang } = useLang()
  const navigate = useNavigate()
  const [cat, setCat] = useState('all')
  const [selected, setSelected] = useState<typeof PRODUCTS[0]|null>(null)

  const filtered = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat)

  return (
    <div>
      {/* PAGE HEADER */}
      <div style={{paddingTop:'68px',background:'#fff',minHeight:'130px',display:'flex',alignItems:'flex-end',paddingBottom:'28px',paddingLeft:'80px',paddingRight:'80px',borderBottom:'1px solid #eee'}}>
        <div>
          <h1 style={{fontSize:'1.9rem',fontWeight:900,color:'#1a1a1a'}}>{lang==='ar'?'كتالوج المنتجات':'Product Catalog'}</h1>
          <div style={{fontSize:'12px',color:'#888',marginTop:'5px'}}>
            <span style={{color:'#8B0020'}}>{lang==='ar'?'الرئيسية':'Home'}</span> / {lang==='ar'?'المنتجات':'Products'}
          </div>
        </div>
      </div>

      <div style={{padding:'36px 80px'}}>
        {/* FILTERS */}
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'28px'}}>
          {CATS.map(c=>(
            <button key={c.id} onClick={()=>setCat(c.id)}
              style={{padding:'7px 18px',border:'1.5px solid',borderColor:cat===c.id?'#8B0020':'#ddd',borderRadius:'100px',background:cat===c.id?'#8B0020':'#fff',color:cat===c.id?'#fff':'#444',fontSize:'13px',fontWeight:600,cursor:'pointer',transition:'all .2s'}}>
              {lang==='ar'?c.ar:c.en}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px'}}>
          {filtered.map(p=>(
            <div key={p.code} onClick={()=>setSelected(p)}
              style={{background:'#fff',border:'1px solid #eee',borderRadius:'10px',overflow:'hidden',cursor:'pointer',transition:'transform .2s, box-shadow .2s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-4px)';(e.currentTarget as HTMLElement).style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='none';(e.currentTarget as HTMLElement).style.boxShadow='none'}}>
              <div style={{aspectRatio:'4/3',background:'#f5f5f5',overflow:'hidden',position:'relative'}}>
                <img src={p.img} alt={lang==='ar'?p.ar:p.en} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                <span style={{position:'absolute',top:'9px',right:'9px',background:'#8B0020',color:'#fff',fontSize:'11px',fontWeight:700,padding:'2px 7px',borderRadius:'4px',fontFamily:'monospace'}}>{p.code}</span>
              </div>
              <div style={{padding:'13px'}}>
                <div style={{fontSize:'11px',color:'#8B0020',fontWeight:700,marginBottom:'3px'}}>{lang==='ar'?p.cAr:p.cEn}</div>
                <div style={{fontSize:'13.5px',fontWeight:700,marginBottom:'3px'}}>{lang==='ar'?p.ar:p.en}</div>
                <div style={{fontSize:'11px',color:'#aaa',fontFamily:'monospace'}}>{p.dims}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selected && (
        <div onClick={()=>setSelected(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:'14px',maxWidth:'520px',width:'92%',maxHeight:'88vh',overflowY:'auto',padding:'26px',position:'relative'}}>
            <button onClick={()=>setSelected(null)} style={{position:'absolute',top:'13px',left:'13px',background:'#f5f5f5',border:'none',borderRadius:'50%',width:'29px',height:'29px',cursor:'pointer',fontSize:'16px'}}>✕</button>
            <img src={selected.img} alt={lang==='ar'?selected.ar:selected.en} style={{width:'100%',borderRadius:'8px',maxHeight:'200px',objectFit:'cover',marginBottom:'15px'}} />
            <span style={{background:'rgba(139,0,32,0.1)',color:'#8B0020',fontSize:'11.5px',fontWeight:700,padding:'3px 8px',borderRadius:'4px',fontFamily:'monospace'}}>{selected.code}</span>
            <h2 style={{fontSize:'1.1rem',fontWeight:800,margin:'9px 0 3px'}}>{lang==='ar'?selected.ar:selected.en}</h2>
            <p style={{fontSize:'12.5px',color:'#8B0020',fontWeight:600,marginBottom:'15px'}}>{lang==='ar'?selected.cAr:selected.cEn}</p>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
              <tbody>
                {[[lang==='ar'?'الكود':'Code', selected.code],[lang==='ar'?'الأبعاد (سم)':'Dimensions (cm)', selected.dims],[lang==='ar'?'المادة':'Material', lang==='ar'?'خرسانة مسبقة الصب عالية الأداء':'High-Performance Precast Concrete'],[lang==='ar'?'خيارات التشطيب':'Finish Options', lang==='ar'?'مصقول / صنفرة / بدون تشطيب':'Polished / Sand-Blasted / Off-Mold']].map(([k,v])=>(
                  <tr key={k as string} style={{borderBottom:'1px solid #eee'}}>
                    <td style={{padding:'8px 11px',fontWeight:700,background:'#f8f8f8',width:'40%'}}>{k}</td>
                    <td style={{padding:'8px 11px',fontFamily:'monospace'}}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={()=>{setSelected(null);navigate('/contact')}} style={{width:'100%',marginTop:'15px',padding:'11px',background:'#8B0020',color:'#fff',border:'none',borderRadius:'7px',fontSize:'14px',fontWeight:700,cursor:'pointer'}}>
              {lang==='ar'?'طلب عرض سعر لهذا المنتج ←':'Request Quote for This Product →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
