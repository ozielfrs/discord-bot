const { SlashCommandBuilder, Colors } = require(`discord.js`)

let cmd = {
    local: `pt-br`,
    name: `chess`,
    desc: `Use para jogar xadres com um usuário`,
    opt: {
        name: `mention`,
        desc: `Marque um usuário`,
        req: true,
    },
    fmt: {
        size: 256,
        dynamic: true,
    },
    color: Colors.Blue,
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

    async execute(e) {
        let guild = e.guild
        let member = guild.members.cache.find((usr) => usr.id === e.user.id),
            mention = guild.members.cache.find(
                (usr) => usr.id === e.options.getUser(cmd.opt.name).id
            )

        let emb = {
            author: {
                name: member.displayName,
                url: String(),
                iconURL: member.displayAvatarURL(cmd.fmt),
                proxyIconURL: String(),
            },
            color: cmd.color,
            description:
                `⬜⬛⬜⬛⬜⬛⬜⬛\n` +
                `⬛⬜⬛⬜⬛⬜⬛⬜\n` +
                `⬜⬛⬜⬛⬜⬛⬜⬛\n` +
                `⬛⬜⬛⬜⬛⬜⬛⬜\n` +
                `⬜⬛⬜⬛⬜⬛⬜⬛\n` +
                `⬛⬜⬛⬜⬛⬜⬛⬜\n` +
                `⬜⬛⬜⬛⬜⬛⬜⬛\n` +
                `⬛⬜⬛⬜⬛⬜⬛⬜\n`,
            footer: {
                text: `Chess game between: ${member.displayName} and ${mention.displayName}`,
                iconURL: guild.iconURL(cmd.fmt),
                proxyIconURL: String(),
            },
            image: {
                url: String(``),
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

        await e.reply({ embeds: [emb] })
    },
}
