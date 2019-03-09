const Discord = require('discord.js');
const botconfig = require('../botconfig.json');
const fs = require('fs');
const request = require('request');

module.exports = class set {
    constructor()
    {
        this.name = 'set',
        this.prefix = '->',
        this.alias = ['setrcon'],
        this.usage = '->set IP:PORT'
    }

    async run(bot, message, args)
    {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`:x: Insufficient Permission!`);
        let cfg = JSON.parse(fs.readFileSync(`./configs/config.json`, "utf8"));
        let ipandport = args[1].split(":");
        let pswd;
        if (!ipandport[1]) return message.channel.send(`:x: Please specify IP, Port & Rcon Password. Ex. ${this.usage}`);
        message.author.send(`Rcon password:`).then(msg => {
            const filter = m => m.author.id === message.author.id;
            msg.channel.awaitMessages(filter, { max: 1, time: 100000 }).then(daMessage => {
				console.log(daMessage.first().content);
                if (!cfg[message.guild.id])
                {
                    cfg[message.guild.id] = {
                        ip: ipandport[0],
                        port: ipandport[1],
                        password: daMessage.first().content
                    }
                }
                else
                {
                    cfg[message.guild.id].ip = ipandport[0];
                    cfg[message.guild.id].port = ipandport[1];
                    cfg[message.guild.id].password = daMessage.first().content;
                }
                msg.channel.send(`:white_check_mark: Rcon password set!`);
                fs.writeFileSync(`./configs/config.json`, JSON.stringify(cfg, null, 4));
			});
        });
		console.log(cfg);
            let setEmbed = new Discord.RichEmbed()
                .setTitle(`FiveM RCON`)
                .setDescription(`You set **"${message.guild.name}"** Rcon Info!`)
                .setFooter(`IP & Port: ${ipandport[0]}:${ipandport[1]}`);
            message.channel.send(setEmbed);
        return;
    }
}
