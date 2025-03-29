"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function PromptlarPage() {
  const [activeTab, setActiveTab] = useState("dalle");

  const promptData = {
    dalle: [
      {
        title: "Neşe ve Canlılık Aurası",
        prompt:
          "A luminous golden-orange aura radiating joy and vitality around a smiling figure, with small sparkles of light and uplifting energy waves, vibrant and warm atmosphere",
        description:
          "Mutluluk ve canlılık enerjisini yansıtan altın-turuncu aura.",
      },
      {
        title: "Huzur ve Dinginlik Aurası",
        prompt:
          "A serene teal-green aura surrounding a peaceful figure in meditation pose, gentle flowing waves of tranquil energy, soft healing light, calm water elements, and balanced natural harmony",
        description: "Huzur ve dengeyi temsil eden turkuaz-yeşil aura.",
      },
      {
        title: "İyimserlik ve Umut Aurası",
        prompt:
          "A bright cyan-blue aura with upward-moving light patterns, hopeful rays breaking through clouds, sunny optimistic glow, forward-facing silhouette embracing the horizon",
        description: "Umut ve iyimserliği yansıtan mavi-turkuaz aura.",
      },
      {
        title: "Heyecan ve Coşku Aurası",
        prompt:
          "An electric yellow-orange aura with dynamic sparkling energy bursts, excited motion lines, vibrant pulsing light patterns showing enthusiasm and anticipation",
        description:
          "Heyecan ve coşkuyu temsil eden elektrik sarı-turuncu aura.",
      },
      {
        title: "Şefkat ve Sevgi Aurası",
        prompt:
          "A soft rose-pink aura emanating gentle heart-shaped light patterns, nurturing energy waves embracing others, compassionate glow with healing tender qualities",
        description: "Şefkat ve sevgiyi yansıtan pembe-gül rengi aura.",
      },
      {
        title: "Büyüleyici Çekim Aurası",
        prompt:
          "A mesmerizing purple-indigo aura with enchanting spiral patterns, mysterious attractive energy, starlike sparkles of fascination, captivating cosmic swirls",
        description: "Çekicilik ve gizemi temsil eden mor-indigo aura.",
      },
      {
        title: "Güç ve Kararlılık Aurası",
        prompt:
          "A bold red-orange aura with powerful upward flames, strong structured energy beams, solid protective shields, confident radiance emanating determination",
        description: "Güç ve kararlılığı yansıtan kırmızı-turuncu aura.",
      },
      {
        title: "Yenilenme ve Canlanma Aurası",
        prompt:
          "A refreshing emerald-green aura with rejuvenating energy spirals, revitalizing light bursts, uplifting nature elements, renewal symbols and restorative glow",
        description: "Yenilenme ve canlanmayı temsil eden zümrüt-yeşil aura.",
      },
      {
        title: "Umut ve Azim Aurası",
        prompt:
          "A hopeful cyan-blue aura with gentle upward light rays breaking through darkness, aspirational energy reaching skyward, dawn-like glow of possibility",
        description: "Umut ve azmi yansıtan camgöbeği-mavi aura.",
      },
      {
        title: "Melankoli ve Derinlik Aurası",
        prompt:
          "A deep slate-gray aura with thoughtful waves of introspection, beautiful melancholy mist, poetic rain elements, contemplative depth with hints of silver insight",
        description: "Melankoli ve derinliği temsil eden arduvaz grisi aura.",
      },
      {
        title: "Yoğun Tutku Aurası",
        prompt:
          "An intense red-rose aura with sharp jagged energy patterns, powerful flame-like eruptions, strong emotional currents, dynamic passionate intensity",
        description: "Yoğun tutkuyu yansıtan kırmızı-gül rengi aura.",
      },
      {
        title: "Kaygı ve Tetikte Olma Aurası",
        prompt:
          "An amber-yellow aura with nervously flickering energy patterns, cautious protective shields, alert watchful quality, sensitive awareness to surroundings",
        description:
          "Kaygı ve tetikte olma durumunu temsil eden kehribar-sarı aura.",
      },
      {
        title: "Kırılganlık ve Öz-Sorgulama Aurası",
        prompt:
          "A violet-purple aura with inward-curling energy patterns, partially hidden light, questioning swirls, self-reflective mirrors, vulnerable yet truthful quality",
        description: "Kırılganlık ve öz-sorgulamayı yansıtan menekşe-mor aura.",
      },
      {
        title: "Huzur ve Sükunet Aurası",
        prompt:
          "A peaceful blue-sky aura with still, quiet energy layers, centered peaceful balance, minimal ripples, steady consistent flow, peaceful meditative quality",
        description: "Huzur ve sükuneti temsil eden mavi-gök mavisi aura.",
      },
      {
        title: "Derin Düşünce Aurası",
        prompt:
          "A rich indigo-blue aura with complex thought pattern layers, philosophical depth symbols, introspective spirals, contemplative spheres of analysis",
        description: "Derin düşünceyi yansıtan zengin çivit-mavi aura.",
      },
      {
        title: "Merak ve Keşif Aurası",
        prompt:
          "A vibrant purple-indigo aura with question-mark energy patterns, curious exploring tendrils of light, investigative sparks, knowledge-seeking rays",
        description:
          "Merak ve keşif duygusunu temsil eden canlı mor-indigo aura.",
      },
      {
        title: "Kompleks Duygular Aurası",
        prompt:
          "A multidimensional purple-pink aura with interwoven emotional threads of various colors, layered feeling states, complex pattern interactions, deep emotional texture",
        description: "Kompleks duyguları yansıtan çok boyutlu mor-pembe aura.",
      },
      {
        title: "Tutku ve Adanmışlık Aurası",
        prompt:
          "A passionate red-pink aura with intense flame-like energy movements, desire-filled currents, deep emotional fire, powerful directional force of dedication",
        description: "Tutku ve adanmışlığı temsil eden kırmızı-pembe aura.",
      },
      {
        title: "Şefkat ve Empati Aurası",
        prompt:
          "A warm pink-rose aura with gentle heart-centered emanations, nurturing energy fields, connecting bridges to others, compassionate light embracing surroundings",
        description: "Şefkat ve empatiyi yansıtan sıcak pembe-gül rengi aura.",
      },
      {
        title: "Minnettarlık ve Takdir Aurası",
        prompt:
          "A glowing amber-yellow aura with appreciative upward energy flows, grateful light offerings, receptive open patterns, humble abundant radiance",
        description:
          "Minnettarlık ve takdiri temsil eden parlak kehribar-sarı aura.",
      },
      {
        title: "Güvenilirlik ve Destek Aurası",
        prompt:
          "A solid emerald-green aura with stable protective shields, reliable energy structure, trustworthy consistent patterns, supportive foundation elements",
        description:
          "Güvenilirlik ve desteği yansıtan sağlam zümrüt-yeşil aura.",
      },
    ],
    suno: [
      {
        title: "Neşe ve Canlılık Müziği",
        prompt:
          "Bright and cheerful piano melody with light guitar strumming and gentle bells. The tempo is upbeat yet calming, creating a joyful and positive ambiance that feels like a sunny morning.",
        description:
          "Neşeli ve canlı enerjiyi yansıtan parlak piyano melodisi.",
      },
      {
        title: "Huzur ve Dinginlik Müziği",
        prompt:
          "Peaceful ambient soundscape with soft flowing synthesizers and distant piano notes. Incorporate gentle wind chimes and subtle nature sounds that create a tranquil, meditative atmosphere.",
        description:
          "Huzur ve dinginliği temsil eden sakin, doğa seslerinin harmanlandığı ambient müzik.",
      },
      {
        title: "İyimserlik ve Umut Müziği",
        prompt:
          "Optimistic melody with uplifting strings and hopeful piano progression. Add light percussion and airy flutes that build gradually, conveying a sense of possibility and better days ahead.",
        description:
          "İyimserlik ve umut duygusunu yansıtan yaylı çalgılar ve piyano progressiyonu.",
      },
      {
        title: "Heyecan ve Coşku Müziği",
        prompt:
          "Energetic electronic beats with exciting synth arpeggios and dynamic percussion. The rhythm should be fast and vibrant, creating a sense of adventure and enthusiasm.",
        description:
          "Heyecan ve coşkuyu temsil eden enerjik elektronik ritimler.",
      },
      {
        title: "Şefkat ve Sevgi Müziği",
        prompt:
          "Warm and compassionate melody with gentle strings and soft piano. Include delicate harp arpeggios and tender woodwinds that evoke feelings of nurturing comfort and care.",
        description: "Şefkat ve sevgiyi yansıtan sıcak, yumuşak melodiler.",
      },
      {
        title: "Büyüleyici Çekim Müziği",
        prompt:
          "Enchanting composition with mystical harps and ethereal female vocals. Add shimmering bells and celestial synthesizers that create a magical, captivating atmosphere.",
        description:
          "Çekicilik ve gizemi temsil eden büyüleyici, mistik kompozisyon.",
      },
      {
        title: "Güç ve Kararlılık Müziği",
        prompt:
          "Powerful orchestral piece with bold brass sections and confident percussion. The melody should be assertive with strong string movements that convey inner strength and determination.",
        description: "Güç ve kararlılığı yansıtan güçlü orkestral parça.",
      },
      {
        title: "Yenilenme ve Canlanma Müziği",
        prompt:
          "Refreshing melody with bright synth tones and invigorating rhythmic elements. Include playful woodwinds and vibrant strings that feel revitalizing and energizing.",
        description: "Yenilenme ve canlanmayı temsil eden ferahlatıcı melodi.",
      },
      {
        title: "Umut ve İlham Müziği",
        prompt:
          "Hopeful piano progression that gradually builds with uplifting strings. Add gentle choir voices and soft bells that create a sense of dawning light and promise.",
        description:
          "Umut ve ilhamı yansıtan, kademeli olarak yükselen piyano progressiyonu.",
      },
      {
        title: "Melankoli ve Derinlik Müziği",
        prompt:
          "Melancholic piano melody with deep cello undertones and distant echoes. The tempo should be slow and thoughtful, evoking a beautiful sadness and introspection.",
        description:
          "Melankoli ve derinliği temsil eden hüzünlü piyano melodisi.",
      },
      {
        title: "Yoğun Tutku Müziği",
        prompt:
          "Intense industrial percussion with distorted electric guitar and aggressive synthesizers. Create a powerful, driving rhythm that expresses controlled anger and passionate intensity.",
        description: "Yoğun tutkuyu yansıtan güçlü, sürükleyici ritim.",
      },
      {
        title: "Kaygı ve Tetikte Olma Müziği",
        prompt:
          "Anxious ambient soundscape with unsettled strings and minor key piano motifs. Add subtle dissonant elements and tension-building percussion that creates a sense of unease.",
        description:
          "Kaygı ve tetikte olma durumunu temsil eden huzursuz ambient sesler.",
      },
      {
        title: "Kırılganlık ve Öz-Sorgulama Müziği",
        prompt:
          "Hesitant piano notes with uncertain pauses and questioning string phrases. Include subtle dissonance and muted tones that express vulnerability and self-questioning.",
        description:
          "Kırılganlık ve öz-sorgulamayı yansıtan kararsız piyano notaları.",
      },
      {
        title: "Huzur ve Sükunet Müziği",
        prompt:
          "Calm, minimal piano composition with sustained notes and gentle ambient textures. The pace should be unhurried, creating a centered, steady atmosphere of composure.",
        description:
          "Huzur ve sükuneti temsil eden sakin, minimal piyano kompozisyonu.",
      },
      {
        title: "Derin Düşünce Müziği",
        prompt:
          "Contemplative soundscape with thoughtful piano motifs and deep synthesizer pads. Include subtle cello phrases that suggest profound thinking and philosophical depth.",
        description: "Derin düşünceyi yansıtan düşünceli piyano motifleri.",
      },
      {
        title: "Merak ve Keşif Müziği",
        prompt:
          "Curious melody with playful woodwinds and questioning string patterns. Add unusual percussion elements and exploratory synth tones that evoke wonder and discovery.",
        description:
          "Merak ve keşif duygusunu temsil eden oyunbaz tahta üflemeli çalgılar.",
      },
      {
        title: "Kompleks Duygular Müziği",
        prompt:
          "Multi-layered composition with interweaving melodic elements and contrasting emotions. Blend minor and major keys with varied instruments that reflect emotional complexity.",
        description: "Kompleks duyguları yansıtan çok katmanlı kompozisyon.",
      },
      {
        title: "Tutku ve Adanmışlık Müziği",
        prompt:
          "Passionate strings with intense piano crescendos and emotive percussion. The melody should be fervent and expressive, with dramatic dynamic changes that convey deep desire.",
        description:
          "Tutku ve adanmışlığı temsil eden yoğun piyano crescendoları.",
      },
      {
        title: "Şefkat ve Empati Müziği",
        prompt:
          "Warm and loving melody with gentle guitar and tender piano phrases. Include soft string arrangements that feel embracing and create an atmosphere of affection and care.",
        description: "Şefkat ve empatiyi yansıtan sıcak ve sevgi dolu melodi.",
      },
      {
        title: "Minnettarlık ve Takdir Müziği",
        prompt:
          "Grateful and appreciative composition with harmonious string ensemble and thankful piano motifs. Add gentle bell tones that create a sense of recognition and warm acknowledgment.",
        description:
          "Minnettarlık ve takdiri temsil eden uyumlu yaylı çalgılar topluluğu.",
      },
      {
        title: "Güvenilirlik ve Destek Müziği",
        prompt:
          "Reassuring orchestral arrangement with steady rhythm and supportive brass elements. Create a reliable, consistent melody that conveys security and dependability.",
        description:
          "Güvenilirlik ve desteği yansıtan güven verici orkestral düzenleme.",
      },
      {
        title: "Hayat Dolu ve Canlı Müzik",
        prompt:
          "Energetic electronic composition with vibrant rhythms and active melodic movements. Create a powerful, flowing soundscape that conveys constant motion and vitality.",
        description:
          "Hayat dolu ve canlılığı temsil eden enerjik elektronik kompozisyon.",
      },
      {
        title: "Yaratıcılık ve İfade Müziği",
        prompt:
          "Creative composition with colorful instrumentation and expressive melodic phrases. Include painterly sound textures and artistic flourishes that feel like musical brushstrokes.",
        description:
          "Yaratıcılık ve ifadeyi yansıtan renkli, sanatsal kompozisyon.",
      },
      {
        title: "Derin Düşünsel Müzik",
        prompt:
          "Thoughtful ambient soundscape with questioning melodic motifs and contemplative pauses. Create an intellectually stimulating atmosphere that invites deep thinking.",
        description:
          "Derin düşünceyi teşvik eden, düşünceli ambient ses manzarası.",
      },
      {
        title: "Kozmik Bağlantı Müziği",
        prompt:
          "Cosmic orchestral arrangement with expansive spatial effects and universal themes. Include celestial sounds and grand scale that suggests the vastness of the cosmos.",
        description:
          "Kozmik bağlantıyı temsil eden geniş, uzaysal efektli orkestral düzenleme.",
      },
      {
        title: "Çok Boyutlu Duygusal Müzik",
        prompt:
          "Multi-dimensional composition combining diverse instrumental textures and varied emotional states. Create a rich, complex soundscape that contains multiple layers of meaning and feeling.",
        description:
          "Çok boyutlu duyguları yansıtan zengin, karmaşık ses manzarası.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black">
      <div className="container mx-auto py-24 px-4">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Aurascend Yapay Zeka Promptları
        </motion.h1>

        <motion.p
          className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Aurascend&apos;de kullanılan yapay zeka promptlarını şeffaflık
          amacıyla paylaşıyoruz. Bu promptlar, DALL-E 3 ve Suno AI gibi güçlü
          yapay zeka modellerinin nasıl yönlendirildiğini göstermektedir.
        </motion.p>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <motion.div
            className="bg-white/5 backdrop-blur-md rounded-lg p-1 inline-flex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <button
              onClick={() => setActiveTab("dalle")}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "dalle"
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              DALL-E 3 Promptları
            </button>
            <button
              onClick={() => setActiveTab("suno")}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "suno"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Suno AI Promptları
            </button>
          </motion.div>
        </div>

        {/* Prompt Content */}
        <motion.div
          className="grid grid-cols-1 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          {promptData[activeTab].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                {item.title}
              </h3>
              <div className="bg-black/50 p-6 rounded-lg mb-6 overflow-x-auto">
                <pre className="text-green-400 font-mono whitespace-pre-wrap break-words">
                  {item.prompt}
                </pre>
              </div>
              <p className="text-gray-300">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
