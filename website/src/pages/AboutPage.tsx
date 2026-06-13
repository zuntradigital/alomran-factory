import { useLang } from '../context/LangContext'
import { useNavigate } from 'react-router-dom'

export default function AboutPage() {
  const { lang } = useLang()
  const navigate = useNavigate()

  const values = [
    { icon:'✔', ar:'جودة بلا تنازل', en:'Uncompromising Quality' },
    { icon:'✔', ar:'الاستدامة البيئية', en:'Environmental Sustainability' },
    { icon:'✔', ar:'الابتكار المستمر', en:'Continuous Innovation' },
    { icon:'✔', ar:'الالتزام والثقة', en:'Commitment and Trust' },
    { icon:'✔', ar:'رضا العملاء أولويتنا', en:'Customer Satisfaction First' },
  ]

  const team = [
    { name:'Mohammed Ibrahim', roleAr:'الرئيس التنفيذي والمؤسس', roleEn:'CEO & Founder', img:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80' },
    { name:'Ahmed Alharbi', roleAr:'مدير المشاريع', roleEn:'Project Director', img:'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&q=80' },
    { name:'Khalid Almutairi', roleAr:'مدير الهندسة', roleEn:'Engineering Manager', img:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80' },
    { name:'Nouf Alshammari', roleAr:'مدير التصميم', roleEn:'Design Manager', img:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80' },
  ]

  const S = {
    pageHeader: { paddingTop:'68px', background:'#fff', minHeight:'130px', display:'flex' as const, alignItems:'flex-end' as const, paddingBottom:'28px', paddingLeft:'80px', paddingRight:'80px', borderBottom:'1px solid #eee' },
    label: { fontSize:'12px', fontWeight:700, color:'#8B0020', letterSpacing:'.08em', textTransform:'uppercase' as const, marginBottom:'10px' },
    sectionTitle: { fontSize:'clamp(1.5rem,2.6vw,2.1rem)', fontWeight:800, color:'#1a1a1a', lineHeight:'1.25' as const, marginBottom:'12px' },
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <div style={S.pageHeader}>
        <div>
          <h1 style={{fontSize:'1.9rem',fontWeight:900,color:'#1a1a1a'}}>{lang==='ar'?'من نحن':'About Us'}</h1>
          <div style={{fontSize:'12px',color:'#888',marginTop:'5px'}}>
            <span style={{color:'#8B0020'}}>{lang==='ar'?'الرئيسية':'Home'}</span> / {lang==='ar'?'من نحن':'About'}
          </div>
        </div>
      </div>

      {/* ABOUT MAIN */}
      <section style={{padding:'68px 80px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'60px',alignItems:'center'}}>
          <div style={{position:'relative'}}>
            <div style={{borderRadius:'12px',overflow:'hidden',aspectRatio:'4/3'}}>
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" alt="Factory" style={{width:'100%',height:'100%',objectFit:'cover'}} />
            </div>
            <div style={{background:'#8B0020',color:'#fff',padding:'22px 26px',borderRadius:'10px',marginTop:'-36px',marginRight:'-28px',position:'relative',zIndex:2}}>
              <span style={{fontSize:'48px',color:'rgba(255,255,255,0.3)',lineHeight:'.8',display:'block',marginBottom:'9px'}}>"</span>
              <p style={{fontSize:'13px',lineHeight:'1.75',marginBottom:'10px'}}>
                {lang==='ar'?'مهمتنا هي تحويل الأفكار إلى بيئات عمرانية استثنائية تلهم المجتمعات وترتقي بأسلوب الحياة الحديث.':'Our mission is to transform ideas into exceptional urban environments that inspire communities and elevate modern living.'}
              </p>
              <div style={{fontSize:'11.5px',opacity:.8,borderTop:'1px solid rgba(255,255,255,0.25)',paddingTop:'9px'}}>
                <strong>م. محمد إبراهيم</strong> — {lang==='ar'?'مهندس معماري':'Architectural Engineer'}
              </div>
            </div>
          </div>
          <div>
            <div style={S.label}>{lang==='ar'?'قصتنا':'Our Story'}</div>
            <h2 style={S.sectionTitle}>
              {lang==='ar'?'اكتشف مستقبل التصميم الحضري ':' Explore the Future of Urban Design '}
              <span style={{color:'#8B0020'}}>{lang==='ar'?'مع مصنع العمران':'with Al Omran'}</span>
            </h2>
            <p style={{fontSize:'14px',color:'#555',lineHeight:'1.85',marginBottom:'14px'}}>
              {lang==='ar'?'منذ عام 2012، ومصنع العمران يضع بصمته في تطوير المدن العصرية، ملتزماً بدعم رؤية المملكة 2030 من خلال تقديم حلول مبتكرة في الأثاث الحضري والبناء المعياري. نسعى لمساعدة عملائنا على تحقيق أقصى استفادة من المساحات الحضرية، بتصاميم تجمع بين الأناقة والعملية والاستدامة.':'Since 2012, Al Omran Factory has established itself in the development of modern cities, dedicated to advancing the Kingdom Vision 2030 by offering innovative solutions in urban furniture and modular construction. We aim to assist our customers in optimizing urban spaces through designs that blend elegance, practicality, and sustainability.'}
            </p>
            <p style={{fontSize:'14px',color:'#555',lineHeight:'1.85',marginBottom:'28px'}}>
              {lang==='ar'?'نقدم مجموعة واسعة من المنتجات المصنوعة من حجر الرخام المركب والخرسانة عالية الجودة، سواء بتصاميم تقليدية أو معاصرة، مع خيارات متنوعة من الألوان والأشكال الجذابة.':'We provide an extensive selection of products crafted from premium composite marble stone and concrete, available in both traditional and contemporary designs, featuring a diverse array of appealing colors and shapes.'}
            </p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              {values.map((v,i)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'8px'}}>
                  <span style={{color:'#8B0020',fontWeight:700,marginTop:'2px'}}>{v.icon}</span>
                  <span style={{fontSize:'13.5px',fontWeight:600}}>{lang==='ar'?v.ar:v.en}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section style={{background:'#f8f8f8',padding:'68px 80px'}}>
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <div style={S.label}>{lang==='ar'?'رؤيتنا ورسالتنا':'Vision & Mission'}</div>
          <h2 style={{...S.sectionTitle,textAlign:'center'}}>{lang==='ar'?'ما الذي يحركنا':'What Drives Us'}</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'20px'}}>
          {[
            { titleAr:'رؤيتنا', titleEn:'Our Vision', icon:'🎯', descAr:'أن نكون الاسم الأول الذي يتبادر إلى الأذهان عند الحديث عن الجودة في المنتجات الإسمنتية والأثاث الحضري، عبر التزامنا بالتميز والابتكار والاستدامة.', descEn:'To be the leading name in quality cement products and urban furniture, driven by our commitment to excellence, innovation, and sustainability.' },
            { titleAr:'رسالتنا', titleEn:'Our Mission', icon:'🚀', descAr:'نؤمن بأن كل حجر أساس وكل منتج إسمنتي يحمل في طياته قصة نجاح. لهذا نسعى جاهدين لتقديم منتجات عالية الجودة صديقة للبيئة ومواكبة للتطورات الحديثة.', descEn:'We believe every foundation stone carries a success story. That is why we strive to deliver high-quality, eco-friendly products that are aligned with modern developments.' },
            { titleAr:'قيمنا', titleEn:'Our Values', icon:'💎', descAr:'الجودة بلا تنازل، الاستدامة البيئية، الابتكار المستمر، الالتزام والثقة، ورضا العملاء هي القيم التي تحكم كل قرار نتخذه وكل منتج نصنعه.', descEn:'Uncompromising quality, environmental sustainability, continuous innovation, commitment and trust, and customer satisfaction are the values governing every decision we make.' },
          ].map((item,i)=>(
            <div key={i} style={{background:'#fff',padding:'28px',borderRadius:'12px',border:'1px solid #eee'}}>
              <div style={{fontSize:'36px',marginBottom:'14px'}}>{item.icon}</div>
              <h3 style={{fontSize:'1rem',fontWeight:700,color:'#8B0020',marginBottom:'10px'}}>{lang==='ar'?item.titleAr:item.titleEn}</h3>
              <p style={{fontSize:'13.5px',color:'#666',lineHeight:'1.75'}}>{lang==='ar'?item.descAr:item.descEn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MATERIALS */}
      <section style={{padding:'68px 80px'}}>
        <div style={S.label}>{lang==='ar'?'خاماتنا':'Our Materials'}</div>
        <h2 style={S.sectionTitle}>{lang==='ar'?'خامات وتشطيبات ':' Premium '}<span style={{color:'#8B0020'}}>{lang==='ar'?'عالية الجودة':'Materials & Finishes'}</span></h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px',marginTop:'28px'}}>
          {[
            { titleAr:'الخرسانة عالية الأداء', titleEn:'High-Performance Concrete', descAr:'يستخدم إسمنت بورتلاند الرمادي أو الأبيض عالي الجودة في إنتاج الخرسانة بالتزامن مع الرخام الطبيعي أو الركام الطبيعي.', descEn:'High quality grey or white Portland cement used in high performance concrete production combined with natural marble or natural aggregates.' },
            { titleAr:'التشطيب المصقول', titleEn:'Polished Finish', descAr:'يُستخدم في التطبيقات التي تتطلب سطحاً خرسانياً ناعماً ومستوياً. يمكن أن تشبه التشطيبات الجرانيت الطبيعي أو التيرازو.', descEn:'Used where a smooth, even concrete surface is required. Finishes can resemble natural granite or terrazzo.' },
            { titleAr:'تشطيب الصنفرة', titleEn:'Sand-Blasted Finish', descAr:'يُنشأ بإطلاق رمل على سطح المنتج مما يزيل الطبقة العلوية الملساء ويخلق سطحاً خشناً ذا ملمس مميز.', descEn:'Created by blasting sand on the product surface, removing the smooth top layer and creating a rough, textured finish.' },
          ].map((m,i)=>(
            <div key={i} style={{background:'#f8f8f8',padding:'24px',borderRadius:'10px',borderRight:'3px solid #8B0020'}}>
              <h3 style={{fontSize:'14px',fontWeight:700,color:'#8B0020',marginBottom:'10px'}}>{lang==='ar'?m.titleAr:m.titleEn}</h3>
              <p style={{fontSize:'13px',color:'#666',lineHeight:'1.75'}}>{lang==='ar'?m.descAr:m.descEn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section style={{background:'#f8f8f8',padding:'68px 80px'}}>
        <div style={{textAlign:'center',marginBottom:'36px'}}>
          <div style={S.label}>{lang==='ar'?'فريقنا':'Our Team'}</div>
          <h2 style={{...S.sectionTitle,textAlign:'center'}}>{lang==='ar'?'تعرف على ':' Meet '}<span style={{color:'#8B0020'}}>{lang==='ar'?'خبرائنا':'Our Experts'}</span></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px'}}>
          {team.map((m)=>(
            <div key={m.name} style={{background:'#fff',border:'1px solid #eee',borderRadius:'12px',overflow:'hidden',textAlign:'center'}}>
              <div style={{aspectRatio:'1',overflow:'hidden'}}><img src={m.img} alt={m.name} style={{width:'100%',height:'100%',objectFit:'cover'}} /></div>
              <div style={{padding:'14px'}}>
                <div style={{fontSize:'13.5px',fontWeight:700,marginBottom:'3px'}}>{m.name}</div>
                <div style={{fontSize:'12px',color:'#888',marginBottom:'9px'}}>{lang==='ar'?m.roleAr:m.roleEn}</div>
                <div style={{width:'27px',height:'27px',background:'#0077b5',borderRadius:'5px',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto',color:'#fff',fontSize:'12px',fontWeight:700}}>in</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{background:'#8B0020',padding:'60px 80px',textAlign:'center'}}>
        <h2 style={{fontSize:'1.8rem',fontWeight:900,color:'#fff',marginBottom:'12px'}}>{lang==='ar'?'انضم إلى قائمة عملائنا الناجحين':'Join Our List of Successful Clients'}</h2>
        <p style={{fontSize:'14px',color:'rgba(255,255,255,0.8)',marginBottom:'24px'}}>{lang==='ar'?'تواصل معنا اليوم للحصول على استشارة مجانية':'Contact us today for a free consultation'}</p>
        <button onClick={()=>navigate('/contact')} style={{padding:'13px 32px',background:'#fff',color:'#8B0020',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:700,cursor:'pointer'}}>
          {lang==='ar'?'تواصل معنا ←':'Contact Us →'}
        </button>
      </section>
    </div>
  )
}
