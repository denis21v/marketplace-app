import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { login, logout, reset } from '../features/auth/authSlice'
import styles from './Header.module.css'
import { GiHamburgerMenu } from 'react-icons/gi'
import { CgProfile } from 'react-icons/cg'

const Header = () => {
  const [hamburgerClicked, setHamburgerClicked] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())

    navigate('/')
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarMain}>
        {/* Left */}
        <div className={styles.navbarLeft}>
          <button
            onClick={() => {
              setHamburgerClicked(!hamburgerClicked)
            }}
            className={styles.navbarButton}
          >
            <GiHamburgerMenu size={45} />
          </button>

          <nav>
            <Link to='/sell'>Sell</Link>
            <Link to='/explore?limit=10&page=1&sort=-createdAt'>Explore</Link>
            <Link to='/about'>About</Link>
          </nav>
        </div>

        {/* Middle */}

        <div className={styles.navbarMiddle}>
          <Link to={'/'}>
            <div className={styles.navbarLogo}>Marketplace</div>
          </Link>
        </div>

        {/* right */}
        <div className={styles.navbarRight}>
          <button
            onClick={() => navigate('/account')}
            className={styles.navbarButton}
          >
            <CgProfile size={45} />
          </button>

          <nav>
            {user ? (
              <>
                <span>{user.name}</span>

                <button onClick={onLogout}>Logout</button>
                <Link to='/account'>Account</Link>
              </>
            ) : (
              <>
                <Link to='/register'>Register</Link>
                <Link to='/login'>Login</Link>
                <Link to='/account'>Account</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Small screen hamburger button menu */}
      {hamburgerClicked && (
        <div className={styles.navbarMenu}>
          <nav>
            <Link to='/sell'>Sell</Link>
            <Link to='/explore?limit=10&page=1&sort=-createdAt'>Explore</Link>
            <Link to='/about'>About</Link>
          </nav>
        </div>
      )}
    </div>
  )
}

export default Header
