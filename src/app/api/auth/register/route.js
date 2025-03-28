import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    
    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email ve şifre gerekli" },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email adresi zaten kayıtlı" },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    // Return the user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { message: "Kayıt başarılı", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Kayıt olurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 