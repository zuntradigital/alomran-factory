import { useState } from 'react'
import { useLang } from '../context/LangContext'

export default function ContactPage() {
  const { lang } = useLang()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({name:'',email:'',phone:'',product:'',message:''})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(()=>setSent(false), 4000)
    setForm({name:'',email:'',phone:'',product:'',message:''})
  }

  const inputStyle = {width:'100%',padding:'10px 13px',border:'1.5px solid #ddd',borderRadius:'7px',fontSize:'13.5px',fontFamily:'inherit',outline:'none',transition:'border-color 0.2s, box-shadow 0.2s'}
  const focusProps = {
    onFocus: (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = '#8B0020'
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,0,32,0.1)'
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = '#ddd'
      e.currentTarget.style.boxShadow = 'none'
    },
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <div style={{paddingTop:'68px',background:'#fff',minHeight:'130px',display:'flex',alignItems:'flex-end',paddingBottom:'28px',paddingLeft:'80px',paddingRight:'80px',borderBottom:'1px solid #eee'}}>
        <div>
          <h1 style={{fontSize:'1.9rem',fontWeight:900,color:'#1a1a1a'}}>{lang==='ar'?'تواصل معنا':'Contact Us'}</h1>
          <div style={{fontSize:'12px',color:'#888',marginTop:'5px'}}>
            <span style={{color:'#8B0020'}}>{lang==='ar'?'الرئيسية':'Home'}</span> / {lang==='ar'?'تواصل معنا':'Contact'}
          </div>
        </div>
      </div>

      {/* CONTACT INFO STRIP */}
      <div style={{background:'#f8f8f8',borderBottom:'1px solid #eee'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 80px',display:'grid',gridTemplateColumns:'repeat(3,1fr)'}}>
          {[
            {icon:'📍',titleAr:'العنوان',titleEn:'Address',textAr:'المدينة الصناعية الثانية، مصنع العمران للمنتجات الأسمنتية، الرياض، المملكة العربية السعودية',textEn:'2nd Industrial City, Al Omran Precast Factory, Riyadh, Kingdom of Saudi Arabia'},
            {icon:'📞',titleAr:'الهاتف',titleEn:'Phone',textAr:'+966 11 123 4567',textEn:'+966 11 123 4567'},
            {icon:'✉️',titleAr:'البريد الإلكتروني',titleEn:'Email',textAr:'info@alomranprecast.com',textEn:'info@alomranprecast.com'},
          ].map((c,i)=>(
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'13px',padding:'24px 16px'}}>
              <div style={{width:'42px',height:'42px',background:'rgba(139,0,32,0.1)',borderRadius:'9px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'18px'}}>{c.icon}</div>
              <div>
                <div style={{fontSize:'13px',fontWeight:700,marginBottom:'3px'}}>{lang==='ar'?c.titleAr:c.titleEn}</div>
                <p style={{fontSize:'13px',color:'#666',lineHeight:'1.6'}}>{lang==='ar'?c.textAr:c.textEn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FORM + MAP */}
      <section style={{padding:'60px 80px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'48px',alignItems:'start'}}>
          <div>
            <h3 style={{fontSize:'1.2rem',fontWeight:800,marginBottom:'22px'}}>{lang==='ar'?'أرسل لنا رسالة':'Send Us a Message'}</h3>
            {sent && (
              <div style={{background:'#dcfce7',border:'1px solid #bbf7d0',borderRadius:'8px',padding:'12px 16px',marginBottom:'16px',color:'#166534',fontSize:'13.5px',fontWeight:600,animation:'scaleIn 0.4s ease-out both'}}>
                ✓ {lang==='ar'?'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.':'Your message was sent successfully! We will contact you soon.'}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              <div>
                <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#444',marginBottom:'4px'}}>{lang==='ar'?'الاسم الكامل *':'Full Name *'}</label>
                <input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder={lang==='ar'?'أدخل اسمك الكامل':'Enter your full name'} style={inputStyle} required {...focusProps} />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                <div>
                  <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#444',marginBottom:'4px'}}>{lang==='ar'?'البريد الإلكتروني *':'Email *'}</label>
                  <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="example@email.com" style={inputStyle} required {...focusProps} />
                </div>
                <div>
                  <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#444',marginBottom:'4px'}}>{lang==='ar'?'رقم الهاتف':'Phone'}</label>
                  <input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+966 XX XXX XXXX" style={inputStyle} {...focusProps} />
                </div>
              </div>
              <div>
                <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#444',marginBottom:'4px'}}>{lang==='ar'?'نوع المنتج المطلوب':'Product Type'}</label>
                <select value={form.product} onChange={e=>setForm({...form,product:e.target.value})} style={{...inputStyle,background:'#fff'}} {...focusProps}>
                  <option value="">{lang==='ar'?'اختر نوع المنتج':'Select product type'}</option>
                  {[['مقاعد','Benches'],['طاولات','Tables'],['حاويات نفايات','Trash Bins'],['أحواض زهور','Planters'],['حواجز خرسانية','Concrete Barriers'],['بوالرد','Bollards'],['مصدات سيارات','Wheel Stoppers'],['أخرى','Other']].map(([ar,en])=>(
                    <option key={ar} value={ar}>{lang==='ar'?ar:en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#444',marginBottom:'4px'}}>{lang==='ar'?'تفاصيل المشروع *':'Project Details *'}</label>
                <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder={lang==='ar'?'اذكر تفاصيل مشروعك وكمياتك المطلوبة...':'Describe your project and required quantities...'} style={{...inputStyle,minHeight:'130px',resize:'vertical'}} required {...focusProps} />
              </div>
              <button type="submit"
                style={{padding:'12px',background:'#8B0020',color:'#fff',border:'none',borderRadius:'7px',fontSize:'14px',fontWeight:700,cursor:'pointer',transition:'transform 0.2s, box-shadow 0.2s',boxShadow:'0 4px 12px rgba(139,0,32,0.3)'}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='scale(1.02)';el.style.boxShadow='0 6px 18px rgba(139,0,32,0.45)'}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='none';el.style.boxShadow='0 4px 12px rgba(139,0,32,0.3)'}}>
                {lang==='ar'?'إرسال الرسالة ←':'Send Message →'}
              </button>
            </form>
          </div>
          <div>
            <h3 style={{fontSize:'1.2rem',fontWeight:800,marginBottom:'22px'}}>{lang==='ar'?'موقعنا':'Our Location'}</h3>
            <div style={{background:'#f5f5f5',borderRadius:'12px',height:'420px',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid #eee',marginBottom:'20px'}}>
              <div style={{textAlign:'center',color:'#aaa'}}>
                <div style={{fontSize:'48px',marginBottom:'12px'}}>📍</div>
                <p style={{fontSize:'13px',fontWeight:600}}>{lang==='ar'?'المدينة الصناعية الثانية، الرياض':'2nd Industrial City, Riyadh'}</p>
                <p style={{fontSize:'12px',marginTop:'4px',color:'#bbb'}}>{lang==='ar'?'المملكة العربية السعودية':'Kingdom of Saudi Arabia'}</p>
              </div>
            </div>
            <div style={{background:'#f8f8f8',borderRadius:'10px',padding:'18px'}}>
              <h4 style={{fontSize:'13px',fontWeight:700,marginBottom:'12px',color:'#8B0020'}}>{lang==='ar'?'ساعات العمل':'Working Hours'}</h4>
              {[[lang==='ar'?'الأحد - الخميس':'Sun - Thu', '8:00 AM - 6:00 PM'],[lang==='ar'?'الجمعة - السبت':'Fri - Sat', lang==='ar'?'مغلق':'Closed']].map(([day,hours])=>(
                <div key={day} style={{display:'flex',justifyContent:'space-between',fontSize:'13px',padding:'6px 0',borderBottom:'1px solid #eee'}}>
                  <span style={{fontWeight:600}}>{day}</span>
                  <span style={{color:'#666'}}>{hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
