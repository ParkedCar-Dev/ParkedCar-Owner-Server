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
            status: { type: Sequelize.STRING, allowNull: false },
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
            time_slots: { type: Sequelize.ARRAY(Sequelize.BOOLEAN), allowNull: false }
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
                security_measures: security_measures, status: status, auto_approve: auto_approve, address: address,
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
}  