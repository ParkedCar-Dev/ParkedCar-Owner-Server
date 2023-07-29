const express = require("express")
const app = express();
const cors = require("cors");

app.use(cors())
app.use(express.json())

const db = require("./models");


db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });


app.get("/", async (req, res) => {
    try{
        res.json({status: "success", message: "Welcome to the Demo Server."})
    }catch(err){
        console.error(err.message)
        res.json({status: "error"})
    }
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("server has started on port: " + port)
})