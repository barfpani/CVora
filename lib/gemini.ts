import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

console.log("Gemini key loaded:", !!apiKey);

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in .env.local");
}

export const ai = new GoogleGenAI({ apiKey });