const { SlashCommandBuilder } = require(`@discordjs/builders`)

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

    async execute(e) {
        let guild = e.guild

        let mention
        e.options.getUser(cmd.opt.name)
            ? (mention = guild.members.cache.find(
                  (user) => user.id === e.options.getUser(cmd.opt.name).id
              ))
            : null,
            (member = guild.members.cache.find((user) => user.id === e.user.id))

        let emb = {
            author: {
                name: member.displayName,
                url: String(),
                iconURL: member.displayAvatarURL(cmd.fmt),
                proxyIconURL: String(),
            },
            color: mention ? mention.displayColor : member.displayColor,
            description: `Conta criada em: ${
                mention
                    ? mention.user.createdAt.toLocaleString(cmd.local, {
                          timeZone: 'UTC',
                      })
                    : member.user.createdAt.toLocaleString(cmd.local, {
                          timeZone: 'UTC',
                      })
            }.`,
            footer: {
                text: `Pertence ao servidor desde: ${
                    mention
                        ? mention.joinedAt.toLocaleString(cmd.local, {
                              timeZone: 'UTC',
                          })
                        : member.joinedAt.toLocaleString(cmd.local, {
                              timeZone: 'UTC',
                          })
                }\n`,
                iconURL: guild.iconURL(cmd.fmt),
                proxyIconURL: String(),
            },
            hexColor: member.displayHexColor,
            image: {
                url: mention
                    ? mention.displayAvatarURL(cmd.fmt)
                    : member.displayAvatarURL(cmd.fmt),
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
            timestamp: e.createdAt,
            title: `Informações de ${
                mention ? mention.displayName : member.displayName
            } (${mention ? mention.user.tag : member.user.tag})`,
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
