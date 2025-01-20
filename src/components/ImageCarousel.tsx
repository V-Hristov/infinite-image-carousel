import React, { useEffect, useState, useRef, useCallback } from 'react'
import '../styles/ImageCarousel.scss'
import { generateSalt } from '../utils/salt.utils'

interface Image {
  id: string
  url: string
  salt: string
}

interface ImageCarouselProps {
  images: Image[]
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [displayedImages, setDisplayedImages] = useState<Image[]>([])
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const hasScrolled = useRef(false)

  useEffect(() => {
    setDisplayedImages(images)
  }, [images])

  useEffect(() => {
    if (
      !hasScrolled.current &&
      carouselRef.current &&
      displayedImages.length > 0
    ) {
      const carousel = carouselRef.current
      carousel.scrollLeft = 1
      hasScrolled.current = true
    }
  }, [displayedImages])

  const handleScroll = useCallback(() => {
    if (
      !carouselRef.current ||
      displayedImages.length === 0 ||
      !hasScrolled.current
    )
      return

    const carousel = carouselRef.current
    const { scrollLeft, scrollWidth, clientWidth } = carousel

    const remainingScroll = scrollWidth - (scrollLeft + clientWidth)
    const imageWidth = scrollWidth / displayedImages.length

    if (remainingScroll <= 0.5) {
      setDisplayedImages((prevImages) => {
        const newSaltedImages = images.map((it) => ({
          ...it,
          salt: generateSalt(),
        }))
        return [...prevImages, ...newSaltedImages]
      })
    }
    if (scrollLeft <= 0.5) {
      setDisplayedImages((prevImages) => {
        const currentScrollOffset = carousel.scrollLeft
        const newSaltedImages = images.map((it) => ({
          ...it,
          salt: generateSalt(),
        }))
        const newImages = [...newSaltedImages, ...prevImages]
        const prependedWidth = newSaltedImages.length * imageWidth
        setTimeout(() => {
          carousel.scrollLeft = currentScrollOffset + prependedWidth
        }, 0)
        return newImages
      })
    }
  }, [displayedImages])

  useEffect(() => {
    const carousel = carouselRef.current

    if (carousel) {
      carousel.addEventListener('scroll', handleScroll)
      return () => carousel.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Lazy Loading Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const dataSrc = img.getAttribute('data-src')
            if (dataSrc) {
              img.src = dataSrc
            }
            observer.unobserve(img)
          }
        })
      },
      { root: carouselRef.current, threshold: 0.1 }
    )

    const images = document.querySelectorAll('.carousel-item img[data-src]')
    images.forEach((img) => observer.observe(img))

    // Cleanup listener
    return () => observer.disconnect()
  }, [displayedImages])

  if (displayedImages.length === 0) {
    return <p>Loading carousel...</p>
  }

  return (
    <div className="carousel-wrapper">
      <div className="carousel" ref={carouselRef}>
        {displayedImages.map((image, index) => (
          <div key={`${image.id}-${image.salt}`} className="carousel-item">
            <img
              data-src={image.url}
              alt={`Image ${index + 1}`}
              className="lazy-image"
            />
            <noscript>
              <img src={image.url} alt={`Image ${index + 1}`} />
            </noscript>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel
