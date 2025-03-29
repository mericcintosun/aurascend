"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAuraResults();
      
      // Oturum bilgilerini kontrol et ve konsola yazdır
      console.log("Oturum Bilgileri:", {
        userId: session.user.id,
        userEmail: session.user.email,
        userName: session.user.name
      });
    }
  }, [status, session]);

  const fetchAuraResults = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/aura-results?limit=5");

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

  const handleDeleteAura = async () => {
    if (!selectedAura) return;
    
    try {
      setDeleting(true);
      setDeleteError(null);
      
      console.log('Silme isteği gönderiliyor:', selectedAura.id);
      console.log('Kullanıcı ID:', session?.user?.id);
      
      const response = await fetch(`/api/aura-results/${selectedAura.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('Silme API yanıtı:', responseData);
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
        <div className="flex justify-between items-center mb-10">
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
              <h2 className="text-3xl font-bold mb-2">
                Hoş Geldin, {session?.user?.name || "Kullanıcı"}
              </h2>
            </div>
          </div>
          <p className="text-white/70">
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
                  className={`h-2 ${aura.color?.startsWith("from-") ? "bg-purple-500" : aura.color}`}
                ></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-purple-400 transition-colors">{aura.message}</h3>
                    <div
                      className={`w-10 h-10 rounded-full flex-shrink-0 ${aura.color?.startsWith("from-") ? "bg-purple-500" : aura.color} flex items-center justify-center text-white text-xs shadow-md`}
                    >
                      {aura.sentimentRatio > 0 ? '+'+(aura.sentimentRatio).toFixed(1) : (aura.sentimentRatio).toFixed(1)}
                    </div>
                  </div>

                  <p className="text-white/70 line-clamp-3 mb-4 group-hover:text-white/90 transition-colors">
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
                              className={`px-2 py-1 rounded-full text-xs ${aura.color?.startsWith("from-") ? "bg-purple-500" : aura.color} bg-opacity-20 text-white`}
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

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-white/50">
                      {formatDate(aura.createdAt)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="text-purple-400 hover:text-purple-300 text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        Detaylı Gör
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      <button 
                        onClick={() => openDeleteModal(aura)}
                        className="text-red-400 hover:text-red-300 text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-4"
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

        {/* Silme Onay Modalı */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-purple-500/30 max-w-md w-full mx-4 backdrop-blur-sm shadow-xl">
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
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  disabled={deleting}
                >
                  İptal
                </button>
                
                <button
                  onClick={handleDeleteAura}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-colors flex items-center"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      Siliniyor...
                    </>
                  ) : (
                    <>Sil</>
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
