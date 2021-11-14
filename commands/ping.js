const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Não use."),

  async execute(interaction) {
    await interaction.reply({
      content:
        "https://img.itch.zone/aW1hZ2UvMjgwNjAyLzEzNjIxMTkucG5n/315x250%23c/oHMecM.png",
      ephemeral: false,
    });
    console.log(
      `Comando PING usado por ${interaction.user.tag} em #${interaction.channel.name}. |` +
        `${interaction.createdAt.toDateString()} | ${interaction.createdAt.toTimeString()}`
    );
  },
};
