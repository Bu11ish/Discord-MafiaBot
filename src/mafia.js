import { EmbedBuilder } from 'discord.js';

export class Mafia {

    enabled = true;
    channel = undefined;
    title = '';
    gameMod = {
        username: null,
        displayName: null
    };

    playersList = [];
    _player = {
        username: null,
        displayName: null,
        name: null,
        alive: true,
        note: '',
        vtl: null
    };

    timer = null;
    countdown = null;
    _countdownTime = 30;

    constructor(channel) {
        this.channel = channel;
    }

    mod(msg) {
        this.gameMod.username = msg.author.username
        this.gameMod.displayName = msg.member.displayName
        let indexOfSpace = msg.content.indexOf(" ")
        if(indexOfSpace >=0 ) {
            this.title = msg.content.substring(msg.content.indexOf(" ")+1)
        }
        else {
            this.title = "Mafia"
        }

        let embed = new EmbedBuilder()
            .setColor("FF00FF")
            .setTitle("The mod is: " + this.gameMod.displayName);

        this.channel.send({embeds: [embed]})
    }

    makemod(msg) {
        let contentArray = msg.content.split(" ")
        let name = contentArray[1]

        this.gameMod.username = null
        this.gameMod.displayName = name
        this.title = "Mafia"

        let embed = new EmbedBuilder()
            .setColor("FF00FF")
            .setTitle("The mod is: " + this.gameMod.displayName);

        this.channel.send({embeds: [embed]})
    }

    join(msg) {
        for(let player of this.playersList) {
            if(msg.author.username.toUpperCase() == player.username.toUpperCase()) {
                player.displayName = msg.author.displayName
                this.channel.send("You're already in the game. ")
                return
            }
        }

        this.playersList.push({
            username: msg.author.username,
            displayName: msg.author.displayName,
            alive: true,
            note: '',
            vtl: null
        })

        let embed = new EmbedBuilder()
            .setColor("00FF00")
            .setTitle(msg.member.displayName + " has joined. ");

        this.channel.send({embeds: [embed]})
    }

    leave(msg) {
        for(let player of this.playersList) {
            if(msg.author.username.toUpperCase() == player.username.toUpperCase()) {
                this.playersList.splice(this.playersList.indexOf(player), 1)
                this.channel.send(msg.member.displayName + " left the game. ")
                return
            }
        }
    }

    add(msg) {
        let playersAdded = 0

        for(let playerToAdd of msg.mentions.users.values().take(5)) {
            let player = this.playersList.find(player => {
                return player.username.toUpperCase() == playerToAdd.username.toUpperCase()
            })
            if(player) {
                player.alive = true
                player.displayName = playerToAdd.displayName
                this.channel.send(player.displayName + " is already in the game and has been revived. ")
            }
            else {
                playersAdded++
                this.playersList.push({
                    username: playerToAdd.username,
                    displayName: playerToAdd.displayName,
                    alive: true,
                    note: '',
                    vtl: null
                })
            }
        }

        let embed = new EmbedBuilder()
            .setColor("22AA22")
            .setTitle(playersAdded + " players added. ");

        this.channel.send({embeds: [embed]})
    }

    kick(msg) {
        let fields = this._matchName(msg)

        let message = ''
        if(fields.players.length == 0) {
            message = "No players with identifier found. "
        }
        else if(fields.players.length == 1) {
            this.playersList.splice(this.playersList.indexOf(fields.players[0]), 1)
            message = `Removed player: **${fields.players[0].displayName}**`
        }
        else {
            message = "Multiple players with identifier found, please be more specific. "
        }

        this.channel.send(message)
    }

    players(msg) {
        let playersList = ''
        for(let player of this.playersList) {
            if(player.alive) {
                playersList = playersList + "\n" + player.displayName
            }
        }
        for(let player of this.playersList) {
            if(!player.alive) {
                playersList = playersList + `\n~~${player.displayName}~~ - *dead - ${player.note}.*`
            }
        }

        if(playersList == '') {
            playersList = '*None*'
        }
        let title = "Players"
        if(this.title != '' && this.title != null) {
            title = title + " in " + this.title
        }

        let embed = new EmbedBuilder()
            .setColor("AA2200")
            .setTitle(title + ": ")
            .setDescription(playersList);

        this.channel.send({embeds: [embed]})
    }

    start(msg) {
        let contentArray = msg.content.split(" ")
        let time = contentArray[1] || "15"
        time = parseInt(time) * 60 // time in seconds

        this.stop(msg)

        let end = function() {
            if(this.timer == null) {
                return;
            }
            var timeleft = this._countdownTime
            this.channel.send(timeleft + "s remaining")

            let countdown = function() {
                if(this.countdown == null) {
                    return;
                }
                timeleft = timeleft - 5
                if(timeleft <= 0) {
                    clearTimeout(this.timer)
                    clearInterval(this.countdown)
                    this.timer = null
                    this.countdown = null
                    this.channel.send("0s: **Phase ended.**")
                    return;
                }
                if(timeleft != 25 && timeleft != 15) {
                    this.channel.send(timeleft + "s remaining")
                }
            }.bind(this)
            this.countdown = setInterval(countdown, 5000)

        }.bind(this)
        this.timer = setTimeout(end, (time-this._countdownTime)*1000)

        this.channel.send("**Phase starting with " + time/60 + " mins.**")
    }

    stop(msg) {
        if(this.timer || this.countdown) {
            clearTimeout(this.timer)
            clearInterval(this.countdown)
            this.timer = null
            this.countdown = null
            this.channel.send("**Phase stopped.**")
        }
    }

    timecheck(msg) {
        let timeLeft = this._getTimeLeft(msg)
        if(timeLeft == null) {
            this.channel.send("No phase in progress. ")
        }
        else {
            this.channel.send(timeLeft + " remaining")
        }
    }

    _getTimeLeft(msg) {
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

    status(msg) {
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

        let embed = new EmbedBuilder()
            .setColor("FFFF00")
            .setTitle("Status: ")
            .setDescription(status);

        this.channel.send({embeds: [embed]})
    }

    kill(msg) {
        let fields = this._matchName(msg)

        let message = ''
        if(fields.players.length == 0) {
            message = "No players with identifier found. "
        }
        else if(fields.players.length == 1) {
            fields.players[0].alive = false
            fields.players[0].note = fields.context.substring(0,100)
            fields.players[0].vtl = null
            message = `Killed player: **${fields.players[0].displayName}** - ${fields.players[0].note}`
            this.resetvotes(msg)
        }
        else {
            message = "Multiple players with identifier found, please be more specific. "
        }

        this.channel.send(message)
    }

    vtl(msg) {
        let voter = null
        for(let player of this.playersList) {
            if(msg.author.username.toUpperCase() == player.username.toUpperCase()) {
                voter = player
            }
        }
        if(!voter) {
            this.channel.send(msg.member.displayName + " ur not in the game. ")
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
                this.channel.send('This player is already dead!')
                return
            }

            voter.vtl = votedPlayer.displayName

            message = `**${voter.displayName}** voted **${votedPlayer.displayName}**`
            this.channel.send(message)
            this.votes(msg)
            return
        }
        else {
            message = "Multiple players with identifier found, please be more specific. "
        }

        this.channel.send(message)
    }

    vtnl(msg) {
        let voter = null
        for(let player of this.playersList) {
            if(msg.author.username.toUpperCase() == player.username.toUpperCase()) {
                voter = player
            }
        }
        if(!voter) {
            this.channel.send(msg.member.displayName + " ur not in the game. ")
            return
        }
        voter.vtl = 'vtnl'
        this.votes(msg)
    }

    unvote(msg) {
        for(let player of this.playersList) {
            if(msg.author.username.toUpperCase() == player.username.toUpperCase()) {
                if(player.vtl == null) {
                    return
                }
                else {
                    player.vtl = null
                    this.channel.send(`**${msg.member.displayName}** unvoted`)
                    return
                }
            }
        }
    }

    votes(msg) {
        let votes = {}
        let votesStr = ''
        let votesToLynch = Math.floor(this.playersList.filter(player => player.alive).length/2 + 1)
        for(let player of this.playersList) {
            if(player.vtl != null) {
                if(votes[player.vtl]) {
                    votes[player.vtl].push(player.displayName)
                }
                else {
                    votes[player.vtl] = [player.displayName]
                }
            }
        }

        for(let lynchee in votes) {
            if(votes[lynchee].length < votesToLynch) {
                votesStr = votesStr + `${lynchee} (${votes[lynchee].length}/${votesToLynch}) - ${votes[lynchee].join(", ")} \n`
            }
            else {
                votesStr = "**" + votesStr + `${lynchee} (${votes[lynchee].length}/${votesToLynch}) - ${votes[lynchee].join(", ")}** \n`
            }
        }

        if(votesStr == '') {
            votesStr = '*None*'
        }

        let embed = new EmbedBuilder()
            .setColor("22AAFF")
            .setTitle("Vote count: ")
            .setDescription(votesStr);

        this.channel.send({embeds: [embed]})
    }

    resetvotes(msg) {
        for(let player of this.playersList) {
            player.vtl = null
        }

        this.channel.send("Votes reset")
    }

    reset(msg) {
        this.stop(msg)
        this.title = '';
        this.gameMod = {
            username: null,
            displayName: null
        };
        this.playersList = [];
        this.timer = null;

        this.channel.send("**Game reset**")
    }

    revive(msg) {
        for(let player of this.playersList) {
            player.alive = true
            player.note = ''
        }

        this.channel.send("All players revived")
    }

    help(msg) {
        let helpText = `
            *Welcome to MafiaBot by Bullish and Speedrace.*
            *This bot's purpose is to help a mafia mod keep track of the players, who's playing, who's alive, the vote count, and the timer.*
            *Type \`mafia.disable\` to disable the bot on this channel; \`mafia.enable\` to re-enable.*

            **General Commands: **
            \`mafia.help\` = opens this help menu.
            \`mafia.players\` = list all players. *(alias mafia.ls)*
            \`timecheck\` = shows time left in the phase.
            \`votecount\` = lists the current vote count. *(alias mafia.votes)*

            **Mod Commands: **
            \`mafia.mod [gameTitle]\` = make yourself mod, with [gameTitle] as the game's title.
            \`mafia.start [time]\` = starts a phase with [time] minutes on the clock; default 15 minutes.
            \`mafia.stop\` = stops the phase.
            \`mafia.kill [playerName] [deathMessage]\` = kills a player; [playerName] pattern matches; [deathMessage] displays after the player name, max 100 characters.

            **Player Commands: **
            \`mafia.join\` = join the game.
            \`mafia.leave\` = leave the game.
            \`vtl [playerName]\` = votes to lynch a player; [playerName] pattern matches. *(alias vte, vote)*
            \`unvote\` = unvotes.

            *Type \`mafia.morehelp\` for more help.*
        `

        let embed = new EmbedBuilder()
            .setColor("CCCCCC")
            .setTitle("How to use this bot: ")
            .setDescription(helpText);

        this.channel.send({embeds: [embed]})
    }

    morehelp(msg) {
        let helpText = `
            \`mafia.makemod [playerName]\` = make [playerName] the mod, must be exact.
            \`mafia.add [playerMentions...]\` = add a player; [playerMentions...] is up to 5 user mentions. Revives the player if they're already in the game.
            \`mafia.kick [playerName]\` = kick a player; [playerName] pattern matches.
            \`mafia.status\` = shows some stats about the current game.
            \`mafia.resetvotes\` = resets the vote count to 0. *(alias mafia.rv)*
            \`mafia.reset\` = reset all game variables.
            \`mafia.revive\` = revive all players.

            *Visit https://github.com/Bu11ish/Discord-MafiaBot for the source code.*
        `

        let embed = new EmbedBuilder()
            .setColor("222222")
            .setTitle("More help: ")
            .setDescription(helpText);

        this.channel.send({embeds: [embed]})
    }

    _matchName(msg) {
        let contentArray = msg.content.split(" ")
        let name = contentArray[1] || ''
        let context = contentArray.slice(2).join(" ")
        let selectedPlayers = []

        if(name != '' && name != null) {
            for(let player of this.playersList) {
                if(player.displayName.toUpperCase() == name.toUpperCase()) {
                    // if there is an exact match, return the first instance
                    selectedPlayers = [player]
                    break;
                }
                else if(player.displayName.toUpperCase().includes(name.toUpperCase())) {
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
