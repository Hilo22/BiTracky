import {db} from "@/lib/db";
import * as z from "zod"
import { NextResponse }   from "next/server"
import bcrypt from  "bcrypt"
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const registervalidate=z.object({
    email: z.string().email("not avaliable Email "),
    password: z.string().min(6,"not avaliable password")
})

export async function POST(req: Request){

   try{

        const data=await req.json() ;
            const result = registervalidate.safeParse(data)
            if(!result.success){
                
                return NextResponse.json(
                {
                    message: result.error          
                },
                {status: 400})
            }

            const Find=await db.user.findFirst({where: {email: data.email}});
            if(!Find){
                return NextResponse.json(
                {
                    message: "cannot find your email or password"        
                },
                {status: 400})
            }
            if(!await bcrypt.compare(data.password,Find.password)){
            return NextResponse.json(
                {
                    message: "cannot find your email or password"        
                },
                {status: 400})
            }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: Find.id, email: Find.email })
      .setProtectedHeader({ alg: "HS256" }) 
      .setIssuedAt()
      .setExpirationTime("2h") 
      .sign(secret);

  
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 *2, 
      path: "/",
    });

    return NextResponse.json({ message: "successfully login" });
            
            
   }

   catch(e){
        console.error("Login Error:", e);
        return NextResponse.json({ message: "cannot connect to server" }, { status: 500 });
   }


}