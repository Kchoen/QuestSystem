const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const quest = sequelize.define(
    "quest",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        MTYPE: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        QNAME: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        EXPLAIN: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        LONGEXPLAIN: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        PRICE: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        REPLY: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        TYPE: {
            type: Sequelize.STRING,
        },
        FINISHED: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        FINISHEDBY: {
            type: Sequelize.STRING,
        },
        PEOPLE: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
            get() {
                if (this.getDataValue("PEOPLE") == undefined) {
                    return undefined;
                } else {
                    return this.getDataValue("PEOPLE").split(";");
                }
            },
            set(val) {
                this.setDataValue("PEOPLE", val.join(";"));
            },
        },
        FOR: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
            get() {
                if (this.getDataValue("FOR") == null) {
                    return [];
                } else {
                    return this.getDataValue("FOR").split(";");
                }
            },
            set(val) {
                if (val.length == 0) {
                    this.setDataValue("FOR", null);
                } else {
                    this.setDataValue("FOR", val.join(";"));
                }
            },
        },
    },
    { timestamps: false }
);

module.exports = quest;
