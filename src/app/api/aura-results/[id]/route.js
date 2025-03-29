import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// ObjectID formatını kontrol eden fonksiyon
function isValidObjectId(id) {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}

// GET - Tekil aura sonucu
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Yetkilendirme hatası' }, { status: 401 });
    }
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Aura ID gerekli' }, { status: 400 });
    }
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ 
        error: 'Geçersiz ID formatı', 
        details: 'ID 24 karakterli heksadesimal bir string olmalıdır' 
      }, { status: 400 });
    }
    
    const auraResult = await prisma.auraResult.findUnique({
      where: {
        id: id,
        userId: session.user.id
      }
    });
    
    if (!auraResult) {
      return NextResponse.json({ error: 'Aura sonucu bulunamadı' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: auraResult });
  } catch (error) {
    console.error('Aura sonucu alınırken hata:', error);
    return NextResponse.json({ error: 'Aura sonucu alınamadı' }, { status: 500 });
  }
}

// DELETE - Aura sonucunu silme
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Yetkilendirme hatası' }, { status: 401 });
    }
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Aura ID gerekli' }, { status: 400 });
    }
    
    // ID format kontrolü
    if (!isValidObjectId(id)) {
      return NextResponse.json({ 
        error: 'Geçersiz ID formatı', 
        details: 'ID 24 karakterli heksadesimal bir string olmalıdır' 
      }, { status: 400 });
    }
    
    console.log('Silme işlemi için:', { id, userId: session.user.id });
    console.log('Oturum bilgileri:', { 
      userId: session.user.id,
      userEmail: session.user.email
    });
    
    try {
      // Kullanıcı e-postası üzerinden kullanıcıyı bul
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email
        },
        select: {
          id: true
        }
      });
      
      if (!user) {
        return NextResponse.json({ 
          error: 'Kullanıcı bulunamadı', 
          details: 'Oturum açık ancak kullanıcı bilgileri alınamadı' 
        }, { status: 401 });
      }
      
      // Kullanıcının gerçek ID'sini kullan
      const userId = user.id;
      console.log('Veritabanından bulunan kullanıcı ID:', userId);
      
      // Kullanıcıya ait aurayı bul
      const existingAura = await prisma.auraResult.findFirst({
        where: {
          id: id,
          userId: userId
        },
        select: {
          id: true,
          userId: true,
          message: true
        }
      });
      
      console.log('Bulunan aura:', existingAura);
      
      if (!existingAura) {
        return NextResponse.json({ 
          error: 'Aura sonucu bulunamadı', 
          details: 'Belirtilen ID ile kayıt bulunamadı veya bu auraya erişim yetkiniz yok' 
        }, { status: 404 });
      }
      
      // Silme işlemini gerçekleştir
      const deletedAura = await prisma.auraResult.delete({
        where: {
          id: id
        }
      });
      
      console.log('Aura başarıyla silindi:', deletedAura);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Aura sonucu başarıyla silindi',
        id: id
      });
    } catch (dbError) {
      console.error('Veritabanı işlemi sırasında hata:', dbError);
      
      // Prisma hatalarını özel olarak ele al
      if (dbError.code === 'P2025') {
        return NextResponse.json({ 
          error: 'Aura sonucu bulunamadı', 
          details: 'Silinecek kayıt bulunamadı'
        }, { status: 404 });
      }
      
      if (dbError.code === 'P2023') {
        return NextResponse.json({ 
          error: 'Geçersiz ID', 
          details: 'Geçersiz MongoDB ID formatı'
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        error: 'Veritabanı işlemi başarısız', 
        details: dbError.message || 'Bilinmeyen veritabanı hatası' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Aura sonucu silinirken hata:', error);
    return NextResponse.json({ 
      error: 'Aura sonucu silinemedi', 
      details: error.message || 'Bilinmeyen hata'
    }, { status: 500 });
  }
} 