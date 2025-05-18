/**
 * API client for calling Ollama directly from the frontend
 */

interface OllamaGenerateOptions {
  model?: string;
  system?: string;
  template?: string;
  context?: number[];
  stream?: boolean;
  raw?: boolean;
  format?: string;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    num_predict?: number;
    num_ctx?: number;
    stop?: string[];
    repeat_penalty?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    tfs_z?: number;
    mirostat?: number;
    mirostat_tau?: number;
    mirostat_eta?: number;
    num_thread?: number;
    num_gpu?: number;
    num_batch?: number;
  };
}

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaErrorResponse {
  error: string;
}

// Base URL for Ollama API
const OLLAMA_URL = "http://localhost:11434";

/**
 * Generate a completion from Ollama
 */
export const generateCompletion = async (
  prompt: string,
  options?: OllamaGenerateOptions
): Promise<OllamaResponse> => {
  try {
    const modelName = options?.model || "llama3";

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        prompt,
        stream: false,
        ...options,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as OllamaErrorResponse;
      throw new Error(
        `Ollama API error: ${errorData.error || response.statusText}`
      );
    }

    return (await response.json()) as OllamaResponse;
  } catch (error) {
    console.error("Error calling Ollama:", error);
    throw error;
  }
};

/**
 * Generate a streaming completion from Ollama
 * This function returns an async generator that yields each chunk of the response
 */
export async function* streamCompletion(
  prompt: string,
  options?: OllamaGenerateOptions
): AsyncGenerator<OllamaResponse> {
  try {
    const modelName = options?.model || "llama3";

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        prompt,
        stream: true,
        ...options,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as OllamaErrorResponse;
      throw new Error(
        `Ollama API error: ${errorData.error || response.statusText}`
      );
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode the chunk and split by newlines (each line is a JSON object)
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line) as OllamaResponse;
            yield parsed;

            // If this is the final message, break out
            if (parsed.done) {
              return;
            }
          } catch (e) {
            console.error("Error parsing Ollama stream JSON:", e);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error("Error streaming from Ollama:", error);
    throw error;
  }
}
