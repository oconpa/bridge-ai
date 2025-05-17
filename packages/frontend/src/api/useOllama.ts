import { useMutation } from "@tanstack/react-query";
import { generateCompletion } from "./ollama";
import { useState } from "react";

/**
 * Hook for generating completions from Ollama
 */
export const useOllamaCompletion = () => {
  const [result, setResult] = useState<string>("");
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: async ({
      prompt,
      model = "llama3",
      system,
      temperature = 0.7,
      maxTokens,
    }: {
      prompt: string;
      model?: string;
      system?: string;
      temperature?: number;
      maxTokens?: number;
    }) => {
      setResult("");
      setIsComplete(false);

      const options = {
        model,
        system,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      };

      const response = await generateCompletion(prompt, options);
      setResult(response.response);
      setIsComplete(true);
      return response;
    },
  });

  return {
    generateCompletion: mutation.mutate,
    generateCompletionAsync: mutation.mutateAsync,
    result,
    isComplete,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: () => {
      setResult("");
      setIsComplete(false);
      mutation.reset();
    },
  };
};

/**
 * Hook for streaming completions from Ollama
 * This doesn't use React Query's mutation because we need more control over the streaming process
 */
export const useOllamaStream = () => {
  const [result, setResult] = useState<string>("");
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // We'll use AbortController to cancel ongoing streams
  const abortControllerRef = useState<AbortController | null>(null);

  const streamCompletion = async ({
    prompt,
    model = "llama3",
    system,
    temperature = 0.7,
    maxTokens,
  }: {
    prompt: string;
    model?: string;
    system?: string;
    temperature?: number;
    maxTokens?: number;
  }) => {
    try {
      // Reset state
      setResult("");
      setIsComplete(false);
      setIsLoading(true);
      setError(null);

      // Create a new AbortController
      const abortController = new AbortController();
      abortControllerRef[1](abortController);

      const options = {
        model,
        system,
        stream: true,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      };

      // Use fetch directly for streaming
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          ...options,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Ollama API error: ${errorData.error || response.statusText}`
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get reader from response");
      }

      const decoder = new TextDecoder();
      let fullText = "";

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
              const parsed = JSON.parse(line);
              fullText += parsed.response;
              setResult(fullText);

              // If this is the final message, mark as complete
              if (parsed.done) {
                setIsComplete(true);
                setIsLoading(false);
                abortControllerRef[1](null);
                return fullText;
              }
            } catch (e) {
              console.error("Error parsing Ollama stream JSON:", e);
            }
          }
        }

        // If we get here, the stream ended without a done:true message
        setIsComplete(true);
        setIsLoading(false);
        abortControllerRef[1](null);
        return fullText;
      } catch (e) {
        // Check if this is an abort error
        if (e instanceof Error && e.name === "AbortError") {
          console.log("Stream aborted by user");
        } else {
          const error = e instanceof Error ? e : new Error(String(e));
          setError(error);
          console.error("Streaming error:", e);
        }
        setIsLoading(false);
        abortControllerRef[1](null);
        throw e;
      } finally {
        reader.releaseLock();
      }
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      setError(error);
      setIsLoading(false);
      abortControllerRef[1](null);
      throw error;
    }
  };

  const cancelStream = () => {
    if (abortControllerRef[0]) {
      abortControllerRef[0].abort();
      abortControllerRef[1](null);
      setIsLoading(false);
    }
  };

  const reset = () => {
    cancelStream();
    setResult("");
    setIsComplete(false);
    setError(null);
  };

  return {
    streamCompletion,
    result,
    isComplete,
    isLoading,
    error,
    cancelStream,
    reset,
  };
};
