const { conf } = require(`./paths`)
const { token } = require(conf)

const { Client, GatewayIntentBits } = require(`discord.js`)
const fs = require(`node:fs`)

const client = new Client({ intents: GatewayIntentBits.Guilds })

client
	.login(token)
	.then(() => {
		console.log(`Updating guilds list...`)
		let conf = JSON.parse(fs.readFileSync(conf))

		conf.Guilds = []
		client.guilds.cache.forEach(guild => {
			if (!(guild.id in conf.blockedGuilds))
				conf.Guilds.push({ id: guild.id, options: ['game', 'info'] })
		})

		fs.writeFileSync(conf, JSON.stringify(conf))

		console.log(`Guilds list updated.`)
	})
	.then(() => client.destroy())
	.catch(err => console.error(err))
