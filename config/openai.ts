import Constants from 'expo-constants';

// OpenAI API Configuration

export const OPENAI_CONFIG = {
  API_KEY: Constants.expoConfig?.extra?.openaiApiKey || process.env.OPENAI_API_KEY,
  API_URL: 'https://api.openai.com/v1/chat/completions',
  MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
};
