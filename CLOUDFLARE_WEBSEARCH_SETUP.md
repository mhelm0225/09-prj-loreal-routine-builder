# Cloudflare Worker Setup for Web Search

## Overview
To enable real-time web search capabilities in your L'Oréal Routine Builder, you need to set up a Cloudflare Worker that can handle web search requests to OpenAI's API.

## Current Implementation
The application currently uses the endpoint: `lorealbot.mhelm0225.workers.dev`

## Enabling Web Search

### Option 1: Using GPT-4 with Web Browsing (Recommended)
To enable web search, your Cloudflare Worker should:

1. Accept requests with web search parameters
2. Use OpenAI's GPT-4 model with browsing capabilities
3. Return responses that include current web information and citations

### Option 2: Create a New Cloudflare Worker

If you want to create a dedicated worker for web search:

```javascript
// Example Cloudflare Worker code for web search
export default {
  async fetch(request, env) {
    // Handle CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    try {
      const body = await request.json();
      
      // Forward request to OpenAI API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
```

## How Web Search Works in the App

1. **User enables web search**: Check the "Enable Web Search" checkbox in the chat interface
2. **Enhanced prompts**: When web search is enabled, the app adds instructions to search for current L'Oréal product information
3. **Real-time data**: The AI will attempt to provide current information about products, trends, and news
4. **Citations**: Responses may include links and sources when available

## Testing Web Search

1. Enable the web search toggle in the chat interface
2. Ask questions about current L'Oréal products, like:
   - "What are the latest L'Oréal skincare products released in 2025?"
   - "What are current beauty trends for L'Oréal products?"
   - "Find reviews for L'Oréal Revitalift products"
3. The AI should provide current information with sources when available

## Notes

- Web search capability depends on the OpenAI model and API configuration
- GPT-4 models may have access to more recent information than GPT-3.5
- The Cloudflare Worker acts as a proxy to handle API authentication securely
- CORS headers are required for the worker to accept requests from your web app

## Deployment

To deploy your Cloudflare Worker:

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create a new worker
wrangler init lorealbot-websearch

# Add your OpenAI API key as a secret
wrangler secret put OPENAI_API_KEY

# Deploy the worker
wrangler publish
```

## Security Considerations

- Never expose your OpenAI API key in client-side code
- Use Cloudflare Workers to proxy requests securely
- Implement rate limiting to prevent abuse
- Consider adding authentication for production use
