import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (user) {
      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Generate a JWT token
        const token = jwt.sign({ username, id: user.id }, secret, { expiresIn: '4h' });
        const data = {
          username: user.username,
        };
        return NextResponse.json({
          data,
          statusCode: 200,
          message: "Logged in successfully",
          token,
        });
      } else {
        return NextResponse.json({
          statusCode: 401,
          message: "Incorrect Credential",
        }, { status: 401 });
      }
    } else {
      return NextResponse.json({
        statusCode: 401,
        message: "Incorrect Credential",
      }, { status: 401 });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({
      statusCode: 500,
      message: "Internal Server Error",
    }, { status: 500 });
  }
}
