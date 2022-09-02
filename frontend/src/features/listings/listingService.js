import axios from 'axios'

const API_URL = '/api/listings/'

// Get all listings
const getListings = async (queryData) => {
  let queryParamsString =
    'sort=' +
    queryData.sort +
    '&' +
    'limit=' +
    queryData.limit +
    '&' +
    'page=' +
    queryData.page

  // add 'category=' string to the queryParamsString
  if (queryData.category) {
    queryParamsString += `&categories=${queryData.category}`
  }

  // add 'search=' string to the queryParamsString
  if (queryData.search) {
    queryParamsString += `&title=${queryData.search}`
  }

  const response = await axios.get('/api/listings?' + queryParamsString)

  return response.data
}

// Create a new listing
const createListing = async (listingData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL, listingData, config)

  return response.data
}

// Get user listings
const getUserListings = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL + 'user/' + userId, config)
  return response.data
}

// Get discount listings
const getHotListings = async () => {
  const response = await axios.get(API_URL + 'get-hot')

  return response.data
}

// Get single listing
const getListing = async (listingId) => {
  const response = await axios.get(API_URL + listingId)

  return response.data
}

// Delete single listing
const deleteListing = async (listing, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(API_URL + listing._id, config)

  return response.data
}

// Update listing
const updateListing = async (updateData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.put(
    API_URL + updateData._id,
    { ...updateData },
    config
  )

  return response.data
}

const listingService = {
  getListings,
  createListing,
  getUserListings,
  getHotListings,
  getListing,
  deleteListing,
  updateListing,
}

export default listingService
