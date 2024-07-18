// src/components/FileUploader.tsx

import { useState } from 'react'
import { decodeGLB, getTextureGLTF } from '../gltf'

interface FileUploaderProps {
  setExtractedImage: (imageData: string) => void
}

const FileUploader: React.FC<FileUploaderProps> = ({ setExtractedImage }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const gltf = await decodeGLB(arrayBuffer)
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
