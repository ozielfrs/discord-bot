const { SlashCommandBuilder } = require(`@discordjs/builders`),
    { CommandInteraction } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName(cmd.name).setDescription(cmd.desc),

    /**
     *
     * @param {CommandInteraction} e
     */
    async execute(e) {
        let emb = {
            author: {
                name: String(`Test`),
                url: String(),
                icon_url: String(),
                proxy_icon_url: String(),
            },
            color: Number(),
            description: String(),
            fields: [
                {
                    inline: true,
                    name: String(`Example`),
                    value: String(`Example`),
                },
            ],
            footer: {
                text: String(`Example`),
                icon_url: String(),
                proxy_icon_url: String(),
            },
            image: {
                height: Number(),
                width: Number(),
                url: String(),
                proxy_url: String(),
            },
            provider: {
                name: String(`Example`),
                url: String(),
            },
            thumbnail: {
                height: Number(),
                width: Number(),
                url: String(),
                proxy_url: String(),
            },
            timestamp: String(new Date().toISOString()),
            title: String(`Example`),
            url: String(),
            video: {
                height: Number(),
                width: Number(),
                url: String(),
                proxy_url: String(),
            },
        }

        await e.reply({
            embeds: [emb],
        })
    },
}
