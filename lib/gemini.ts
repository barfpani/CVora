import { GoogleGenAI, Type } from "@google/genai";
import { RESUME_EXTRACTION_PROMPT } from "@/prompts/extraction-prompt";


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
          company: { type: Type.STRING},
          position: { type: Type.STRING},
          location: {type: Type.STRING, nullable: true},
          startDate: {type: Type.STRING},
          endDate: {type: Type.STRING, nullable: true},
          isCurrent: {type: Type.BOOLEAN},
          description: {type: Type.STRING, nullable: true},
        },
        required: ["company", "position", "startDate", "isCurrent"],
      },
    },

    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING},
          degree: { type: Type.STRING},
          fieldOfStudy: { type: Type.STRING, nullable: true },
          location: { type: Type.STRING, nullable: true },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING, nullable: true },
          isCurrent: { type: Type.BOOLEAN },
          description: { type: Type.STRING, nullable: true },
        },
        required: ["institution", "degree", "startDate", "isCurrent"],
      },
    },

    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: {type: Type.STRING},
          role: {type: Type.STRING, nullable: true},
          url: {type: Type.STRING, nullable: true},
          description: {type: Type.STRING, nullable: true},
          technologies: {
            type: Type.ARRAY,
            items: {type: Type.STRING},
          },
        },
        required: ["name", "technologies"],
      },
    },

    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: {type: Type.STRING, nullable: true},
          items: {
            type: Type.ARRAY,
            items: { type: Type.STRING},
          },
        },
        required: ["items"],
      },
    },

    languages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: {type: Type.STRING},
          proficiency: {type: Type.STRING, nullable: true},
        },
        required: ["name"],
      },
    },

    certifications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          issuer: { type: Type.STRING},
          date: {type: Type.STRING, nullable: true},
        },
        required: ["name", "issuer"],
      },
    },
  },

  required: [
    "personalInfo",
    "summary",
    "experience",
    "education",
    "projects",
    "skills",
    "languages",
    "certifications",
  ],
};

export interface ExtractResumeTextInput{
  resumeText: string;
}

export interface ExtractResumePdfInput {
  pdfBase64: string;
  mimeType: "application/pdf";
  fileName?: string;
}

export type ExtractResumeInput = ExtractResumeTextInput | ExtractResumePdfInput;

export async function extractStructuredResume (input: ExtractResumeInput){
  const contents = "resumeText" in input ? buildTextContents(input.resumeText) : buildPdfContents(input.pdfBase64, input.mimeType);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      systemInstruction: RESUME_EXTRACTION_PROMPT,
      responseMimeType: "application/json",
      responseSchema: RESUME_RESPONSE_SCHEMA,
      temperature: 0,
    },
  });

  return parseStructuredJson(response.text);
}

function buildTextContents(resumeText: string){
  return [
    {
      role: "user",
      parts: [
        {
          text: `Extract resume data from the following resume text:\n\n${resumeText}`,
        },
      ],
    },
  ];
}

function buildPdfContents(pdfBase64: string, mimeType: string){
  return [
    {
      role: "user",
      parts: [
        {
          text: "Extract structured resume data from this PDF.",
        },
        {
          inlineData: {mimeType, data: pdfBase64},
        },
      ],
    },
  ];
}

function parseStructuredJson(text: string | undefined){
  if(!text) {
    throw new Error ("Gemini returned an empty response.");
  }

  try {
    return JSON.parse(text);
  }
  catch(error) {
    throw new Error(
      `Gemini returned invalid JSON: ${error instanceof Error ? error.message : "Unknown parse error"}`
    );
  }
}