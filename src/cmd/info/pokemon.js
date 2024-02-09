const { SlashCommandSubcommandBuilder } = require(`@discordjs/builders`);
const { CommandInteraction } = require('discord.js');

const cmd = {
  name: `pokemon`,
  desc: `Responde com informações do pokémon`,
  opt: {
    name: `name`,
    desc: `Nome ou ID do pokémon`,
    req: true,
  },
};

const color = {
  normal: 0xa8a77a,
  fire: 0xee8130,
  water: 0x6390f0,
  electric: 0xf7d02c,
  grass: 0x7ac74c,
  ice: 0x96d9d6,
  fighting: 0xc22e28,
  poison: 0xa33ea1,
  ground: 0xe2bf65,
  flying: 0xa98ff3,
  psychic: 0xf95587,
  bug: 0xa6b91a,
  rock: 0xb6a136,
  ghost: 0x735797,
  dragon: 0x6f35fc,
  dark: 0x705746,
  steel: 0xb7b7ce,
  fairy: 0xd685ad,
};

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName(cmd.name)
    .setDescription(cmd.desc)
    .addStringOption((option) =>
      option
        .setName(cmd.opt.name)
        .setDescription(cmd.opt.desc)
        .setRequired(cmd.opt.req),
    ),

  /**
   *
   * @param {CommandInteraction<"cached">} interaction
   */
  async execute(interaction) {
    try {
      const fetchName = interaction.options
        .getString(cmd.opt.name)
        .toLowerCase()
        .split(' ')
        .join('-');

      const pokemon = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${fetchName}`,
      ).then((res) => res.json());

      const name = pokemon.name
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      let weight = pokemon.weight * 100.0;
      let height = pokemon.height * 10.0;
      weight < 100 ? (weight = `${weight}g`) : (weight = `${weight / 1000}kg`);
      height < 100 ? (height = `${height}cm`) : (height = `${height / 100}m`);

      fields = [
        {
          inline: true,
          name: `ID`,
          value: pokemon.id,
        },
        {
          inline: true,
          name: `Altura`,
          value: height,
        },
        {
          inline: true,
          name: `Peso`,
          value: weight,
        },
      ];

      const emb = {
        title: name,
        fields: fields,
        image: {
          url: pokemon.sprites.other['official-artwork'].front_default,
        },
        thumbnail: {
          url: pokemon.sprites.front_default,
        },
        color:
          pokemon.types[0].type.name in color
            ? color[pokemon.types[0].type.name]
            : 0x000000,
      };

      await interaction
        .reply({ embeds: [emb] })
        .catch((err) => console.error(err));
    } catch (err) {
      await interaction
        .reply({
          ephemeral: true,
          content: 'Seu pokémon não foi encontrado! :(',
        })
        .catch((err) => console.error(err));
    }
  },
};
