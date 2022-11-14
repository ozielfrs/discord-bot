const { REST } = require(`@discordjs/rest`),
    { Routes } = require(`discord-api-types/v10`),
    { clientId, guildIds, token } = require(`./config.json`),
    fs = require(`node:fs`)

//cmd for commands
const cmds = []
// Grab all the command files from the commands directory you created earlier
const cF = fs.readdirSync(`./commands`).filter((file) => file.endsWith(`.js`))

// Grab the SlashCommandBuilder#toJSON() output of each command`s data for deployment
for (const f of cF) {
    const cmd = require(`./commands/${f}`)
    cmds.push(cmd.data.toJSON())
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: `10` }).setToken(token)

// and deploy your commands!
;(async () => {
    try {
        console.log(
            `Started refreshing ${cmds.length} application (/) commands.`
        )

        // The put method is used to fully refresh all commands in the guild with the current set
        for (const g of guildIds) {
            const d = await rest.put(
                Routes.applicationGuildCommands(clientId, g),
                { body: cmds }
            )
            console.log(
                `Successfully reloaded ${d.length} application (/) commands in ${g}.`
            )
        }
    } catch (err) {
        // And of course, make sure you catch and log any errors!
        console.error(err)
    }
})()
