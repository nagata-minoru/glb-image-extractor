import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import App from './App'
import { decodeGLB, getTextureGLTF } from './gltf'

vi.mock('./gltf', () => ({
  decodeGLB: vi.fn(),
  getTextureGLTF: vi.fn(),
  encodeGLB: vi.fn(),
  replaceTexture: vi.fn(),
}))

const uploadGlb = async (container: HTMLElement) => {
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
  const file = new File([new Uint8Array([1, 2, 3])], 'model.glb')
  fireEvent.change(input, { target: { files: [file] } })
  await screen.findByRole('img')
}

describe('App', () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:extracted')
    vi.mocked(decodeGLB).mockResolvedValue({})
    vi.mocked(getTextureGLTF).mockResolvedValue(new Uint8Array([0xff, 0xd8, 0xff]))
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('最初はファイル選択だけを表示する', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'GLB Image Extractor' })).toBeTruthy()
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.queryByRole('slider')).toBeNull()
    expect(screen.queryByRole('button', { name: 'GLBファイルを再生成' })).toBeNull()
  })

  it('画像を取り出すと、縮小率と再生成ボタンを表示する', async () => {
    const { container } = render(<App />)

    await uploadGlb(container)

    expect(screen.getByRole('img').getAttribute('src')).toBe('blob:extracted')
    expect(screen.getByText('縮小率: 1.00')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'GLBファイルを再生成' })).toBeTruthy()
  })

  it('縮小率を変えると、表示と画像の大きさが変わる', async () => {
    const { container } = render(<App />)
    await uploadGlb(container)

    fireEvent.change(screen.getByRole('slider'), { target: { value: '0.5' } })

    expect(screen.getByText('縮小率: 0.50')).toBeTruthy()
    expect(screen.getByRole('img').style.width).toBe('50%')
  })
})
