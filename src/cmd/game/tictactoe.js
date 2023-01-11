const {
	SlashCommandSubcommandBuilder,
	Colors,
	CommandInteraction,
	ButtonInteraction,
	ButtonStyle,
	ComponentType,
	TextInputStyle,
	ModalSubmitInteraction,
	Message,
} = require(`discord.js`)
const wait = require('node:timers/promises').setTimeout
const { customIds, max_time } = require(`../../event/baseInteractionHandler`)

let command = {
	name: `tictactoe`,
	description: `Use para jogar jogo da velha com algum usuário`,
	userOption: {
		name: `mention`,
		description: `Marque um usuário`,
		required: true,
	},
	color: Colors.Blurple,
}

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName(command.name)
		.setDescription(command.description)
		.addUserOption(option =>
			option
				.setName(command.userOption.name)
				.setDescription(command.userOption.description)
				.setRequired(command.userOption.required)
		),

	/**
	 *
	 * @param {CommandInteraction<"cached">} interaction
	 */
	async execute(interaction) {
		let guild = interaction.guild,
			member = interaction.member,
			mention = interaction.options.getMember(command.userOption.name)

		if (mention && !mention.user.bot) {
			var embed = {
					color: command.color,
					description:
						`⬛⬛⬛⬛⬛⬛⬛\n` +
						`⬛1️⃣⬛2️⃣⬛3️⃣⬛\n` +
						`⬛⬛⬛⬛⬛⬛⬛\n` +
						`⬛4️⃣⬛5️⃣⬛6️⃣⬛\n` +
						`⬛⬛⬛⬛⬛⬛⬛\n` +
						`⬛7️⃣⬛8️⃣⬛9️⃣⬛\n` +
						`⬛⬛⬛⬛⬛⬛⬛\n`,
					fields: [
						{
							inline: true,
							name: `Jogador 1`,
							value: member.toString(),
						},
						{
							inline: true,
							name: `Jogador 2`,
							value: mention.toString(),
						},
						{
							inline: false,
							name: `Fim <t:${((Date.now() + max_time) * 1e-3).toFixed()}:R>`,
							value: `Jogador 2`,
						},
					],
					thumbnail: {
						url: mention.displayAvatarURL(),
					},
					footer: {
						text: guild.name,
						icon_url: guild.iconURL(),
					},
					timestamp: new Date().toISOString(),
					title: `TicTacToe Game`,
				},
				buttonsActionRow = {
					components: [
						{
							custom_id: `${customIds.gameId}tictactoe${customIds.updateId}`,
							disabled: false,
							label: `Vez do Jogador 2`,
							style: ButtonStyle.Primary,
							type: ComponentType.Button,
						},
						{
							custom_id: `${customIds.gameId}tictactoe${customIds.endId}`,
							disabled: false,
							label: `Encerrar o jogo`,
							style: ButtonStyle.Danger,
							type: ComponentType.Button,
						},
					],
					type: ComponentType.ActionRow,
				}

			await interaction
				.reply({ embeds: [embed], components: [buttonsActionRow] })
				.then(
					async () =>
						await wait(max_time)
							.then(
								async () =>
									await interaction
										.fetchReply()
										.then(msg => this.end(msg))
										.catch(err => console.error(err))
							)
							.catch(err => console.error(err))
				)
				.catch(err => console.error(err))
		} else {
			await interaction
				.reply({
					content: `Você deve jogar com um usuário do servidor! ;).`,
					ephemeral: true,
				})
				.catch(err => console.error(err))
		}
	},

	/**
	 *
	 * @param { Message<true> } message
	 */
	async end(message) {
		let buttonsActionRow = message.components.map(component =>
				component.toJSON()
			),
			embeds = message.embeds.map(embed => embed.toJSON())

		buttonsActionRow.forEach(row => {
			row.components.forEach(button => {
				button.disabled = true
				button.style = ButtonStyle.Secondary
			})
		})

		embeds.forEach(embed => {
			embed.title ? (embed.title += ' (Encerrado)') : false
		})

		if (message.editable) {
			await message
				.edit({ embeds: embeds, components: buttonsActionRow })
				.catch(err => console.error(err))
		}
	},

	/**
	 *
	 * @param {ModalSubmitInteraction<"cached">} interaction
	 */
	async modal(interaction) {
		let member = interaction.member,
			playerName = interaction.message.embeds.at(0).fields.at(2).value,
			mainEmbed = interaction.message.embeds.at(0).toJSON(),
			buttonsActionRow = interaction.message.components.at(0).toJSON(),
			positionSubmited = interaction.fields.getTextInputValue(
				`${customIds.gameId}tictactoe${customIds.modalId}${customIds.txtInId}`
			),
			numberEmojis = [`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`, `7️⃣`, `8️⃣`, `9️⃣`],
			winner = false,
			drawn = false,
			allyEmoji = `❎`,
			enemyEmoji = `🅾`,
			logicBoard = [],
			freePositions = {}

		if (playerName == `Jogador 2`) {
			let auxEmoji = allyEmoji
			allyEmoji = enemyEmoji
			enemyEmoji = auxEmoji
		}

		if (parseInt(positionSubmited) > 0 && parseInt(positionSubmited) <= 9) {
			numberEmojis.map(emoji => {
				if (mainEmbed.description.includes(emoji)) {
					freePositions[numberEmojis.indexOf(emoji) + 1] = emoji
				}
			})

			if (positionSubmited in freePositions) {
				mainEmbed.description = mainEmbed.description.replace(
					freePositions[parseInt(positionSubmited)],
					`${allyEmoji}`
				)

				let board = mainEmbed.description
						.split(`⬛`)
						.filter(val => val.length != 0 && val != '' && val != '\n')
						.map(str => (str = str.replace(`\n`, ``))),
					allyValue = 5,
					enemyValue = 3

				for (const value of board) {
					if (value == allyEmoji) {
						logicBoard.push(allyValue)
					} else if (value == enemyEmoji) {
						logicBoard.push(enemyValue)
					} else {
						logicBoard.push(0)
					}
				}

				for (let i = 0; i < logicBoard.length / 3; i++) {
					let r =
							logicBoard[i + 2 * i] +
							logicBoard[i + 1 + 2 * i] +
							logicBoard[i + 2 + 2 * i],
						c = logicBoard[i] + logicBoard[i + 3] + logicBoard[i + 6],
						d = i != 1 ? logicBoard[i] + logicBoard[4] + logicBoard[-i + 8] : 0
					if (
						r == allyValue * 3 ||
						r == enemyValue * 3 ||
						c == allyValue * 3 ||
						c == enemyValue * 3 ||
						d == allyValue * 3 ||
						d == enemyValue * 3
					) {
						winner = true
						break
					}
				}

				if (logicBoard.find(val => val == 0) === undefined) {
					drawn = true
				}

				if (!winner && !drawn) {
					playerName == `Jogador 1`
						? (playerName = `Jogador 2`)
						: (playerName = `Jogador 1`)
				}

				mainEmbed.fields.at(2).value = playerName
				mainEmbed.thumbnail.url = member.displayAvatarURL()
				buttonsActionRow.components.at(0).label = `Vez do ${playerName}`

				if (winner) {
					mainEmbed.color = member.displayColor
					mainEmbed.description =
						`🏆 ${member.toString()} venceu!\n\n` + mainEmbed.description
				} else if (drawn) {
					mainEmbed.description = `👵 Deu velha!\n\n` + mainEmbed.description
				}

				await interaction
					.deferUpdate()
					.then(async response => {
						return await response.interaction.editReply({
							embeds: [mainEmbed],
							components: [buttonsActionRow],
						})
					})
					.then(async message => {
						if (winner || drawn) {
							this.end(message)
						}
					})
					.catch(err => console.error(err))
			}
		}
	},

	/**
	 *
	 * @param {ButtonInteraction<"cached">} interaction
	 */
	async update(interaction) {
		let modal = {
			components: [
				{
					components: [
						{
							custom_id: `${customIds.gameId}tictactoe${customIds.modalId}${customIds.txtInId}`,
							label: `Marque uma posição`,
							max_length: 1,
							placeholder: `Insira um número`,
							required: true,
							style: TextInputStyle.Short,
							type: ComponentType.TextInput,
						},
					],
					type: ComponentType.ActionRow,
				},
			],
			custom_id: `${customIds.gameId}tictactoe${customIds.modalId}`,
			title: `Sua vez de jogar`,
		}

		await interaction.showModal(modal).catch(err => console.error(err))
	},
}
