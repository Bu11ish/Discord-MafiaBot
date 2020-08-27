var auth = require('./auth.json');
const { Mafia } = require('./Mafia');

var channels = null
var started = false
var game = null
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(auth.token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('mafia.help', { type: 'WATCHING' })
});
var test = true
client.on('message', msg => { try {
    // console.log('======= START =======');
    // console.log('msg', msg);
    // console.log('msg.nickname', msg.member.displayName);
    // console.log('msg.content', msg.content);
    // console.log('msg.embeds', msg.embeds);
    // console.log('======= END =======');
    //add channel to channelGame
    if(msg.author.bot == true){
      return
    }
    let content = msg.content.toLowerCase()
    if(test = false){
      return
    }
    if(content.startsWith("mafia.new")) {
      if(msg.guild == null){
        msg.channel.send("Don't do this command in DMs, do it in the channel where the game will be hosted.")
        return
      }
      if(started != true){
        started = true
        channels = new Mafia(msg, client)
        game = channels
        game.start(msg);
      }
      else{
        msg.channel.send("To start a new game, first do mafia.end.")
      }
    }
    if(started == false){
      if (content.startsWith("mafia.help")) {
          msg.channel.send("Do mafia.new to start a game")
      }
      return
    }
    if (content.startsWith("mafia.end")) {
      if(msg.author.username == game.gameMod.username) {
        if(channels == null){
          msg.channel.send("You have to start a game before you can end one.")
          return
        }
        started = false
        channels = null
        msg.channel.send("The game was ended. Do mafia.new to start a new game.")
      }
      else{
        msg.channel.send('This is a mod-only action.')
      }
    }
    if(channels == null){
      return
    }
    //list the mod and players
    else if (content.startsWith("mafia.players") || content.startsWith("mafia.ls")) {
        game.players(msg);
    }
    //start the actual game
    else if (content.startsWith("mafia.start")) {
      if(msg.author.username == game.gameMod.username) {
        game.begin(msg);
      }
      else{
        msg.channel.send('This is a mod-only action.')
      }
    }
    //display game status
    else if (content.startsWith("mafia.pause")) {
      if(msg.author.username == game.gameMod.username) {
        game.pause(msg);
      }
      else{
        msg.channel.send('This is a mod-only action.')
      }
    }
    else if (content.startsWith("mafia.unpause")) {
      if(msg.author.username == game.gameMod.username) {
        game.unpause(msg);
      }
      else{
        msg.channel.send('This is a mod-only action.')
      }
    }
    //display game status
    else if (content.startsWith("mafia.status")) {
        game.status(msg);
    }
    //kill a player
    else if (content.startsWith("mafia.kill")) {
      if(msg.author.username == game.gameMod.username) {
        game.kill(msg);
      }
      else{
        msg.channel.send('This is a mod-only action.')
      }
    }
    //vote to lynch a player
    else if (content.startsWith("vtl ") || content.startsWith("vte ") || content.startsWith("vote ")) {
        game.vtl(msg);
    }
    else if (content.startsWith("vtnl")) {
        game.vtnl(msg);
    }
    //unvote
    else if (content.startsWith("unvote")) {
        game.unvote(msg);
    }
    //display the vote count
    else if (content.startsWith("mafia.votes") || content.startsWith("mafia.votecount") || content.startsWith("mafia.v") || content.startsWith("mafia.vc")) {
        game.votes(msg);
    }
    //display help text
    else if (content.startsWith("mafia.help")) {
        game.help(msg);
    }

    else if (content.startsWith("mafia.time ")) {
      if(msg.author.username == game.gameMod.username) {
        game.setTime(msg);
      }
      else{
        msg.channel.send('This is a mod-only action.')
      }
    }
    else if (content.startsWith("mafia.flip")) {
      if(msg.author.username == game.gameMod.username) {
        game.doFlip(msg);
      }
      else{
        msg.channel.send('This is a mod-only action.')
      }
    }
    else if (content.startsWith("mafia.chars")) {
      if(msg.author.username == game.gameMod.username) {
        game.useChars(msg);
      }
      else{
        msg.channel.send('This is a mod-only action.')
      }
    }
    else if (content.startsWith("mafia.checktime")) {
        game.timecheck(msg, false)
    }
    else if (content.startsWith("mafia.roles")) {
        game.printRoles(msg)
    }
    else if (content.startsWith("mafia.settings")) {
      if(msg.author.username == game.gameMod.username) {
        game.settings(msg);
      }
      else{
        msg.channel.send('This is a mod-only action.')
      }
    }
    else if (content.startsWith("mafia.modifs")) {
      game.seeMods(msg)
    }
    else if (content.startsWith("mafia.joat")) {
      game.printJoat(msg)
    }
    if (content.startsWith("action|reveal")) {
      if(msg.guild != null){
        msg.channel.send("You can only do this command in the DMs.")
        return
      }
      game.inno(msg)
    }
    else if (content.startsWith("nk|")) {
      if(msg.guild != null){
        msg.channel.send("You can only do this command in the DMs.")
        return
      }
        game.processActions(msg, true)
    }
    else if (content.startsWith("mafia.add")) {
      if(msg.author.username == game.gameMod.username) {
        game.add(msg);
      }
      else{
        msg.channel.send('This is a mod-only action.')
      }
    }
    else if (content.startsWith("mafia.kick")) {
      if(msg.author.username == game.gameMod.username) {
        game.kick(msg);
      }
      else{
        msg.channel.send('This is a mod-only action.')
      }
    }
    else if (content.startsWith("action|")) {
      if(msg.guild != null){
        msg.channel.send("You can only do this command in the DMs.")
        return
      }
      game.processActions(msg, false)
    }
}
catch(err) {
    console.log('err', err)
}
});
