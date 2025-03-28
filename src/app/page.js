'use client';

import { useState } from 'react';
import { analyzeAuraFromText } from '@/data';
import Image from 'next/image';

export default function Home() {
  const [text, setText] = useState('');
  const [auraResult, setAuraResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedKeywords, setDetectedKeywords] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  
  const analyzeText = () => {
    // Start analysis animation
    setIsAnalyzing(true);
    setAuraResult(null);
    setDetectedKeywords([]);
    setShowDetails(false);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      try {
        // Use our utility function to analyze the text
        const result = analyzeAuraFromText(text);
        
        // Aura çıktısını doğru şekilde ayarla
        if (result.output) {
          // Analiz sonucundaki output nesnesini kullan
          setAuraResult(result.output);
          
          // İşlenen anahtar kelimeleri göster
          if (result.analyticData) {
            setDetectedKeywords(result.analyticData.detectedKeywords || []);
          }
        } else {
          // Eski API uyumluluğu veya output yoksa tüm sonucu kullan
          setAuraResult(result);
          // İşlenen anahtar kelimeleri göster
          if (result.analyticData) {
            setDetectedKeywords(result.analyticData.detectedKeywords || []);
          } else {
            // Eski API uyumluluğu
            setDetectedKeywords(result.keyword ? [result.keyword] : []);
          }
        }
        
        setIsAnalyzing(false);
      } catch (error) {
        console.error("Analiz hatası:", error);
        setAuraResult({
          message: "Analiz sırasında bir hata oluştu",
          color: "from-red-500 to-red-600",
          description: "Lütfen tekrar deneyin veya farklı bir metin girin."
        });
        setIsAnalyzing(false);
      }
    }, 1500);
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 bg-gradient-to-b from-blue-900 to-black">
      <header className="w-full py-4">
        <h1 className="text-4xl sm:text-6xl font-bold text-white text-center">
          Aura<span className="text-purple-400">Scend</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/70 text-center mt-2">
          İçsel dünyanı keşfet, auranı yansıt
        </p>
      </header>
      
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 py-8">
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-lg rounded-xl p-6 sm:p-8 shadow-2xl border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-6">Auranı Analiz Et</h2>
          
          <p className="text-white/80 mb-6">
            Kendini nasıl hissettiğini, düşüncelerini veya içsel durumunu anlatan bir metin yaz. 
            AuraScend, enerjini analiz edip sana özel bir aura oluşturacak.
          </p>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Kendini tanımla, duygularını anlat, içsel dünyandan bahset..."
            className="w-full h-48 p-4 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-6 resize-none"
          />
          
          <button
            onClick={analyzeText}
            disabled={isAnalyzing || text.trim().length < 3}
            className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-all ${isAnalyzing || text.trim().length < 3 ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Auran Analiz Ediliyor...
              </span>
            ) : (
              'Auramı Analiz Et'
            )}
          </button>
        </div>
        
        {auraResult && (
          <div className="mt-10 mb-16 rounded-xl overflow-hidden shadow-xl max-w-3xl mx-auto">
            <div className={`p-8 bg-gradient-to-r ${auraResult.color}`}>
              {auraResult.image && (
                <div className="mb-6 flex justify-center">
                  <Image 
                    src={auraResult.image} 
                    alt={`${auraResult.message} Aura`} 
                    width={500}
                    height={300}
                    className="rounded-lg shadow-lg max-h-[300px] object-cover" 
                  />
                </div>
              )}
              <h3 className="text-3xl font-bold text-white mb-2">{auraResult.message}</h3>
              <p className="text-white/90 text-lg">{auraResult.description}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 border-t border-white/10">
              <h4 className="text-xl font-semibold text-white mb-3">Aura Analizi</h4>
              <p className="text-white/80">
                Enerjin, düşüncelerin ve duyguların bu aurayı oluşturuyor. Bu analiz, içsel dünyanın bir yansıması ve potansiyelinin bir göstergesi.
              </p>
              
              {detectedKeywords.length > 0 && (
                <div className="mt-4">
                  <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-purple-400 hover:text-purple-300 underline text-sm flex items-center"
                  >
                    {showDetails ? 'Detayları Gizle' : 'Analiz Detaylarını Göster'}
                  </button>
                  
                  {showDetails && (
                    <div className="mt-4 bg-black/20 p-4 rounded-lg">
                      <h5 className="text-white font-medium mb-2">Tespit Edilen Anahtar Kelimeler:</h5>
                      <div className="flex flex-wrap gap-2">
                        {detectedKeywords.map((keyword, index) => (
                          <span key={index} className="inline-block bg-white/10 text-white/80 px-2 py-1 rounded-full text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                      
                      {auraResult.analyticData && (
                        <div className="mt-4 text-white/70 text-xs">
                          <p>Bu analiz, metindeki duygu tonları, kelime örüntüleri ve ifade bağlamları değerlendirilerek oluşturuldu.</p>
                          <p className="mt-1">Pozitif/Negatif duygu oranı: {auraResult.analyticData.sentimentRatio}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="w-full py-6 text-center text-white/40">
        <p>AuraScend - İçsel Enerjini Keşfet | © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
