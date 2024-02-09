const { BaseInteraction } = require('discord.js');

module.exports = {
  name: `interactionCreate`,
  once: false,
  customIds: {
    gameId: `:game:`,
    updateId: `:update:`,
    playId: `:play:`,
    endId: `:end:`,
    modalId: `:modal:`,
    txtInId: `:txt:`,
  },
  max_time: 12e4, //2 min

  /**
   *
   * @param {BaseInteraction<"cached">} interaction
   * @returns
   */
  async execute(interaction) {
    if (interaction.isCommand()) {
      let command = interaction.client[`${interaction.commandName}`].get(
        `${interaction.commandName} ${interaction.options._subcommand}`,
      );

      if (command) {
        try {
          await command.execute(interaction);
        } catch (error) {
          console.error(error);
          await interaction
            .reply({
              content: `Tried to execute [${interaction.commandName} ${interaction.options._subcommand}] and it didn't work.`,
              ephemeral: true,
            })
            .catch((err) => console.error(err));
        }
      }
    }

    if (interaction.isButton()) {
      let interactionID = interaction.customId,
        customIds = this.customIds;
      if (interactionID.includes(customIds.gameId)) {
        if (interactionID.includes(customIds.updateId)) {
          let commandName = `${customIds.gameId.slice(1, -1)}`,
            subName = interactionID.slice(
              customIds.gameId.length,
              -customIds.updateId.length,
            ),
            command = interaction.client[commandName].get(
              `${commandName} ${subName}`,
            );

          if (command) {
            let currentPlayer = interaction.message.embeds
                .at(0)
                .fields.at(interaction.message.embeds.at(0).fields.length - 1),
              player = interaction.message.embeds
                .at(0)
                .fields.find(
                  (game_player) => game_player.name === currentPlayer.value,
                );

            if (player) {
              await command.update(interaction).catch((err) => {
                console.error(err);
                interaction
                  .reply({
                    content: `Tried to execute [${commandName} ${subName}] and it didn't work.`,
                    ephemeral: true,
                  })
                  .catch((err) => console.error(err));
              });
            }
          }
        }

        if (interactionID.includes(customIds.endId)) {
          let commandName = `${customIds.gameId.slice(1, -1)}`,
            subName = interactionID.slice(
              customIds.gameId.length,
              -customIds.endId.length,
            ),
            command = interaction.client[commandName].get(
              `${commandName} ${subName}`,
            );

          if (command) {
            let player;

            interaction.message.embeds.at(0).fields.forEach((game_player) => {
              if (interaction.member.toString() === game_player.value)
                player = interaction.member;
            });

            if (player) {
              await interaction
                .deferUpdate()
                .catch((err) => console.error(err));
              await command.end(interaction.message).catch((err) => {
                console.error(err);
                interaction
                  .reply({
                    content: `Tried to execute [${commandName} ${subName}] and it didn't work.`,
                    ephemeral: true,
                  })
                  .catch((err) => console.error(err));
              });
            }
          }
        }
      }
    }

    if (interaction.isModalSubmit()) {
      let interactionID = interaction.customId,
        customIds = this.customIds;
      if (interactionID.includes(customIds.gameId)) {
        let commandName = `${customIds.gameId.slice(1, -1)}`,
          subName = interactionID.slice(
            customIds.gameId.length,
            -customIds.modalId.length,
          ),
          command = interaction.client[commandName].get(
            `${commandName} ${subName}`,
          );

        if (command) {
          await command.modal(interaction).catch((err) => {
            console.error(err);
            interaction
              .reply({
                content: `Tried to execute [${commandName} ${subName}] and it didn't work.`,
                ephemeral: true,
              })
              .catch((err) => console.error(err));
          });
        }
      }
    }
    return;
  },
};
