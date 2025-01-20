import React, { useEffect, useState } from 'react'
import { fetchImages } from './services/imageService'
import './styles/ImageCarousel.scss'

const ImageCarousel = React.lazy(() => import('./components/ImageCarousel'))

interface Image {
  id: string
  url: string
  salt: string
}

const App: React.FC = () => {
  const [images, setImages] = useState<Image[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedImages = await fetchImages() // Fetch initial batch of images
        setImages(fetchedImages)
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="App">
      <React.Suspense fallback={<div>Loading carousel...</div>}>
        <ImageCarousel images={images} />
      </React.Suspense>
    </div>
  )
}

export default App
