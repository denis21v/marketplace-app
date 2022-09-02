import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  reset as resetListings,
  createListing,
  resetLoading,
} from '../features/listings/listingSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import LoadingIcon from '../components/LoadingIcon'
import axios from 'axios'
import styles from './SellAndEdit.module.css'
import Button from '../components/Button'

function Sell() {
  const { isLoading: isLoadingListings } = useSelector(
    (state) => state.listings
  )

  const [listing, setListing] = useState({})

  const [selectedImage, setSelectedImage] = useState()
  const [categories, setCategories] = useState([])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(resetLoading())
    return () => {
      dispatch(resetListings())
    }
  }, [])

  const createNewListing = async (finalListing) => {
    const createdListing = await dispatch(createListing(finalListing))
    navigate(`/listing/${createdListing.payload._id}`)
  }

  const onChange = (e) => {
    setListing((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onFileChange = (e) => {
    setSelectedImage(e.target.files[0])
  }

  const onCategorySelect = (e) => {
    let option = categories.find((element) => element === e.target.value)
    if (option) {
      setCategories(categories.filter((element) => element !== e.target.value))
    } else {
      setCategories([...categories, e.target.value])
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      if (
        !listing.title ||
        !listing.description ||
        !listing.condition ||
        !listing.price ||
        !categories
      ) {
        toast.error('Form needs to be fully filled out')
        return
      }

      // Using formData because of multer
      const imgData = new FormData()
      imgData.append('image', selectedImage)

      const response = await axios.postForm('/upload-image', imgData)

      const finalListing = {
        ...listing,
        image: response.data.name,
        categories: categories,
      }

      if (!finalListing.image) {
        toast.error('Need to upload an image')
        return
      }

      createNewListing(finalListing)
    } catch (err) {
      console.log(err)
    }
  }

  if (isLoadingListings) {
    return <LoadingIcon />
  }

  return (
    <>
      <h2>Create Listing</h2>
      <form onSubmit={onSubmit} className={styles.formContainer}>
        <input
          maxLength={30}
          size={30}
          type='text'
          id='title'
          name='title'
          onChange={onChange}
          className={styles.formTitle}
          placeholder='Listing title'
        />
        <textarea
          maxLength={650}
          size={650}
          type='text'
          id='description'
          name='description'
          onChange={onChange}
          className={styles.formDescription}
          placeholder='Listing description'
        ></textarea>

        <input
          type='text'
          id='condition'
          name='condition'
          onChange={onChange}
          className={styles.formCondition}
          placeholder='Condition'
        />

        {/* Upload button */}
        <div className={styles.fileUpload}>
          <label
            onChange={onFileChange}
            htmlFor='imageUpload'
            className={styles.fileUploadButton}
          >
            Upload Image
            <input type='file' id='imageUpload' name='image' hidden />
          </label>
          {selectedImage && selectedImage.name}
        </div>

        <input
          type='number'
          id='price'
          name='price'
          onChange={onChange}
          className={styles.formPrice}
          placeholder='Listing price'
        />

        <p>Category select</p>
        <select
          multiple={true}
          value={categories}
          onChange={onCategorySelect}
          className={styles.formCategorySelect}
        >
          <option value='electronics'>Electronics</option>
          <option value='clothes'>Clothes</option>
          <option value='sport'>Sport</option>
          <option value='tools'>Tools</option>
          <option value='furniture'>Furniture</option>
          <option value='collectables'>Collectables</option>
        </select>

        <div className={styles.formCategories}>
          {categories.map((category, idx) => {
            const capitalisedCategory =
              category.charAt(0).toUpperCase() + category.slice(1)
            if (
              idx !== categories.length - 1 ||
              !categories.includes(category)
            ) {
              return capitalisedCategory + ', '
            } else {
              return capitalisedCategory
            }
          })}
        </div>

        <div className={styles.submitButton}>
          <Button type='submit' buttonText={'Submit'} />
        </div>
      </form>
    </>
  )
}
export default Sell
