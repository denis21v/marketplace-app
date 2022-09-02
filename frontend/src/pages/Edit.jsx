import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  reset as resetListings,
  updateListing,
  getListing,
} from '../features/listings/listingSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingIcon from '../components/LoadingIcon'
import axios from 'axios'
import styles from './SellAndEdit.module.css'
import Button from '../components/Button'

function Edit() {
  const { isLoading: isLoadingListings, listing } = useSelector(
    (state) => state.listings
  )

  const [selectedImage, setSelectedImage] = useState()
  const [categories, setCategories] = useState([])
  const [listingEdited, setListingEdited] = useState({})

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    const execute = async () => {
      const response = await dispatch(getListing(params.listingId))
      console.log(response)
      setListingEdited(response.payload.listing)
      setCategories(response.payload.listing.categories)
    }
    execute()

    return () => {
      dispatch(resetListings())
    }
  }, [])

  const updateSelectedListing = async (finalListing) => {
    await dispatch(updateListing(finalListing))

    navigate(`/listing/${listing._id}`)
  }

  const onEdit = (e) => {
    setListingEdited((prevState) => ({
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
      let finalListingEdited = {}
      let response = {}

      //Check if image was edited meaning if listingEdited has an image property
      if (listingEdited.image) {
        console.log(1)
        const imgData = new FormData()
        imgData.append('image', selectedImage)

        response = await axios.postForm('/upload-image', imgData)
        console.log(response)

        finalListingEdited = {
          ...listingEdited,
          categories: categories,
          image: response.data.name,
        }
      } else {
        console.log(2)
        finalListingEdited = {
          ...listingEdited,
          categories: categories,
        }
      }

      //Check if the response below is right for secure_url
      console.log(finalListingEdited)

      const comp1 = { ...finalListingEdited }
      const comp2 = { ...listing }

      delete comp1['image']
      delete comp2['image']

      console.log(comp1)
      console.log(comp2)

      let objectsEqual = isEqual(comp1, comp2)

      if (objectsEqual && !finalListingEdited.image) {
        toast.error('No changes were made')
        return
      }

      updateSelectedListing(finalListingEdited)
    } catch (err) {
      console.log(err)
    }
  }

  const isEqual = (obj1, obj2) => {
    const props1 = Object.getOwnPropertyNames(obj1)
    const props2 = Object.getOwnPropertyNames(obj2)
    if (props1.length != props2.length) {
      return false
    }
    for (var i = 0; i < props1.length; i++) {
      const val1 = obj1[props1[i]]
      const val2 = obj2[props1[i]]
      const isObjects = isObject(val1) && isObject(val2)
      if (
        (isObjects && !isEqual(val1, val2)) ||
        (!isObjects && val1 !== val2)
      ) {
        return false
      }
    }
    return true
  }
  const isObject = (object) => {
    return object != null && typeof object === 'object'
  }

  if (isLoadingListings) {
    return <LoadingIcon />
  }

  return (
    <>
      <h2>Edit Listing</h2>
      <form onSubmit={onSubmit} className={styles.formContainer}>
        <input
          maxLength={30}
          size={30}
          type='text'
          id='title'
          name='title'
          value={listingEdited.title}
          onChange={onEdit}
          className={styles.formTitle}
        />
        <textarea
          maxLength={650}
          size={650}
          type='text'
          id='description'
          name='description'
          value={listingEdited.description}
          onChange={onEdit}
          className={styles.formDescription}
        ></textarea>

        <input
          type='text'
          id='condition'
          name='condition'
          value={listingEdited.condition}
          onChange={onEdit}
          className={styles.formCondition}
          placeholder='Condition'
        />

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
          value={listingEdited.price}
          onChange={onEdit}
          className={styles.formPrice}
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
          {categories.map((category, idx) =>
            // idx !== categories.length ? category + ', ' : category
            {
              console.log(idx)
              console.log(categories.length)
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
            }
          )}
        </div>

        <div className={styles.submitButton}>
          <Button type='submit' buttonText={'Submit'} />
        </div>
      </form>
    </>
  )
}
export default Edit
