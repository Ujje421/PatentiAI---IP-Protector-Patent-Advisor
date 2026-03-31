
import { GoogleGenAI, Type } from "@google/genai";
import { InventionProfile, PatentDraft, Claim } from "../../types";

// Always use process.env.API_KEY directly when initializing the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Validates legal terminology and claim structure for USPTO compliance.
 */
export const verifyLegalLanguage = async (claims: Claim[]): Promise<string[]> => {
  const claimsText = claims.map(c => `${c.type}: ${c.content}`).join('\n');
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Review the following patent claims for USPTO compliance, structural errors, and lack of antecedent basis: \n${claimsText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          flags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of legal issues found in the text."
          }
        },
        required: ["flags"]
      }
    }
  });
  // Use the .text property to access the result string
  return JSON.parse(response.text || '{"flags": []}').flags;
};

/**
 * Generates structured patent drafts with specific claim hierarchy.
 */
export const generateDraft = async (invention: InventionProfile): Promise<Partial<PatentDraft>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a full patent draft for the following invention: ${invention.description}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          abstract: { type: Type.STRING },
          description: { type: Type.STRING },
          claims: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["Independent", "Dependent"] },
                content: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  // Use the .text property to access the result string
  const data = JSON.parse(response.text || '{}');
  return {
    abstract: data.abstract,
    description: data.description,
    claims: (data.claims || []).map((c: any, i: number) => ({
      id: `claim-${i}`,
      type: c.type,
      content: c.content,
      version: 1,
      lastModifiedBy: "AI Engine"
    }))
  };
};
