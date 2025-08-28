// OpenAI API Configuration
// Replace 'your-openai-api-key-here' with your actual OpenAI API key
// Get your API key from: https://platform.openai.com/api-keys

export const OPENAI_CONFIG = {
  API_KEY: process.env.OPENAI_API_KEY || 'your_openai_api_key_here',
  API_URL: 'https://api.openai.com/v1/chat/completions',
  MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
};

// Instructions:
// 1. Sign up for OpenAI at https://platform.openai.com/
// 2. Go to API Keys section
// 3. Create a new API key
// 4. Replace the API_KEY value above with your actual key
// 5. Keep your API key secure and never commit it to version control
