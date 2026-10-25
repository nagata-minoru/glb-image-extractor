import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from './App'
import { decodeGLB, getTextureGLTF } from './gltf'
import { createTestGlb, imageSize } from './test/createTestGlb'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('App（本物のブラウザで一連の流れ）', () => {
  it('GLB から画像を取り出し、縮小したテクスチャで GLB を再生成する', async () => {
    const { glb } = await createTestGlb(64, 32)
    const { container } = render(<App />)

    // 取り出し
    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
    fireEvent.change(input, { target: { files: [new File([glb], 'model.glb')] } })
    const img = await screen.findByRole<HTMLImageElement>('img', {}, { timeout: 20000 })
    await waitFor(() => expect(img.naturalWidth).toBe(64))
    expect(img.naturalHeight).toBe(32)

    // 縮小率を 0.5 にする
    fireEvent.change(screen.getByRole('slider'), { target: { value: '0.5' } })
    expect(screen.getByText('縮小率: 0.50')).toBeTruthy()

    // ダウンロードは止めて、作られた GLB を受け取る
    const blobs: Blob[] = []
    const createObjectURL = URL.createObjectURL.bind(URL)
    vi.spyOn(URL, 'createObjectURL').mockImplementation(obj => {
      if (obj instanceof Blob) blobs.push(obj)
      return createObjectURL(obj)
    })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    fireEvent.click(screen.getByRole('button', { name: 'GLBファイルを再生成' }))

    await waitFor(() => expect(click).toHaveBeenCalled(), { timeout: 20000 })
    expect((click.mock.contexts[0] as HTMLAnchorElement).download).toBe('updated.glb')
    const newGlb = blobs.find(b => b.type === 'model/gltf-binary')!
    const texture = await getTextureGLTF(await decodeGLB(new Uint8Array(await newGlb.arrayBuffer())))
    expect(await imageSize(texture)).toEqual({ width: 32, height: 16 })
  })
})
