const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { MessageEmbed } = require(`discord.js`);
const {
    subsAllMentions,
    getRandomInt,
} = require(`./Functions/commandFunctions.js`);

let command = {
    name: `polvo`,
    description: `O polvo decide qual a melhor entre duas opções (ele pode mudar de opinião).`,
    opt1: {
        name: `first`,
        description: `Escreva a primeira opção.`,
    },
    opt2: {
        name: `second`,
        description: `Escreva a segunda opção.`,
    },
    images: [
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
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
        .addStringOption((option) =>
            option
                .setName(command.opt1.name)
                .setDescription(command.opt1.description)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName(command.opt2.name)
                .setDescription(command.opt2.description)
                .setRequired(true)
        ),

    async execute(interaction) {
        let op1 = interaction.options.getString(command.opt1.name),
            op2 = interaction.options.getString(command.opt2.name);
        let str1 = subsAllMentions(`${op1}`, interaction);
        let str2 = subsAllMentions(`${op2}`, interaction);

        let op =
            `A primeira opção era: ` +
            str1 +
            `\nA segunda opção era: ` +
            str2 +
            `\nMAS O 🐙 DECIDIU ESCOLHER A MELHOR ENTRE ELAS!`;

        let embed = new MessageEmbed()
            .setColor(`#be29ec`)
            .setTitle(`${interaction.user.tag} PERGUNTOU AO 🐙!`)
            .setFooter({ text: op, iconURL: undefined });

        let octopus_choice = getRandomInt(0, 5000);
        if (octopus_choice <= 2500)
            if (octopus_choice === 2500)
                embed
                    .setDescription(
                        `\nO :octopus: DECIDIU QUE NENHUMA DAS OPÇÕES É DIGNA!`
                    )
                    .setImage(command.images.at(command.images.length - 1));
            else
                embed
                    .setDescription(`\nA escolha do 🐙 é: ${op1}!`)
                    .setImage(
                        command.images.at(
                            getRandomInt(0, command.images.length - 2)
                        )
                    );
        else
            embed
                .setDescription(`\nA escolha do 🐙 é: ${op2}!`)
                .setImage(
                    command.images.at(
                        getRandomInt(0, command.images.length - 2)
                    )
                );

        await interaction.reply({ embeds: [embed] });
    },
};
