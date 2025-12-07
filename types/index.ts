export interface CardMetroType {
  logo: string
  nameZh: string
  nameEn: string
  lineName: string
  stationId: number
  subway: string
}

export interface LineItem {
  name: string
  color: string
  stations: number[]
}

export interface StationItem {
  id: number
  name: string
  pinyin: string
  py: string
  lat: string
  lng: string
}

export interface MetroData {
  logo: string
  nameZh: string
  nameEn: string
  lineName: string
  stationId: number
  fileName: string
}

export interface MetroStaticData {
  lineList: LineItem[]
  stationList: StationItem[]
}
