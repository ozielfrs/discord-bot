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
	maxT: 12e4, //2 min

	/**
	 *
	 * @param {BaseInteraction} e
	 * @returns
	 */
	async execute(e) {
		if (e.isCommand()) {
			let command = e.client[`${e.commandName}`].get(
				`${e.commandName} ${e.options._subcommand}`
			)

			if (command) {
				try {
					await command.execute(e)
				} catch (error) {
					console.error(error)
					await e.reply({
						content: `Tried to execute [${e.commandName} ${e.options._subcommand}] and it didn't work.`,
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
					let commandName = `${customIds.gamesId.slice(1, -1)}`,
						subName = ID.slice(customIds.gamesId.length, -customIds.updateId.length)

					let command = e.client[commandName].get(`${commandName} ${subName}`)

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
											.fields.at(e.message.embeds.at(0).fields.length - 1).value
								)
								.value.slice(2, -1)
								? true
								: false

						if (player) {
							try {
								await command.update(e)
							} catch (error) {
								console.error(error)
								await e.reply({
									content: `An error occured while playing [${commandName} ${subName}].`,
									ephemeral: true,
								})
							}
						}
					}
				}

				if (ID.includes(customIds.endId)) {
					let commandName = `${customIds.gamesId.slice(1, -1)}`,
						subName = ID.slice(customIds.gamesId.length, -customIds.endId.length)

					let command = e.client[commandName].get(`${commandName} ${subName}`)

					if (command) {
						let player = false

						e.message.embeds.at(0).fields.forEach(game_player => {
							if (e.member.id === game_player.value.slice(2, -1)) {
								player = true
								return
							}
						})

						if (player) {
							try {
								await e.deferUpdate()
								await command.end(e.message)
							} catch (error) {
								console.error(error)
								await e.reply({
									content: `An error occured when trying to execute this button [${commandName} ${subName}].`,
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
					let commandName = `${customIds.gamesId.slice(1, -1)}`,
						subName = ID.slice(customIds.gamesId.length, -customIds.modalId.length)

					let command = e.client[commandName].get(`${commandName} ${subName}`)

					if (command) {
						try {
							await command.modal(e)
						} catch (error) {
							console.error(error)
							await e.reply({
								content: `Tried to execute [${commandName} ${subName}] and it didn't work.`,
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
