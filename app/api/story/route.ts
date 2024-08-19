import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
    try {
      const token = req.headers.get('authorization');
      if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      const decoded = jwt.verify(token, secret!) as { id: number };

      const stories = await prisma.storyIdea.findMany({
        include: {
          storyUpvote: true,
        },
      });
  
      const formattedStories = stories.map((story) => {
        const upvoteCount = story.storyUpvote.filter(upvote => upvote.upvote).length;
        const isUserUpvote = story.storyUpvote.some(upvote => upvote.user_id === decoded.id && upvote.upvote);
  
        return {
          id: story.id,
          user_id: story.user_id,
          title: story.title,
          description: story.description,
          storyUpvote: upvoteCount,
          isUserUpvote: isUserUpvote || false,
        };
      });
  
      return NextResponse.json({ stories: formattedStories });
    } catch (error) {
      console.error("Error fetching stories:", error);
      return NextResponse.json({ message: "Error fetching stories" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
      const token = req.headers.get('authorization');
      if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const decoded = jwt.verify(token, secret!) as { id: number };
  
      const { title, description } = await req.json();
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      
      const storyCountToday = await prisma.storyIdea.count({
        where: {
          user_id: decoded.id,
          createdAt: {
            gte: today,
            lte: endOfDay,
          },
        },
      });

      if (storyCountToday >= 2) {
        const nextAllowedTime = new Date(endOfDay).getTime() - Date.now();
        return NextResponse.json({
          message: "Daily limit reached",
          nextAllowedTime: nextAllowedTime,
        }, { status: 201 });
      }

      const newStory = await prisma.storyIdea.create({
        data: {
          user_id: decoded.id,
          title,
          description,
        },
      });
  
      return NextResponse.json({ message: "Story added successfully", story: newStory });
    } catch (error) {
      console.error("Error adding story:", error);
      return NextResponse.json({ message: "Error adding story" }, { status: 500 });
    }
  }
