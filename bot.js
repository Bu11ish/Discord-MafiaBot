var auth = require('./auth.json');
const { Mafia } = require('./Mafia');

var channels = {}

const Discord = require('discord.js');
const client = new Discord.Client();
client.login(auth.token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('mafia.help', { type: 'WATCHING' })
});

client.on('message', msg => { try {
    // console.log('======= START =======');
    // console.log('msg', msg);
    // console.log('msg.nickname', msg.member.displayName);
    // console.log('msg.content', msg.content);
    // console.log('msg.embeds', msg.embeds);
    // console.log('======= END =======');

    // disable bot on certain channels
    // if(msg.channel.id in ['713559089644437506']) {
    //     console.log("disabled on this server")
    //     return
    // }

    //add channel to channelGame
    if(!(msg.channel.id in channels)) {
        channels[msg.channel.id] = new Mafia(msg)
    }
    let game = channels[msg.channel.id]
    let content = msg.content.toLowerCase()
    //check if bot is enabled, only listen for "mafia.enable"
    if(!game.enabled && content != "mafia.enable") {
        return
    }

    //auth header
    let auth = function() {
        if(msg.member.displayName.toUpperCase() == game.gameMod.displayName.toUpperCase() || msg.author.username == 'Bullish') {
            return true
        }
        else {
            msg.channel.send('This is a mod-only action. ')
            return false
        }
    }

    //enable the bot
    if (content.startsWith("mafia.enable")) {
        game.enabled = true
        msg.channel.send('Bot enabled')
    }
    //disable the bot
    if (content.startsWith("mafia.disable")) {
        game.enabled = false
        msg.channel.send('Bot disabled')
    }

    //join a game as mod
    if (content.startsWith("mafia.mod")) {
        game.mod(msg)
    }
    //manually appoint a mod
    if (content.startsWith("mafia.makemod")) {
        game.makemod(msg)
    }
    //join the game as player
    else if (content.startsWith("mafia.join")) {
        game.join(msg);
    }
    //leave the game as player
    else if (content.startsWith("mafia.leave")) {
        game.leave(msg);
    }
    //manually add a player
    else if (content.startsWith("mafia.add ")) {
        game.add(msg);
    }
    //manually add a list of players separeated by " "
    else if (content.startsWith("mafia.addmany ")) {
        game.addmany(msg);
    }
    //kick player
    else if (content.startsWith("mafia.kick")) {
        if(auth) { game.kick(msg) }
    }
    //list the players
    else if (content.startsWith("mafia.players") || content.startsWith("mafia.ls")) {
        game.players(msg);
    }
    //start the game timer
    else if (content.startsWith("mafia.start")) {
        if(auth) { game.start(msg) }
    }
    //stop the game timer
    else if (content.startsWith("mafia.stop")) {
        if(auth) { game.stop(msg) }
    }
    //check time left
    else if (content.startsWith("mafia.time") || content.startsWith("timecheck")) {
        game.timecheck(msg);
    }
    //display some stats about the game
    else if (content.startsWith("mafia.status")) {
        game.status(msg);
    }
    //kill a player
    else if (content.startsWith("mafia.kill")) {
        if(auth) { game.kill(msg) }
    }
    //vote to lynch a player
    else if (content.startsWith("vtl ") || content.startsWith("vte ") || content.startsWith("vote ")) {
        game.vtl(msg);
    }
    //vote to no lynch
    else if (content.startsWith("vtnl") || content.startsWith("vtne")) {
        game.vtnl(msg);
    }
    //unvote
    else if (content.startsWith("unvote")) {
        game.unvote(msg);
    }
    //display the vote count
    else if (content.startsWith("mafia.votes") || content.startsWith("mafia.votecount") || content.startsWith("votecount")) {
        game.votes(msg);
    }
    //reset vote count
    else if (content.startsWith("mafia.resetvotes") || content.startsWith("mafia.rv")) {
        if(auth) { game.resetvotes(msg) }
    }
    //reset all values
    else if (content.startsWith("mafia.reset")) {
        if(auth) { game.reset(msg) }
    }
    //revive all players
    else if (content.startsWith("mafia.revive")) {
        if(auth) { game.revive(msg) }
    }
    //display help text
    else if (content.startsWith("mafia.help")) {
        game.help(msg);
    }
    //display more help text
    else if (content.startsWith("mafia.morehelp")) {
        game.morehelp(msg);
    }
}
catch(err) {
    console.log('err', err)
}
});
