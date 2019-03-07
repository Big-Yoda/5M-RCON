const Discord = require('discord.js');
const fs = require('fs');
const botconfig = require('../botconfig.json');
var Q3RCon = require('quake3-rcon');

module.exports = class sendcmd {
    constructor()
    {
        this.prefix = botconfig.prefix,
        this.name = 'rcon',
        this.alias = ['rcon'],
        this.usage = this.prefix + this.name + " <Command>"
    }

    async run(bot, message, args)
    {
        console.log(args[0]);
        try
        {
            if (message.author.bot) return;
            if (message.channel.type === 'dm') return;
            if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`:x: Insufficient Permission`);
            message.delete();
            let cfg = JSON.parse(fs.readFileSync(`./configs/config.json`, "utf8"));
            if (!cfg[message.guild.id]) return message.channel.send(`:x: RCON Info has not been set on this server. Use "->set IP:PORT"`);
            var rcon = new Q3RCon({
                address: cfg[message.guild.id].ip,
                port: parseInt(cfg[message.guild.id].port),
                password: cfg[message.guild.id].password,
                debug: false
            });
            let command = args.join(" ").slice(this.name.length + this.prefix.length + 1);
			rcon.send(command);
			message.channel.send(`Command sent! \`${command}\`\n**Command Sender:** *${message.author.tag}!*`);
        return;
        }
        catch (err)
        {
            console.log(`Error in command ${this.name}`)
            console.log(err)
            return;
        }
    }
}
