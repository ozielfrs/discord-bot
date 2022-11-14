const { CommandInteraction } = require(`discord.js`)

/**
 *
 * @param {number} n Valor mínimo a ser obtido pela randomização.
 * @param {number} m Valor máximo a ser obtido pela randomização.
 * @return {number} Número aleatório entre o mínimo e máximo.
 */
function random(n, m) {
    n = Math.ceil(n)
    m = Math.floor(m)
    return Math.floor(Math.random() * (m - n)) + n
}

/**
 *
 * @param {number} m Valor máximo a ser obtido pela randomização.
 * @return {number} Número aleatório entre o 0 e número definido.
 */
function random(m) {
    m = Math.floor(m)
    return Math.floor(Math.random() * m)
}

/**
 *
 * @param {String} str String with mentions replaced by names
 * @param {CommandInteraction} e Interaction with the user
 * @returns
 */
function mentionToName(str, e) {
    let snwflk,
        rlS = `<@&`,
        usrS = `<@`,
        chS = `<#`,
        pos = 0
    while (str.includes(rlS, pos)) {
        snwflk = str
            .slice(
                str.indexOf(rlS, pos),
                str.indexOf(`>`, str.indexOf(rlS, pos))
            )
            .replace(rlS, ``)
        pos = str.indexOf(rlS, pos) + 1

        let roleM = e.guild.roles.cache.find((r) => r.id === snwflk)

        if (roleM) {
            str = str.replace(`${rlS.concat(snwflk)}>`, `{@&${roleM.name}}`)
            pos = str.indexOf(`@${roleM.name}`, pos) + roleM.name.length + 1
        }
    }

    pos = 0
    while (str.includes(usrS, pos)) {
        snwflk = str
            .slice(
                str.indexOf(usrS, pos),
                str.indexOf(`>`, str.indexOf(usrS, pos))
            )
            .replace(usrS, ``)
        pos = str.indexOf(usrS, pos) + 1

        console.log(pos)

        let usrM = e.guild.members.cache.find((u) => u.id === snwflk)

        if (usrM) {
            str = str.replace(
                `${usrS.concat(snwflk)}>`,
                `{@${usrM.displayName}}`
            )
            pos =
                str.indexOf(`@${usrM.displayName}`, pos) +
                usrM.displayName.length +
                1
        }
    }

    pos = 0
    while (str.includes(chS, pos)) {
        snwflk = str
            .slice(
                str.indexOf(chS, pos),
                str.indexOf(`>`, str.indexOf(chS, pos))
            )
            .replace(chS, ``)
        pos = str.indexOf(chS, pos) + 1

        let chM = e.guild.channels.cache.find((u) => u.id === snwflk)

        if (chM) {
            str = str.replace(`${chS.concat(snwflk)}>`, `{#${chM.name}}`)
            pos = str.indexOf(`@${chM.name}`, pos) + chM.name.length + 1
        }
    }

    return str
}

module.exports = {
    mentionToName: mentionToName,
    random: random,
}
