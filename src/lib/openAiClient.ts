import OpenAI from 'openai';

export const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
});
