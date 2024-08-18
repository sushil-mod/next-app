import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization');
    console.log("token",token);
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify the JWT token
    jwt.verify(token, secret!);

    // Fetch all stories
    const stories = await prisma.storyIdea.findMany();

    return NextResponse.json({ stories });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ message: "Invalid token or server error" }, { status: 401 });
  }
}
