const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/user');

const {
  addPlace,
  getPlaces,
  updatePlace,
  singlePlace,
  userPlaces,
  searchPlaces
} = require('../controllers/placeController');

router.route('/').get(getPlaces);

// Protected routes (user must be logged in)
router.route('/add-places').post(isLoggedIn, addPlace);
router.route('/user-places').get(isLoggedIn, userPlaces);
router.route('/update-place').put(isLoggedIn, updatePlace);

// SPECIFIC ROUTES hamesha `/:id` se upar hone chahiye
router.route('/search/:key').get(searchPlaces);

// DYNAMIC ROUTE hamesha sabse neeche hona chahiye
router.route('/:id').get(singlePlace);

module.exports = router;