import { toast } from 'react-hot-toast';

interface AskAIParams {
  question: string;
  companyId: string;
  token: string;
}

interface AIResponse {
  answer: string;
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const askAI = async ({ question, companyId, token }: AskAIParams): Promise<AIResponse> => {

  if (!API_BASE_URL) {
    toast.error("La URL del backend no está configurada. Revisa tus variables de entorno.");
    throw new Error("API URL not configured");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/ai/ask/${companyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la comunicación con la IA');
    }

    return await response.json() as AIResponse;
  } catch (error) {
    console.error("Error asking AI:", error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
    toast.error(errorMessage);
    throw error;
  }
};