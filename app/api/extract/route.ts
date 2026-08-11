import { NextResponse } from "next/server";
import { extractResume } from "@/services/resume-extractor";

type TextExtractionRequest = {
  resumeText: string;
  fileName?: string | null;
};

type PdfExtractionRequest = {
  pdfBase64: string;
  mimeType: "application/pdf";
  fileName?: string | null;
};

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return buildBadRequestResponse("Invalid JSON body.");
  }

  if (isTextExtractionRequest(body)) {
    const result = await extractResume({
      resumeText: body.resumeText,
      fileName: body.fileName ?? null,
    });

    if (!result.ok) {
      return buildExtractorErrorResponse(result);
    }

    return NextResponse.json(
      {
        ok: true,
        extracted: result.extracted,
        mapped: result.mapped,
      },
      { status: 200 }
    );
  }

  if (isPdfExtractionRequest(body)) {
    const result = await extractResume({
      pdfBase64: body.pdfBase64,
      mimeType: body.mimeType,
      fileName: body.fileName ?? null,
    });

    if (!result.ok) {
      return buildExtractorErrorResponse(result);
    }

    return NextResponse.json(
      {
        ok: true,
        extracted: result.extracted,
        mapped: result.mapped,
      },
      { status: 200 }
    );
  }

  return buildBadRequestResponse(
    "Request body must include either resumeText or pdfBase64 with mimeType."
  );
}

function isTextExtractionRequest(body: unknown): body is TextExtractionRequest {
  if (!body || typeof body !== "object") return false;

  const candidate = body as Record<string, unknown>;
  return typeof candidate.resumeText === "string";
}

function isPdfExtractionRequest(body: unknown): body is PdfExtractionRequest {
  if (!body || typeof body !== "object") return false;

  const candidate = body as Record<string, unknown>;

  return (
    typeof candidate.pdfBase64 === "string" &&
    candidate.mimeType === "application/pdf"
  );
}

function buildBadRequestResponse(message: string): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      stage: "request",
      message,
    },
    { status: 400 }
  );
}

function buildExtractorErrorResponse(args: {
  stage: "extract" | "validate" | "map";
  message: string;
  issues?: string[];
}): NextResponse {

    const status = args.stage === "validate" ? 422 : args.stage === "extract" ? 502 : 500;

    return NextResponse.json(
        {
            ok: false,
            stage: args.stage,
            message: args.message,
            issues: args.issues ?? [],
        },
        { status }
    );
}