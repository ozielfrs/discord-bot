const { configPath } = require(`./configPath`)

const { Client, GatewayIntentBits } = require(`discord.js`),
	{ token } = require(configPath),
	fs = require(`node:fs`)

const CLI = new Client({ intents: GatewayIntentBits.Guilds })

CLI.login(token)
	.then(() => {
		console.log(`Updating guilds list...`)
		let conf = JSON.parse(fs.readFileSync(configPath))

		conf.Guilds = []
		CLI.guilds.cache.forEach(guild => {
			if (!(guild.id in conf.blockedGuilds))
				conf.Guilds.push({ id: guild.id, options: ['game', 'info'] })
		})

		fs.writeFileSync(configPath, JSON.stringify(conf))

		console.log(`Guilds list updated.`)
	})
	.then(() => CLI.destroy())
	.catch(err => console.error(err))
