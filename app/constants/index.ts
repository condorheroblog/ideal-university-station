export const PRESET_THEMES = {
  // Hand-Drawn Sketchnote，screen备选 #D46B08 1B513F 8C6F9A 2D4A7A
  c1: { screen: '#D46B08', card: { bg: '#FBE188', text: '#291410', external: '#FBE188' } },
  c2: { screen: '#0B3B9B', card: { bg: '#FFFFFF', text: '#1A41A1', external: '#FFFFFF' } },
  c3: { screen: '#4B6548', card: { bg: '#F3CB9D', text: '#4A5F41', external: '#F3CD9C' } },
  c4: { screen: '#6E0664', card: { bg: '#FFFFFF', text: '#6D0360', external: '#FFFFFF' } },
  c5: { screen: '#233831', card: { bg: '#F6DF39', text: '#243224', external: '#FADF39' } },
  c6: { screen: '#A82239', card: { bg: '#FFFFFF', text: '#A41F37', external: '#FFFFFF' } },
  // iOS 26 液态玻璃效果
  c7: { screen: '#FF5E5E', card: { bg: '#FFECEC', text: '#D80000', external: '#FFECEC' } },
  c8: { screen: '#00D2FF', card: { bg: '#E6F9FF', text: '#007A94', external: '#E6F9FF' } },
  c9: { screen: '#2E7D32', card: { bg: '#E6FFE6', text: '#2E7D32', external: '#E6FFE6' } },
  c10: { screen: '#FF9F1C', card: { bg: '#FFF4E6', text: '#E65100', external: '#FFF4E6' } },
  c11: { screen: '#B967FF', card: { bg: '#F3E5FF', text: '#6A1B9A', external: '#F3E5FF' } },
} as const

export const SOLID_PRESETS = {
  c1: PRESET_THEMES.c1.screen,
  c2: PRESET_THEMES.c2.screen,
  c3: PRESET_THEMES.c3.screen,
  c4: PRESET_THEMES.c4.screen,
  c5: PRESET_THEMES.c5.screen,
  c6: PRESET_THEMES.c6.screen,
  c7: PRESET_THEMES.c7.screen,
  c8: PRESET_THEMES.c8.screen,
  c9: PRESET_THEMES.c9.screen,
  c10: PRESET_THEMES.c10.screen,
  c11: PRESET_THEMES.c11.screen,
} as const

export type DeviceId
  = | 'iphone11'
    | 'iphone12'
    | 'iphone13'
    | 'iphone14'
    | 'iphone15'
    | 'iphone16'
    | 'iphone17'
    | 'ipadPro12_9'
    | 'desktop1080p'
export interface DeviceConfig {
  label: string
  year: number
  resolution: { width: number, height: number }
  logical: { width: number, height: number }
  kind: 'iphone' | 'ipad' | 'desktop'
}
export const DEVICE_CONFIGS: Record<DeviceId, DeviceConfig> = {
  // https://www.ios-resolution.com/
  iphone11: { label: 'iPhone 11', year: 2019, resolution: { width: 828, height: 1792 }, logical: { width: 414, height: 896 }, kind: 'iphone' },
  iphone12: { label: 'iPhone 12', year: 2020, resolution: { width: 1170, height: 2532 }, logical: { width: 390, height: 844 }, kind: 'iphone' },
  iphone13: { label: 'iPhone 13', year: 2021, resolution: { width: 1170, height: 2532 }, logical: { width: 390, height: 844 }, kind: 'iphone' },
  iphone14: { label: 'iPhone 14', year: 2022, resolution: { width: 1170, height: 2532 }, logical: { width: 390, height: 844 }, kind: 'iphone' },
  iphone15: { label: 'iPhone 15', year: 2023, resolution: { width: 1179, height: 2556 }, logical: { width: 393, height: 852 }, kind: 'iphone' },
  iphone16: { label: 'iPhone 16', year: 2024, resolution: { width: 1179, height: 2556 }, logical: { width: 393, height: 852 }, kind: 'iphone' },
  iphone17: { label: 'iPhone 17', year: 2025, resolution: { width: 1206, height: 2622 }, logical: { width: 402, height: 874 }, kind: 'iphone' },
  // https://github.com/DevYeom/apple-wiki
  ipadPro12_9: { label: 'iPad 10.9', year: 2022, resolution: { width: 2360, height: 1640 }, logical: { width: 1180, height: 820 }, kind: 'ipad' },
  desktop1080p: { label: 'Desktop 1080p', year: 2023, resolution: { width: 3024, height: 1964 }, logical: { width: 1512, height: 982 }, kind: 'desktop' },
} as const
export const DEVICE_OPTIONS = Object.entries(DEVICE_CONFIGS)
  .map(([id, cfg]) => ({ id: id as DeviceId, label: cfg.label, year: cfg.year }))
  .sort((a, b) => b.year - a.year)
