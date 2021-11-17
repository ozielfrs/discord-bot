module.exports = {
  name: 'ready',
  once: true,

  execute(client) {
    console.log(`Cliente pronto! O bot está como ${client.user.tag}.`);
  },
};
