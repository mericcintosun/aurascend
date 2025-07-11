import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    
    const body = await request.json();
    const { name, email, password } = body;
    
    
    // Validate input
    if (!email || !email.includes('@') || !password || password.length < 6) {
      
      
      return NextResponse.json(
        { message: 'Geçersiz e-posta veya şifre' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        
        return NextResponse.json(
          { message: 'Bu e-posta adresi zaten kullanılıyor' },
          { status: 400 }
        );
      }
    } catch (findError) {
      console.error('Error checking for existing user:', findError);
      // Continue even if checking fails - we'll try to create the user anyway
    }
    
    // Hash password
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });
    
    
    // Don't send the password in the response
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        message: 'Kullanıcı başarıyla oluşturuldu',
        user: userWithoutPassword
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error during registration:', error);
    
    // Check if it's a Prisma error and provide more detailed message
    if (error.code) {
      console.error('Prisma error code:', error.code);
    }
    
    // If it's a MongoDB connection error about empty database
    if (error.message && error.message.includes('empty database name not allowed')) {
      console.error('MongoDB connection error - empty database name');
      return NextResponse.json(
        { message: 'Veritabanı bağlantı hatası. Lütfen daha sonra tekrar deneyin veya yöneticiyle iletişime geçin.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Kayıt sırasında bir hata oluştu: ' + (error.message || 'Bilinmeyen hata') },
      { status: 500 }
    );
  }
} 