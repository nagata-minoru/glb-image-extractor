import { describe, expect, it } from 'vitest'
import { decodeGLB, encodeGLB, getTextureGLTF, replaceTexture } from './gltf'
import { createJpeg, createTestGlb, imageSize } from './test/createTestGlb'

describe('gltf（外部ライブラリを使う）', () => {
  it('GLB から JPEG テクスチャをそのまま取り出す', async () => {
    const { glb, jpeg } = await createTestGlb()

    const gltf = await decodeGLB(new Uint8Array(glb))
    const texture = await getTextureGLTF(gltf)

    expect(texture).toEqual(jpeg)
  })

  it('テクスチャがない GLB では null を返す', async () => {
    const { glb } = await createTestGlb()
    const gltf = await decodeGLB(new Uint8Array(glb))
    gltf.images = []

    expect(await getTextureGLTF(gltf)).toBeNull()
  })

  it('テクスチャを差し替えて GLB を作り直せる', async () => {
    const { glb } = await createTestGlb(64, 32)
    const newJpeg = await createJpeg(16, 8)

    const gltf = replaceTexture(await decodeGLB(new Uint8Array(glb)), newJpeg)
    const newGlb = await encodeGLB(gltf)
    const texture = await getTextureGLTF(await decodeGLB(new Uint8Array(newGlb)))

    expect(texture).toEqual(newJpeg)
    expect(await imageSize(texture)).toEqual({ width: 16, height: 8 })
  })
})
