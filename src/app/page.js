'use client';

import { useState, useEffect } from 'react';
import { analyzeAuraFromText } from '@/data';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Spinner } from '@/components/Spinner';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [text, setText] = useState('');
  const [auraResult, setAuraResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedKeywords, setDetectedKeywords] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);
  
  const analyzeText = async () => {
    if (!session) return;
    
    // Start analysis animation
    setIsAnalyzing(true);
    setAuraResult(null);
    setDetectedKeywords([]);
    setShowDetails(false);
    setSaveError(null);
    setIsSaving(false);
    
    // Simulate processing time for better UX
    setTimeout(async () => {
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

          // Sonucu veritabanına kaydet
          try {
            setIsSaving(true);
            
            // Veri yapısını güvenli hale getir
            const keywords = Array.isArray(result.analyticData?.detectedKeywords) 
              ? result.analyticData.detectedKeywords 
              : [];
            
            // Veri yapısını doğrulayın ve temizleyin
            const payload = {
              text: text.substring(0, 2000),  // Çok uzun metinleri kırp
              message: result.output.message || "Belirlenemeyen Aura",
              color: result.output.color || "from-purple-500 to-blue-500",
              description: result.output.description || "Aura analizi tamamlandı.",
              detectedKeywords: keywords.slice(0, 20), // En fazla 20 anahtar kelime
              sentimentRatio: parseFloat(result.analyticData?.sentimentRatio || 0)
            };
            
            // Varsa image ekle, yoksa ekleme
            if (result.output.image) {
              payload.image = result.output.image;
            }
            
            const response = await fetch('/api/aura-results', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            });
            
            let responseData;
            try {
              responseData = await response.json();
            } catch (jsonError) {
              setSaveError('API yanıtı işlenirken beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
              setIsSaving(false);
              return;
            }
            
            if (!response.ok) {
              const errorCode = response.status;
              let errorMessage;
              
              switch (errorCode) {
                case 400:
                  errorMessage = `Veri formatı hatası: ${responseData.error || 'Eksik veya hatalı bilgi'}`;
                  break;
                case 401:
                  errorMessage = 'Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.';
                  break;
                case 429:
                  errorMessage = 'Çok fazla istek gönderildi. Lütfen bir süre bekleyip tekrar deneyin.';
                  break;
                case 500:
                case 502:
                case 503:
                  errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
                  break;
                default:
                  errorMessage = responseData.error || 'Sonuç kaydedilemedi';
              }
              
              throw new Error(errorMessage);
            }
            
            // Başarılı yanıt kontrolü
            if (!responseData.success) {
              throw new Error('Sonuç kaydedildi ama yanıt beklenen formatta değil');
            }
            
            setIsSaving(false);
          } catch (error) {
            setSaveError(error.message || 'Sonuç analiz edildi ancak kaydedilemedi.');
            setIsSaving(false);
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
        const errorMessage = error.message || "Bilinmeyen bir hata oluştu";
        
        setAuraResult({
          message: "Analiz Hatası",
          color: "from-red-500 to-red-600",
          description: `Analiz sırasında bir sorun oluştu: ${errorMessage}. Lütfen tekrar deneyin veya farklı bir metin girin.`
        });
        setIsAnalyzing(false);
        setIsSaving(false);
      }
    }, 1500);
  };
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 bg-gradient-to-b from-blue-900 to-black">
      <header className="w-full py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white">
            Aura<span className="text-purple-400">Scend</span>
          </h1>
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="text-white hover:text-purple-400 transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-white/70">{session?.user?.name || session?.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-all"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
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
                <Spinner size="small" className="mr-3" />
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
                    priority
                    loading="eager"
                    quality={90}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0ZXh0AAAAAElYAABYWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyVC08MTY3LjIyOUFTRjo/Tj4yMkhiS0hHSUZJTU1QUFBQUFBQUFBQUFD/2wBDAR0XFyAeIBogHh4gIiAoJCAoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAb/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
              
              {isSaving ? (
                <div className="flex flex-col items-center justify-center">
                  <Spinner size="large" className="mb-2" />
                  <p className="text-gray-500 animate-pulse">
                    Sonuç kaydediliyor...
                  </p>
                </div>
              ) : saveError && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
                  <p className="font-bold">Uyarı</p>
                  <p>Analiz başarılı fakat kayıt sırasında hata oluştu: {saveError}</p>
                  <p className="text-sm mt-2">Lütfen daha sonra tekrar deneyin veya yöneticiyle iletişime geçin.</p>
                </div>
              )}
              
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
              
              <div className="mt-6 text-center">
                <Link 
                  href="/dashboard"
                  className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                >
                  Tüm Aura Sonuçlarımı Gör →
                </Link>
              </div>
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
