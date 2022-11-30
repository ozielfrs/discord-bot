const { configPath } = require(`./configPath`)

const { Client, GatewayIntentBits, Collection } = require(`discord.js`),
	{ token } = require(configPath),
	fs = require(`node:fs`)

const client = new Client({ intents: GatewayIntentBits.Guilds })

/**
 * Path for commands and commands array
 */
const commandPaths = fs
	.readdirSync(`./public/src/cmd`, { withFileTypes: true })
	.filter(dirent => dirent.isDirectory())
	.map(dirent => dirent.name)

/**
 * Find and add subcommands
 */
commandPaths.forEach(dirName => {
	client[`${dirName}`] = new Collection()

	const subCommandFiles = fs
		.readdirSync(`./public/src/cmd/${dirName}`)
		.filter(sub => sub.endsWith(`.js`) && !sub.includes(`${dirName}`))

	console.log(dirName, subCommandFiles)

	subCommandFiles.forEach(fileName => {
		let command = require(`./public/src/cmd/${dirName}/${fileName}`)

		client[`${dirName}`].set(`${dirName} ${command.data.name}`, command)
	})
})

let eventFiles = fs
	.readdirSync(`./public/src/event`)
	.filter(file => file.endsWith(`.js`))

for (const file of eventFiles) {
	let event = require(`./public/src/event/${file}`)
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args))
	} else {
		client.on(event.name, (...args) => event.execute(...args))
	}
}

client
	.login(token)
	.then(() => {
		console.log(`Bot started, ${client.user.tag}.`)
	})
	.catch(err => console.error(err))
