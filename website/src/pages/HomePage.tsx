import React, { useState, useEffect, useRef } from 'react'
import { useLang } from '../context/LangContext'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal, useScrollRevealList } from '../hooks/useScrollReveal'
import mohammedImg from '../assets/team/mohammed.jpg'
import ahmedImg from '../assets/team/ahmed.jpg'
import khalidImg from '../assets/team/khalid.jpg'
import noufImg from '../assets/team/nouf.jpg'

function parseNum(str: string) {
  const m = str.match(/^(\d+)(.*)$/)
  return m ? { value: Number(m[1]), suffix: m[2] } : { value: 0, suffix: str }
}

function CountUpStat({ num, style }: { num: string; style?: React.CSSProperties }) {
  const { value, suffix } = parseNum(num)
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let done = false
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done) {
        done = true
        const start = performance.now()
        const dur = 1400
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1)
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * value))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])
  return <div ref={ref} style={style}>{count}{suffix}</div>
}

export default function HomePage() {
  const { lang } = useLang()
  const navigate = useNavigate()

  const featuresRef  = useScrollReveal()
  const aboutRef     = useScrollReveal()
  const statsRef     = useScrollReveal()
  const projHeaderRef = useScrollReveal()
  const teamRef      = useScrollReveal()
  const projectCardRef = useScrollRevealList(5, 0.1)
  const teamCardRef    = useScrollRevealList(4, 0.1)

  const projects = [
    { img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', titleAr:'جلسات خارجية', titleEn:'Outdoor Seating Solutions', descAr:'جلسات مريحة وعصرية للمساحات الخارجية', descEn:'Stylish and comfortable outdoor seating' },
    { img:'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=500&q=80', titleAr:'ساحات عامة وممرات', titleEn:'Public Squares & Walkways', descAr:'مساحات آمنة وجذابة للمشاة', descEn:'Safe and attractive pedestrian areas' },
    { img:'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=500&q=80', titleAr:'حلول خرسانة مسبقة الصب', titleEn:'Precast Concrete Solutions', descAr:'أنظمة خرسانية عالية الجودة', descEn:'High-quality precast concrete systems' },
    { img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80', titleAr:'أثاث حضري', titleEn:'Urban Furniture', descAr:'أثاث أنيق ومتين للمساحات العامة', descEn:'Elegant and durable public space furniture' },
    { img:'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&q=80', titleAr:'واجهات معمارية', titleEn:'Architectural Facades', descAr:'حلول معمارية مبتكرة', descEn:'Innovative architectural solutions' },
  ]

  const team = [
    { name:'Mohammed Ibrahim', roleAr:'الرئيس التنفيذي والمؤسس', roleEn:'CEO & Founder', img: mohammedImg },
    { name:'Ahmed Alharbi', roleAr:'مدير المشاريع', roleEn:'Project Director', img: ahmedImg },
    { name:'Khalid Almutairi', roleAr:'مدير الهندسة', roleEn:'Engineering Manager', img: khalidImg },
    { name:'Nouf Alshammari', roleAr:'مدير التصميم', roleEn:'Design Manager', img: noufImg },
  ]

  const stats = [
    { num:'30+', labelAr:'سنة خبرة في القطاع', labelEn:'Years in the Industry' },
    { num:'12K+', labelAr:'عميل راضٍ', labelEn:'Satisfied Clients' },
    { num:'84+', labelAr:'مشروع منجز', labelEn:'Projects Done' },
    { num:'37+', labelAr:'جائزة صناعية', labelEn:'Industry Awards' },
  ]

  return (
    <div>

      {/* HERO */}
      <section className="hp-hero" style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'grid',
        gridTemplateColumns: lang === 'ar' ? '55% 45%' : '45% 55%',
        direction: lang === 'ar' ? 'rtl' : 'ltr',
        background: '#fff',
        overflow: 'hidden',
      }}>
        {/* TEXT COLUMN — first in DOM; RTL places it on the right, LTR on the left */}
        <div className="hp-hero-text" style={{
          padding: lang === 'ar' ? '60px 80px 60px 48px' : '60px 48px 60px 80px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <p style={{
            fontSize: '12px', fontWeight: 600, color: '#8B0020',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px',
            animation: 'fadeInUp 0.5s ease 0.1s both',
          }}>
            {lang === 'ar' ? 'مصنع العمران للمنتجات الأسمنتية' : 'Al Omran Precast Concrete Factory'}
          </p>

          {lang === 'ar' ? (
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '22px', color: '#1a1a1a', animation: 'fadeInUp 0.6s ease 0.3s both' }}>
              نشكّل مستقبل<br />
              <span style={{ color: '#8B0020' }}>التصميم العمراني</span><br />
              <span style={{ color: '#8B0020' }}>المستدام</span>
            </h1>
          ) : (
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '22px', color: '#1a1a1a', animation: 'fadeInUp 0.6s ease 0.3s both' }}>
              We Shape the Future of<br />
              <span style={{ color: '#8B0020' }}>Urban Design</span>
            </h1>
          )}

          <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.8, maxWidth: '460px', marginBottom: '10px', animation: 'fadeInUp 0.5s ease 0.5s both' }}>
            {lang === 'ar'
              ? 'نصنع منتجات خرسانية مسبقة الصب بأعلى معايير الجودة لتحويل المساحات العمرانية إلى بيئات استثنائية.'
              : 'We craft precast concrete products to the highest quality standards, transforming urban spaces into exceptional environments.'}
          </p>
          <p style={{ fontSize: '13.5px', color: '#555', lineHeight: 1.8, maxWidth: '460px', marginBottom: '36px', animation: 'fadeInUp 0.5s ease 0.55s both' }}>
            {lang === 'ar'
              ? 'خبرة تمتد لأكثر من عقد في تصميم وتنفيذ مشاريع الأثاث الحضري والخرسانة المعمارية.'
              : 'Over a decade of expertise in designing and delivering urban furniture and architectural concrete projects.'}
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', animation: 'fadeInUp 0.5s ease 0.7s both' }}>
            <button onClick={() => navigate('/contact')} style={{
              padding: '12px 28px', background: '#8B0020', color: '#fff',
              border: 'none', borderRadius: '7px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            }}>
              {lang === 'ar' ? 'تواصل معنا ←' : 'Contact Us →'}
            </button>
            <button onClick={() => navigate('/projects')} style={{
              padding: '12px 28px', background: '#fff', border: '1.5px solid #ddd',
              borderRadius: '7px', fontSize: '14px', fontWeight: 600, color: '#333', cursor: 'pointer',
            }}>
              {lang === 'ar' ? 'استكشف مشاريعنا ←' : 'Explore Our Projects →'}
            </button>
          </div>
        </div>

        {/* IMAGE COLUMN — second in DOM; RTL places it on the left, LTR on the right */}
        <div className="hp-hero-img" style={{ overflow: 'hidden', animation: lang === 'ar' ? 'fadeInLeft 0.7s ease 0.2s both' : 'fadeInRight 0.7s ease 0.2s both' }}>
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85"
            alt={lang === 'ar' ? 'مصنع العمران - مبنى خرسانة حديث' : 'Al Omran - modern precast concrete building'}
            fetchPriority="high"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featuresRef} className="hp-features-section" style={{
        background: '#fff', padding: '40px 80px',
        borderTop: '1px solid #eee', borderBottom: '1px solid #eee',
        direction: lang === 'ar' ? 'rtl' : 'ltr',
      }}>
        <div className="hp-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '32px' }}>
          {([
            {
              icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8B0020" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
              titleAr: 'جودة فائقة', titleEn: 'Premium Quality',
              descAr: 'منتجاتنا مصنّعة وفق أعلى معايير الجودة باستخدام مواد متطورة.',
              descEn: 'Products manufactured to the highest quality standards using advanced materials.',
            },
            {
              icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8B0020" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
              titleAr: 'تصاميم مبتكرة', titleEn: 'Innovative Designs',
              descAr: 'تصاميم معاصرة تجمع بين الجماليات والوظيفية.',
              descEn: 'Contemporary designs combining aesthetics and functionality.',
            },
            {
              icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8B0020" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 13.5c0 0 4-2 6-5 0 0 3 4 6 5 0 0-2 4-6 4S6.5 13.5 6.5 13.5z"/></svg>,
              titleAr: 'الاستدامة', titleEn: 'Sustainability',
              descAr: 'حلول صديقة للبيئة لخلق قيمة دائمة للأجيال القادمة.',
              descEn: 'Eco-friendly solutions creating lasting value for future generations.',
            },
            {
              icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8B0020" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M6.8 12A6 6 0 0117.2 12"/><path d="M12 3v3M3 12h18"/></svg>,
              titleAr: '+10 سنوات من الخبرة', titleEn: '10+ Years of Experience',
              descAr: 'فريق متخصص من المهندسين يقدم التميز في كل مشروع.',
              descEn: 'A specialized team delivering excellence across every project.',
            },
          ] as const).map((f, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
              {f.icon}
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', marginTop: '10px', marginBottom: '6px' }}>
                {lang === 'ar' ? f.titleAr : f.titleEn}
              </div>
              <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.7' }}>
                {lang === 'ar' ? f.descAr : f.descEn}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section ref={aboutRef} className="hp-about-section" style={{ padding: '68px 80px', background: '#fff', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
        <div className="hp-about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>

          {/* IMAGE + QUOTE — order:2 in AR pushes it to the LEFT slot of an RTL grid; order:1 in EN keeps it LEFT in LTR */}
          <div style={{ position: 'relative', order: lang === 'ar' ? 2 : 1 }}>
            <div style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3' }}>
              <img
                src={mohammedImg}
                alt={lang === 'ar' ? 'م. محمد إبراهيم - الرئيس التنفيذي لمصنع العمران' : 'Mohammed Ibrahim - CEO of Al Omran Factory'}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
              />
            </div>
            <div className="hp-about-quote" style={{
              background: '#8B0020', color: '#fff', padding: '22px 26px',
              borderRadius: '10px', marginTop: '-40px', marginRight: '-28px',
              position: 'relative', zIndex: 2,
            }}>
              <span style={{
                fontSize: '52px', color: 'rgba(255,255,255,0.3)',
                lineHeight: '.8', display: 'block', marginBottom: '10px',
                fontFamily: 'Georgia, serif',
              }}>"</span>
              <p style={{ fontSize: '13.5px', lineHeight: 1.75, marginBottom: '10px' }}>
                {lang === 'ar'
                  ? 'مهمتنا هي تحويل الأفكار إلى بيئات عمرانية استثنائية تلهم المجتمعات وتدوم للأجيال.'
                  : 'Our mission is to transform ideas into exceptional urban environments that inspire communities and endure for generations.'}
              </p>
              <div style={{ fontSize: '11.5px', opacity: .8, borderTop: '1px solid rgba(255,255,255,0.25)', paddingTop: '9px' }}>
                <strong>م. محمد إبراهيم</strong> — {lang === 'ar' ? 'مهندس معماري' : 'Architectural Engineer'}
              </div>
            </div>
          </div>

          {/* TEXT — order:1 in AR = RIGHT slot in RTL grid; order:2 in EN = RIGHT slot in LTR grid */}
          <div style={{ order: lang === 'ar' ? 1 : 2 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#8B0020', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
              {lang === 'ar' ? 'من نحن' : 'About Us'}
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.25, marginBottom: '14px' }}>
              {lang === 'ar' ? (
                <>نبني المستقبل بالجودة <span style={{ color: '#8B0020' }}>والابتكار</span></>
              ) : (
                <>Building the Future with <span style={{ color: '#8B0020' }}>Excellence and Innovation</span></>
              )}
            </h2>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.85, marginBottom: '12px' }}>
              {lang === 'ar'
                ? 'في مصنع العمران، نؤمن أن المساحات العمرانية المتميزة تبدأ بتصميم استثنائي وحرفية متفوقة. نقدم مجموعة شاملة من الأثاث الحضري والمنتجات المعمارية والخرسانة عالية الجودة مسبقة الصب.'
                : 'At Al Omran Factory, we believe outstanding urban spaces begin with exceptional design and superior craftsmanship. We provide a comprehensive range of urban furniture, architectural products, and high-quality precast concrete.'}
            </p>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.85, marginBottom: '26px' }}>
              {lang === 'ar'
                ? 'بفضل خبرة تمتد لأكثر من عقد، يلتزم فريقنا بتقديم منتجات تلبي أعلى معايير الجودة والمتانة.'
                : 'With over a decade of expertise, our team is committed to delivering products that meet the highest standards of quality and durability.'}
            </p>
            <div style={{ display: 'flex', gap: '36px', padding: '18px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
              {stats.map((s) => (
                <div key={s.num}>
                  <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '3px' }}>{lang === 'ar' ? s.labelAr : s.labelEn}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* STATS BAND */}
      <section ref={statsRef} className="hp-stats-section" style={{ background: '#1a1a1a', padding: '48px 80px', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
        <div className="hp-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px', textAlign: 'center' }}>
          {[
            {
              num: '30+', labelAr: 'سنة من الخبرة', labelEn: 'Years of Experience',
              icon: (<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></>),
            },
            {
              num: '12K+', labelAr: 'عميل راضٍ', labelEn: 'Satisfied Clients',
              icon: (<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>),
            },
            {
              num: '84+', labelAr: 'مشروع منجز', labelEn: 'Projects Completed',
              icon: (<><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22V12h6v10"/><path d="M9 7h.01M15 7h.01"/></>),
            },
            {
              num: '37+', labelAr: 'جائزة وشهادة صناعية', labelEn: 'Awards & Certifications',
              icon: (<><circle cx="12" cy="9" r="6"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>),
            },
          ].map((s) => (
            <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '44px', height: '44px',
                border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(255,255,255,0.65)" strokeWidth="1.75"
                  strokeLinecap="round" strokeLinejoin="round">
                  {s.icon}
                </svg>
              </div>
              <CountUpStat num={s.num} style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', lineHeight: 1 }} />
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                {lang === 'ar' ? s.labelAr : s.labelEn}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="hp-projects-section" style={{ background: '#f8f8f8', padding: '68px 80px', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
        <div ref={projHeaderRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '26px' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', fontWeight: 800, color: '#1a1a1a' }}>
            {lang === 'ar'
              ? <> مشاريعنا <span style={{ color: '#8B0020' }}>المميزة</span></>
              : <>Our <span style={{ color: '#8B0020' }}>Signature Projects</span></>}
          </h2>
          <button onClick={() => navigate('/projects')} style={{
            padding: '8px 17px', border: '1.5px solid #ddd', borderRadius: '6px',
            fontSize: '13px', fontWeight: 600, color: '#333', background: '#fff', cursor: 'pointer',
          }}>
            {lang === 'ar' ? 'عرض جميع المشاريع ←' : 'View All Projects →'}
          </button>
        </div>
        <div className="hp-projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '13px' }}>
          {projects.map((p, i) => (
            <div
              key={i}
              ref={projectCardRef(i) as unknown as React.RefCallback<HTMLDivElement>}
              onClick={() => navigate('/projects')}
              style={{ borderRadius: '10px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
              onMouseEnter={e => {
                const img = e.currentTarget.querySelector('img') as HTMLImageElement
                if (img) img.style.transform = 'scale(1.05)'
                const overlay = e.currentTarget.querySelector('.proj-overlay') as HTMLElement
                if (overlay) overlay.style.background = 'linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%)'
              }}
              onMouseLeave={e => {
                const img = e.currentTarget.querySelector('img') as HTMLImageElement
                if (img) img.style.transform = 'scale(1)'
                const overlay = e.currentTarget.querySelector('.proj-overlay') as HTMLElement
                if (overlay) overlay.style.background = 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 55%)'
              }}
            >
              <img
                src={p.img}
                alt={lang === 'ar' ? p.titleAr : p.titleEn}
                loading="lazy"
                style={{
                  width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block',
                  opacity: 0.85, transition: 'transform 0.4s ease', transform: 'scale(1)',
                }}
              />
              <div className="proj-overlay" style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 55%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '13px',
                transition: 'background 0.3s ease',
              }}>
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700, marginBottom: '3px' }}>
                  {lang === 'ar' ? p.titleAr : p.titleEn}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11.5px' }}>
                  {lang === 'ar' ? p.descAr : p.descEn}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section ref={teamRef} className="hp-team-section" style={{ padding: '68px 80px', background: '#fff', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#8B0020', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              {lang === 'ar' ? 'فريقنا' : 'Our Team'}
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', fontWeight: 800, color: '#1a1a1a' }}>
              {lang === 'ar'
                ? <>تعرف على <span style={{ color: '#8B0020' }}>خبرائنا</span></>
                : <>Meet <span style={{ color: '#8B0020' }}>Our Experts</span></>}
            </h2>
          </div>
          <button onClick={() => navigate('/about')} style={{
            padding: '8px 17px', border: '1.5px solid #ddd', borderRadius: '6px',
            fontSize: '13px', fontWeight: 600, color: '#333', background: '#fff', cursor: 'pointer',
          }}>
            {lang === 'ar' ? 'عرض فريق العمل ←' : 'View Our Team →'}
          </button>
        </div>

        {/* Grid: 4 team cards + 1 CTA */}
        <div className="hp-team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr) 260px', gap: '16px', alignItems: 'start' }}>
          {team.map((m) => (
            <div
              key={m.name}
              ref={teamCardRef(team.indexOf(m)) as unknown as React.RefCallback<HTMLDivElement>}
              style={{
                background: '#fff', border: '1px solid #eee', borderRadius: '12px',
                overflow: 'hidden', textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-4px)'
                el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'none'
                el.style.boxShadow = 'none'
              }}
            >
              <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                <img
                  src={m.img} alt={m.name}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                />
              </div>
              <div style={{ padding: '14px 12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', marginBottom: '3px' }}>{m.name}</div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>{lang === 'ar' ? m.roleAr : m.roleEn}</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label={`${m.name} LinkedIn`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '28px', height: '28px', background: '#0077b5',
                      borderRadius: '5px', color: '#fff', fontSize: '13px',
                      fontWeight: 700, fontStyle: 'italic', textDecoration: 'none',
                    }}>
                    in
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* CTA CARD */}
          <div className="hp-cta-card" style={{
            background: '#8B0020', color: '#fff', borderRadius: '12px',
            padding: '28px 24px', display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', minHeight: '280px',
          }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1.35, marginBottom: '10px' }}>
                {lang === 'ar' ? 'هل لديك مشروع في ذهنك؟' : 'Have a Project in Mind?'}
              </h3>
              <p style={{ fontSize: '13px', opacity: .85, lineHeight: 1.7, marginBottom: '20px' }}>
                {lang === 'ar'
                  ? 'تواصل مع مصنع العمران لإنشاء مساحات حضرية استثنائية تستحق الفخر.'
                  : 'Partner with Al Omran to create exceptional urban spaces worth pride.'}
              </p>
            </div>
            <button onClick={() => navigate('/contact')} style={{
              padding: '11px 18px', background: '#fff', color: '#8B0020',
              border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            }}>
              {lang === 'ar' ? 'تواصل معنا الآن ←' : 'Get in Touch Today →'}
            </button>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="hp-cta-band" style={{
        background: '#8B0020', padding: '48px 80px',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '48px', alignItems: 'center',
        direction: lang === 'ar' ? 'rtl' : 'ltr',
      }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', lineHeight: 1.3, marginBottom: '10px' }}>
            {lang === 'ar' ? 'هل أنت مستعد لبدء مشروعك؟' : 'Ready to Start Your Project?'}
          </h2>
          <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: '20px' }}>
            {lang === 'ar' ? 'تواصل معنا الآن للحصول على استشارة مجانية وعرض سعر مخصص.' : 'Contact us for a free consultation and customized quote.'}
          </p>
          <button onClick={() => navigate('/contact')} style={{
            padding: '11px 24px', border: '2px solid rgba(255,255,255,0.6)',
            color: '#fff', background: 'transparent', borderRadius: '7px',
            fontSize: '13.5px', fontWeight: 700, cursor: 'pointer',
          }}>
            {lang === 'ar' ? 'تواصل معنا ←' : 'Contact Us →'}
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { icon: '📍', textAr: 'المدينة الصناعية الثانية، الرياض، المملكة العربية السعودية', textEn: '2nd Industrial City, Riyadh, Kingdom of Saudi Arabia' },
            { icon: '📞', textAr: '+966 11 123 4567', textEn: '+966 11 123 4567' },
            { icon: '✉️', textAr: 'info@alomranprecast.com', textEn: 'info@alomranprecast.com' },
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '11px', color: '#fff' }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>{c.icon}</span>
              <span style={{ fontSize: '13.5px', opacity: 0.9, lineHeight: 1.6 }}>{lang === 'ar' ? c.textAr : c.textEn}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginBottom: '8px' }}>
            {lang === 'ar' ? 'اشترك في نشرتنا الإخبارية' : 'Subscribe to Our Newsletter'}
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: '12px' }}>
            {lang === 'ar' ? 'احصل على آخر أخبارنا وعروضنا مباشرة في بريدك.' : 'Get our latest news and offers delivered to your inbox.'}
          </p>
          <input type="email" placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
            style={{
              width: '100%', padding: '10px 13px', marginBottom: '7px',
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '6px', color: '#fff', fontSize: '13px', outline: 'none',
              boxSizing: 'border-box',
            } as React.CSSProperties} />
          <button style={{ width: '100%', padding: '10px', background: '#fff', color: '#8B0020', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
            {lang === 'ar' ? 'اشترك الآن ←' : 'Subscribe Now →'}
          </button>
        </div>
      </section>

      <style>{`
        /* ── TABLET 768–1200px ── */
        @media (min-width: 769px) and (max-width: 1200px) {
          .hp-hero-text { padding: 40px 40px !important; }
          .hp-features-section { padding: 32px 40px !important; }
          .hp-features-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .hp-about-section { padding: 48px 40px !important; }
          .hp-stats-section { padding: 36px 40px !important; }
          .hp-projects-section { padding: 48px 40px !important; }
          .hp-projects-grid { grid-template-columns: repeat(3,1fr) !important; }
          .hp-team-section { padding: 48px 40px !important; }
          .hp-team-grid { grid-template-columns: repeat(2,1fr) !important; }
          .hp-cta-card { grid-column: 1 / -1 !important; }
          .hp-cta-band { padding: 40px 40px !important; gap: 32px !important; }
        }
        /* ── MOBILE < 768px ── */
        @media (max-width: 768px) {
          .hp-hero { grid-template-columns: 1fr !important; min-height: auto !important; }
          .hp-hero-text { padding: 40px 20px !important; order: 1 !important; }
          .hp-hero-img { display: none !important; }
          .hp-features-section { padding: 28px 20px !important; }
          .hp-features-grid { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
          .hp-about-section { padding: 40px 20px !important; }
          .hp-about-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .hp-about-quote { margin-right: 0 !important; margin-left: 0 !important; }
          .hp-stats-section { padding: 32px 20px !important; }
          .hp-stats-grid { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
          .hp-projects-section { padding: 40px 20px !important; }
          .hp-projects-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .hp-team-section { padding: 40px 20px !important; }
          .hp-team-grid { grid-template-columns: 1fr 1fr !important; }
          .hp-cta-card { grid-column: 1 / -1 !important; }
          .hp-cta-band { grid-template-columns: 1fr !important; gap: 24px !important; padding: 32px 20px !important; }
        }
      `}</style>
    </div>
  )
}
