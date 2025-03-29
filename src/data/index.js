// AuraScend Data Utility
import { auraData } from "./auraData";
import { auraData2 } from "./auraData2";
import { auraData3 } from "./auraData3";
import { auraData4 } from "./auraData4";
import { auraDataExtended, auraOutputsExtended } from "./auraDataExtended";
import { auraDataExtended2 } from "./auraDataExtended2";
import { auraDataExtended3 } from "./auraDataExtended3";
import { auraDataExtended4 } from "./auraDataExtended4";
import {
  negativeContextKeywords,
  negativePatterns,
  proximityPatterns,
  negativeSuffixPatterns,
  negativeSuffixKeywords,
} from "./negativeContext";

// Combine all keywords and outputs into a single dataset
export const combinedAuraData = {
  keywords: [
    ...auraData.keywords,
    ...auraData2.keywords,
    ...auraData3.keywords,
    ...auraData4.keywords,
    ...auraDataExtended.keywords,
    ...auraDataExtended2.keywords,
    ...auraDataExtended3.keywords,
    ...auraDataExtended4.keywords,
  ],
  outputs: {
    ...auraData.outputs,
    ...auraData2.outputs,
    ...auraData3.outputs,
    ...auraData4.outputs,
    ...auraOutputsExtended,
    ...auraDataExtended2.outputs,
    ...auraDataExtended3.outputs,
    ...auraDataExtended4.outputs,
  },
};

// Metni cümlelere ayırma
const splitIntoParagraphs = (text) => {
  return text
    .replace(/\n+/g, ".|.") // Paragraf işaretleyici
    .replace(/\s*\.\s*/g, ". ") // Nokta ve boşlukları normalleştir
    .split(".|.") // İşaretleyiciyle böl
    .filter((p) => p.trim().length > 0); // Boş paragrafları kaldır
};

// Metni cümlelere ayırma
const splitIntoSentences = (text) => {
  return text
    .replace(/([.?!])\s*(?=[A-Z])/g, "$1|") // Büyük harfle başlayan noktadan sonraki yerleri böl
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
};

// Kelimelerin birbirine yakınlığını kontrol et
const checkWordProximity = (text) => {
  const words = text.toLowerCase().split(/\s+/);
  const proximityMatches = [];

  for (const [positiveWord, negativeWord, maxDistance] of proximityPatterns) {
    let posIndices = [];
    let negIndices = [];

    // Pozitif ve negatif kelimelerin indekslerini bul
    words.forEach((word, index) => {
      if (word.includes(positiveWord)) posIndices.push(index);
      if (word.includes(negativeWord)) negIndices.push(index);
    });

    // Her iki tür kelime de varsa yakınlık kontrolü yap
    if (posIndices.length > 0 && negIndices.length > 0) {
      for (const posIdx of posIndices) {
        for (const negIdx of negIndices) {
          const distance = Math.abs(posIdx - negIdx);
          if (distance <= maxDistance) {
            // Yakınlık eşleşmesi bulundu
            proximityMatches.push({
              positiveWord,
              negativeWord,
              distance,
              pattern: `${positiveWord}-${negativeWord}`,
              // Eğer negatif kelime önce geliyorsa daha güçlü negatif bağlam olabilir
              weight: negIdx < posIdx ? 2 : 1,
            });
          }
        }
      }
    }
  }

  return proximityMatches;
};

// Cümlede duygu analizi
const analyzeSentiment = (sentence) => {
  // Olumsuzlama ifadeleri sayısı
  let negationCount = 0;

  // Olumsuzlama kelimeleri
  const negationWords = [
    "değil",
    "yok",
    "asla",
    "hiç",
    "olmayan",
    "olmaz",
    "olmadı",
    "olmadım",
    "olmayacak",
    "değilim",
    "değildir",
    "olamıyorum",
    "bulamıyorum",
    "hissedemiyorum",
  ];

  // Negatif duygular
  const negativeWords = [
    "üzgün",
    "mutsuz",
    "keder",
    "acı",
    "kızgın",
    "öfke",
    "korku",
    "endişe",
    "kaygı",
    "yalnız",
    "yorgun",
    "bitkin",
    "umutsuz",
    "çaresiz",
    "üzüntü",
    "hüzün",
  ];

  // Pozitif duygular
  const positiveWords = [
    "mutlu",
    "huzur",
    "neşe",
    "sevinç",
    "umut",
    "sevgi",
    "güven",
    "heyecan",
    "keyif",
    "memnun",
    "tatmin",
    "başarı",
  ];

  const words = sentence.toLowerCase().split(/\s+/);

  // Olumsuzlama ve duygu kelimeleri eşleşmelerini tut
  const negationMatches = [];
  const positiveMatches = [];
  const negativeMatches = [];

  // Eşleşme indeksleri için yapı
  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // Olumsuzlama kelimeleri kontrolü
    for (const neg of negationWords) {
      if (word.includes(neg)) {
        negationMatches.push({ word, index: i, type: "negation" });
        negationCount++;
      }
    }

    // Pozitif kelime kontrolü
    for (const pos of positiveWords) {
      if (word.includes(pos)) {
        positiveMatches.push({ word, index: i, type: "positive" });
      }
    }

    // Negatif kelime kontrolü
    for (const neg of negativeWords) {
      if (word.includes(neg)) {
        negativeMatches.push({ word, index: i, type: "negative" });
      }
    }
  }

  // Pozitif ve negatif kelime sayıları
  let positiveCount = 0;
  let negativeCount = 0;

  // Özel durum: Negatif duygu + olumsuzlama çifti kontrolü (pozitif anlam taşır)
  const specialNegativeNegationPairs = [];

  for (const negEmotion of negativeMatches) {
    for (const negation of negationMatches) {
      const distance = Math.abs(negEmotion.index - negation.index);

      // Yakındaki olumsuzlama, negatif duyguyu olumsuza çevirir (pozitif olur)
      if (distance <= 5) {
        specialNegativeNegationPairs.push({
          negationWord: negation.word,
          negativeWord: negEmotion.word,
          distance,
        });

        // Bu, negatif duygunun olumsuzlanmasıdır, yani pozitiftir
        positiveCount++;

        // Bu negatif duyguyu sayma
        negativeCount--;
      }
    }
  }

  // Normal pozitif ve negatif sayımı (özel durumlar dışında)
  positiveCount += positiveMatches.length;
  negativeCount += negativeMatches.length;

  // Yakınlık kontrolü yap
  const proximityResults = checkWordProximity(sentence);

  // Proximity eşleşmelerine göre negatif puanı artır
  let proximityScore = 0;
  if (proximityResults.length > 0) {
    proximityScore = proximityResults.reduce(
      (sum, match) => sum + match.weight,
      0
    );
    // Proximity sadece negatifleri artırır (pozitif kelimeleri olumsuzlar)
    negativeCount += proximityScore;
  }

  // Sentiment skoru hesapla
  const sentimentScore = positiveCount - negativeCount;

  // Özel durum: Negatif duygu olumsuzlaması için normal olumsuzlama kuralı geçersiz
  // Örnek: "Üzüntü yok" -> Bu pozitiftir, olumsuzlama duyguyu tersine çevirmez
  if (specialNegativeNegationPairs.length > 0) {
    // Özel durumlarda olumsuzlama sayısını azalt
    negationCount -= specialNegativeNegationPairs.length;
  }

  // Çift olumsuzlamanın pozitif etki yapabileceğini hesaba kat
  // Ancak özel durumda değilse
  if (specialNegativeNegationPairs.length === 0 && negationCount % 2 === 1) {
    return -sentimentScore; // Tek olumsuzlama varsa, duygu tersine çevrilir
  }

  return sentimentScore;
};

// Metin bağlamını daha derin analiz et
const deepContextAnalysis = (text) => {
  // Metin bölümlerini ayrıştır
  const paragraphs = splitIntoParagraphs(text);
  const allSentences = [];

  // Her paragraftan cümleleri çıkar
  paragraphs.forEach((paragraph) => {
    const sentences = splitIntoSentences(paragraph);
    allSentences.push(...sentences);
  });

  // Cümle bazlı analiz
  const sentenceScores = allSentences.map((sentence) => {
    return {
      sentence,
      score: analyzeSentiment(sentence),
    };
  });

  // Negatif ve pozitif cümleler
  const negativeSentences = sentenceScores.filter((s) => s.score < 0);
  const positiveSentences = sentenceScores.filter((s) => s.score > 0);
  const neutralSentences = sentenceScores.filter((s) => s.score === 0);

  // Genel duygu puanı
  const overallScore = sentenceScores.reduce(
    (total, current) => total + current.score,
    0
  );

  // Metindeki son cümleye daha fazla ağırlık ver (kişi sonuç ifade eder genellikle)
  const lastSentenceScore =
    sentenceScores.length > 0
      ? sentenceScores[sentenceScores.length - 1].score * 1.5
      : 0;

  // Proximity kalıpları tüm metin üzerinde de kontrol et
  const proximityResult = checkWordProximity(text);

  // Özel durumlar için kalıp kontrolü
  const specialNegativeEmotionNegatedPatterns =
    checkForNegatedNegativeEmotions(text);

  // Proximity sonucu güçlü bir negatif kalıp varsa, bunu skora ekle
  const proximityScore = proximityResult.reduce(
    (sum, match) => sum + match.weight,
    0
  );

  // Negatif duyguların olumsuzlandığı ifadeleri kontrol et
  const specialPositiveScore =
    specialNegativeEmotionNegatedPatterns.length > 0 ? 2 : 0;

  // Skorları ayarla
  const adjustedScore =
    overallScore - proximityScore * 0.8 + specialPositiveScore * 1.5;

  // Ciddi yaşam olayları kontrolü - bunlar skoru önemli ölçüde etkilemeli
  const seriousLifeEvents = checkForSeriousLifeEvents(text);
  const lifeEventImpact =
    seriousLifeEvents.length > 0 ? -3 * seriousLifeEvents.length : 0;

  // Skorları ciddi yaşam olaylarına göre ayarla
  const finalScore = adjustedScore + lifeEventImpact;

  // Baskın duygu
  let dominantGroup = "notr_1";

  // Ciddi yaşam olayları varsa, her zaman negatif bağlamda değerlendir
  if (seriousLifeEvents.length > 0) {
    dominantGroup = "negatif_1"; // Varsayılan negatif

    // Olayın türüne göre farklı negatif gruplar seçilebilir
    if (
      seriousLifeEvents.some(
        (e) => e.includes("kaybet") || e.includes("ölüm") || e.includes("vefat")
      )
    ) {
      dominantGroup = "negatif_1"; // Melankoli
    } else if (
      seriousLifeEvents.some((e) => e.includes("öfke") || e.includes("kızgın"))
    ) {
      dominantGroup = "negatif_2"; // Öfkeli
    } else if (
      seriousLifeEvents.some(
        (e) =>
          e.includes("korku") || e.includes("endişe") || e.includes("kaygı")
      )
    ) {
      dominantGroup = "negatif_3"; // Güvensiz
    }
  }
  // Özel durum: Negatif duygu olumsuzlaması için normal olumsuzlama kuralı geçersiz
  // Örnek: "Üzüntü yok" -> Bu pozitiftir, olumsuzlama duyguyu tersine çevirmez
  else if (specialNegativeEmotionNegatedPatterns.length > 0) {
    // Özel durumlarda olumsuzlama sayısını azalt
    const negationCount = 0; // Özel durum olduğu için olumsuzlama sayısını sıfırla

    // Hangi duygunun yokluğuna göre farklı pozitif duygu ata
    const mainPattern = specialNegativeEmotionNegatedPatterns[0];
    if (
      mainPattern.includes("korku") ||
      mainPattern.includes("endişe") ||
      mainPattern.includes("kaygı")
    ) {
      dominantGroup = "pozitif_7"; // Güçlü
    } else if (
      mainPattern.includes("üzüntü") ||
      mainPattern.includes("mutsuz") ||
      mainPattern.includes("hüzün")
    ) {
      dominantGroup = "pozitif_1"; // Neşeli
    } else if (pattern.includes("stres") || pattern.includes("yorgun")) {
      dominantGroup = "pozitif_2"; // Stres yoksa -> Huzurlu
    } else if (mainPattern.includes("öfke") || mainPattern.includes("kızgın")) {
      dominantGroup = "denge_2"; // Barışçıl
    } else if (mainPattern.includes("acı") || mainPattern.includes("keder")) {
      dominantGroup = "pozitif_8"; // Canlandırıcı
    }
  } else if (finalScore + lastSentenceScore < -2) {
    dominantGroup = "negatif_1";

    // Farklı negatif gruplar
    if (
      proximityResult.some(
        (m) => m.negativeWord === "korku" || m.negativeWord === "endişe"
      )
    ) {
      dominantGroup = "negatif_3";
    } else if (
      proximityResult.some(
        (m) => m.negativeWord === "öfke" || m.negativeWord === "kızgın"
      )
    ) {
      dominantGroup = "negatif_2";
    } else if (
      proximityResult.some(
        (m) => m.negativeWord === "utanç" || m.negativeWord === "şüphe"
      )
    ) {
      dominantGroup = "negatif_4";
    }
  } else if (finalScore + lastSentenceScore > 2) {
    dominantGroup = "pozitif_1";

    // Farklı pozitif gruplar - metin içeriğine göre
    if (
      text.toLowerCase().includes("sevgi") ||
      text.toLowerCase().includes("aşk")
    ) {
      dominantGroup = "pozitif_6";
    } else if (
      text.toLowerCase().includes("huzur") ||
      text.toLowerCase().includes("sakin")
    ) {
      dominantGroup = "pozitif_2";
    } else if (
      text.toLowerCase().includes("başarı") ||
      text.toLowerCase().includes("güç")
    ) {
      dominantGroup = "pozitif_7";
    } else if (
      text.toLowerCase().includes("umut") ||
      text.toLowerCase().includes("iyimser")
    ) {
      dominantGroup = "pozitif_3";
    }
  } else if (
    (text.toLowerCase().includes("emin değilim") ||
      text.toLowerCase().includes("bilmiyorum")) &&
    (text.toLowerCase().includes("mutlu") ||
      text.toLowerCase().includes("nasıl hissettiğimi") ||
      text.toLowerCase().includes("ne hissettiğimi"))
  ) {
    dominantGroup = "belirsiz_1"; // Belirsiz duygular
  }

  // Güçlü olumsuzlama kalıplarını bul
  const hasStrongNegationPatterns = proximityResult.some(
    (match) => match.weight > 1
  );

  return {
    overallScore,
    lastSentenceScore,
    adjustedScore: finalScore,
    positiveSentences: positiveSentences.length,
    negativeSentences: negativeSentences.length,
    neutralSentences: neutralSentences.length,
    proximityPatterns: proximityResult,
    hasStrongNegationPatterns,
    dominantGroup,
    specialNegativeEmotionNegatedPatterns,
    seriousLifeEvents,
  };
};

// Ciddi yaşam olaylarını kontrol et
const checkForSeriousLifeEvents = (text) => {
  const lowerText = text.toLowerCase();
  const seriousEvents = [
    "annemi kaybettim",
    "babamı kaybettim",
    "eşimi kaybettim",
    "sevgilimi kaybettim",
    "ayrıldık",
    "boşandık",
    "işimi kaybettim",
    "işsiz kaldım",
    "hastalık",
    "kanser",
    "depresyon",
    "intihar",
    "kaza geçirdim",
    "evim yandı",
    "evimden oldum",
    "borç",
    "iflas",
    "hayatım pek yolunda gitmiyor",
    "hayatım berbat",
  ];

  const foundEvents = [];

  for (const event of seriousEvents) {
    if (lowerText.includes(event)) {
      foundEvents.push(event);
    }
  }

  return foundEvents;
};

// Negatif duyguların olumsuzlandığı ifadeleri kontrol et
const checkForNegatedNegativeEmotions = (text) => {
  const lowerText = text.toLowerCase();
  const negativeEmotions = [
    "üzüntü",
    "hüzün",
    "mutsuzluk",
    "acı",
    "sıkıntı",
    "endişe",
    "korku",
    "kaygı",
    "öfke",
    "stres",
  ];
  const negations = [
    "yok",
    "değil",
    "olmadan",
    "olmadı",
    "olmaz",
    "uzun zamandır yok",
    "hayatımda yok",
  ];

  // Özel kalıplar için arama
  const patterns = [];

  for (const emotion of negativeEmotions) {
    for (const negation of negations) {
      // Farklı diziliş biçimlerini kontrol et
      const patterns1 = `${emotion} ${negation}`;
      const patterns2 = `${negation} ${emotion}`;
      const patterns3 = `${emotion}${negation}`;

      if (lowerText.includes(patterns1)) {
        patterns.push(patterns1);
      }
      if (lowerText.includes(patterns2)) {
        patterns.push(patterns2);
      }
      if (lowerText.includes(patterns3)) {
        patterns.push(patterns3);
      }
    }
  }

  return patterns;
};

// Özel kalıpları kontrol et - doğrudan metinde ağırlıklı tanıma
const checkDirectNegationPatterns = (text) => {
  const lowerText = text.toLowerCase();

  // Bu ifadeler doğrudan olumsuz bağlamda kullanılan duygularla ilgili
  const directPatterns = [
    { text: "mutluluk benim için yok", group: "negatif_1" },
    { text: "mutluluk uzun süredir yok", group: "negatif_1" },
    { text: "mutluluk artık yok", group: "negatif_1" },
    { text: "mutluluk hayatımda yok", group: "negatif_1" },
    { text: "huzur bulamıyorum", group: "negatif_3" },
    { text: "mutlu değilim", group: "negatif_1" },
    { text: "huzurlu değilim", group: "negatif_1" },
    { text: "mutluluk hissetmiyorum", group: "negatif_1" },
    { text: "uzun bir süredir", group: "negatif_1" },
    { text: "kendimi kötü hissediyorum", group: "negatif_1" },
    { text: "hiçbir şeyden zevk alamıyorum", group: "negatif_1" },
    { text: "içimde bir boşluk var", group: "negatif_1" },
    { text: "artık eskisi gibi değil", group: "karmasik_1" },

    // Yeni eklenen duygular için özel kalıplar
    { text: "sevinç hissetmiyorum", group: "negatif_1" },
    { text: "neşe kalmadı", group: "negatif_1" },
    { text: "huzur kalmadı", group: "negatif_1" },
    { text: "heyecanımı kaybettim", group: "negatif_1" },
    { text: "coşkumu kaybettim", group: "negatif_1" },
    { text: "enerjim tükendi", group: "zor_3" },
    { text: "umudum bitti", group: "zor_3" },
    { text: "özgüvenim yok", group: "zor_2" },
    { text: "karamsarlık hissediyorum", group: "negatif_4" },
    { text: "içimde bir boşluk var", group: "zor_4" },
    { text: "yorgunluk hissediyorum", group: "zor_3" },
    { text: "sıkışmış hissediyorum", group: "zor_2" },
    { text: "hiçbir şeyden keyif alamıyorum", group: "negatif_1" },
    { text: "tatmin olmuyorum", group: "zor_2" },
    { text: "memnuniyet kalmadı", group: "negatif_1" },
    { text: "şefkat göremiyorum", group: "karmasik_2" },
    { text: "şefkat bulamıyorum", group: "karmasik_2" },
    { text: "öfke kontrol edemiyorum", group: "negatif_2" },
    { text: "korku içindeyim", group: "negatif_3" },
    { text: "panik yapıyorum", group: "negatif_3" },
    { text: "endişe içindeyim", group: "negatif_3" },
    { text: "takdir görmüyorum", group: "karmasik_2" },
    { text: "minnettarlık hissetmiyorum", group: "zor_1" },
    { text: "varoluşsal sorgulama içindeyim", group: "zor_4" },
    { text: "arayışta hissediyorum", group: "karmasik_1" },
    { text: "denge bulamıyorum", group: "notr_1" },
    { text: "özgürlük hissetmiyorum", group: "zor_2" },
    { text: "anlamsızlık hissediyorum", group: "zor_4" },

    // Yeni eklenen ciddi ifadeler
    { text: "annemi kaybettim", group: "negatif_1" },
    { text: "babamı kaybettim", group: "negatif_1" },
    { text: "eşimi kaybettim", group: "negatif_1" },
    { text: "sevgilimi kaybettim", group: "negatif_1" },
    { text: "hayatım pek yolunda gitmiyor", group: "negatif_1" },
    { text: "hayatım yolunda gitmiyor", group: "negatif_1" },
    { text: "işler yolunda gitmiyor", group: "negatif_1" },
    { text: "kendimi iyi hissetmiyorum", group: "negatif_1" },
    { text: "mutsuz hissediyorum", group: "negatif_1" },
    { text: "kaygılıyım", group: "negatif_3" },
    { text: "mutlu muyum bilmiyorum", group: "belirsiz_1" },
    { text: "mutlu olduğuma emin değilim", group: "belirsiz_1" },
    { text: "nasıl hissettiğimi bilmiyorum", group: "belirsiz_1" },
    { text: "ne hissettiğimi bilmiyorum", group: "belirsiz_1" },
    { text: "mutlu değilim", group: "negatif_1" },
    { text: "iyi değilim", group: "negatif_1" },
    { text: "berbat hissediyorum", group: "negatif_1" },
    { text: "mahvoldum", group: "negatif_1" },
    { text: "yalnızlık hissediyorum", group: "zor_2" },
    { text: "kayıp hissediyorum", group: "negatif_1" },
    { text: "hayatım berbat", group: "negatif_1" },
    { text: "hayatım karanlık", group: "negatif_1" },
    { text: "umutsuzluk hissediyorum", group: "zor_3" },
    { text: "bir şey yapmak istemiyorum", group: "zor_3" },
    { text: "isteksizim", group: "zor_3" },
    { text: "yas tutuyorum", group: "negatif_1" },
    { text: "depresyondayım", group: "negatif_1" },
    { text: "depresif hissediyorum", group: "negatif_1" },
    { text: "intihara meyilliyim", group: "negatif_1" },
    { text: "hayattan zevk alamıyorum", group: "negatif_1" },
    { text: "neşeli değilim", group: "negatif_1" },
  ];

  // Pozitif özel kalıplar - Negatif duygular veya durumların olmaması pozitif sonuç verir
  const positiveDirectPatterns = [
    { text: "üzüntü hayatımda yok", group: "pozitif_1" },
    { text: "üzüntü uzun zamandır yok", group: "pozitif_1" },
    { text: "mutsuzluk yok", group: "pozitif_1" },
    { text: "endişe duymuyorum", group: "pozitif_2" },
    { text: "hüzün olmadan", group: "pozitif_1" },
    { text: "stres olmadan", group: "pozitif_2" },
    { text: "korku hissetmiyorum", group: "pozitif_7" },
    { text: "kaygı taşımıyorum", group: "pozitif_2" },
    { text: "keder artık yok", group: "pozitif_1" },
  ];

  // Önce pozitif kalıpları kontrol et
  for (const pattern of positiveDirectPatterns) {
    if (lowerText.includes(pattern.text)) {
      return {
        found: true,
        keyword: pattern.text,
        group: pattern.group,
      };
    }
  }

  // Sonra negatif kalıpları kontrol et
  for (const pattern of directPatterns) {
    if (lowerText.includes(pattern.text)) {
      return {
        found: true,
        keyword: pattern.text,
        group: pattern.group,
      };
    }
  }

  return { found: false };
};

// Check if a keyword is negated in the text
const isKeywordNegated = (text, keyword, keywordIndex) => {
  // Olumsuzlama ifadeleri
  const negationWords = [
    "değil",
    "yok",
    "olmayan",
    "olmaz",
    "olmadı",
    "olmadım",
    "olmayacak",
    "asla",
    "hiç",
    "hiçbir",
    "istemiyorum",
    "istemem",
    "uzak",
    "bulamıyorum",
  ];

  // Kelimenin etrafındaki metni kontrol et
  // Kelimenin öncesindeki ve sonrasındaki 5 kelimeyi kontrol edelim
  const context = 5;
  const words = text.toLowerCase().split(/\s+/);

  // Find the word's position in the split array
  let wordPos = -1;
  let currentPos = 0;

  for (let i = 0; i < words.length; i++) {
    const nextPos = currentPos + words[i].length;
    if (keywordIndex >= currentPos && keywordIndex < nextPos) {
      wordPos = i;
      break;
    }
    // Boşluk için ekstra karakter ekle
    currentPos = nextPos + 1;
  }

  if (wordPos === -1) return false;

  // Özel durumları kontrol et - negatif duygular için olumsuzlama pozitif anlam olabilir
  const isNegativeEmotion = [
    "üzüntü",
    "keder",
    "mutsuzluk",
    "acı",
    "endişe",
    "kaygı",
    "korku",
  ].includes(keyword);

  // Negatif duygular için olumsuzlama varsa, aslında pozitif anlam olur, o yüzden olumsuzlama yapmıyoruz
  if (isNegativeEmotion) {
    for (let i = Math.max(0, wordPos - context); i < wordPos; i++) {
      if (negationWords.some((negWord) => words[i].includes(negWord))) {
        return false; // Negatif duygu olumsuzlanırsa pozitif anlam taşır, bu yüzden olumsuzlama yok kabul ediyoruz
      }
    }

    for (
      let i = wordPos + 1;
      i < Math.min(words.length, wordPos + context + 1);
      i++
    ) {
      if (negationWords.some((negWord) => words[i].includes(negWord))) {
        return false; // Negatif duygu olumsuzlanırsa pozitif anlam taşır, bu yüzden olumsuzlama yok kabul ediyoruz
      }
    }

    return false; // Negatif duygu olumsuzlama yoksa normal kabul ediyoruz
  }

  // Pozitif duygular için normal olumsuzlama kontrolü
  for (let i = Math.max(0, wordPos - context); i < wordPos; i++) {
    if (negationWords.some((negWord) => words[i].includes(negWord))) {
      return true;
    }
  }

  // Check words after
  for (
    let i = wordPos + 1;
    i < Math.min(words.length, wordPos + context + 1);
    i++
  ) {
    if (negationWords.some((negWord) => words[i].includes(negWord))) {
      return true;
    }
  }

  // Özel kalıpları kontrol et
  const specialPattern = checkSpecialNegativePatterns(text, keyword);
  if (specialPattern) {
    return true;
  }

  return false;
};

// Özel olumsuz kalıpları kontrol et
const checkSpecialNegativePatterns = (text, keyword) => {
  const lowerText = text.toLowerCase();

  // Pozitif duygu kalıplarını kontrol et
  for (const pattern of negativePatterns) {
    if (keyword === pattern.positiveWord) {
      // Bu pozitif duygu için negatif bağlamları kontrol et
      for (const negContext of pattern.negativeContexts) {
        if (
          lowerText.includes(`${keyword} ${negContext}`) ||
          lowerText.includes(`${negContext} ${keyword}`) ||
          lowerText.includes(`${keyword}... ${negContext}`) ||
          lowerText.includes(`${keyword}, ${negContext}`)
        ) {
          return true;
        }
      }
    }
  }

  return false;
};

// Check for negative context keywords in the text
const checkForNegativeContext = (text) => {
  const lowerText = text.toLowerCase();
  const negativeMatches = [];

  negativeContextKeywords.keywords.forEach((item) => {
    if (lowerText.includes(item.keyword.toLowerCase())) {
      negativeMatches.push(item);
    }
  });

  return negativeMatches;
};

// Helper function to find matching keywords in text
export const findMatchingKeywords = (text) => {
  if (!text) return [];

  // Önce derin metin analizi yap
  const contextAnalysis = deepContextAnalysis(text);
  console.log("Bağlam analizi:", contextAnalysis);

  // Ciddi yaşam olayları varsa, bunlara öncelik ver
  if (
    contextAnalysis.seriousLifeEvents &&
    contextAnalysis.seriousLifeEvents.length > 0
  ) {
    console.log(
      "Ciddi yaşam olayları tespit edildi:",
      contextAnalysis.seriousLifeEvents
    );
    return [
      {
        keyword: "yaşam olayı: " + contextAnalysis.seriousLifeEvents[0],
        group: contextAnalysis.dominantGroup || "negatif_1",
      },
    ];
  }

  // Güçlü olumsuzlama kalıpları varsa, bunlara öncelik ver
  if (
    contextAnalysis.hasStrongNegationPatterns &&
    contextAnalysis.proximityPatterns.length > 0
  ) {
    console.log(
      "Yakınlık kalıpları tespit edildi:",
      contextAnalysis.proximityPatterns
    );
    // Proximity pattern'lere göre negatif grup seç
    return [
      {
        keyword:
          "olumsuz bağlam: " + contextAnalysis.proximityPatterns[0].pattern,
        group: contextAnalysis.dominantGroup || "negatif_1",
      },
    ];
  }

  // Eğer belirgin bir negatif eğilim varsa, negatif duygu döndür
  if (
    contextAnalysis.adjustedScore + contextAnalysis.lastSentenceScore < -2 ||
    contextAnalysis.negativeSentences > contextAnalysis.positiveSentences + 1
  ) {
    console.log("Derin analiz sonucu negatif bağlam tespit edildi");
    return [
      {
        keyword: "negatif bağlam",
        group: contextAnalysis.dominantGroup,
      },
    ];
  }

  // Belirsiz duygular için özel kontrol
  if (
    (text.toLowerCase().includes("emin değilim") ||
      text.toLowerCase().includes("bilmiyorum")) &&
    (text.toLowerCase().includes("mutlu") ||
      text.toLowerCase().includes("nasıl hissettiğimi") ||
      text.toLowerCase().includes("ne hissettiğimi"))
  ) {
    console.log("Belirsiz duygular tespit edildi");
    const outputs = getAllOutputs();
    return [
      {
        keyword: "belirsiz duygular",
        group: "belirsiz_1",
      },
    ];
  }

  // Önce doğrudan olumsuz kalıpları kontrol et
  const directPattern = checkDirectNegationPatterns(text);
  if (directPattern.found) {
    console.log("Doğrudan olumsuz kalıp bulundu:", directPattern.keyword);
    // Özel bir olumsuz duygu durumu varsa, doğrudan onu döndür
    const negativeItem = {
      keyword: directPattern.keyword,
      group: directPattern.group,
    };
    return [negativeItem];
  }

  const lowerText = text.toLowerCase();
  const matches = [];
  const negatedKeywords = [];

  // Olumsuzlama ifadeleri içeren kelimeler
  const negationWords = [
    "değilim",
    "değil",
    "yok",
    "olmayan",
    "olmaz",
    "olmadı",
    "olmadım",
    "olmayacak",
    "asla",
    "hiç",
    "hiçbir",
    "istemiyorum",
    "istemem",
    "uzak",
    "bulamıyorum",
    "hissetmiyorum",
    "emin değilim",
  ];

  // Metin içinde olumsuzlama ifadeleri var mı kontrol et
  const hasNegations = negationWords.some((word) => lowerText.includes(word));

  // Tüm anahtar kelimeleri kontrol et
  for (const item of combinedAuraData.keywords) {
    const keyword = item.keyword.toLowerCase();

    // Tüm eşleşmeleri bul
    let startIndex = 0;
    let keywordIndex;

    while ((keywordIndex = lowerText.indexOf(keyword, startIndex)) !== -1) {
      // Anahtar kelime bulundu, olumsuzlama kontrolü yap
      const negated = isKeywordNegated(text, keyword, keywordIndex);

      // Eğer kelime olumsuzlanmamışsa listeye ekle
      if (!negated) {
        matches.push(item);
      } else {
        console.log(
          `Olumsuzlanmış kelime: ${keyword} (pozisyon: ${keywordIndex})`
        );
        negatedKeywords.push(item);
      }

      // Sonraki aramaya devam et
      startIndex = keywordIndex + keyword.length;
    }
  }

  // Olumsuz bağlam kontrolü yap
  const negativeMatches = checkForNegativeContext(text);

  // Eğer pozitif kelimeler olumsuzlandıysa ve olumsuz bağlam kelimeleri varsa veya genel olumsuzlama ifadeleri varsa
  if (
    (negatedKeywords.length > 0 && negativeMatches.length > 0) ||
    (hasNegations && negativeMatches.length > 0)
  ) {
    console.log(
      "Olumsuzlanmış kelimeler var, olumsuz bağlam kelimeleri kullanılıyor"
    );
    return [...negativeMatches, ...matches]; // Olumsuz bağlam kelimelerine öncelik ver
  }

  // Son cümleye daha fazla ağırlık ver (genellikle son cümle kişinin genel hissini yansıtır)
  if (contextAnalysis.lastSentenceScore < 0 && matches.length > 0) {
    // Son cümle negatifse, negatif kelimelere öncelik ver
    const negativeGroups = matches.filter(
      (m) =>
        m.group.includes("negatif") ||
        m.group.includes("zor") ||
        m.group.includes("karmasik") ||
        m.group.includes("belirsiz")
    );

    if (negativeGroups.length > 0) {
      console.log("Son cümle negatif, negatif kelimelere öncelik veriliyor");
      return [
        ...negativeGroups,
        ...matches.filter((m) => !negativeGroups.includes(m)),
      ];
    }
  }

  return [...matches, ...negativeMatches];
};

// Helper function to get output for a specific group
export const getOutputForGroup = (group) => {
  return combinedAuraData.outputs[group] || null;
};

// Tüm aura verilerini birleştir
export const getAllKeywords = () => {
  return [
    ...auraData.keywords,
    ...auraData2.keywords,
    ...auraData3.keywords,
    ...auraData4.keywords,
    ...auraDataExtended.keywords,
    ...auraDataExtended2.keywords,
    ...auraDataExtended3.keywords,
    ...auraDataExtended4.keywords,
  ];
};

// Aura çıktılarına müzik dosyalarını ata
const addImagePathsToOutputs = (outputs) => {
  const updatedOutputs = { ...outputs };
  
  // Aura görsellerini ata
  if (updatedOutputs.pozitif_1) updatedOutputs.pozitif_1.image = "/images/auras/aura_neseli_pozitif1.png";
  if (updatedOutputs.pozitif_2) updatedOutputs.pozitif_2.image = "/images/auras/aura_huzurlu_pozitif2.png";
  if (updatedOutputs.pozitif_3) updatedOutputs.pozitif_3.image = "/images/auras/aura_iyimser_pozitif3.png";
  if (updatedOutputs.pozitif_4) updatedOutputs.pozitif_4.image = "/images/auras/aura_heyecan_dolu_pozitif4.png";
  if (updatedOutputs.pozitif_5) updatedOutputs.pozitif_5.image = "/images/auras/aura_sefkat_dolu_pozitif5.png";
  if (updatedOutputs.pozitif_6) updatedOutputs.pozitif_6.image = "/images/auras/aura_buyuleyici_pozitif6.png";
  if (updatedOutputs.pozitif_7) updatedOutputs.pozitif_7.image = "/images/auras/aura_guclu_pozitif7.png";
  if (updatedOutputs.pozitif_8) updatedOutputs.pozitif_8.image = "/images/auras/aura_canlandirici_pozitif8.png";
  if (updatedOutputs.pozitif_9) updatedOutputs.pozitif_9.image = "/images/auras/aura_umut_dolu_pozitif9.png";
  if (updatedOutputs.negatif_1) updatedOutputs.negatif_1.image = "/images/auras/aura_melankolik_negatif1.png";
  if (updatedOutputs.negatif_2) updatedOutputs.negatif_2.image = "/images/auras/aura_ofkeli_negatif2.png";
  if (updatedOutputs.negatif_3) updatedOutputs.negatif_3.image = "/images/auras/aura_tedirgin_negatif3.png";
  if (updatedOutputs.negatif_4) updatedOutputs.negatif_4.image = "/images/auras/aura_utanc_suphe_negatif4.png";
  if (updatedOutputs.duragan_1) updatedOutputs.duragan_1.image = "/images/auras/aura_sakin_duragan1.png";
  if (updatedOutputs.duragan_2) updatedOutputs.duragan_2.image = "/images/auras/aura_derin_dusunen_duragan2.png";
  
  // Karmaşık aura görsellerini güncelle
  if (updatedOutputs.karmasik_1) updatedOutputs.karmasik_1.image = "/images/auras/aura_tutkulu_karmasik3.png";
  if (updatedOutputs.karmasik_2) updatedOutputs.karmasik_2.image = "/images/auras/aura_tutkulu_karmasik3.png";
  if (updatedOutputs.karmasik_3) updatedOutputs.karmasik_3.image = "/images/auras/aura_tutkulu_karmasik3.png";
  
  if (updatedOutputs.sosyal_1) updatedOutputs.sosyal_1.image = "/images/auras/aura_sevgi_dolu_sosyal1.png";
  if (updatedOutputs.sosyal_2) updatedOutputs.sosyal_2.image = "/images/auras/aura_minnettar_sosyal2.png";
  if (updatedOutputs.sosyal_3) updatedOutputs.sosyal_3.image = "/images/auras/aura_guven_veren_sosyal3.png";
  if (updatedOutputs.bireysel_1) updatedOutputs.bireysel_1.image = "/images/auras/aura_gururlu_bireysel1.png";
  if (updatedOutputs.bireysel_2) updatedOutputs.bireysel_2.image = "/images/auras/aura_ozgur_bireysel2.png";
  if (updatedOutputs.bireysel_3) updatedOutputs.bireysel_3.image = "/images/auras/aura_yaratici_bireysel3.png";
  if (updatedOutputs.zor_1) updatedOutputs.zor_1.image = "/images/auras/aura_huzursuz_zor1.png";
  if (updatedOutputs.zor_2) updatedOutputs.zor_2.image = "/images/auras/aura_sikismis_hisseden_zor2.png";
  if (updatedOutputs.zor_3) updatedOutputs.zor_3.image = "/images/auras/aura_yorgun_zor3.png";
  if (updatedOutputs.zor_4) updatedOutputs.zor_4.image = "/images/auras/aura_varoluşsal_sorgulamada_zor4.png";
  if (updatedOutputs.guclu_1) updatedOutputs.guclu_1.image = "/images/auras/aura_kararli_guclu1.png";
  if (updatedOutputs.guclu_2) updatedOutputs.guclu_2.image = "/images/auras/aura_cesur_guclu2.png";
  if (updatedOutputs.guclu_3) updatedOutputs.guclu_3.image = "/images/auras/aura_dayanikli_guclu3.png";
  if (updatedOutputs.hassas_1) updatedOutputs.hassas_1.image = "/images/auras/aura_nazik_hassas1.png";
  if (updatedOutputs.hassas_2) updatedOutputs.hassas_2.image = "/images/auras/aura_duygusal_hassas2.png";
  if (updatedOutputs.degisim_1) updatedOutputs.degisim_1.image = "/images/auras/aura_donusum_degisim1.png";
  if (updatedOutputs.degisim_2) updatedOutputs.degisim_2.image = "/images/auras/aura_yenileyici_degisim2.png";
  if (updatedOutputs.zihinsel_1) updatedOutputs.zihinsel_1.image = "/images/auras/aura_merakli_zihinsel1.png";
  if (updatedOutputs.zihinsel_2) updatedOutputs.zihinsel_2.image = "/images/auras/aura_analitik_zihinsel2.jpeg";
  if (updatedOutputs.zihinsel_3) updatedOutputs.zihinsel_3.image = "/images/auras/aura_bilge_zihinsel3.jpeg";
  if (updatedOutputs.zihinsel_4) updatedOutputs.zihinsel_4.image = "/images/auras/aura_odaklanmis_zihinsel4.png";
  if (updatedOutputs.denge_1) updatedOutputs.denge_1.image = "/images/auras/aura_uyumlu_denge1.png";
  if (updatedOutputs.denge_2) updatedOutputs.denge_2.image = "/images/auras/aura_bariscil_denge2.png";
  if (updatedOutputs.spirituel_1) updatedOutputs.spirituel_1.image = "/images/auras/aura_aydinlanmis_spirituel1.png";
  if (updatedOutputs.spirituel_2) updatedOutputs.spirituel_2.image = "/images/auras/aura_mistik_spirituel2.png";
  if (updatedOutputs.enerji_1) updatedOutputs.enerji_1.image = "/images/auras/aura_dinamik_enerji1.png";
  if (updatedOutputs.enerji_2) updatedOutputs.enerji_2.image = "/images/auras/aura_parlak_enerji2.png";
  if (updatedOutputs.sanatsal_1) updatedOutputs.sanatsal_1.image = "/images/auras/aura_sanatsal_sanatsal1.png";
  if (updatedOutputs.edebi_1) updatedOutputs.edebi_1.image = "/images/auras/aura_siirsel_edebi1.png";
  if (updatedOutputs.efsanevi_1) updatedOutputs.efsanevi_1.image = "/images/auras/aura_destansi_efsanevi1.jpeg";
  if (updatedOutputs.gelecek_1) updatedOutputs.gelecek_1.image = "/images/auras/aura_vizyoner_gelecek1.jpeg";
  if (updatedOutputs.profesyonel_1) updatedOutputs.profesyonel_1.image = "/images/auras/aura_verimlilik_profesyonel1.jpeg";
  if (updatedOutputs.felsefi_1) updatedOutputs.felsefi_1.image = "/images/auras/aura_felsefi_felsefi1.jpeg";
  if (updatedOutputs.liderlik_1) updatedOutputs.liderlik_1.image = "/images/auras/aura_liderlik_liderlik1.jpeg";
  if (updatedOutputs.topluluk_1) updatedOutputs.topluluk_1.image = "/images/auras/aura_birlestirici_topluluk1.jpeg";
  if (updatedOutputs.modern_1) updatedOutputs.modern_1.image = "/images/auras/aura_cagdas_modern1.jpeg";
  if (updatedOutputs.notr_1) updatedOutputs.notr_1.image = "/images/auras/aura_dengeli_notr1.jpeg";
  if (updatedOutputs.notr_2) updatedOutputs.notr_2.image = "/images/auras/aura_kimlik_arayisinda_notr2.jpeg";
  if (updatedOutputs.notr_3) updatedOutputs.notr_3.image = "/images/auras/aura_netlik_arayan_notr3.jpeg";
  if (updatedOutputs.meta_1) updatedOutputs.meta_1.image = "/images/auras/aura_isiltili_meta1.jpeg";
  if (updatedOutputs.ust_4) updatedOutputs.ust_4.image = "/images/auras/aura_evrensel_ust4.jpeg";
  if (updatedOutputs.belirsiz_1) updatedOutputs.belirsiz_1.image = "/images/auras/aura_belirsiz_belirsiz1.jpeg";
  if (updatedOutputs.default) updatedOutputs.default.image = "/images/auras/aura_tutkulu_karmasik3.png";
  
  // Aura müziklerini ata
  if (updatedOutputs.pozitif_1) updatedOutputs.pozitif_1.music = "/playlist/music1.mp3";
  if (updatedOutputs.pozitif_2) updatedOutputs.pozitif_2.music = "/playlist/music2.mp3";
  if (updatedOutputs.pozitif_3) updatedOutputs.pozitif_3.music = "/playlist/music3.mp3";
  if (updatedOutputs.pozitif_4) updatedOutputs.pozitif_4.music = "/playlist/music4.mp3";
  if (updatedOutputs.pozitif_5) updatedOutputs.pozitif_5.music = "/playlist/music5.mp3";
  if (updatedOutputs.pozitif_6) updatedOutputs.pozitif_6.music = "/playlist/music6.mp3";
  if (updatedOutputs.pozitif_7) updatedOutputs.pozitif_7.music = "/playlist/music7.mp3";
  if (updatedOutputs.pozitif_8) updatedOutputs.pozitif_8.music = "/playlist/music8.mp3";
  if (updatedOutputs.pozitif_9) updatedOutputs.pozitif_9.music = "/playlist/music9.mp3";
  if (updatedOutputs.negatif_1) updatedOutputs.negatif_1.music = "/playlist/music10.mp3";
  if (updatedOutputs.negatif_2) updatedOutputs.negatif_2.music = "/playlist/music11.mp3";
  if (updatedOutputs.negatif_3) updatedOutputs.negatif_3.music = "/playlist/music12.mp3";
  if (updatedOutputs.negatif_4) updatedOutputs.negatif_4.music = "/playlist/music13.mp3";
  if (updatedOutputs.duragan_1) updatedOutputs.duragan_1.music = "/playlist/music14.mp3";
  if (updatedOutputs.duragan_2) updatedOutputs.duragan_2.music = "/playlist/music15.mp3";
  
  // Karmaşık aura müziklerini güncelle
  if (updatedOutputs.karmasik_1) updatedOutputs.karmasik_1.music = "/playlist/music16.mp3";
  if (updatedOutputs.karmasik_2) updatedOutputs.karmasik_2.music = "/playlist/music17.mp3";
  if (updatedOutputs.karmasik_3) updatedOutputs.karmasik_3.music = "/playlist/music18.mp3";
  
  if (updatedOutputs.sosyal_1) updatedOutputs.sosyal_1.music = "/playlist/music19.mp3";
  if (updatedOutputs.sosyal_2) updatedOutputs.sosyal_2.music = "/playlist/music20.mp3";
  if (updatedOutputs.sosyal_3) updatedOutputs.sosyal_3.music = "/playlist/music21.mp3";
  if (updatedOutputs.bireysel_1) updatedOutputs.bireysel_1.music = "/playlist/music22.mp3";
  if (updatedOutputs.bireysel_2) updatedOutputs.bireysel_2.music = "/playlist/music23.mp3";
  if (updatedOutputs.bireysel_3) updatedOutputs.bireysel_3.music = "/playlist/music24.mp3";
  if (updatedOutputs.zor_1) updatedOutputs.zor_1.music = "/playlist/music25.mp3";
  if (updatedOutputs.zor_2) updatedOutputs.zor_2.music = "/playlist/music26.mp3";
  if (updatedOutputs.zor_3) updatedOutputs.zor_3.music = "/playlist/music27.mp3";
  if (updatedOutputs.zor_4) updatedOutputs.zor_4.music = "/playlist/music28.mp3";
  if (updatedOutputs.guclu_1) updatedOutputs.guclu_1.music = "/playlist/music29.mp3";
  if (updatedOutputs.guclu_2) updatedOutputs.guclu_2.music = "/playlist/music30.mp3";
  if (updatedOutputs.guclu_3) updatedOutputs.guclu_3.music = "/playlist/music31.mp3";
  if (updatedOutputs.hassas_1) updatedOutputs.hassas_1.music = "/playlist/music32.mp3";
  if (updatedOutputs.hassas_2) updatedOutputs.hassas_2.music = "/playlist/music33.mp3";
  if (updatedOutputs.degisim_1) updatedOutputs.degisim_1.music = "/playlist/music34.mp3";
  if (updatedOutputs.degisim_2) updatedOutputs.degisim_2.music = "/playlist/music35.mp3";
  if (updatedOutputs.zihinsel_1) updatedOutputs.zihinsel_1.music = "/playlist/music36.mp3";
  if (updatedOutputs.zihinsel_2) updatedOutputs.zihinsel_2.music = "/playlist/music37.mp3";
  if (updatedOutputs.zihinsel_3) updatedOutputs.zihinsel_3.music = "/playlist/music38.mp3";
  if (updatedOutputs.zihinsel_4) updatedOutputs.zihinsel_4.music = "/playlist/music39.mp3";
  if (updatedOutputs.denge_1) updatedOutputs.denge_1.music = "/playlist/music40.mp3";
  if (updatedOutputs.denge_2) updatedOutputs.denge_2.music = "/playlist/music41.mp3";
  if (updatedOutputs.spirituel_1) updatedOutputs.spirituel_1.music = "/playlist/music42.mp3";
  if (updatedOutputs.spirituel_2) updatedOutputs.spirituel_2.music = "/playlist/music43.mp3";
  if (updatedOutputs.enerji_1) updatedOutputs.enerji_1.music = "/playlist/music44.mp3";
  if (updatedOutputs.enerji_2) updatedOutputs.enerji_2.music = "/playlist/music45.mp3";
  if (updatedOutputs.sanatsal_1) updatedOutputs.sanatsal_1.music = "/playlist/music46.mp3";
  if (updatedOutputs.edebi_1) updatedOutputs.edebi_1.music = "/playlist/music47.mp3";
  if (updatedOutputs.efsanevi_1) updatedOutputs.efsanevi_1.music = "/playlist/music48.mp3";
  if (updatedOutputs.gelecek_1) updatedOutputs.gelecek_1.music = "/playlist/music49.mp3";
  if (updatedOutputs.profesyonel_1) updatedOutputs.profesyonel_1.music = "/playlist/music50.mp3";
  if (updatedOutputs.felsefi_1) updatedOutputs.felsefi_1.music = "/playlist/music51.mp3";
  if (updatedOutputs.liderlik_1) updatedOutputs.liderlik_1.music = "/playlist/music52.mp3";
  if (updatedOutputs.topluluk_1) updatedOutputs.topluluk_1.music = "/playlist/music53.mp3";
  if (updatedOutputs.modern_1) updatedOutputs.modern_1.music = "/playlist/music54.mp3";
  if (updatedOutputs.notr_1) updatedOutputs.notr_1.music = "/playlist/music55.mp3";
  if (updatedOutputs.notr_2) updatedOutputs.notr_2.music = "/playlist/music56.mp3";
  if (updatedOutputs.notr_3) updatedOutputs.notr_3.music = "/playlist/music57.mp3";
  if (updatedOutputs.meta_1) updatedOutputs.meta_1.music = "/playlist/music58.mp3";
  if (updatedOutputs.ust_4) updatedOutputs.ust_4.music = "/playlist/music59.mp3";
  if (updatedOutputs.belirsiz_1) updatedOutputs.belirsiz_1.music = "/playlist/music60.mp3";
  if (updatedOutputs.default) updatedOutputs.default.music = "/playlist/music17.mp3";
  
  // Genel karmaşık aura için özel olarak müzik ve görsel ata
  if (updatedOutputs.karmasik_genel) {
    updatedOutputs.karmasik_genel.image = "/images/auras/aura_tutkulu_karmasik3.png";
    updatedOutputs.karmasik_genel.music = "/playlist/music17.mp3";
  }
  
  // Ek aura tipleri için müzik atamaları
  if (updatedOutputs.mizah_1) updatedOutputs.mizah_1.music = "/playlist/music1.mp3"; // Neşeli ile aynı müzik
  if (updatedOutputs.mizah_2) updatedOutputs.mizah_2.music = "/playlist/music2.mp3";
  if (updatedOutputs.bilgelik_1) updatedOutputs.bilgelik_1.music = "/playlist/music36.mp3"; // Zihinsel_1 ile aynı müzik
  if (updatedOutputs.bilgelik_2) updatedOutputs.bilgelik_2.music = "/playlist/music37.mp3"; // Zihinsel_2 ile aynı müzik
  if (updatedOutputs.bilgelik_3) updatedOutputs.bilgelik_3.music = "/playlist/music38.mp3"; // Zihinsel_3 ile aynı müzik
  if (updatedOutputs.cesaret_1) updatedOutputs.cesaret_1.music = "/playlist/music30.mp3"; // Guclu_2 ile aynı müzik
  if (updatedOutputs.cesaret_2) updatedOutputs.cesaret_2.music = "/playlist/music31.mp3"; // Guclu_3 ile aynı müzik
  if (updatedOutputs.durus_1) updatedOutputs.durus_1.music = "/playlist/music29.mp3"; // Guclu_1 ile aynı müzik
  if (updatedOutputs.durus_2) updatedOutputs.durus_2.music = "/playlist/music30.mp3"; // Guclu_2 ile aynı müzik
  if (updatedOutputs.esneklik_1) updatedOutputs.esneklik_1.music = "/playlist/music35.mp3"; // Degisim_2 ile aynı müzik
  if (updatedOutputs.esneklik_2) updatedOutputs.esneklik_2.music = "/playlist/music34.mp3"; // Degisim_1 ile aynı müzik
  if (updatedOutputs.ichuzur_1) updatedOutputs.ichuzur_1.music = "/playlist/music15.mp3"; // Duragan_2 ile aynı müzik
  if (updatedOutputs.ichuzur_2) updatedOutputs.ichuzur_2.music = "/playlist/music14.mp3"; // Duragan_1 ile aynı müzik
  if (updatedOutputs.ihtisam_1) updatedOutputs.ihtisam_1.music = "/playlist/music48.mp3"; // Efsanevi_1 ile aynı müzik
  if (updatedOutputs.ihtisam_2) updatedOutputs.ihtisam_2.music = "/playlist/music47.mp3"; // Edebi_1 ile aynı müzik
  if (updatedOutputs.yaraticilik_1) updatedOutputs.yaraticilik_1.music = "/playlist/music24.mp3"; // Bireysel_3 ile aynı müzik
  if (updatedOutputs.yaraticilik_2) updatedOutputs.yaraticilik_2.music = "/playlist/music46.mp3"; // Sanatsal_1 ile aynı müzik
  
  // Aura Data Extended 2'den gelen tiplere müzik atamaları
  if (updatedOutputs.doga_1) updatedOutputs.doga_1.music = "/playlist/music3.mp3";
  if (updatedOutputs.doga_2) updatedOutputs.doga_2.music = "/playlist/music4.mp3";
  if (updatedOutputs.doga_3) updatedOutputs.doga_3.music = "/playlist/music5.mp3";
  if (updatedOutputs.doga_4) updatedOutputs.doga_4.music = "/playlist/music6.mp3";
  if (updatedOutputs.renk_1) updatedOutputs.renk_1.music = "/playlist/music7.mp3";
  if (updatedOutputs.renk_2) updatedOutputs.renk_2.music = "/playlist/music8.mp3";
  if (updatedOutputs.renk_3) updatedOutputs.renk_3.music = "/playlist/music9.mp3";
  if (updatedOutputs.renk_4) updatedOutputs.renk_4.music = "/playlist/music10.mp3";
  if (updatedOutputs.renk_5) updatedOutputs.renk_5.music = "/playlist/music11.mp3";
  if (updatedOutputs.muzik_1) updatedOutputs.muzik_1.music = "/playlist/music12.mp3";
  if (updatedOutputs.muzik_2) updatedOutputs.muzik_2.music = "/playlist/music13.mp3";
  if (updatedOutputs.muzik_3) updatedOutputs.muzik_3.music = "/playlist/music14.mp3";
  if (updatedOutputs.mevsim_1) updatedOutputs.mevsim_1.music = "/playlist/music15.mp3";
  if (updatedOutputs.mevsim_2) updatedOutputs.mevsim_2.music = "/playlist/music16.mp3";
  if (updatedOutputs.mevsim_3) updatedOutputs.mevsim_3.music = "/playlist/music17.mp3";
  if (updatedOutputs.mevsim_4) updatedOutputs.mevsim_4.music = "/playlist/music18.mp3";
  if (updatedOutputs.teknoloji_1) updatedOutputs.teknoloji_1.music = "/playlist/music19.mp3";
  if (updatedOutputs.teknoloji_2) updatedOutputs.teknoloji_2.music = "/playlist/music20.mp3";
  
  return updatedOutputs;
};

// Tüm çıktıları birleştir
export const getAllOutputs = () => {
  const outputs = {
    ...auraData.outputs,
    ...auraData2.outputs,
    ...auraData3.outputs,
    ...auraData4.outputs,
    ...auraOutputsExtended,
    ...auraDataExtended2.outputs,
    ...auraDataExtended3.outputs,
    ...auraDataExtended4.outputs,
  };
  
  return addImagePathsToOutputs(outputs);
};

// Olumsuz ek analizi için yardımcı fonksiyon
const analyzeNegativeSuffix = (word) => {
  for (const pattern of negativeSuffixPatterns) {
    if (word.endsWith(pattern.suffix)) {
      // Olumsuz ekli kelimeyi kontrol et
      const baseWord = word.slice(0, -pattern.suffix.length);
      
      // Pozitif bağlamda kullanılan kelimeleri kontrol et
      if (pattern.contexts.positive.includes(word)) {
        return {
          isNegative: true,
          group: "zor_1" // veya ilgili negatif grup
        };
      }
      
      // Negatif bağlamda kullanılan kelimeleri kontrol et
      if (pattern.contexts.negative.includes(word)) {
        return {
          isNegative: true,
          group: "negatif_1" // veya ilgili negatif grup
        };
      }
    }
  }
  
  // Özel kelime gruplarını kontrol et
  for (const keyword of negativeSuffixKeywords) {
    if (word === keyword.keyword) {
      return {
        isNegative: true,
        group: keyword.group
      };
    }
  }
  
  return null;
};

// Metin analizi fonksiyonunu güncelle
export const analyzeAuraFromText = (text) => {
  // İlk olarak doğrudan kalıpları kontrol et
  const directPatternResult = checkDirectNegationPatterns(text);
  if (directPatternResult.found) {
    console.log("Direkt kalıp bulundu:", directPatternResult);
    const outputs = getAllOutputs();
    return {
      output: outputs[directPatternResult.group],
      group: directPatternResult.group,
      analyticData: {
        detectedKeywords: [directPatternResult.keyword],
        contextScore: 0.8,
        lastSentenceScore: 0.7,
        sentimentRatio: directPatternResult.group.includes("negatif")
          ? "Negatif"
          : "Pozitif",
        proximityPatterns: [],
      },
    };
  }

  // Derinlemesine bağlam analizi yap
  const contextAnalysis = deepContextAnalysis(text);
  console.log("Bağlam analizi:", contextAnalysis);

  // Ciddi yaşam olayları kontrolü
  if (
    contextAnalysis.seriousLifeEvents &&
    contextAnalysis.seriousLifeEvents.length > 0
  ) {
    console.log(
      "Ciddi yaşam olayları tespit edildi:",
      contextAnalysis.seriousLifeEvents
    );
    const outputs = getAllOutputs();
    return {
      output: outputs[contextAnalysis.dominantGroup || "negatif_1"],
      group: contextAnalysis.dominantGroup || "negatif_1",
      analyticData: {
        detectedKeywords: contextAnalysis.seriousLifeEvents,
        contextScore: contextAnalysis.adjustedScore,
        lastSentenceScore: contextAnalysis.lastSentenceScore,
        sentimentRatio: "Negatif (Ciddi yaşam olayı)",
        proximityPatterns: contextAnalysis.proximityPatterns.map(
          (p) => p.pattern
        ),
      },
    };
  }

  // Belirsiz duygular için özel kontrol
  if (
    (text.toLowerCase().includes("emin değilim") ||
      text.toLowerCase().includes("bilmiyorum")) &&
    (text.toLowerCase().includes("mutlu") ||
      text.toLowerCase().includes("nasıl hissettiğimi") ||
      text.toLowerCase().includes("ne hissettiğimi"))
  ) {
    console.log("Belirsiz duygular tespit edildi");
    const outputs = getAllOutputs();
    return {
      output: outputs["belirsiz_1"],
      group: "belirsiz_1",
      analyticData: {
        detectedKeywords: ["belirsiz duygular", "emin değilim", "bilmiyorum"],
        contextScore: contextAnalysis.adjustedScore,
        lastSentenceScore: contextAnalysis.lastSentenceScore,
        sentimentRatio: "Belirsiz",
        proximityPatterns: contextAnalysis.proximityPatterns.map(
          (p) => p.pattern
        ),
      },
    };
  }

  // Özel durum: Negatif duyguların olmadığını belirten ifadeler varsa pozitife dönüştür
  if (contextAnalysis.specialNegativeEmotionNegatedPatterns.length > 0) {
    console.log("Özel durum: Negatif duygu yokluğu ifadesi tespit edildi");
    const outputs = getAllOutputs();

    // İfade içeriğine göre uygun pozitif grubu seç
    const pattern = contextAnalysis.specialNegativeEmotionNegatedPatterns[0];
    let positiveGroup = "pozitif_1"; // Varsayılan

    if (
      pattern.includes("korku") ||
      pattern.includes("endişe") ||
      pattern.includes("kaygı")
    ) {
      positiveGroup = "pozitif_7"; // Korku yoksa -> Güçlü
    } else if (
      pattern.includes("üzüntü") ||
      pattern.includes("mutsuz") ||
      pattern.includes("hüzün")
    ) {
      positiveGroup = "pozitif_1"; // Üzüntü yoksa -> Neşeli
    } else if (pattern.includes("stres") || pattern.includes("yorgun")) {
      positiveGroup = "pozitif_2"; // Stres yoksa -> Huzurlu
    }

    return {
      output: outputs[positiveGroup],
      group: positiveGroup,
      analyticData: {
        detectedKeywords: contextAnalysis.specialNegativeEmotionNegatedPatterns,
        contextScore: contextAnalysis.adjustedScore,
        lastSentenceScore: contextAnalysis.lastSentenceScore,
        sentimentRatio: "Pozitif (Negatif duygu yokluğu)",
        proximityPatterns: contextAnalysis.proximityPatterns.map(
          (p) => p.pattern
        ),
      },
    };
  }

  // Yakınlık kalıpları kontrolü
  if (
    contextAnalysis.hasStrongNegationPatterns &&
    contextAnalysis.proximityPatterns.length > 0
  ) {
    console.log(
      "Güçlü yakınlık kalıpları tespit edildi:",
      contextAnalysis.proximityPatterns
    );
    const outputs = getAllOutputs();

    // Negatif duygulu bir grup seç
    let negativeGroup = "negatif_1"; // Varsayılan

    // Kalıplara göre uygun negatif grup seçimi
    const strongPattern = contextAnalysis.proximityPatterns[0];
    if (
      strongPattern.negativeWord.includes("korku") ||
      strongPattern.negativeWord.includes("endişe")
    ) {
      negativeGroup = "negatif_3"; // Güvensiz
    } else if (
      strongPattern.negativeWord.includes("öfke") ||
      strongPattern.negativeWord.includes("kızgın")
    ) {
      negativeGroup = "negatif_2"; // Öfkeli
    }

    return {
      output: outputs[negativeGroup],
      group: negativeGroup,
      analyticData: {
        detectedKeywords: contextAnalysis.proximityPatterns.map(
          (p) => `${p.positiveWord}-${p.negativeWord}`
        ),
        contextScore: contextAnalysis.adjustedScore,
        lastSentenceScore: contextAnalysis.lastSentenceScore,
        sentimentRatio: "Negatif (Güçlü yakınlık kalıbı)",
        proximityPatterns: contextAnalysis.proximityPatterns.map(
          (p) => p.pattern
        ),
      },
    };
  }

  // Özel durum: Negatif son cümle veya genel negatif ton
  if (
    contextAnalysis.lastSentenceScore < -1 ||
    contextAnalysis.adjustedScore < -2
  ) {
    console.log("Genel negatif ton tespit edildi");
    const outputs = getAllOutputs();
    return {
      output: outputs[contextAnalysis.dominantGroup || "negatif_1"],
      group: contextAnalysis.dominantGroup || "negatif_1",
      analyticData: {
        detectedKeywords: ["negatif ton"],
        contextScore: contextAnalysis.adjustedScore,
        lastSentenceScore: contextAnalysis.lastSentenceScore,
        sentimentRatio: "Negatif",
        proximityPatterns: contextAnalysis.proximityPatterns.map(
          (p) => p.pattern
        ),
      },
    };
  }

  // Özel durum: "mutluyum bu" gibi pozitif vurgular
  const positiveStatements = checkForPositiveStatements(text);
  if (positiveStatements.length > 0) {
    console.log("Özel durum: Pozitif durumun vurgulanması tespit edildi");
    const outputs = getAllOutputs();

    // İfade içeriğine göre uygun pozitif grubu seç
    const statement = positiveStatements[0].toLowerCase();
    let positiveGroup = "pozitif_1"; // Varsayılan

    if (statement.includes("mutlu")) {
      positiveGroup = "pozitif_1"; // Neşeli
    } else if (statement.includes("huzur")) {
      positiveGroup = "pozitif_2"; // Huzurlu
    } else if (statement.includes("umut")) {
      positiveGroup = "pozitif_3"; // İyimser
    } else if (statement.includes("heyecan")) {
      positiveGroup = "pozitif_4"; // Heyecan Dolu
    }

    return {
      output: outputs[positiveGroup],
      group: positiveGroup,
      analyticData: {
        detectedKeywords: positiveStatements,
        contextScore: contextAnalysis.adjustedScore,
        lastSentenceScore: contextAnalysis.lastSentenceScore,
        sentimentRatio: "Pozitif (Direkt ifade)",
        proximityPatterns: [],
      },
    };
  }

  // Özel anahtar kelime kontrolü - "ilgi duymak" ifadesi için
  if (text.toLowerCase().includes('ilgi duymak') || 
      text.toLowerCase().includes('ilgi duyma') || 
      text.toLowerCase().includes('ilgi duyduğum')) {
    console.log("İlgi duymak tespit edildi, zihinsel_1 olarak işleniyor");
    return [{
      keyword: "meraklı",
      group: "zihinsel_1"
    }];
  }

  // Kelime analizi sırasında olumsuz ek kontrolü ekle
  const words = text.toLowerCase().split(/\s+/);
  const detectedKeywords = [];
  const groupWeights = {};

  for (const word of words) {
    const suffixAnalysis = analyzeNegativeSuffix(word);
    if (suffixAnalysis) {
      // Olumsuz ek analizi sonucunu kullan
      detectedKeywords.push(word);
      // Grup ağırlığını güncelle
      groupWeights[suffixAnalysis.group] = (groupWeights[suffixAnalysis.group] || 0) + 1;
    }
  }

  // Eşleşen kelimeleri bul
  const matchingKeywords = findMatchingKeywords(text);

  // İşlenen kelimeleri yap
  const processedKeywords = matchingKeywords.map((match) => match.keyword);

  // Duygu oranı hesapla
  const sentimentRatio =
    contextAnalysis.positiveSentences > 0 ||
    contextAnalysis.negativeSentences > 0
      ? `${contextAnalysis.positiveSentences} Pozitif / ${contextAnalysis.negativeSentences} Negatif`
      : "Nötr";

  if (matchingKeywords.length > 0) {
    console.log("Bulunan eşleşen kelimeler:", matchingKeywords);

    // Negatif kelimelere öncelik ver
    const negativeKeywords = matchingKeywords.filter(
      (k) =>
        k.group.includes("negatif") ||
        k.group.includes("zor") ||
        k.group.includes("belirsiz")
    );

    let selectedKeyword;

    if (negativeKeywords.length > 0) {
      // Negatif kelimeler varsa, onları kullan
      const randomNegativeIndex = Math.floor(
        Math.random() * negativeKeywords.length
      );
      selectedKeyword = negativeKeywords[randomNegativeIndex];
    } else {
      // Negatif kelime yoksa rastgele bir kelime seç
      const randomIndex = Math.floor(Math.random() * matchingKeywords.length);
      selectedKeyword = matchingKeywords[randomIndex];
    }

    // Seçilen kelimenin grubuna ait çıktıyı al
    const outputs = getAllOutputs();
    const output = outputs[selectedKeyword.group];

    return {
      output,
      group: selectedKeyword.group,
      analyticData: {
        detectedKeywords: processedKeywords,
        contextScore: contextAnalysis.adjustedScore,
        lastSentenceScore: contextAnalysis.lastSentenceScore,
        sentimentRatio,
        proximityPatterns: contextAnalysis.proximityPatterns.map(
          (p) => p.pattern
        ),
      },
    };
  } else {
    // Hiç eşleşme bulunamadıysa
    // Eğer belirgin bir negatif ton varsa belirsiz aura
    if (contextAnalysis.adjustedScore < 0) {
      return {
        output: getAllOutputs()["belirsiz_1"],
        group: "belirsiz_1",
        analyticData: {
          detectedKeywords: [],
          contextScore: contextAnalysis.adjustedScore,
          lastSentenceScore: contextAnalysis.lastSentenceScore,
          sentimentRatio,
          proximityPatterns: contextAnalysis.proximityPatterns.map(
            (p) => p.pattern
          ),
        },
      };
    }

    return {
      output: {
        message: "Karmaşık",
        color: "from-purple-600 to-indigo-800",
        image: "/images/auras/aura_tutkulu_karmasik3.png",
        music: "/playlist/music17.mp3",
        description:
          "İçinde birçok farklı duyguyu aynı anda yaşadığın bir aura taşıyorsun. Bu, hayatın farklı yönlerini derinden algılama ve zengin bir iç dünyaya sahip olma becerini yansıtıyor. Zaman zaman çelişkili gelen düşünceler, aslında derinlikli bakış açını daha da keskinleştiriyor.\n\nKarmaşık duygular, sana hem kendini hem de başkalarını daha iyi anlama potansiyeli sunar. Katmanlı hislerin sayesinde, empati kurma ve duygusal bağlar geliştirme konusunda doğal bir yatkınlığın vardır. Bu yapın, seni ilham verici bir yol göstericiye dönüştürebilir.\n\nÖte yandan, bu duygusal çeşitlilik bazen seni yorabilir. Zihnin ve kalbin arasında gidip gelen düşünceler, kararsızlık veya içsel çatışmalar doğurabilir. Ancak unutma ki, bu çelişkiler aynı zamanda zenginliğinin de bir parçası. Kendi içsel dengen için zaman zaman durup duygularını gözlemlemek, sana büyük fayda sağlayacaktır.\n\nSon olarak, bu karmaşık yapı senin çok yönlülüğünü destekler. Hem entelektüel hem de duygusal açıdan zengin bir ifade alanı bulabilirsin. Yazı, sanat, müzik veya sosyal projeler gibi yaratıcı uğraşlar, içindeki değişken duyguları yapıcı bir enerjiye dönüştürerek kendini ve çevreni daha derinden dönüştürme şansı sunar.",
      },
      group: "karmasik_genel",
      analyticData: {
        detectedKeywords: [],
        contextScore: contextAnalysis.adjustedScore,
        lastSentenceScore: contextAnalysis.lastSentenceScore,
        sentimentRatio,
        proximityPatterns: contextAnalysis.proximityPatterns.map(
          (p) => p.pattern
        ),
      },
    };
  }
};

// Pozitif ifadeleri kontrol et
const checkForPositiveStatements = (text) => {
  const lowerText = text.toLowerCase();
  const positivePatterns = [
    "mutluyum",
    "huzurluyum",
    "iyiyim",
    "sevinçliyim",
    "neşeliyim",
    "heyecanlıyım",
    "umutluyum",
    "memnunum",
    "kendimi iyi hissediyorum",
    "kendimi mutlu hissediyorum",
    "bu çıktı",
    "çıktının",
    "vermesi",
    "lazım",
    "mutlu",
  ];

  // Eşleşen pozitif ifadeleri bul
  const foundPatterns = [];
  for (const pattern of positivePatterns) {
    if (lowerText.includes(pattern)) {
      foundPatterns.push(pattern);
    }
  }

  // Özel durumlar: "çıktı" kelimesi içeren cümlelerde "mutlu" kelimesi varsa
  if (lowerText.includes("çıktı") && lowerText.includes("mutlu")) {
    foundPatterns.push("çıktı mutlu");
  }

  // "vermesi lazım" kalıbı içeren cümleler
  if (lowerText.includes("vermesi lazım")) {
    foundPatterns.push("vermesi lazım");
  }

  return foundPatterns;
};
