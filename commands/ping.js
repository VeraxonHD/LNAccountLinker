module.exports = {
    name: "ping",
    description: "Test bot awareness",
    alias: ["p", "latency"],
    usage: "ping",
    permissions: "NONE",
    execute(message, args) {
        return message.channel.send("Pong!");
    }
};