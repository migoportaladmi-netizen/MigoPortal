import { GoogleGenAI, Type } from "@google/genai";
import { ReceiptAnalysisResult, ResumeAnalysis } from "../types";

// Helper to get API key safely
const getApiKey = () => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("API_KEY is missing from environment variables.");
    throw new Error("API Key missing");
  }
  return key;
};

// 1. Receipt Parsing Service
export const parseReceiptImage = async (base64Image: string): Promise<ReceiptAnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    // Clean base64 string if it contains metadata prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, though flash handles others
              data: cleanBase64
            }
          },
          {
            text: "Analyze this receipt image for an LLC business expense. Extract the merchant name, total amount, currency, date, and suggest a category. Crucially, analyze if this expense is likely Tax Deductible for a US LLC (Yes, No, or Partial) and provide a very short reasoning (e.g. 'Business Meal - 50% limit')."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchant: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            date: { type: Type.STRING, description: "Format YYYY-MM-DD" },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" },
            taxDeductibility: { type: Type.STRING, enum: ["Yes", "No", "Partial"] },
            taxReasoning: { type: Type.STRING, description: "Brief explanation of tax status" }
          },
          required: ["merchant", "amount", "date", "category", "taxDeductibility"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");
    
    return JSON.parse(text) as ReceiptAnalysisResult;

  } catch (error) {
    console.error("Error parsing receipt:", error);
    throw error;
  }
};

// 2. Travel Assistant Chat Service
export const sendMessageToAssistant = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    // Use gemini-2.5-flash for speed and grounding capabilities
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction: "You are a helpful travel and expense assistant for an LLC named 'MigoPortal'. Help users plan trips, find flight estimates, check per-diem rates, and understand expense policies. Be concise and professional.",
        tools: [{ googleSearch: {} }], // Enable Search for up-to-date travel info
      }
    });

    const result = await chat.sendMessage({ message });
    
    // Extract text and grounding metadata (links) if available
    const text = result.text;
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    return { text, groundingChunks };

  } catch (error) {
    console.error("Error in chat:", error);
    throw error;
  }
};

// 3. Trip Itinerary Generator
export const generateItinerary = async (destination: string, startDate: string, endDate: string, purpose: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Create a brief, day-by-day business trip itinerary for a trip to ${destination} from ${startDate} to ${endDate}. The purpose of the trip is "${purpose}". Include suggested times for meetings and some local dining recommendations suitable for business. Format nicely in Markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }] // Use search to get real local info if possible
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};

// 4. Analyze Resume against Job Description
export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<ResumeAnalysis> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Analyze the following resume against the job description. Provide a match score (0-100), list matching skills, missing skills, and brief advice on how to improve the application.
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    RESUME:
    ${resumeText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.INTEGER },
            matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            advice: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as ResumeAnalysis;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};

// 5. Generate Cover Letter
export const generateCoverLetter = async (resumeText: string, jobDescription: string, companyName: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Write a professional cover letter for the following job at ${companyName}, based on the candidate's resume.
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    RESUME:
    ${resumeText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate cover letter.";
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw error;
  }
};

// 6. Get Market Insights
export const getMarketInsights = async (jobTitle: string, location: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Provide market insights for the role of "${jobTitle}" in "${location}". Include typical salary range, demand trends, and top skills required currently. Use Google Search to get recent data.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    return response.text || "No insights available.";
  } catch (error) {
    console.error("Error fetching market insights:", error);
    throw error;
  }
};

// 7. Generate Job Description
export const generateJobDescription = async (title: string, company: string, location: string): Promise<{description: string, requirements: string[], responsibilities: string[]}> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Generate a job description for a "${title}" position at "${company}" located in "${location}". Return JSON with description, requirements (array of strings), and responsibilities (array of strings).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
            responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating job description:", error);
    throw error;
  }
};
