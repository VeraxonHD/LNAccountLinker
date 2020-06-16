exports.log = (module, message)=>{
    var config = require("./config.json");
    return console.log(`[LNAL v${config.ver} | ${module} | LOG] - ${message}`);
}

exports.error = (module, message, error)=>{
    var config = require("./config.json");
    return console.error(`[LNAL v${config.ver} | ${module} | ERROR] - ${message}`, error);
}