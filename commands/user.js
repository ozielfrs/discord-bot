const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription(
      "Responde com a informação do usuário mencionado, ou do usuário que tiver usado o comando."
    )
    .addUserOption((option) =>
      option
        .setName("mention")
        .setDescription("Selecione um usuário.")
        .setRequired(false)
    ),

  async execute(interaction) {
    let embed = new MessageEmbed().setTimestamp(interaction.createdAt),
      user = interaction.options.getUser("mention"),
      color = interaction.member.displayHexColor,
      member = interaction.guild.members.cache.find(
        (member) => member.id === interaction.user.id
      );

    if (user) {
      color = interaction.guild.members.cache.get(user.id).displayHexColor;
    } else {
      user = interaction.user
    }
    embed
      .setAuthor({
        name:
          `${member.user.tag}`, iconURL: member.displayAvatarURL({ format: "webp", size: 256, dynamic: true })
      })
      .setColor(color)
      .setImage(user.avatarURL({ format: "webp", size: 256, dynamic: true }))
      .setTitle(`${user.tag} information`)
      .setDescription(
        `Account created at: ${user.createdAt.toDateString()}.`
      );

    await interaction.reply({ embeds: [embed] });
  },
};
