import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import imageSport from '../slideImages/Sport_category_image.png'
import imageClothes from '../slideImages/Clothes_category_image.png'
import imageElectronics from '../slideImages/Electronics_category_image.png'
import styles from './Slideshow.module.css'
import { AiFillLeftCircle, AiFillRightCircle } from 'react-icons/ai'

const categories = [
  { name: 'clothes', url: imageClothes },
  { name: 'sport', url: imageSport },
  { name: 'electronics', url: imageElectronics },
]
const delay = 4000

const Slideshow = () => {
  const [index, setIndex] = useState(0)
  const timeoutRef = useRef(null)
  const navigate = useNavigate()

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    resetTimeout()
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === categories.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    )

    return () => {
      resetTimeout()
    }
  }, [index])

  const goToLocation = (categoryName) => {
    navigate(
      `/explore?limit=10&page=1&sort=-createdAt&category=${categoryName}`
    )
  }

  return (
    <div className={styles.slideshow}>
      <div
        className={styles.slideshowSlider}
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {categories.map((category, index) => (
          <div className={styles.slide} key={index}>
            <div
              className={styles.slideContent}
              onClick={() => goToLocation(category.name)}
              style={{ cursor: 'pointer' }}
            >
              <img src={category.url} />
            </div>
          </div>
        ))}
      </div>

      <AiFillLeftCircle
        size={80}
        onClick={() => {
          setIndex(index > 0 ? index - 1 : 2)
        }}
        className={styles.buttonLeft}
      />

      <AiFillRightCircle
        size={80}
        onClick={() => {
          setIndex(index < 2 ? index + 1 : 0)
        }}
        className={styles.buttonRight}
      />
    </div>
  )
}

export default Slideshow
