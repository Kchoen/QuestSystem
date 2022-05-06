const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const user = sequelize.define(
    "user",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        UNAME: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        PASSWORD: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        CNAME: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        JOB: {
            type: Sequelize.STRING,
        },
        LVL: {
            type: Sequelize.INTEGER,
            defaultValue: 10,
        },
    },
    { timestamps: false }
);

module.exports = user;
