const { Client, Events, GatewayIntentBits, Collection } = require(`discord.js`),
    { token } = require(`./config.json`),
    fs = require('node:fs')

const c = new Client({ intents: [GatewayIntentBits.Guilds] }) //client

c.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`)
})

c.commands = new Collection()

const cF = fs.readdirSync(`./commands/`).filter((file) => file.endsWith(`.js`)), //command files
    eF = fs.readdirSync(`./events`).filter((file) => file.endsWith(`.js`)) //event files

//f for files
for (let f of cF) {
    let command = require(`./commands/${f}`)
    c.commands.set(command.data.name, command)
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
