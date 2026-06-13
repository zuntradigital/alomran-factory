import { useTranslation } from 'react-i18next'
import { useLang } from '../context/LangContext'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const { t } = useTranslation()
  const { lang } = useLang()
  const navigate = useNavigate()

  const projects = [
    { img:'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&q=80', titleAr:'جلسات خارجية', titleEn:'Outdoor Seating', descAr:'جلسات مريحة وعصرية', descEn:'Stylish public seating' },
    { img:'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=500&q=80', titleAr:'ساحات عامة', titleEn:'Public Squares', descAr:'مساحات آمنة وجذابة', descEn:'Safe pedestrian areas' },
    { img:'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=500&q=80', titleAr:'خرسانة مسبقة الصب', titleEn:'Precast Concrete', descAr:'أنظمة عالية الجودة', descEn:'High-quality systems' },
    { img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80', titleAr:'أثاث حضري', titleEn:'Urban Furniture', descAr:'أثاث أنيق للمساحات', descEn:'Elegant urban furniture' },
    { img:'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=500&q=80', titleAr:'واجهات معمارية', titleEn:'Architectural Facades', descAr:'حلول مبتكرة', descEn:'Innovative solutions' },
  ]

  const team = [
    { name:'Mohammed Ibrahim', roleAr:'الرئيس التنفيذي والمؤسس', roleEn:'CEO & Founder', img:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80' },
    { name:'Ahmed Alharbi', roleAr:'مدير المشاريع', roleEn:'Project Director', img:'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&q=80' },
    { name:'Khalid Almutairi', roleAr:'مدير الهندسة', roleEn:'Engineering Manager', img:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80' },
    { name:'Nouf Alshammari', roleAr:'مدير التصميم', roleEn:'Design Manager', img:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80' },
  ]

  const stats = [
    { num:'30+', labelAr:'سنة خبرة', labelEn:'Years Experience' },
    { num:'12K+', labelAr:'عميل راضٍ', labelEn:'Satisfied Clients' },
    { num:'84+', labelAr:'مشروع منجز', labelEn:'Projects Done' },
    { num:'37+', labelAr:'جائزة', labelEn:'Awards' },
  ]

  return (
    <div>

      {/* HERO */}
      <section style={{minHeight:'100vh',paddingTop:'68px',display:'grid',gridTemplateColumns:'1fr 1fr',alignItems:'center',background:'#fff',overflow:'hidden'}}>
        <div style={{padding:'60px 60px 60px 80px'}}>
          <div style={{fontSize:'12px',fontWeight:700,letterSpacing:'.08em',color:'#8B0020',textTransform:'uppercase',marginBottom:'16px'}}>
            {t('hero.eyebrow')}
          </div>
          <h1 style={{fontSize:'clamp(1.9rem,3.2vw,3rem)',fontWeight:900,color:'#1a1a1a',lineHeight:'1.18',marginBottom:'14px'}}>
            {t('hero.title1')}<br/>
            <span style={{color:'#8B0020'}}>{t('hero.title2')}</span>
          </h1>
          <p style={{fontSize:'14px',color:'#555',lineHeight:'1.8',maxWidth:'460px',marginBottom:'10px'}}>{t('hero.desc1')}</p>
          <p style={{fontSize:'13.5px',color:'#555',lineHeight:'1.8',maxWidth:'460px',marginBottom:'28px'}}>{t('hero.desc2')}</p>
          <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
            <button onClick={() => navigate('/contact')}
              style={{padding:'12px 26px',background:'#8B0020',color:'#fff',border:'none',borderRadius:'7px',fontSize:'14px',fontWeight:700,cursor:'pointer'}}>
              {t('hero.cta1')} ←
            </button>
            <button onClick={() => navigate('/projects')}
              style={{padding:'12px 26px',background:'#fff',color:'#333',border:'1.5px solid #ddd',borderRadius:'7px',fontSize:'14px',fontWeight:600,cursor:'pointer'}}>
              {t('hero.cta2')} ←
            </button>
          </div>
        </div>
        <div style={{height:'100vh',overflow:'hidden'}}>
          <img
            src="https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1400&q=85"
            alt="Al Omran"
            style={{width:'100%',height:'100%',objectFit:'cover',opacity:.85}}
          />
        </div>
      </section>

      {/* FEATURES */}
      <section style={{background:'#fff',padding:'38px 80px',borderTop:'1px solid #eee',borderBottom:'1px solid #eee'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'32px'}}>
          {[
            { icon:'⭐', titleAr:'جودة فائقة', titleEn:'Premium Quality', descAr:'منتجاتنا مصنّعة وفق أعلى معايير الجودة باستخدام مواد متطورة.', descEn:'Products manufactured to the highest quality standards.' },
            { icon:'🎨', titleAr:'تصاميم مبتكرة', titleEn:'Innovative Designs', descAr:'تصاميم معاصرة تجمع بين الجماليات والوظيفية.', descEn:'Contemporary designs combining aesthetics and functionality.' },
            { icon:'🌿', titleAr:'الاستدامة', titleEn:'Sustainability', descAr:'حلول صديقة للبيئة لخلق قيمة دائمة للأجيال القادمة.', descEn:'Eco-friendly solutions creating lasting value for future generations.' },
            { icon:'⏰', titleAr:'+10 سنوات خبرة', titleEn:'10+ Years Experience', descAr:'فريق متخصص من المهندسين يقدم التميز في كل مشروع.', descEn:'A specialized team delivering excellence across every project.' },
          ].map((f, i) => (
            <div key={i} style={{display:'flex',flexDirection:'column',gap:'9px'}}>
              <div style={{fontSize:'32px',marginBottom:'4px'}}>{f.icon}</div>
              <div style={{fontSize:'13.5px',fontWeight:700,color:'#1a1a1a'}}>{lang === 'ar' ? f.titleAr : f.titleEn}</div>
              <div style={{fontSize:'12.5px',color:'#666',lineHeight:'1.7'}}>{lang === 'ar' ? f.descAr : f.descEn}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section style={{padding:'68px 80px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'60px',alignItems:'center'}}>
          <div style={{position:'relative'}}>
            <div style={{borderRadius:'12px',overflow:'hidden',aspectRatio:'4/3'}}>
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" alt="Factory" style={{width:'100%',height:'100%',objectFit:'cover'}} />
            </div>
            <div style={{background:'#8B0020',color:'#fff',padding:'22px 26px',borderRadius:'10px',marginTop:'-36px',marginRight:'-28px',position:'relative',zIndex:2}}>
              <span style={{fontSize:'48px',color:'rgba(255,255,255,0.3)',lineHeight:'.8',display:'block',marginBottom:'9px'}}>"</span>
              <p style={{fontSize:'13px',lineHeight:'1.75',marginBottom:'10px'}}>
                {lang === 'ar' ? 'مهمتنا هي تحويل الأفكار إلى بيئات عمرانية استثنائية تلهم المجتمعات.' : 'Our mission is to transform ideas into exceptional urban environments that inspire communities.'}
              </p>
              <div style={{fontSize:'11.5px',opacity:.8,borderTop:'1px solid rgba(255,255,255,0.25)',paddingTop:'9px'}}>
                <strong>م. محمد إبراهيم</strong> — {lang === 'ar' ? 'مهندس معماري' : 'Architectural Engineer'}
              </div>
            </div>
          </div>
          <div>
            <div style={{fontSize:'12px',fontWeight:700,color:'#8B0020',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'10px'}}>
              {lang === 'ar' ? 'من نحن' : 'About Us'}
            </div>
            <h2 style={{fontSize:'clamp(1.5rem,2.6vw,2.1rem)',fontWeight:800,color:'#1a1a1a',lineHeight:'1.25',marginBottom:'12px'}}>
              {lang === 'ar' ? 'نبني المستقبل بالجودة ' : 'Building the Future with '}
              <span style={{color:'#8B0020'}}>{lang === 'ar' ? 'والابتكار' : 'Excellence'}</span>
            </h2>
            <p style={{fontSize:'14px',color:'#555',lineHeight:'1.85',marginBottom:'12px'}}>
              {lang === 'ar' ? 'في مصنع العمران، نؤمن أن المساحات العمرانية المتميزة تبدأ بتصميم استثنائي وحرفية متفوقة. نقدم مجموعة شاملة من الأثاث الحضري والمنتجات المعمارية والخرسانة عالية الجودة مسبقة الصب.' : 'At Al Omran Factory, we believe outstanding urban spaces begin with exceptional design. We provide urban furniture, architectural products, and high-quality precast concrete.'}
            </p>
            <p style={{fontSize:'14px',color:'#555',lineHeight:'1.85',marginBottom:'26px'}}>
              {lang === 'ar' ? 'بفضل خبرة تمتد لأكثر من عقد، يلتزم فريقنا بتقديم منتجات تلبي أعلى معايير الجودة والمتانة.' : 'With over a decade of expertise, our team delivers products meeting the highest standards of quality and durability.'}
            </p>
            <div style={{display:'flex',gap:'36px',padding:'18px 0',borderTop:'1px solid #eee',borderBottom:'1px solid #eee'}}>
              {stats.map((s) => (
                <div key={s.num}>
                  <div style={{fontSize:'1.9rem',fontWeight:900,color:'#1a1a1a',lineHeight:'1'}}>{s.num}</div>
                  <div style={{fontSize:'12px',color:'#888',marginTop:'3px'}}>{lang === 'ar' ? s.labelAr : s.labelEn}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section style={{background:'#1a1a1a',padding:'38px 80px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'24px',textAlign:'center'}}>
          {stats.map((s) => (
            <div key={s.num}>
              <div style={{fontSize:'2.3rem',fontWeight:900,color:'#fff',lineHeight:'1'}}>{s.num}</div>
              <div style={{fontSize:'12px',color:'rgba(255,255,255,0.45)',marginTop:'5px'}}>{lang === 'ar' ? s.labelAr : s.labelEn}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section style={{background:'#f8f8f8',padding:'68px 80px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'26px'}}>
          <h2 style={{fontSize:'clamp(1.5rem,2.6vw,2.1rem)',fontWeight:800,color:'#1a1a1a'}}>
            {lang === 'ar' ? 'مشاريعنا ' : 'Our '}
            <span style={{color:'#8B0020'}}>{lang === 'ar' ? 'المميزة' : 'Signature Projects'}</span>
          </h2>
          <button onClick={() => navigate('/projects')} style={{padding:'8px 17px',border:'1.5px solid #ddd',borderRadius:'6px',fontSize:'13px',fontWeight:600,color:'#333',background:'#fff',cursor:'pointer'}}>
            {lang === 'ar' ? 'عرض جميع المشاريع ←' : 'View All Projects →'}
          </button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'13px'}}>
          {projects.map((p, i) => (
            <div key={i} style={{borderRadius:'10px',overflow:'hidden',position:'relative',cursor:'pointer'}} onClick={() => navigate('/projects')}>
              <img src={p.img} alt={lang === 'ar' ? p.titleAr : p.titleEn} style={{width:'100%',aspectRatio:'4/3',objectFit:'cover',display:'block'}} />
              <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(0,0,0,.75) 0%,transparent 55%)',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'13px'}}>
                <div style={{color:'#fff',fontSize:'12.5px',fontWeight:700,marginBottom:'2px'}}>{lang === 'ar' ? p.titleAr : p.titleEn}</div>
                <div style={{color:'rgba(255,255,255,0.6)',fontSize:'11px'}}>{lang === 'ar' ? p.descAr : p.descEn}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section style={{padding:'68px 80px'}}>
        <h2 style={{fontSize:'clamp(1.5rem,2.6vw,2.1rem)',fontWeight:800,color:'#1a1a1a',marginBottom:'26px'}}>
          {lang === 'ar' ? 'تعرف على ' : 'Meet '}
          <span style={{color:'#8B0020'}}>{lang === 'ar' ? 'خبرائنا' : 'Our Experts'}</span>
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr) 1fr',gap:'13px'}}>
          <div style={{gridColumn:'1/5',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'13px'}}>
            {team.map((m) => (
              <div key={m.name} style={{background:'#fff',border:'1px solid #eee',borderRadius:'12px',overflow:'hidden',textAlign:'center'}}>
                <div style={{aspectRatio:'1',overflow:'hidden'}}>
                  <img src={m.img} alt={m.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                </div>
                <div style={{padding:'13px 11px'}}>
                  <div style={{fontSize:'13.5px',fontWeight:700,marginBottom:'3px'}}>{m.name}</div>
                  <div style={{fontSize:'12px',color:'#888',marginBottom:'9px'}}>{lang === 'ar' ? m.roleAr : m.roleEn}</div>
                  <div style={{width:'27px',height:'27px',background:'#0077b5',borderRadius:'5px',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto',color:'#fff',fontSize:'12px',fontWeight:700}}>in</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:'#8B0020',color:'#fff',borderRadius:'12px',padding:'26px 22px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
            <div>
              <h3 style={{fontSize:'1.1rem',fontWeight:800,marginBottom:'8px',lineHeight:'1.35'}}>{lang === 'ar' ? 'هل لديك مشروع في ذهنك؟' : 'Have a Project in Mind?'}</h3>
              <p style={{fontSize:'12.5px',opacity:.85,lineHeight:'1.7',marginBottom:'18px'}}>{lang === 'ar' ? 'تواصل مع مصنع العمران لإنشاء مساحات حضرية استثنائية.' : 'Partner with Al Omran to create exceptional urban spaces.'}</p>
            </div>
            <button onClick={() => navigate('/contact')} style={{padding:'9px 18px',background:'#fff',color:'#8B0020',border:'none',borderRadius:'6px',fontSize:'12.5px',fontWeight:700,cursor:'pointer'}}>
              {lang === 'ar' ? 'تواصل معنا الآن ←' : 'Get in Touch Today →'}
            </button>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section style={{background:'#8B0020',padding:'46px 80px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'46px',alignItems:'center'}}>
        <div>
          <h2 style={{fontSize:'1.55rem',fontWeight:900,color:'#fff',lineHeight:'1.3',marginBottom:'9px'}}>
            {lang === 'ar' ? 'هل أنت مستعد لبدء مشروعك؟' : 'Ready to Start Your Project?'}
          </h2>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.8)',lineHeight:'1.7',marginBottom:'18px'}}>
            {lang === 'ar' ? 'تواصل معنا الآن للحصول على استشارة مجانية وعرض سعر مخصص.' : 'Contact us for a free consultation and customized quote.'}
          </p>
          <button onClick={() => navigate('/contact')} style={{padding:'10px 22px',border:'2px solid rgba(255,255,255,0.55)',color:'#fff',background:'transparent',borderRadius:'7px',fontSize:'13.5px',fontWeight:700,cursor:'pointer'}}>
            {lang === 'ar' ? 'تواصل معنا ←' : 'Contact Us →'}
          </button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'13px'}}>
          {[
            { icon:'📍', textAr:'المدينة الصناعية الثانية، الرياض، المملكة العربية السعودية', textEn:'2nd Industrial City, Riyadh, Kingdom of Saudi Arabia' },
            { icon:'📞', textAr:'+966 11 123 4567', textEn:'+966 11 123 4567' },
            { icon:'✉️', textAr:'info@alomranprecast.com', textEn:'info@alomranprecast.com' },
          ].map((c, i) => (
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'11px',color:'#fff'}}>
              <span style={{fontSize:'16px',flexShrink:0}}>{c.icon}</span>
              <span style={{fontSize:'13px',opacity:.9,lineHeight:'1.6'}}>{lang === 'ar' ? c.textAr : c.textEn}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{fontSize:'13px',color:'rgba(255,255,255,0.75)',marginBottom:'9px',fontWeight:600}}>
            {lang === 'ar' ? 'اشترك في نشرتنا الإخبارية' : 'Subscribe to Our Newsletter'}
          </div>
          <input type="email" placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
            style={{width:'100%',padding:'10px 13px',background:'rgba(255,255,255,0.11)',border:'1px solid rgba(255,255,255,0.22)',borderRadius:'6px',color:'#fff',fontSize:'13px',outline:'none',marginBottom:'7px'}} />
          <button style={{width:'100%',padding:'10px',background:'#fff',color:'#8B0020',border:'none',borderRadius:'6px',fontSize:'13px',fontWeight:700,cursor:'pointer'}}>
            {lang === 'ar' ? 'اشترك الآن ←' : 'Subscribe Now →'}
          </button>
        </div>
      </section>

    </div>
  )
}
