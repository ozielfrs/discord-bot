const { Client, Events, GatewayIntentBits, Collection } = require(`discord.js`),
	{ token } = require(`./config.json`),
	fs = require('node:fs')

const c = new Client({ intents: [GatewayIntentBits.Guilds] }) //Client for Bot

c.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`)
})

c.interactions = new Collection()
c.moderation = new Collection()

const commandInteractions = fs
		.readdirSync(`./commands/interaction/`)
		.filter(file => file.endsWith(`.js`)), // Interaction Command Files
	commandModeration = fs
		.readdirSync(`./commands/moderation/`)
		.filter(file => file.endsWith(`.js`)), // Moderation Command Files
	eF = fs.readdirSync(`./events`).filter(file => file.endsWith(`.js`)) //Event Handling Files

//f for files
for (const f of commandInteractions) {
	let command = require(`./commands/interaction/${f}`)
	console.log(command.data.name)
	c.interactions.set(command.data.name, command)
}

for (const f of commandModeration) {
	let command = require(`./commands/moderation/${f}`)
	console.log(command.data.name)
	c.moderation.set(command.data.name, command)
}

for (const f of eF) {
	let e = require(`./events/${f}`)
	if (e.once) {
		c.once(e.name, (...args) => e.execute(...args))
	} else {
		c.on(e.name, (...args) => e.execute(...args))
	}
}

c.login(token)
