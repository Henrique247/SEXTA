import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getTriageSuggestion(symptoms: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Você é um assistente de triagem médica inteligente para o sistema KudiMed em Angola. 
    Baseado nos sintomas fornecidos pelo paciente, sugira a especialidade médica correta e o nível de urgência (Protocolo de Manchester: Vermelho, Laranja, Amarelo, Verde, Azul).
    
    Sintomas: "${symptoms}"
    
    Responda em formato JSON:
    {
      "specialty": "Nome da Especialidade",
      "urgency": "Nível de Urgência",
      "color": "Código de Cor (hex)",
      "explanation": "Breve explicação do porquê desta triagem"
    }`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}
