import apiInstance from "./apiInstance";

interface AiSuggestionRequest {
  fileName: string;
  code: string;
  warning: string;
  prompt?: string;
}

interface AiSuggestionResponse {
  codeUpdated: string;
  explanation?: string;
  suggestedPrompt?: string;
}

export async function getAISuggestion(
  data: AiSuggestionRequest
): Promise<AiSuggestionResponse> {
  const response = await apiInstance.post("/ai/suggest", data);
  return response.data;
}
