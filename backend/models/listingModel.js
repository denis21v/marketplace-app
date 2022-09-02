const mongoose = require('mongoose')

const listingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    //url from cloudinary
    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    price: {
      type: Number,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    views: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Listing', listingSchema)
