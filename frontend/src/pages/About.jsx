import React from 'react'
import styles from './About.module.css'
import { GiInfo } from 'react-icons/gi'

const About = () => {
  return (
    <>
      <div className={styles.aboutTitle}>
        <h2>About</h2>
      </div>
      <div className={styles.aboutInfo}>
        <h3>Marketplace App</h3>
        <p>
          Marketplace is a MERN stack application which is a marketplace where
          users are able to buy and sell items from all over the world. To be
          able to use all the main features the user must log in or create a new
          account. After logging in the user goes straight to the Home page. The
          page contains a searchbar where the user can search for items.
          Furthermore the user can click on a category and see all the relevant
          items. The user can also see the most viewed items at the bottom of
          the page. By going to the Sell page logged in users can list any item
          they wish by filling out the 'Create listing' form. The listings will
          be shown in the Explore page. Each item has a contact seller button
          which automatically starts writing an email to the seller to buy it.
          In the explore page users can find any listing they wish based on
          filters that they can apply. In the Account page users can edit their
          account details. They can also see all of their listing. Users can
          also edit or delete any listing they have by clicking on the buttons
          at the top of each listing.
        </p>
        <br />
        <div className={styles.version}>
          <p>Version </p>
          <p>1.0</p>
        </div>
      </div>

      <div className={styles.developerInfo}>
        <div className={styles.developerInfoText}>
          <p>
            Developer: <b>Denis Volosin</b>
          </p>
          <p>
            Phone number: <b>07934758133</b>
          </p>
          <p>
            Email Address: <b>denisvolosin21@gmail.com</b>
          </p>
          <p>
            Github:{' '}
            <a href='https://github.com/denis21v' target='_blank'>
              <b>denis21v</b>
            </a>
          </p>
        </div>
        <div className={styles.aboutIcon}>
          <GiInfo className={'iconScaling'} size={180} color={'#353535'} />
        </div>
      </div>
    </>
  )
}

export default About
