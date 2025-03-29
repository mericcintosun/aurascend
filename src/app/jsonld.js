export default function generateJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Aurascend",
    "url": "https://aurascend.vercel.app",
    "description": "Aurascend ile duygularını, düşüncelerini ve içsel dünyandaki gizli potansiyeli çözümle. Ruhunun rengini keşfet.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://aurascend.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://instagram.com/aurascend",
      "https://twitter.com/aurascend",
      "https://facebook.com/aurascend"
    ],
    "foundingDate": "2023",
    "keywords": ["aura", "enerji", "kişisel gelişim", "içsel keşif", "yapay zeka", "duygusal analiz"]
  };
} 