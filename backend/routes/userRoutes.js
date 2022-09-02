const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  getUser,
  updateUser,
} = require('../controllers/userController')

const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.route('/me').get(protect, getMe).put(protect, updateUser)
router.get('/:userId', getUser)

module.exports = router
