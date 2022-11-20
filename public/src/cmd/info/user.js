const { SlashCommandSubcommandBuilder } = require(`@discordjs/builders`),
	{ CommandInteraction } = require('discord.js'),
	{ discordBadges } = require(`../../func/utils/badges`)

let cmd = {
	name: `user`,
	desc: `Responde com a informação do usuário mencionado, ou do usuário que tiver usado o comando.`,
	opt: {
		name: `mention`,
		desc: `Marque um usuário`,
		req: false,
	},
	fmt: {
		width: 256,
		dynamic: true,
	},
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
		let guild = e.guild

		let mention = e.options.getUser(cmd.opt.name)
				? guild.members.cache.find(
						user => user.id === e.options.getUser(cmd.opt.name).id
				  )
				: guild.members.cache.find(u => u.id === e.member.id),
			fields = [
				{
					inline: true,
					name: `Conta criada`,
					value: `<t:${(mention.user.createdTimestamp * 1e-3).toFixed()}:R>`,
				},
				{
					inline: true,
					name: `Pertence ao servidor`,
					value: `<t:${(mention.joinedTimestamp * 1e-3).toFixed()}:R>`,
				},
				{
					inline: false,
					name: `ID`,
					value: mention.user.id,
				},
				{
					inline: true,
					name: `Usuário`,
					value: `<@${mention.user.id}>`,
				},
			]

		let badges = mention.user.flags.toArray(),
			roles = [],
			badgesField = {
				inline: true,
				name: `Distintivos`,
				value: String(),
			},
			rolesField = {
				inline: false,
				name: `Cargos`,
				value: String(),
			}

		mention.roles.cache.forEach(r => {
			if (r.name != `@everyone`) roles.push(`<@&${r.id}>`)
		})

		if (badges.length != 0) {
			badgesField.value = badges
				.map(val => (val = discordBadges.find(e => e.name === val).emoji))
				.join(` `)
			fields.push(badgesField)
		}

		if (roles.length != 0) {
			rolesField.value = roles.join(` `)
			fields.push(rolesField)
		}

		let emb = {
			author: {
				name: `${mention.displayName} (${mention.user.tag})`,
				icon_url: mention.displayAvatarURL(),
			},
			color: mention.displayColor,
			fields: fields,
			footer: {
				text: guild.name,
				icon_url: guild.iconURL(),
			},
			thumbnail: {
				url: mention.displayAvatarURL(cmd.fmt),
			},
			timestamp: new Date().toISOString(),
		}

		await e.reply({ embeds: [emb] })
	},
}
