const { SlashCommandBuilder, CommandInteraction } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`kick`)
		.setDescription(`Expulsa um usuário`)
		.addUserOption(o =>
			o.setName(`mention`).setDescription(`Marque um usuário`).setRequired(true),
		),

	/**
	 *
	 * @param {CommandInteraction} e
	 */
	async execute(e) {},
}
