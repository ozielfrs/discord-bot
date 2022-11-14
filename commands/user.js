const { SlashCommandBuilder } = require(`@discordjs/builders`),
    { CommandInteraction } = require('discord.js'),
    { badgesFromDisc } = require(`../function/bagdes/discordBadges`)

let cmd = {
    local: `pt-br`,
    name: `user`,
    desc: `Responde com a informação do usuário mencionado, ou do usuário que tiver usado o comando.`,
    opt: {
        name: `mention`,
        desc: `Marque um usuário`,
        req: false,
    },
    fmt: {
        size: 256,
        dynamic: true,
    },
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName(cmd.name)
        .setDescription(cmd.desc)
        .addUserOption((op) =>
            op
                .setName(cmd.opt.name)
                .setDescription(cmd.opt.desc)
                .setRequired(cmd.opt.req)
        ),

    /**
     *
     * @param {CommandInteraction} e
     */
    async execute(e) {
        let guild = e.guild

        let mention = e.options.getUser(cmd.opt.name)
                ? guild.members.cache.find(
                      (user) => user.id === e.options.getUser(cmd.opt.name).id
                  )
                : guild.members.cache.find((user) => user.id === e.user.id),
            fields = [
                {
                    inline: true,
                    name: String(`Conta criada:`),
                    value: String(
                        `<t:${(
                            mention.user.createdTimestamp * 1e-3
                        ).toFixed()}:R>`
                    ),
                },
                {
                    inline: true,
                    name: String(`Pertence ao servidor:`),
                    value: String(
                        `<t:${(mention.joinedTimestamp * 1e-3).toFixed()}:R>`
                    ),
                },
                {
                    inline: true,
                    name: String(`ID:`),
                    value: String(mention.user.id),
                },
            ]

        let badges = mention.user.flags.toArray(),
            badgesField = {
                inline: true,
                name: String(`Flags:`),
                value: String(`🌌 Working on it`),
            }

        if (badges.length != 0) {
            badgesField.value = badges
                .map(
                    (val) =>
                        (val = badgesFromDisc.find((e) => e.name === val).emoji)
                )
                .join(` `)
        }

        fields.push(badgesField)

        let emb = {
            author: {
                name: String(`${mention.displayName} (${mention.user.tag})`),
                url: String(),
                icon_url: String(),
                proxy_icon_url: String(),
            },
            color: Number(mention.displayColor),
            description: String(),
            fields: fields,
            footer: {
                text: String(guild.name),
                icon_url: String(guild.iconURL()),
                proxy_icon_url: String(),
            },
            image: {
                height: Number(),
                width: Number(),
                url: String(mention.displayAvatarURL(cmd.fmt)),
                proxy_url: String(),
            },
            provider: {
                name: String(),
                url: String(),
            },
            thumbnail: {
                height: Number(),
                width: Number(),
                url: String(),
                proxy_url: String(),
            },
            timestamp: String(new Date().toISOString()),
            title: String(),
            url: String(),
            video: {
                height: Number(),
                width: Number(),
                url: String(),
                proxy_url: String(),
            },
        }

        await e.reply({ embeds: [emb] })
    },
}
