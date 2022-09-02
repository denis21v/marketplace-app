import React from 'react'
import { BiLoader } from 'react-icons/bi'
import styles from './LoadingIcon.module.css'

function LoadingIcon() {
  return (
    <div className={styles.loadingContainer}>
      <BiLoader size={150} color='#353535' className={styles.loadingIcon} />
    </div>
  )
}

export default LoadingIcon
