'use client';

import { useState, useEffect, useRef } from 'react';
import { analyzeAuraFromText } from '@/data';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Spinner } from '@/components/Spinner';
import AuraPlayer from "@/components/AuraPlayer";

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
  
  // Hero bölümündeki animasyon için kullanılacak state
  const [animateTitle, setAnimateTitle] = useState(false);
  
  // Aura analiz bölümüne scroll yapmak için ref
  const auraAnalysisRef = useRef(null);
  
  // Scroll to aura analysis section
  const scrollToAnalysis = () => {
    if (auraAnalysisRef && auraAnalysisRef.current) {
      auraAnalysisRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  // Login sayfasına otomatik yönlendirme kaldırıldı
  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.push('/auth/login');
  //   }
  // }, [status, router]);
  
  // Sayfaya giriş yapıldığında animasyon başlat
  useEffect(() => {
    setAnimateTitle(true);
  }, []);
  
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
            
            // Varsa music ekle, yoksa ekleme
            if (result.output.music) {
              payload.music = result.output.music;
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
  
  // Features bölümü için içerik
  const features = [
    {
      title: "Kişiselleştirilmiş Aura Analizi",
      description: "İçsel durumunuzu anlayan ve kişiselleştirilmiş aura değerlendirmesi sunan yapay zeka destekli analiz.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Duygu ve Düşünce Analizi",
      description: "Metninizde ifade ettiğiniz duygu ve düşünceleri analiz ederek içsel durumunuzu görselleştirme.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      )
    },
    {
      title: "Kişisel Aura Geçmişi",
      description: "Zaman içinde değişen auranızı takip edin ve ruh halinizin, duygularınızın nasıl evrildiğini gözlemleyin.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];
  
  // Testimonials
  const testimonials = [
    {
      name: "Ayşe Yılmaz",
      role: "Yoga Eğitmeni",
      comment: "Aurascend ile duygularımı daha iyi anlamaya başladım. Meditasyon uygulamalarımda büyük ilerleme kaydettim.",
      avatar: "/images/avatar-1.png",
    },
    {
      name: "Mehmet Kaya",
      role: "Psikolog",
      comment: "Hastalarımla çalışırken duygusal farkındalığı artırmak için harika bir araç. Görsel temsiller çok etkileyici.",
      avatar: "/images/avatar-2.png",
    },
    {
      name: "Zeynep Demir",
      role: "Kişisel Gelişim Koçu",
      comment: "Danışanlarım için müthiş bir içgörü aracı. Aura analizi, kişinin kendini tanıması için mükemmel bir başlangıç noktası.",
      avatar: "/images/avatar-3.png",
    }
  ];
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/stars-bg.jpg')] bg-cover opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-blue-900/70 to-black/70"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 
                className={`text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-1000 ${
                  animateTitle ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}
              >
                İçsel <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Enerjini</span> Keşfet
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                Aurascend ile duygularını, düşüncelerini ve içsel dünyandaki gizli potansiyeli çözümle. Ruhunun rengini keşfet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {status === 'authenticated' ? (
                  <>
                    <button 
                      onClick={scrollToAnalysis}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg text-center transition-all"
                    >
                      Auranı Analiz Et
                    </button>
                    <Link 
                      href="/dashboard" 
                      className="px-8 py-4 border-2 border-purple-500 text-white hover:bg-purple-500/20 font-medium rounded-lg text-center transition-all"
                    >
                      Aura Geçmişim
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/auth/login" 
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg text-center transition-all"
                    >
                      Hemen Başla
                    </Link>
                    <Link 
                      href="/auth/register" 
                      className="px-8 py-4 border-2 border-purple-500 text-white hover:bg-purple-500/20 font-medium rounded-lg text-center transition-all"
                    >
                      Ücretsiz Kaydol
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse blur-xl opacity-70"></div>
                <div className="absolute inset-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse blur-lg opacity-80"></div>
                <div className="absolute inset-20 rounded-full bg-gradient-to-r from-purple-300 to-blue-300 animate-pulse blur-md"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Aura Analiz Bölümü */}
      {status === 'authenticated' && (
        <section ref={auraAnalysisRef} className="py-16 bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
                <span className="text-purple-400">Auranı</span> Analiz Et
              </h2>
              
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 sm:p-8 shadow-2xl border border-white/10">
                <p className="text-white/80 mb-6">
                  Kendini nasıl hissettiğini, düşüncelerini veya içsel durumunu anlatan bir metin yaz. 
                  Aurascend, enerjini analiz edip sana özel bir aura oluşturacak.
                </p>
                
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Kendini tanımla, duygularını anlat, içsel dünyandan bahset..."
                  className="w-full h-48 p-4 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-6 resize-none"
                ></textarea>
                
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
                <div className="mt-10 rounded-xl overflow-hidden shadow-xl mx-auto">
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
                    
                    {auraResult.music && (
                      <div className="mb-6">
                        <AuraPlayer musicSrc={auraResult.music} />
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
            </div>
          </div>
        </section>
      )}
      
      {/* Features Section */}
      <section className="py-20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Aurascend <span className="text-purple-400">Özellikleri</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-purple-500/20 hover:shadow-lg"
              >
                <div className="mb-5">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/features" 
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg inline-block transition-all"
            >
              Detaylı Bilgi
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-black/50 to-blue-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            <span className="text-purple-400">Nasıl</span> Çalışır?
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-20">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
                <div className="text-5xl font-bold text-purple-500 mb-4">1</div>
                <h3 className="text-2xl font-semibold text-white mb-4">Duygularını ve Düşüncelerini Yaz</h3>
                <p className="text-gray-300">
                  Kendini nasıl hissettiğini, düşüncelerini veya içsel durumunu anlatan bir metin yaz. Ne kadar detaylı olursa, analizin o kadar doğru olur.
                </p>
              </div>
              <div className="md:w-1/2 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <div className="h-48 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row-reverse items-center mb-20">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pl-10">
                <div className="text-5xl font-bold text-purple-500 mb-4">2</div>
                <h3 className="text-2xl font-semibold text-white mb-4">Yapay Zeka Analizi</h3>
                <p className="text-gray-300">
                  Gelişmiş yapay zeka algoritmamız, metnini analiz ederek duygularını, düşüncelerini ve enerji durumunu değerlendirir.
                </p>
              </div>
              <div className="md:w-1/2 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <div className="h-48 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
                <div className="text-5xl font-bold text-purple-500 mb-4">3</div>
                <h3 className="text-2xl font-semibold text-white mb-4">Auranı Keşfet</h3>
                <p className="text-gray-300">
                  Analiz sonucunda benzersiz auranı, anlamını ve içsel potansiyelini gösteren görsel ve açıklamalı bir rapor al.
                </p>
              </div>
              <div className="md:w-1/2 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <div className="h-48 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Kullanıcı <span className="text-purple-400">Deneyimleri</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-4"></div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-purple-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">&ldquo;{testimonial.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-blue-900/30 to-purple-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            İçsel Yolculuğuna Bugün Başla
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Kendini daha iyi tanımak, içsel potansiyelini keşfetmek ve duygusal farkındalığını artırmak için Aurascend&apos;i hemen dene.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {status === 'authenticated' ? (
              <>
                <button 
                  onClick={scrollToAnalysis}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg text-center transition-all"
                >
                  Auramı Analiz Et
                </button>
                <Link 
                  href="/dashboard" 
                  className="px-8 py-4 border-2 border-purple-500 text-white hover:bg-purple-500/20 font-medium rounded-lg text-center transition-all"
                >
                  Aura Geçmişimi Gör
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg text-center transition-all"
                >
                  Giriş Yap
                </Link>
                <Link 
                  href="/auth/register" 
                  className="px-8 py-4 border-2 border-purple-500 text-white hover:bg-purple-500/20 font-medium rounded-lg text-center transition-all"
                >
                  Ücretsiz Kaydol
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
      
   
    </div>
  );
}
