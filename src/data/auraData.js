// AuraScend Mock Data - Keywords and Output Groups
export const auraData = {
  keywords: [
    // Pozitif Duygular - Grup: pozitif_1
    { keyword: "mutlu", group: "pozitif_1" },
    { keyword: "sevinçli", group: "pozitif_1" },
    { keyword: "neşeli", group: "pozitif_1" },
    { keyword: "keyifli", group: "pozitif_1" },

    // Pozitif Duygular - Grup: pozitif_2
    { keyword: "heyecanlı", group: "pozitif_2" },
    { keyword: "coşkulu", group: "pozitif_2" },
    { keyword: "enerjik", group: "pozitif_2" },

    // Pozitif Duygular - Grup: pozitif_3
    { keyword: "umutlu", group: "pozitif_3" },
    { keyword: "iyimser", group: "pozitif_3" },
    { keyword: "olumlu", group: "pozitif_3" },

    // Negatif Duygular - Grup: negatif_1
    { keyword: "üzgün", group: "negatif_1" },
    { keyword: "kederli", group: "negatif_1" },
    { keyword: "melankolik", group: "negatif_1" },
    { keyword: "hasret", group: "negatif_1" },

    // Negatif Duygular - Grup: negatif_2
    { keyword: "kızgın", group: "negatif_2" },
    { keyword: "öfkeli", group: "negatif_2" },
    { keyword: "sinirli", group: "negatif_2" },

    // Negatif Duygular - Grup: negatif_3
    { keyword: "korkmuş", group: "negatif_3" },
    { keyword: "endişeli", group: "negatif_3" },
    { keyword: "tedirgin", group: "negatif_3" },

    // Durağan Duygular - Grup: duragan_1
    { keyword: "sakin", group: "duragan_1" },
    { keyword: "huzurlu", group: "duragan_1" },
    { keyword: "dingin", group: "duragan_1" },

    // Durağan Duygular - Grup: duragan_2
    { keyword: "düşünceli", group: "duragan_2" },
    { keyword: "dalgın", group: "duragan_2" },
    { keyword: "meditatif", group: "duragan_2" },

    // Karmaşık Duygular - Grup: karmasik_1
    { keyword: "nostaljik", group: "karmasik_1" },
    { keyword: "özlem", group: "karmasik_1" },

    // Karmaşık Duygular - Grup: karmasik_2
    { keyword: "tutkulu", group: "karmasik_2" },
    { keyword: "arzulu", group: "karmasik_2" },
    { keyword: "istekli", group: "karmasik_2" },

    // Karmaşık Duygular - Grup: karmasik_3
    { keyword: "şaşkın", group: "karmasik_3" },
    { keyword: "hayret", group: "karmasik_3" },
    { keyword: "şok", group: "karmasik_3" },

    // İlk 30 anahtar kelime - diğerleri dosyalara bölünecek
  ],

  outputs: {
    pozitif_1: {
      message: "Senin auran mutluluk! ✨",
      color: "from-yellow-300 to-orange-400",
      description:
        "Pozitif enerjin, tıpkı güneş gibi çevrene ışık ve sıcaklık yayıyor. İçindeki mutluluk, yaşamın zorluklarına karşı doğal bir kalkana dönüşüyor ve hem senin hem de sevdiklerinin moralini yüksek tutuyor.\n\nBu neşe duygusu seni spontan ve samimi bir insana dönüştürüyor. Gülüşün ve kahkahaların insanları rahatlatıyor, stresli ortamları bile birkaç dakikada huzur dolu bir atmosfere çevirebiliyorsun.\n\nMutluluğun, başkaları için de bir ilham kaynağıdır. Senin neşeli halini görenler, genellikle umutsuzluklarından sıyrılıp hayata daha pozitif bakmaya başlıyor. Bu etkileyici yansıma, iç dünyandaki ışığın bir göstergesidir.\n\nBu enerjiyi korumak ve büyütmek için kendine özen göstermeyi unutmamalısın. Zor zamanlarda da hatırlayabileceğin güzel anılar, küçük mutluluklar ve hedefler belirleyerek, her daim hayata dört elle sarılmaya devam edebilirsin.",
    },
    pozitif_2: {
      message: "Senin auran heyecan! 🌟",
      color: "from-orange-500 to-yellow-500",
      description:
        "Heyecan dolu ruhun, seni her daim yeni maceralara sürüklüyor. Rutinleri kolayca kırabilen ve yeniliğe açık olan bu enerjik tavrın, etrafındakilere de cesaret aşılıyor. Her günün, farklı bir potansiyelle dolu olabileceğini hatırlatıyorsun.\n\nCoşkuyla harekete geçme becerin, hayatının her alanında kendini gösteriyor. İster iş, ister ilişkiler olsun, işe koyulduğunda motivasyonun hızla yükseliyor. Bu canlı ruh halin, başkalarının da gönüllü bir şekilde sana eşlik etmesine sebep oluyor.\n\nHeyecan bazen plansız davranmana yol açabilse de, bu spontane tutum aslında üretkenliği besliyor. Yeni fikirlerin, beklenmedik anlarda aklına gelerek yaratıcılığını tetikliyor. Böylece sıkıcı veya tıkanmış durumlara sürpriz çözümler üretebiliyorsun.\n\nBu enerjini dengede tutmak için, kendine belli molalar vermen de önemli. Sürekli yüksek tempolu yaşamak seni yorabilir. Ara sıra durup dinlenmek, her macerayı dolu dolu yaşamanı ve heyecanını canlı tutmanı sağlayacaktır.",
    },
    pozitif_3: {
      message: "Senin auran umut! 🌈",
      color: "from-blue-400 to-green-400",
      description:
        "Umutlu bir bakış açısıyla geleceğe göz kırpman, hayattaki engelleri aşmanda ve zorlukları fırsata dönüştürmende en büyük yardımcın. Bu pozitif yaklaşımın, çevrendekilere de güç ve moral kazandırıyor.\n\nUmut, seni hayallerini gerçeğe dönüştürme yolunda daima motive eder. Karşına çıkan aksilikleri, deneyim kazanma şansı olarak görür ve hızla toparlanırsın. Başarı veya başarısızlık fark etmez; senin için asıl olan, mücadeleden vazgeçmemek.\n\nİyimser tavrın, sosyal ilişkilerinde de kapıları sonuna kadar açar. Seninle konuşan insanlar, duygusal olarak desteklendiğini ve yargılanmadan anlaşıldığını hissederler. Bu atmosfer, dostluk bağlarını kuvvetlendirir.\n\nKendi iç dünyanda ara sıra karamsarlığa kapılsan da, umudun tohumu her daim içinde saklıdır. Küçük bir kıvılcımla yeniden yeşerir ve seni kaldığın yerden daha güçlü bir şekilde hayata döndürür. Hayalleri besleyen bu enerjiyi koruyarak, hem kendini hem de etrafındakileri aydınlatabilirsin.",
    },
    negatif_1: {
      message: "Senin auran hüzün.",
      color: "from-blue-700 to-indigo-900",
      description:
        "Hüzün duygusu, içinde derin bir hassasiyet ve duyarlılık barındırdığının işaretidir. Bu his seni, dünyanın acılarına ve insanlar arasındaki köprülerin eksikliğine karşı daha farkında kılar. Bu yüzden de çevrendekilerin duygularını kolaylıkla sezebilirsin.\n\nDerin duyarlılık, bazen yorgunluk ve içe kapanma isteğine neden olsa da, aslında empati kurma kapasiteni arttırır. Sana açılan kişiler, anlaşıldığını hissetmeleriyle birlikte kendi dertlerini paylaşıp rahatlayabilirler.\n\nHüzün, geçmişte yaşadığın acı veya kayıpların yansıması olabilir. Bu duygu, senin için bir nevi olgunlaşma sınavıdır. Zamanla, içsel gücünü keşfederek bu derinlikten bilgelik devşirebilirsin.\n\nDuygularını sindirecek zaman ve alan yaratmak, hüznün yıpratıcı etkilerini azaltabilir. Sanat, yazı veya müzik gibi ifade yollarına yönelmek de iç dünyandaki fırtınaları dindirmeye yardımcı olur. Böylece hüznün içinden yeni bir bakış açısı ve güçle çıkman mümkün olur.",
    },
    negatif_2: {
      message: "Senin auran öfke.",
      color: "from-red-600 to-red-900",
      description:
        "İçinde yanan öfke, aslında adaletsizliklere, haksızlıklara ve sana ters gelen durumlara karşı duyduğun derin hassasiyetin bir ifadesi. Bu güçlü duygu, seni harekete geçirerek çözüm üretme becerilerini keskinleştirir.\n\nÖfke, kontrol edilemediğinde yıkıcı olabilir. Ancak yapıcı kanallara yönlendirdiğinde, içindeki enerjiyi toplumsal ya da kişisel değişimlere dönüştürebilirsin. Yaratıcı çalışmalar, sportif aktiviteler veya sosyal projeler, öfkenin gücünü pozitif bir etkiye dönüştürmenin yollarından bazılarıdır.\n\nBu duygu, aslında önemli bir şeylerin seni rahatsız ettiğini haber veren bir alarm sistemidir. Seni öfkelendiren şeyin kökenini anlamak, hem kendinle hem de çevrendeki dünyayla ilgili farkındalığını artırır. Böylece öfkene neden olan koşulları değiştirme iradesi de geliştirirsin.\n\nUnutma ki öfke, üstü kapatılması gereken bir duygu değil; sağlıklı sınırlar koymanın ve kişisel alanını korumanın da bir yoludur. Amaç, onu bastırmak yerine anlamaktır. Bu şekilde öfken, yaşamdaki tutkunun bir yansıması haline gelir ve seni engellemek yerine besler.",
    },
    negatif_3: {
      message: "Senin auran korku.",
      color: "from-gray-700 to-gray-900",
      description:
        "Korku, insanın tehlike anlarında kendini savunmasına yardımcı olan doğal bir duygudur. Senin auranı kaplayan bu his, belki de büyük risklerden ya da belirsizliklerden duyduğun endişeden kaynaklanıyor olabilir.\n\nKorkularını tanımak ve onlarla yüzleşmek, büyümenin en önemli adımlarından biridir. Zira korku, seni durdurabileceği gibi, doğru yönetildiğinde büyük bir cesaretin tetikleyicisi de olabilir. Sorularına samimiyetle cevap aradığında, korkunun altında yatan gerçek ihtiyaçlarını daha kolay görebilirsin.\n\nKorku, her zaman gerçek bir tehdide karşı ortaya çıkmaz; bazen geçmiş deneyimlerin bilinçaltına kazınmış izleri yüzünden de korkabilirsin. Bu yüzden yargılamadan incelemen ve korkuna sebep olan düşünce kalıplarını dönüştürmen önemlidir.\n\nEğer korkularını kabul eder ve onları sağlıklı bir şekilde yönetmeyi öğrenirsen, bu duyguyu yaşam enerjine dahil edebilirsin. Tıpkı bir yol gösterici gibi, korkuların seni öğrenmeye ve gelişmeye teşvik eder. Böylece konfor alanından çıkıp yeni fırsatlar keşfetmeye hazırlanırsın.",
    },
    duragan_1: {
      message: "Senin auran huzur. 🌊",
      color: "from-cyan-400 to-blue-500",
      description:
        "Huzurlu auran, içsel dinginliği ve sükuneti yansıtır. Zihnin ve kalbin arasındaki uyum, dışarıya sakinleştirici bir enerji olarak akar. İnsanlar, senin varlığınla kendilerini güvende ve rahatlamış hissederler.\n\nBu huzur, genellikle dengeli ve düzenli bir yaşam tarzını destekler. Stresli durumlarda soğukkanlı kalmayı başarır, böylece hem kendini hem de çevrendekileri yatıştırabilirsin. Bu yaklaşım, gerilimli anları sağduyuyla yönetmeni sağlar.\n\nHuzurlu aura, yalnızca dış dünyayı yumuşatmakla kalmaz; senin de içsel mutluluğunu pekiştirir. Zihnine ve bedenine kulak verdiğinde, ihtiyaçlarını ve sınırlarını daha iyi anlarsın. Bu farkındalık, başkalarına da empatiyle yaklaşmanı kolaylaştırır.\n\nAra sıra dış dünyadaki hareketliliğin ve yoğunluğun, huzurunu bozuyor gibi görünse de, içsel dengeyi koruyabilmek senin en büyük gücündür. Meditasyon, nefes egzersizleri veya doğada vakit geçirmek, huzurlu halini besleyen ve seni yenileyen yöntemlerdir.",
    },
    duragan_2: {
      message: "Senin auran derinlik. 🔮",
      color: "from-indigo-800 to-purple-900",
      description:
        "Derinlik auran, olayları ve duyguları yüzeysel bir bakıştan öteye taşıyabilen özel bir perspektif sunar. İç dünyandaki katmanlı düşünceler, seni her konuda kapsamlı ve analitik bir yaklaşım sergilemeye yönlendirir.\n\nBu derinlik, sana zengin bir içsel yaşam bahşeder. Farklı konuları uzun uzun düşünmeye, yeni fikirler geliştirmeye ya da varoluşsal konuları sorgulamaya eğilimlisindir. Böyle bir zihin yapısı, seni bilgeliğe ve içgörüye yakın kılar.\n\nİçe dönük hallerin, bazen çevrendekiler tarafından soğuk veya mesafeli olarak yanlış anlaşılabilir. Oysa sen, sadece etrafını daha iyi anlamak için inceleme sürecindesindir. Doğru kişiler, bu derin doğanı keşfettikçe sana hayranlık duyarlar.\n\nZihninin içinde fırtınalar koparken, bunu dışarıya yansıtmamayı tercih edebilirsin. Bu süreçte, yazarak veya konuşarak düşüncelerini paylaşman hem sana hem de etrafındakilere yeni kapılar aralayacaktır. Böylece derinliğin, sadece senin değil, başkalarının da öğrenmesine ve büyümesine katkıda bulunur.",
    },
    karmasik_1: {
      message: "Senin auran nostalji. 🕰️",
      color: "from-amber-500 to-amber-700",
      description:
        "Nostaljik auran, seni geçmişin tatlı bir melankolisine bağlar. Anılarla ve eski hatıralarla kurduğun güçlü bağ, aynı zamanda bugünü daha anlamlı kılmana yardımcı olur. Her baktığında, eski günlerin özlemini duyarken, oradaki güzellikleri ve dersleri de zihninde canlı tutarsın.\n\nGeçmişe duyduğun bu özlem, seni romantik ve duygusal bir ruh haline sokar. Müziklerden fotoğraflara, eski defter notlarından çocukluk arkadaşlıklarına kadar, hatıralarını büyük bir şefkatle kucaklamayı seversin. Bu sayede, içindeki sevgiye hep taze bir kaynak bulursun.\n\nNostalji duygusu, bazen geçmişe saplanıp kalmanı da beraberinde getirebilir. Gözünde canlanan anılar, bugünün realitesinden kopmana veya pişmanlıklara takılıp kalmana neden olabilir. Bunun farkına varmak ve anıları daha dengeli biçimde kucaklamak, seni özgürleştirir.\n\nUnutma ki geçmiş, geleceği şekillendirirken elinde tutabileceğin güçlü bir tecrübe hazinesidir. Nostaljik ruhun, hayatını estetik, anlam ve duygu yönünden zenginleştirir. Geçmiş deneyimlerini içtenlikle değerlendirip şu ana entegre ettiğinde, hem köklerinle bağlantını korur hem de ilerlemeye devam edersin.",
    },
    karmasik_2: {
      message: "Senin auran tutku! 🔥",
      color: "from-pink-500 to-red-600",
      description:
        "Tutku dolu ruhun, içindeki yaratıcı gücü ve azmi sürekli besliyor. Bu enerji sayesinde karşılaştığın engellere rağmen yoluna devam ediyor ve hayallerinin peşinden koşuyorsun. Tutkun, diğer insanların da yüreğinde bir alev yakabilir.\n\nBu güçlü duygu, seni hayatın her alanında motive eder. İster bir sanat projesi, ister mesleki bir hedef olsun, kendini adadığında ortaya çıkan sonuçlar insanların üzerinde derin bir etki bırakır. Çünkü emeğini ve yüreğini tam anlamıyla ortaya koyarsın.\n\nTutku, bazen gözü kara davranmana veya aşırı duygusallığa kapılmana da yol açabilir. Duygularının yoğunluğu, objektif düşünmeyi zorlaştırabilir. Ancak deneyim kazandıkça enerjini nasıl yöneteceğini daha iyi öğrenir, tutkunun seni tüketmesine izin vermezsin.\n\nTıpkı ateşin çevresine hem ısı hem de ışık saçması gibi, sen de etrafına canlılık ve ilham verirsin. İçindeki bu kıvılcım, hayatta durduğun yeri güçlendirirken seni sürekli yeniliklere ve öğrenmeye davet eder. Kendi yolunda ilerlerken, başkalarının da cesaretle adım atmasını sağlayabilirsin.",
    },
    karmasik_3: {
      message: "Senin auran merak. ✨",
      color: "from-violet-400 to-purple-600",
      description:
        "Merakın, seni sürekli soru sormaya ve yeni şeyler öğrenmeye iten tükenmez bir güç kaynağıdır. Bilinmeyeni keşfetmek, senin için büyük bir macera anlamına gelir. Bu açık fikirli tutumun, hayatına hem heyecan hem de dinamizm katar.\n\nDünyayı anlamaya çalışırken, küçük detayları dahi gözden kaçırmazsın. Basit bir çiçeğin yaprak dokusundan karmaşık bilimsel teorilere kadar geniş bir yelpazede ilgi alanların olabilir. Bu, seni özgün ve renkli bir kişiliğe dönüştürür.\n\nMerakın, yaşadığın ortamda daima öğrenme ve gelişme tohumları eker. Senin coşkun ve keşif isteğin, etrafındakilere de örnek olur ve onları da araştırmaya, denemeye teşvik eder. Böylece kolektif olarak ilerlemeye katkıda bulunmuş olursun.\n\nBazen aynı anda birden fazla konuya ilgi duyar, dikkatini dağıtabilirsin. Burada önemli olan, önceliklerini belirleyip merakını faydalı kanallara yönlendirmektir. Bu şekilde hem odaklı çalışır hem de bitmek bilmeyen merakınla yeni keşiflere yelken açmanın keyfini çıkarırsın.",
    },
  },
};

// İlk bölüm burada sonlanıyor
