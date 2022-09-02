import React from 'react'
import styles from './Home.module.css'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  reset as resetListings,
  getHotListings,
} from '../features/listings/listingSlice'
import LoadingIcon from '../components/LoadingIcon'
import ListingItem from '../components/ListingItem'
import { toast } from 'react-toastify'
import Searchbar from '../components/Searchbar'
import Slideshow from '../components/Slideshow'

const Home = () => {
  const { isLoading: isLoadingListings, listings } = useSelector(
    (state) => state.listings
  )
  const [searchText, setSearchText] = useState('')

  const categories = [
    'electronics',
    'clothes',
    'sport',
    'tools',
    'furniture',
    'collectables',
  ]

  useEffect(() => {
    const execute = async () => {
      await dispatch(getHotListings())
    }

    execute()

    return () => {
      dispatch(resetListings())
    }
  }, [])

  const handleSearchChange = (e) => {
    setSearchText(e.target.value)
    console.log(2)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchText === '') {
      toast.error('Type something')
      return
    } else {
      navigate(`explore?limit=10&page=1&sort=-createdAt&search=${searchText}`)
    }
  }

  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (isLoadingListings) {
    return <LoadingIcon />
  }

  return (
    <>
      <Searchbar
        handleSearchSubmit={handleSearchSubmit}
        handleSearchChange={handleSearchChange}
        searchText={searchText}
      />

      <div className={styles.categories}>
        {categories.map((category) => (
          <Link
            to={`/explore?limit=10&page=1&sort=-createdAt&category=${category}`}
          >
            {category}
          </Link>
        ))}
      </div>

      <div className={styles.slideshow}>
        <Slideshow />
      </div>

      <div className={styles.mostViewed}>
        <h3>Most viewed items</h3>
        <div className={styles.mostViewedListings}>
          {listings.map((listing) => (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Home
