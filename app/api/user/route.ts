import { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client";
import { use } from "react";

const client = new PrismaClient();


export async function POST(req:NextRequest) {
    // extract the body
  const body = await req.json();
  console.log("body",body);
  const user = await client.user.create({
    data:{
      username:body.username,
      password:body.password
    }
  })

    console.log("user",user.id)



  // store the body in the database
  return Response.json({ message:"you are logged in!" })
}