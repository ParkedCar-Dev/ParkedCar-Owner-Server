const express = require("express")
const cors = require("cors");
const db = require("./models");
const regRoute = require("./routes/register")

const app = express();
app.use(express.json())
app.use(cors())


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

app.use("/register", regRoute)

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("server has started on port: " + port)
})