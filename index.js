const { Client, Events, GatewayIntentBits, Collection } = require(`discord.js`),
    { token } = require(`./config.json`),
    fs = require('node:fs')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`)
})

client.commands = new Collection()

const commandFiles = fs
        .readdirSync(`./commands/`)
        .filter((file) => file.endsWith(`.js`)),
    eventFiles = fs
        .readdirSync(`./events`)
        .filter((file) => file.endsWith(`.js`))

for (let file of commandFiles) {
    let command = require(`./commands/${file}`)
    client.commands.set(command.data.name, command)
}

for (const file of eventFiles) {
    let event = require(`./events/${file}`)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

client.login(token)
