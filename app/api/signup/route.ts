import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({
        statusCode: 409,
        message: "Username already exists",
      }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ username, id: newUser.id }, secret, { expiresIn: '4h' });

    return NextResponse.json({
      statusCode: 201,
      message: "User registered successfully",
      data: {
        id: newUser.id,
        username: newUser.username,
        token
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json({
      statusCode: 500,
      message: "Internal Server Error",
    }, { status: 500 });
  }
}
