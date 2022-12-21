const {
		SlashCommandSubcommandBuilder,
		time,
		TimestampStyles,
		formatEmoji,
	} = require(`@discordjs/builders`),
	{ CommandInteraction, Colors } = require('discord.js')

let command = {
	name: `server`,
	description: `Responde com informações do servidor`,
	avatarFormat: {
		width: 256,
		dynamic: true,
	},
}

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName(command.name)
		.setDescription(command.description),

	/**
	 *
	 * @param {CommandInteraction<"cached">} interaction
	 */
	async execute(interaction) {
		let guild = interaction.guild,
			member = interaction.member

		let embed = {
			author: {
				name: guild.name,
				icon_url: guild.iconURL(),
			},
			color: Colors.Blurple,
			fields: [
				{
					inline: true,
					name: `Dono do servidor`,
					value: `<@${guild.ownerId}>`,
				},
				{
					inline: true,
					name: `Servidor criado`,
					value: time(guild.createdAt, TimestampStyles.RelativeTime),
				},
				{
					inline: true,
					name: `ID do Servidor`,
					value: guild.id,
				},
			],
			image: { url: guild.iconURL({ options: command.avatarFormat }) },
			footer: {
				text: `${guild.memberCount} usuários`,
				icon_url: guild.iconURL(),
			},
			timestamp: new Date(guild.createdAt).toISOString(),
		}

		if (guild.bannerURL()) {
			embed.thumbnail = {
				url: guild.iconURL(),
			}
			embed.image.url = guild.bannerURL()
		}

		if (guild.description) {
			embed.fields.push({
				inline: false,
				name: `Descrição`,
				value: guild.description,
			})
		}

		if (guild.emojis.cache.size) {
			let emojis = ``
			guild.emojis.cache.each(emoji => {
				let fmtdEmoji = formatEmoji(emoji.id, emoji.animated)
				if (emojis.length + fmtdEmoji.length < 1024) emojis += fmtdEmoji
				else return
			})
			embed.fields.push({
				inline: false,
				name: `Principais emojis`,
				value: emojis,
			})
		}

		if (guild.roles.cache.size) {
			let roles = ``
			guild.roles.cache.each(role => {
				if (role.name != `@everyone`) {
					let fmtdRole = role.toString()
					if (roles.length + fmtdRole.length < 1024) roles += fmtdRole
					else return
				}
			})
			embed.fields.push({
				inline: false,
				name: `Principais cargos`,
				value: roles,
			})
		}

		if (guild.rulesChannel) {
			embed.fields.push({
				inline: true,
				name: `Canal de regras`,
				value: guild.rulesChannel.toString(),
			})
		}

		if (guild.afkChannel) {
			embed.fields.push({
				inline: true,
				name: `Canal de inativos`,
				value: guild.afkChannel.toString(),
			})
		}

		await interaction.reply({ embeds: [embed] }).catch(err => console.error(err))
	},
}
