import {db} from "@/lib/db";
import * as z from "zod"
import { NextResponse }   from "next/server"
import bcrypt from  "bcrypt"
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6,"Password must be at least 6 characters")
})

export async function POST(req: Request){

   try{
        // Validate JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not set in environment variables");
            return NextResponse.json(
                { message: "Server configuration error" },
                { status: 500 }
            );
        }

        const data = await req.json();
        const result = loginSchema.safeParse(data);
        if (!result.success) {
                
                return NextResponse.json(
                {
                    message: result.error          
                },
                {status: 400})
            }

            const user = await db.user.findFirst({where: {email: result.data.email}});
            if (!user) {
                return NextResponse.json(
                {
                    message: "cannot find your email or password"        
                },
                {status: 400})
            }
            const isPasswordValid = await bcrypt.compare(result.data.password, user.password);
            if (!isPasswordValid) {
            return NextResponse.json(
                {
                    message: "cannot find your email or password"        
                },
                {status: 400})
            }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" }) 
      .setIssuedAt()
      .setExpirationTime("2h") 
      .sign(secret);

  
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, 
      path: "/",
    });

    return NextResponse.json({ 
        message: "Login successful",
        user: { id: user.id, email: user.email }
    });
            
            
   }

   catch(e){
        console.error("Login Error:", e);
        return NextResponse.json({ message: "cannot connect to server" }, { status: 500 });
   }


}