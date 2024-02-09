const { SlashCommandSubcommandBuilder } = require(`@discordjs/builders`);
const { CommandInteraction, Colors } = require(`discord.js`);
const { random } = require(`../func/func`);

const images = [
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
];

const cmd = {
  name: `polvo`,
  description: `O polvo decide qual a melhor entre duas opções (ele pode mudar de opinião).`,
  max_size: 256,
  stringOption1: {
    name: `primeira`,
    description: `Escreva a primeira opção.`,
    required: true,
  },
  StringOption2: {
    name: `segunda`,
    description: `Escreva a segunda opção.`,
    required: true,
  },
  embed: {
    title: `#0 PERGUNTOU AO 🐙!`,
    color: Colors.Purple,
    choice: `\nA escolha do 🐙 é: #0!`,

    images: images,
  },
  avatarFormat: {
    size: 256,
    dynamic: true,
  },
};

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName(cmd.name)
    .setDescription(cmd.description)
    .addStringOption((option) =>
      option
        .setName(cmd.stringOption1.name)
        .setDescription(cmd.stringOption1.description)
        .setRequired(cmd.stringOption1.required)
        .setMaxLength(cmd.max_size),
    )
    .addStringOption((option) =>
      option
        .setName(cmd.StringOption2.name)
        .setDescription(cmd.StringOption2.description)
        .setRequired(cmd.StringOption2.required)
        .setMaxLength(cmd.max_size),
    ),

  /**
   *
   * @param {CommandInteraction<"cached">} interaction
   */
  async execute(interaction) {
    let halfOfRandoms = 20;

    let octopusChoice = random(halfOfRandoms * 2),
      firstOption = interaction.options.getString(cmd.stringOption1.name),
      secondOption = interaction.options.getString(cmd.StringOption2.name),
      guild = interaction.guild,
      member = interaction.member;

    let embed = {
      author: {
        name: `${member.displayName}`,
        icon_url: member.displayAvatarURL(),
      },
      color: cmd.embed.color,
      fields: [
        {
          inline: true,
          name: `A primeira opção era`,
          value: firstOption,
        },
        {
          inline: true,
          name: `A segunda opção era`,
          value: secondOption,
        },
        {
          inline: false,
          name: `Jogador`,
          value: member.toString(),
        },
      ],
      image: {
        url: String(),
      },
      footer: {
        text: `O 🐙 DECIDIU ESCOLHER A MELHOR ENTRE ELAS!`,
        icon_url: guild.iconURL(),
      },
      timestamp: new Date().toISOString(),
      title: cmd.embed.title.replace(`#0`, member.displayName),
    };

    if (octopusChoice < halfOfRandoms) {
      embed.description = cmd.embed.choice.replace(`#0`, firstOption);
      embed.image.url = cmd.embed.images.at(
        random(cmd.embed.images.length - 2),
      );
    } else if (octopusChoice == halfOfRandoms) {
      embed.description = cmd.embed.choice.replace(
        `#0`,
        `\nO 🐙 DECIDIU QUE NENHUMA DAS OPÇÕES É DIGNA!`,
      );
      embed.image.url = cmd.embed.images.at(cmd.embed.images.length - 1);
    } else {
      embed.description = cmd.embed.choice.replace(`#0`, secondOption);
      embed.image.url = cmd.embed.images.at(
        random(cmd.embed.images.length - 2),
      );
    }

    await interaction
      .reply({ embeds: [embed] })
      .catch((err) => console.error(err));
  },
};
