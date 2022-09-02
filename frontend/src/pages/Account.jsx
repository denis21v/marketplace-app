import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  getUserListings,
  deleteListing,
  reset as resetListings,
} from '../features/listings/listingSlice'
import { logout, reset, updateUser } from '../features/auth/authSlice'
import LoadingIcon from '../components/LoadingIcon'
import ListingItem from '../components/ListingItem'
import styles from './Account.module.css'
import { toast } from 'react-toastify'
import Button from '../components/Button'

function Account() {
  const { user, isLoading } = useSelector((state) => state.auth)
  const {
    isLoading: isLoadingListings,
    listings,
    listing,
  } = useSelector((state) => state.listings)

  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    location: user.location,
  })

  const { name, email, location } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const execute = async () => {
      await dispatch(getUserListings())
    }
    execute()

    return () => {
      dispatch(resetListings())
    }
  }, [listing])

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  const onSubmit = async () => {
    if (
      user.name !== name ||
      user.email !== email ||
      user.location !== location
    ) {
      await dispatch(
        updateUser({
          name: name,
          email: email,
          location: location,
        })
      )
      toast.success('User updated')
    } else {
      toast.error('No changes were made')
      return
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const deleteListingFromUser = async (listing) => {
    await dispatch(deleteListing(listing))

    toast.success('Successfully deleted listing')
  }

  const onDelete = async (listing) => {
    if (window.confirm('Are you sure you want to delete?')) {
      deleteListingFromUser(listing)
    }
  }

  const onEdit = (listing) => {
    navigate(`/edit/${listing._id}`)
  }

  if (isLoadingListings || isLoading) {
    return <LoadingIcon />
  }

  return (
    <>
      <div className={styles.accountTitle}>
        <h2>Account</h2>
      </div>

      <div className={styles.accountDetails}>
        <form className={styles.form}>
          <input
            type='text'
            id='name'
            disabled={!changeDetails}
            value={name}
            onChange={onChange}
          />
          <input
            type='text'
            id='email'
            disabled={!changeDetails}
            value={email}
            onChange={onChange}
          />

          <input
            type='text'
            id='location'
            disabled={!changeDetails}
            value={location}
            onChange={onChange}
          />
        </form>

        <div className={styles.editButton}>
          <Button
            onClick={() => {
              changeDetails && onSubmit()
              setChangeDetails((prevState) => !prevState)
            }}
            buttonText={changeDetails ? 'Done' : 'Edit'}
          />
        </div>

        <div className={styles.logoutButton}>
          <Button onClick={onLogout} buttonText={'Logout'} />
        </div>
      </div>

      {listings?.length > 0 ? (
        <>
          <p className={styles.accountListingsTitle}>Your Listings</p>
          <div className={styles.accountListings}>
            {listings.map((listing) => (
              <ListingItem
                listing={listing}
                key={listing._id}
                onDelete={() => onDelete(listing)}
                onEdit={() => onEdit(listing)}
              />
            ))}
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center' }}>No Listings</p>
      )}

      <Button onClick={() => navigate('/sell')} buttonText={'Create Listing'} />
    </>
  )
}

export default Account
