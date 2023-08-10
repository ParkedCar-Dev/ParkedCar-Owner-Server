const db = require("../models");

module.exports = class SpaceController {
    static async addSpace(req, res) {
        try {
            const [
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
                time_slots
            ] = [
                req.body.width,
                req.body.length,
                req.body.height,
                req.body.base_fare,
                req.body.security_measures,
                req.body.status,
                req.body.rating,
                req.body.total_books,
                req.body.auto_approve,
                req.body.address,
                req.body.city,
                req.body.latitude,
                req.body.longitude,
                req.body.availability_mask,
                req.body.time_slots
            ]
            const user_id = req.user.user_id;

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
                rating,
                total_books,
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
                req.body.rating,
                req.body.total_books,
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
