import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { useCompanySettings, formatPhone } from '../hooks/useCompanySettings'

export default function ContactPage() {
  const { lang, isRTL } = useLang()
  const s = useCompanySettings()
  const MAPS_SEARCH = `https://www.google.com/maps/search/${encodeURIComponent(s.addressEn)}`
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', product: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError(lang === 'ar' ? 'الاسم مطلوب' : 'Name is required')
      return false
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(lang === 'ar' ? 'بريد إلكتروني صحيح مطلوب' : 'Valid email is required')
      return false
    }
    if (!formData.message.trim()) {
      setError(lang === 'ar' ? 'الرسالة مطلوبة' : 'Message is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          product: formData.product || '',
          message: formData.message,
          source: 'website-contact-form',
        }),
      })
      if (!response.ok) throw new Error('Failed to send message')
      setSubmitting(false)
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', product: '', message: '' })
      setTimeout(() => setSubmitted(false), 6000)
    } catch {
      setSubmitting(false)
      setError(
        lang === 'ar'
          ? 'فشل إرسال الرسالة. حاول مرة أخرى.'
          : 'Failed to send message. Please try again.'
      )
    }
  }

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', minHeight: 'calc(100vh - 68px)', paddingTop: '68px' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes successPop {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        .cf-input {
          width: 100%;
          box-sizing: border-box;
          padding: 13px 16px;
          border: 1.5px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          color: #1a1a1a;
          background: #fff;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          outline: none;
        }
        .cf-input:focus {
          border-color: #8B0020;
          box-shadow: 0 0 0 4px rgba(139, 0, 32, 0.1);
          background: #fafafa;
        }
        .cf-input::placeholder { color: #aaa; }

        .cf-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #444;
          margin-bottom: 5px;
        }

        .btn-primary {
          width: 100%;
          padding: 14px;
          background: #8B0020;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.25s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(139, 0, 32, 0.3);
          font-family: inherit;
        }
        .btn-primary:hover:not(:disabled) {
          background: #6B0018;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 0, 32, 0.35);
        }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

        .btn-maps {
          display: block;
          width: 100%;
          box-sizing: border-box;
          padding: 12px 20px;
          text-align: center;
          background: transparent;
          color: #8B0020;
          border: 1.5px solid #8B0020;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.25s, color 0.25s, transform 0.2s;
          margin-bottom: 24px;
        }
        .btn-maps:hover {
          background: #8B0020;
          color: #fff;
          transform: translateY(-2px);
        }

        .info-card {
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 10px;
          padding: 20px 22px;
          transition: box-shadow 0.25s, border-color 0.25s;
        }
        .info-card:hover {
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.07);
          border-color: rgba(139, 0, 32, 0.25);
        }

        .info-link {
          color: #333;
          text-decoration: none;
          font-size: 14px;
          line-height: 1.5;
          transition: color 0.2s;
          border-bottom: 1px solid transparent;
        }
        .info-link:hover {
          color: #8B0020;
          border-bottom-color: rgba(139, 0, 32, 0.4);
        }

        .map-wrapper {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
          margin-bottom: 18px;
          transition: box-shadow 0.3s;
        }
        .map-wrapper:hover {
          box-shadow: 0 10px 32px rgba(0, 0, 0, 0.14);
        }

        .success-banner {
          animation: successPop 0.4s ease-out;
          padding: 14px 18px;
          background: #e8f5e9;
          border-left: 4px solid #43a047;
          border-radius: 6px;
          color: #2e7d32;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .error-banner {
          padding: 10px 14px;
          background: #fff0f0;
          border-left: 4px solid #e53935;
          border-radius: 6px;
          color: #c62828;
          font-size: 13px;
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .contact-section { padding: 48px 24px !important; }
          .hero-section { padding: 56px 24px !important; }
          .hours-section { padding: 48px 24px !important; }
          .hours-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .contact-section { padding: 36px 16px !important; }
          .hero-section { padding: 40px 16px !important; }
          .hours-section { padding: 36px 16px !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Hero */}
      <section
        className="hero-section"
        style={{
          background: 'linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%)',
          padding: '68px 80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeInUp 0.7s ease-out',
        }}
      >
        <div style={{
          position: 'absolute', top: -60, right: isRTL ? 'auto' : -60, left: isRTL ? -60 : 'auto',
          width: 280, height: 280,
          background: 'radial-gradient(circle, rgba(139,0,32,0.05) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900,
            color: '#1a1a1a',
            marginBottom: '16px',
          }}>
            {lang === 'ar' ? 'اتصل بنا' : 'Get in Touch'}
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            maxWidth: '580px',
            margin: '0 auto',
            lineHeight: 1.8,
          }}>
            {lang === 'ar'
              ? 'نحن هنا للإجابة على أسئلتك والمساعدة في مشروعك. تواصل معنا اليوم.'
              : "We're here to answer your questions and help with your project. Reach out today."}
          </p>
        </div>
      </section>

      {/* Main content: form + map/info */}
      <section
        className="contact-section"
        style={{ padding: '80px', background: '#fff' }}
      >
        <div
          className="contact-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '52px',
            alignItems: 'start',
          }}
        >
          {/* Left: Contact Form */}
          <div style={{ animation: 'slideInLeft 0.7s ease-out' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '28px', color: '#1a1a1a' }}>
              {lang === 'ar' ? 'أرسل لنا رسالة' : 'Send us a Message'}
            </h2>

            {submitted && (
              <div className="success-banner">
                {lang === 'ar'
                  ? '✓ تم استلام رسالتك بنجاح. شكراً لتواصلك، سنرد عليك قريباً!'
                  : '✓ Your message was received successfully. Thank you — we\'ll be in touch soon!'}
              </div>
            )}

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} noValidate>
              <div>
                <label className="cf-label">{lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}</label>
                <input
                  type="text"
                  className="cf-input"
                  placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="cf-label">{lang === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}</label>
                  <input
                    type="email"
                    className="cf-input"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="cf-label">{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
                  <input
                    type="tel"
                    className="cf-input"
                    placeholder="+966 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="cf-label">{lang === 'ar' ? 'نوع المنتج المطلوب' : 'Product Type'}</label>
                <select
                  className="cf-input"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">{lang === 'ar' ? 'اختر نوع المنتج' : 'Select product type'}</option>
                  {[
                    ['مقاعد', 'Benches'],
                    ['طاولات', 'Tables'],
                    ['حاويات نفايات', 'Trash Bins'],
                    ['أحواض زهور', 'Planters'],
                    ['حواجز خرسانية', 'Concrete Barriers'],
                    ['بوالرد', 'Bollards'],
                    ['مصدات سيارات', 'Wheel Stoppers'],
                    ['أخرى', 'Other'],
                  ].map(([ar, en]) => (
                    <option key={ar} value={lang === 'ar' ? ar : en}>
                      {lang === 'ar' ? ar : en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="cf-label">{lang === 'ar' ? 'تفاصيل المشروع *' : 'Project Details *'}</label>
                <textarea
                  className="cf-input"
                  style={{ minHeight: '130px', resize: 'vertical' }}
                  placeholder={
                    lang === 'ar'
                      ? 'اذكر تفاصيل مشروعك والكميات المطلوبة...'
                      : 'Describe your project and required quantities...'
                  }
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting
                  ? (lang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...')
                  : (lang === 'ar' ? 'إرسال الرسالة ←' : 'Send Message →')}
              </button>
            </form>
          </div>

          {/* Right: Map + Contact Info */}
          <div style={{ animation: 'slideInRight 0.7s ease-out' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '28px', color: '#1a1a1a' }}>
              {lang === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
            </h2>

            {/* Google Maps embed */}
            <div className="map-wrapper" style={{ height: '300px' }}>
              <iframe
                title={lang === 'ar' ? 'موقع مصنع العمران' : 'Al Omran Precast Factory Location'}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3630.7!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDAnMzEuMSJF!5e0!3m2!1sen!2ssa!4v1718347200000"
                style={{ width: '100%', height: '100%', border: 'none' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Open in Google Maps button */}
            <a
              href={MAPS_SEARCH}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-maps"
            >
              📍 {lang === 'ar' ? 'فتح في Google Maps' : 'Open in Google Maps'}
            </a>

            {/* Info cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Address */}
              <div className="info-card">
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#8B0020', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  📍 {lang === 'ar' ? 'العنوان' : 'Address'}
                </div>
                <a href={MAPS_SEARCH} target="_blank" rel="noopener noreferrer" className="info-link">
                  {lang === 'ar' ? s.addressAr : s.addressEn}
                </a>
              </div>

              {/* Phone – Factory */}
              <div className="info-card">
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#8B0020', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  📞 {lang === 'ar' ? 'هاتف المصنع' : 'Factory Phone'}
                </div>
                <a href={`tel:${s.phoneFactory.replace(/\s/g,'')}`} className="info-link" dir="ltr">
                  {formatPhone(s.phoneFactory)}
                </a>
              </div>

              {/* Phone – Head Office */}
              <div className="info-card">
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#8B0020', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  📞 {lang === 'ar' ? 'هاتف المقر الرئيسي' : 'Head Office Phone'}
                </div>
                <a href={`tel:${s.phoneHeadOffice.replace(/\s/g,'')}`} className="info-link" dir="ltr">
                  {formatPhone(s.phoneHeadOffice)}
                </a>
              </div>

              {/* Email */}
              <div className="info-card">
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#8B0020', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ✉️ {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </div>
                <a href={`mailto:${s.contactEmail}`} className="info-link" dir="ltr">
                  {s.contactEmail}
                </a>
              </div>

              {/* Website */}
              <div className="info-card">
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#8B0020', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  🌐 {lang === 'ar' ? 'الموقع الإلكتروني' : 'Website'}
                </div>
                <a href={s.websiteUrl} target="_blank" rel="noopener noreferrer" className="info-link" dir="ltr">
                  {s.websiteUrl.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section
        className="hours-section"
        style={{
          padding: '68px 80px',
          background: 'linear-gradient(135deg, #f9f9f9 0%, #f5f5f5 100%)',
          borderTop: '1px solid #eee',
        }}
      >
        <h2 style={{
          fontSize: '20px',
          fontWeight: 800,
          marginBottom: '32px',
          color: '#1a1a1a',
          textAlign: isRTL ? 'right' : 'left',
        }}>
          {lang === 'ar' ? 'ساعات العمل' : 'Business Hours'}
        </h2>

        <div
          className="hours-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          <div className="info-card">
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: '#8B0020' }}>
              {lang === 'ar' ? 'السبت — الأربعاء' : 'Saturday — Wednesday'}
            </h3>
            <p style={{ fontSize: '14px', color: '#555', margin: 0, lineHeight: 1.6 }}>
              {lang === 'ar' ? '8:00 صباحاً — 4:00 مساءً' : '8:00 AM — 4:00 PM'}
            </p>
          </div>

          <div className="info-card">
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: '#8B0020' }}>
              {lang === 'ar' ? 'الخميس' : 'Thursday'}
            </h3>
            <p style={{ fontSize: '14px', color: '#555', margin: 0, lineHeight: 1.6 }}>
              {lang === 'ar' ? '8:00 صباحاً — 1:00 ظهراً' : '8:00 AM — 1:00 PM'}
            </p>
          </div>

          <div className="info-card">
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: '#8B0020' }}>
              {lang === 'ar' ? 'الجمعة' : 'Friday'}
            </h3>
            <p style={{ fontSize: '14px', color: '#999', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
              {lang === 'ar' ? 'مغلق' : 'Closed'}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
