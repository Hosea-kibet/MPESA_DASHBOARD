import type { StateCreator } from "zustand"

export interface UIState {
  sidebarOpen: boolean
  searchQuery: string
  isLoading: boolean
  setSidebarOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setIsLoading: (loading: boolean) => void
}

export const createUIStore: StateCreator<UIState> = (set) => ({
  sidebarOpen: false,
  searchQuery: "",
  isLoading: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsLoading: (loading) => set({ isLoading: loading }),
})
