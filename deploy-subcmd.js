const { REST } = require(`@discordjs/rest`);
const { Routes } = require(`discord-api-types/v10`);
const fs = require(`node:fs`);
const dotenv = require('dotenv');
dotenv.config();

/**
 * Path for commands and commands array
 */
const commandPaths = fs
  .readdirSync(`./src/cmd`, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const commands = [];

/**
 * Find and add subcommands
 */
commandPaths.forEach((file) => {
  if (file === `func`) return;

  let main = require(`./src/cmd/${file}/${file}.js`);

  const subCommandFiles = fs
    .readdirSync(`./src/cmd/${file}`)
    .filter((sub) => sub.endsWith(`.js`) && !sub.includes(`${file}`));

  console.log(file, subCommandFiles);

  const slashWithSubs = main.data;

  subCommandFiles.forEach((fileName) => {
    let command = require(`./src/cmd/${file}/${fileName}`);
    slashWithSubs.addSubcommand(command.data);
  });

  commands.push(slashWithSubs.toJSON());
});

const rest = new REST({ version: `10` }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      { body: commands },
    );
  } catch (err) {
    console.error(err);
  }
})();
