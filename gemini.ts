import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const textModel = genAI.getGenerativeModel({ model: "gemini-pro" });
export const imageModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

export async function generateText(prompt: string) {
  const result = await textModel.generateContent(prompt);
  return result.response.text();
}

export async function generateImage(prompt: string) {
  const result = await imageModel.generateContent(prompt);
  return result.response.text();
}
