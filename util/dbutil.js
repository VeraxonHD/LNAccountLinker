exports.getRowBySteamID = (steamid64)=>{
    /* const config = require("./config.json");
    const Sequelize = require("sequelize");
    const sequelize = new Sequelize(config.db.name, config.db.user, config.db.pw, {
        host: config.db.host.ip,
        dialect: "mysql"
    }); */
    const sequelize = require("../index.js").sendSequelize();
    sequelize.query(`SELECT * FROM players WHERE _SteamID = ?`, {
        replacements: [steamid64]
    }).then(function(rows) {
        return{rows}
    });
}