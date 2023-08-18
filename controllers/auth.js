const User = require('../models/space_owner.js');

const users = {}

module.exports = class AuthController {
    static async login(req, res) {
        const user = User.buildUser(req, "login");
        if (!user) return res.json({ status: "error", message: "Invalid form submission.", token: null, refreshToken: null });
        return res.json(await user.login(users)); 
    }

    static async refresh(req, res) {
        return res.json(User.refresh(req.body.refreshToken, users));
    }

    static async logout(req, res) {
        return res.json(User.logout(req.body.refreshToken, users));
    }
}

