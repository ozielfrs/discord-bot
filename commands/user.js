const { SlashCommandBuilder } = require(`@discordjs/builders`),
    { MessageEmbed } = require(`discord.js`)

let cmdTxt = {
    locale: `pt-br`,
    name: `user`,
    desc: `Responde com a informação do usuário mencionado, ou do usuário que tiver usado o comando.`,
    opt: {
        name: `mention`,
        desc: `Marque um usuário`,
        req: false,
    },
    imgFmt: {
        size: 256,
        dynamic: true,
    },
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName(cmdTxt.name)
        .setDescription(cmdTxt.desc)
        .addUserOption((option) =>
            option
                .setName(cmdTxt.opt.name)
                .setDescription(cmdTxt.opt.desc)
                .setRequired(cmdTxt.opt.req)
        ),

    async execute(interaction) {
        let guild = interaction.guild

        let mention
        interaction.options.getUser(cmdTxt.opt.name)
            ? (mention = guild.members.cache.find(
                  (user) =>
                      user.id ===
                      interaction.options.getUser(cmdTxt.opt.name).id
              ))
            : null,
            (member = guild.members.cache.find(
                (user) => user.id === interaction.user.id
            ))

        let embed = {
            author: {
                name: member.displayName,
                url: String(),
                iconURL: member.displayAvatarURL(cmdTxt.imgFmt),
                proxyIconURL: String(),
            },
            color: mention ? mention.displayColor : member.displayColor,
            description: `Conta criada em: ${
                mention
                    ? mention.user.createdAt.toLocaleString(cmdTxt.locale, {
                          timeZone: 'UTC',
                      })
                    : member.user.createdAt.toLocaleString(cmdTxt.locale, {
                          timeZone: 'UTC',
                      })
            }.`,
            footer: {
                text: `Pertence ao servidor desde: ${
                    mention
                        ? mention.joinedAt.toLocaleString(cmdTxt.locale, {
                              timeZone: 'UTC',
                          })
                        : member.joinedAt.toLocaleString(cmdTxt.locale, {
                              timeZone: 'UTC',
                          })
                }\n`,
                iconURL: guild.iconURL(cmdTxt.imgFmt),
                proxyIconURL: String(),
            },
            hexColor: member.displayHexColor,
            image: {
                url: mention
                    ? mention.displayAvatarURL(cmdTxt.imgFmt)
                    : member.displayAvatarURL(cmdTxt.imgFmt),
                proxyURL: String(),
                height: Number(256),
                width: Number(256),
            },
            length: Number(),
            thumbnail: {
                url: String(),
                proxyURL: String(),
                height: Number(),
                width: Number(),
            },
            timestamp: interaction.createdAt,
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

        await interaction.reply({ embeds: [embed] })
    },
}
