const { SlashCommandBuilder } = require(`@discordjs/builders`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`test`)
        .setDescription(`Comando de teste...`),

    async execute(interaction) {
        let guild = interaction.guild
        let member = guild.members.cache.find(
            (user) => user.id === interaction.user.id
        )

        let embed = {
            author: {
                name: member.displayName,
                url: String(),
                iconURL: member.displayAvatarURL({
                    dynamic: true,
                }),
                proxyIconURL: String(),
            },
            color: member.displayColor,
            description: `Embed for testing`,
            footer: {
                text: `Sample Text`,
                iconURL: guild.iconURL({
                    dynamic: true,
                }),
                proxyIconURL: String(),
            },
            hexColor: member.displayHexColor,
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

        await interaction.reply({
            embeds: [embed],
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
