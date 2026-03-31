
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { InventionProfile, PatentDraft, PriorArtItem, PublicSearchResult } from "../types";

// Always use process.env.API_KEY directly when initializing the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeInvention = async (description: string): Promise<InventionProfile> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this invention description: "${description}". 
    Provide:
    1. A structured technical summary.
    2. Keywords.
    3. Suggested IP classification (IPC/CPC).
    4. Missing details.
    5. A novelty score (0-100).
    6. A Mermaid.js flowchart code representing the technical process or architecture. Start with "graph TD".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          classification: { type: Type.STRING },
          noveltyScore: { type: Type.NUMBER },
          missingDetails: { type: Type.ARRAY, items: { type: Type.STRING } },
          flowchartCode: { type: Type.STRING },
        },
        required: ["title", "summary", "keywords", "classification", "noveltyScore", "missingDetails", "flowchartCode"]
      },
    },
  });

  // Extract the generated text using the .text property (not a method)
  return JSON.parse(response.text || '{}');
};

export const searchPriorArt = async (invention: InventionProfile): Promise<PriorArtItem[]> => {
  const query = `Patents and prior art related to ${invention.title}: ${invention.keywords?.join(', ')}`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  // Access grounding chunks from metadata for web search results
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return chunks.map((chunk: any) => ({
    title: chunk.web?.title || 'Related Patent/Document',
    uri: chunk.web?.uri || '#',
    snippet: chunk.web?.title || 'Snippet unavailable',
    relevance: 'Medium'
  }));
};

export const performPublicSearch = async (query: string): Promise<PublicSearchResult> => {
  const prompt = `You are a Senior Patent Examiner. A user has submitted this invention idea: "${query}".
  
  Task:
  1. Use Google Search to find existing products, patents, or research that might be considered prior art.
  2. Provide a 'noveltyEstimate' (High, Medium, or Low). 'High' means it seems unique. 'Low' means it exists.
  3. Provide 3-4 strategic 'advice' points. If it exists, advise on how to pivot. If it's novel, advise on what specific technical details to document for the claims.
  
  Return the response in JSON format.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          advice: { type: Type.ARRAY, items: { type: Type.STRING } },
          noveltyEstimate: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
        },
        required: ["advice", "noveltyEstimate"]
      }
    },
  });

  const json = JSON.parse(response.text || '{}');
  
  // Extract grounding chunks for "Existing Patents"
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const existingPatents: PriorArtItem[] = chunks.slice(0, 5).map((chunk: any) => ({
    title: chunk.web?.title || 'Related Document',
    uri: chunk.web?.uri || '#',
    snippet: 'Source found via Google Search', 
    relevance: 'High'
  }));

  return {
    existingPatents,
    advice: json.advice || ["Document specific technical mechanisms.", "Conduct a deeper legal search."],
    noveltyEstimate: json.noveltyEstimate || "Pending"
  };
};

export const draftPatent = async (invention: InventionProfile): Promise<PatentDraft> => {
  const prompt = `Draft a formal patent for: ${invention.title}. Summary: ${invention.summary}.
  Provide Abstract, 5 Claims, Description, and Legal Flags for compliance.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          abstract: { type: Type.STRING },
          claims: { type: Type.ARRAY, items: { type: Type.STRING } },
          description: { type: Type.STRING },
          legalFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["abstract", "claims", "description", "legalFlags"]
      },
    },
  });

  const data = JSON.parse(response.text || '{}');
  // Return a full structured PatentDraft object mapping from AI output
  return {
    abstract: data.abstract || '',
    description: data.description || '',
    legalFlags: data.legalFlags || [],
    id: `DFT-${Date.now()}`,
    claims: (data.claims || []).map((c: string, i: number) => ({
      id: `C-${i}`,
      type: 'Independent',
      content: c,
      version: 1,
      lastModifiedBy: 'AI Engine'
    })),
    figures: [],
    status: 'Draft',
    version: 1
  };
};

export const chatWithAdvisor = async (history: { role: string, message: string }[], userQuery: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are an expert Patent Attorney and IP Advisor. Provide precise, legally aware guidance.',
    }
  });
  // Use .text property directly from the response of chat.sendMessage
  const result = await chat.sendMessage({ message: userQuery });
  return result.text;
};
