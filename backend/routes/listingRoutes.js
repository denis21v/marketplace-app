const express = require('express')
const router = express.Router()
const {
  getListings,
  createListing,
  getUserListings,
  getHotListings,
  getListing,
  deleteListing,
  updateListing,
} = require('../controllers/listingController')

const { protect } = require('../middleware/authMiddleware')

// getListings and getListing are not protected because anyone even if not logged in can see them by going to the explore page
router.route('/').post(protect, createListing)

router.route('/').get(getListings)
router.route('/get-hot').get(getHotListings)

router.route('/user/:userId').get(protect, getUserListings)

router
  .route('/:listingId')
  .get(getListing)
  .delete(protect, deleteListing)
  .put(protect, updateListing)

module.exports = router
