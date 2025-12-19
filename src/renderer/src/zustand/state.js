import { create } from 'zustand'

export const usePageStore = create((set) => ({
  page: 0,
  changePage: (page) =>
    set((state) => ({
      page: page
    }))
}))
