const dbConfig = require("../config/dbconfig.js");

const Sequelize = require("sequelize");
console.log(dbConfig)
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
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

db.space_owner = require("./space_owner.js").init(sequelize, Sequelize); 
db.space = require("./space.js").init(sequelize, Sequelize);
db.booking = require("./booking.js").init(sequelize, Sequelize);
module.exports = db;