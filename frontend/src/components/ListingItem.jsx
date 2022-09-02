import React from 'react'
import { Link } from 'react-router-dom'
import styles from './ListingItem.module.css'

const ListingItem = ({ listing, onEdit, onDelete }) => {
  return (
    <>
      <div className={styles.listingImage}>
        <Link to={`/listing/${listing._id}`}>
          <img src={listing.image.url} alt={listing.title} />
          <div className={styles.imageInfo}>
            <p>
              <b>{listing.title}</b>
            </p>
            <p>£{listing.price}</p>
          </div>
        </Link>
        {onEdit && onDelete && (
          <>
            <button
              className={styles.listingEditButton}
              onClick={() => onEdit(listing)}
            >
              Edit
            </button>
            <button
              className={styles.listingDeleteButton}
              onClick={() => onDelete(listing)}
            >
              X
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default ListingItem
