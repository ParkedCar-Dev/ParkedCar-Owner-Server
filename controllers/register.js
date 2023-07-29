const db = require('../models');
const space_owner = db.space_owner;
const bcrypt = require('bcrypt');

module.exports = class RegisterController{
    static async register(req, res){
        try{
            const {name, email, phone, password} = req.body;
            if (!name || !email || !phone || !password){
                return res.json({status: "error", message: "Invalid form submission."})
            }
            const existingUser = await space_owner.findOne({where: {email: email}})
            if (existingUser){
                return res.json({status: "error", message: "User already exists."})
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            await space_owner.create({name: name, email: email, phone: phone, password: hash})
            res.json({status: "success", message: "User registered successfully."})
        }catch(err){
            console.error(err.message)
            res.json({status: "error"})
        }
    }
}