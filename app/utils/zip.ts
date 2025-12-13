function crc32(buf: Uint8Array): number {
  let c = 0xffffffff
  for (const b of buf) {
    c ^= b
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xEDB88320 & -(c & 1))
    }
  }
  return (c ^ 0xffffffff) >>> 0
}

function le32(n: number) {
  const a = new Uint8Array(4)
  const v = new DataView(a.buffer)
  v.setUint32(0, n, true)
  return a
}

function le16(n: number) {
  const a = new Uint8Array(2)
  const v = new DataView(a.buffer)
  v.setUint16(0, n, true)
  return a
}

export async function createZip(files: Array<{ name: string, blob: Blob }>): Promise<Blob> {
  const localParts: Uint8Array[] = []
  const centralParts: Uint8Array[] = []
  let offset = 0
  const encoder = new TextEncoder()
  for (const f of files) {
    const data = new Uint8Array(await f.blob.arrayBuffer())
    const nameBytes = encoder.encode(f.name)
    const crc = crc32(data)

    localParts.push(encoder.encode('PK\x03\x04'))
    localParts.push(le16(20))
    localParts.push(le16(0))
    localParts.push(le16(0))
    localParts.push(le16(0))
    localParts.push(le16(0))
    localParts.push(le32(crc))
    localParts.push(le32(data.length))
    localParts.push(le32(data.length))
    localParts.push(le16(nameBytes.length))
    localParts.push(le16(0))
    localParts.push(nameBytes)
    localParts.push(data)

    centralParts.push(encoder.encode('PK\x01\x02'))
    centralParts.push(le16(20))
    centralParts.push(le16(20))
    centralParts.push(le16(0))
    centralParts.push(le16(0))
    centralParts.push(le16(0))
    centralParts.push(le32(crc))
    centralParts.push(le32(data.length))
    centralParts.push(le32(data.length))
    centralParts.push(le16(nameBytes.length))
    centralParts.push(le16(0))
    centralParts.push(le16(0))
    centralParts.push(le16(0))
    centralParts.push(le16(0))
    centralParts.push(le32(0))
    centralParts.push(le32(offset))
    centralParts.push(nameBytes)

    offset += 30 + nameBytes.length + data.length
  }
  const endSig = new TextEncoder().encode('PK\x05\x06')
  const centralSize = centralParts.reduce((n, p) => n + p.length, 0)
  const localSize = localParts.reduce((n, p) => n + p.length, 0)
  const endParts = [
    endSig,
    le16(files.length),
    le16(files.length),
    le32(centralSize),
    le32(localSize),
    le16(0),
  ]
  const all = [...localParts, ...centralParts, ...endParts]
  const total = all.reduce((n, p) => n + p.length, 0)
  const out = new Uint8Array(total)
  let cur = 0
  for (const p of all) {
    out.set(p, cur)
    cur += p.length
  }
  return new Blob([out], { type: 'application/zip' })
}

