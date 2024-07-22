import { useState } from 'react'
import FileUploader from './components/FileUploader'
import ImageDisplay from './components/ImageDisplay'
import { decodeGLB, encodeGLB, replaceTexture } from './gltf'
import './App.css'

function App() {
  const [extractedImage, setExtractedImage] = useState<string | null>(null)
  const [originalGLB, setOriginalGLB] = useState<ArrayBuffer | null>(null)
  const [scale, setScale] = useState(1)

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => setScale(parseFloat(event.target.value))

  const handleRegenerateGLB = async () => {
    if (!originalGLB || !extractedImage) return

    try {
      // 画像要素を作成し、縮小された画像を描画
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = extractedImage
      })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Failed to get 2D context')

      canvas.width = img.width * scale
      canvas.height = img.height * scale
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // GLBファイルを解析
      const gltf = await decodeGLB(new Uint8Array(originalGLB))

      // 新しいテクスチャ
      const newTextureData = new Uint8Array(await new Promise<ArrayBuffer>(
        resolve => canvas.toBlob((blob) => blob?.arrayBuffer().then(resolve), 'image/jpeg')
      ))

      // GLB ファイルを再生成
      const newGlb = await encodeGLB(replaceTexture(gltf, newTextureData))

      // ダウンロードリンクを作成
      const url = URL.createObjectURL(new Blob([newGlb], { type: 'model/gltf-binary' }))

      const a = document.createElement('a')
      a.href = url
      a.download = 'updated.glb'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error regenerating GLB file:', error)
      alert('Error regenerating GLB file')
    }
  }

  return (
    <div className="app">
      <h1>GLB Image Extractor</h1>
      <FileUploader setExtractedImage={setExtractedImage} setOriginalGLB={setOriginalGLB} />
      {extractedImage && (
        <>
          <ImageDisplay imageData={extractedImage} scale={scale} />

          <div className="mb-3">
            <label htmlFor="scaleRange" className="form-label">縮小率: {scale.toFixed(2)}</label>
            <input
              type="range"
              className="form-range"
              id="scaleRange"
              min="0.1"
              max="1"
              step="0.01"
              value={scale}
              onChange={handleScaleChange}
            />
          </div>

          <button onClick={handleRegenerateGLB}>GLBファイルを再生成</button>
        </>
      )}
    </div>
  )
}

export default App
