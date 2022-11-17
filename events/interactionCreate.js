const { BaseInteraction } = require('discord.js')

module.exports = {
	name: `interactionCreate`,
	once: false,
	customIds: {
		gamesId: `:game:`,
		updateId: `:update:`,
		playId: `:play:`,
		endId: `:end:`,
		modalId: `:modal:`,
		txtInId: `:txt:`,
	},
	/**
	 *
	 * @param {BaseInteraction} e
	 * @returns
	 */
	async execute(e) {
		if (e.isCommand()) {
			let command = e.client.interactions.get(e.commandName)

			if (command) {
				try {
					await command.execute(e)
				} catch (error) {
					console.error(error)
					await e.reply({
						content: `Tried to execute ${e.commandName} and it didn't work.`,
						ephemeral: true,
					})
				}
			}
		}

		if (e.isButton()) {
			let ID = e.customId,
				customIds = this.customIds
			if (ID.includes(customIds.gamesId)) {
				if (ID.includes(customIds.updateId)) {
					let command = e.client.interactions.get(
						ID.slice(customIds.gamesId.length, -customIds.updateId.length),
					)

					if (command) {
						let player =
							e.member.id ===
							e.message.embeds
								.at(0)
								.fields.find(
									obj =>
										obj.name ==
										e.message.embeds
											.at(0)
											.fields.at(e.message.embeds.at(0).fields.length - 1).value,
								)
								.value.slice(2, -1)
								? true
								: false

						console.log(e.member.id, player)
						if (player) {
							try {
								await command.update(e)
							} catch (error) {
								console.error(error)
								await e.reply({
									content: `An error occured while playing.`,
									ephemeral: true,
								})
							}
						}
					}
				}

				if (ID.includes(customIds.endId)) {
					let command = e.client.interactions.get(
						ID.slice(customIds.gamesId.length, -customIds.endId.length),
					)
					if (command) {
						let player = false

						e.message.embeds.at(0).fields.forEach(game_player => {
							if (e.member.id === game_player.value.slice(2, -1)) {
								player = true
								return
							}
						})

						console.log(e.member.id, player)
						if (player) {
							try {
								await command.end(e)
							} catch (error) {
								console.error(error)
								await e.reply({
									content: `An error occured when trying to execute this button.`,
									ephemeral: true,
								})
							}
						}
					}
				}
			}
		}

		if (e.isModalSubmit()) {
			let ID = e.customId,
				customIds = this.customIds
			if (ID.includes(customIds.gamesId)) {
				if (ID.includes(customIds.modalId)) {
					let command = e.client.interactions.get(
						ID.slice(customIds.gamesId.length, -customIds.modalId.length),
					)
					if (command) {
						try {
							await command.modal(e)
						} catch (error) {
							console.error(error)
							await e.reply({
								content: `Tried to execute ${ID.slice(
									customIds.gamesId.length,
									-customIds.modalId.length,
								)} and it didn't work.`,
								ephemeral: true,
							})
						}
					}
				}
			}
		}
		return
	},
}
