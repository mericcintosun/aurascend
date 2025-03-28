import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Basit bir bellek içi veri deposu
let auraResults = [];

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const { text, message, color, description, image, detectedKeywords, sentimentRatio } = await req.json();
    
    const newAuraResult = {
      id: Math.random().toString(36).substring(2, 15),
      userId,
      text,
      message,
      color,
      description,
      image,
      detectedKeywords,
      sentimentRatio: sentimentRatio || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    auraResults.push(newAuraResult);
    
    return NextResponse.json({ success: true, data: newAuraResult });
  } catch (error) {
    console.error("Aura sonucu kaydetme hatası:", error);
    return NextResponse.json(
      { error: "Aura sonucu kaydedilirken bir hata oluştu" },
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
    
    const userId = session.user.id;
    
    // Kullanıcıya ait aura sonuçlarını filtrele ve en yeniden eskiye sırala
    const userAuraResults = auraResults
      .filter(result => result.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return NextResponse.json({ success: true, data: userAuraResults });
  } catch (error) {
    console.error("Aura sonuçları getirme hatası:", error);
    return NextResponse.json(
      { error: "Aura sonuçları getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 