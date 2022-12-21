const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`info`)
		.setDescription(`Display information about something`),
}
