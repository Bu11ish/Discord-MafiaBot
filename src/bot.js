import { Mafia } from './mafia.js';
import { Client, Events, GatewayIntentBits, ActivityType } from 'discord.js';
import auth from '../auth.json' with { type: "json" };

const channels = {}

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]});

client.login(auth.token);

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    readyClient.user.setActivity({name: 'mafia.help', type: ActivityType.Watching })
});

client.on(Events.MessageCreate, msg => { try {
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

    // forward message from 746500317813669951 to 1081225072909484155/713559089644437506
    // if(msg.channel.id === '746500317813669951' && !msg.author.bot) {
    //     let c = client.channels.valueOf().find(channel => channel.id === '713559089644437506')
    //     c.send(msg.content)
    //     console.log("message forwarded")
    // }

    //add channel to channels
    if(!(msg.channel.id in channels)) {        
        let channel = client.channels.cache.get(msg.channelId);
        channels[msg.channel.id] = new Mafia(channel)
    }
    let game = channels[msg.channel.id]
    let content = msg.content.toLowerCase()
    //check if bot is enabled, only listen for "mafia.enable"
    if(!game.enabled && content != "mafia.enable") {
        return
    }

    //auth header
    let auth = function() {
        if(msg.author.username == 'bu11ish') {
            return true
        }
        else if(game.gameMod.displayName != null && msg.member.displayName.toUpperCase() == game.gameMod.displayName.toUpperCase()) {
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
        if(auth()) { game.kick(msg) }
    }
    //list the players
    else if (content.startsWith("mafia.players") || content.startsWith("mafia.ls")) {
        game.players(msg);
    }
    //start the game timer
    else if (content.startsWith("mafia.start")) {
        if(auth()) { game.start(msg) }
    }
    //stop the game timer
    else if (content.startsWith("mafia.stop")) {
        if(auth()) { game.stop(msg) }
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
        if(auth()) { game.kill(msg) }
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
        if(auth()) { game.resetvotes(msg) }
    }
    //reset all values
    else if (content.startsWith("mafia.reset")) {
        if(auth()) { game.reset(msg) }
    }
    //revive all players
    else if (content.startsWith("mafia.revive")) {
        if(auth()) { game.revive(msg) }
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
