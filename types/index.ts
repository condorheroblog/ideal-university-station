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
  subway: string
}

export interface MetroStaticData {
  lineList: LineItem[]
  stationList: StationItem[]
}

export interface UniversityCardJSON {
  metro: MetroData
  headerExternal: { title: string, subtitle: string, icon: string }
  nextStation: { titleZh: string, titleEn: string, stationZh: string, stationEn: string }
  university: {
    logo: string
    nameZh: string
    nameEn: string
    motto: { cnLines: string[], enLines: string[] }
  }
}
