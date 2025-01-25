import systemPrompt from '@/prompt-generators/helpers/system-prompt'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Flags = {
  // Prompt
  usePatientData: boolean
  model: 'gpt-4o-mini' | 'gpt-4o'
  temperature: 1
  systemPrompt: string
  // UI
  streamData: boolean
}

export const defaultFlags: Flags = {
  // Prompt
  usePatientData: true,
  model: 'gpt-4o-mini',
  temperature: 1,
  systemPrompt,
  // UI
  streamData: true,
}

type FeatureFlagState = {
  flags: Flags
  update: (flags: Flags) => void
  reset: () => void
}

export const useFlags = create<FeatureFlagState>()(
  persist(
    (set, get) => ({
      flags: defaultFlags,
      update: (flags: Flags) => {
        set({ flags })
      },
      reset: () => {
        set({ flags: defaultFlags })
      },
    }),
    {
      name: 'feature-flags', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
    }
  )
)
