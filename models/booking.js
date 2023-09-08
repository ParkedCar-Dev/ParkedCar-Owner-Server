const {Model, Op} = require('sequelize')

module.exports = class Booking extends Model{
    static init(sequelize, Sequelize){
        var model = super.init({
            booking_id: { type: Sequelize.INTEGER },
            space_id: { type: Sequelize.INTEGER, allowNull: false },
            driver_id: { type: Sequelize.INTEGER, allowNull: false },
            from_time: { type: Sequelize.BIGINT, allowNull: false },
            to_time: { type: Sequelize.BIGINT, allowNull: false },
            status: { type: Sequelize.STRING, allowNull: false },
            created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
            updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
            total_price: { type: Sequelize.DOUBLE, allowNull: false },
            payment_id: { type: Sequelize.STRING, allowNull: false },
            payment_status: { type: Sequelize.STRING, allowNull: false },
            payment_medium: { type: Sequelize.STRING, allowNull: false },
            medium_transaction_id: { type: Sequelize.STRING, allowNull: false },
            base_price: { type: Sequelize.DOUBLE, allowNull: false },
        }, {
            sequelize,
            modelName: 'booking',
        })
        model.removeAttribute('id')
        return model
    }

    static async getOwnerBookings(user_id, status){
        return await Booking.sequelize.query(
            `SELECT booking.booking_id, booking.from_time, booking.to_time, booking.status, booking.base_fare,
            booking.total_price as total_fare, booking.payment_id, booking.payment_status, booking.payment_medium, 
            driver.name as driver_name, driver.rating as driver_rating, 
            space.address as address, space.city as city,
            booking.total_price - booking.base_fare as time_fare
            FROM booking 
            INNER JOIN space ON booking.space_id = space.space_id 
            INNER JOIN driver ON booking.driver_id = driver.user_id 
            WHERE space.user_id = :user_id AND booking.status = :status`,
            {
                replacements: {user_id: user_id, status: status},
                type: Booking.sequelize.QueryTypes.SELECT
            }
        )
    }

    static async getAllSpaceBookings(space_id){
        return await Booking.findAll({
            where: {
                space_id: space_id
            }
        })
    }

    static async getBookingByStatus(space_id, status){
        return await Booking.sequelize.query(
            `SELECT booking.booking_id, booking.from_time, booking.to_time, booking.status, booking.base_fare,
            booking.total_price as total_fare, booking.payment_id, booking.payment_status, booking.payment_medium, 
            driver.name as driver_name, driver.rating as driver_rating, 
            space.address as address, space.city as city,
            booking.total_price - booking.base_fare as time_fare
            FROM booking 
            INNER JOIN space ON booking.space_id = space.space_id 
            INNER JOIN driver ON booking.driver_id = driver.user_id 
            WHERE booking.space_id = :space_id AND booking.status = :status`,
            {
                replacements: {space_id: space_id, status: status},
                type: Booking.sequelize.QueryTypes.SELECT
            }
        )
    }

    static async getBookingDetails(booking_id){
        return await Booking.sequelize.query(
            `SELECT booking.booking_id, booking.from_time, booking.to_time, booking.status, booking.space_id, booking.base_fare,
            booking.total_price as total_fare, booking.payment_id, booking.payment_status, booking.payment_medium, 
            driver.name as driver_name, driver.rating as driver_rating, 
            space.address as address, space.city as city,
            booking.total_price - booking.base_fare as time_fare
            FROM booking 
            INNER JOIN space ON booking.space_id = space.space_id 
            INNER JOIN driver ON booking.driver_id = driver.user_id 
            WHERE booking.booking_id = :booking_id`,
            {
                replacements: {booking_id: booking_id},
                type: Booking.sequelize.QueryTypes.SELECT
            }
        )
    }
}


