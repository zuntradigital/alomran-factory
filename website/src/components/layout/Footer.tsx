import { useTranslation } from 'react-i18next'
import { useLang } from '../../context/LangContext'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const { t } = useTranslation()
  const { lang } = useLang()
  const navigate = useNavigate()

  return (
    <footer style={{background:'#1a1a1a',color:'rgba(255,255,255,0.55)'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'44px 80px 20px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1.8fr 1fr 1fr 1fr',gap:'36px',marginBottom:'36px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'13px'}}>
              <div style={{width:'36px',height:'36px',background:'#8B0020',borderRadius:'7px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:'900',fontSize:'18px'}}>P</div>
              <div>
                <span style={{display:'block',fontSize:'12.5px',fontWeight:'700',color:'#fff'}}>{lang === 'ar' ? 'مصنع العمران للمنتجات الأسمنتية' : 'Al Omran Cement Products'}</span>
                <span style={{display:'block',fontSize:'10px',color:'#8B0020'}}>{t('footer.tagline')}</span>
              </div>
            </div>
            <p style={{fontSize:'12.5px',lineHeight:'1.75',marginBottom:'15px'}}>{lang === 'ar' ? 'نبني مستقبلاً أفضل للمدن من خلال حلول خرسانية مبتكرة ومستدامة.' : 'Building a better future for cities through innovative concrete solutions.'}</p>
            <div style={{display:'flex',gap:'7px'}}>
              {['in','f','ig','yt'].map(s => (
                <a key={s} href="#" style={{width:'31px',height:'31px',borderRadius:'7px',background:'rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'700',transition:'background 0.2s'}}>{s}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{fontSize:'12.5px',fontWeight:'700',color:'#fff',marginBottom:'13px'}}>{lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h4>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'7px'}}>
              {[['/',lang==='ar'?'الرئيسية':'Home'],['/about',lang==='ar'?'من نحن':'About'],['/products',lang==='ar'?'المنتجات':'Products'],['/projects',lang==='ar'?'المشاريع':'Projects'],['/contact',lang==='ar'?'تواصل معنا':'Contact']].map(([to,label])=>(
                <li key={to}><button onClick={()=>navigate(to)} style={{fontSize:'12.5px',background:'none',border:'none',color:'rgba(255,255,255,0.55)',cursor:'pointer'}}>{label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{fontSize:'12.5px',fontWeight:'700',color:'#fff',marginBottom:'13px'}}>{lang === 'ar' ? 'خدماتنا' : 'Our Services'}</h4>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'7px'}}>
              {(lang==='ar'?['أثاث حضري','واجهات معمارية','خرسانة مسبقة الصب','حجر مصنّع','حلول مخصصة']:['Urban Furniture','Architectural Products','Precast Concrete','Engineered Stone','Custom Solutions']).map(s=>(
                <li key={s}><span style={{fontSize:'12.5px'}}>{s}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{fontSize:'12.5px',fontWeight:'700',color:'#fff',marginBottom:'13px'}}>{lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}</h4>
            <div style={{fontSize:'12.5px',lineHeight:'1.8'}}>
              <p>+966 11 123 4567</p>
              <p>info@alomranprecast.com</p>
              <p style={{marginTop:'4px'}}>{lang==='ar'?'المدينة الصناعية الثانية، الرياض':'2nd Industrial City, Riyadh'}</p>
            </div>
          </div>
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:'18px',display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:'12px'}}>
          <span>{t('footer.copyright')}</span>
          <div style={{display:'flex',gap:'18px'}}>
            <a href="#" style={{color:'rgba(255,255,255,0.55)'}}>{t('footer.privacy')}</a>
            <a href="#" style={{color:'rgba(255,255,255,0.55)'}}>{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
