import type { MetroStaticData, StationItem } from '~~/types'

// 读取 metro/data 下所有 js 文件，key 为文件名（不含扩展名），value 为对应数据
const metroDataMap: Record<string, MetroStaticData> = {}

// 同步加载 metro/data 目录下所有 js 模块
const modules = import.meta.glob('@/assets/subway/*.js', { eager: true })
for (const [path, mod] of Object.entries(modules)) {
  // 提取文件名（不含路径和扩展名）
  const filename = path.split('/').pop()?.replace('.js', '') ?? ''
  metroDataMap[filename] = (mod as { default: MetroStaticData }).default as MetroStaticData
}

export function getLineNeighbors(subway: string, lineName: string, stationId: number): StationItem[] {
  const data = metroDataMap[subway]
  if (!data) return []
  const line = data.lineList.find(l => l.name === lineName)
  if (!line) return []
  const idx = line.stations.indexOf(stationId)
  if (idx < 0) return []
  const start = Math.max(0, idx - 2)
  const end = Math.min(line.stations.length - 1, idx + 2)
  const ids = line.stations.slice(start, end + 1)
  const map = new Map<number, StationItem>(data.stationList.map(s => [s.id, s]))
  return ids.map(id => map.get(id)!).filter((s): s is StationItem => !!s)
}

// 生成文件名中的日期戳，格式为：YYYY-MM-DD_HHMMSS_RND
export function filenameDateStamp(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  const rnd = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
  return `${y}-${m}-${d}_${hh}${mm}${ss}_${rnd}`
}
