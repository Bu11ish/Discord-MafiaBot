var auth = require('./auth.json');

const Discord = require('discord.js');
const client = new Discord.Client();
client.login(auth.token);

var game = {
    status: '',
    mod: {
        name: null
    },
    players: []
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
    else if (content.startsWith("vtl")) {
        vtl(msg);
    }
    //reset all values
    else if (content.startsWith("mafia.reset")) {
        reset(msg);
    }
    //revive all players
    else if (content.startsWith("mafia.revive")) {
        reset(msg);
    }
    //reset vote count
    else if (content.startsWith("mafia.resetvotes") || content.startsWith("mafia.rv")) {
        resetvotes(msg);
    }
    //display the vote count
    else if (content.startsWith("mafia.votes")) {
        votes(msg);
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
    let conentArray = msg.content.split(" ")
    let name = conentArray[1]
    let playerToKick = -1
    let count = 0
    for(let player of game.players) {
        if(player.name.toUpperCase().includes(name.toUpperCase())) {
            playerToKick = game.players.indexOf(player)
            count++
        }
    }

    let message = ''
    if(count == 0) {
        message = "No players with identifier found. "
    }
    else if(count == 1) {
        players.splice(i, 1)
        message = `Removed player: **${game.players[playerToKick].name}**`
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

    console.log(embed)

    msg.channel.send({embed: embed})
}

function kill(msg) {
    let conentArray = msg.content.split(" ")
    let name = conentArray[1]
    let note = conentArray[2] || ''
    let playerToKill = null
    let count = 0

    console.log('name', name)

    for(let player of game.players) {
        if(player.name.toUpperCase().includes(name.toUpperCase())) {
            playerToKill = player
            count++
        }
    }

    let message = ''
    if(count == 0) {
        message = "No players with identifier found. "
    }
    else if(count == 1) {
        playerToKill.alive = false
        playerToKill.note = note
        message = `Killed player: **${playerToKill.name}** - ${playerToKill.note}`
    }
    else {
        message = "Multiple players with identifier found, please be more specific. "
    }

    msg.channel.send(message)
}
