import { useState } from 'react'
import FileUploader from './components/FileUploader'
import ImageDisplay from './components/ImageDisplay'
import './App.css'

function App() {
  const [extractedImage, setExtractedImage] = useState<string | null>(null)

  return (
    <div className="app">
      <h1>GLB Image Extractor</h1>
      <FileUploader setExtractedImage={setExtractedImage} />
      {extractedImage && <ImageDisplay imageData={extractedImage} />}
    </div>
  )
}

export default App
