const {Model} = require('sequelize')
const Utils = require('../utils/utils')

module.exports = class Space extends Model{
    static init(sequelize, Sequelize){
        var model = super.init({
            space_id: { type: Sequelize.INTEGER },
            width: { type: Sequelize.DOUBLE, allowNull: false },
            length: { type: Sequelize.DOUBLE, allowNull: false },
            height: { type: Sequelize.DOUBLE, allowNull: false },
            base_fare: { type: Sequelize.DOUBLE, allowNull: false },
            user_id: { type: Sequelize.INTEGER, allowNull: false },
            security_measures: { type: Sequelize.STRING, allowNull: false },
            status: { type: Sequelize.STRING, allowNull: false, defaultValue: "disabled" },
            rating: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0 },
            total_books: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
            auto_approve: { type: Sequelize.BOOLEAN, allowNull: false },
            address: { type: Sequelize.STRING, allowNull: false },
            city: { type: Sequelize.STRING, allowNull: false },
            latitude: { type: Sequelize.DOUBLE, allowNull: false },
            longitude: { type: Sequelize.DOUBLE, allowNull: false },
            created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
            updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
            availability_mask: { type: Sequelize.STRING, allowNull: false },
            time_slots: { type: Sequelize.ARRAY(Sequelize.BOOLEAN), allowNull: false },
            no_ratings: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
            }, {
                sequelize,
                modelName: 'space',
        })
        model.removeAttribute('id')
        return model
    }

    static buildSpace(req){
        try {
            const [
                width, length, height, base_fare,
                security_measures, status, auto_approve, 
                address,  city, latitude, longitude,
            ] = [
                req.body.width, req.body.length, req.body.height, req.body.base_fare,
                req.body.security_measures, req.body.status, req.body.auto_approve,
                req.body.address, req.body.city, req.body.latitude, req.body.longitude,
            ]
            const user_id = req.user.user_id;
            const availability_mask = "mask"
            const time_slots = new Array(24 * 7).fill(true)
        
            if ( Utils.checkNullOrUndefined([width, length, height, base_fare, security_measures, status, auto_approve, address, city, latitude, longitude, user_id])){
                return null
            }
            
            return this.build({
                width: width, length: length, height: height, base_fare: base_fare, user_id: user_id,
                security_measures: security_measures, auto_approve: auto_approve, address: address,
                city: city, latitude: latitude, longitude: longitude, availability_mask: availability_mask, time_slots: time_slots,
            });
        }catch(err){
            throw err;
        }
    }

    setSpaceValues(req){
        const [
            width, length, height, base_fare,
            security_measures, status, auto_approve, address, city,
            latitude, longitude, availability_mask, time_slots
        ] = [
            req.body.width, req.body.length, req.body.height, req.body.base_fare,
            req.body.security_measures, req.body.status, req.body.auto_approve, req.body.address, req.body.city,
            req.body.latitude, req.body.longitude
        ]

        if ( Utils.checkNullOrUndefined([width, length, height, base_fare, security_measures, status, auto_approve, address, city, latitude, longitude])){
            return false
        }

        this.set({
            width: width, length: length, height: height, base_fare: base_fare,
            security_measures: security_measures, status: status, auto_approve: auto_approve, address: address,
            city: city, latitude: latitude, longitude: longitude
            });
        return true
    }

    static async getActiveSpaces(user_id){
        return this.sequelize.query(
            `SELECT s.*, COUNT(b.booking_id) AS request_count 
            FROM space s 
            LEFT JOIN booking b ON b.space_id = s.space_id AND b.status = 'requested'
            WHERE s.status = 'active'
            AND s.user_id = :user_id
            GROUP BY s.space_id`,
            { replacements: { user_id: user_id }, type: this.sequelize.QueryTypes.SELECT }
        );
    }

    static async getDisabledSpaces(user_id){
        return this.findAll({
            where: { user_id: user_id, status: "disabled" },
        });
    }

    static async getRequestedSpaces(user_id){
        return this.findAll({
            where: { user_id: user_id, status: "requested" },
        });
    }

    async getBookings(){
        return this.sequelize.booking.findAll({
            where: { space_id: this.space_id },
        });
    }

    static async checkOwnership(user_id, space_id){
        const space = await this.findOne({ where: { space_id: space_id } })
        if (space == null){
            return false
        }
        return space.user_id == user_id
    }
}  