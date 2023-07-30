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
            res.json({ status: "success", message: "Space added successfully." });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong." })
        }
    }

    static async getSpace(req, res) {
        try {
            const space = await db.space.findOne(where = { space_id: req.params.spaceId });
            res.json({ status: "success", space: space });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", space: null })
        }
    }

    static async getSpaceByUser(req, res) {
        try {
            const spaces = await db.space.findAll(where = { user_id: req.params.userId });
            res.json({ status: "success", spaces: spaces });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", spaces: null})
        }
    }

    static async updateSpace(req, res) {
        try {
            const {
                space_id,
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

            const space = await db.space.findOne(where = { space_id: space_id });

            if (space.user_id != req.user.user_id) {
                return res.json({ status: "error", message: "You are not authorized to update this space." });
            }

            if (
                !width ||
                !length ||
                !height ||
                !base_fare ||
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
                !time_slots ||
                !space_id
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
}
