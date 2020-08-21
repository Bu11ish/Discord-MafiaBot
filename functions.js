var gameData = require('./gameData.js');

var game = gameData.game
var channelGame = gameData.channelGame

module.exports = {
    mod: mod,
    join: join,
    add: add,
    kick: kick,
    players: players,
    start: start,
    stop: stop,
    timecheck: timecheck,
    status: status,
    kill: kill,
    vtl: vtl,
    unvote: unvote,
    votes: votes,
    resetvotes: resetvotes,
    reset: reset,
    revive: revive,
    help: help
}

function mod(msg) {
    channelGame[msg.channel.id].mod.username = msg.author.username
    channelGame[msg.channel.id].mod.displayName = msg.member.displayName
    let indexOfSpace = msg.content.indexOf(" ")
    if(indexOfSpace >=0 ) {
        channelGame[msg.channel.id].title = msg.content.substring(msg.content.indexOf(" "))
    }
    else {
        channelGame[msg.channel.id].title = "Mafia"
    }

    let embed = {
        color: "FF00FF",
        title: "The mod is: " + channelGame[msg.channel.id].mod.displayName
    }

    msg.channel.send({embed: embed})
}

function join(msg) {
    for(let player of channelGame[msg.channel.id].players) {
        if(msg.member.displayName == player.name) {
            msg.channel.send("You're already in the channelGame[msg.channel.id]. ")
            return
        }
    }

    channelGame[msg.channel.id].players.push({
        name: msg.member.displayName,
        alive: true,
        note: '',
        vtl: null
    })

    let embed = {
        color: "00FF00",
        title: "Player has joined: " + msg.member.displayName
    }

    msg.channel.send({embed: embed})
}

function add(msg) {
    let conentArray = msg.content.split(" ")
    let name = conentArray[1]

    if(name == '' || name == null) {
        msg.channel.send("Cannot add blank name. ")
        return
    }

    for(let player of channelGame[msg.channel.id].players) {
        if(name == player.name) {
            player.alive = true
            msg.channel.send(name + " is already in the game and has been revived. ")
            return
        }
    }

    channelGame[msg.channel.id].players.push({
        name: name,
        alive: true,
        note: '',
        vtl: null
    })

    let embed = {
        color: "22AA22",
        title: "Player has joined: " + name
    }

    msg.channel.send({embed: embed})
}

function kick(msg) {
    let fields = _matchName(msg)

    let message = ''
    if(fields.players.length == 0) {
        message = "No players with identifier found. "
    }
    else if(fields.players.length == 1) {
        channelGame[msg.channel.id].players.splice(channelGame[msg.channel.id].players.indexOf(fields.players[0]), 1)
        message = `Removed player: **${fields.players[0].name}**`
    }
    else {
        message = "Multiple players with identifier found, please be more specific. "
    }

    msg.channel.send(message)
}

function players(msg) {
    let playersList = ''
    for(let player of channelGame[msg.channel.id].players) {
        if(player.alive) {
            playersList = playersList + "\n" + player.name
        }
    }
    for(let player of channelGame[msg.channel.id].players) {
        if(!player.alive) {
            playersList = playersList + `\n~~${player.name}~~ - *dead - ${player.note}.*`
        }
    }

    let title = "Players"
    if(channelGame[msg.channel.id].title != '' && channelGame[msg.channel.id].title != null) {
        title = title + " of " + channelGame[msg.channel.id].title
    }

    let embed = {
        color: "AA2200",
        title: title + ": ",
        description: playersList
    }

    msg.channel.send({embed: embed})
}

function start(msg) {
    let conentArray = msg.content.split(" ")
    let time = conentArray[1] || "0"
    time = parseInt(time) * 60 // time in seconds

    clearTimeout(channelGame[msg.channel.id].timer)
    channelGame[msg.channel.id].timer = setTimeout(end, (time-35)*1000)
    function end() {
        if(channelGame[msg.channel.id].timer == null) {
            return;
        }
        var timeleft = 30
        msg.channel.send(timeleft + "s remaining")
        var gameCountdown = setInterval(countdown, 5000)
        function countdown() {
            if(channelGame[msg.channel.id].timer == null) {
                clearInterval(gameCountdown)
                return;
            }
            timeleft = timeleft - 5
            if(timeleft <= 0) {
                msg.channel.send("0s: **Phase ended.**")
                clearInterval(gameCountdown)
                clearTimeout(channelGame[msg.channel.id].timer)
                channelGame[msg.channel.id].timer = null
                return;
            }
            msg.channel.send(timeleft + "s remaining")
        }
    }

    msg.channel.send("**Phase starting with " + time/60 + " mins.**")
}

function stop(msg) {
    if(channelGame[msg.channel.id].timer) {
        clearTimeout(channelGame[msg.channel.id].timer)
        channelGame[msg.channel.id].timer = null
        msg.channel.send("**Phase stopped.**")
    }
}

function timecheck(msg) {
    let timeLeft = _getTimeLeft()
    if(timeLeft == null) {
        msg.channel.send("No phase in progress. ")
    }
    else {
        msg.channel.send(timeLeft + " remaining")
    }
}

function _getTimeLeft() {
    if(channelGame[msg.channel.id].timer == null) {
        return null
    }
    let totalSeconds = Math.ceil((channelGame[msg.channel.id].timer._idleStart + channelGame[msg.channel.id].timer._idleTimeout - process.uptime()*1000) / 1000) + 10;
    let minutesLeft = Math.floor(totalSeconds/60)
    let secondsLeft = totalSeconds%60
    if(secondsLeft < 10) {
        secondsLeft = "0" + secondsLeft
    }

    return "" + minutesLeft + ":" + secondsLeft
}

function status(msg) {
    let status = ''
    if(channelGame[msg.channel.id].mod.displayName != null) {
        status = status + "Game: " + channelGame[msg.channel.id].title + "\n"
        status = status + "Mod: " + channelGame[msg.channel.id].mod.displayName + "\n"
    }
    status = status + "Game in progress: " + (channelGame[msg.channel.id].timer != null) + "\n"
    if(channelGame[msg.channel.id].timer != null) {
        status = status + "Time remaining: " + _getTimeLeft() + "\n"
    }
    if(channelGame[msg.channel.id].players.length > 0) {
        status = status + "Player count: " + channelGame[msg.channel.id].players.length + "\n"
        status = status + "Living player count: " + channelGame[msg.channel.id].players.filter(player => player.alive).length + "\n"
    }

    let embed = {
        color: "FFFF00",
        title: "Status: ",
        description: status
    }

    msg.channel.send({embed: embed})
}

function kill(msg) {
    let fields = _matchName(msg)

    let message = ''
    if(fields.players.length == 0) {
        message = "No players with identifier found. "
    }
    else if(fields.players.length == 1) {
        fields.players[0].alive = false
        fields.players[0].note = fields.context
        fields.players[0].vtl = null
        message = `Killed player: **${fields.players[0].name}** - ${fields.players[0].note}`
    }
    else {
        message = "Multiple players with identifier found, please be more specific. "
    }

    msg.channel.send(message)
}

function vtl(msg) {
    let voter = null
    for(let player of channelGame[msg.channel.id].players) {
        if(msg.member.displayName == player.name) {
            voter = player
        }
    }
    if(!voter) {
        msg.channel.send("gtfo " + msg.member.displayName + " ur not in the channelGame[msg.channel.id]. ")
        return
    }

    let fields = _matchName(msg)
    if(fields.context != null && fields.context != '') {
        return
    }

    let message = ''
    if(fields.players.length == 0) {
        message = "No players with identifier found. "
    }
    else if(fields.players.length == 1) {
        let votedPlayer = fields.players[0]
        if(!(votedPlayer.alive)) {
            msg.channel.send('This player is already dead!')
            return
        }

        voter.vtl = votedPlayer.name

        message = `**${voter.name}** voted **${votedPlayer.name}**`
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
    for(let player of channelGame[msg.channel.id].players) {
        if(msg.member.displayName == player.name) {
            if(player.vtl == null) {
                return
            }
            else {
                player.vtl = null
                msg.channel.send(`**${msg.member.displayName}** unvoted`)
                return
            }
        }
    }
}

function votes(msg) {
    let votes = {}
    let votesStr = ''
    let votesToLynch = Math.floor(channelGame[msg.channel.id].players.length/2 + 1)
    for(let player of channelGame[msg.channel.id].players) {
        if(player.vtl != null) {
            if(votes[player.vtl]) {
                votes[player.vtl].push(player.name)
            }
            else {
                votes[player.vtl] = [player.name]
            }
        }
    }

    for(let lynchee in votes) {
        if(votes[lynchee].length < votesToLynch) {
            votesStr = votesStr + `${lynchee} (${votes[lynchee].length}/${votesToLynch}) - ${votes[lynchee]} \n`
        }
        else {
            votesStr = "**" + votesStr + `${lynchee} (${votes[lynchee].length}/${votesToLynch}) - ${votes[lynchee]}** \n`
        }
    }

    let embed = {
        color: "22AAFF",
        title: "Vote count: ",
        description: votesStr
    }

    msg.channel.send({embed: embed})
}

function resetvotes(msg) {
    for(let player of channelGame[msg.channel.id].players) {
        player.vtl = null
    }

    msg.channel.send("Votes reset")
}

function reset(msg) {
    stop(msg)
    channelGame[msg.channel.id] = JSON.parse(JSON.stringify(game))

    msg.channel.send("**Game reset**")
}

function revive(msg) {
    for(let player of channelGame[msg.channel.id].players) {
        player.alive = true
        player.note = ''
    }

    msg.channel.send("All players revived")
}

function help(msg) {
    helpText = `
        *Welcome to MafiaBot by Bullish.*

        **Commands: **

        \`mafia.mod [gameTitle]\` = make yourself mod, with [gameTitle] as the game's title.
        \`mafia.join\` = join the channelGame[msg.channel.id].
        \`mafia.add [playerName]\` = add a player; [playerName] must be exact. Revives the player if they're already in the channelGame[msg.channel.id].
        \`mafia.kick [playerName]\` = kick a player; [playerName] pattern matches.
        \`mafia.players\` = list all players. *(alias mafia.ls)*
        \`mafia.start [time]\` = starts a phase with [time] minutes on the clock.
        \`mafia.stop\` = stops the phase.
        \`timecheck\` = shows time left in the phase.
        \`mafia.status\` = shows some stats about the current channelGame[msg.channel.id].
        \`mafia.kill [playerName] [deathMessage]\` = kills a player; [playerName] pattern matches; [deathMessage] displays affter the player name.
        \`vtl [playerName]\` = votes to lynch a player; [playerName] pattern matches. *(alias vte, vote)*
        \`unvote\` = unvotes.
        \`mafia.votes\` = lists the current vote count. *(alias mafia.vc)*
        \`mafia.resetvotes\` = resets the vote count to 0. *(alias mafia.rv)*
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

function _matchName(msg) {
    let conentArray = msg.content.split(" ")
    let name = conentArray[1] || ''
    let context = conentArray[2] || ''
    let selectedPlayers = []

    if(name != '' && name != null) {
        for(let player of channelGame[msg.channel.id].players) {
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
