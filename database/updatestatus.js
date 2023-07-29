const express = require("express")
const app = express();
const cors = require("cors");
const pool = require("./db.js");
const queries = require("./queries.js");
const defaults = require("../constant/constant.js");

app.use(cors())
app.use(express.json())

async function updatestatus(id, status){
    try{
        const result = await pool.query(queries.UPDATE_STATUS, [status, id]);
        return result.rows;
    }catch (error){
        console.log(error.message);
        throw error;
    }
}


module.exports = {
    updatestatus
}