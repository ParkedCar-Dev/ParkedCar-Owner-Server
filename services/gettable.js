const express  = require('express');
const router = express.Router();
const gettabledb = require("../database/gettable.js");

router.get("/", async (req, res) => {
    try{
        const result = await gettabledb.getallfromtable("details");
        res.json({status: "success", data: result})
    }catch(error){
        console.log(error)
        res.json({status: "error"})
    }
}
)

module.exports = router;