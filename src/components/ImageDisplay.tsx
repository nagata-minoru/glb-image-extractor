interface ImageDisplayProps {
  imageData: string
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageData }) => {
  return (
    <div className="image-display">
      <h2>Extracted Image</h2>
      <img src={imageData} alt="Extracted from GLB" />
    </div>
  )
}

export default ImageDisplay
