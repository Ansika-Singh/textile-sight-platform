// Utility for interacting with a local Ollama instance

const OLLAMA_URL = "http://localhost:11434";

export interface OllamaAnalysisResult {
  thread_density: number;
  warp_count: number;
  weft_count: number;
  fabric_type: string;
  weave_pattern: string;
  ai_suggestions: string;
}

/**
 * Checks if the local Ollama instance is running.
 */
export async function testOllamaConnection(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!res.ok) return false;
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Converts a File or Blob to a base64 string without the data URI prefix.
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Analyzes a fabric image using a local Ollama vision model (like llava).
 */
export async function analyzeWithOllama(
  model: string,
  imageBlob: Blob
): Promise<OllamaAnalysisResult> {
  const base64Image = await blobToBase64(imageBlob);

  const prompt = `
You are an expert textile engineer analyzing a macro fabric scan.
Analyze the provided fabric image and determine its physical properties.

Return a strict JSON object with EXACTLY these keys:
- "thread_density": (number) Threads per inch (TPI)
- "warp_count": (number) Warp threads per cm
- "weft_count": (number) Weft threads per cm
- "fabric_type": (string) e.g., "100% Cotton", "Polyester Blend", "Denim"
- "weave_pattern": (string) e.g., "Plain Weave", "Twill", "Satin"
- "ai_suggestions": (string) A brief paragraph of manufacturing insights

Do not wrap the JSON in markdown blocks. Output only raw JSON.
`;

  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        images: [base64Image],
        format: "json",
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama API error: ${res.statusText}`);
    }

    const data = await res.json();
    const result = JSON.parse(data.response) as OllamaAnalysisResult;
    
    // Ensure all required fields exist to prevent UI crashes
    return {
      thread_density: Number(result.thread_density) || 0,
      warp_count: Number(result.warp_count) || 0,
      weft_count: Number(result.weft_count) || 0,
      fabric_type: result.fabric_type || "Unknown",
      weave_pattern: result.weave_pattern || "Unknown",
      ai_suggestions: result.ai_suggestions || "Local AI analysis complete.",
    };
  } catch (err: any) {
    throw new Error(`Ollama analysis failed: ${err.message}`);
  }
}
