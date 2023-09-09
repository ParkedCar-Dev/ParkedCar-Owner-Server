const Booking = require("../models/booking");
const Space = require("../models/space");

module.exports = class SpaceController {
    static async addSpace(req, res) {
        if(process.env.DEBUG == "True"){
            console.log("req")
            console.log(req.body)
        }
        try {
            const space = Space.buildSpace(req);
            if (space == null) {
                return res.json({ status: "error", message: "Invalid form submission." });
            }
            await space.save();
            res.json({ status: "success", message: "Space added successfully." });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong." })
        }
    }

    static async getSpace(req, res) {
        try {
            const space = await Space.findOne({
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
            const spaces = await Space.findAll({
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
            const space_id = req.body.space_id;
            const space = await Space.findOne({
                where: { space_id: space_id },
            });
            if(space.user_id != req.user.user_id){
                return res.json({ status: "error", message: "You are not authorized to update this space." });
            }
            if(space.setSpaceValues(req) == false){
                return res.json({ status: "error", message: "Invalid form submission." });
            }
            await space.save();
            res.json({ status: "success", message: "Space updated successfully." });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong." })
        }
    }

    static async deleteSpace(req, res) {
        try {
            const space = await Space.findOne({
                where: { space_id: req.body.spaceId },
            });
            if (space.user_id != req.user.user_id) {
                return res.json({ status: "error", message: "You are not authorized to delete this space." });
            }
            space.status = "deleted";
            await space.save();
            res.json({ status: "success", message: "Space deleted successfully." });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", message: "Something went wrong." })
        }
    }

    static async getActiveSpaces(req, res) {
        try {
            await Booking.sequelize.query(
                `CALL update_booking_status(:user_id, :now)`,
                {
                    replacements: {user_id: req.user.user_id, now: Date.now()}
                }
            )

            const spaces = await Space.getActiveSpaces(req.user.user_id);
            res.json({ status: "success", spaces: spaces });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", spaces: null })
        }
    }

    static async getDisabledSpaces(req, res) {
        try {
            const spaces = await Space.getDisabledSpaces(req.user.user_id);
            res.json({ status: "success", spaces: spaces });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", spaces: null })
        }
    }

    static async getRequestedSpaces(req, res) {
        try {
            //Booking.updateStatus(req.body.space_id);
            const spaces = await Space.getRequestedSpaces(req.user.user_id);
            res.json({ status: "success", spaces: spaces });
        } catch (err) {
            console.error(err.message)
            res.json({ status: "error", spaces: null })
        }
    }

    static async changeSpaceStatus(req, res) {
        try {
            const space = await Space.findOne({
                where: { space_id: req.body.spaceId },
            });
            if(space == null){
                return res.json({ status: "error", message: "Invalid space id." });
            }
            if (space.user_id != req.user.user_id) {
                return res.json({ status: "error", message: "You are not authorized to change this space status." });
            }
            await Space.update({
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
