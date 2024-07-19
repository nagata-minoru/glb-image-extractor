import { useState } from 'react'
import FileUploader from './components/FileUploader'
import ImageDisplay from './components/ImageDisplay'
import './App.css'

function App() {
  const [extractedImage, setExtractedImage] = useState<string | null>(null)
  const [scale, setScale] = useState(1)

  const handleScaleDown = () => {
    setScale(prevScale => Math.max(0.1, prevScale - 0.1))
  }

  return (
    <div className="app">
      <h1>GLB Image Extractor</h1>
      <FileUploader setExtractedImage={setExtractedImage} />
      {extractedImage && (
        <>
          <ImageDisplay imageData={extractedImage} scale={scale} />
          <button onClick={handleScaleDown}>縮小</button>
        </>
      )}
    </div>
  )
}

export default App
