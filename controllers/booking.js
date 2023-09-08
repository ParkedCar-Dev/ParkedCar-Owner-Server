const Space = require("../models/space");
const Booking = require("../models/booking");

module.exports = class BookingController {
    static async getUserBookings(req, res) {
        try {
            await Booking.sequelize.query(
                `CALL update_booking_status(:user_id, :now)`,
                {
                    replacements: {user_id: req.user.user_id, now: Date.now()}
                }
            )
            const bookings = await Booking.getOwnerBookings(req.user.user_id, req.body.status);
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
            if(req.body.status == "all"){
                bookings = await Booking.getAllSpaceBookings(req.body.space_id);
            } else {
                bookings = await Booking.getBookingByStatus(req.body.space_id, req.body.status);
            }
            res.json({ status: "success", message: "get bookings successful", bookings: bookings });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong", bookings: null })
        }
    }

    static async getBookingDetails(req, res) {
        try {
            let booking = await Booking.getBookingDetails(req.body.booking_id);
            booking = booking[0]
            if(await Space.checkOwnership(req.user.user_id, booking.space_id) == false){
                return res.json({ status: "error", message: "You are not authorized to view this booking.", booking: null });
            }
            res.json({ status: "success", message: "get booking successful", booking: booking });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong", booking: null })
        }
    }

    static async declineBooking(req, res) {
        try {
            const booking = await Booking.findOne({
                where: { booking_id: req.body.booking_id },
            });
            if(await Space.checkOwnership(req.user.user_id, booking.space_id) == false){
                return res.json({ status: "error", message: "You are not authorized to update this booking." });
            }
            booking.status = "declined"
            await booking.save();
            res.json({ status: "success", message: "Booking declined successfully." });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong." })
        }
    }

    static async acceptBooking(req, res) {
        try {
            const booking = await Booking.findOne({
                where: { booking_id: req.body.booking_id },
            });
            if(await Space.checkOwnership(req.user.user_id, booking.space_id) == false){
                return res.json({ status: "error", message: "You are not authorized to update this booking." });
            }
            booking.status = "active"
            await booking.save();
            const bookings = await Booking.findAll({
                where: {
                    space_id: booking.space_id, status: "requested",
                    [Op.or]: 
                    [{ from_time: { [Op.between]: [booking.from_time, booking.to_time]}},
                    { to_time: { [Op.between]: [booking.from_time, booking.to_time]}}]
                }
            })
            for (let i = 0; i < bookings.length; i++) {
                bookings[i].status = "declined"
                await bookings[i].save();
            }
            res.json({ status: "success", message: "Booking accepted successfully." });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong." })
        }
    }
}