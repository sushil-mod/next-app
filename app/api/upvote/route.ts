import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, secret!) as { id: number };
    const { story_id, upvote } = await req.json();

    const existingUpvote = await prisma.storyUpvote.findUnique({
      where: {
        story_id_user_id: {
          story_id,
          user_id: decoded.id,
        },
      },
    });

    let upvoteRecord;

    if (existingUpvote) {
      upvoteRecord = await prisma.storyUpvote.update({
        where: {
          id: existingUpvote.id,
        },
        data: {
          upvote,
        },
      });
    } else {
      upvoteRecord = await prisma.storyUpvote.create({
        data: {
          story_id,
          user_id: decoded.id,
          upvote,
        },
      });
    }

    return NextResponse.json({ message: "Upvote status updated successfully", upvote: upvoteRecord });
  } catch (error) {
    console.error("Error updating upvote status:", error);
    return NextResponse.json({ message: "Error updating upvote status" }, { status: 500 });
  }
}
