module.exports = {
    name: `ready`,
    once: true,

    execute(client) {
        console.log(`Cliente pronto, ${client.user.tag}!`);
    },
};
