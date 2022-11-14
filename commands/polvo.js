const { SlashCommandBuilder } = require(`@discordjs/builders`),
    { CommandInteraction, Colors } = require(`discord.js`),
    { random } = require(`../function/cmdAux`)

let cmd = {
    name: `polvo`,
    desc: `O polvo decide qual a melhor entre duas opções (ele pode mudar de opinião).`,
    strmax: 256,
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
            opt1: `A primeira opção era`,
            opt2: `A segunda opção era`,
            dec: `O 🐙 DECIDIU ESCOLHER A MELHOR ENTRE ELAS!`,
            none: `\nO 🐙 DECIDIU QUE NENHUMA DAS OPÇÕES É DIGNA!`,
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
            `https://media.tenor.com/r3nufeNFSKAAAAAC/wiggle-wiggles.gif`,
            `https://media.tenor.com/PUv6MEdmjjsAAAAC/dance-octopus.gif`,

            //another speacial one
            `https://c.tenor.com/dtwnYquTNhMAAAAS/sus-imposter.gif`,
        ],
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
        .addStringOption((op) =>
            op
                .setName(cmd.opt1.name)
                .setDescription(cmd.opt1.desc)
                .setRequired(cmd.opt1.req)
                .setMaxLength(cmd.strmax)
        )
        .addStringOption((op) =>
            op
                .setName(cmd.opt2.name)
                .setDescription(cmd.opt2.desc)
                .setRequired(cmd.opt2.req)
                .setMaxLength(cmd.strmax)
        ),

    /**
     *
     * @param {CommandInteraction} e
     */
    async execute(e) {
        let midterm = Number(50)

        let octopus_choice = random(midterm * 2),
            op1 = e.options.getString(cmd.opt1.name),
            op2 = e.options.getString(cmd.opt2.name),
            guild = e.guild

        let member = guild.members.cache.find((user) => user.id === e.user.id)

        let emb = {
            author: {
                name: String(`${member.displayName} (${member.user.tag})`),
                url: String(),
                icon_url: String(member.displayAvatarURL()),
                proxy_icon_url: String(),
            },
            color: Number(cmd.emb.color),
            description: String(),
            fields: [
                {
                    inline: true,
                    name: String(cmd.emb.txt.opt1),
                    value: String(op1),
                },
                {
                    inline: true,
                    name: String(cmd.emb.txt.opt2),
                    value: String(op2),
                },
            ],
            footer: {
                text: String(cmd.emb.txt.dec),
                icon_url: String(guild.iconURL()),
                proxy_icon_url: String(),
            },
            image: {
                height: Number(),
                width: Number(),
                url: String(),
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
            title: String(cmd.emb.title.replace(`#0`, member.displayName)),
            url: String(),
            video: {
                height: Number(),
                width: Number(),
                url: String(),
                proxy_url: String(),
            },
        }

        if (octopus_choice < midterm) {
            emb.description = cmd.emb.txt.final.replace(`#0`, op1)
            emb.image.url = cmd.emb.images.at(random(cmd.emb.images.length - 2))
        } else if (octopus_choice == midterm) {
            emb.description = cmd.emb.txt.none
            emb.image.url = cmd.emb.images.at(cmd.emb.images.length - 1)
        } else {
            emb.description = cmd.emb.txt.final.replace(`#0`, op2)
            emb.image.url = cmd.emb.images.at(random(cmd.emb.images.length - 2))
        }

        await e.reply({ embeds: [emb] })
    },
}
