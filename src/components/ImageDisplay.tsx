// src/components/ImageDisplay.tsx

interface ImageDisplayProps {
  imageData: string
  scale: number
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageData, scale }) => {
  return (
    <div className="image-display">
      <h2>Extracted Image</h2>
      <img
        src={imageData}
        alt="Extracted from GLB"
        style={{
          width: `${scale * 100}%`,
          height: `${scale * 100}%`,
        }}
      />
    </div>
  )
}

export default ImageDisplay
