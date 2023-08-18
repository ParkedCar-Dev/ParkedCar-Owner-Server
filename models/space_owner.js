const { Model} = require('sequelize')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
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

    static buildUser(req, mode){
        if(mode === "login"){
            const [email, password] = [req.body.email, req.body.password];
            if(!email || !password) return null;
            return this.build({email: email, password: password});
        }
        const [name, email, phone, password] = [req.body.name, req.body.email, req.body.phone, req.body.password];
        if(!name || !email || !phone || !password) return null;
        return this.build({name: name, email: email, phone: phone, password: password});
    }

    async register(){
        try{
            const existingUser = await SpaceOwner.findOne({where: {email: this.email}})
            if (existingUser){
                return {status: "error", message: "User already exists."}
            }
            const hash = await bcrypt.hash(this.password, 10);
            await SpaceOwner.create({name: this.name, email: this.email, phone: this.phone, password: hash})
            return {status: "success", message: "User registered successfully."}
        }catch(err){
            console.error(err.message)
            return {status: "error", message: "Something went wrong."}
        }
    }

    async login(users){
        try{
            const user = await SpaceOwner.findOne({ where: { email: this.email } })
            if (!user) {
                return { status: "error", message: "Invalid email or password.", token: null, refreshToken: null }
            }
            const isMatch = await bcrypt.compare(this.password, user.password)
            if (!isMatch){
                return { status: "error", message: "Invalid email or password.", token: null, refreshToken: null }
            }
            const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "5h" });
            const refreshToken = crypto.randomBytes(64).toString("hex");
            users[refreshToken] = user.user_id;
            return { status: "success", message: "User logged in successfully.", token: token, refreshToken: refreshToken }
        }catch(err){
            console.error(err.message)
            return {status: "error", message: "Something went wrong.", token: null, refreshToken: null}
        }
    }

    static async refresh(refreshToken, users){
        try{
            if(!refreshToken) return {status: "error", message: "Invalid form submission.", token: null}
            const userId = users[refreshToken];
            if(!userId) return {status: "error", message: "Invalid refresh token.", token: null}
            const user = await SpaceOwner.findOne({ where: { user_id: userId } });
            if(!user) return {status: "error", message: "Invalid refresh token.", token: null}
            const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return {status: "success", message: "Token refreshed successfully.", token: token}
        }catch(err){
            console.error(err.message)
            return {status: "error", message: "Something went wrong.", token: null}
        }
    }

    static async logout(refreshToken, users){
        try{
            if(!refreshToken) return {status: "error", message: "Invalid form submission."}
            const userId = users[refreshToken];
            if(!userId) return {status: "error", message: "Invalid refresh token."}
            delete users[refreshToken];
            return {status: "success", message: "User logged out successfully."}
        }catch(err){
            console.error(err.message)
            return {status: "error", message: "Something went wrong."}
        }
    }

}