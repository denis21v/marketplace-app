const cloudinary = require('cloudinary').v2
const fs = require('fs').promises
const User = require('../models/userModel')
const Listing = require('../models/listingModel')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res, next) => {
  try {
    let reqQuery = { ...req.query }

    const removeFields = ['sort', 'limit', 'skip', 'page']

    removeFields.forEach((val) => delete reqQuery[val])

    let queryStr = JSON.stringify(reqQuery)

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in|regex)\b/g,
      (match) => `$${match}`
    )

    const queryObj = JSON.parse(queryStr)

    // get total listings for pagination
    const totalListings = await Listing.find({
      title: {
        $regex: queryObj.title ? queryObj.title : '',
        $options: 'i',
      },
      categories: {
        $in: queryObj.categories
          ? queryObj.categories
          : [
              'electronics',
              'sport',
              'clothes',
              'tools',
              'furniture',
              'collectables',
            ],
      },
    })

    if (totalListings.length === 0) {
      res.status(400)
      throw new Error('There are no listings of this category')
    }

    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit) || 10
    const sort = req.query.sort

    // Alternative way of doing this
    // query = Listing.find(JSON.parse(queryStr))
    // query = query.sort(sort).limit(limit).skip(pagesToSkip)
    // const listings = await query

    const listings = await Listing.find({
      title: {
        $regex: queryObj.title ? queryObj.title : '',
        $options: 'i',
      },
      categories: {
        $in: queryObj.categories
          ? queryObj.categories
          : [
              'electronics',
              'sport',
              'clothes',
              'tools',
              'furniture',
              'collectables',
            ],
      },
    })
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * 10)

    if (listings.length === 0) {
      res.status(400)
      throw new Error('There are no listings with this category')
    }

    res
      .status(200)
      .json({ listings: listings, totalListings: totalListings.length })
  } catch (err) {
    next(err)
  }
}

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private

// NEED TO DO MULTER HERE
const createListing = async (req, res, next) => {
  try {
    const { title, description, image, price, categories, condition } = req.body

    if (
      !title ||
      !description ||
      !condition ||
      !image ||
      !price ||
      !categories
    ) {
      res.status(400)
      throw new Error('Please complete all fields')
    }

    // Get user using the id in JWT
    const user = await User.findById(req.user.id)

    if (!user) {
      res.status(401)
      throw new Error('User not found')
    }

    const fileStr = `./backend/images/${req.body.image}`
    const response = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'onlinemarketplacepreset',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      folder: 'online-marketplace',
    })

    if (!response) {
      res.status(401)
      throw new Error('No response')
    }

    // remove image from images folder after uploading to cloudinary
    await fs.unlink(`./backend/images/${req.body.image}`)

    const listing = await Listing.create({
      user: req.user.id,
      title,
      description,
      condition,
      image: { id: response.public_id, url: response.secure_url },
      price,
      categories,
      views: 0,
    })

    res.status(201).json(listing)
  } catch (err) {
    next(err)
  }
}

// @desc    Get user listings
// @route   GET /api/listings/user/:userId
// @access  Private
const getUserListings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      res.status(401)
      throw new Error('User not found')
    }

    const listings = await Listing.find({ user: user._id })
    res.status(200).json(listings)
  } catch (err) {
    next(err)
  }
}

// @desc    Get hot listings
// @route   GET /api/listings/get-hot/:queryData
// @access  Public
const getHotListings = async (req, res, next) => {
  try {
    const listings = await Listing.find()
      .sort({
        views: -1,
      })
      .limit(5)

    res.status(200).json(listings)
  } catch (err) {
    next(err)
  }
}

// @desc    Get single listing
// @route   GET /api/listings/:listingId
// @access  Public
const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.listingId)

    if (!listing) {
      res.status(404)
      throw new Error('Listing not found')
    }

    await Listing.findByIdAndUpdate(req.params.listingId, {
      views: (listing.views += 1),
    })

    // to get similar listings in Listing page
    const listings = await Listing.find({
      categories: listing.categories[0],
      _id: { $ne: listing._id },
    }).limit(5)

    res.status(200).json({ listing, listings })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete listing
// @route   DELETE /api/listings/:listingId
// @access  Private
const deleteListing = async (req, res, next) => {
  try {
    // Get user using the id in JWT
    const user = await User.findById(req.user.id)

    if (!user) {
      res.status(401)
      throw new Error('User not found')
    }

    const listing = await Listing.findById(req.params.listingId)

    if (!listing) {
      res.status(404)
      throw new Error('Listing not found')
    }

    if (listing.user.toString() !== req.user.id) {
      res.status(401)
      throw new Error('Not authorized')
    }

    await cloudinary.uploader.destroy(listing.image.id)

    const listingId = req.params.listingId

    await listing.remove()

    res.status(200).json({ success: true, listingId })
  } catch (err) {
    next(err)
  }
}

// @desc    Update listing
// @route   PUT /api/listings/:listingId
// @access  Private
const updateListing = async (req, res, next) => {
  try {
    // Get user using the id in JWT
    const user = await User.findById(req.user.id)

    if (!user) {
      res.status(401)
      throw new Error('User not found')
    }

    const listing = await Listing.findById(req.params.listingId)

    if (!listing) {
      res.status(404)
      throw new Error('Listing not found')
    }

    if (listing.user.toString() !== req.user.id) {
      res.status(401)
      throw new Error('Not authorized')
    }

    // if new image was sent
    if (req.body.image) {
      //Remove previous image from cloudinary
      await cloudinary.uploader.destroy(listing.image.id)

      const fileStr = `./backend/images/${req.body.image}`
      const response = await cloudinary.uploader.upload(fileStr, {
        upload_preset: 'onlinemarketplacepreset',
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder: 'online-marketplace',
      })

      // remove image from images folder after uploading to cloudinary
      await fs.unlink(`./backend/images/${req.body.image}`)

      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.listingId,
        // add imageUrl to updatedData
        {
          ...req.body,
          image: { id: response.public_id, url: response.secure_url },
        }
      )

      res.status(200).json(updatedListing)
    } else {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.listingId,
        req.body
      )
      res.status(200).json(updatedListing)
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getListings,
  createListing,
  getUserListings,
  getHotListings,
  getListing,
  deleteListing,
  updateListing,
}
