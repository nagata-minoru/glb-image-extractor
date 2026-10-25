// テスト用に、左半分が赤・右半分が青の JPEG テクスチャを貼った三角形 1 枚の GLB を作る
// gltf-pipeline はメッシュから参照されない画像を捨てるので、メッシュとマテリアルも入れる

const pad4 = (n: number) => (n + 3) & ~3

export const createJpeg = async (width: number, height: number): Promise<Uint8Array> => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#e33'
  ctx.fillRect(0, 0, width / 2, height)
  ctx.fillStyle = '#33e'
  ctx.fillRect(width / 2, 0, width / 2, height)
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/jpeg')
  })
  return new Uint8Array(await blob.arrayBuffer())
}

export const createTestGlb = async (width = 64, height = 32) => {
  const jpeg = await createJpeg(width, height)
  const positions = new Uint8Array(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]).buffer)
  const texcoords = new Uint8Array(new Float32Array([0, 0, 1, 0, 0, 1]).buffer)
  const imageOffset = positions.length + texcoords.length
  const binLength = pad4(imageOffset + jpeg.length)

  const json = new TextEncoder().encode(JSON.stringify({
    asset: { version: '2.0' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0, TEXCOORD_0: 1 }, material: 0 }] }],
    accessors: [{
      bufferView: 0, componentType: 5126, count: 3, type: 'VEC3', min: [0, 0, 0], max: [1, 1, 0],
    }, {
      bufferView: 1, componentType: 5126, count: 3, type: 'VEC2',
    }],
    buffers: [{ byteLength: binLength }],
    bufferViews: [{
      buffer: 0, byteOffset: 0, byteLength: positions.length,
    }, {
      buffer: 0, byteOffset: positions.length, byteLength: texcoords.length,
    }, {
      buffer: 0, byteOffset: imageOffset, byteLength: jpeg.length,
    }],
    images: [{ bufferView: 2, mimeType: 'image/jpeg' }],
    textures: [{ source: 0 }],
    materials: [{ pbrMetallicRoughness: { baseColorTexture: { index: 0 } } }],
  }))
  const jsonLength = pad4(json.length)

  const total = 12 + 8 + jsonLength + 8 + binLength
  const glb = new ArrayBuffer(total)
  const view = new DataView(glb)
  const bytes = new Uint8Array(glb)
  // ヘッダー: magic "glTF"、バージョン 2、全体の長さ
  view.setUint32(0, 0x46546c67, true)
  view.setUint32(4, 2, true)
  view.setUint32(8, total, true)
  // JSON チャンク（余りは空白で埋める）
  view.setUint32(12, jsonLength, true)
  view.setUint32(16, 0x4e4f534a, true)
  bytes.fill(0x20, 20, 20 + jsonLength)
  bytes.set(json, 20)
  // BIN チャンク
  const binStart = 20 + jsonLength
  view.setUint32(binStart, binLength, true)
  view.setUint32(binStart + 4, 0x004e4942, true)
  bytes.set(positions, binStart + 8)
  bytes.set(texcoords, binStart + 8 + positions.length)
  bytes.set(jpeg, binStart + 8 + imageOffset)

  return { glb, jpeg }
}

export const imageSize = async (jpeg: Uint8Array) => {
  const bitmap = await createImageBitmap(new Blob([jpeg as Uint8Array<ArrayBuffer>], { type: 'image/jpeg' }))
  return { width: bitmap.width, height: bitmap.height }
}
