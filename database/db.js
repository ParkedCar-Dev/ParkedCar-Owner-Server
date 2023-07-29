const Pool = require("pg").Pool;

const dbconfig = require("../config/dbconfig.js");

console.log(dbconfig)

const pool = new Pool(dbconfig)

module.exports = pool;