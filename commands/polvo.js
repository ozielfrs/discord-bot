const { SlashCommandBuilder } = require(`@discordjs/builders`),
    { Colors } = require(`discord.js`),
    { subsAllMentions, random } = require(`./Functions/commandFunctions.js`)

let cmdTxt = {
    name: `polvo`,
    desc: `O polvo decide qual a melhor entre duas opções (ele pode mudar de opinião).`,
    opt1: {
        name: `primeira`,
        desc: `Escreva a primeira opção.`,
        req: true,
    },
    opt2: {
        name: `segunda`,
        desc: `Escreva a segunda opção.`,
        req: true,
    },
    emb: {
        title: `#0 PERGUNTOU AO 🐙!`,
        color: Colors.Purple,
        txt: {
            opts:
                `A primeira opção era: #1\n` +
                `A segunda opção era: #2\n` +
                `MAS O 🐙 DECIDIU ESCOLHER A MELHOR ENTRE ELAS!`,
            desc: `\nO :octopus: DECIDIU QUE NENHUMA DAS OPÇÕES É DIGNA!`,
            final: `\nA escolha do 🐙 é: #0!`,
        },
        images: [
            //special one
            `https://i.imgur.com/IJN4w4N.png`,

            `https://media3.giphy.com/media/VEDzdxyskXK5G/giphy.gif`,
            `https://media3.giphy.com/media/3o7TKyUM9by4m4QlMI/giphy.gif`,
            `https://media0.giphy.com/media/hicmfOv3Ue0mY/giphy.gif`,
            `https://c.tenor.com/4IP82gvPN9IAAAAC/poulpette-poulpies.gif`,
            `https://c.tenor.com/SHfIrV3Ozc0AAAAC/spongebob-squarepants-squidward.gif`,
            `https://c.tenor.com/kOvzITcdBJcAAAAC/adorabilis-dumbo-octopus.gif`,
            `https://c.tenor.com/-ANBMe4vEKEAAAAi/funder-the-sea-octopus.gif`,
            `https://c.tenor.com/CQOtdA2_8okAAAAC/squid_girl-squid.gif`,
            `https://c.tenor.com/uXDPbEULXtsAAAAM/squidward-handsome.gif`,
            `https://c.tenor.com/dtwnYquTNhMAAAAS/sus-imposter.gif`,
        ],
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
        .addStringOption((option) =>
            option
                .setName(cmdTxt.opt1.name)
                .setDescription(cmdTxt.opt1.desc)
                .setRequired(cmdTxt.opt1.req)
        )
        .addStringOption((option) =>
            option
                .setName(cmdTxt.opt2.name)
                .setDescription(cmdTxt.opt2.desc)
                .setRequired(cmdTxt.opt2.req)
        ),

    async execute(interaction) {
        let midterm = Number(10)

        let octopus_choice = random(midterm * 2),
            op1 = interaction.options.getString(cmdTxt.opt1.name),
            op2 = interaction.options.getString(cmdTxt.opt2.name)

        let str1 = subsAllMentions(`${op1}`, interaction),
            str2 = subsAllMentions(`${op2}`, interaction)

        let op = cmdTxt.emb.txt.opts.replace(`#1`, str1).replace(`#2`, str2)

        let guild = interaction.guild

        let member = guild.members.cache.find(
            (user) => user.id === interaction.user.id
        )

        let embed = {
            author: {
                name: `${member.displayName} (${member.user.tag})`,
                url: String(),
                iconURL: member.displayAvatarURL(cmdTxt.imgFmt),
                proxyIconURL: String(),
            },
            color: cmdTxt.emb.color,
            description: String(),
            footer: {
                text: op,
                iconURL: guild.iconURL(cmdTxt.imgFmt),
                proxyIconURL: String(),
            },
            hexColor: cmdTxt.emb.color,
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
            title: cmdTxt.emb.title.replace(`#0`, member.displayName),
            url: String(),
            video: {
                url: String(),
                proxyURL: String(),
                height: Number(),
                width: Number(),
            },
        }

        if (octopus_choice <= midterm)
            if (octopus_choice === midterm) {
                embed.description = cmdTxt.emb.txt.desc
                embed.image.url = cmdTxt.emb.images.at(
                    cmdTxt.emb.images.length - 1
                )
            } else {
                embed.description = cmdTxt.emb.txt.final.replace(`#0`, op1)
                embed.image.url = cmdTxt.emb.images.at(
                    random(cmdTxt.emb.images.length - 2)
                )
            }
        else {
            embed.description = cmdTxt.emb.txt.final.replace(`#0`, op2)
            embed.image.url = cmdTxt.emb.images.at(
                random(cmdTxt.emb.images.length - 2)
            )
        }
        await interaction.reply({ embeds: [embed] })
    },
}
