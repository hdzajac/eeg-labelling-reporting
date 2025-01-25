export const ANNOTATION_TYPES = [
  'PDR',
  'AWAKE',
  'INTERICTAL',
  'EPISODE_EPILEPTIC',
  'EPISODE_OTHER',
  'EYE_BLINKING',
]

export const ANNOTATION_TYPES_LABELS: Record<string, string> = {
  PDR: 'Background - PDR',
  AWAKE: 'Background - Awake',
  INTERICTAL: 'Interictal',
  EPISODE_EPILEPTIC: 'Epileptic - episode',
  EPISODE_OTHER: 'Other - episode',
  EYE_BLINKING: 'Eye blinking',
}
