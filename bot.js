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

    //add channel to channelGame
    if(!(msg.channel.id in channels)) {
        channels[msg.channel.id] = new Mafia(msg)
    }
    let game = channels[msg.channel.id]

    let content = msg.content.toLowerCase()
    //join a game as mod
    if (content.startsWith("mafia.mod")) {
        game.mod(msg)
    }
    //add a player by name
    else if (content.startsWith("mafia.join")) {
        game.join(msg);
    }
    //join a game as player
    else if (content.startsWith("mafia.add")) {
        game.add(msg);
    }
    //kick player
    else if (content.startsWith("mafia.kick")) {
        if(msg.author.username == game.mod.username || msg.author.username == 'Bullish') {
            game.kick(msg);
        }
        else {
            msg.channel.send('This is a mod-only action. ')
        }
    }
    //list the mod and players
    else if (content.startsWith("mafia.players") || content.startsWith("mafia.ls")) {
        game.players(msg);
    }
    //display game status
    else if (content.startsWith("mafia.start")) {
        if(msg.author.username == game.mod.username || msg.author.username == 'Bullish') {
            game.start(msg);
        }
        else {
            msg.channel.send('This is a mod-only action. ')
        }
    }
    //display game status
    else if (content.startsWith("mafia.stop")) {
        if(msg.author.username == game.mod.username || msg.author.username == 'Bullish') {
            game.stop(msg);
        }
        else {
            msg.channel.send('This is a mod-only action. ')
        }
    }
    //display game status
    else if (content.startsWith("mafia.time") || content.startsWith("timecheck")) {
        game.timecheck(msg);
    }
    //display game status
    else if (content.startsWith("mafia.status")) {
        game.status(msg);
    }
    //kill a player
    else if (content.startsWith("mafia.kill")) {
        if(msg.author.username == game.mod.username || msg.author.username == 'Bullish') {
            game.kill(msg);
        }
        else {
            msg.channel.send('This is a mod-only action. ')
        }
    }
    //vote to lynch a player
    else if (content.startsWith("vtl ") || content.startsWith("vte ") || content.startsWith("vote ")) {
        game.vtl(msg);
    }
    //unvote
    else if (content.startsWith("unvote")) {
        game.unvote(msg);
    }
    //display the vote count
    else if (content.startsWith("mafia.votes") || content.startsWith("mafia.votecount") || content.startsWith("mafia.v") || content.startsWith("mafia.vc")) {
        game.votes(msg);
    }
    //reset vote count
    else if (content.startsWith("mafia.resetvotes") || content.startsWith("mafia.rv")) {
        if(msg.author.username == game.mod.username || msg.author.username == 'Bullish') {
            game.resetvotes(msg);
        }
        else {
            msg.channel.send('This is a mod-only action. ')
        }
    }
    //reset all values
    else if (content.startsWith("mafia.reset")) {
        if(msg.author.username == game.mod.username || msg.author.username == 'Bullish') {
            game.reset(msg);
        }
        else {
            msg.channel.send('This is a mod-only action. ')
        }
    }
    //revive all players
    else if (content.startsWith("mafia.revive")) {
        if(msg.author.username == game.mod.username || msg.author.username == 'Bullish') {
            game.revive(msg);
        }
        else {
            msg.channel.send('This is a mod-only action. ')
        }
    }
    //display help text
    else if (content.startsWith("mafia.help")) {
        game.help(msg);
    }
}
catch(err) {
    console.log('err', err)
}
});