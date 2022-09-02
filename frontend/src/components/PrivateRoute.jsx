import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
import LoadingIcon from './LoadingIcon'

const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus()

  if (checkingStatus) {
    return <LoadingIcon />
  }

  return loggedIn ? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoute
