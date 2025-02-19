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
  PDR: '#3C7F50',
  AWAKE: '#EC3013',
  INTERICTAL: '#F9D62E',
  EPISODE_EPILEPTIC: '#B22578',
  EPISODE_OTHER: '#0000F9',
  EYE_BLINKING: '#377DFA',
} as const

export const STATE_TYPES = ['SLEEP', 'PHOTIC_STIMULATION', 'HYPERVENTILATION'] as const

export const STATE_TYPES_LABELS: Record<string, string> = {
  SLEEP: 'Sleep',
  PHOTIC_STIMULATION: 'Photic stimulation',
  HYPERVENTILATION: 'Hyperventilation',
}
