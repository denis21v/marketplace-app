import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { login, reset } from '../features/auth/authSlice'
import LoadingIcon from '../components/LoadingIcon'
import styles from './RegisterAndLogin.module.css'
import Button from '../components/Button'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
      setFormData({
        ...formData,
        password: '',
      })
    }

    //When logged in go to the home page
    if ((isSuccess && user) || user) {
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

    const userData = {
      email,
      password,
    }

    dispatch(login(userData))
  }
  if (isLoading) {
    return <LoadingIcon />
  }

  return (
    <>
      <h1>Log in</h1>

      <form onSubmit={onSubmit} className={styles.form}>
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

        <div className={styles.authContainer}>
          <Button type='submit' buttonText={'Login'} />
          <Link to='/register'>Register</Link>
        </div>
      </form>
    </>
  )
}

export default Login
