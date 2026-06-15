import { useLang } from '../context/LangContext'

export default function ProjectsPage() {
  const { lang } = useLang()

  const projects = [
    { titleAr:'مشروع التطوير الحضري - حي النخيل، الرياض', titleEn:'Urban Development - Al Nakheel, Riyadh', locAr:'الرياض، 2024', locEn:'Riyadh, 2024', img:'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80', span:2 },
    { titleAr:'ممشى الحديقة المركزية', titleEn:'Central Park Walkway', locAr:'جدة، 2023', locEn:'Jeddah, 2023', img:'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=500&q=80', span:1 },
    { titleAr:'واجهات مجمع سكني', titleEn:'Residential Complex Facades', locAr:'الدمام، 2023', locEn:'Dammam, 2023', img:'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80', span:1 },
    { titleAr:'منتزه عام', titleEn:'Public Park', locAr:'المدينة المنورة، 2022', locEn:'Madinah, 2022', img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80', span:1 },
    { titleAr:'مشروع الساحات العامة', titleEn:'Public Squares Project', locAr:'الرياض، 2023', locEn:'Riyadh, 2023', img:'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=900&q=80', span:1 },
    { titleAr:'مول الرياض - جلسات خارجية', titleEn:'Riyadh Mall - Outdoor Seating', locAr:'الرياض، 2024', locEn:'Riyadh, 2024', img:'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=900&q=80', span:2 },
  ]

  return (
    <div>
      {/* PAGE HEADER */}
      <div style={{paddingTop:'68px',background:'#fff',minHeight:'130px',display:'flex',alignItems:'flex-end',paddingBottom:'28px',paddingLeft:'80px',paddingRight:'80px',borderBottom:'1px solid #eee'}}>
        <div>
          <h1 style={{fontSize:'1.9rem',fontWeight:900,color:'#1a1a1a'}}>{lang==='ar'?'مشاريعنا':'Our Projects'}</h1>
          <div style={{fontSize:'12px',color:'#888',marginTop:'5px'}}>
            <span style={{color:'#8B0020'}}>{lang==='ar'?'الرئيسية':'Home'}</span> / {lang==='ar'?'المشاريع':'Projects'}
          </div>
        </div>
      </div>

      <section style={{padding:'48px 80px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
          {projects.map((p,i)=>(
            <div key={i} style={{gridColumn:`span ${p.span}`,borderRadius:'10px',overflow:'hidden',position:'relative',cursor:'pointer',background:'#1a1a1a'}}>
              <img src={p.img} alt={lang==='ar'?p.titleAr:p.titleEn}
                style={{width:'100%',height:'100%',aspectRatio:p.span===2?'16/7':'4/3',objectFit:'cover',objectPosition:'center',display:'block',opacity:.85,transition:'transform .4s'}}
                onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.04)')}
                onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')} />
              <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(0,0,0,.8) 0%,transparent 55%)',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'18px'}}>
                <div style={{color:'#fff',fontSize:'14px',fontWeight:700,marginBottom:'4px'}}>{lang==='ar'?p.titleAr:p.titleEn}</div>
                <div style={{color:'rgba(255,255,255,0.65)',fontSize:'12px'}}>{lang==='ar'?p.locAr:p.locEn}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
