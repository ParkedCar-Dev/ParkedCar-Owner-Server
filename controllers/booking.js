const Space = require("../models/space");
const Booking = require("../models/booking");
const Driver = require("../models/driver");
const Op = require('sequelize').Op

module.exports = class BookingController {
    static async getUserBookings(req, res) {
        try {
            await Booking.sequelize.query(
                `CALL update_booking_status(:user_id, :now)`,
                {
                    replacements: {user_id: req.user.user_id, now: Date.now()}
                }
            )
            let bookings;
            if(req.body.status == "past"){
                bookings = await Booking.getPastUserBookings(req.user.user_id);
            }
            else{ 
                bookings = await Booking.getOwnerBookings(req.user.user_id, req.body.status);
            }
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
            } 
            else if(req.body.status == "past"){
                bookings = await Booking.getSpacePastBookings(req.body.space_id);
            }
            else {
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
            if(booking.status != "requested"){
                return res.json({ status: "error", message: "Booking is not in requested state." });
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

    static async getPaymentStatus(req, res) {
        try {
            const booking = await Booking.findOne({
                where: { booking_id: req.body.booking_id },
            });
            if(await Space.checkOwnership(req.user.user_id, booking.space_id) == false){
                return res.json({ status: "error", message: "You are not authorized to update this booking.", payment_status: null});
            }
            res.json({ status: "success", message: "Payment status fetched successfully.", payment_status: booking.payment_status });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong.", payment_status: null})
        }
    }

    static async confirmPayment(req, res) {
        try {
            const booking = await Booking.findOne({
                where: { booking_id: req.body.booking_id },
            });
            if(await Space.checkOwnership(req.user.user_id, booking.space_id) == false){
                return res.json({ status: "error", message: "You are not authorized to update this booking." });
            }
            if(booking.payment_status != "paid"){
                return res.json({ status: "error", message: "Payment is not done." });
            }
            booking.payment_status = "confirmed"
            await booking.save();
            res.json({ status: "success", message: "Payment confirmed successfully." });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong." })
        }
    }

    static async rateDriver(req, res) {
        try {
            const booking = await Booking.findOne({
                where: { booking_id: req.body.booking_id },
            });
            if(await Space.checkOwnership(req.user.user_id, booking.space_id) == false){
                return res.json({ status: "error", message: "You are not authorized to update this booking." });
            }
            if(booking.status != "completed"){
                return res.json({ status: "error", message: "Booking is not completed." });
            }
            const driver = await Driver.findOne({ where: { user_id: booking.driver_id } });
            driver.rating = (driver.rating * driver.rating_count + req.body.rating) / (driver.no_ratings + 1)
            driver.no_ratings += 1
            await driver.save();
            res.json({ status: "success", message: "Driver reviewed successfully." });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong." })
        }
    }
}