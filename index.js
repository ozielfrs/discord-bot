const confPath = `./private/conf/config.json`

const { Client, GatewayIntentBits, Collection } = require(`discord.js`),
	{ token } = require(confPath),
	fs = require(`node:fs`)

const CLI = new Client({ intents: GatewayIntentBits.Guilds })

/**
 * Path for commands and commands array
 */
const cmdPath = fs
	.readdirSync(`./public/src/cmd`, { withFileTypes: true })
	.filter(dirent => dirent.isDirectory())
	.map(dirent => dirent.name)

/**
 * Find and add subcommands
 */
cmdPath.forEach(dirName => {
	CLI[`${dirName}`] = new Collection()

	const subCommandFiles = fs
		.readdirSync(`./public/src/cmd/${dirName}`)
		.filter(sub => sub.endsWith(`.js`) && !sub.includes(`${dirName}`))

	console.log(dirName, subCommandFiles)

	subCommandFiles.forEach(fileName => {
		let command = require(`./public/src/cmd/${dirName}/${fileName}`)

		CLI[`${dirName}`].set(`${dirName} ${command.data.name}`, command)
	})
})

let eventFiles = fs
	.readdirSync(`./public/src/event`)
	.filter(file => file.endsWith(`.js`))

for (const file of eventFiles) {
	let e = require(`./public/src/event/${file}`)
	if (e.once) {
		CLI.once(e.name, (...args) => e.execute(...args))
	} else {
		CLI.on(e.name, (...args) => e.execute(...args))
	}
}

CLI.login(token)
	.then(() => {
		console.log(`Updating guilds list...`)
		let conf = JSON.parse(fs.readFileSync(confPath))

		conf.GuildIDs = []
		CLI.guilds.cache.forEach(guild => {
			if (!(guild.id in conf.blockedGuildIDs)) conf.GuildIDs.push(guild.id)
		})

		fs.writeFileSync(confPath, JSON.stringify(conf))

		console.log(`Guilds list updated.`)
	})
	.then(() => {
		console.log(`Bot started, ${CLI.user.tag}.`)
	})
	.catch(err => console.error(err))
