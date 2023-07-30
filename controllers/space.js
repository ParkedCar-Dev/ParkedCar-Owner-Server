const { where } = require("sequelize");
const db = require("../models");

module.exports = class SpaceController {
    static async addSpace(req, res) {
        try {
            const {
                width,
                length,
                height,
                base_fare,
                security_measures,
                status,
                rating,
                total_books,
                auto_approve,
                address,
                city,
                latitude,
                longitude,
                availability_mask,
                time_slots,
            } = req.body;
            const user_id = req.user.user_id;
            console.log(req.body)

            if (
                !width ||
                !length ||
                !height ||
                !base_fare ||
                !user_id ||
                !security_measures ||
                !status ||
                !rating ||
                !total_books ||
                !auto_approve ||
                !address ||
                !city ||
                !latitude ||
                !longitude ||
                !availability_mask ||
                !time_slots
            ) {
                return res.json({
                    status: "error",
                    message: "Invalid form submission.",
                });
            }
            await db.space.create({
                width: width,
                length: length,
                height: height,
                base_fare: base_fare,
                user_id: user_id,
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
            });
            res.json({
                status: "success",
                message: "Space added successfully.",
            });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error" })
        }
    }

    static async getSpace(req, res) {
        try {
            const space = await db.space.findOne(where = { space_id: req.params.spaceId });
            res.json({
                status: "success",
                space: space,
            });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error" })
        }
    }

    static async getSpaceByUser(req, res) {
        try {
            const space = await db.space.findAll(where = { user_id: req.params.userId });
            res.json({
                status: "success",
                space: space,
            });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error" })
        }
    }
}
