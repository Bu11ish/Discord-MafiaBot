class Mafia {

    enabled = true
    channel = '|';
    title = '';
    gameMod = {
        username: null,
        displayName: null
    };
    playersList = new Array();
    timer = null;

    _player = {
        name: null,
        alive: true,
        note: '',
        vtl: null
    };
    _countdownTime = 30;

    constructor(msg) {
        this.channel = msg.channel.id;
    }

    mod = function(msg) {
        this.gameMod.username = msg.author.username
        this.gameMod.displayName = msg.member.displayName
        let indexOfSpace = msg.content.indexOf(" ")
        if(indexOfSpace >=0 ) {
            this.title = msg.content.substring(msg.content.indexOf(" ")+1)
        }
        else {
            this.title = "Mafia"
        }

        let embed = {
            color: "FF00FF",
            title: "The mod is: " + this.gameMod.displayName
        }

        msg.channel.send({embed: embed})
    }

    join = function(msg) {
        for(let player of this.playersList) {
            if(msg.member.displayName.toUpperCase() == player.name.toUpperCase()) {
                msg.channel.send("You're already in the game. ")
                return
            }
        }

        this.playersList.push({
            name: msg.member.displayName,
            alive: true,
            note: '',
            vtl: null
        })

        let embed = {
            color: "00FF00",
            title: msg.member.displayName + " has joined. "
        }

        msg.channel.send({embed: embed})
    }

    add = function(msg) {
        let conentArray = msg.content.split(" ")
        let name = conentArray[1]

        if(name == '' || name == null) {
            msg.channel.send("Cannot add blank name. ")
            return
        }

        for(let player of this.playersList) {
            if(name.toUpperCase() == player.name.toUpperCase()) {
                player.alive = true
                msg.channel.send(name + " is already in the game and has been revived. ")
                return
            }
        }

        this.playersList.push({
            name: name,
            alive: true,
            note: '',
            vtl: null
        })

        let embed = {
            color: "22AA22",
            title: name + " has been added. "
        }

        msg.channel.send({embed: embed})
    }

    kick = function(msg) {
        let fields = this._matchName(msg)

        let message = ''
        if(fields.players.length == 0) {
            message = "No players with identifier found. "
        }
        else if(fields.players.length == 1) {
            this.playersList.splice(this.playersList.indexOf(fields.players[0]), 1)
            message = `Removed player: **${fields.players[0].name}**`
        }
        else {
            message = "Multiple players with identifier found, please be more specific. "
        }

        msg.channel.send(message)
    }

    players = function(msg) {
        let playersList = ''
        for(let player of this.playersList) {
            if(player.alive) {
                playersList = playersList + "\n" + player.name
            }
        }
        for(let player of this.playersList) {
            if(!player.alive) {
                playersList = playersList + `\n~~${player.name}~~ - *dead - ${player.note}.*`
            }
        }

        if(playersList == '') {
            playersList = '*None*'
        }
        let title = "Players"
        if(this.title != '' && this.title != null) {
            title = title + " of " + this.title
        }

        let embed = {
            color: "AA2200",
            title: title + ": ",
            description: playersList
        }

        msg.channel.send({embed: embed})
    }

    start = function(msg) {
        let conentArray = msg.content.split(" ")
        let time = conentArray[1] || "0"
        time = parseInt(time) * 60 // time in seconds

        clearTimeout(this.timer)

        let end = function() {
            if(this.timer == null) {
                return;
            }
            var timeleft = 30
            msg.channel.send(timeleft + "s remaining")
            let countdown = function() {
                if(this.timer == null) {
                    clearInterval(gameCountdown)
                    return;
                }
                timeleft = timeleft - 5
                if(timeleft <= 0) {
                    msg.channel.send("0s: **Phase ended.**")
                    clearInterval(gameCountdown)
                    clearTimeout(this.timer)
                    this.timer = null
                    return;
                }
                msg.channel.send(timeleft + "s remaining")
            }.bind(this)
            var gameCountdown = setInterval(countdown, 5000)
        }.bind(this)
        this.timer = setTimeout(end, (time-this._countdownTime)*1000)

        msg.channel.send("**Phase starting with " + time/60 + " mins.**")
    }

    stop = function(msg) {
        if(this.timer) {
            clearTimeout(this.timer)
            this.timer = null
            msg.channel.send("**Phase stopped.**")
        }
    }

    timecheck = function(msg) {
        let timeLeft = this._getTimeLeft(msg)
        if(timeLeft == null) {
            msg.channel.send("No phase in progress. ")
        }
        else {
            msg.channel.send(timeLeft + " remaining")
        }
    }

    _getTimeLeft = function(msg) {
        let timer = this.timer
        if(timer == null) {
            return null
        }
        let totalSeconds = Math.ceil((timer._idleStart + timer._idleTimeout - process.uptime()*1000) / 1000) + this._countdownTime;
        let minutesLeft = Math.floor(totalSeconds/60)
        let secondsLeft = totalSeconds%60
        if(secondsLeft < 10) {
            secondsLeft = "0" + secondsLeft
        }

        return "" + minutesLeft + ":" + secondsLeft
    }

    status = function(msg) {
        let status = ''
        if(this.gameMod.displayName != null) {
            status = status + "Game: " + this.title + "\n"
            status = status + "Mod: " + this.gameMod.displayName + "\n"
        }
        status = status + "Game in progress: " + (this.timer != null) + "\n"
        if(this.timer != null) {
            status = status + "Time remaining: " + this._getTimeLeft() + "\n"
        }
        if(this.playersList.length > 0) {
            status = status + "Player count: " + this.playersList.length + "\n"
            status = status + "Living player count: " + this.playersList.filter(player => player.alive).length + "\n"
        }

        let embed = {
            color: "FFFF00",
            title: "Status: ",
            description: status
        }

        msg.channel.send({embed: embed})
    }

    kill = function(msg) {
        let fields = this._matchName(msg)

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

    vtl = function(msg) {
        let voter = null
        for(let player of this.playersList) {
            if(msg.member.displayName.toUpperCase() == player.name.toUpperCase()) {
                voter = player
            }
        }
        if(!voter) {
            msg.channel.send(msg.member.displayName + " ur not in the game. ")
            return
        }

        let fields = this._matchName(msg)
        // do not register if there's more to the content than just a vote
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
            this.votes(msg)
            return
        }
        else {
            message = "Multiple players with identifier found, please be more specific. "
        }

        msg.channel.send(message)
    }

    vtnl = function(msg) {
        let voter = null
        for(let player of this.playersList) {
            if(msg.member.displayName.toUpperCase() == player.name.toUpperCase()) {
                voter = player
            }
        }
        if(!voter) {
            msg.channel.send(msg.member.displayName + " ur not in the game. ")
            return
        }
        voter.vtl = 'vtnl'
        this.votes(msg)
    }

    unvote = function(msg) {
        for(let player of this.playersList) {
            if(msg.member.displayName.toUpperCase() == player.name.toUpperCase()) {
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

    votes = function(msg) {
        let votes = {}
        let votesStr = ''
        let votesToLynch = Math.floor(this.playersList.filter(player => player.alive).length/2 + 1)
        for(let player of this.playersList) {
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

        if(votesStr == '') {
            votesStr = '*None*'
        }

        let embed = {
            color: "22AAFF",
            title: "Vote count: ",
            description: votesStr
        }

        msg.channel.send({embed: embed})
    }

    resetvotes = function(msg) {
        for(let player of this.playersList) {
            player.vtl = null
        }

        msg.channel.send("Votes reset")
    }

    reset = function(msg) {
        this.stop(msg)
        this.title = '';
        this.gameMod = {
            username: null,
            displayName: null
        };
        this.playersList = [];
        this.timer = null;

        msg.channel.send("**Game reset**")
    }

    revive = function(msg) {
        for(let player of this.playersList) {
            player.alive = true
            player.note = ''
        }

        msg.channel.send("All players revived")
    }

    help = function(msg) {
        let helpText = `
            *Welcome to MafiaBot by Bullish.*
            This bot's purpose is to help a mafia mod keep track of the players, who's playing, who's alive, the vote count, and the timer.
            Type \`mafia.disable\` to disable the bot on this channel; \`mafia.enable\` to re-enable.

            **Commands: **

            \`mafia.mod [gameTitle]\` = make yourself mod, with [gameTitle] as the game's title.
            \`mafia.join\` = join the game.
            \`mafia.add [playerName]\` = add a player; [playerName] must be exact. Revives the player if they're already in the game.
            \`mafia.kick [playerName]\` = kick a player; [playerName] pattern matches.
            \`mafia.players\` = list all players. *(alias mafia.ls)*
            \`mafia.start [time]\` = starts a phase with [time] minutes on the clock.
            \`mafia.stop\` = stops the phase.
            \`timecheck\` = shows time left in the phase.
            \`mafia.status\` = shows some stats about the current game.
            \`mafia.kill [playerName] [deathMessage]\` = kills a player; [playerName] pattern matches; [deathMessage] displays after the player name.
            \`vtl [playerName]\` = votes to lynch a player; [playerName] pattern matches. *(alias vte, vote)*
            \`unvote\` = unvotes.
            \`votecount\` = lists the current vote count. *(alias mafia.votes)*
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

    _matchName = function(msg) {
        let contentArray = msg.content.split(" ")
        let name = contentArray[1] || ''
        let context = contentArray.slice(2).join(" ")
        let selectedPlayers = []

        if(name != '' && name != null) {
            for(let player of this.playersList) {
                if(player.name.toUpperCase() == name.toUpperCase()) {
                    // if there is an exact match, return the first instance
                    selectedPlayers = [player]
                    break;
                }
                else if(player.name.toUpperCase().includes(name.toUpperCase())) {
                    selectedPlayers.push(player)
                }
            }
        }

        return {
            players: selectedPlayers,
            context: context
        }
    }

}

module.exports = {
    Mafia,
}
