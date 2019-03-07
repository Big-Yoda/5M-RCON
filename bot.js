const Discord = require('discord.js');
const bot = new Discord.Client();
const botconfig = require(`./botconfig.json`);
const { CommandHandler } = require('djs-commands');
const CH = new CommandHandler({
	folder: __dirname + "/cmds/",
	prefix: [botconfig.prefix]
});


bot.on('ready', () => {
	let botGuilds = bot.guilds;
	let activity = 0;
	let guildSizes = 0;
	bot.guilds.forEach(function(a) {
		guildSizes = guildSizes + a.members.size;
	});
	const activities = [
		`Serving ${botGuilds.size} Servers!`,
		`Serving ${guildSizes} Clients!`
	];
	setInterval(() => {
		activity++;
		if (activity > activities.length - 1) { activity = 0; }
		bot.user.setActivity(`${activities[activity]} | ${botconfig.prefix}help`);
	}, 5 * 1000)
});

bot.on("message", async message => {
    let args = message.content.split(" ");
    let cmd = args[0];
    const command = CH.getCommand(cmd);
    if (!command) return;
	try
	{
		command.run(bot, message, args);
	}
	catch (err)
	{
		console.log(err);
	}
});

bot.on('guildCreate', guild => {
	bot.emit('ready');
});

bot.login(botconfig.token);
