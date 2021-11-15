const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Responde com informações do servidor."),

  execute: async function (interaction) {
    let embed = new MessageEmbed(),
      user = interaction.client.users.cache.find(
        (user) => user.id === interaction.guild.ownerId
      ),
      time = interaction.guild.createdAt.toTimeString(),
      member = interaction.guild.members.cache.find(
        (member) => member.id === interaction.user.id
      );

    embed
      .setTitle(`${interaction.guild.name}`)
      .setDescription(
        `Quem comanda esse lugar é: ${user.tag}\n\n` +
            `Servidor criado em: ${interaction.guild.createdAt.toDateString()}` +
          `\nàs ${time.replace(`${time.slice(time.indexOf("(") - 1)}`, ``)}\n`
      )
      .setColor(`#2a7ed2`)
      .setImage(
        `${interaction.guild.iconURL({
          format: "webp",
          size: 256,
          dynamic: true,
        })}`
      )
      .setAuthor(
        `${member.user.tag}`,
        member.displayAvatarURL({ format: "webp", size: 256, dynamic: true })
      );

    time = member.joinedAt.toTimeString();

    embed.setFooter(
      `${
        interaction.user.tag
      } entrou em: ${interaction.guild.joinedAt.toDateString()}` +
        `\nàs ${time.replace(`${time.slice(time.indexOf("(") - 1)}`, ``)}`
    );

    await interaction.reply({ embeds: [embed] });
  },
};
