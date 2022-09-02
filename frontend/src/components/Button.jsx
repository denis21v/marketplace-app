import React from 'react'
import styles from './Button.module.css'

function Button({ buttonText, onClick, type = 'button' }) {
  return (
    <button type={type} onClick={onClick} className={styles.button}>
      {buttonText}
    </button>
  )
}

export default Button
