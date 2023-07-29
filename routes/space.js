const express = require("express");

const router = express.Router();

const spaceController = require("../controllers/space");

router.post("/add", spaceController.addSpace);
router.get("/getSpace/:space_id", spaceController.getSpace);
router.get("/getSpaceByUser/:user_id", spaceController.getSpaceByUser);


module.exports = router;