const { SlashCommandBuilder } = require(`@discordjs/builders`)

let cmd = {
    local: `pt-br`,
    name: `test`,
    desc: `Mensagem de teste...`,
    fmt: {
        size: 256,
        dynamic: true,
    },
}

module.exports = {
    data: new SlashCommandBuilder().setName(cmd.name).setDescription(cmd.desc),

    async execute(e) {
        let guild = e.guild
        let member = guild.members.cache.find((user) => user.id === e.user.id)

        let emb = {
            author: {
                name: member.displayName,
                url: String(),
                iconURL: member.displayAvatarURL(cmd.fmt),
                proxyIconURL: String(),
            },
            color: member.displayColor,
            description: `Embed for testing`,
            footer: {
                text: guild.name,
                iconURL: guild.iconURL(cmd.fmt),
                proxyIconURL: String(),
            },
            image: {
                url: String(),
                proxyURL: String(),
                height: Number(),
                width: Number(),
            },
            length: Number(),
            thumbnail: {
                url: String(),
                proxyURL: String(),
                height: Number(),
                width: Number(),
            },
            timestamp: String(),
            title: String(),
            url: String(),
            video: {
                url: String(),
                proxyURL: String(),
                height: Number(),
                width: Number(),
            },
        }

        await e.reply({
            embeds: [emb],
        })
    },
}

/* Prototype
        author: {
            name: String(),
            url: String(),
            iconURL: String(),
            proxyIconURL: String(),
        },
        color: Number(),
        description: String(),
        footer: {
            text: String(),
            iconURL: String(),
            proxyIconURL: String(),
        },
        hexColor: String(),
        image: {
            url: String(),
            proxyURL: String(),
            height: Number(),
            width: Number(),
        },
        length: Number(),
        thumbnail: {
            url: String(),
            proxyURL: String(),
            height: Number(),
            width: Number(),
        },
        timestamp: String(),
        title: String(),
        url: String(),
        video: {
            url: String(),
            proxyURL: String(),
            height: Number(),
            width: Number(),
        },
*/
