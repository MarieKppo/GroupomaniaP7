// import dotenv
const dotenv = require("dotenv").config();

module.exports = {
    groupomaniaId: process.env.DB_ID,
    groupomaniaPW: process.env.DB_PW,
    token: process.env.TOKEN
}