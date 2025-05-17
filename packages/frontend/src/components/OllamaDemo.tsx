import { useOllamaCompletion, useOllamaStream } from "../api/useOllama";
import { useOllamaModels } from "../api/query";
import { useState } from "react";

import {
  Button,
  Container,
  FormField,
  Header,
  Input,
  SpaceBetween,
  Textarea,
  Toggle,
  Spinner,
  Select,
} from "@cloudscape-design/components";

export const OllamaSpecGeneration = () => {
  const [prompt, setPrompt] = useState(
    `Create a technical spec from this content, with clear sections like Overview, Key Insights, and Next Steps:

I'm a student at Stanford who wants to file taxes`
  );

  const [useStreaming, setUseStreaming] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>("llama3:8b");
  const [temperature, setTemperature] = useState<number>(0.7);

  // Get model list using the hook
  const {
    data: modelList,
    isLoading: isLoadingModels,
    error: modelError,
  } = useOllamaModels();

  // Regular completion hook
  const {
    generateCompletion,
    result: completionResult,
    isLoading: isCompletionLoading,
    error: completionError,
    reset: resetCompletion,
  } = useOllamaCompletion();

  // Streaming completion hook
  const {
    streamCompletion,
    result: streamResult,
    isLoading: isStreamLoading,
    error: streamError,
    cancelStream,
    reset: resetStream,
  } = useOllamaStream();

  // Combined loading and result state for the UI
  const isLoading = useStreaming ? isStreamLoading : isCompletionLoading;
  const result = useStreaming ? streamResult : completionResult;
  const error = useStreaming ? streamError : completionError;

  // Models for select dropdown
  const modelOptions =
    modelList?.models?.map((model: { name: string }) => ({
      label: model.name,
      value: model.name,
    })) || [];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!prompt.trim()) return;

    // Reset previous results
    if (useStreaming) {
      resetStream();
    } else {
      resetCompletion();
    }

    const params = {
      prompt,
      model: selectedModel,
      temperature,
    };

    if (useStreaming) {
      await streamCompletion(params);
    } else {
      generateCompletion(params);
    }
  };

  const handleReset = () => {
    setPrompt("");
    if (useStreaming) {
      resetStream();
    } else {
      resetCompletion();
    }
  };

  const handleCancel = () => {
    if (useStreaming && isStreamLoading) {
      cancelStream();
    }
  };

  return (
    <Container header={<Header variant="h2">Ollama</Header>}>
      <form onSubmit={handleSubmit}>
        <SpaceBetween direction="vertical" size="l">
          <FormField label="Model">
            <Select
              selectedOption={
                modelOptions.find(
                  (option: { value: string }) => option.value === selectedModel
                ) || []
              }
              onChange={({ detail }) =>
                setSelectedModel(detail.selectedOption.value as string)
              }
              options={modelOptions}
              placeholder="Select a model"
              disabled={isLoading || isLoadingModels}
              loadingText="Loading models..."
              statusType={isLoadingModels ? "loading" : undefined}
              empty={modelError ? "Error loading models" : "No models found"}
            />
          </FormField>

          <FormField label="Prompt Instructions">
            <Textarea
              value={prompt}
              onChange={({ detail }) => setPrompt(detail.value)}
              placeholder="Enter your instruction prompt here..."
              disabled={isLoading}
              rows={5}
            />
          </FormField>

          <FormField label="Temperature">
            <Input
              type="number"
              value={temperature.toString()}
              onChange={({ detail }) => {
                const value = parseFloat(detail.value);
                if (!isNaN(value) && value >= 0 && value <= 2) {
                  setTemperature(value);
                }
              }}
              placeholder="0.7"
              disabled={isLoading}
            />
          </FormField>

          <FormField label="Use streaming">
            <Toggle
              checked={useStreaming}
              onChange={({ detail }) => setUseStreaming(detail.checked)}
              disabled={isLoading}
            />
          </FormField>

          <SpaceBetween direction="horizontal" size="s">
            <Button
              variant="primary"
              formAction="submit"
              disabled={!prompt.trim() || isLoading}
            >
              {isLoading ? "Generating..." : "Generate"}
            </Button>

            {isLoading && useStreaming && (
              <Button onClick={handleCancel}>Cancel</Button>
            )}

            <Button onClick={handleReset} disabled={isLoading}>
              Reset
            </Button>
          </SpaceBetween>

          {isLoading && <Spinner size="normal" />}

          {error && (
            <div style={{ color: "var(--color-text-status-error)" }}>
              Error: {error.message}
            </div>
          )}

          {result && (
            <Container
              header={<Header variant="h3">Response</Header>}
              footer={
                <Button
                  disabled={isLoading}
                  variant="primary"
                  formAction="none"
                >
                  Save Spec
                </Button>
              }
            >
              <div style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                {result}
              </div>
            </Container>
          )}
        </SpaceBetween>
      </form>
    </Container>
  );
};
