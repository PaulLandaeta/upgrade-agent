import { create } from "zustand";

interface ProjectState {
  projectPath: string;
  setProjectPath: (path: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projectPath: "",
  setProjectPath: (path) => set({ projectPath: path }),
}));
