import { Mafia } from './mafia.js';
import { Client, Events, GatewayIntentBits, ActivityType } from 'discord.js';
import botAuth from '../auth.json' with { type: "json" };

/**
 * {
 *  [channelId: string]: Mafia
 * }
 */
const channels = {} 

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]});

client.login(botAuth.token);

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    readyClient.user.setActivity({name: 'mafia.help', type: ActivityType.Watching })
});

client.on(Events.MessageCreate, msg => {
    // debug
    // console.log('======= START =======');
    // console.log('msg', msg);
    // console.log('msg.nickname', msg.member.displayName);
    // console.log('msg.content', msg.content);
    // console.log('msg.embeds', msg.embeds);
    // console.log('======= END =======');

    //add channel to channels
    if(!(msg.channelId in channels)) {
        channels[msg.channelId] = new Mafia(msg.channel)
    }
    let game = channels[msg.channelId]
    
    // forward message 
    if(getCommandSegment(msg) === "mafia.forward" && msg.author.username == 'bu11ish') {
        let firstIndex = msg.content.indexOf(" ")
        let secondIndex = msg.content.indexOf(" ", firstIndex+1)
        let channelId = msg.content.substring(
            firstIndex+1,
            secondIndex
        )
        let game = channels[channelId]
        if(game) {
            let contentToForward = msg.content.substring(secondIndex+1)
            if(contentToForward) {
                game.channel.send(contentToForward)
                console.log("message forwarded")
                return;
            }
        }
    }

    // process commands
    try {
        processCommands(msg, game);
    }
    // fail without crashing
    catch (e) {
        console.error(e);
    }
});

function getCommandSegment(msg) {
    let firstWordIndex = msg.content.indexOf(" ")
    firstWordIndex = firstWordIndex !== -1 ? firstWordIndex : msg.content.length
    return msg.content
        .substring(0, firstWordIndex)
        .toLowerCase();
}

function auth(msgAuthor, game) {
    if(msgAuthor.username == 'bu11ish') {
        return true
    }
    else if(game.gameMod.username != null && msgAuthor.username.toUpperCase() == game.gameMod.username.toUpperCase()) {
        return true
    }
    else {
        msg.channel.send('This is a mod-only action. ')
        return false
    }
}

function processCommands(msg, game) {
    let command = getCommandSegment(msg);
    
    // if bot is disabled, only listen for "mafia.enable"
    if(!game.enabled && command != "mafia.enable") {
        return;
    }
    // ignore messages from bots
    if(msg.author.bot) {
        return;
    }

    // process commands
    switch (command) {
        //enable the bot
        case "mafia.enable":
            game.enabled = true
            game.channel.send('Bot enabled')
            break;
        //disable the bot
        case "mafia.disable":
            game.enabled = false
            game.channel.send('Bot disabled')
            break;
        //join a game as mod
        case "mafia.mod":
            game.mod(msg)
            break;
        //manually appoint a mod
        case "mafia.makemod":
            game.makemod(msg)
            break;
        //join the game as player
        case "mafia.join":
            game.join(msg);
            break;
        //leave the game as player
        case "mafia.leave":
            game.leave(msg);
            break;
        //manually add a player
        case "mafia.add":
            game.add(msg);
            break;
        //manually add a list of players separeated by " "
        case "mafia.addmany":
            game.addmany(msg);
            break;
        //kick player
        case "mafia.kick":
            if(auth(msg.author, game)) { game.kick(msg) }
            break;
        //list the players
        case "mafia.players":
        case "mafia.list":
        case "mafia.ls":
            game.players(msg);
            break;
        //start the game timer
        case "mafia.start":
            if(auth(msg.author, game)) { game.start(msg) }
            break;
        //stop the game timer
        case "mafia.stop":
            if(auth(msg.author, game)) { game.stop(msg) }
            break;
        //check time left
        case "mafia.time":
        case "timecheck":
            game.timecheck(msg);
            break;
        //display some stats about the game
        case "mafia.status":
            game.status(msg);
            break;
        //kill a player
        case "mafia.kill":
            if(auth(msg.author, game)) { game.kill(msg) }
            break;
        //vote to lynch a player
        case "vtl":
        case "vte":
        case "vote":
            game.vtl(msg);
            break;
        //vote to no lynch
        case "vtnl":
        case "vtne":
            game.vtnl(msg);
            break;
        //unvote
        case "unvote":
            game.unvote(msg);
            break;
        //display the vote count
        case "mafia.votes":
        case "mafia.votecount":
        case "votecount":
            game.votes(msg);
            break;
        //reset vote count
        case "mafia.resetvotes":
        case "mafia.rv":
            if(auth(msg.author, game)) { game.resetvotes(msg) }
            break;
        //reset all values
        case "mafia.reset":
            if(auth(msg.author, game)) { game.reset(msg) }
            break;
        //revive all players
        case "mafia.revive":
            if(auth(msg.author, game)) { game.revive(msg) }
            break;
        //display help text
        case "mafia.help":
            game.help(msg);
            break;
        //display more help text
        case "mafia.morehelp":
            game.morehelp(msg);
            break;
    }
}
