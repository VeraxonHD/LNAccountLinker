//Global Dependencies
var Discord = require("discord.js");
var client = new Discord.Client();
var config = require("./util/config.json");
var Sequelize = require("sequelize");
var fs = require("fs");
var logger = require("./util/logger.js");
const { INTEGER } = require("sequelize");

//System Globals
var prefix = config.prefix;
const sequelize = new Sequelize(config.db.name, config.db.user, config.db.pw, {
    host: config.db.host.ip,
    dialect: "mysql"
});

client.login(config.token);

var Model = Sequelize.Model;
class Players extends Model {}
Players.init({
    _Key: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    _Data: Sequelize.JSON,
    _Schema: Sequelize.STRING,
    _SteamID: Sequelize.STRING,
    _Donations: Sequelize.STRING,
    _UserGroup: Sequelize.STRING,
    _IPAddress: Sequelize.STRING,
    _SteamName: Sequelize.STRING,
    _OnNextPlay: Sequelize.STRING,
    _LastPlayed: Sequelize.STRING,
    _TimeJoined: Sequelize.STRING

}, { sequelize, modelName: 'players', timestamps: false });

//Exports
exports.sendSequelize = () =>{
    return sequelize;
}
exports.sendPlayersDB = () =>{
    return Players;
}

client.on("ready", ()=>{
    client.user.setPresence({ game: { name: `LNAL Dev Mode v${config.ver}`, type: "Playing" }, status: 'idle' });
    console.log(`[LANCER NETWORKS ACCOUNT LINKER v${config.ver}] - Bot Service Initialised Successfully.`);

    sequelize.authenticate().then(()=>{
        logger.log("SEQUELIZE", `Connected to Database ${config.db.name}`);
        /* sequelize.query('SELECT * FROM players WHERE _SteamID = "STEAM_0:0:145367981"').then(function(rows) {
            console.log(JSON.stringify(rows, null, 1));
        }); */
    }).catch(err =>{
        logger.error("SEQUELIZE", `Failed to Connect to Database ${config.db.name}`, err);
    });

    client.commands = new Discord.Collection();
    const commandDirArray = fs.readdirSync("./commands");
    commandDirArray.forEach(e => {
        logger.log("E.READY", `Adding module ${e} to Command Collection`);
        const commandFile = require(`./commands/${e}`);
        client.commands.set(commandFile.name, commandFile);
    });
});

client.on("message", (message)=>{
    if(!message.content.startsWith(config.prefix)) return;
    if(message.channel.type == "text"){
        const args = message.content.slice(prefix.length).split(" ");
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandName));
        
        if(!command){
            return;
        }
        
        try{
            command.execute(message, args, prefix, client, Discord);
            logger.log("E.MESSAGE.EXECUTE", `${message.author.tag} (${message.author.id}) used command ${commandName}`)
        }catch(error){
            logger.error("E.MESSAGE", "Could not Execute a Command - See Error Details.", error);
            const embed = new Discord.MessageEmbed()
            .addField("An Error Occured.", error.message)
            .setTimestamp(new Date())
            .setColor("#ff0000");
            message.channel.send({embed});
        }
    }
});

client.on("guildMemberUpdate", (oldMember, newMember) =>{
    var oldRoles = oldMember.roles.cache;
    var newRoles = newMember.roles.cache;
    var guild = newMember.guild;
    var donatorRole = guild.roles.cache.get(config.donatorRole);
    if(!donatorRole) return;

    if(!oldRoles.has(config.donatorRole) && newRoles.has(config.donatorRole)){
        logger.log("E.GUILDMEMBERUPDATE.ASSIGN", `User ${newMember.user.tag} (${newMember.id}) gained the Donator Role (${donatorRole.name})`);
        newMember.send(`Hello! Thanks so much for donating to Lancer Networks. You've been automatically assigned the Donator Role **${donatorRole.name}** as part of your rewards.\nTo gain instant access to in-game rewards automatically, please go in-game and type the /linkaccounts command. You'll then recieve additional instructions which will help you verify and link your account.`);
    }else if(oldRoles.has(config.donatorRole) && !newRoles.has(config.donatorRole)){
        logger.log("E.GUILDMEMBERUPDATE.REMOVE", `User ${newMember.user.tag} (${newMember.id}) lost the Donator Role (${guild.roles.cache.get(config.donatorRole).name})`);
        newMember.send(`Hi there! Sad to see you leave our supporter program, but don't worry! If you choose to come back, your rewards will automatically be attributed to your account (as long as you've linked your account previously)! Take care \:)`);
    }
});