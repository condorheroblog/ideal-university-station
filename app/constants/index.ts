export const PRESET_THEMES = {
  c1: { screen: '#0B3B9B', card: { bg: '#FFFFFF', text: '#1A41A1', external: '#FFFFFF' } },
  c2: { screen: '#4B6548', card: { bg: '#F3CB9D', text: '#4A5F41', external: '#F3CD9C' } },
  c3: { screen: '#6E0664', card: { bg: '#FFFFFF', text: '#6D0360', external: '#FFFFFF' } },
  c4: { screen: '#233831', card: { bg: '#F6DF39', text: '#243224', external: '#FADF39' } },
  c5: { screen: '#A82239', card: { bg: '#FFFFFF', text: '#A41F37', external: '#FFFFFF' } },
} as const

export const SOLID_PRESETS = {
  c1: PRESET_THEMES.c1.screen,
  c2: PRESET_THEMES.c2.screen,
  c3: PRESET_THEMES.c3.screen,
  c4: PRESET_THEMES.c4.screen,
  c5: PRESET_THEMES.c5.screen,
} as const
