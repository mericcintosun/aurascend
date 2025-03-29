import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }
    
    const data = await req.json();
    const { text, message, color, description, detectedKeywords, sentimentRatio, image, music } = data;
    
    if (!text || !message || !color || !description) {
      return NextResponse.json(
        { error: "Eksik veri. Metin, mesaj, renk ve açıklama zorunludur" },
        { status: 400 }
      );
    }
    
    const cleanedData = {
      text: text.substring(0, 2000),
      message: message.substring(0, 100),
      color: color,
      description: description.substring(0, 1000),
      detectedKeywords: Array.isArray(detectedKeywords) ? detectedKeywords.slice(0, 20) : [],
      sentimentRatio: typeof sentimentRatio === 'number' ? sentimentRatio : 0
    };
    
    if (image) {
      cleanedData.image = image;
    }
    
    if (music) {
      cleanedData.music = music;
    }
    
    const userEmail = session.user.email;
    
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    
    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            email: userEmail,
            name: session.user.name || userEmail.split('@')[0],
            image: session.user.image || null
          },
        });
      } catch (userCreateError) {
        return NextResponse.json(
          { error: "Kullanıcı oluşturulamadı. Lütfen daha sonra tekrar deneyin." },
          { status: 500 }
        );
      }
    }
    
    const auraResult = await prisma.auraResult.create({
      data: {
        ...cleanedData,
        userId: user.id
      },
    });
    
    return NextResponse.json({ success: true, data: auraResult });
  } catch (error) {
    console.error("Aura sonucu oluşturulurken hata:", error);
    return NextResponse.json(
      { error: "Aura sonucu kaydedilemedi", details: error.message },
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
    
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    
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
          data: []
        });
      }
    }
    
    const userAuraResults = await prisma.auraResult.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
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