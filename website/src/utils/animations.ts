// New keyframes not in index.css — injected globally by App.tsx
// Core keyframes (fadeInUp/Left/Right, slideDown, navPulse) live in index.css
export const animationStyles = `
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.93); }
    to   { opacity: 1; transform: scale(1); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 0 0   rgba(139,0,32,0.3); }
    50%       { box-shadow: 0 0 0 8px rgba(139,0,32,0);   }
  }

  /* ── Utility animation classes ── */
  .animate-fadeIn      { animation: fadeIn      0.6s ease-out both; }
  .animate-fadeInUp    { animation: fadeInUp    0.7s ease-out both; }
  .animate-fadeInDown  { animation: fadeInDown  0.7s ease-out both; }
  .animate-fadeInLeft  { animation: fadeInLeft  0.7s ease-out both; }
  .animate-fadeInRight { animation: fadeInRight 0.7s ease-out both; }
  .animate-scaleIn     { animation: scaleIn     0.55s ease-out both; }
  .animate-slideDown   { animation: slideDown   0.4s ease-out both; }
  .animate-float       { animation: float 3s ease-in-out infinite; }
  .animate-glow        { animation: glow  2s ease-in-out infinite; }
`

export function getStaggerDelay(index: number, baseDelay = 0.1): string {
  return `${(index * baseDelay).toFixed(2)}s`
}
