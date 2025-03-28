// AuraScend Mock Data - Olumsuz Bağlamda Kullanılan Kelimeler
export const negativeContextKeywords = {
  "keywords": [
    // Olumsuz durum bildiren kelimeler
    { "keyword": "eksikliği", "group": "negatif_1" },
    { "keyword": "yokluğu", "group": "negatif_1" },
    { "keyword": "yitirmek", "group": "negatif_1" },
    { "keyword": "kaybetmek", "group": "negatif_1" },
    { "keyword": "özlemek", "group": "karmasik_1" },
    { "keyword": "hasret", "group": "negatif_1" },
    { "keyword": "yoksun", "group": "zor_2" },
    { "keyword": "mahrum", "group": "zor_2" },
    { "keyword": "uzun süredir yok", "group": "negatif_1" },
    { "keyword": "artık yok", "group": "negatif_1" },
    { "keyword": "hiç yok", "group": "negatif_1" },
    { "keyword": "kayboldu", "group": "negatif_1" },
    { "keyword": "bitti", "group": "negatif_1" },
    { "keyword": "tükendi", "group": "zor_3" },
    { "keyword": "bıraktım", "group": "negatif_1" },
    { "keyword": "vazgeçtim", "group": "zor_3" },
    { "keyword": "umudum kalmadı", "group": "zor_3" },
    { "keyword": "boşluk hissi", "group": "negatif_1" },
    { "keyword": "boşluk", "group": "negatif_1" },
    { "keyword": "anlamsız", "group": "zor_4" },
    { "keyword": "kayıp", "group": "negatif_1" },
    { "keyword": "özlem", "group": "karmasik_1" },
    { "keyword": "geride kaldı", "group": "karmasik_1" },
    { "keyword": "geçti gitti", "group": "karmasik_1" },
    
    // Olumsuz kelimeler
    { "keyword": "üzgün", "group": "negatif_1" },
    { "keyword": "mutsuz", "group": "negatif_1" },
    { "keyword": "kederli", "group": "negatif_1" },
    { "keyword": "hüzünlü", "group": "negatif_1" },
    { "keyword": "kızgın", "group": "negatif_2" },
    { "keyword": "öfkeli", "group": "negatif_2" },
    { "keyword": "sinirli", "group": "negatif_2" },
    { "keyword": "endişeli", "group": "negatif_3" },
    { "keyword": "kaygılı", "group": "zor_1" },
    { "keyword": "tedirgin", "group": "negatif_3" },
    { "keyword": "korkmuş", "group": "negatif_3" },
    { "keyword": "yalnız", "group": "zor_2" },
    { "keyword": "tükenmiş", "group": "zor_3" },
    { "keyword": "bitkin", "group": "zor_3" },
    { "keyword": "yorgun", "group": "zor_3" },
    { "keyword": "umutsuz", "group": "zor_3" },
    { "keyword": "ümitsiz", "group": "zor_3" },
    { "keyword": "bezgin", "group": "zor_3" },
    { "keyword": "kırgın", "group": "negatif_1" },
    { "keyword": "incinmiş", "group": "negatif_1" },
    { "keyword": "küskün", "group": "negatif_1" },
    { "keyword": "hayal kırıklığı", "group": "negatif_1" },
    { "keyword": "çaresiz", "group": "zor_3" },
    { "keyword": "boş", "group": "zor_4" },
    { "keyword": "anlamsız", "group": "zor_4" },
    { "keyword": "değersiz", "group": "zor_2" },
    { "keyword": "yetersiz", "group": "zor_2" },
    { "keyword": "başarısız", "group": "zor_2" },
    { "keyword": "suçlu", "group": "zor_1" },
    { "keyword": "pişman", "group": "karmasik_1" },
    { "keyword": "boğulmuş", "group": "zor_1" },
    { "keyword": "bunalmış", "group": "zor_1" },
    { "keyword": "sıkılmış", "group": "zor_4" },
    { "keyword": "bıkkın", "group": "zor_3" },
    
    // Yeni eklediklerimiz 
    { "keyword": "ruhsal ağırlık", "group": "zor_3" },
    { "keyword": "derin hüzün", "group": "negatif_1" },
    { "keyword": "yoğun öfke", "group": "negatif_2" },
    { "keyword": "şiddetli korku", "group": "negatif_3" },
    { "keyword": "ani panik", "group": "negatif_3" },
    { "keyword": "nefret hissi", "group": "negatif_2" },
    { "keyword": "utanç duygusu", "group": "negatif_4" },
    { "keyword": "sarsıntı", "group": "meta_4" },
    { "keyword": "durgunluk", "group": "zor_3" },
    { "keyword": "karanlık", "group": "meta_3" },
    { "keyword": "boğulma", "group": "zor_2" },
    { "keyword": "sıkışıklık", "group": "zor_2" },
    { "keyword": "can sıkıntısı", "group": "zor_1" },
    { "keyword": "melankolik sızı", "group": "negatif_1" },
    { "keyword": "dramatik öfke", "group": "negatif_2" },
    { "keyword": "yoğun korku", "group": "negatif_3" },
    { "keyword": "şok etkisi", "group": "meta_4" },
    { "keyword": "kalp kırıklığı", "group": "negatif_1" },
    { "keyword": "acı", "group": "negatif_1" },
    { "keyword": "sızı", "group": "negatif_1" },
    { "keyword": "kırgınlık", "group": "negatif_1" },
    { "keyword": "yıkım", "group": "zor_4" },
    { "keyword": "varoluşsal kriz", "group": "zor_4" },
    { "keyword": "sıkışmışlık", "group": "zor_2" },
    { "keyword": "tatminsizlik", "group": "zor_2" },
    
    // Olumsuzlama ifadeleri (cümle içinde)
    { "keyword": "değilim", "group": "zor_4" },
    { "keyword": "değil", "group": "zor_4" },
    { "keyword": "olamıyorum", "group": "zor_1" },
    { "keyword": "yapamıyorum", "group": "zor_1" },
    { "keyword": "hissedemiyorum", "group": "zor_2" },
    { "keyword": "bulamıyorum", "group": "zor_3" },
    { "keyword": "anlamıyorum", "group": "zor_4" },
    { "keyword": "göremiyorum", "group": "zor_4" },
    { "keyword": "inanmıyorum", "group": "zor_4" },
    { "keyword": "bilmiyorum", "group": "belirsiz_1" },
    { "keyword": "tanımıyorum", "group": "karmasik_1" },
    { "keyword": "sevmiyorum", "group": "negatif_2" },
    { "keyword": "istemiyorum", "group": "negatif_2" },
    { "keyword": "yapmak istemiyorum", "group": "zor_3" },
    { "keyword": "olmak istemiyorum", "group": "zor_3" },
    { "keyword": "katlanamıyorum", "group": "negatif_2" },
    { "keyword": "dayanamıyorum", "group": "negatif_2" },
    { "keyword": "tahammül edemiyorum", "group": "negatif_2" },
    
    // Depresif ifadeler
    { "keyword": "yaşamak istemiyorum", "group": "zor_3" },
    { "keyword": "anlamı yok", "group": "zor_4" },
    { "keyword": "boşuna", "group": "zor_4" },
    { "keyword": "boşu boşuna", "group": "zor_4" },
    { "keyword": "kendimden nefret", "group": "negatif_2" },
    { "keyword": "yük oluyorum", "group": "zor_2" },
    { "keyword": "kimse sevmiyor", "group": "zor_2" },
    { "keyword": "kimse anlamıyor", "group": "zor_2" },
    { "keyword": "yalnızım", "group": "zor_2" },
    { "keyword": "terk edilmiş", "group": "zor_2" },
    { "keyword": "unutulmuş", "group": "zor_2" },
    { "keyword": "silinmiş", "group": "zor_2" },
    { "keyword": "dışlanmış", "group": "zor_2" },
    
    // Yeni eklenen güçlü olumsuz yaşam olayları
    { "keyword": "kaybettim", "group": "negatif_1" },
    { "keyword": "ölüm", "group": "negatif_1" },
    { "keyword": "yas", "group": "negatif_1" },
    { "keyword": "vefat", "group": "negatif_1" },
    { "keyword": "bitti", "group": "negatif_1" },
    { "keyword": "ayrıldık", "group": "negatif_1" },
    { "keyword": "ayrılık", "group": "negatif_1" },
    { "keyword": "yolunda gitmiyor", "group": "negatif_1" },
    { "keyword": "kötü gidiyor", "group": "negatif_1" },
    { "keyword": "zor zamanlar", "group": "negatif_1" },
    { "keyword": "sıkıntılı günler", "group": "negatif_1" },
    { "keyword": "berbat", "group": "negatif_1" },
    { "keyword": "felaket", "group": "negatif_1" },
    { "keyword": "mahvoldum", "group": "negatif_1" },
    { "keyword": "dağıldım", "group": "negatif_1" },
    { "keyword": "kırıldım", "group": "negatif_1" },
    { "keyword": "iyi hissetmiyorum", "group": "negatif_1" },
    { "keyword": "mutlu muyum bilmiyorum", "group": "belirsiz_1" },
    { "keyword": "nasıl hissettiğimi bilmiyorum", "group": "belirsiz_1" },
    { "keyword": "ne hissettiğimi bilmiyorum", "group": "belirsiz_1" },
    { "keyword": "emin değilim", "group": "belirsiz_1" },
    { "keyword": "karmaşık duygular", "group": "karmasik_2" }
  ]
};

// Pozitif duyguların yokluğunu belirten kalıplar için özel kontroller
export const negativePatterns = [
  { 
    positiveWord: "mutluluk", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"] 
  },
  { 
    positiveWord: "neşe", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"] 
  },
  { 
    positiveWord: "huzur", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "sevgi", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "güven", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "umut", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "keyif", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "enerji", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "başarı", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "heyecan", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  // Yeni eklenenler
  { 
    positiveWord: "sevinç", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "coşku", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "sükunet", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "rahatlama", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "dinginlik", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "memnuniyet", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "tatmin", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "coşku patlaması", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "heyecanlılık", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "minnettarlık", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "şefkat", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  { 
    positiveWord: "hayranlık", 
    negativeContexts: ["yok", "olmayan", "hissetmiyorum", "uzak", "kaybettim", "bulamıyorum", "artık", "eskiden", "geçmişte"]
  },
  // Olumsuzlama için yeni eklenenler
  { 
    positiveWord: "neşeli", 
    negativeContexts: ["değilim", "değil", "olmadığımı", "hissetmiyorum", "değilsin", "sayılmam"]
  },
  { 
    positiveWord: "mutlu", 
    negativeContexts: ["değilim", "değil", "olmadığımı", "hissetmiyorum", "değilsin", "sayılmam", "muyum bilmiyorum", "olduğumu sanmıyorum"]
  },
  { 
    positiveWord: "iyi", 
    negativeContexts: ["değilim", "değil", "hissetmiyorum", "gitmedi", "gitmiyor", "gitmiyor", "değilsin", "sayılmam"]
  },
  { 
    positiveWord: "ilgi", 
    negativeContexts: ["yok", "olmayan", "duymuyorum", "azaldı", "kaybettim", "kalmadı", "duymak istemiyorum", "çekmiyor"]
  }
];

// Pozitif ve negatif kelimelerin yakınlığına dayalı olumsuzlama tespiti için özel kalıplar
export const proximityPatterns = [
  // Formlar: [pozitif kelime, negatif kelime, maksimum kelime uzaklığı]
  ["mutluluk", "yok", 3],
  ["mutluluk", "değil", 3],
  ["huzur", "yok", 3],
  ["huzur", "değil", 3],
  ["sevgi", "yok", 3],
  ["sevgi", "değil", 3],
  ["neşe", "yok", 3],
  ["neşe", "değil", 3],
  ["ümit", "yok", 3],
  ["ümit", "kırıklığı", 2],
  ["hayat", "yorgun", 4],
  ["hayat", "anlamsız", 4],
  ["hayat", "zor", 3],
  ["hayat", "ağır", 3],
  ["enerji", "tükenmiş", 3],
  ["enerji", "bitmiş", 3],
  ["enerji", "yok", 3],
  ["motivasyon", "düşük", 3],
  ["motivasyon", "yok", 3],
  // Yeni eklenenler
  ["sevinç", "yok", 3],
  ["sevinç", "değil", 3],
  ["coşku", "yok", 3],
  ["coşku", "değil", 3],
  ["şefkat", "yok", 3],
  ["şefkat", "değil", 3],
  ["hayranlık", "yok", 3],
  ["keyif", "yok", 3],
  ["keyif", "değil", 3],
  ["başarı", "yok", 3],
  ["başarı", "değil", 3],
  ["heyecan", "yok", 3],
  ["heyecan", "değil", 3],
  ["umut", "yok", 3],
  ["umut", "kırıklığı", 2],
  ["özgüven", "yok", 3],
  ["özgüven", "düşük", 3],
  ["dinginlik", "yok", 3],
  ["dinginlik", "uzak", 3],
  ["rahatlama", "yok", 3],
  ["rahatlama", "uzak", 3],
  ["mutluluk", "uzun süredir", 4],
  ["sevinç", "uzun süredir", 4],
  ["huzur", "uzun süredir", 4],
  ["neşe", "uzun süredir", 4],
  ["enerji", "uzun süredir", 4],
  ["umut", "kaybettim", 3],
  // Durumlarla ilgili yeni kalıplar 
  ["mutlu", "değilim", 2],
  ["mutlu", "emin değilim", 3],
  ["iyi", "hissetmiyorum", 2],
  ["neşeli", "değilim", 2],
  ["kaygılı", "hissediyorum", 2],
  ["kötü", "hissediyorum", 2],
  ["kayıp", "hissediyorum", 2],
  ["yalnız", "hissediyorum", 2],
  ["anne", "kaybettim", 3],
  ["baba", "kaybettim", 3],
  ["hayat", "yolunda gitmiyor", 4]
]; 

// Olumsuz ekler ve bağlamları için yeni kalıplar
export const negativeSuffixPatterns = [
  // Olumsuz ekler ve bağlamları
  { 
    suffix: "suz", 
    contexts: {
      positive: ["huzursuz", "dengesiz", "sabırsız", "sıkıntısız", "endişesiz"],
      negative: ["huzurlu", "dengeli", "sabırlı", "sıkıntılı", "endişeli"]
    }
  },
  { 
    suffix: "sız", 
    contexts: {
      positive: ["huzursuz", "dengesiz", "sabırsız", "sıkıntısız", "endişesiz"],
      negative: ["huzurlu", "dengeli", "sabırlı", "sıkıntılı", "endişeli"]
    }
  },
  { 
    suffix: "siz", 
    contexts: {
      positive: ["huzursuz", "dengesiz", "sabırsız", "sıkıntısız", "endişesiz"],
      negative: ["huzurlu", "dengeli", "sabırlı", "sıkıntılı", "endişeli"]
    }
  },
  { 
    suffix: "süz", 
    contexts: {
      positive: ["huzursuz", "dengesiz", "sabırsız", "sıkıntısız", "endişesiz"],
      negative: ["huzurlu", "dengeli", "sabırlı", "sıkıntılı", "endişeli"]
    }
  }
];

// Olumsuz eklerle oluşan kelimeler için özel gruplar
export const negativeSuffixKeywords = [
  // Huzur ile ilgili
  { "keyword": "huzursuz", "group": "zor_1" },
  { "keyword": "huzursuzluk", "group": "zor_1" },
  { "keyword": "huzursuzca", "group": "zor_1" },
  
  // Denge ile ilgili
  { "keyword": "dengesiz", "group": "zor_1" },
  { "keyword": "dengesizlik", "group": "zor_1" },
  { "keyword": "dengesizce", "group": "zor_1" },
  
  // Sabır ile ilgili
  { "keyword": "sabırsız", "group": "negatif_2" },
  { "keyword": "sabırsızlık", "group": "negatif_2" },
  { "keyword": "sabırsızca", "group": "negatif_2" },
  
  // Sıkıntı ile ilgili
  { "keyword": "sıkıntısız", "group": "pozitif_2" },
  { "keyword": "sıkıntısızlık", "group": "pozitif_2" },
  { "keyword": "sıkıntısızca", "group": "pozitif_2" },
  
  // Endişe ile ilgili
  { "keyword": "endişesiz", "group": "pozitif_2" },
  { "keyword": "endişesizlik", "group": "pozitif_2" },
  { "keyword": "endişesizce", "group": "pozitif_2" },
  
  // Öfke ile ilgili
  { "keyword": "öfkesiz", "group": "pozitif_2" },
  { "keyword": "öfkesizlik", "group": "pozitif_2" },
  { "keyword": "öfkesizce", "group": "pozitif_2" },
  
  // Korku ile ilgili
  { "keyword": "korkusuz", "group": "guclu_2" },
  { "keyword": "korkusuzluk", "group": "guclu_2" },
  { "keyword": "korkusuzca", "group": "guclu_2" },
  
  // Kaygı ile ilgili
  { "keyword": "kaygısız", "group": "pozitif_2" },
  { "keyword": "kaygısızlık", "group": "pozitif_2" },
  { "keyword": "kaygısızca", "group": "pozitif_2" },
  
  // Üzüntü ile ilgili
  { "keyword": "üzüntüsüz", "group": "pozitif_1" },
  { "keyword": "üzüntüsüzlük", "group": "pozitif_1" },
  { "keyword": "üzüntüsüzce", "group": "pozitif_1" },
  
  // Yorgunluk ile ilgili
  { "keyword": "yorgunsuz", "group": "enerji_1" },
  { "keyword": "yorgunsuzluk", "group": "enerji_1" },
  { "keyword": "yorgunsuzca", "group": "enerji_1" }
]; 