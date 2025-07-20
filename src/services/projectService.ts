import apiInstance from "./apiInstance";
import type { MigrationFile } from "./aiService";

export async function fetchFileCode(
  path: string,
  fileName: string
): Promise<string> {
  const res = await apiInstance.get("/project/file", {
    params: { path, file: fileName },
  });
  return res.data.code;
}

export async function applySuggestion(
  filePath: string,
  codeUpdated: string
): Promise<{ message: string; backup: string }> {
  const res = await apiInstance.post("/project/apply-suggestion", {
    filePath,
    codeUpdated,
  });
  return res.data;
}

export async function uploadProject(file: File): Promise<{
  message: string;
  projectPath: string;
}> {
  const formData = new FormData();
  formData.append("project", file);

  const res = await apiInstance.post("/project/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

export interface ProjectInfo {
  version: string;
  dependencies: Record<string, string>;
}

export async function getProjectInfo(path: string): Promise<ProjectInfo> {
  const res = await apiInstance.get("/project/info", {
    params: { path },
  });
  return res.data;
}

export async function auditDependencies(path: string) {
  const res = await apiInstance.post("/project/audit", { path });
  return res.data;
}

export async function getAuditSuggestion(data: any) {
  const res = await apiInstance.post("/ai/audit-suggestion", data);
  return res.data;
}

export async function createProject(
  fileList: MigrationFile[],
  projectName: string
): Promise<{ message: string; backup: string }> {
  const res = await apiInstance.post("/project/create-project", {
    projectName,
    fileList
  });
  return res.data;
}