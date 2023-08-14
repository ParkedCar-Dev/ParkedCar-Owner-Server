const { user } = require("../config/dbconfig");
const db = require("../models");

module.exports = class SpaceController {
    static async addSpace(req, res) {
        if(process.env.DEBUG == "True"){
            console.log("req")
            console.log(req.body)
        }
        try {
            const [
                width,
                length,
                height,
                base_fare,
                security_measures,
                status,
                auto_approve,
                address,
                city,
                latitude,
                longitude,
            ] = [
                req.body.width,
                req.body.length,
                req.body.height,
                req.body.base_fare,
                req.body.security_measures,
                req.body.status,
                req.body.auto_approve,
                req.body.address,
                req.body.city,
                req.body.latitude,
                req.body.longitude,
            ]
            const user_id = req.user.user_id;
            const availability_mask = "mask"
            const time_slots = new Array(24 * 7).fill(true)
            if(process.env.DEBUG == "True") {
                console.log("params:")
                console.log("width: " + width)
                console.log("length: " + length)
                console.log("height: " + height)
                console.log("base_fare: " + base_fare)  
                console.log("user_id: " + user_id)
                console.log("security_measures: " + security_measures)
                console.log("status: " + status)
                console.log("auto_approve: " + auto_approve)
                console.log("address: " + address)
                console.log("city: " + city)
                console.log("latitude: " + latitude)
                console.log("longitude: " + longitude)
            }

            if (
                width == null || width == undefined ||
                length == null || length == undefined ||
                height == null || height == undefined ||
                base_fare == null || base_fare == undefined ||
                security_measures == null || security_measures == undefined ||
                status == null || status == undefined ||
                auto_approve == null || auto_approve == undefined ||
                address == null || address == undefined ||
                city == null || city == undefined ||
                latitude == null || latitude == undefined ||
                longitude == null || longitude == undefined ||
                user_id == null || user_id == undefined
            ) {
                return res.json({ status: "error", message: "Invalid form submission." });
            }
            await db.space.create({
                width: width,
                length: length,
                height: height,
                base_fare: base_fare,
                user_id: user_id,
                security_measures: security_measures,
                status: status,
                auto_approve: auto_approve,
                address: address,
                city: city,
                latitude: latitude,
                longitude: longitude,
                availability_mask: availability_mask,
                time_slots: time_slots,
            });
            res.json({ status: "success", message: "Space added successfully." });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong." })
        }
    }

    static async getSpace(req, res) {
        try {
            const space = await db.space.findOne({
                where: { space_id: req.body.space_id },
            });
            res.json({ status: "success", space: space });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", space: null })
        }
    }

    static async getMySpaces(req, res) {
        try {
            const spaces = await db.space.findAll({
                where: { user_id: req.user.user_id },
            });
            res.json({ status: "success", spaces: spaces });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", spaces: null})
        }
    }

    static async updateSpace(req, res) {
        try {
            const [
                width,
                length,
                height,
                base_fare,
                security_measures,
                status,
                auto_approve,
                address,
                city,
                latitude,
                longitude,
                availability_mask,
                time_slots
            ] = [
                req.body.width,
                req.body.length,
                req.body.height,
                req.body.base_fare,
                req.body.security_measures,
                req.body.status,
                req.body.auto_approve,
                req.body.address,
                req.body.city,
                req.body.latitude,
                req.body.longitude,
                req.body.availability_mask,
                req.body.time_slots
            ]

            const space = await db.space.findOne({
                where: { space_id: space_id },
            });

            if (space.user_id != req.user.user_id) {
                return res.json({ status: "error", message: "You are not authorized to update this space." });
            }

            if (
                width == null || width == undefined ||
                length == null || length == undefined ||
                height == null || height == undefined ||
                base_fare == null || base_fare == undefined ||
                security_measures == null || security_measures == undefined ||
                status == null || status == undefined ||
                auto_approve == null || auto_approve == undefined ||
                address == null || address == undefined ||
                city == null || city == undefined ||
                latitude == null || latitude == undefined ||
                longitude == null || longitude == undefined ||
                availability_mask == null || availability_mask == undefined ||
                time_slots == null || time_slots == undefined ||
                space_id == null || space_id == undefined
            ) {
                return res.json({ status: "error", message: "Invalid form submission." });
            }
            await db.space.update({
                width: width,
                length: length,
                height: height,
                base_fare: base_fare,
                security_measures: security_measures,
                status: status,
                rating: rating,
                total_books: total_books,
                auto_approve: auto_approve,
                address: address,
                city: city,
                latitude: latitude,
                longitude: longitude,
                availability_mask: availability_mask,
                time_slots: time_slots,
            }, where = { space_id: space_id });
            res.json({ status: "success", message: "Space updated successfully." });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong." })
        }
    }

    static async deleteSpace(req, res) {
        try {
            const space = await db.space.findOne({
                where: { space_id: req.body.spaceId },
            });

            if (space.user_id != req.user.user_id) {
                return res.json({ status: "error", message: "You are not authorized to delete this space." });
            }

            await db.space.destroy({
                where: { space_id: req.body.spaceId },
            });
            res.json({ status: "success", message: "Space deleted successfully." });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong." })
        }
    }

    static async getActiveSpaces(req, res) {
        try {
            const spaces = await db.space.findAll({
                where: { user_id: req.user.user_id, status: "active" },
            });
            res.json({ status: "success", spaces: spaces });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", spaces: null })
        }
    }

    static async getDisabledSpaces(req, res) {
        try {
            const spaces = await db.space.findAll({
                where: { user_id: req.user.user_id, status: "disabled" },
            });
            res.json({ status: "success", spaces: spaces });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", spaces: null })
        }
    }

    static async getRequestedSpaces(req, res) {
        try {
            const spaces = await db.space.findAll({
                where: { user_id: req.user.user_id, status: "requested" },
            });
            res.json({ status: "success", spaces: spaces });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", spaces: null })
        }
    }

    static async changeSpaceStatus(req, res) {
        try {
            const space = await db.space.findOne({
                where: { space_id: req.body.spaceId },
            });

            if (space.user_id != req.user.user_id) {
                return res.json({ status: "error", message: "You are not authorized to change this space status." });
            }

            await db.space.update({
                status: req.body.status
            }, {
                where: { space_id: req.body.spaceId },
            });
            res.json({ status: "success", message: "Space status changed successfully." });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong." })
        }
    }
}
