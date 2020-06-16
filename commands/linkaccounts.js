module.exports = {
    name: "linkaccounts",
    description: "Links a Discord account with a Lancer Networks Account",
    alias: ["la"],
    usage: "linkaccounts <STEAMID64>\nFollowed by \`/linkaccounts\` in game",
    permissions: "NONE",
    execute(message, args) {
        const config = require("../util/config.json");
        const dbutil = require("../util/dbutil.js");
        const logger = require("../util/logger.js");
        const sequelize = require("../index.js").sendSequelize();
        const Players = require("../index.js").sendPlayersDB();
        var steamid64 = "STEAM_0:0:145367981";

        Players.findOne({
            where: {_SteamID: steamid64}
        }).then(player =>{
            console.log(player._Data);
        })
        
        /* sequelize.query(`SELECT * FROM players WHERE _SteamID = ?`, {
            replacements: [steamid64]
        }).then(function(rows) {
            console.log(rows)
        }); */
    }
};