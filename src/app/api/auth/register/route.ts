import {db} from "@/lib/db";
import * as z from "zod"
import { NextResponse }   from "next/server"
import bcrypt from  "bcrypt"

export const dynamic = 'force-dynamic';

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
            {status: 400}
        )
            
        }else{
            const HashedPassword = await bcrypt.hash(result.data.password,10);
            const email_save=data.email;
            const Find=await db.user.findFirst({where: {email: data.email}});
            if(Find){
                return NextResponse.json(
                {
                    message: "already have this email"        
                },
                {status: 400})
            }
            const newUser = await db.user.create({
            data:{
            email:email_save,
            password:HashedPassword
                } 
           })
           return NextResponse.json({
            message: "register successfully",
            data: { id: newUser.id, email: newUser.email }
           })
        }

    }
    catch(error){
        console.error("Register Error:", error);
        return NextResponse.json({
            message: "Server error during registration"
        }, { status: 500 })
    }
}