const dotenv = require('dotenv');
const { Client, GatewayIntentBits, Collection } = require(`discord.js`);
const fs = require(`node:fs`);
dotenv.config();

const client = new Client({ intents: GatewayIntentBits.Guilds });

/**
 * Path for commands and commands array
 */
const commandPaths = fs
  .readdirSync(`./src/cmd`, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

/**
 * Find and add subcommands
 */
commandPaths.forEach((dirName) => {
  client[`${dirName}`] = new Collection();

  const subCommandFiles = fs
    .readdirSync(`./src/cmd/${dirName}`)
    .filter((sub) => sub.endsWith(`.js`) && !sub.includes(`${dirName}`));

  console.log(dirName, subCommandFiles);

  subCommandFiles.forEach((fileName) => {
    let command = require(`./src/cmd/${dirName}/${fileName}`);

    client[`${dirName}`].set(`${dirName} ${command.data.name}`, command);
  });
});

let eventFiles = fs
  .readdirSync(`./src/event`)
  .filter((file) => file.endsWith(`.js`));

for (const file of eventFiles) {
  let event = require(`./src/event/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client
  .login(process.env.TOKEN)
  .then(() => {
    console.log(`Bot started, ${client.user.tag}.`);
  })
  .catch((err) => console.error(err));
