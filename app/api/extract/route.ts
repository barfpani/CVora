import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini"; 


export async function GET(){
    console.log("Route Executed");

    return NextResponse.json({
        ok: true,
    });
}