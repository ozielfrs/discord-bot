const {
		SlashCommandSubcommandBuilder,
		time,
		TimestampStyles,
		formatEmoji,
	} = require(`@discordjs/builders`),
	{ CommandInteraction, Colors } = require('discord.js')

let cmd = {
	name: `server`,
	desc: `Responde com informações do servidor`,
	fmt: {
		width: 256,
		dynamic: true,
	},
}

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName(cmd.name)
		.setDescription(cmd.desc),

	/**
	 *
	 * @param {CommandInteraction} e
	 */
	async execute(e) {
		let guild = e.guild,
			member = e.member

		let emb = {
			author: {
				name: guild.name,
				icon_url: guild.iconURL(),
			},
			color: Colors.Blurple,
			fields: [
				{
					inline: false,
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
					name: `ID`,
					value: guild.id,
				},
			],
			image: { url: guild.iconURL({ options: cmd.fmt }) },
			footer: {
				text: `${guild.memberCount} usuários`,
				icon_url: member.displayAvatarURL(),
			},
			timestamp: new Date(guild.createdAt).toISOString(),
			title: `Informações do Servidor`,
		}

		if (guild.bannerURL()) {
			emb.thumbnail = {
				url: guild.iconURL(),
			}
			emb.image.url = guild.bannerURL()
		}

		if (guild.description) {
			emb.fields.push({
				inline: false,
				name: `Descrição`,
				value: guild.description,
			})
		}

		if (guild.emojis.cache.size) {
			let emojis = ``
			guild.emojis.cache.each(em => {
				let fmtdEmoji = formatEmoji(em.id, em.animated)
				if (emojis.length + fmtdEmoji.length < 1024) emojis += fmtdEmoji
				else return
			})
			emb.fields.push({
				inline: false,
				name: `Principais emojis`,
				value: emojis,
			})
		}

		if (guild.roles.cache.size) {
			let roles = ``
			guild.roles.cache.each(r => {
				if (r.name != `@everyone`) {
					let fmtdRole = r.toString()
					if (roles.length + fmtdRole.length < 1024) roles += fmtdRole
					else return
				}
			})
			emb.fields.push({
				inline: false,
				name: `Principais cargos`,
				value: roles,
			})
		}

		if (guild.rulesChannel) {
			emb.fields.push({
				inline: true,
				name: `Canal de regras`,
				value: guild.rulesChannel.toString(),
			})
		}

		if (guild.afkChannel) {
			emb.fields.push({
				inline: true,
				name: `Canal de inativos`,
				value: guild.afkChannel.toString(),
			})
		}

		await e.reply({ embeds: [emb] }).catch(err => console.error(err))
	},
}
