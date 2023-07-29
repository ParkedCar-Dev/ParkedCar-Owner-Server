const express  = require('express');
const router = express.Router();
const gettabledb = require("../database/gettable.js");
const updatestatus = require("../database/updatestatus.js");

router.post("/", async (req, res) => {
    console.log(req.body)
    const {id, status} = req.body;
    const result = await updatestatus.updatestatus(id, status);
    res.json({status: "success", data: result})



    // try{
    //     const result = await gettabledb.getallfromtable("details");
    //     res.json({status: "success", data: result})
    // }catch(error){
    //     console.log(error)
    //     res.json({status: "error"})
    // }
}
)

module.exports = router;