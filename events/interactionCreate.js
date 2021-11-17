module.exports = {
  name: 'interactionCreate',

  async execute(interaction) {
    if (interaction.isCommand()) {
      let command = interaction.client.commands.get(interaction.commandName);

      if (command) {
        try {
          await command.execute(interaction);
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: 'Erro na execução do comando.',
            ephemeral: true,
          });
        }
      } else return;
    }
    if (interaction.isButton()) {
    }
  },
};
