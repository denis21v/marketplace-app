const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

// @desc    Register a new user
// @route   /api/users
// @access  Public
const registerUser = async (req, res, next) => {
  const { name, email, password, location } = req.body

  try {
    // Validation
    if (!name || !email || !password || !location) {
      res.status(400)
      throw new Error('Please include all fields')
    }

    // Find if user already exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      res.status(400)
      throw new Error('User already exists')
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      location,
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }
  } catch (err) {
    next(err)
  }
}

// @desc    Login a user
// @route   /api/users/login
// @access  Public
const loginUser = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    // Check if user and passwords match
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(401)
      throw new Error('Invalid credentials')
    }
  } catch (err) {
    next(err)
  }
}

// @desc    Get current user
// @route   /api/users/me
// @access  Private
const getMe = async (req, res, next) => {
  const user = {
    //authMiddleware finds a user though the id from token and puts it in req.user
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    location: req.user.location,
    listings: req.user.listings,
    admin: req.user.isAdmin,
  }
  try {
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

const getUser = async (req, res, next) => {
  try {
    // Get user using the id in JWT
    const user = await User.findById(req.params.userId).select('-password')

    if (!user) {
      res.status(401)
      throw new Error('User not found')
    }

    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

const updateUser = async (req, res, next) => {
  try {
    // Get user using the id in JWT
    // console.log(req.user)
    const user = await User.findById(req.user._id)
    if (!user) {
      res.status(401)
      throw new Error('User not found')
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    })

    res.status(200).json({
      name: updatedUser.name,
      email: updatedUser.email,
      location: updatedUser.location,
    })
  } catch (err) {
    next(err)
  }
}

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUser,
  updateUser,
}
