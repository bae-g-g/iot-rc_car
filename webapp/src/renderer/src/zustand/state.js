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
  gyro: { x: 0, y: 0, z: 0 },
  ultrasonic: 0,
  timeStr: '',
  image: '',
  imageLock: false,
  changeTemp: (temp) =>
    set((state) => ({
      temp: temp
    })),
  changeHumid: (humid) =>
    set((state) => ({
      humid: humid
    })),
  changeGyro: (gyro) =>
    set((state) => ({
      gyro: gyro
    })),
  changeUltrasonic: (ultrasonic) =>
    set((state) => ({
      ultrasonic: ultrasonic
    })),
  changeTimeStr: (timeStr) =>
    set((state) => ({
      timeStr: timeStr
    })),
  changeImage: (image) =>
    set((state) => ({
      image: image
    })),
  changeImageLock: (imageLock) =>
    set((state) => ({
      imageLock: imageLock
    }))
}))
