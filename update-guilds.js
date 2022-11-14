const { Client, Events, GatewayIntentBits } = require(`discord.js`),
    { token } = require(`./config.json`),
    fs = require('node:fs')

const c = new Client({ intents: [GatewayIntentBits.Guilds] }) //client

c.once(Events.ClientReady, (c) => {
    console.log(`Ready! Updating guilds list for ${c.user.tag}`)

    let configName = `./config.json`
    let configuration = JSON.parse(fs.readFileSync(configName))

    configuration.guildIds = []
    c.guilds.cache.forEach((g) => {
        if (!(g.id in configuration.blockedGuildIds))
            configuration.guildIds.push(g.id)
    })

    fs.writeFileSync(configName, JSON.stringify(configuration))

    c.destroy()
})

c.login(token)
