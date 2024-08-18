import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET as string; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;
    const user = await prisma.user.findUnique({
      where: { username },
    });
    console.log("user",user);
    if (user) {

      if (user.password == password) {
     
        const token = jwt.sign({ username, id: user.id }, secret, { expiresIn: '1h' });
        const data = {
          username: user.username
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
    if (error) {
      return NextResponse.json({
        statusCode: 400,
        errors: "",
      }, { status: 400 });
    }
    return NextResponse.json({
      statusCode: 500,
      message: "Internal Server Error",
    }, { status: 500 });
  }
}
