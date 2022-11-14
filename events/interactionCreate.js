module.exports = {
    name: `interactionCreate`,

    /**
     *
     * @param {*} e
     * @returns
     */
    async execute(e) {
        if (e.isCommand()) {
            let command = e.client.commands.get(e.commandName)

            if (command) {
                try {
                    await command.execute(e)
                } catch (error) {
                    console.error(error)
                    await e.reply({
                        content: `Execution error!`,
                        ephemeral: true,
                    })
                }
            } else return
        }
    },
}
