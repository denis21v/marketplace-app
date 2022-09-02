import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  reset as resetListings,
  getListings,
} from '../features/listings/listingSlice'
import LoadingIcon from '../components/LoadingIcon'
import ListingItem from '../components/ListingItem'
import { toast } from 'react-toastify'
import styles from './Explore.module.css'
import Searchbar from '../components/Searchbar'
import Button from '../components/Button'

function Explore() {
  const {
    isLoading: isLoadingListings,
    listings,
    isError: isErrorListings,
    message: messageListings,
  } = useSelector((state) => state.listings)

  const [categories, setCategories] = useState([
    'all',
    'electronics',
    'clothes',
    'sport',
    'tools',
    'furniture',
    'collectables',
  ])

  const dispatch = useDispatch()

  const [searchParams, setSearchParams] = useSearchParams({})

  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const execute = async () => {
      const paramObj = {}
      searchParams.forEach((key, value) => {
        paramObj[value] = key
      })

      if (listings.length == 0) {
        const resp = await dispatch(getListings(paramObj))
        console.log(resp.payload)
      }
      if (searchParams.get('search')) {
        setSearchText(searchParams.get('search'))
      }

      console.log('params = ' + searchParams.get('page'))

      console.log('total = ' + messageListings)

      console.log('maxpage = ' + Math.trunc(messageListings / 10))
    }

    execute()
  }, [listings, searchParams])

  useEffect(() => {
    return () => {
      dispatch(resetListings())
    }
  }, [])

  useEffect(() => {
    dispatch(resetListings())
  }, [searchParams])

  // SETSEARCHPARAMS ADD IT OR UPDATE IT EVERY TIME A CHANGE
  const handleSortFilterChange = (e) => {
    dispatch(resetListings())

    searchParams.set('sort', e.target.value)
    searchParams.set('page', '1')
    setSearchParams(searchParams)
  }
  const handleCategoryFilterChange = (e) => {
    dispatch(resetListings())

    if (e.target.value === 'all') {
      searchParams.delete('category')
      setSearchParams(searchParams)
    } else {
      searchParams.set('category', e.target.value)
      searchParams.set('page', '1')
      setSearchParams(searchParams)
    }
  }

  const handleNextPage = () => {
    dispatch(resetListings())
    searchParams.set('page', parseInt(searchParams.get('page')) + 1)
    setSearchParams(searchParams)
  }
  const handlePreviousPage = () => {
    dispatch(resetListings())
    searchParams.set('page', parseInt(searchParams.get('page')) - 1)
    setSearchParams(searchParams)
  }

  const handleSearchChange = (e) => {
    setSearchText(e.target.value)
    console.log(1)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchText === '') {
      toast.error('Type something')
      return
    } else {
      searchParams.set('search', searchText)
      searchParams.set('page', '1')

      setSearchParams(searchParams)
      dispatch(resetListings())
    }
  }

  if (isLoadingListings) {
    return (
      <>
        <LoadingIcon />
      </>
    )
  }

  return (
    <>
      <div className={styles.exploreTitle}>
        <h2>Explore</h2>
      </div>
      <Searchbar
        handleSearchSubmit={handleSearchSubmit}
        handleSearchChange={handleSearchChange}
        searchText={searchText}
      />
      <div className={styles.exploreListingsContainer}>
        <div className={styles.filtersContainer}>
          <div className={styles.totalItems}>
            {typeof messageListings == 'number' && (
              <p>Total: {messageListings}</p>
            )}
          </div>
          <div className={styles.filters}>
            <select
              className={styles.filter}
              onChange={handleCategoryFilterChange}
              value={searchParams.get('category')}
            >
              {categories.map((category) => (
                <option className={styles.categoryOption} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              className={styles.filter}
              onChange={handleSortFilterChange}
              value={searchParams.get('sort')}
            >
              <option value='-createdAt'>Newest(date)</option>
              <option value='createdAt'>Oldest(date)</option>
              <option value='price'>Lowest(price)</option>
              <option value='-price'>Highest(price)</option>
            </select>
          </div>
        </div>
        {/* check if there are no listings for current category then error will occur and instead of showing listings the error message will be shown "there are no listings of this category"*/}
        {!isErrorListings ? (
          <>
            <div className={styles.exploreListings}>
              {listings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
            <div className={styles.pageButtons}>
              <div className={styles.previousButton}>
                {parseInt(searchParams.get('page')) > 1 && (
                  <Button
                    onClick={handlePreviousPage}
                    buttonText={'Previous Page'}
                  />
                )}
              </div>

              <div className={styles.pageNumber}>
                {searchParams.get('page')}
              </div>

              {/* Calculating total number of pages from length of listings  */}
              <div className={styles.nextButton}>
                {parseInt(searchParams.get('page')) !==
                  ((messageListings / 10) % 1 === 0
                    ? Math.trunc(messageListings / 10)
                    : Math.trunc(messageListings / 10) + 1) && (
                  <Button onClick={handleNextPage} buttonText={'Next Page'} />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.errorMessage}>{messageListings}</div>
        )}
      </div>
    </>
  )
}

export default Explore
