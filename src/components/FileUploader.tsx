// src/components/FileUploader.tsx

import { useState } from 'react'
import { decodeGLB, getTextureGLTF } from '../gltf'

interface FileUploaderProps {
  setExtractedImage: (imageData: string) => void
  setOriginalGLB: (glb: ArrayBuffer) => void
}

const FileUploader: React.FC<FileUploaderProps> = ({ setExtractedImage, setOriginalGLB }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)

    try {
      const arrayBuffer = await file.arrayBuffer()
      setOriginalGLB(arrayBuffer) // 元のGLBデータを保存
      const uint8Array = new Uint8Array(arrayBuffer)
      const gltf = await decodeGLB(uint8Array)
      const imageData = await getTextureGLTF(gltf)

      if (imageData) {
        const blob = new Blob([imageData], { type: 'image/jpeg' })
        const imageUrl = URL.createObjectURL(blob)
        setExtractedImage(imageUrl)
      } else {
        alert('No image found in the GLB file')
      }
    } catch (error) {
      console.error('Error processing GLB file:', error)
      alert('Error processing GLB file')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="file-uploader">
      <input type="file" accept=".glb" onChange={handleFileUpload} disabled={isLoading} />
      {isLoading && <p>Processing...</p>}
    </div>
  )
}

export default FileUploader
