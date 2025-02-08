export const ANNOTATION_TYPES = ['OBSERVATION', 'STATE', 'AI'] as const

export const OBSERVATION_TYPES = [
  'PDR',
  'AWAKE',
  'INTERICTAL',
  'EPISODE_EPILEPTIC',
  'EPISODE_OTHER',
  'EYE_BLINKING',
] as const

export const OBSERVATION_TYPES_LABELS: Record<string, string> = {
  PDR: 'Background - PDR',
  AWAKE: 'Background - Awake',
  INTERICTAL: 'Interictal',
  EPISODE_EPILEPTIC: 'Epileptic - episode',
  EPISODE_OTHER: 'Other - episode',
  EYE_BLINKING: 'Eye blinking',
}

export const OBSERVATION_COLORS = {
  PDR: '#92DB16',
  AWAKE: '#A6CD12',
  INTERICTAL: '#BBBF0F',
  EPISODE_EPILEPTIC: '#D1AE0A',
  EPISODE_OTHER: '#E79E06',
  EYE_BLINKING: '#FE8D02',
} as const

export const STATE_TYPES = ['SLEEP', 'PHOTIC_STIMULATION', 'HYPERVENTILATION'] as const

export const STATE_TYPES_LABELS: Record<string, string> = {
  SLEEP: 'Sleep',
  PHOTIC_STIMULATION: 'Photic stimulation',
  HYPERVENTILATION: 'Hyperventilation',
}
