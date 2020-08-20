var auth = require('./auth.json');
var Mafia = require('./functions.js');
var game = require('./game.js');

var game = game.game

const Discord = require('discord.js');
const client = new Discord.Client();
client.login(auth.token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => { try {
    let content = msg.content.toLowerCase()
    // console.log('======= START =======');
    // console.log('msg', msg);
    // console.log('msg.nickname', msg.member.displayName);
    // console.log('msg.content', msg.content);
    // console.log('msg.embeds', msg.embeds);
    // console.log('======= END =======');

    //join a game as mod
    if (content.startsWith("mafia.mod")) {
        Mafia.mod(msg)
    }
    //add a player by name
    else if (content.startsWith("mafia.join")) {
        Mafia.join(msg);
    }
    //join a game as player
    else if (content.startsWith("mafia.add")) {
        Mafia.add(msg);
    }
    //kick player
    else if (content.startsWith("mafia.kick")) {
        if(msg.author.username == game.mod.username || msg.author.username == 'Bullish') {
            Mafia.kick(msg);
        }
        else {
            msg.channel.send('This is a mod-only action. ')
        }
    }
    //list the mod and players
    else if (content.startsWith("mafia.players") || content.startsWith("mafia.ls")) {
        Mafia.players(msg);
    }
    //display game status
    else if (content.startsWith("mafia.status")) {
        Mafia.status(msg);
    }
    //kill a player
    else if (content.startsWith("mafia.kill")) {
        if(msg.author.username == game.mod.username || msg.author.username == 'Bullish') {
            Mafia.kill(msg);
        }
        else {
            msg.channel.send('This is a mod-only action. ')
        }
    }
    //vote to lynch a player
    else if (content.startsWith("vtl ") || content.startsWith("vte ") || content.startsWith("vote ")) {
        Mafia.vtl(msg);
    }
    //unvote
    else if (content.startsWith("unvote")) {
        Mafia.unvote(msg);
    }
    //display the vote count
    else if (content.startsWith("mafia.votes") || content.startsWith("mafia.votecount") || content.startsWith("mafia.v") || content.startsWith("mafia.vc")) {
        Mafia.votes(msg);
    }
    //reset vote count
    else if (content.startsWith("mafia.resetvotes") || content.startsWith("mafia.rv")) {
        if(msg.author.username == game.mod.username || msg.author.username == 'Bullish') {
            Mafia.resetvotes(msg);
        }
        else {
            msg.channel.send('This is a mod-only action. ')
        }
    }
    //reset all values
    else if (content.startsWith("mafia.reset")) {
        if(msg.author.username == game.mod.username || msg.author.username == 'Bullish') {
            Mafia.reset(msg);
        }
        else {
            msg.channel.send('This is a mod-only action. ')
        }
    }
    //revive all players
    else if (content.startsWith("mafia.revive")) {
        if(msg.author.username == game.mod.username || msg.author.username == 'Bullish') {
            Mafia.revive(msg);
        }
        else {
            msg.channel.send('This is a mod-only action. ')
        }
    }
    //display help text
    else if (content.startsWith("mafia.help")) {
        Mafia.help(msg);
    }
}
catch(err) {
    console.log('err', err)
}
});
