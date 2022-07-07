const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { MessageEmbed } = require(`discord.js`);
const {
  subsAllMentions,
  getRandomInt,
} = require(`./Functions/commandFunctions.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`polvo`)
    .setDescription(
      `O polvo decide qual a melhor entre duas opções (ele pode mudar de opinião).`
    )
    .addStringOption((option) =>
      option
        .setName(`primeira`)
        .setDescription(`Escreva a primeira opção.`)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName(`segunda`)
        .setDescription(`Escreva a segunda opção.`)
        .setRequired(true)
    ),

  async execute(interaction) {
    let str1 = String(`${interaction.options.getString(`primeira`)}`);
    let str2 = String(`${interaction.options.getString(`segunda`)}`);

    str1 = subsAllMentions(str1, interaction);
    str2 = subsAllMentions(str2, interaction);

    let op = String(
      `A primeira opção era: ` +
      str1 +
      `\nA segunda opção era: ` +
      str2 +
      `\nMAS O 🐙 DECIDIU ESCOLHER A MELHOR ENTRE ELAS!`
    );

    let embed = new MessageEmbed()
      .setColor(`#be29ec`)
      .setTitle(`${interaction.user.tag} PERGUNTOU AO :octopus:!`)
      .setFooter({ text: op, iconURL: undefined });

    let octopus_image = [
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
    ];

    let octopus_choice = getRandomInt(0, 5000);
    if (octopus_choice <= 2500)
      if (octopus_choice === 2500)
        embed
          .setDescription(
            `\nO :octopus: DECIDIU QUE NENHUMA DAS OPÇÕES É DÍGNA!`
          )
          .setImage(octopus_image.at(octopus_image.length - 1));
      else
        embed
          .setDescription(
            `\nA escolha do :octopus: é: ${interaction.options.getString(
              `primeira`
            )}!`
          )
          .setImage(
            octopus_image.at(getRandomInt(0, octopus_image.length - 2))
          );
    else
      embed
        .setDescription(
          `\nA escolha do :octopus: é: ${interaction.options.getString(
            `segunda`
          )}!`
        )
        .setImage(octopus_image.at(getRandomInt(0, octopus_image.length - 2)));

    await interaction.reply({ embeds: [embed] });
  },
};
