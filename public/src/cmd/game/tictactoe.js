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
	} = require(`discord.js`),
	{ customIds, maxT } = require(`../../event/interactionCreate`),
	wait = require('node:timers/promises').setTimeout

let cmd = {
	name: `tictactoe`,
	desc: `Use para jogar jogo da velha com algum usuário`,
	opt: {
		name: `mention`,
		desc: `Marque um usuário`,
		req: true,
	},
	color: Colors.Blurple,
}

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName(cmd.name)
		.setDescription(cmd.desc)
		.addUserOption(op =>
			op
				.setName(cmd.opt.name)
				.setDescription(cmd.opt.desc)
				.setRequired(cmd.opt.req)
		),

	/**
	 *
	 * @param {CommandInteraction} e
	 */
	async execute(e) {
		let guild = e.guild,
			member = e.member,
			mention = e.options.getMember(cmd.opt.name)

		if (mention && !mention.user.bot) {
			let emb = {
					color: cmd.color,
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
							name: `Fim <t:${((Date.now() + maxT) * 1e-3).toFixed()}:R>`,
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
				actRow = {
					components: [
						{
							custom_id: `${customIds.gamesId}tictactoe${customIds.updateId}`,
							disabled: false,
							label: `Vez do Jogador 2`,
							style: ButtonStyle.Primary,
							type: ComponentType.Button,
						},
						{
							custom_id: `${customIds.gamesId}tictactoe${customIds.endId}`,
							disabled: false,
							label: `Encerrar o jogo`,
							style: ButtonStyle.Danger,
							type: ComponentType.Button,
						},
					],
					type: ComponentType.ActionRow,
				}

			await e
				.reply({ embeds: [emb], components: [actRow] })
				.then(
					async () =>
						await wait(maxT)
							.then(
								async () =>
									await e
										.fetchReply()
										.then(msg => this.end(msg))
										.catch(err => console.error(err))
							)
							.catch(err => console.error(err))
				)
				.catch(err => console.error(err))
		} else {
			await e
				.reply({
					content: `Você deve jogar com um usuário do servidor! ;).`,
					ephemeral: true,
				})
				.catch(err => console.error(err))
		}
	},

	/**
	 *
	 * @param { Message } e
	 */
	async end(e) {
		let actRow = e.components.map(comp => comp.toJSON()),
			emb = e.embeds.map(emb => emb.toJSON())

		actRow.forEach(row => {
			row.components.forEach(btn => {
				btn.disabled = true
				btn.style = ButtonStyle.Secondary
			})
		})

		emb.forEach(emb => {
			emb.title ? (emb.title += ' (Encerrado)') : false
		})

		if (e.editable) {
			await e
				.edit({ embeds: emb, components: actRow })
				.catch(err => console.error(err))
		}
	},

	/**
	 *
	 * @param {ModalSubmitInteraction} e
	 */
	async modal(e) {
		let playerName = e.message.embeds.at(0).fields.at(2).value,
			pos = e.fields.getTextInputValue(
				`${customIds.gamesId}tictactoe${customIds.modalId}${customIds.txtInId}`
			),
			emojiStrings = [`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`, `7️⃣`, `8️⃣`, `9️⃣`],
			winner = false,
			playerEmoji = `❎`,
			specEmoji = `🅾`

		if (playerName == `Jogador 2`) {
			let aux = playerEmoji
			playerEmoji = specEmoji
			specEmoji = aux
		}

		let emb = e.message.embeds.at(0).toJSON()

		if (parseInt(pos) > 0 && parseInt(pos) <= 9) {
			let free = {}

			emojiStrings.map(str => {
				if (emb.description.includes(str)) {
					free[emojiStrings.indexOf(str) + 1] = str
				}
			})

			if (pos in free) {
				emb.description = emb.description.replace(
					free[parseInt(pos)],
					`${playerEmoji}`
				)

				let actRow = e.message.components.at(0).toJSON(),
					lock = []

				let opts = emb.description
						.split(`⬛`)
						.filter(val => val.length != 0 && val != '' && val != '\n')
						.map(str => (str = str.replace(`\n`, ``))),
					val1 = 5,
					val2 = 3

				for (const val of opts) {
					if (val == playerEmoji) {
						lock.push(val1)
					} else if (val == specEmoji) {
						lock.push(val2)
					} else {
						lock.push(0)
					}
				}

				for (let i = 0; i < lock.length / 3; i++) {
					let r = lock[i + 2 * i] + lock[i + 1 + 2 * i] + lock[i + 2 + 2 * i],
						c = lock[i] + lock[i + 3] + lock[i + 6],
						d = i != 1 ? lock[i] + lock[4] + lock[-i + 8] : 0
					if (
						r == val1 * 3 ||
						r == val2 * 3 ||
						c == val1 * 3 ||
						c == val2 * 3 ||
						d == val1 * 3 ||
						d == val2 * 3
					) {
						winner = true
						break
					}
				}

				let drawn = false
				if (lock.find(val => val == 0) === undefined) {
					drawn = true
				}

				if (!winner && !drawn) {
					playerName == `Jogador 1`
						? (playerName = `Jogador 2`)
						: (playerName = `Jogador 1`)
				}

				let playerId = e.message.embeds
					.at(0)
					.fields.find(obj => obj.name == playerName).value

				let member = e.guild.members.cache.find(u => u.toString() === playerId)

				if (member) {
					emb.fields.at(2).value = playerName
					emb.thumbnail.url = member.displayAvatarURL()
					actRow.components.at(0).label = `Vez do ${playerName}`
				}
				if (winner) {
					emb.color = member.displayColor
					emb.description = `🏆 ${playerId} venceu!\n\n` + emb.description
				} else if (drawn) {
					emb.description = `👵 Deu velha!\n\n` + emb.description
				}

				await e
					.deferUpdate()
					.then(async res => {
						return await res.interaction.editReply({
							embeds: [emb],
							components: [actRow],
						})
					})
					.then(async res => {
						if (winner || drawn) {
							this.end(res)
						}
					})
					.catch(err => console.error(err))
			}
		}
	},

	/**
	 *
	 * @param {ButtonInteraction} e
	 */
	async update(e) {
		let modal = {
			components: [
				{
					components: [
						{
							custom_id: `${customIds.gamesId}tictactoe${customIds.modalId}${customIds.txtInId}`,
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
			custom_id: `${customIds.gamesId}tictactoe${customIds.modalId}`,
			title: `Sua vez de jogar`,
		}

		await e.showModal(modal).catch(err => console.error(err))
	},
}
