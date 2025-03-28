import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      );
    }
    
    // Google oturumu için user.id yerine email ile kullanıcıyı bul
    const userEmail = session.user.email;
    
    if (!userEmail) {
      return NextResponse.json(
        { error: "Kullanıcı bilgileri eksik" },
        { status: 400 }
      );
    }
    
    // Kullanıcıyı email ile bul veya oluştur
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    
    // Kullanıcı bulunamazsa otomatik olarak oluştur
    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            email: userEmail,
            name: session.user.name || userEmail.split('@')[0],
            image: session.user.image || null
          },
        });
      } catch (createError) {
        return NextResponse.json(
          { error: "Kullanıcı oluşturulamadı", details: createError.message },
          { status: 500 }
        );
      }
    }
    
    let requestBody;
    try {
      // Request body'yi parse et
      requestBody = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Geçersiz istek formatı: JSON parse hatası", details: parseError.message },
        { status: 400 }
      );
    }
    
    // Gerekli alanları kontrol et
    if (!requestBody) {
      return NextResponse.json(
        { error: "İstek gövdesi boş" },
        { status: 400 }
      );
    }
    
    // Veri yapısını güvenli şekilde çıkar
    const {
      text = "",
      message = "Belirlenemeyen Aura",
      color = "from-purple-500 to-blue-500",
      description = "Aura analizi tamamlandı",
      image = null,
      detectedKeywords = [],
      sentimentRatio = 0
    } = requestBody;
    
    // Veri doğrulama
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: "Geçersiz text alanı" },
        { status: 400 }
      );
    }
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Geçersiz message alanı" },
        { status: 400 }
      );
    }
    
    if (!color || typeof color !== 'string') {
      return NextResponse.json(
        { error: "Geçersiz color alanı" },
        { status: 400 }
      );
    }
    
    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: "Geçersiz description alanı" },
        { status: 400 }
      );
    }
    
    // Veri hazırlama
    const cleanDetectedKeywords = Array.isArray(detectedKeywords) 
      ? detectedKeywords.slice(0, 20) 
      : [];
    
    const cleanSentimentRatio = typeof sentimentRatio === 'number' 
      ? sentimentRatio 
      : parseFloat(sentimentRatio || 0) || 0;
    
    // Veri temizliği
    const cleanText = text.substring(0, 5000); // Uzun metinleri kırp
    const cleanMessage = message.substring(0, 100); 
    const cleanColor = color.substring(0, 100);
    const cleanDescription = description.substring(0, 2000);
    
    // Yeni aura sonucu oluştur
    try {
      const newAuraResult = await prisma.auraResult.create({
        data: {
          text: cleanText,
          message: cleanMessage,
          color: cleanColor,
          description: cleanDescription,
          image,
          detectedKeywords: cleanDetectedKeywords,
          sentimentRatio: cleanSentimentRatio,
          userId: user.id
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        data: {
          id: newAuraResult.id,
          message: newAuraResult.message,
          createdAt: newAuraResult.createdAt
        }
      });
    } catch (dbError) {
      return NextResponse.json(
        { error: "Veritabanı hatası", details: dbError.message },
        { status: 500 }
      );
    }
    
  } catch (error) {
    return NextResponse.json(
      { error: "Aura sonucu kaydedilirken bir hata oluştu", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      );
    }
    
    const userEmail = session.user.email;
    
    // Kullanıcıyı email ile bul veya oluştur
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    
    // Kullanıcı bulunamazsa otomatik olarak oluştur
    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            email: userEmail,
            name: session.user.name || userEmail.split('@')[0],
            image: session.user.image || null
          },
        });
      } catch (createError) {
        return NextResponse.json({ 
          success: true, 
          data: [] // Yeni kullanıcı için boş sonuç listesi döndür
        });
      }
    }
    
    // Kullanıcıya ait aura sonuçlarını getir
    const userAuraResults = await prisma.auraResult.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10 // Son 10 sonucu getir
    });
    
    return NextResponse.json({ 
      success: true, 
      data: userAuraResults 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Aura sonuçları getirilirken bir hata oluştu", details: error.message },
      { status: 500 }
    );
  }
} 