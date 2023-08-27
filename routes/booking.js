const express = require('express');

const router = express.Router();

const BookingController = require('../controllers/booking');

router.get('/all', BookingController.getUserBookings);
router.post('/space_bookings', BookingController.getSpaceBookings);

module.exports = router;
