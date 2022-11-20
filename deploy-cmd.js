const { REST } = require(`@discordjs/rest`),
	{ Routes } = require(`discord-api-types/v10`),
	{ cliID, GuildIDs, token } = require(`./private/conf/config.json`),
	fs = require(`node:fs`)

/**
 * Path for commands and commands array
 */
const cmdPath = fs
		.readdirSync(`./public/src/cmd`, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name),
	commands = []

/**
 * Find and add subcommands
 */
cmdPath.forEach(file => {
	let main = require(`./public/src/cmd/${file}/${file}.js`)

	const subCommandFiles = fs
		.readdirSync(`./public/src/cmd/${file}`)
		.filter(sub => sub.endsWith(`.js`) && !sub.includes(`${file}`))

	console.log(file, subCommandFiles)

	const slashWithSubs = main.data

	subCommandFiles.forEach(fileName => {
		let command = require(`./public/src/cmd/${file}/${fileName}`)
		slashWithSubs.addSubcommand(command.data)
	})

	commands.push(slashWithSubs.toJSON())
})

const rest = new REST({ version: `10` }).setToken(token)

;(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`)

		for (const guild of GuildIDs) {
			const req = await rest.put(Routes.applicationGuildCommands(cliID, guild), {
				body: commands,
			})

			console.log(
				`Successfully reloaded ${req.length} application (/) commands in ${guild}.`
			)
		}
	} catch (err) {
		console.error(err)
	}
})()
