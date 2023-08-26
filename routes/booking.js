const express = require('express');

const router = express.Router();

const BookingController = require('../controllers/booking');

router.get('/all', BookingController.getUserBookings);
router.get('/:space_id/:status', BookingController.getSpaceBookings);

module.exports = router;
