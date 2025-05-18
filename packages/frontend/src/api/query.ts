import { useQuery } from "@tanstack/react-query";
import { list } from "aws-amplify/storage";
import { type OllamaErrorResponse } from "./ollama";

const OLLAMA_URL = "http://localhost:11434";

export const useListS3 = (path: string) => {
  return useQuery({
    queryKey: [`listSpecs-${path}`],
    queryFn: async () => {
      const result = await list({ path });

      return result;
    },
  });
};

export const useOllamaModels = () => {
  return useQuery({
    queryKey: ["ollamaModels"],
    queryFn: async () => {
      const response = await fetch(`${OLLAMA_URL}/api/tags`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = (await response.json()) as OllamaErrorResponse;
        throw new Error(
          `Ollama API error: ${errorData.error || response.statusText}`
        );
      }

      return await response.json();
    },
  });
};
