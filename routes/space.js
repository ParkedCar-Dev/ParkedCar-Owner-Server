const express = require("express");

const router = express.Router();

const spaceController = require("../controllers/space");

router.post("/add", spaceController.addSpace);
router.get("/getSpace/:space_id", spaceController.getSpace);
router.get("/getMySpaces", spaceController.getMySpaces);
router.post("/updateSpace", spaceController.updateSpace);
router.post("/deleteSpace", spaceController.deleteSpace);
router.get("/getActiveSpaces", spaceController.getActiveSpaces);
router.get("/getDisabledSpaces", spaceController.getDisabledSpaces);
router.get("/getRequestedSpaces", spaceController.getRequestedSpaces);
router.post("/changeSpaceStatus", spaceController.changeSpaceStatus);


module.exports = router;