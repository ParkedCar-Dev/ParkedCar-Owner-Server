const Space = require("../models/space");
const Booking = require("../models/booking");

module.exports = class BookingController {
    static async getUserBookings(req, res) {
        try {
            const bookings = await Booking.getOwnerBookings(req.user.user_id);
            res.json({ status: "success", bookings: bookings });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", bookings: null })
        }
    }

    static async getSpaceBookings(req, res) {
        try {
            if(Space.checkOwnership(req.user.user_id, req.body.space_id) == false){
                return res.json({ status: "error", message: "You do not own this space.", bookings: null });
            }
            let bookings;
            if(req.body.status == "active"){
                bookings = await Booking.getActiveBookings(req.body.space_id);
            } else if(req.body.status == "requested"){
                bookings = await Booking.getRequestedBookings(req.body.space_id);
            } else if(req.body.status == "completed"){
                bookings = await Booking.getCompletedBookings(req.body.space_id);
            } else if(req.body.status == "cancelled"){
                bookings = await Booking.getCancelledBookings(req.body.space_id);
            } else if(req.body.status == "declined"){
                bookings = await Booking.getDeclinedBookings(req.body.space_id);
            } else if(req.body.status == "all"){
                bookings = await Booking.getAllSpaceBookings(req.body.space_id);
            } else {
                return res.json({ status: "error", message: "Invalid status.", bookings: null });
            }
            res.json({ status: "success", message: "get bookings successful", bookings: bookings });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong", bookings: null })
        }
    }
}