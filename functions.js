var game = require('./index.js');

module.exports = {
   mod: function(msg) {
       game.mod['name'] = msg.author.username
       msg.channel.send("The mod is: ", game.mod['name'])
   }
}
