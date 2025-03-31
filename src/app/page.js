'use client';

import { useState, useEffect, useRef } from 'react';
import { analyzeAuraFromText } from '@/data';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Spinner } from '@/components/Spinner';
import AuraPlayer from '../components/AuraPlayer';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import toast from 'react-hot-toast';

// NOT: Client component'ler metadata export edemez
// metadata için layout.js dosyasını kullanın

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [text, setText] = useState('');
  const [auraResult, setAuraResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedKeywords, setDetectedKeywords] = useState([]);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Welcome mesajı tekrarını önlemek için ref kullanımı
  const welcomeShown = useRef(false);
  
  // Hero bölümündeki animasyon için kullanılacak state
  const [animateTitle, setAnimateTitle] = useState(false);
  
  // Giriş durumunu bildirmek için
  useEffect(() => {
    if (status === 'authenticated' && session?.user && !welcomeShown.current) {
      welcomeShown.current = true;
      toast.success(`Hoş geldin, ${session.user.name || 'misafir'}!`);
    }
  }, [status, session]);
  
  // Scroll animasyonları için ref'ler
  const analyzeRef = useRef(null);
  const howItWorksRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Scroll progress için
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  
  // Section görünürlük kontrolleri
  const isAnalyzeVisible = useInView(analyzeRef, { once: false, amount: 0.3 });
  const isHowItWorksVisible = useInView(howItWorksRef, { once: false, amount: 0.3 });
  const isFeaturesVisible = useInView(featuresRef, { once: false, amount: 0.3 });
  const isCtaVisible = useInView(ctaRef, { once: false, amount: 0.3 });
  
  // Scroll to aura analysis section
  const scrollToAnalysis = () => {
    if (analyzeRef && analyzeRef.current) {
      analyzeRef.current.scrollIntoView({ behavior: "smooth" });
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
    
    // Scroll to analysis section
    scrollToAnalysis();
    
    // Start analysis animation
    setIsAnalyzing(true);
    setAuraResult(null);
    setDetectedKeywords([]);
    setSaveError(null);
    setIsSaving(false);
    
    // Simulate processing time for better UX with visual feedback
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
    }, 2200); // Slightly longer timeout for better animation experience
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
  
  const handleSignOut = async () => {
    const toastId = toast.loading('Çıkış yapılıyor...');
    await signOut({ redirect: false });
    toast.success('Başarıyla çıkış yapıldı', { id: toastId });
    router.push('/');
  };
  
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
      <motion.section 
        className="relative py-20 md:py-32 overflow-hidden"
        style={{ opacity, scale }}
      >
        <div className="absolute inset-0 bg-[url('/images/stars-bg.jpg')] bg-cover opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-blue-900/70 to-black/70"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <motion.h1 
                className={`text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-1000 ${
                  animateTitle ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                İçsel <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Enerjini</span> Keşfet
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300 mb-8 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Aurascend ile duygularını, düşüncelerini ve içsel dünyandaki gizli potansiyeli çözümle. Ruhunun rengini keşfet.
              </motion.p>
              <motion.p 
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Senin Auran Sınırsız
              </motion.p>
              <motion.p 
                className="text-sm text-gray-300 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                Lenovo Yapay Zeka Maratonu projesidir.
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4">
                {status === 'authenticated' ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full"
                    >
                      <button 
                        onClick={scrollToAnalysis}
                        className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg text-center transition-all"
                      >
                        Auramı Analiz Et
                      </button>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full"
                    >
                      <Link 
                        href="/dashboard" 
                        className="w-full block px-8 py-4 border-2 border-purple-500 text-white hover:bg-purple-500/20 font-medium rounded-lg text-center transition-all whitespace-nowrap"
                      >
                        Aura Geçmişim
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full"
                    >
                      <Link 
                        href="/login" 
                        className="w-full block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg text-center transition-all"
                      >
                        Hemen Başla
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full"
                    >
                      <Link 
                        href="/register" 
                        className="w-full block px-8 py-4 border-2 border-purple-500 text-white hover:bg-purple-500/20 font-medium rounded-lg text-center transition-all"
                      >
                        Ücretsiz Kaydol
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
            
            <motion.div 
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse blur-xl opacity-70"></div>
                <div className="absolute inset-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse blur-lg opacity-80"></div>
                <div className="absolute inset-20 rounded-full bg-gradient-to-r from-purple-300 to-blue-300 animate-pulse blur-md"></div>
              </div>
            </motion.div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <span className="text-sm mb-2">Keşfetmeye Başla</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </motion.section>

      
      {/* Analyze Section */}
      {status === 'authenticated' && (
        <motion.section 
          ref={analyzeRef} 
          className="w-full py-20 bg-gradient-to-br from-black via-purple-950 to-black px-4"
          animate={{
            opacity: isAnalyzeVisible ? 1 : 1,
            y: isAnalyzeVisible ? 0 : 50
          }}
          transition={{ duration: 0.7 }}
        >
          <div className="container mx-auto max-w-4xl">
            <motion.div 
              className="bg-black/40 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-white/5"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10">
                Auranı <span className="text-purple-400">Analiz Et</span>
              </h2>
              
              <div className="mb-8">
                <div className="relative">
                  <textarea
                    rows="6"
                    placeholder="Şu an nasıl hissettiğini, düşündüğünü ve enerjini anlat..."
                    value={text}
                    onChange={(e) => setText(e.target.value.substring(0, 500))}
                    disabled={isAnalyzing}
                    maxLength={500}
                    className="w-full bg-white/5 text-white placeholder-gray-400 border border-gray-800 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <div className="mt-4 flex justify-between gap-4">
                    <div className="text-xs text-gray-500">
                      {text.length}/500 karakter
                    </div>
                    <motion.button
                      onClick={isAnalyzing ? null : analyzeText}
                      disabled={isAnalyzing || text.trim().length < 20}
                      className={`px-6 py-2 rounded-lg font-medium ${
                        isAnalyzing || text.trim().length < 20
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                      } transition-all`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      whileHover={isAnalyzing || text.trim().length < 20 ? {} : { scale: 1.05 }}
                      whileTap={isAnalyzing || text.trim().length < 20 ? {} : { scale: 0.95 }}
                    >
                      {isAnalyzing ? 'Analiz Ediliyor...' : 'Auramı Analiz Et'}
                    </motion.button>
                  </div>
                </div>
                
                {/* Analiz yükleniyor animasyonu */}
                {isAnalyzing && (
                  <motion.div 
                    className="mt-6 p-8 rounded-lg bg-white dark:bg-gray-900 shadow-lg relative overflow-hidden animate-fadeIn"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 animate-gradient-flow"></div>
                    <div className="relative z-10">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 animate-pulse mb-6 relative">
                          <div className="w-20 h-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 animate-spin"></div>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 animate-shimmer text-center">
                          Auranı Analiz Ediyorum
                        </h3>
                        
                        <div className="space-y-2 w-full max-w-md">
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ animationDelay: "0.1s" }}></div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6 mx-auto" style={{ animationDelay: "0.2s" }}></div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6 mx-auto" style={{ animationDelay: "0.3s" }}></div>
                        </div>
                        
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                          {['🔮', '✨', '💫', '🌈', '⚡'].map((emoji, index) => (
                            <span 
                              key={index} 
                              className="inline-block animate-float"
                              style={{ 
                                animationDelay: `${index * 0.2}s`,
                                fontSize: "1.5rem"
                              }}
                            >
                              {emoji}
                            </span>
                          ))}
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mt-4 text-center max-w-md">
                          Enerji alanın analiz ediliyor ve aurandaki renkler ayırt ediliyor...
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Aura analizi sonucu gösterimi */}
                {auraResult && !isAnalyzing && (
                  <motion.div 
                    className="mt-4 animate-fadeInScale relative z-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className={`p-1 rounded-lg bg-gradient-to-r ${auraResult.color || 'from-purple-500 to-blue-500'} animate-gradient-flow aura-card`}>
                      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 animate-shimmer">
                            {auraResult.message || 'Aura Sonucu'}
                          </h3>
                        </div>
                        
                        {/* Aura görsel ve açıklama içeriği */}
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Aura görseli */}
                          {auraResult.image && (
                            <div className="w-full md:w-1/3 flex justify-center aura-image-container animate-glow-pulse">
                              <img
                                src={auraResult.image}
                                alt={auraResult.message}
                                className="rounded-lg shadow-lg max-w-full h-auto object-cover aura-image animate-float"
                                style={{aspectRatio: "1/1", objectFit: "cover"}}
                              />
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                            </div>
                          )}
                          
                          {/* Aura açıklaması */}
                          <div className={`w-full ${auraResult.image ? 'md:w-2/3' : ''}`}>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed mb-4">
                              {auraResult.description || 'Aura analizi tamamlandı.'}
                            </p>
                            
                            {/* Müzik oynatıcı */}
                            {auraResult.music && (
                              <div className="mb-4 relative z-50">
                                <AuraPlayer musicFile={auraResult.music} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}
      
      {/* How It Works Section */}
      <motion.section 
        ref={howItWorksRef}
        className="py-20 bg-gradient-to-b from-black/50 to-blue-900/30 backdrop-blur-sm"
        animate={{
          opacity: isHowItWorksVisible ? 1 : 1,
          y: isHowItWorksVisible ? 0 : 50
        }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10 md:mb-16">
            <span className="text-purple-400">Nasıl</span> Çalışır?
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="flex flex-col md:flex-row items-center gap-8 mb-16 md:mb-20"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-4">1</div>
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">Duygularını ve Düşüncelerini Yaz</h3>
                <p className="text-gray-300 text-base md:text-lg">
                  Kendini nasıl hissettiğini, düşüncelerini veya içsel durumunu anlatan bir metin yaz. Ne kadar detaylı olursa, analizin o kadar doğru olur.
                </p>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2 bg-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10 shadow-lg">
                <div className="h-56 sm:h-64 md:h-48 lg:h-60 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 md:h-20 md:w-20 lg:h-24 lg:w-24 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col md:flex-row-reverse items-center gap-8 mb-16 md:mb-20"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-4">2</div>
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">Yapay Zeka Analizi</h3>
                <p className="text-gray-300 text-base md:text-lg">
                  Gelişmiş yapay zeka algoritmamız, metnini analiz ederek duygularını, düşüncelerini ve enerji durumunu değerlendirir.
                </p>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2 bg-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10 shadow-lg">
                <div className="h-56 sm:h-64 md:h-48 lg:h-60 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 md:h-20 md:w-20 lg:h-24 lg:w-24 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col md:flex-row items-center gap-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-4">3</div>
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">Auranı Keşfet</h3>
                <p className="text-gray-300 text-base md:text-lg">
                  Analiz sonucunda benzersiz auranı, anlamını ve içsel potansiyelini gösteren görsel ve açıklamalı bir rapor al.
                </p>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2 bg-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10 shadow-lg">
                <div className="h-56 sm:h-64 md:h-48 lg:h-60 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 md:h-20 md:w-20 lg:h-24 lg:w-24 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Features Section */}
      <motion.section 
        ref={featuresRef}
        className="py-20 bg-black/50 backdrop-blur-sm"
        animate={{
          opacity: isFeaturesVisible ? 1 : 1,
          y: isFeaturesVisible ? 0 : 50
        }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Neden <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Aurascend</span>?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Duygusal zekânızı geliştirmek ve içsel dengenizi bulmak için tasarlanmış yenilikçi özelliklerimizi keşfedin.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-purple-500/20 hover:shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="mb-5">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* CTA Section */}
      <motion.section 
        ref={ctaRef}
        className="py-20 bg-gradient-to-b from-blue-900/30 to-purple-900/50 backdrop-blur-sm"
        animate={{
          opacity: isCtaVisible ? 1 : 1,
          y: isCtaVisible ? 0 : 50
        }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              İçsel Yolculuğuna Bugün Başla
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Kendini daha iyi tanımak, içsel potansiyelini keşfetmek ve duygusal farkındalığını artırmak için Aurascend&apos;i hemen dene.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {status === 'authenticated' ? (
              <>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <button 
                    onClick={scrollToAnalysis}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg text-center transition-all"
                  >
                    Auramı Analiz Et
                  </button>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Link 
                    href="/dashboard" 
                    className="w-full block px-8 py-4 border-2 border-purple-500 text-white hover:bg-purple-500/20 font-medium rounded-lg text-center transition-all"
                  >
                    Aura Geçmişimi Gör
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Link 
                    href="/login" 
                    className="w-full block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg text-center transition-all"
                  >
                    Giriş Yap
                  </Link>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Link 
                    href="/register" 
                    className="w-full block px-8 py-4 border-2 border-purple-500 text-white hover:bg-purple-500/20 font-medium rounded-lg text-center transition-all"
                  >
                    Ücretsiz Kaydol
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
