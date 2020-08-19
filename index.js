var auth = require('./auth.json');

const Discord = require('discord.js');
const client = new Discord.Client();
client.login(auth.token);

var game = {
    status: '',
    mod: {
        name: null
    },
    players: [],
    votes: {}
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    let content = msg.content.toLowerCase()
    console.log('======= START =======');
    console.log('msg.author', msg.author.username);
    console.log('msg.content', msg.content);
    console.log('msg.embeds', msg.embeds);
    console.log('======= END =======');

    //join a game as mod
    if (content.startsWith("mafia.mod")) {
        mod(msg)
    }
    //add a player by name
    else if (content.startsWith("mafia.join")) {
        join(msg);
    }
    //join a game as player
    else if (content.startsWith("mafia.add")) {
        add(msg);
    }
    //kick player
    else if (content.startsWith("mafia.kick")) {
        kick(msg);
    }
    //list the mod and players
    else if (content.startsWith("mafia.players") || content.startsWith("mafia.ls")) {
        players(msg);
    }
    //display game status
    else if (content.startsWith("mafia.status")) {
        status(msg);
    }
    //kill a player
    else if (content.startsWith("mafia.kill")) {
        kill(msg);
    }
    //vote to lynch a player
    else if (content.startsWith("vtl") || content.startsWith("vote")) {
        vtl(msg);
    }
    //unvote
    else if (content.startsWith("unvote")) {
        unvote(msg);
    }
    //display the vote count
    else if (content.startsWith("mafia.votes") || content.startsWith("mafia.v")) {
        votes(msg);
    }
    //reset vote count
    else if (content.startsWith("mafia.resetvotes") || content.startsWith("mafia.rv")) {
        resetvotes(msg);
    }
    //reset all values
    else if (content.startsWith("mafia.reset")) {
        reset(msg);
    }
    //revive all players
    else if (content.startsWith("mafia.revive")) {
        reset(msg);
    }
    //display help text
    else if (content.startsWith("mafia.help")) {
        help(msg);
    }
});

function mod(msg) {
    game.mod.name = msg.author.username

    let embed = {
        color: "FF00FF",
        title: "The mod is: " + game.mod.name
    }

    msg.channel.send({embed: embed})
}

function join(msg) {
    for(let player of game.players) {
        if(msg.author.username == player.name) {
            msg.channel.send("You're already in the game. ")
            return
        }
    }

    game.players.push({
        name: msg.author.username,
        alive: true,
        note: ''
    })

    let embed = {
        color: "00FF00",
        title: "Player has joined: " + msg.author.username
    }

    msg.channel.send({embed: embed})
}

function add(msg) {
    let conentArray = msg.content.split(" ")
    let name = conentArray[1]
    for(let player of game.players) {
        if(name == player.name) {
            player.alive = true
            msg.channel.send(name + " is already in the game and has been revived. ")
            return
        }
    }

    game.players.push({
        name: name,
        alive: true,
        note: ''
    })

    let embed = {
        color: "00FF00",
        title: "Player has joined: " + name
    }

    msg.channel.send({embed: embed})
}

function kick(msg) {
    let fields = _getPlayers(msg)

    let message = ''
    if(fields.players.length == 0) {
        message = "No players with identifier found. "
    }
    else if(fields.players.length == 1) {
        game.players.splice(game.players.indexOf(fields.players[0]), 1)
        message = `Removed player: **${fields.players[0].name}**`
    }
    else {
        message = "Multiple players with identifier found, please be more specific. "
    }

    msg.channel.send(message)
}

function players(msg) {
    let playersList = ''
    for(let player of game.players) {
        if(player.alive) {
            playersList = playersList + "\n" + player.name
        }
        else {
            playersList = playersList + `\n~~${player.name}~~ - *dead - ${player.note}.*`
        }
    }

    let embed = {
        color: "00FF00",
        title: "Players: ",
        description: playersList + `\n\n*Mod: ${game.mod.name}*`
    }

    msg.channel.send({embed: embed})
}

function kill(msg) {
    let fields = _getPlayers(msg)

    let message = ''
    if(fields.players.length == 0) {
        message = "No players with identifier found. "
    }
    else if(fields.players.length == 1) {
        fields.players[0].alive = false
        fields.players[0].note = fields.context
        message = `Killed player: **${fields.players[0].name}** - ${fields.players[0].note}`
    }
    else {
        message = "Multiple players with identifier found, please be more specific. "
    }

    msg.channel.send(message)
}

function vtl(msg) {
    let voterIsInGame = false
    for(let player of game.players) {
        if(msg.author.username == player.name) {
            voterIsInGame = true
        }
    }
    if(!voterIsInGame) {
        msg.channel.send("gtfo " + msg.author.username + " ur not in the game. ")
        return
    }

    let fields = _getPlayers(msg)

    let votedPlayer = null
    let message = ''
    if(fields.players.length == 0) {
        message = "No players with identifier found. "
    }
    else if(fields.players.length == 1) {
        votedPlayer = fields.players[0]
        if(!(votedPlayer.alive)) {
            msg.channel.send('This player is already dead!')
            return
        }
        unvote(msg)
        if(!(votedPlayer.name in game.votes)) {
            game.votes[votedPlayer.name] = []
        }
        game.votes[votedPlayer.name].push(msg.author.username)
        message = `**${msg.author.username}** voted **${votedPlayer.name}**`
        msg.channel.send(message)
        votes(msg)
        return
    }
    else {
        message = "Multiple players with identifier found, please be more specific. "
    }

    msg.channel.send(message)
}

function unvote(msg) {
    let unvoted = false
    for(let lynchee in game.votes) {
        for(let vote in game.votes[lynchee]) {
            if(msg.author.username == game.votes[lynchee][vote]) {
                game.votes[lynchee].splice(vote, 1)
                unvoted = true
            }
        }
    }

    if(unvoted) {
        msg.channel.send(`**${msg.author.username}** unvoted`)
    }
}

function votes(msg) {
    let votes = ''
    let votesToLynch = Math.floor(game.players.length/2 + 1)
    for(let lynchee in game.votes) {
        votes = votes + `${lynchee} (${game.votes[lynchee].length}/${votesToLynch}) - ${game.votes[lynchee]} \n`
    }

    let embed = {
        color: "22AAFF",
        title: "Vote count: ",
        description: votes
    }

    msg.channel.send({embed: embed})
}

function resetvotes(msg) {
    game.votes = {}

    msg.channel.send("Votes reset")
}

function reset(msg) {
    game = {
        status: '',
        mod: {
            name: null
        },
        players: [],
        votes: {}
    }
}

function revive(msg) {
    for(let player of game.players) {
        player.alive = true
    }
}

function revive(msg) {
    for(let player of game.players) {
        player.alive = true
        player.note = ''
    }

    msg.channel.send("All players revived")
}

function help(msg) {
    helpText = `
        Welcome to MafiaBot by Bullish.

        **Commands: **

        \`mafia.mod\` = make yourself mod.
        \`mafia.join\` = join the game.
        \`mafia.add [playerName]\` = add a player; [playerName] must be exact.
        \`mafia.kick [playerName]\` = add a player; [playerName] pattern matches.
        \`mafia.players\` = list all players.
        \`mafia.kill [playerName]\` = kills a player; [playerName] pattern matches.
        \`vtl [playerName]\` = votes to lynch a player; [playerName] pattern matches.
        \`unvote\` = unvotes.
        \`votes\` = lists the current vote count.
        \`mafia.resetvotes\` = resets the vote count to 0.
        \`mafia.reset\` = reset all game variables.
        \`mafia.revive\` = revive all players.
        \`mafia.help\` = opens this help menu.
    `

    let embed = {
        color: "888888",
        title: "How to use this bot: ",
        description: helpText
    }

    msg.channel.send({embed: embed})
}

function _getPlayers(msg) {
    let conentArray = msg.content.split(" ")
    let name = conentArray[1] || ''
    let context = conentArray[2] || ''
    let selectedPlayers = []

    if(name != '' && name != null) {
        for(let player of game.players) {
            if(player.name.toUpperCase().includes(name.toUpperCase())) {
                selectedPlayers.push(player)
            }
        }
    }

    return {
        players: selectedPlayers,
        context: context
    }
}
