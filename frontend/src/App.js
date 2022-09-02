import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import styles from './App.module.css'
import Account from './pages/Account'
import Edit from './pages/Edit'
import Sell from './pages/Sell'
import Explore from './pages/Explore'
import About from './pages/About'
import Listing from './pages/Listing'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <>
      <Router>
        <div className={styles.container}>
          <Header />
          <div className={styles.content}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
              {/* private route for account that checks if not logged in then redirect to /login */}
              <Route path='/account' element={<PrivateRoute />}>
                <Route path='/account' element={<Account />} />
              </Route>
              <Route path='/about' element={<About />} />
              <Route path='/explore' element={<Explore />} />
              <Route path='/sell' element={<PrivateRoute />}>
                <Route path='/sell' element={<Sell />} />
              </Route>
              <Route path='/edit/:listingId' element={<Edit />} />
              <Route path='/listing/:listingId' element={<Listing />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
