const Sequelize = require("sequelize");

const sequelize = new Sequelize("mapledb", "root", "password", {
    dialect: "mysql",
    host: "localhost",
    //query: { raw: true },
    logging: false,
});

module.exports = sequelize;
