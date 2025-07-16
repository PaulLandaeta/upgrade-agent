import { create } from 'zustand'

type MigrationStore = {
  projectName: string
  setProjectName: (name: string) => void
}

export const useMigrationStore = create<MigrationStore>((set) => ({
  projectName: '',
  setProjectName: (name) => set({ projectName: name }),
}))
