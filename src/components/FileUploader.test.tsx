import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import FileUploader from './FileUploader'
import { decodeGLB, getTextureGLTF } from '../gltf'

vi.mock('../gltf', () => ({
  decodeGLB: vi.fn(),
  getTextureGLTF: vi.fn(),
}))

const glbBytes = new Uint8Array([0x67, 0x6c, 0x54, 0x46, 1, 2, 3, 4])

const upload = (input: HTMLElement) => {
  const file = new File([glbBytes], 'model.glb', { type: 'model/gltf-binary' })
  fireEvent.change(input, { target: { files: [file] } })
}

const setup = () => {
  const setExtractedImage = vi.fn()
  const setOriginalGLB = vi.fn()
  const { container } = render(
    <FileUploader setExtractedImage={setExtractedImage} setOriginalGLB={setOriginalGLB} />,
  )
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
  return { input, setExtractedImage, setOriginalGLB }
}

describe('FileUploader', () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:extracted')
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it('GLB ファイルだけを選べる', () => {
    const { input } = setup()

    expect(input.accept).toBe('.glb')
  })

  it('テクスチャを取り出して、元の GLB と画像の URL を渡す', async () => {
    const gltf = { images: [{}] }
    vi.mocked(decodeGLB).mockResolvedValue(gltf)
    vi.mocked(getTextureGLTF).mockResolvedValue(new Uint8Array([0xff, 0xd8, 0xff]))
    const { input, setExtractedImage, setOriginalGLB } = setup()

    upload(input)

    await waitFor(() => expect(setExtractedImage).toHaveBeenCalledWith('blob:extracted'))
    expect(new Uint8Array(setOriginalGLB.mock.calls[0][0])).toEqual(glbBytes)
    expect(decodeGLB).toHaveBeenCalledWith(glbBytes)
    expect(getTextureGLTF).toHaveBeenCalledWith(gltf)
    expect(vi.mocked(URL.createObjectURL).mock.calls[0][0]).toBeInstanceOf(Blob)
    expect((vi.mocked(URL.createObjectURL).mock.calls[0][0] as Blob).type).toBe('image/jpeg')
    expect(window.alert).not.toHaveBeenCalled()
  })

  it('処理中は入力を無効にし、終わったら戻す', async () => {
    let resolveDecode: (value: unknown) => void = () => {}
    vi.mocked(decodeGLB).mockReturnValue(new Promise(resolve => { resolveDecode = resolve }))
    vi.mocked(getTextureGLTF).mockResolvedValue(new Uint8Array([0xff]))
    const { input } = setup()

    upload(input)

    expect(await screen.findByText('Processing...')).toBeTruthy()
    expect(input.disabled).toBe(true)

    resolveDecode({})

    await waitFor(() => expect(screen.queryByText('Processing...')).toBeNull())
    expect(input.disabled).toBe(false)
  })

  it('テクスチャがなければ知らせる', async () => {
    vi.mocked(decodeGLB).mockResolvedValue({})
    vi.mocked(getTextureGLTF).mockResolvedValue(null)
    const { input, setExtractedImage } = setup()

    upload(input)

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('No image found in the GLB file'))
    expect(setExtractedImage).not.toHaveBeenCalled()
  })

  it('解析に失敗したら知らせる', async () => {
    vi.mocked(decodeGLB).mockRejectedValue(new Error('broken'))
    const { input, setExtractedImage } = setup()

    upload(input)

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Error processing GLB file'))
    expect(setExtractedImage).not.toHaveBeenCalled()
    expect(input.disabled).toBe(false)
  })

  it('ファイルが選ばれなければ何もしない', () => {
    const { input, setOriginalGLB } = setup()

    fireEvent.change(input, { target: { files: [] } })

    expect(setOriginalGLB).not.toHaveBeenCalled()
    expect(decodeGLB).not.toHaveBeenCalled()
  })
})
