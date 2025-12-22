import { create } from 'zustand'

export const usePageStore = create((set) => ({
  page: 0,
  changePage: (page) =>
    set((state) => ({
      page: page
    }))
}))

export const useSensorStore = create((set) => ({
  temp: 0,
  humid: 0,
  timeStr: '',
  image: '',
  changeTemp: (temp) =>
    set((state) => ({
      temp: temp
    })),
  changeHumid: (humid) =>
    set((state) => ({
      humid: humid
    })),
  changeTimeStr: (timeStr) =>
    set((state) => ({
      timeStr: timeStr
    })),
  changeImage: (image) =>
    set((state) => ({
      image: image
    }))
}))
