const User = require('../models/space_owner.js');

module.exports = class RegisterController{
    static async register(req, res){
        const user = User.buildUser(req, "register");
        if(!user) return res.json({status: "error", message: "Invalid form submission."});
        return res.json(await user.register());
    }
}