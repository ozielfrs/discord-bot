const { SlashCommandBuilder } = require(`@discordjs/builders`),
    { CommandInteraction } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName(`ping`).setDescription(`Não use.`),

    /**
     *
     * @param {CommandInteraction} e
     */
    async execute(e) {
        await e.reply({
            content: `https://img.itch.zone/aW1hZ2UvMjgwNjAyLzEzNjIxMTkucG5n/315x250%23c/oHMecM.png`,
            ephemeral: true,
        })
    },
}
