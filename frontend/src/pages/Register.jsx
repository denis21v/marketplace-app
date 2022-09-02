import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { register, login, reset } from '../features/auth/authSlice'
import LoadingIcon from '../components/LoadingIcon'
import styles from './RegisterAndLogin.module.css'
import Button from '../components/Button'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    location: '',
  })

  const { name, email, password, password2, location } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
      setFormData({
        name: '',
        email: '',
        password: '',
        password2: '',
        location: '',
      })
    }

    //When logged in go to the home page
    if (isSuccess || user) {
      navigate('/')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (password !== password2) {
      toast.error('Passwords do not match')
      setFormData({
        ...formData,
        password: '',
        password2: '',
      })
    } else {
      const userData = {
        name,
        email,
        password,
        location,
      }

      dispatch(register(userData))
    }
  }

  if (isLoading) {
    return <LoadingIcon />
  }

  return (
    <>
      <h1>Register</h1>

      <form onSubmit={onSubmit} className={styles.form}>
        <input
          type='text'
          id='name'
          name='name'
          value={name}
          onChange={onChange}
          placeholder='Name'
          required
        />

        <input
          type='email'
          id='email'
          name='email'
          value={email}
          onChange={onChange}
          placeholder='Email'
          required
        />

        <input
          type='password'
          id='password'
          name='password'
          value={password}
          onChange={onChange}
          placeholder='Enter password'
          required
        />

        <input
          type='password'
          id='password2'
          name='password2'
          value={password2}
          onChange={onChange}
          placeholder='Confirm password'
          required
        />

        <input
          type='text'
          id='location'
          name='location'
          value={location}
          onChange={onChange}
          placeholder='Location'
          required
        />
        <div className={styles.authContainer}>
          <Button type='submit' buttonText={'Register'} />
          <Link to='/login'>Login</Link>
        </div>
      </form>
    </>
  )
}

export default Register
