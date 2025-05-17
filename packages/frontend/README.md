# Bridge AI Frontend

A frontend application for Bridge AI, featuring integration with Ollama for local AI capabilities.

## Prerequisites

1. **Node.js** - Ensure you have Node.js installed (v16+)

2. **pnpm** - This project uses pnpm as the package manager

3. **Ollama** - To use the Ollama integration, you must have Ollama installed and running locally

   - Install Ollama by following instructions at: https://ollama.com/download
   - Run Ollama and ensure it's available at http://localhost:11434
   - Pull at least one model (e.g., `ollama pull llama3`)

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm dev
   ```

3. Open your browser to http://localhost:5173

## Using Ollama Integration

1. Ensure Ollama is running locally
2. Navigate to the "Ollama" tab in the application
3. Select a model from the dropdown (requires models to be installed through Ollama)
4. Enter a prompt and click "Generate"
5. View the AI-generated response

You can use streaming mode by toggling the "Use streaming" option, which will stream the response as it's being generated.

## Available Models

The dropdown will automatically show all models installed in your local Ollama instance. If you don't see any models, ensure Ollama is running and that you have pulled at least one model:

```bash
ollama pull llama4
```

## Configuration

The Ollama API client is configured to connect to http://localhost:11434 by default. If your Ollama instance is running on a different address, update the `OLLAMA_URL` constant in `/src/api/ollama.ts`.
