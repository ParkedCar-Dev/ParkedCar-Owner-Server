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
        }, {
            sequelize,
            modelName: 'booking',
        })
        model.removeAttribute('id')
        return model
    }

    static async getOwnerBookings(user_id){
        return await Booking.sequelize.query(
            "SELECT * FROM booking INNER JOIN space ON booking.space_id = space.space_id WHERE space.user_id = :user_id",
            {
                replacements: {user_id: user_id},
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

    static async getActiveBookings(space_id){
        return await Booking.findAll({
            where: {
                space_id: space_id,
                status: "active"
            }
        })
    }

    static async getRequestedBookings(space_id){
        return await Booking.findAll({
            where: {
                space_id: space_id,
                status: "requested"
            }
        })
    }

    static async getCompletedBookings(space_id){
        return await Booking.findAll({
            where: {
                space_id: space_id,
                status: "completed"
            }
        })
    }

    static async getCancelledBookings(space_id){
        return await Booking.findAll({
            where: {
                space_id: space_id,
                status: "cancelled"
            }
        })
    }

    static async getDeclinedBookings(space_id){
        return await Booking.findAll({
            where: {
                space_id: space_id,
                status: "declined"
            }
        })
    }
}


