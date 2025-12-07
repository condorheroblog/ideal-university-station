export const PRESET_THEMES = {
  // Hand-Drawn Sketchnote
  c1: { screen: '#eb2f96', card: { bg: '#FBE188', text: '#291410', external: '#F7A56E' } },
  c2: { screen: '#0B3B9B', card: { bg: '#FFFFFF', text: '#1A41A1', external: '#FFFFFF' } },
  c3: { screen: '#4B6548', card: { bg: '#F3CB9D', text: '#4A5F41', external: '#F3CD9C' } },
  c4: { screen: '#6E0664', card: { bg: '#FFFFFF', text: '#6D0360', external: '#FFFFFF' } },
  c5: { screen: '#233831', card: { bg: '#F6DF39', text: '#243224', external: '#FADF39' } },
  c6: { screen: '#A82239', card: { bg: '#FFFFFF', text: '#A41F37', external: '#FFFFFF' } },
} as const

export const SOLID_PRESETS = {
  c1: PRESET_THEMES.c1.screen,
  c2: PRESET_THEMES.c2.screen,
  c3: PRESET_THEMES.c3.screen,
  c4: PRESET_THEMES.c4.screen,
  c5: PRESET_THEMES.c5.screen,
  c6: PRESET_THEMES.c6.screen,
} as const

export type DeviceId = 'iphone11' | 'iphone12' | 'iphone13' | 'iphone14' | 'iphone15' | 'iphone16' | 'iphone17'
export interface DeviceConfig {
  label: string
  year: number
  resolution: { width: number, height: number }
  logical: { width: number, height: number }
}
export const DEVICE_CONFIGS: Record<DeviceId, DeviceConfig> = {
  iphone11: { label: 'iPhone 11', year: 2019, resolution: { width: 828, height: 1792 }, logical: { width: 414, height: 896 } },
  iphone12: { label: 'iPhone 12', year: 2020, resolution: { width: 1170, height: 2532 }, logical: { width: 390, height: 844 } },
  iphone13: { label: 'iPhone 13', year: 2021, resolution: { width: 1170, height: 2532 }, logical: { width: 390, height: 844 } },
  iphone14: { label: 'iPhone 14', year: 2022, resolution: { width: 1170, height: 2532 }, logical: { width: 390, height: 844 } },
  iphone15: { label: 'iPhone 15', year: 2023, resolution: { width: 1179, height: 2556 }, logical: { width: 393, height: 852 } },
  iphone16: { label: 'iPhone 16', year: 2024, resolution: { width: 1179, height: 2556 }, logical: { width: 393, height: 852 } },
  iphone17: { label: 'iPhone 17', year: 2025, resolution: { width: 1206, height: 2622 }, logical: { width: 402, height: 874 } },
} as const
export const DEVICE_OPTIONS = Object.entries(DEVICE_CONFIGS)
  .map(([id, cfg]) => ({ id: id as DeviceId, label: cfg.label, year: cfg.year }))
  .sort((a, b) => b.year - a.year)
