const express = require('express');

const router = express.Router();

const BookingController = require('../controllers/booking');

router.get('/all', BookingController.getUserBookings);
router.post('/user', BookingController.getUserBookings);
router.post('/space_bookings', BookingController.getSpaceBookings);
router.post('/details', BookingController.getBookingDetails);
router.post('/decline', BookingController.declineBooking);
router.post('/accept', BookingController.acceptBooking);
router.post('/paymentStatus', BookingController.getPaymentStatus);
router.post('/confirmPayment', BookingController.confirmPayment);
router.post('rateDriver', BookingController.rateDriver);

module.exports = router;
