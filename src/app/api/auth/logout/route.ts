
import { NextResponse }   from "next/server"
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export async function POST(){
const CookieStore= await cookies()
CookieStore.set("session","",{
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), 
    path: "/",
})
return NextResponse.json({ message: "Logged out" });
}