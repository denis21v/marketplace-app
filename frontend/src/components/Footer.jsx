import React from 'react'
import styles from './Footer.module.css'

const Footer = () => {
  const footerYear = new Date().getFullYear()
  return (
    <div className={styles.footer}>
      Copyright &copy; {footerYear} <br />
      All rights reserved
    </div>
  )
}

export default Footer
