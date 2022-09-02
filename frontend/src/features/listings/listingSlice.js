import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import listingService from './listingService'

const initialState = {
  listings: [],
  listing: {},
  isError: false,
  isSuccess: false,
  isLoading: true,
  message: '',
}

// Get all listings
export const getListings = createAsyncThunk(
  'listings/getAll',
  async (queryData, thunkAPI) => {
    try {
      return await listingService.getListings(queryData)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create new listing
export const createListing = createAsyncThunk(
  'listing/create',
  async (listingData, thunkAPI) => {
    try {
      //can get any state from thunkAPI
      const token = thunkAPI.getState().auth.user.token
      return await listingService.createListing(listingData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get user listings
export const getUserListings = createAsyncThunk(
  'listings/getAllUserListings',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const userId = thunkAPI.getState().auth.user._id
      return await listingService.getUserListings(userId, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get most viewed listings
export const getHotListings = createAsyncThunk(
  'listings/getHotListings',
  async (_, thunkAPI) => {
    try {
      return await listingService.getHotListings()
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get similar listings
export const getSimilarListings = createAsyncThunk(
  'listings/getSimilarListings',
  async (queryData, thunkAPI) => {
    try {
      return await listingService.getSimilarListings(queryData)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get single listing
export const getListing = createAsyncThunk(
  'listing/get',
  async (listingId, _) => {
    try {
      return await listingService.getListing(listingId)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return message
    }
  }
)

// Delete single listing
export const deleteListing = createAsyncThunk(
  'listing/delete',
  async (listing, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await listingService.deleteListing(listing, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update single listing
export const updateListing = createAsyncThunk(
  'listing/update',
  async (updateData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await listingService.updateListing(updateData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const listingSlice = createSlice({
  name: 'listing',
  initialState,
  reducers: {
    reset: (state) => initialState,
    resetLoading: (state) => {
      state.isLoading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListings.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getListings.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.listings = action.payload.listings
        state.message = action.payload.totalListings
      })
      .addCase(getListings.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createListing.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.listing = action.payload
      })
      .addCase(createListing.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getUserListings.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUserListings.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.listings = action.payload
      })
      .addCase(getUserListings.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getHotListings.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getHotListings.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.listings = action.payload
      })
      .addCase(getHotListings.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getListing.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getListing.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.listing = action.payload.listing
        state.listings = action.payload.listings
      })
      .addCase(getListing.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateListing.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.listing = action.payload
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        // changing object so useEffect goes off and dispatches getUserListings
        state.listing = {}
      })
  },
})

export const { reset, resetLoading } = listingSlice.actions
export default listingSlice.reducer
