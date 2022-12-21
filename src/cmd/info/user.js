const {
		SlashCommandSubcommandBuilder,
		time,
		TimestampStyles,
	} = require(`@discordjs/builders`),
	{ CommandInteraction } = require('discord.js'),
	{ discordBadges } = require(`../../func/utils/badges`)

let cmd = {
	name: `user`,
	desc: `Responde com informações do usuário`,
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
		.addUserOption(option =>
			option
				.setName(cmd.opt.name)
				.setDescription(cmd.opt.desc)
				.setRequired(cmd.opt.req)
		),

	/**
	 *
	 * @param {CommandInteraction<"cached">} interaction
	 */
	async execute(interaction) {
		let guild = interaction.guild,
			mention = interaction.options.getMember(cmd.opt.name)

		mention ??= interaction.member

		fields = [
			{
				inline: true,
				name: `Conta criada`,
				value: time(mention.user.createdAt, TimestampStyles.RelativeTime),
			},
			{
				inline: true,
				name: `Pertence ao servidor`,
				value: time(mention.joinedAt, TimestampStyles.RelativeTime),
			},
			{
				inline: false,
				name: `ID`,
				value: mention.user.id,
			},
			{
				inline: true,
				name: `Usuário`,
				value: mention.user.toString(),
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
			if (r.name != `@everyone`) roles.push(r.toString())
		})

		if (badges.length != 0) {
			badgesField.value = badges
				.map(b => (b = discordBadges.find(e => e.name === b).emoji))
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

		await interaction.reply({ embeds: [emb] }).catch(err => console.error(err))
	},
}
