import {db} from "@/lib/db";
import * as z from "zod"
import { NextResponse }   from "next/server"
import bcrypt from  "bcrypt"

const registervalidate=z.object({
    email: z.email(),
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
            
             return NextResponse.json(
                {
                    message: "Login Successfully"        
                },
                {status: 201})
            
   }

   catch(e){
        console.error("Login Error:", e); // Log lỗi ra server để debug
        return NextResponse.json({ message: "cannot connect to server" }, { status: 500 });
   }


}