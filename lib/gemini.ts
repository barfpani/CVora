import { GoogleGenAI, Type } from "@google/genai";
import { RESUME_EXTRACTION_PROMPT } from "@/prompts/extraction-prompt";
import { nullable } from "zod";
import { Summary } from "lucide-react";

const apiKey = process.env.GEMINI_API_KEY;

if(!apiKey){
  throw new Error("Missing GEMINI_API_KEY in .env.local file. Please add your Gemini API key to the .env.local file.");
}

const ai = new GoogleGenAI({ apiKey });

const RESUME_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties:{
        name: { type: Type.STRING},
        title: { type: Type.STRING, nullable: true},
        email: { type: Type.STRING},
        phone: { type: Type.STRING, nullable: true},
        website: { type: Type.STRING, nullable: true},
        github: { type: Type.STRING, nullable: true},
        linkedin: { type: Type.STRING, nullable: true},
        location: {type: Type.STRING, nullable: true},
      },
      required: ["name", "email"],
    },

    summary: { type: Type.STRING, nullable: true},
    
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: {type: Type.STRING},
          degree: {type: Type.STRING},
          filedOfStudy: {type: Type.STRING, nullable: true},
          location: {type: Type.STRING, nullable: true},
          startDate: {type: Type.STRING},
          endDate: {type: Type.STRING, nullable: true},
          isCurrent: {type: Type.BOOLEAN},
          description: {type: Type.STRING, nullable: true},
        },
        requied: ["institution", "degree", "startDate", "isCurrent"],
      },
    },

    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          
        }
      }
    }
  }
}