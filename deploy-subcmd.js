const { conf } = require(`./paths`)
const { cliID, Guilds, token } = require(conf)

const { REST } = require(`@discordjs/rest`)
const { Routes } = require(`discord-api-types/v10`)
const fs = require(`node:fs`)

/**
 * Path for commands and commands array
 */
const commandPaths = fs
		.readdirSync(`./src/cmd`, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name),
	commands = []

/**
 * Find and add subcommands
 */
commandPaths.forEach(file => {
	let main = require(`./src/cmd/${file}/${file}.js`)

	const subCommandFiles = fs
		.readdirSync(`./src/cmd/${file}`)
		.filter(sub => sub.endsWith(`.js`) && !sub.includes(`${file}`))

	console.log(file, subCommandFiles)

	const slashWithSubs = main.data

	subCommandFiles.forEach(fileName => {
		let command = require(`./src/cmd/${file}/${fileName}`)
		slashWithSubs.addSubcommand(command.data)
	})

	commands.push(slashWithSubs.toJSON())
})

const rest = new REST({ version: `10` }).setToken(token)

;(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`)

		for (const guild of Guilds) {
			let request = await rest
				.put(Routes.applicationGuildCommands(cliID, `${guild.id}`), {
					body: commands.filter(command => guild.options.includes(command.name)),
				})
				.catch(err => console.error(err))

			console.log(
				`Successfully reloaded ${request.length} application (/) commands in ${guild.id}.`
			)
		}
	} catch (err) {
		console.error(err)
	}
})()
