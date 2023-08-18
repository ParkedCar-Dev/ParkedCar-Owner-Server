const { Model} = require('sequelize')
const bcrypt = require('bcrypt');
module.exports = class SpaceOwner extends Model {
    static init(sequelize, Sequelize) {
        var model = super.init({
            user_id: { type: Sequelize.INTEGER },
            name: { type: Sequelize.STRING, allowNull: false },
            email: { type: Sequelize.STRING, allowNull: false },
            phone: { type: Sequelize.STRING, allowNull: false },
            password: { type: Sequelize.STRING, allowNull: false }
        }, {
            sequelize,
            modelName: 'space_owner',
        })
        model.removeAttribute('id')
        return model
    }

    static async buildUser(req){
        try{
            const [name, email, phone, password] = [req.body.name, req.body.email, req.body.phone, req.body.password];
            if(!name || !email || !phone || !password) return null;
            password = await bcrypt.hash(password, 10);
            return this.build({name: name, email: email, phone: phone, password: password});
        }catch(err){
            throw err;
        }
    }

}