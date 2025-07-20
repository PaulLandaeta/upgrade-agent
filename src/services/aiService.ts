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

export interface MigrationFile {
  filePath: string;
  fileName: string;
  fileType: string;
  content: string;
}
interface AiMigrationFrameworkSuggestionRequest {
  projectPath: string;
  projectSource?: { type: 'upload' | 'git', path?: string, gitUrl?: string } | null;
}
export interface AiMigrationFrameworkSuggestionResponse {
  projectStructure: string;
  fileList: MigrationFile[];
  migrationNotes?: string;
  dependencies?: string[];
}

export async function getAiMigrationFrameworkSuggestion(
  data: AiMigrationFrameworkSuggestionRequest
): Promise<AiMigrationFrameworkSuggestionResponse> {
  // Use longer timeout for AI migration analysis (20 seconds)
  const response = await apiInstance.post("/ai/framework-migration", data, {
    timeout: 20000, // 20 seconds
  });
  return response.data;
}
