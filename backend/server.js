const path = require('path')
const express = require('express')
const colors = require('colors')
const cors = require('cors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const { upload } = require('./middleware/uploadMiddleware')
const connectDB = require('./config/db')
const { nextTick, emitWarning } = require('process')
const PORT = process.env.PORT || 5000

// Connect to database
connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/upload-image', upload.single('image'), async (req, res, next) => {
  try {
    if (req.complete) {
      res.status(200).json({
        message: 'Single file uploaded successfully',
        path: req.file.path,
        name: req.file.filename,
      })
    }
  } catch (err) {
    next(err)
  }
})

// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/listings', require('./routes/listingRoutes'))

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
  // Set build folder as static
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../', 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Marketplace API' })
  })
}

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
