import axios from 'axios'

const API_URL = '/api/users/'

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}

// Get user
const getUser = async (userId) => {
  const response = await axios.get(API_URL + userId)

  return response.data
}

// Update user
const updateUser = async (updateData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + 'me', { ...updateData }, config)

  let updatedUser
  if (response.data) {
    let currentUser = JSON.parse(localStorage.getItem('user'))
    updatedUser = {
      _id: currentUser._id,
      name: response.data.name,
      email: response.data.email,
      location: response.data.location,
      isAdmin: currentUser.isAdmin,
      token: currentUser.token,
    }
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return updatedUser
}

const authService = {
  register,
  logout,
  login,
  getUser,
  updateUser,
}

export default authService
