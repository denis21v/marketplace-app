import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getListing } from '../features/listings/listingSlice'
import { getUser } from '../features/auth/authSlice'
import LoadingIcon from '../components/LoadingIcon'
import Modal from 'react-modal'
import styles from './Listing.module.css'
import Button from '../components/Button'
import moment from 'moment'
import ListingItem from '../components/ListingItem'

Modal.setAppElement('#root')

const Listing = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [messageToSeller, setMessageToSeller] = useState('')

  const { listingUser, user } = useSelector((state) => state.auth)
  const {
    isLoading: isLoadingListings,
    listing,
    listings,
  } = useSelector((state) => state.listings)

  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()

  const { listingId } = useParams()

  useEffect(() => {
    const execute = async () => {
      const response = await dispatch(getListing(listingId))
      await dispatch(getUser(response.payload.listing.user))
    }
    execute()
  }, [params])

  const handleChange = (e) => {
    setMessageToSeller(e.target.value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    window.location = `mailto:${listingUser.email}?Subject=${listing.title}&body=${messageToSeller}`
    closeModal()
  }

  if (isLoadingListings) {
    return <LoadingIcon />
  }

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  return (
    <>
      <div className={styles.listingTopContainer}>
        <div className={styles.listingTitle}>
          <h2>{listing.title}</h2>
        </div>

        <div className={styles.listingTop}>
          <div className={styles.listingImage}>
            {listing.image && (
              <img src={listing.image.url} alt={listing.title} />
            )}
          </div>
          <div className={styles.listingInfo}>
            <p className={styles.listingInfoPrice}>
              Price: <b>{listing.price}$</b>
            </p>
            {/* if its users listing then show edit button else contact button */}
            {user ? (
              user.name !== listingUser.name ? (
                <Button
                  onClick={() => {
                    user ? openModal() : navigate('/login')
                  }}
                  buttonText={'Contact seller'}
                />
              ) : (
                <Button
                  onClick={() => navigate(`/edit/${listing._id}`)}
                  buttonText={'Edit listing'}
                />
              )
            ) : (
              <Button
                onClick={() => {
                  user ? openModal() : navigate('/login')
                }}
                buttonText={'Contact seller'}
              />
            )}
            <p className={styles.listingInfoCondition}>
              Condition: {listing.condition}
            </p>
            <p>
              Date Listed:{' '}
              {moment(listing.createdAt).utc().format('YYYY-DD-MM')}
            </p>
            <p>Seller: {listingUser.name}</p>
            <p>Location: {listingUser.location}</p>
          </div>
        </div>

        <div className={styles.listingDescription}>
          <h3>Description</h3>
          <p>{listing.description}</p>
        </div>
      </div>

      <div className={styles.similarListingsTitle}>
        <h3>Similar Listings</h3>
      </div>
      <div className={styles.similarListings}>
        {listings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={styles.modal}
        contentLabel='contactSeller'
        overlayClassName={styles.modalOverlay}
      >
        <button className={styles.modalBackButton} onClick={closeModal}>
          X
        </button>
        <form onSubmit={onSubmit} className={styles.modalForm}>
          <div className={styles.modalInfoTop}>
            <p>
              Message to: <b>{listingUser.name}</b>
            </p>
            <p>
              Email: <b>{listingUser.email}</b>
            </p>
          </div>
          <textarea
            className={styles.modalTextArea}
            type='text'
            id='title'
            name='title'
            value={messageToSeller}
            onChange={handleChange}
          ></textarea>

          <Button type='submit' buttonText={'Send Message'} />
        </form>
      </Modal>
    </>
  )
}

export default Listing
