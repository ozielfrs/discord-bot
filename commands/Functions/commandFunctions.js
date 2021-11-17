const {CommandInteraction, User} = require('discord.js');

/**
 *
 * @param {number} min Valor mínimo a ser obtido pela randomização.
 * @param {number} max Valor máximo a ser obtido pela randomização.
 * @return {number} Número aleatório entre o mínimo e máximo.
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 *
 * @param {String} str
 * @param {CommandInteraction} interaction
 * @return {[User || Role, String]} Usuário|Role e sua respectiva Snowflake se a operação for bem sucedida
 */
function SnowflakeUser(str, interaction) {
  let mention, aux_snwflk;
  if (str.includes('<@')) {
    aux_snwflk = str.slice(str.indexOf('<@'), str.indexOf('>')).
        replace('<@', '');

    if (str.includes('<@!'))
      aux_snwflk = str.slice(str.indexOf('<@!'), str.indexOf('>')).
          replace('<@!', '');

    mention = interaction.client.users.cache.find(
        (mention) => mention.id === aux_snwflk,
    );

    if (str.includes('<@&')) {
      aux_snwflk = str.slice(str.indexOf('<@&'), str.indexOf('>')).
          replace('<@&', '');

      mention = interaction.client.guilds.cache.find(
          (guild) => guild.id === interaction.guild.id).
          roles.
          cache.
          find((role) => role.id === aux_snwflk);
    }
  }

  return [mention, aux_snwflk];
}

/**
 *
 * @param {User || Role} mention
 * @param {String} str
 * @param {String} snw_flk Snowflake da menção
 * @return {String}
 */
function subsMention(mention, str, snw_flk) {
  if (str.includes('<@'))
    if (str.includes('<@!'))
      return str.replace(`<@!${snw_flk}>`, `@${mention.tag}`);
  if (str.includes('<@&'))
    return str.replace(`<@&${snw_flk}>`, `@${mention.name}`);
  else return str.replace(`<@${snw_flk}>`, `@${mention.tag}`);
}

/**
 *  Substitui todas as menções de uma string.
 * @param {String} str
 * @param {CommandInteraction} interaction
 * @return {String} String contendo nomes dos componentes das menções, no lugar de Snowflakes.
 */
function subsAllMentions(str, interaction) {
  let mention = SnowflakeUser(str, interaction);

  if (mention.at(0))
    return subsAllMentions(subsMention(mention.at(0), str, mention.at(1)),
        interaction);

  if (str.includes('>'))
    return (
        str.slice(0, str.indexOf('>') + 1) +
        subsAllMentions(str.slice(str.indexOf('>') + 1, str.length),
            interaction)
    );

  return str;
}

module.exports = {
  subsAllMentions,
  getRandomInt,
};
