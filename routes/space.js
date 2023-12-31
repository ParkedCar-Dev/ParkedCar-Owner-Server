const express = require("express");

const router = express.Router();

const spaceController = require("../controllers/space");

router.post("/add", spaceController.addSpace);
router.post("/update", spaceController.updateSpace);
router.get("/getSpace", spaceController.getSpace);
router.get("/getMySpaces", spaceController.getMySpaces);
router.post("/deleteSpace", spaceController.deleteSpace);
router.get("/getActiveSpaces", spaceController.getActiveSpaces);
router.get("/getDisabledSpaces", spaceController.getDisabledSpaces);
router.get("/getRequestedSpaces", spaceController.getRequestedSpaces);
router.post("/changeSpaceStatus", spaceController.changeSpaceStatus);


module.exports = router;