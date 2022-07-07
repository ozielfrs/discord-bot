const fs = require(`fs`);
const { REST } = require(`@discordjs/rest`);
const { Routes } = require(`discord-api-types/v9`);
const { clientId, guildId, token } = require(`./config.json`);

let commands = [];

let commandFiles = fs
  .readdirSync(`./commands/`)
  .filter((file) => file.endsWith(`.js`));

for (let file of commandFiles) {
  let command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

let rest = new REST({ version: `9` }).setToken(token);

(async () => {
  try {
    console.log(`Started refreshing application (/) commands.`);

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
