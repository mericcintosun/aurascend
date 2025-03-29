"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import AuraPlayer from "@/components/AuraPlayer";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [auraResults, setAuraResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("tümü");
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedAura, setSelectedAura] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [detailAura, setDetailAura] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAuraResults();
      
    
    }
  }, [status, session]);

  const fetchAuraResults = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/aura-results?limit=10");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Aura sonuçları getirilemedi");
      }

      const data = await response.json();

      const resultsArray = data.data || data;
      setAuraResults(Array.isArray(resultsArray) ? resultsArray : []);
    } catch (err) {
      console.error("Aura sonuçlarını getirirken hata:", err);
      setError(
        "Aura sonuçlarınızı şu anda yükleyemiyoruz. Lütfen daha sonra tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const getGradientClass = (color) => {
    if (!color) return "bg-gradient-to-r from-purple-600 to-blue-600";
    
    // Eğer zaten bir gradient ise
    if (color.startsWith("from-")) return `bg-gradient-to-r ${color}`;
    
    // Tek renk için gradient oluştur
    return `bg-gradient-to-r from-${color}-500 to-${color}-700`;
  };

  const getSentimentClass = (score) => {
    if (score >= 0.7) return "bg-green-500 border-green-400";
    if (score >= 0.5) return "bg-green-600 border-green-500";
    if (score >= 0.3) return "bg-emerald-500 border-emerald-400";
    if (score >= 0) return "bg-blue-500 border-blue-400";
    if (score >= -0.3) return "bg-amber-500 border-amber-400";
    if (score >= -0.5) return "bg-orange-500 border-orange-400";
    return "bg-red-500 border-red-400";
  };
  
  const getSentimentLabel = (score) => {
    if (score >= 0.7) return "Çok Pozitif";
    if (score >= 0.5) return "Pozitif";
    if (score >= 0.3) return "Hafif Pozitif";
    if (score >= 0) return "Nötr+";
    if (score >= -0.3) return "Nötr-";
    if (score >= -0.5) return "Hafif Negatif";
    if (score >= -0.7) return "Negatif";
    return "Çok Negatif";
  };

  const handleDeleteAura = async () => {
    if (!selectedAura) return;
    
    try {
      setDeleting(true);
      setDeleteError(null);
      
      
      const response = await fetch(`/api/aura-results/${selectedAura.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.error('API yanıtı JSON olarak çözümlenemedi:', jsonError);
        throw new Error('Sunucu yanıtı beklenmeyen formatta, yeniden deneyin');
      }
      
      if (!response.ok) {
        const errorMessage = responseData.error || "Aura silinemedi";
        const errorDetails = responseData.details ? `: ${responseData.details}` : '';
        throw new Error(`${errorMessage}${errorDetails}`);
      }
      
      // UI'dan kaldır ve başarı mesajı göster
      setAuraResults(prev => prev.filter(aura => aura.id !== selectedAura.id));
      
      // Modalı kapat
      setDeleteModal(false);
      setSelectedAura(null);
    } catch (err) {
      console.error("Aura silinirken hata:", err);
      setDeleteError(err.message || "Silme işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setDeleting(false);
    }
  };
  
  const openDeleteModal = (aura) => {
    setSelectedAura(aura);
    setDeleteModal(true);
    setDeleteError(null);
  };
  
  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedAura(null);
    setDeleteError(null);
  };

  const openDetailModal = (aura) => {
    setDetailAura(aura);
    setDetailModal(true);
  };
  
  const closeDetailModal = () => {
    setDetailModal(false);
    setDetailAura(null);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black">
        <div className="text-white text-2xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white">
      <div className="absolute top-0 left-0 w-full h-96 bg-[url('/images/stars-bg.jpg')] bg-cover opacity-20 z-0"></div>
      
      <main className="max-w-6xl mx-auto py-10 px-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 gap-2">
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <Image 
                src={session.user.image}
                width={60}
                height={60}
                alt="Profil Fotoğrafı"
                className="rounded-full border-2 border-purple-400 p-0.5 shadow-lg shadow-purple-500/20"
              />
            ) : (
              <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold p-1 shadow-lg shadow-purple-500/20 leading-none">
                <span className="mt-[-2px]">{session?.user?.name?.charAt(0).toUpperCase() || "K"}</span>
              </div>
            )}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                Hoş Geldin, {session?.user?.name || "Kullanıcı"}
              </h2>
            </div>
          </div>
          <p className="text-white/70 text-sm sm:text-base">
            Son aura sonuçların burada görüntüleniyor.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center my-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg">
            {error}
          </div>
        ) : auraResults.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 text-center">
            <p className="text-xl">Henüz bir aura sonucun yok.</p>
            <Link
              href="/"
              className="mt-4 inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              İlk Auranı Oluştur
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auraResults.map((aura) => (
              <div
                key={aura.id}
                className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div
                  className={`h-2 ${getGradientClass(aura.color)}`}
                ></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg sm:text-xl font-bold group-hover:text-purple-400 transition-colors">{aura.message}</h3>
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0 ${getGradientClass(aura.color)} flex items-center justify-center text-white text-xs shadow-md`}
                    >
                      {aura.sentimentRatio > 0 ? '+'+(aura.sentimentRatio).toFixed(1) : (aura.sentimentRatio).toFixed(1)}
                    </div>
                  </div>

                  <p className="text-white/70 text-sm sm:text-base line-clamp-3 mb-4 group-hover:text-white/90 transition-colors">
                    {aura.description}
                  </p>

                  {aura.detectedKeywords?.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {aura.detectedKeywords
                          .slice(0, 3)
                          .map((keyword, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded-full text-xs ${getGradientClass(aura.color)} bg-opacity-20 text-white`}
                            >
                              {keyword}
                            </span>
                          ))}
                        {aura.detectedKeywords.length > 3 && (
                          <span className="px-2 py-1 bg-white/10 rounded-full text-xs">
                            +{aura.detectedKeywords.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
                    <div className="text-xs text-white/50">
                      {formatDate(aura.createdAt)}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <button 
                        onClick={() => openDetailModal(aura)}
                        className="text-purple-400 hover:text-purple-300 text-sm flex items-center transition-colors cursor-pointer bg-purple-900/20 px-2 py-1 rounded"
                      >
                        Detaylı Gör
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      <button 
                        onClick={() => openDeleteModal(aura)}
                        className="text-red-400 hover:text-red-300 text-sm flex items-center ml-2 cursor-pointer bg-red-900/20 px-2 py-1 rounded"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {auraResults.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors inline-block"
            >
              Yeni Aura Oluştur
            </Link>
          </div>
        )}

        {/* Aura Detay Modalı */}
        {detailModal && detailAura && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl border border-purple-500/30 max-w-3xl w-full max-h-[90vh] mx-auto backdrop-blur-sm shadow-xl flex flex-col">
              {/* Header with sticky position */}
              <div className="sticky top-0 z-[5] bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-t-lg shadow-lg">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div className="flex-1 mr-8 mb-3 sm:mb-0">
                    <p className="text-gray-400 text-sm mb-1">Aura Analizi</p>
                    <h3 className="text-xl font-bold text-white">
                      {detailAura?.message || "Aura Sonucu"}
                    </h3>
                  </div>
                  
                  {/* Sentiment Score Badge */}
                  {detailAura?.sentimentScore !== undefined && (
                    <div className="flex flex-row sm:flex-col items-center">
                      <div className={`
                        flex items-center justify-center rounded-full w-12 h-12 sm:w-14 sm:h-14 mb-1
                        border-2 shadow-lg text-white font-bold
                        ${getSentimentClass(detailAura.sentimentScore)}
                      `}>
                        {(detailAura.sentimentScore * 100).toFixed(0)}%
                      </div>
                      <span className="text-xs text-gray-300 ml-2 sm:ml-0">
                        {getSentimentLabel(detailAura.sentimentScore)}
                      </span>
                    </div>
                  )}
                  
                  {/* Close button */}
                  <button
                    onClick={closeDetailModal}
                    className="bg-black/30 hover:bg-purple-500/30 p-2 rounded-full shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2 absolute top-4 right-4"
                    aria-label="Kapat"
                    title="Kapat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-white text-sm hidden sm:inline">Kapat</span>
                  </button>
                </div>
              </div>
              
              {/* Kaydırılabilir içerik bölümü */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Aura içeriği */}
                <div className="p-4 sm:p-6">
                  {/* Aura görsel */}
                  {detailAura.image && (
                    <div className="mb-6">
                      <Image 
                        src={detailAura.image} 
                        alt={`${detailAura.message} Aura`} 
                        width={600}
                        height={300}
                        className="rounded-lg shadow-lg object-contain max-h-[300px] w-full"
                      />
                    </div>
                  )}
                  
                  {/* Aura müziği */}
                  {detailAura.music && (
                    <div className="mb-6">
                      <AuraPlayer musicFile={detailAura.music} />
                    </div>
                  )}
                  
                  {/* Duygusal analiz puanı */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white/90 mb-3">Duygusal Analiz</h3>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-red-400">Negatif</span>
                        <span className="text-green-400">Pozitif</span>
                      </div>
                      <div className="h-4 bg-white/10 rounded-full overflow-hidden relative">
                        <div 
                          className={`absolute top-0 bottom-0 left-1/2 ${
                            detailAura.sentimentRatio > 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ 
                            width: `${Math.abs(detailAura.sentimentRatio) * 50}%`,
                            left: detailAura.sentimentRatio >= 0 ? '50%' : `${50 - Math.abs(detailAura.sentimentRatio) * 50}%`
                          }}
                        ></div>
                        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/40"></div>
                      </div>
                      <div className="mt-2 text-center">
                        <span className={`font-bold ${
                          detailAura.sentimentRatio > 0.5 ? 'text-green-400' : 
                          detailAura.sentimentRatio < -0.5 ? 'text-red-400' : 'text-white/80'
                        }`}>
                          {detailAura.sentimentRatio > 0.5 ? 'Oldukça Pozitif' : 
                          detailAura.sentimentRatio > 0.2 ? 'Pozitif' :
                          detailAura.sentimentRatio < -0.5 ? 'Oldukça Negatif' :
                          detailAura.sentimentRatio < -0.2 ? 'Negatif' : 'Nötr'}
                        </span>
                        <p className="text-xs text-white/60 mt-1">
                          Duygu skoru: {detailAura.sentimentRatio > 0 ? '+' : ''}{detailAura.sentimentRatio.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Açıklama */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white/90 mb-2">Aura Açıklaması</h3>
                    <p className="text-white/80">{detailAura.description}</p>
                  </div>
                  
                  {/* Girilen metin */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white/90 mb-2">Aura Girdisi</h3>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 max-h-40 overflow-y-auto custom-scrollbar">
                      <p className="text-white/70 whitespace-pre-wrap">{detailAura.text}</p>
                    </div>
                  </div>
                  
                  {/* Anahtar kelimeler */}
                  {detailAura.detectedKeywords?.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white/90 mb-2">Anahtar Kelimeler</h3>
                      <div className="flex flex-wrap gap-2">
                        {detailAura.detectedKeywords.map((keyword, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1.5 rounded-full text-sm ${getGradientClass(detailAura.color)} bg-opacity-20 text-white/90`}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Tarih bilgisi */}
                  <div className="text-sm text-white/50 border-t border-white/10 pt-4 mt-4 flex justify-between">
                    <span>Oluşturulma: {formatDate(detailAura.createdAt)}</span>
                    <span className="text-xs">ID: {detailAura.id}</span>
                  </div>
                </div>
              </div>
              
              {/* Footer - İşlemler - sabit kalacak */}
              <div className="p-4 sm:p-6 border-t border-white/10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gray-900 sticky bottom-0 z-[5]">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`Aura Sonucum: ${detailAura.message}\n${detailAura.description}\n\nAurascend uygulaması ile yaratıldı.`);
                      alert('Aura sonucu panoya kopyalandı!');
                    }}
                    className="text-white/80 hover:text-white flex items-center gap-1 transition-colors px-2 sm:px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs sm:text-sm cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>Kopyala</span>
                  </button>
                  
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Aura Sonucum: ${detailAura.message}\n${detailAura.description}\n\nAurascend uygulaması ile yaratıldı.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors px-2 sm:px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs sm:text-sm cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                    <span>Twitter</span>
                  </a>
                  
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(`Aura Sonucum: ${detailAura.message}\n${detailAura.description}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors px-2 sm:px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs sm:text-sm cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.9 2H3.1A1.1 1.1 0 0 0 2 3.1v17.8A1.1 1.1 0 0 0 3.1 22h9.58v-7.75h-2.6v-3h2.6V9a3.64 3.64 0 0 1 3.88-4 20.26 20.26 0 0 1 2.33.12v2.7H17.3c-1.26 0-1.5.6-1.5 1.47v1.93h3l-.39 3H15.8V22h5.1a1.1 1.1 0 0 0 1.1-1.1V3.1A1.1 1.1 0 0 0 20.9 2Z" />
                    </svg>
                    <span>Facebook</span>
                  </a>
                </div>
                
                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                  <button 
                    onClick={() => {
                      closeDetailModal();
                      openDeleteModal(detailAura);
                    }}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer text-xs sm:text-sm bg-red-900/20 px-2 py-1 rounded"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Bu Aurayı Sil
                  </button>
                  
                  <button
                    onClick={closeDetailModal}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Silme Onay Modalı */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="relative bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-purple-500/30 max-w-md w-full mx-4 backdrop-blur-sm shadow-xl">
              {/* Modal kapatma butonu */}
              <button 
                onClick={closeDeleteModal}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10 bg-black/30 hover:bg-red-500/30 p-2 rounded-full backdrop-blur-sm border border-white/10 hover:border-red-400/50 shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer"
                aria-label="Kapat"
                title="Kapat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            
              <h3 className="text-xl font-bold text-white mb-4">Aura Sonucunu Sil</h3>
              
              {selectedAura && (
                <div className="mb-6">
                  <p className="text-white/80 mb-2">
                    <span className="font-bold text-purple-400">{selectedAura.message}</span> isimli aura sonucunu silmek üzeresiniz.
                  </p>
                  <p className="text-white/70 text-sm">
                    Bu işlem geri alınamaz. Silinen aura sonuçları kurtarılamaz.
                  </p>
                  <div className="mt-2 p-2 bg-black/30 rounded text-xs text-white/60 font-mono">
                    ID: {selectedAura.id || 'Bilinmiyor'}
                  </div>
                </div>
              )}
              
              {deleteError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-white">
                  <p className="font-bold mb-1">Hata</p>
                  <p>{deleteError}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  disabled={deleting}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  İptal
                </button>
                
                <button
                  onClick={handleDeleteAura}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      Siliniyor...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Sil
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
