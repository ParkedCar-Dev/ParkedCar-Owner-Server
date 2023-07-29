const dbConfig = require("../config/dbconfig.js");

const Sequelize = require("sequelize");
console.log(dbConfig)
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: {
    freezeTableName: true,
    timestamps: false
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.driver = require("./driver.js")(sequelize, Sequelize);

db.driver.create({
  name: "John Doe",
  email: "syef",
  password: "123456",
  phone: "123456",
}).then((driver) => {
  console.log("Created driver: " + JSON.stringify(driver, null, 2));
}).catch((err) => {
  console.log("Failed to create driver: " + err.message);
});
module.exports = db;