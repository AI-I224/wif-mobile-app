// OpenAI API Configuration

export const OPENAI_CONFIG = {
  API_KEY: process.env.OPENAI_API_KEY || 'fallback_api_key',
  API_URL: 'https://api.openai.com/v1/chat/completions',
  MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
};
