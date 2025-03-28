import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { isValidObjectId } from "@/lib/utils";

export async function GET(request) {
  try {
    // Kullanıcı oturumunu kontrol et
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Yetkilendirme hatası" },
        { status: 401 }
      );
    }

    // Kullanıcının ID'sini al
    const userId = session.user.id;
    
    console.log("Session user ID:", userId);

    // Sorgu parametrelerini al
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    // Kullanıcıya ait aura sonuçlarını getir, ancak Google ID'si için
    // önce kullanıcıyı email ile bulalım - bu daha güvenli
    try {
      // Kullanıcının email'ini kullanarak aura sonuçlarını al
      const auraResults = await prisma.auraResult.findMany({
        where: {
          user: {
            email: session.user.email
          }
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json(auraResults);
    } catch (dbError) {
      console.error("Veritabanı sorgusu hatası:", dbError);
      return NextResponse.json(
        { message: "Veritabanı sorgusunda hata oluştu", details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Aura sonuçlarını getirirken hata:", error);
    return NextResponse.json(
      { message: "Aura sonuçlarını getirirken bir hata oluştu", details: error.message },
      { status: 500 }
    );
  }
} 