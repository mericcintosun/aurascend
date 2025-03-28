'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [auraResults, setAuraResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAuraResults();
    }
  }, [status]);

  const fetchAuraResults = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/aura-results?limit=5');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Aura sonuçları getirilemedi');
      }
      
      const data = await response.json();
      
      const resultsArray = data.data || data;
      setAuraResults(Array.isArray(resultsArray) ? resultsArray : []);
    } catch (err) {
      console.error('Aura sonuçlarını getirirken hata:', err);
      setError('Aura sonuçlarınızı şu anda yükleyemiyoruz. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black">
        <div className="text-white text-2xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      <header className="w-full py-4 px-6 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">AurAscend</h1>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-white/80 hover:text-white transition">
            Ana Sayfa
          </Link>
          <Link href="/dashboard" className="text-white hover:text-white transition font-semibold">
            Dashboard
          </Link>
          <div className="flex items-center space-x-2">
            {session?.user?.image ? (
              <Image 
                src={session.user.image} 
                alt={session.user.name || 'Profil'} 
                width={32} 
                height={32} 
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <button 
              onClick={handleLogout} 
              className="text-white/80 hover:text-white/100 transition"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-10 px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">Hoş Geldin, {session?.user?.name || 'Kullanıcı'}</h2>
          <p className="text-white/70">Son aura sonuçların burada görüntüleniyor.</p>
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
            <Link href="/" className="mt-4 inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors">
              İlk Auranı Oluştur
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auraResults.map((aura) => (
              <div key={aura.id} className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition">
                <div 
                  className="h-3" 
                  style={{ backgroundColor: aura.color?.startsWith('from-') ? '#6366f1' : aura.color }}
                ></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{aura.message}</h3>
                    <div 
                      className="w-6 h-6 rounded-full ml-2 flex-shrink-0" 
                      style={{ backgroundColor: aura.color?.startsWith('from-') ? '#6366f1' : aura.color }}
                    ></div>
                  </div>
                  
                  <p className="text-white/70 line-clamp-3 mb-4">{aura.description}</p>
                  
                  {aura.detectedKeywords?.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {aura.detectedKeywords.slice(0, 3).map((keyword, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-white/10 rounded-full text-xs"
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
                  
                  <div className="text-xs text-white/50">
                    {formatDate(aura.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {auraResults.length > 0 && (
          <div className="mt-8 text-center">
            <Link href="/" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors inline-block">
              Yeni Aura Oluştur
            </Link>
          </div>
        )}
      </main>
    </div>
  );
} 