import { create } from 'zustand'

type Timeline = {
  position: number
  interval: number
  updatePosition: (position: number) => void
}

export const useTimelineStore = create<Timeline>((set) => ({
  position: 0,
  interval: 10,
  updatePosition(position: number) {
    set((state) => ({
      position: position,
    }))
  },
}))
