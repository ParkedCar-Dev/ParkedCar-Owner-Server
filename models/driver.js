const { Model} = require('sequelize')
const bcrypt = require('bcrypt');
module.exports = class Driver extends Model {
    static init(sequelize, Sequelize) {
        var model = super.init({
            user_id: { type: Sequelize.INTEGER },
            name: { type: Sequelize.STRING, allowNull: false },
            email: { type: Sequelize.STRING, allowNull: false },
            phone: { type: Sequelize.STRING, allowNull: false },
            password: { type: Sequelize.STRING, allowNull: false },
            rating: { type: Sequelize.DOUBLE, allowNull: true , defaultValue: 0 },
            no_ratings: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
        }, {
            sequelize,
            modelName: 'driver',
        })
        model.removeAttribute('id')
        return model
    }

}