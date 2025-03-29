'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const FeaturePage = () => {
  const [activeTab, setActiveTab] = useState('aura-colors');

  // Sample aura cards to demonstrate different types
  const auraExamples = [
    {
      name: "Mutluluk",
      color: "from-yellow-300 to-orange-400",
      image: "/images/auras/aura_neseli_pozitif1.png",
      description: "Pozitif enerjin, tıpkı güneş gibi çevrene ışık ve sıcaklık yayıyor.",
      keywords: ["mutlu", "sevinçli", "neşeli", "keyifli"]
    },
    {
      name: "Heyecan",
      color: "from-orange-500 to-yellow-500",
      image: "/images/auras/aura_heyecan_dolu_pozitif4.png",
      description: "Heyecan dolu ruhun, seni her daim yeni maceralara sürüklüyor.",
      keywords: ["heyecanlı", "coşkulu", "enerjik"]
    },
    {
      name: "Umut",
      color: "from-blue-400 to-green-400",
      image: "/images/auras/aura_umut_dolu_pozitif9.png",
      description: "Umutlu bir bakış açısıyla geleceğe göz kırpman, hayattaki engelleri aşmanda yardımcı.",
      keywords: ["umutlu", "iyimser", "olumlu"]
    },
    {
      name: "Hüzün",
      color: "from-blue-700 to-indigo-900",
      image: "/images/auras/aura_melankolik_negatif1.png",
      description: "Hüzün duygusu, içinde derin bir hassasiyet ve duyarlılık barındırdığının işaretidir.",
      keywords: ["üzgün", "kederli", "melankolik", "hasret"]
    },
    {
      name: "Öfke",
      color: "from-red-600 to-red-900",
      image: "/images/auras/aura_ofkeli_negatif2.png", 
      description: "İçinde yanan öfke, adaletsizliklere ve haksızlıklara karşı duyduğun hassasiyetin ifadesi.",
      keywords: ["kızgın", "öfkeli", "sinirli"]
    },
    {
      name: "Huzur",
      color: "from-cyan-400 to-blue-500",
      image: "/images/auras/aura_sakin_duragan1.png",
      description: "Huzurlu auran, içsel dinginliği ve sükuneti yansıtır.",
      keywords: ["sakin", "huzurlu", "dingin"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white">
      <div className="absolute top-0 left-0 w-full h-96 bg-[url('/images/stars-bg.jpg')] bg-cover opacity-20 z-0"></div>
      
      <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Aurascend Özellikleri
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Duygusal dünyayı keşfetmenin ve içsel yolculuğunuzu görselleştirmenin teknolojisi
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button 
            onClick={() => setActiveTab('aura-colors')} 
            className={`px-6 py-3 rounded-full text-lg font-medium transition ${
              activeTab === 'aura-colors' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-blue-900/50 text-blue-200 hover:bg-blue-800/60'
            }`}
          >
            Aura Renkleri
          </button>
          <button 
            onClick={() => setActiveTab('sentiment-analysis')} 
            className={`px-6 py-3 rounded-full text-lg font-medium transition ${
              activeTab === 'sentiment-analysis' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-blue-900/50 text-blue-200 hover:bg-blue-800/60'
            }`}
          >
            Duygu Analizi
          </button>
          <button 
            onClick={() => setActiveTab('detection-system')} 
            className={`px-6 py-3 rounded-full text-lg font-medium transition ${
              activeTab === 'detection-system' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-blue-900/50 text-blue-200 hover:bg-blue-800/60'
            }`}
          >
            Tespit Sistemi
          </button>
          <button 
            onClick={() => setActiveTab('ai-technologies')} 
            className={`px-6 py-3 rounded-full text-lg font-medium transition ${
              activeTab === 'ai-technologies' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-blue-900/50 text-blue-200 hover:bg-blue-800/60'
            }`}
          >
            Yapay Zeka Teknolojileri
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-blue-900/30 backdrop-blur-sm rounded-3xl p-8 mb-16 shadow-xl border border-blue-800/50">
          {activeTab === 'aura-colors' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Aura Renkleri ve Anlamları
              </h2>
              <p className="mb-6 text-lg">
                Aurascend, duygusal durumunuza göre farklı renk kombinasyonlarında auralar oluşturur. 
                Her renk gradyanı, belirli bir duygusal durumu ve enerjiyi temsil eder. 
                İşte Aurascend&apos;in kullandığı temel aura renkleri ve anlamları:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {auraExamples.map((aura, index) => (
                  <div key={index} className="rounded-xl overflow-hidden shadow-lg border border-blue-700/30">
                    <div className={`h-40 bg-gradient-to-r ${aura.color} p-4 flex items-end`}>
                      <h3 className="text-2xl font-bold text-white drop-shadow-md">{aura.name}</h3>
                    </div>
                    <div className="p-5 bg-blue-950/80">
                      <p className="mb-4">{aura.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {aura.keywords.map((keyword, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full bg-blue-800/50 text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              
            </div>
          )}

          {activeTab === 'sentiment-analysis' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Duygu Analizi Teknolojisi
              </h2>
              <p className="mb-8 text-lg">
                Aurascend&apos;in duygu analizi sistemi, metinlerinizi derinlemesine inceleyerek duygusal durumunuzu tespit eder.
                Tam olarak nasıl çalıştığını keşfedin:
              </p>

              <div className="space-y-10">
                <div className="bg-indigo-900/40 rounded-xl p-6 border border-indigo-800/50">
                  <h3 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 mr-3">1</span>
                    Metin Parçalama
                  </h3>
                  <p className="mb-4">
                    Girdiğiniz metin önce paragraflara ve cümlelere ayrılır. Bu işlem, metnin farklı bölümlerinin ayrı ayrı analiz edilmesini sağlar.
                  </p>
                  <div className="bg-blue-950/80 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      <code>
                        {`// Metni cümlelere ayırma\nconst sentences = splitIntoSentences(text);\n\n// Her cümleyi ayrı analiz\nconst sentenceScores = sentences.map(sentence => analyzeSentiment(sentence));`}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="bg-indigo-900/40 rounded-xl p-6 border border-indigo-800/50">
                  <h3 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 mr-3">2</span>
                    Anahtar Kelime Tespiti
                  </h3>
                  <p className="mb-4">
                    Sistem, metinde geçen duygu ifade eden kelimeleri tanımlar ve kategorize eder:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4 pl-4">
                    <li>Pozitif duygular: mutlu, huzur, neşe, sevgi, umut gibi</li>
                    <li>Negatif duygular: üzgün, kızgın, endişeli, korkmuş gibi</li>
                    <li>Nötr duygular: sakin, düşünceli, meraklı gibi</li>
                  </ul>
                  <p>
                    Her kelimenin metindeki bağlamı da dikkate alınır, böylece &quot;hiç mutlu değilim&quot; gibi ifadelerde &quot;mutlu&quot; kelimesi pozitif değil, negatif bağlamda değerlendirilir.
                  </p>
                </div>

                <div className="bg-indigo-900/40 rounded-xl p-6 border border-indigo-800/50">
                  <h3 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 mr-3">3</span>
                    Duygu Oranları Hesaplama
                  </h3>
                  <p className="mb-4">
                    Analiz sırasında pozitif ve negatif ifadelerin sayısı ve yoğunluğu hesaplanır. Bu, 
                    metnin genel duygusal tonunu belirlemede kritik öneme sahiptir.
                  </p>
                  <div className="bg-blue-950/80 p-4 rounded-lg mb-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>
                        {`// Duygu skoru hesaplama\nconst sentimentScore = positiveCount - negativeCount;\n\n// Duygu oranı\nconst sentimentRatio = sentimentScore / totalWords;`}
                      </code>
                    </pre>
                  </div>
                  <p>
                    Sonuç olarak -1 ile +1 arasında bir duygu oranı elde edilir:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                    <li>0.5 üzeri: Güçlü pozitif duygular</li>
                    <li>0 ile 0.5 arası: Hafif pozitif duygular</li>
                    <li>-0.5 ile 0 arası: Hafif negatif duygular</li>
                    <li>-0.5 altı: Güçlü negatif duygular</li>
                  </ul>
                </div>

                <div className="bg-indigo-900/40 rounded-xl p-6 border border-indigo-800/50">
                  <h3 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 mr-3">4</span>
                    Bağlamsal Analiz
                  </h3>
                  <p className="mb-4">
                    Aurascend, kelimelerin birbirleriyle olan ilişkilerini inceleyerek bağlamsal analiz yapar. 
                    Örneğin, bir pozitif kelime yakınında bir olumsuzlama ifadesi varsa, bu anlam tersine çevrilebilir.
                  </p>
                  <div className="bg-blue-950/80 p-4 rounded-lg mb-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>
                        {`// Özel durum kontrolü\nif (text.includes("mutlu değilim")) {\n  // "mutlu" kelimesi pozitif olsa da, bağlam negatif\n  return negativeScore;\n}`}
                      </code>
                    </pre>
                  </div>
                  <p>
                    Sistem ayrıca şu tür özel durumları da kontrol eder:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                    <li>Olumsuzlama ifadeleri: &quot;değil&quot;, &quot;yok&quot;, &quot;asla&quot; gibi</li>
                    <li>Yakınlık kalıpları: Farklı duygu ifadelerinin yakınlığı</li>
                    <li>Son cümle analizi: Metindeki son cümleye daha fazla ağırlık verilir</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'detection-system' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Aura Tespit Sistemi
              </h2>
              <p className="mb-8 text-lg">
                Aurascend&apos;in sofistike tespit sistemi, duygu analizinden elde edilen sonuçları aura tipine dönüştürür.
                Bu süreç tamamen kişiselleştirilmiş ve her metne özgü sonuçlar üretir.
              </p>

              <div className="space-y-10">
                <div className="bg-indigo-900/40 rounded-xl p-6 border border-indigo-800/50">
                  <h3 className="text-2xl font-bold mb-4">Tespit Aşamaları</h3>
                  <ol className="list-decimal list-inside space-y-4 pl-2">
                    <li className="pl-2">
                      <span className="font-medium">Anahtar Kelime Eşleştirme:</span>
                      <p className="mt-2 pl-6">
                        Tespit edilen anahtar kelimeler, önceden tanımlanmış duygu gruplarıyla eşleştirilir. 
                        Her kelime bir duygu grubu ile ilişkilendirilmiştir (örn. &quot;mutlu&quot; kelimesi &quot;pozitif_1&quot; grubu ile).
                      </p>
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Baskın Duygu Belirleme:</span>
                      <p className="mt-2 pl-6">
                        Metindeki en sık kullanılan veya en güçlü duygu ifadeleri, baskın duyguyu belirler. 
                        Özellikle ciddi yaşam olayları veya yoğun duygusal ifadeler, bu belirlemede ağırlıklı rol oynar.
                      </p>
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Son Cümle Analizi:</span>
                      <p className="mt-2 pl-6">
                        Metindeki son cümleye özel bir önem verilir, çünkü kişiler genellikle son cümlede duygusal durumlarını özetlerler.
                        Bu nedenle son cümlenin duygu skoru 1.5 kat ağırlıklıdır.
                      </p>
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Aura Grubu Seçimi:</span>
                      <p className="mt-2 pl-6">
                        Tüm analizler sonucunda, en uygun aura grubu seçilir. Bu gruplar: pozitif (1-9), 
                        negatif (1-3), durağan (1-2), karmaşık (1-3) ve belirsiz kategorileridir.
                      </p>
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Aura Çıktısı Oluşturma:</span>
                      <p className="mt-2 pl-6">
                        Belirlenen aura grubu için tanımlı mesaj, renk, açıklama ve görsel ile kişiselleştirilmiş 
                        aura çıktısı oluşturulur ve kullanıcıya sunulur.
                      </p>
                    </li>
                  </ol>
                </div>

                <div className="bg-indigo-900/40 rounded-xl p-6 border border-indigo-800/50">
                  <h3 className="text-2xl font-bold mb-4">Çıktı Yapısı</h3>
                  <p className="mb-4">
                    Aurascend analiz sonucunda şu bilgileri içeren kapsamlı bir aura çıktısı oluşturur:
                  </p>
                  <div className="bg-blue-950/80 p-4 rounded-lg mb-6">
                    <pre className="text-sm overflow-x-auto">
                      <code>
                        {`{
  output: {
    message: "Mutluluk",  // Aura başlığı
    color: "from-yellow-300 to-orange-400",  // Renk gradyanı
    image: "/images/auras/aura_neseli_pozitif1.png",  // Aura görseli
    description: "Pozitif enerjin, tıpkı güneş gibi..."  // Detaylı açıklama
  },
  analyticData: {
    detectedKeywords: ["mutlu", "neşeli", "güzel"],  // Tespit edilen kelimeler
    sentimentRatio: 0.75,  // Duygu oranı (-1 ile +1 arası)
    contextScore: 3.2,  // Bağlam skoru
    proximityPatterns: []  // Yakınlık kalıpları
  }
}`}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="bg-indigo-900/40 rounded-xl p-6 border border-indigo-800/50">
                  <h3 className="text-2xl font-bold mb-4">Özel Durumlar</h3>
                  <p className="mb-4">
                    Aurascend&apos;in tespit sistemi, bazı özel durumlara karşı duyarlıdır:
                  </p>
                  <ul className="list-disc list-inside space-y-3 pl-4">
                    <li>
                      <span className="font-medium">Ciddi Yaşam Olayları:</span> Kayıp, ölüm, ayrılık gibi önemli yaşam olayları tespit edildiğinde, 
                      sistem bu duruma uygun özel bir aura belirler.
                    </li>
                    <li>
                      <span className="font-medium">Belirsiz Duygular:</span> &quot;Nasıl hissettiğimi bilmiyorum&quot; gibi ifadeler için özel &quot;belirsiz&quot; 
                      aura grubu kullanılır.
                    </li>
                    <li>
                      <span className="font-medium">Negatif Duygu Yokluğu:</span> &quot;Korkmuyorum&quot; gibi bir negatif duygunun olmadığını belirten 
                      ifadeler, pozitif olarak değerlendirilir.
                    </li>
                    <li>
                      <span className="font-medium">Çift Olumsuzlama:</span> &quot;Mutsuz değilim&quot; gibi çift olumsuzlama içeren ifadeler özel olarak işlenir.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-technologies' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Kullanılan Yapay Zeka Teknolojileri
              </h2>
              <p className="mb-8 text-lg">
                Aurascend, en gelişmiş yapay zeka teknolojilerini kullanarak oluşturulmuştur. 
                Size en iyi deneyimi sunabilmek için farklı alanlarda uzmanlaşmış AI modellerinden yararlanıyoruz.
              </p>

              <div className="space-y-8">
                <div className="bg-indigo-900/40 rounded-xl p-6 border border-indigo-800/50 hover:shadow-lg transition-all hover:shadow-purple-500/10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Geliştirme</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-gradient-to-br from-blue-950/80 to-indigo-950/80 p-5 rounded-lg border border-blue-800/50 hover:border-purple-500/50 transition-all">
                      <h4 className="text-xl font-medium text-white mb-3">Cursor AI (Claude 3.7 Sonnet)</h4>
                      <p className="text-gray-300">
                        Cursor AI ve Claude 3.7 Sonnet kullanarak kodlama sürecimizi hızlandırdık ve optimum performans sağladık.
                        Bu yapay zeka, kod üretimi, hata ayıklama ve optimizasyon konularında bize destek oldu.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-950/80 to-indigo-950/80 p-5 rounded-lg border border-blue-800/50 hover:border-purple-500/50 transition-all">
                      <h4 className="text-xl font-medium text-white mb-3">MGX (MetaGPT)</h4>
                      <p className="text-gray-300">
                        MGX yapay zekası, sistem mimarisinin oluşturulması ve karmaşık bileşenlerin planlanması
                        aşamalarında kullanıldı. Böylece, ölçeklenebilir ve sürdürülebilir bir yapı elde ettik.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-900/40 rounded-xl p-6 border border-indigo-800/50 hover:shadow-lg transition-all hover:shadow-green-500/10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mr-4 shadow-lg shadow-green-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">Prompt Analizi</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-gradient-to-br from-blue-950/80 to-indigo-950/80 p-5 rounded-lg border border-blue-800/50 hover:border-green-500/50 transition-all">
                      <h4 className="text-xl font-medium text-white mb-3">ChatGPT (O1)</h4>
                      <p className="text-gray-300">
                        ChatGPT O1 modelini kullanarak kullanıcı girdilerini daha detaylı analiz ediyor, 
                        nüansları ve ince anlamları yakalayabiliyoruz. Bu, aura analizinin daha hassas 
                        olmasını sağlıyor.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-950/80 to-indigo-950/80 p-5 rounded-lg border border-blue-800/50 hover:border-green-500/50 transition-all">
                      <h4 className="text-xl font-medium text-white mb-3">GPT (4.5)</h4>
                      <p className="text-gray-300">
                        GPT 4.5 modeli, karmaşık duygu analizleri ve dilbilimsel örüntülerin tespitinde kullanılıyor. 
                        Bu model, Türkçe&apos;ye özgü dilbilimsel yapıları anlama konusunda üstün başarı gösteriyor.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-900/40 rounded-xl p-6 border border-indigo-800/50 hover:shadow-lg transition-all hover:shadow-pink-500/10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center mr-4 shadow-lg shadow-pink-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-red-400">Resim Oluşturma</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-gradient-to-br from-blue-950/80 to-indigo-950/80 p-5 rounded-lg border border-blue-800/50 hover:border-pink-500/50 transition-all">
                      <h4 className="text-xl font-medium text-white mb-3">DALL-E (3)</h4>
                      <p className="text-gray-300">
                        DALL-E 3 ile, aura görselleştirmelerimizi oluşturuyoruz. Bu model, duygu analizine dayalı 
                        olarak benzersiz ve etkileyici aura görüntüleri yaratmamıza olanak tanıyor.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-950/80 to-indigo-950/80 p-5 rounded-lg border border-blue-800/50 hover:border-pink-500/50 transition-all">
                      <h4 className="text-xl font-medium text-white mb-3">Bing AI (Image Generator)</h4>
                      <p className="text-gray-300">
                        Bing AI Image Generator, alternatif aura görsellerimizi ve arayüz elementlerimizin 
                        oluşturulmasında kullanılıyor. Bu model, daha gerçekçi ve akıcı gradyan geçişleri sağlıyor.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-900/40 rounded-xl p-6 border border-indigo-800/50 hover:shadow-lg transition-all hover:shadow-amber-500/10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center mr-4 shadow-lg shadow-amber-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 010 12.728" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">Ses Oluşturma</h3>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-950/80 to-indigo-950/80 p-5 rounded-lg border border-blue-800/50 hover:border-amber-500/50 transition-all">
                    <h4 className="text-xl font-medium text-white mb-3">Suno AI (Gen 2)</h4>
                    <p className="text-gray-300">
                      Suno AI, platformumuzda kullanılan ambiyans sesleri ve kişiselleştirilmiş müzikler için 
                      kullanılıyor. Her aura için özel olarak oluşturulan ses parçaları, kullanıcı deneyimini 
                      zenginleştiriyor ve duygusal etkiyi derinleştiriyor.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-violet-900/40 to-purple-900/40 rounded-xl p-8 border border-violet-700/30 mt-8 shadow-lg shadow-violet-500/10">
                  <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-300">Teknoloji Seçimlerimiz</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Entegrasyon ve Sinerji</h4>
                      <p className="text-gray-300 mb-4">
                        Aurascend olarak, her alanda en uygun yapay zeka modellerini seçerek, entegrasyon ve 
                        sinerji oluşturmayı hedefledik. Bu modeller birlikte çalışarak, duygu analizi konusunda 
                        çok daha kapsamlı ve hassas bir sistem oluşturuyor.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Sürekli Gelişim</h4>
                      <p className="text-gray-300">
                        Düzenli güncellemelerle yapay zeka teknolojilerimizi sürekli geliştiriyor ve yeni 
                        modellerle zenginleştiriyoruz. Amacımız, kullanıcı deneyimini sürekli iyileştirmek 
                        ve aura analizinin doğruluğunu en üst seviyeye çıkarmaktır.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-violet-700/30">
                    <h4 className="text-lg font-medium text-white mb-2">Veri Gizliliği ve Etik Kullanım</h4>
                    <p className="text-gray-300">
                      Tüm yapay zeka teknolojilerimizi kullanırken kullanıcı verilerinin gizliliğine ve güvenliğine 
                      büyük önem veriyoruz. Aura analizlerinizi en yüksek etik standartlara uygun şekilde 
                      gerçekleştiriyor ve verilerinizi hiçbir şekilde üçüncü taraflarla paylaşmıyoruz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-lg font-medium shadow-lg shadow-purple-700/30 hover:from-purple-700 hover:to-pink-700 transition">
            Kendi Auranı Keşfet
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturePage; 