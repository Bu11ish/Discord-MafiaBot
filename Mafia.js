class Player {
  name = null
  alive = true
  role = null
  visibleRole = null
  pm = null
  affiliation = null
  visibleAff = null
  character = null
  pr = null
  note = ''
  vtl = null
  target = null
  killable = true
  priority = null
  blocked = false
  didRB = false
  weirdLynch = null
  moreArgs = false
  message = null
  ability = null
  guards = new Array();
  saved = null
  framed = false
  modifiers = []
  xNum = null
  origXNum = null
  visibleMods = []
  abils = []
  bp1 = null
  hider = []
  canReverse = true
  willFlip = true
  dms = null
  constructor(name, role, character, pm, affiliation, pr, priority, moreArgs, mods, xNum, abils, dms){
    this.name = name
    this.role = role
    this.pm = pm
    this.affiliation = affiliation
    this.pr = pr
    this.character = character
    this.priority = priority
    this.visibleAff = affiliation
    this.visibleRole = role
    this.moreArgs = moreArgs
    this.saved = affiliation
    this.modifiers = mods
    this.visibleMods = mods
    this.origXNum = xNum
    this.xNum = xNum
    this.abils = abils
    this.dms = dms
  }
};
class PausableTimer {
  func = null
  stTime = null
  timeout = null
  timeLeft = null
  timeRan = null
  constructor(func, millisec){
    this.func = func;
    this.stTime = new Date().valueOf();
    this.timeout = setTimeout(func, millisec);
    this.timeLeft = millisec;
  }
  pause = function() {
      clearTimeout(this.timeout);
      this.timeRan = new Date().valueOf()-this.stTime;
      this.timeLeft -= this.timeRan;
  }
  unpause = function() {
      this.timeout = setTimeout(this.func, this.timeLeft);
      this.stTime = new Date().valueOf();
  }
  clear = function() {
      clearTimeout(this.timeout);
  }
}
class PausableInterval {
  func = null
  stTime = null
  timeout = null
  timeLeft = null
  back = null
  constructor(func, millisec){
    this.func = func;
    this.stTime = new Date().valueOf();
    this.timeout = setTimeout(this.func, millisec);
    this.mill = millisec;
    this.timeLeft = millisec;
  }
  reset = function(){
    clearTimeout(this.timeout)
    this.stTime = new Date().valueOf();
    this.timeout = setTimeout(this.func, this.mill);
  }
  pause = function() {
      clearTimeout(this.timeout);
      var timeRan = new Date().valueOf()-this.stTime;
      this.timeLeft -= timeRan;
  }
  unpause = function() {
      this.timeout = setTimeout(this.func, this.timeLeft);
      this.stTime = new Date().valueOf();
  }
  clear = function() {
      clearTimeout(this.timeout);
  }
}
class Mafia {
    tellIfBlocked = true
    interval = false
    paused = null
    end = false
    nkinfo = {
      name: null,
      role: "nk",
      target: null,
      successful: null
    }
    townAlive = null
    lynched = null
    flip = "before"
    time = 15
    phaseNum = 0
    np = false
    inGame = false
    adding = false
    enabled = true
    channel = '|';
    title = '';
    gameMod = {
        username: null,
        displayName: null
    };
    validPeople = new Array();
    validUsers = new Array();
    playersList = new Array();
    timer = null;
    roleList = new Array("Doctor", "Cop", "Vanilla", "Goon", "Godfather", "Rolecop", "Roleblocker", "Miller", "PGO", "Bulletproof", "Tracker", "Ninja", "Strongman", "Vigilante", "Loved", "Hated", "Actress", "Messenger", "Bodyguard", "Jailor", "Framer", "Lawyer", "Mimic", "JOAT", "Hider", "Innocent Child", "Governor", "Jester", "Janitor", "Watcher");
    roleDesc = new Array("You can protect someone at night from being killed.", "You can investigate someone at night and find out their affiliation.", "You particpate with your voice and vote.", "You particpate with your voice and vote.", "If you are investigated, you will turn up innocent.", "You can investigate someone at night and find out their role.", "If you visit someone at night, and they are an active role, they will not be able to perform their action.", "If you are investigated, you will turn up innocent.", "You will kill anyone who visits you at night. You cannot die except by lynching.", "You cannot die except by lynching.", "You can visit someone at night to find out who they visited.", "If you do the mafia NK, you will not appear on any watcher/tracker reports.", "If you do the mafia NK, you cannot be stopped.", "You can kill someone each night.", "It takes one extra vote to lynch you.", "It takes one fewer vote to lynch you.", "Each night you may visit another player. You will learn that player's role. You will appear to all investigative roles to have the role and alignment of the last player you visited. Upon death, you will appear to have the role and alignment of the last player you visited.", "Each night, you may send a player a message. Do action|<target>|<message>.", "Each night, you may visit someone. If they were gonna die, you will die instead.", "Each night you can visit someone. They will be roleblocked and protected.", "You can visit someone during the night. If they are investigated that night, they will show as guilty.", "You can visit someone during the night. If they are investigated that night, they will show as innocent.", "If you visit someone, you will adopt their role, affiliation, and character.", "You have some abilities. You will be able to perform each ability once. Do action|<target|<ability>.", "Each night if you visit someone, you will not be able to be killed. However, if the person you visit is killed, you will be killed as well.", "At any point in the game, you may choose to reveal yourself and you will be confirmed as innocent. Do action|reveal.", "During the night phase, if you use your ability, you will reverse the lynch of the previous day. You can only do this once. Do action|reverse.", "You only win if you get lynched.", "Each night you can visit someone. If that person is killed the same night, their role and PM  will not be revealed.", "Each night you can visit someone and learn everyone who visited your target.");
    priority1 = new Array("Roleblocker", "Jailor");
    priority2 = new Array("Doctor", "Bodyguard", "Framer", "Lawyer", "Hider", "Janitor");
    priority3 = new Array("Cop", "Rolecop", "Messenger");
    priority4 = new Array("Tracker", "Watcher");
    priority5 = new Array("PGO");
    mafia = []
    rolePRs = ["Doctor", "Cop", "Rolecop", "Roleblocker", "Tracker", "Vigilante", "Actress", "Messenger", "Bodyguard", "Jailor", "Framer", "Lawyer", "JOAT", "Hider", "Governor", "Janitor", "Watcher", "Mimic"]
    canSelfTarget = ["Lawyer", "Doctor", "Watcher"]
    _countdownTime = 30;
    graveyard = []
    gameCountdown = null
    chars = true
    intervalTimer = null
    rbnum = 0
    rbList = new Array();
    compRoles = new Array("Messenger", "JOAT")
    possMods = new Array("WEAK", "STRONG", "X", "EVEN", "ODD")
    possAbils = new Array("Bulletproof", "Cop", "Lawyer", "Framer")
    someoneLynched = null
    jesterEnd = true
    jesterWon = false
    canDocSelfTarget = true

    constructor(msg, client) {
        this.channel = msg.channel;
        this.guildId = msg.guild.id;
        this.guild = client.guilds.cache.get(this.guildId);
        for(let thing of this.guild.members.cache.keys()){
          let member = this.guild.members.cache.get(thing);
          this.validPeople.push(member)
        }
        this.gameMod.username = msg.author.username
        try{
          this.gameMod.displayName = msg.member.displayName
        }
        catch(err){
          this.gameMod.displayName = msg.author.username
        }
        let indexOfSpace = msg.content.indexOf(" ")
        if(indexOfSpace >=0 ) {
            this.title = msg.content.substring(msg.content.indexOf(" "))
        }
        else {
            this.title = "Mafia"
        }

        let embed = {
            color: "FF00FF",
            title: "The mod is: " + this.gameMod.displayName
        }

        this.channel.send({embed: embed})
        this.channel.send("To change mods, do mafia.end")
    }
    useChars = function(msg){
      if(this.inGame == true){
        msg.channel.send("You cannot change this setting during a game.")
        return
      }
      let contentArray = msg.content.split(' ')
      if(contentArray.length != 2){
        msg.channel.send("Incorrect format. Do 'mafia.chars off' or 'mafia.chars on'.")
        return
      }
      if(contentArray[1].toUpperCase() != 'OFF' && contentArray[1].toUpperCase() != 'ON'){
        msg.channel.send("Incorrect format. Do 'mafia.chars off' or 'mafia.chars on'.")
        return
      }
      let mode = contentArray[1]
      if(mode.toUpperCase() == "OFF"){
        this.chars = false
        msg.channel.send("Characters turned off!")
      }
      else{
        this.chars = true
        msg.channel.send("Characters turned on!")
      }
    }
    add = function(msg) {
        if(this.inGame == true){
          msg.channel.send("You cannot add more players because the game has already started. Do mafia.end to end the current game.")
          return
        }
        let args = msg.content.split("|")
        if(args.length != 6 && this.chars == true){
          msg.channel.send("Incorrect formatting. Do 'mafia.add|player username>|<player role>|character>|<affiliation>|<role pm>'. If you do not want to use characters, do mafia.chars off.")
          return
        }
        else if(args.length != 5 && this.chars == false){
          msg.channel.send("Incorrect formatting. Do 'mafia.add|player username>|<player role>|<affiliation>|<role pm>'. If you want to use characters, do mafia.chars on.")
          return
        }
        let name = null
        let role = null
        let therole = null
        let affiliation = null
        let pm = null
        let character = null
        if(this.chars == true){
          name = args[1]
          role = args[2]
          therole = args[2]
          character = args[3]
          affiliation = args[4]
          pm = args[5]
        }
        else{
          name = args[1]
          role = args[2]
          affiliation = args[3]
          pm = args[4]
        }
        var xNum = null
        var sepMods = []
        var abils = []
        if(affiliation.toUpperCase() != "TOWN" && affiliation.toUpperCase() != "MAFIA" & affiliation.toUpperCase() != "3P"){
          msg.channel.send(affiliation + " is not a valid affiliation or has not yet been added. Valid affiliations are 'town', 'mafia', and '3P'.")
        }
        if(name == '' || name == null) {
            msg.channel.send("Cannot add blank name. ")
            return
        }
        if((this.roleList.filter((str) => str.toUpperCase() == (role.toUpperCase())).length) < 1){
          if(role.includes("#")){
            var splitRole = role.split("#")
            if(splitRole[0].toUpperCase() != "JOAT"){
              msg.channel.send(role + " is not a valid role or has not yet been added. Do mafia.roles to see all valid roles.")
              return
            }
            therole = splitRole[0]
            var abils = splitRole[1].split(",")
            for(let abil of abils){
              if((this.possAbils.filter((str) => str.toUpperCase() == (abil.toUpperCase())).length) < 1){
                msg.channel.send(abil + " is not a valid JOAT ability or has not yet been added. Do mafia.joat to see all valid JOAT abilities.")
                return
              }
            }
          }
          if(role.includes("&")){
            var separate = role.split("&")
            if(separate.length != 2){
              msg.channel.send("Incorrect formatting. For modifiers, do <player role>&<modifiers separated by commas>.")
              return
            }
            therole = separate[0]
            var sepMods = separate[1].split(",")
            for(let thing of sepMods){
              if(!(this.possMods.includes(thing.toUpperCase()))){
                var checkX = false
                for(let maybeX of sepMods){
                  let splitter = maybeX.split("")
                  if(splitter.length == 2){
                    if(!(isNaN(splitter[0]))){
                      if(splitter[1].toUpperCase() == "X"){
                        checkX = true
                        xNum = splitter[0]
                      }
                    }
                  }
                }
                if(checkX == false){
                  msg.channel.send(thing + " is not a valid modifier or has not yet been added. Do mafia.modifs to see all valid modifiers.")
                  return
                }
              }
            }
            if((this.roleList.filter((str) => str.toUpperCase() == (therole.toUpperCase())).length) < 1){
              msg.channel.send(role + " is not a valid role or has not yet been added. Do mafia.roles to see all valid roles.")
              return
            }
          }
          if(!(role.includes("&")) && !(role.includes("#"))){
            msg.channel.send(role + " is not a valid role or has not yet been added. Do mafia.roles to see all valid roles.")
            return
          }
        }
        var validPerson = false
        var dms = null
        for(let member of this.validPeople){
          if(member.displayName.toUpperCase() == name.toUpperCase() && member.user.bot == false){
            try{
              member.user.send("You were added to the game.")
            }
            catch(err){
              msg.channel.send("This person cannot receive messages. Tell them to go to Settings, Privacy and Safety, and then to enable 'Allow direct messages from server members.'")
              return
            }
            validPerson = true
            dms = member.user
            break
          }
        }
        if(validPerson == false){
          msg.channel.send(name + " is not a person in this server. Make sure that you are using the displayed server name.")
          return
        }
        if(this.playersList.length > 0){
          for(let player of this.playersList) {
              if(name.toUpperCase() == player.name.toUpperCase()) {
                  msg.channel.send(name + " is already in the game.")
                  return
              }
          }
        }
        let pr = false
        if((this.rolePRs.filter((str) => str.toUpperCase() == (therole.toUpperCase())).length) > 0){
          pr = true
        }
        if(abils.length == 1){
          if(abils[0].toUpperCase() == "BULLETPROOF"){
            pr = false
          }
        }
        var priority = null
        if(affiliation.toUpperCase() == "MAFIA"){
          this.mafia.push(name)
        }
        if((this.priority1.filter((str) => str.toUpperCase() == (therole.toUpperCase())).length) >= 1){
          priority = 1
          this.rbnum +=1
        }
        else if((this.priority2.filter((str) => str.toUpperCase() == (therole.toUpperCase())).length) >= 1){
          priority = 2
        }
        else if((this.priority3.filter((str) => str.toUpperCase() == (therole.toUpperCase())).length) >= 1){
          priority = 3
        }
        else if((this.priority4.filter((str) => str.toUpperCase() == (therole.toUpperCase())).length) >= 1){
          priority = 4
        }
        else if((this.priority5.filter((str) => str.toUpperCase() == (therole.toUpperCase())).length) >= 1){
          priority = 5
        }
        var moreArgs = false
        if((this.compRoles.filter((str) => str.toUpperCase() == (therole.toUpperCase())).length) >= 1){
          moreArgs = true
        }
        this.playersList.push(new Player(name, therole, character, pm, affiliation, pr, priority, moreArgs, sepMods, xNum, abils, dms))
        if(pr == false || therole.toUpperCase() == "JOAT"){
          this.doPassives()
        }
        let embed = {
            color: "22AA22",
            title: name + " has been added. "
        }

        msg.channel.send({embed: embed})
    }
    doFlip = function(msg){
      if(this.inGame == true){
        msg.channel.send("You cannot change the flip during the game.")
        return
      }
      if(msg.content.toUpperCase() != "mafia.flip before".toUpperCase() && msg.content != "mafia.flip after".toUpperCase()){
        msg.channel.send("Incorrect format. Do 'mafia.flip before' or 'mafia.flip after' to say whether lynched people flip before or after the NP starts.")
        return
      }
      let contentArray = msg.content.split(' ')
      this.flip = contentArray[1]
      msg.channel.send("The lynch flip has been set to " + this.flip + " the NP.")

    }
    begin = function(){
      if(this.inGame != true){
        if(this.playersList.length == 0){
          this.channel.send("You cannot start because there are no players in this game.")
          return
        }
        this.adding = false
        for(let player of this.playersList){
          if(player.role.toUpperCase() == "GOVERNOR"){
            this.flip = "after"
          }
          player.dms.send(player.pm)
          if(player.affiliation.toUpperCase() == "MAFIA"){
            let list = ''
            for(let thing of this.mafia){
              list = list + thing + "\n"
            }
            player.dms.send("Members of the mafia: \n" + list)
          }
        }
        this.townAlive = 0
        for(let town of this.playersList){
          if(town.affiliation.toUpperCase() == "TOWN" && town.alive == true){
            this.townAlive += 1
          }
        }
      }
      if(this.inGame == true){
        this.reset()
      }
      this.resetvotes()
      this.inGame = true
      let time = this.time
      time = parseInt(time) * 60 // time in seconds

      let end = function() {
          this.interval = true
          let rand = function(){}
          this.intervalTimer = new PausableTimer(rand, 30000)
          if(this.timer == null) {
              return;
          }
          var timeleft = 30
          this.channel.send(timeleft + "s remaining")
          let countdown = function() {
              this.gameCountdown.reset()
              if(this.timer == null) {
                  this.gameCountdown.clear()
                  return;
              }
              timeleft = timeleft - 5
              if(timeleft <= 0) {
                  this.channel.send("0s: **Phase ended.**")
                  this.gameCountdown.clear()
                  this.timer.clear()
                  this.intervalTimer.clear()
                  this.interval = false
                  this.timer = null
                  this.intervalTimer = null
                  this.np = true
                  this.getActions()
                  return;
              }
              this.channel.send(timeleft + "s remaining")
          }.bind(this)
          this.gameCountdown = new PausableInterval(countdown, 5000)
      }.bind(this)
      this.timer = new PausableTimer(end, (time-this._countdownTime)*1000)
      this.phaseNum +=1
      this.channel.send("**Phase " + this.phaseNum +" starting with " + time/60 + " mins.**")
      this.players(false)
    }
    kick = function(msg) {
        if(this.inGame == true){
          msg.channel.send("You cannot kick players because the game as already started. Do mafia.end to end the current game.")
          return
        }
        let contentArray = msg.content.split('|')
        if(contentArray.length != 2){
          msg.channel.send("Incorrect format. Do '-kick-|<target>'")
          return
        }
        let i = 0
        while (i < this.playersList.length) {
          if(this.playersList[i].name.toUpperCase() == contentArray[1].toUpperCase()){
            this.playersList.splice(i,1)
            msg.channel.send(contentArray[1] + " was kicked from the game.")
            return
          }
          i+=1
        }
        msg.channel.send(contentArray[1] + " is not in the game.")
    }
    players = function(msg) {
      if(this.playersList <= 0){
        if(msg == false){
          this.channel.send("There are no players in this game.")
        }
        else{
          msg.channel.send("There are no players in this game.")
        }
        return
      }
        let playersList = ''
        for(let player of this.playersList) {
            if(player.alive) {
                playersList = playersList + "\n" + player.name
            }
            else{
              playersList = playersList + `\n~~${player.name}~~ - *dead.*`
            }
        }
        let title = "Players"
        let embed = {
            color: "AA2200",
            title: title + ": ",
            description: playersList
        }
        if(msg == false){
          this.channel.send({embed: embed})
        }
        else{
          msg.channel.send({embed: embed})
        }
    }
    start = function(msg) {
      if(this.inGame == true){
        msg.channel.send("A game is already happening.")
      }
      msg.channel.send("Enter each player in the following format: 'mafia.add|player username>|<player role>|character>|<affiliation>|<pm>'. For example: 'mafia.add|Speedrace|Doctor|Meredith Grey|town|You are Meredith Grey, and you are the Doctor. You are town.' To add modifiers, for player role, do <player role>&<modifiers separated by commas>. For example, |strongman&1x,even|. If the player is mafia, do NOT include their partners in their pm because the pm will be printed if they die; the game will automatically tell them their partners. If you do not want to use characters, do 'mafia.chars off'. The default phase length is 15 minutes, do mafia.time <day phase length in minutes> to change it. Lynch flips happen before the night phase by default, to make them happen after, type 'mafia.flip after'. Type mafia.begin when you are done to start the game.")
      this.adding = true
    }
    pause = function() {
        if(this.inGame == true) {
          this.channel.send("**Phase paused.**")
          this.timecheck(false, true)
          if(this.interval == false){
            this.timer.pause()
          }
          else{
            this.intervalTimer.pause()
            this.gameCountdown.pause()
          }
        }
        else{
          this.channel.send("No phase in progress. ")
        }
    }
    unpause = function() {
        if(this.inGame == true) {
          if(this.interval == false){
            this.timer.unpause()
          }
          else{
            this.intervalTimer.unpause()
            this.gameCountdown.unpause()
          }
            this.channel.send("**Phase unpaused.**")
            this.paused = null
            this.timecheck(false, false)
        }
        else{
          this.channel.send("No phase in progress. ")
        }
    }
    timecheck = function(msg, pause) {
        let timeLeft = this._getTimeLeft()
        if(this.inGame == true){
          if(msg == false){
            this.channel.send(timeLeft + " remaining")
          }
          else{
            msg.channel.send(timeLeft + " remaining")
          }
          if(pause == true){
            this.paused = timeLeft
          }
        }
        else{
          if(msg == false){
            this.channel.send("No phase in progress.")
          }
          else{
            msg.channel.send("No phase in progress.")
          }
        }
    }
    _getTimeLeft = function() {
        if(this.timer == null && this.intervalTimer == null) {
            return null
        }
        if(this.paused == null){
          if(this.interval == true){
            let secondsLeft = Math.ceil((this.intervalTimer.timeout._idleStart + this.intervalTimer.timeout._idleTimeout - process.uptime()*1000) / 1000);
            if(secondsLeft < 10) {
                secondsLeft = "0" + secondsLeft
              }
            return "0:" + secondsLeft
          }
          else{
            let totalSeconds = Math.ceil((this.timer.timeout._idleStart + this.timer.timeout._idleTimeout - process.uptime()*1000) / 1000) + this._countdownTime;
            let minutesLeft = Math.floor(totalSeconds/60)
            let secondsLeft = totalSeconds%60
            if(secondsLeft < 10) {
                secondsLeft = "0" + secondsLeft
            }

            return "" + minutesLeft + ":" + secondsLeft
          }
        }
        else{
          return this.paused
        }
    }
    status = function(msg) {
        let status = ''
        if(this.inGame == false){
          msg.channel.send("There is no current game.")
          return
        }
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
        if(this.inGame == false){
          msg.channel.send("There is no current game.")
          return
        }
        let fields = this._matchName(msg)

        let message = ''
        if(fields.players.length == 0) {
            message = "No players with identifier found. "
        }
        else if(fields.players.length == 1) {
            fields.players[0].alive = false
            fields.players[0].note = fields.context
            fields.players[0].vtl = null
            this.graveyard.push(fields.players[0])
            message = `Killed player: **${fields.players[0].name}** - ${fields.players[0].note}`
        }
        else {
            message = "Multiple players with identifier found, please be more specific. "
        }

        msg.channel.send(message)
    }
    vtl = function(msg) {
        if(this.inGame == false){
          msg.channel.send("There is no current game.")
          return
        }
        let voter = null
        for(let player of this.playersList) {
            if(msg.author == player.dms) {
                if(this.np == true){
                  player.dms.send("You cannot vote during the night phase.")
                  return
                }
                voter = player
            }
        }
        if(voter == null) {
            msg.channel.send(msg.member.displayName + " you are not in the game.")
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
    tally = function(){
      let votes = {}
      let votesStr = ''
      let votesToLynch = Math.floor(this.playersList.filter(player => player.alive).length/2 + 1)
      let voteUsed = votesToLynch
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
      for(let vote in votes){
        voteUsed = votesToLynch
        for(let player of this.playersList){
            if(vote.toUpperCase() == player.name.toUpperCase()){
              if(player.weirdLynch == 1){
                voteUsed += player.weirdLynch
              }
              else if(player.weirdLynch == -1){
                voteUsed += player.weirdLynch
              }
            }
          }
         if(votes[vote].length >= voteUsed){
           if(vote.toUpperCase() == "VTNL"){
             try{
               this.gameCountdown.clear()
             }
             catch(err){}
             try{
               this.timer.clear()
             }
             catch(err){}
             try{
               this.intervalTimer.clear()
             }
             catch(err){}
             this.interval = false
             this.channel.send("No one was lynched.")
             if(this.end == false){
               this.channel.send("Phase " + this.phaseNum + " has ended.")
               this.timer = null
               this.intervalTimer = null
               this.gameCountdown = null
               this.np = true
               this.getActions()
               return
             }
           }
           for(let player of this.playersList){
               if(vote.toUpperCase() == player.name.toUpperCase()){
                 try{
                   this.gameCountdown.clear()
                 }
                 catch(err){}
                 try{
                   this.timer.clear()
                 }
                 catch(err){}
                 try{
                   this.intervalTimer.clear()
                 }
                 catch(err){}
                 this.interval = false
                 if(player.role.toUpperCase() == "JESTER"){
                   this.jesterWon = true
                   if(this.jesterEnd == true){
                     this.checkWin()
                   }
                 }
                 player.alive = false
                 player.vtl = null
                 if(this.flip == 'before'){
                   this.channel.send(player.name + " was lynched! They were " + player.affiliation + ".")
                 }
                 else{
                   this.channel.send(player.name + " was lynched! They will flip next DP.")
                 }
                 if(this.mafia.indexOf(player.name) != -1){
                   this.mafia.splice(this.mafia.indexOf(player.name),1)
                 }
                 else{
                   if(player.affiliation.toUpperCase() == "TOWN"){
                     this.townAlive -= 1
                   }
                 }
                 this.someoneLynched = player
                 this.checkWin()
                 if(this.end == false){
                   this.channel.send("Phase " + this.phaseNum + " has ended.")
                   this.graveyard.push(player)
                   this.timer = null
                   this.intervalTimer = null
                   this.gameCountdown = null
                   this.np = true
                   this.getActions()
                   return
                 }
               }
             }
           }
         }
      }
    checkWin = function(){
      if(this.jesterWon == true){
        this.channel.send("The jester won!")
        this.end = true
      }
      if(!(this.jesterEnd == true && this.jesterWon == true)){
        if(this.mafia.length < 1){
          this.channel.send("Town wins!")
          this.end = true
        }
        if(this.mafia.length == this.townAlive){
          this.channel.send("Mafia wins!")
          this.end = true
        }
      }
      if(this.end == true){
        try{
          this.gameCountdown.clear()
        }
        catch(err){}
        try{
          this.timer.clear()
        }
        catch(err){}
        try{
          this.intervalTimer.clear()
        }
        catch(err){}
        this.interval = false
        this.timer = null
        this.intervalTimer = null
        this.gameCountdown = null
        let thedead = ""
        for(let dead of this.playersList){
          thedead = thedead + `${dead.name} - ${dead.pm} \n`
        }
        let embed = {
            color: "22AAFF",
            title: "Players:  ",
            description: thedead
        }
        this.channel.send({embed: embed})
      }
    }
    vtnl = function(msg) {
        if(this.inGame == false){
          msg.channel.send("There is no current game.")
          return
        }
        let voter = null
        for(let player of this.playersList) {
            if(msg.author == player.dms) {
                voter = player
            }
        }
        if(voter == null) {
            msg.channel.send(msg.member.displayName + " you are not in the game.")
            return
        }
        voter.vtl = 'vtnl'
        this.votes(msg)
    }
    unvote = function(msg) {
        if(this.inGame == false){
          msg.channel.send("There is no current game.")
          return
        }
        for(let player of this.playersList) {
            if(msg.author == player.dms) {
                if(player.vtl == null) {
                    if(this.np == true){
                      this.channel.send("You cannot unvote during the night phase.")
                      return
                    }
                    this.channel.send("You are not currently voting.")
                    return
                }
                else {
                    if(this.np == true){
                      msg.channel.send("You cannot unvote during the night phase.")
                      return
                    }
                    player.vtl = null
                    this.channel.send(`**${player.name}** unvoted.`)
                    return
                }
            }
        }
    }
    votes = function(msg) {
        if(this.np == true){
          this.channel.send("You cannot check votes during the night phase.")
          return
        }
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

        let embed = {
            color: "22AAFF",
            title: "Vote count: ",
            description: votesStr
        }

        this.channel.send({embed: embed})
        this.tally()
    }
    resetvotes = function() {
        for(let player of this.playersList) {
            player.vtl = null
        }
    }
    reset = function() {
      this.nkinfo = {
        name: null,
        role: "nk",
        target: null,
        successful: null
      }
      for(let player of this.playersList){
        player.killable = true
        player.target = null
        player.vtl = null
        player.blocked = false
        player.didRB = false
        player.message = null
        player.ability = null
        player.guards = new Array();
        player.visibleAff = player.saved
        player.framed = false
        player.hider = []
      }
      this.someoneLynched = null
      this.reverseIt = false
    }
    revive = function(msg) {
        for(let player of this.playersList) {
            player.alive = true
            player.note = ''
        }

        this.channel.send("All players revived.")
    }
    setTime = function(msg) {
      let contentArray = msg.content.split(' ')
      if(contentArray.length != 2){
        msg.channel.send("Incorrect formatting. Do 'mafia.time <day phase length in minutes>'")
        return
      }
      if(isNaN(contentArray[1])){
        msg.channel.send("Incorrect formatting. Do 'mafia.time <day phase length in minutes>'")
        return
      }
      this.time = contentArray[1]
      msg.channel.send("Day phase length set to " + this.time + " mins.")

    }
    getActions = function(){
      this.np = true
      for(let player of this.playersList){
        if(player.pr == true){
          if((player.modifiers.filter((str) => str.toUpperCase() == "EVEN").length) >= 1){
            if(this.phaseNum % 2 != 0){
            }
          }
          else if((player.modifiers.filter((str) => str.toUpperCase() == "ODD").length) >= 1){
            if(this.phaseNum % 2 == 0){
            }
          }
          else if(player.xNum == 0){
          }
          else if(player.abils.length == 0 && player.role.toUpperCase() == "JOAT"){
          }
          else{
            if(player.role.toUpperCase() == "GOVERNOR"){
              player.dms.send("Please submit your night action in the form 'action|reverse'. Do action|waive to waive.")
            }
            else if(player.role.toUpperCase() == "JOAT"){
              player.dms.send("Please submit your night action in the form 'action|<target>|<ability>'. Do action|waive to waive.")
            }
            else if(player.role.toUpperCase() == "MESSENGER"){
              player.dms.send("Please submit your night action in the form 'action|<target>|<message>'. Do action|waive to waive.")
            }
            else{
              player.dms.send("Please submit your night action in the form 'action|<target>'. Do action|waive to waive.")
            }
          }
        }
        if(player.affiliation.toUpperCase() == "MAFIA"){
          player.dms.send("Make sure a mafia member submits the nk using nk|target. Whoever submits it will be the one doing the kill. Do nk|waive to waive the nk.")
        }
      }
    }
    processActions = function(msg, nk){
      var user = null
      if(this.inGame != true){
        msg.channel.send("A game is not ongoing.")
      }
      if(this.np == false){
        msg.channel.send("We are not in the night phase.")
        return
      }
      for(let thing of this.playersList){
        if(msg.author == thing.dms){
          user = thing
        }
      }
      if(user == null){
        msg.reply("You are not in the game.")
        return
      }
      if(nk == true){
        if(user.affiliation.toUpperCase() != "MAFIA"){
          msg.channel.send("You are not a member of the mafia.")
          return
        }
      }
      if(nk == false){
        if(user.pr != true){
          msg.channel.send("You do not have an action.")
          return
        }
      }
      if(user.alive == false){
        msg.channel.send("You are dead.")
        return
      }
      let contentArray = msg.content.split('|')
      if(nk == false){
        if(user.moreArgs == false){
          if(contentArray.length != 2){
            msg.channel.send("Incorrect format. Do 'action|<target>'")
            return
          }
        }
        else{
          if(contentArray.length != 3 && contentArray[1].toUpperCase() != "WAIVE"){
            if(user.role.toUpperCase() == "MESSENGER"){
              msg.channel.send("Incorrect format. Do 'action|<target>|<message>'")
            }
            else if(user.role.toUpperCase() == "JOAT"){
              msg.channel.send("Incorrect format. Do 'action|<target>|<ability>'")
            }
            return
          }
        }
      }
      else{
        if(contentArray.length != 2){
          msg.channel.send("Incorrect format. Do 'nk|<target>'")
          return
        }
      }
      if((user.modifiers.filter((str) => str.toUpperCase() == "EVEN").length) >= 1){
        if(this.phaseNum % 2 != 0){
          msg.channel.send("You can only perform actions on even nights.")
          return
        }
      }
      if((user.modifiers.filter((str) => str.toUpperCase() == "ODD").length) >= 1){
        if(this.phaseNum % 2 == 0){
          msg.channel.send("You can only perform actions on odd nights.")
          return
        }
      }
      if(user.xNum != null){
        if(user.xNum != 0){
          user.xNum -= 1
        }
        else{
          msg.channel.send("You've run out of uses for your action.")
          return
        }
      }
      let target = contentArray[1]
      if(target.toUpperCase() == "WAIVE"){
        if(nk == false){
          user.target = "waive"
        }
        else{
          this.nkinfo.target = "waive"
        }
        msg.channel.send("Confirmed.")
        this.checkActions()
        return
      }
      if(target.toUpperCase() == "REVERSE"){
        if(user.role.toUpperCase() != "GOVERNOR"){
          msg.channel.send("You are not a governor.")
          return
        }
        if(user.canReverse != true){
          msg.channel.send("You've already used this ability.")
          return
        }
        if(this.someoneLynched == null){
          msg.channel.send("No one was lynched during the DP.")
          return
        }
        this.reverseIt = true
        user.canReverse = false
        user.target = "reverse"
        msg.channel.send("Confirmed.")
        this.checkActions()
        return
      }
      if(user.role.toUpperCase() == "GOVERNOR" && target.toUpperCase() != "REVERSE"){
        msg.channel.send("You cannot target people. Do action|reverse.")
        return
      }
      var extra = null
      if(user.moreArgs == true){
        extra = contentArray[2]
      }
      if(user.role.toUpperCase() == "JOAT"){
        if((user.abils.filter((str) => str.toUpperCase() == (extra.toUpperCase())).length) < 1){
          msg.channel.send("You do not have that ability or you have already used it.")
          return
        }
        if(extra.toUpperCase() == "BULLETPROOF"){
          msg.channel.send("Bulletproof is a passive ability.")
          return
        }
        if(extra.toUpperCase() != "LAWYER" && user.name.toUpperCase() == target.toUpperCase()){
          msg.channel.send("You cannot target yourself with this ability.")
          return
        }
      }
      if(user.name.toUpperCase() == target.toUpperCase() && user.role.toUpperCase() != "JOAT"){
        if(this.canDocSelfTarget == true && user.role.toUpperCase() == "DOCTOR"){
        }
        else if((this.canSelfTarget.filter((str) => str.toUpperCase() == (user.role.toUpperCase())).length) >= 1){
        }
        else{
          msg.channel.send("You cannot target yourself with this ability.")
          return
        }
      }
      for(let player of this.playersList){
        if(target.toUpperCase() == player.name.toUpperCase()){
          if(player.alive == true){
            msg.channel.send("Confirmed.")
            if(nk == false){
              user.target = player.name
              user.message = extra
              user.ability = extra
            }
            else{
              this.nkinfo.name = user.name
              this.nkinfo.target = player.name
              if(user.role.toUpperCase() == "STRONGMAN" || user.role.toUpperCase() == "NINJA"){
                this.nkinfo.role = user.role
              }
            }
            this.checkActions()
            return
          }
          else{
            msg.channel.send("This target is not alive. Do mafia.ls to see all players.")
            return
          }
        }
      }
      msg.channel.send("This is not a valid target. Do mafia.ls to see all players.")
    }
    checkActions = function(){
      for(let player of this.playersList){
        if(player.pr == true && player.target == null && player.alive == true){
          if((player.modifiers.filter((str) => str.toUpperCase() == "EVEN").length) >= 1){
            if(this.phaseNum % 2 == 0){
              return
            }
          }
          else if((player.modifiers.filter((str) => str.toUpperCase() == "ODD").length) >= 1){
            if(this.phaseNum % 2 != 0){
              return
            }
          }
          if(!(player.modifiers.filter((str) => str.toUpperCase() == "EVEN").length >= 1) && !(player.modifiers.filter((str) => str.toUpperCase() == "ODD").length >= 1)){
            return
          }
        }
      }
      if(this.nkinfo.target == null){
        return
      }
      this.np = false
      this.doActions()
    }
    seeIfBeingRBd = function(player){
      for(let possRB of this.playersList){
        if(possRB.priority == 1 && possRB.alive == true){
          if(possRB.target.toUpperCase() == player.name.toUpperCase()){
            this.rbList.push(possRB)
            this.seeIfBeingRBd(possRB)
          }
        }
      }
    }
    manyRBs = function(){
      for(let player of this.playersList){
        if(player.priority == 1 && player.alive == true){
          for(let other of this.playersList){
            if(other.name.toUpperCase() == player.target.toUpperCase()){
              if(other.priority != 1){
                this.rbList.push(player)
                this.seeIfBeingRBd(player)
              }
            }
          }
        }
      }
      this.rbList = this.rbList.reverse()
      for(let rber of this.rbList){
        rber.didRB = true
        this.roleFuncs(rber.name, rber.role, rber.target)
      }
      for(let player of this.playersList){
        if(player.priority == 1 && player.didRB == false){
          this.roleFuncs(player.name, player.role, player.target)
        }
        player.didRB == false
      }
      this.rbList = new Array();
    }
    doActions = function(){
      //all of this first part is dealing with the possibility of multiple roleblockers
      var rbAlert = false
      var falseAlarm = true
      if(this.rbnum > 0){
        for(let player of this.playersList){
          if(player.priority == 1 && player.alive == true){
            for(let other of this.playersList){
              if(other.name.toUpperCase() == player.target.toUpperCase()){
                if(other.priority == 1){
                  rbAlert = true
                }
                else{
                  falseAlarm = false
                }
              }
            }
          }
        }
      }
      if(falseAlarm == true){
        rbAlert = false
      }
      if(rbAlert == true){
        this.manyRBs()
      }
      else{
        for(let player of this.playersList){
          if(player.priority == 1 && player.pr == true){
            this.roleFuncs(player.name, player.role, player.target)
          }
        }
      }
      if(this.reverseIt == true){
        this.graveyard.splice(this.graveyard.indexOf(this.someoneLynched),1)
        this.someoneLynched.alive = true
        if(this.someoneLynched.affiliation.toUpperCase() == "MAFIA"){
          this.mafia.push(this.someoneLynched.name)
        }
        else{
          if(this.someoneLynched.affiliation.toUpperCase() == "TOWN"){
            this.townAlive +=1
          }
        }
      }
      for(let player of this.playersList){
        if(player.priority == 2 && player.pr == true){
          this.roleFuncs(player.name, player.role, player.target)
        }
      }
      for(let player of this.playersList){
        if(player.role.toUpperCase() == "ACTRESS" && player.pr == true){
          this.roleFuncs(player.name, player.role, player.target)
        }
      }
      for(let player of this.playersList){
        if(player.role.toUpperCase() == "MIMIC" && player.pr == true){
          this.roleFuncs(player.name, player.role, player.target)
        }
      }
      for(let player of this.playersList){
        if(player.role.toUpperCase() == "JOAT" && player.pr == true){
          this.roleFuncs(player.name, player.role, player.target)
        }
      }
      for(let player of this.playersList){
        if(player.priority == 3 && player.pr == true){
          this.roleFuncs(player.name, player.role, player.target)
        }
      }
      this.roleFuncs(this.nkinfo.name, this.nkinfo.role, this.nkinfo.target)
      for(let player of this.playersList){
        if(player.role.toUpperCase() == "VIGILANTE" && player.pr == true){
          this.roleFuncs(player.name, player.role, player.target)
        }
      }
      for(let player of this.playersList){
        if(player.priority == 4 && player.pr == true){
          this.roleFuncs(player.name, player.role, player.target)
        }
      }
      for(let player of this.playersList){
        if(player.priority == 5){
          this.roleFuncs(player.name, player.role, player.target)
        }
      }
      if(this.reverseIt == true){
        this.channel.send("**The lynch was reversed!**")
      }
      if(this.graveyard.length > 0){
        this.graveyard = [... new Set(this.graveyard)]
        let thedead = ""
        for(let dead of this.graveyard){
          if(dead.willFlip == true){
            thedead = thedead + `${dead.name} - ${dead.pm} \n`
          }
          else{
            thedead = thedead + `${dead.name} - ????? \n`
          }
        }
        let embed = {
            color: "22AAFF",
            title: "Graveyard:  ",
            description: thedead
        }
        this.channel.send({embed: embed})
      }
      this.checkWin()
      if(this.nkinfo.successful == null){
        this.nkinfo.successful = "unsuccessful."
      }
      if(this.end == false){
        for(let player of this.playersList){
          if(this.tellIfBlocked == true){
            if(player.blocked == true){
              player.dms.send("You were roleblocked.")
            }
          if(player.affiliation.toUpperCase() == "MAFIA"){
              player.dms.send("The nk was " + this.nkinfo.successful)
            }
          }
        }
        this.begin()
      }
    }
    doPassives = function(){
      var person = this.playersList[this.playersList.length - 1]
      if(person.role.toUpperCase() == "GODFATHER"){
        person.visibleAff = "town"
        person.saved = "town"
      }
      if(person.role.toUpperCase() == "MILLER"){
        person.visibleAff = "mafia"
        person.saved = "mafia"
      }
      if(person.role.toUpperCase() == "LOVED"){
        person.weirdLynch = 1
      }
      if(person.role.toUpperCase() == "HATED"){
        person.weirdLynch = -1
      }
      if(person.role.toUpperCase() == "JOAT"){
        if((person.abils.filter((str) => str.toUpperCase() == "BULLETPROOF").length) >= 1){
          person.bp1 = true
          var i = 0
          while (i < person.abils.length){
            if(person.abils[i].toUpperCase() == "BULLETPROOF"){
              person.abils.splice(i,1)
            }
            i+=1
          }
        }
      }
    }
    roleFuncs = function(name, role, target){
      var user = null
      if(target == null){
        if(role.toUpperCase() != "PGO"){
          return
        }
      }
      if(target != null){
        if(target.toUpperCase() == "WAIVE"){
          return
        }
      }
      for(let player of this.playersList){
        if(target == player.name){
          target = player
          break
        }
      }
      for(let player of this.playersList){
        if(name == player.name){
          user = player
          var yesStrong = false
          for(let mod of user.modifiers){
            if(mod.toUpperCase() == "STRONG"){
              yesStrong = true
              break
            }
          }
          if(yesStrong == false){
            if(player.blocked == true){
              return
            }
          }
          break
        }
      }
      if(role.toUpperCase() == "NK" || role.toUpperCase() == "NINJA" || role.toUpperCase() == "STRONGMAN"){
        if(target.killable == false || (target.role.toUpperCase() == "BULLETPROOF" && target.xNum != 0) || target.bp1 == true){
          if(target.bp1 == true  && target.guards.length == 0){
            target.bp1 = false
          }
          if(target.role.toUpperCase() == "BULLETPROOF" && target.xNum != 0 && target.guards.length == 0){
            if(target.xNum != null){
              if(!(isNaN(target.xNum))){
                target.xNum -= 1
              }
            }
          }
          if(role.toUpperCase() != "STRONGMAN"){
            var yesStrong = false
            for(let mod of user.modifiers){
              if(mod.toUpperCase() == "STRONG"){
                yesStrong = true
                break
              }
            }
            if(yesStrong == false && role.toUpperCase() != "STRONGMAN"){
              if(target.guards.length == 0){
                return
              }
            }
          }
        }
        else if(target.role.toUpperCase() == "PGO"){
          if(target.guards.length == 0){
            return
          }
        }
        if(target.guards.length >= 1 && role.toUpperCase() != "STRONGMAN" && yesStrong == false){
          if(target.guards[0].hider.length != 0){
            for(let hiding of target.guards[0].hider){
              hiding.alive = false
              hiding.vtl = null
              if(this.mafia.indexOf(hiding.name) != -1){
                this.mafia.splice(this.mafia.indexOf(hiding.name),1)
              }
              else{
                if(hiding.affiliation.toUpperCase() == "TOWN"){
                  this.townAlive -= 1
                }
              }
              this.graveyard.push(hiding)
            }
          }
          target.guards[0].alive = false
          target.guards[0].vtl = null
          if(this.mafia.indexOf(target.guards[0].name) != -1){
            this.mafia.splice(this.mafia.indexOf(target.guards[0].name),1)
          }
          else{
            if(target.guards[0].affiliation.toUpperCase() == "TOWN"){
              this.townAlive -= 1
            }
          }
          this.graveyard.push(target.guards[0])
        }
        else{
          if(target.killable == false || (target.role.toUpperCase() == "BULLETPROOF" && target.xNum != 0 && target.guards.length == 0) || target.bp1 == true){
            if(yesStrong == false && role.toUpperCase() != "STRONGMAN"){
              return
            }
          }
          if(target.hider.length != 0){
            for(let hiding of target.hider){
              hiding.alive = false
              hiding.vtl = null
              if(this.mafia.indexOf(hiding.name) != -1){
                this.mafia.splice(this.mafia.indexOf(hiding.name),1)
              }
              else{
                if(hiding.affiliation.toUpperCase() == "TOWN"){
                  this.townAlive -= 1
                }
              }
              this.graveyard.push(hiding)
            }
          }
          target.alive = false
          target.vtl = null
          if(this.mafia.indexOf(target.name) != -1){
            this.mafia.splice(this.mafia.indexOf(target.name),1)
          }
          else{
            if(target.affiliation.toUpperCase() == "TOWN"){
              this.townAlive -= 1
            }
          }
          this.graveyard.push(target)
          this.nkinfo.successful = "successful."
        }
      }
      else if(role.toUpperCase() == "DOCTOR"){
            target.killable = false
      }
      else if(role.toUpperCase() == "COP"){
        user.dms.send(target.name + " is " + target.visibleAff + ".")
      }
      else if(role.toUpperCase() == "ROLECOP"){
        var theMessage = target.name + " is a "
        for(let mod of target.visibleMods){
          if(mod.toUpperCase() == "WEAK"){
            theMessage = theMessage + "weak "
          }
          if(mod.toUpperCase() == "STRONG"){
            theMessage = theMessage + "strong "
          }
          if(mod.toUpperCase() == "ODD"){
            theMessage = theMessage + "odd "
          }
          if(mod.toUpperCase() == "EVEN"){
            theMessage = theMessage + "even "
          }
        }
        if(target.xNum != null){
          theMessage = theMessage + target.xNum + "x "
        }
        user.dms.send(theMessage + target.visibleRole + ".")
      }
      else if(role.toUpperCase() == "ROLEBLOCKER"){
          target.blocked = true
      }
      else if(role.toUpperCase() == "PGO"){
        for(let player of this.playersList){
          if(player.target != null){
            if(player.target.toUpperCase() == user.name.toUpperCase() && player.blocked != true){
              player.alive = false
              player.vtl = null
              if(this.mafia.indexOf(player.name) != -1){
                this.mafia.splice(this.mafia.indexOf(player.name),1)
              }
              else{
                if(player.affiliation.toUpperCase() == "TOWN"){
                  this.townAlive -= 1
                }
              }
              this.graveyard.push(player)
            }
          }
        }
      }
      else if(role.toUpperCase() == "TRACKER"){
        if(target.target == null|| target.blocked == true || target.role.toUpperCase() == "NINJA"){
          user.dms.send(target.name + " visited no one.")
        }
        else if(target.target != null){
          if(target.target.toUpperCase() == "WAIVE"){
            user.dms.send(target.name + " visited no one.")
          }
          else{
            user.dms.send(target.name + " visited " + target.target + ".")
          }
        }
      }
      else if(role.toUpperCase() == "WATCHER"){
        var thevisits = []
        for(let possVisitor of this.playersList){
          if(possVisitor.target == target.name && possVisitor.blocked == false && possVisitor.role.toUpperCase() != "NINJA"){
            thevisits.push(possVisitor.name)
          }
        }
        if(thevisits.length == 0){
          user.dms.send(target.name + " was visited by no one.")
        }
        else{
          user.dms.send(target.name + " was visited by the following: ")
          user.dms.send(thevisits)
        }
      }
      else if(role.toUpperCase() == "VIGILANTE"){
        if(target.killable == false || (target.role.toUpperCase() == "BULLETPROOF" && target.xNum != 0) || target.bp1 == true){
          if(target.bp1 == true  && target.guards.length == 0){
            target.bp1 = false
          }
          if(target.role.toUpperCase() == "BULLETPROOF" && target.xNum != 0 && target.guards.length == 0){
            if(target.xNum != null){
              if(!(isNaN(target.xNum))){
                target.xNum -= 1
              }
            }
          }
          var yesStrong = false
          for(let mod of user.modifiers){
            if(mod.toUpperCase() == "STRONG"){
              yesStrong = true
              break
            }
          }
          if(yesStrong == false){
            if(target.guards.length == 0){
              return
            }
          }
        }
        else if(target.role.toUpperCase() == "PGO"){
          if(target.guards.length == 0){
            return
          }
        }
        if(target.guards.length >= 1 && yesStrong == false){
          if(target.guards[0].hider.length != 0){
            for(let hiding of target.guards[0].hider){
              hiding.alive = false
              hiding.vtl = null
              if(this.mafia.indexOf(hiding.name) != -1){
                this.mafia.splice(this.mafia.indexOf(hiding.name),1)
              }
              else{
                if(hiding.affiliation.toUpperCase() == "TOWN"){
                  this.townAlive -= 1
                }
              }
              this.graveyard.push(hiding)
            }
          }
          target.guards[0].alive = false
          target.guards[0].vtl = null
          if(this.mafia.indexOf(target.guards[0].name) != -1){
            this.mafia.splice(this.mafia.indexOf(target.guards[0].name),1)
          }
          else{
            if(target.guards[0].affiliation.toUpperCase() == "TOWN"){
              this.townAlive -= 1
            }
          }
          this.graveyard.push(target.guards[0])
        }
        else{
          if(target.killable == false || (target.role.toUpperCase() == "BULLETPROOF" && target.origXNum != 0 && target.guards.length == 0) || target.bp1 == true){
            if(yesStrong == false){
              return
            }
          }
          if(target.hider.length != 0){
            for(let hiding of target.hider){
              hiding.alive = false
              hiding.vtl = null
              if(this.mafia.indexOf(hiding.name) != -1){
                this.mafia.splice(this.mafia.indexOf(hiding.name),1)
              }
              else{
                if(hiding.affiliation.toUpperCase() == "TOWN"){
                  this.townAlive -= 1
                }
              }
              this.graveyard.push(hiding)
            }
          }
          target.alive = false
          target.vtl = null
          if(this.mafia.indexOf(target.name) != -1){
            this.mafia.splice(this.mafia.indexOf(target.name),1)
          }
          else{
            if(target.affiliation.toUpperCase() == "TOWN"){
              this.townAlive -= 1
            }
          }
          this.graveyard.push(target)
        }
      }
      else if(role.toUpperCase() == "ACTRESS"){
        user.visibleRole = target.role
        user.visibleAff = target.affiliation
        user.visibleMods = target.modifiers
        user.origXNum = target.origXNum
        var theMessage = target.name + " is a "
        for(let mod of target.visibleMods){
          if(mod.toUpperCase() == "WEAK"){
            theMessage = theMessage + "weak "
          }
          if(mod.toUpperCase() == "STRONG"){
            theMessage = theMessage + "strong "
          }
          if(mod.toUpperCase() == "ODD"){
            theMessage = theMessage + "odd "
          }
          if(mod.toUpperCase() == "EVEN"){
            theMessage = theMessage + "even "
          }
        }
        if(target.origXNum != null){
          theMessage = theMessage + target.origXNum + "x "
        }
        user.dms.send(theMessage + target.visibleRole + ".")
      }
      else if(role.toUpperCase() == "MESSENGER"){
        target.dms.send("You received the following message: " + user.message)
      }
      else if(role.toUpperCase() == "BODYGUARD"){
        target.guards.push(user)
      }
      else if(role.toUpperCase() == "JAILOR"){
        target.blocked = true
        target.killable = false
      }
      else if(role.toUpperCase() == "FRAMER"){
        target.framed = true
        target.visibleAff = "mafia"
      }
      else if(role.toUpperCase() == "LAWYER"){
        if(target.framed != true){
          target.visibleAff = "town"
        }
      }
      else if(role.toUpperCase() == "MIMIC"){
        user.role = target.role
        user.visibleRole = target.role
        user.affiliation = target.affiliation
        user.visibleAff = target.affiliation
        user.character = target.character
        user.origXNum = target.origXNum
        user.xNum = target.xNum
        user.modifiers = target.modifiers
        user.visibleMods = target.visibleMods
        user.pr = target.pr
        user.priority = target.priority
        user.moreArgs = target.moreArgs
        user.saved = target.affiliation
        user.modifiers = target.modifiers
        user.visibleMods = target.modifiers
        user.abils = target.abils
        var theMessage = target.name + " is a "
        for(let mod of target.visibleMods){
          if(mod.toUpperCase() == "WEAK"){
            theMessage = theMessage + "weak "
          }
          if(mod.toUpperCase() == "STRONG"){
            theMessage = theMessage + "strong "
          }
          if(mod.toUpperCase() == "ODD"){
            theMessage = theMessage + "odd "
          }
          if(mod.toUpperCase() == "EVEN"){
            theMessage = theMessage + "even "
          }
        }
        if(target.origXNum != null){
          theMessage = theMessage + target.origXNum + "x "
        }
        theMessage = theMessage + target.visibleRole + "."
        if(this.chars == true){
          user.dms.send(theMessage + " Their character is " + target.character)
        }
        else{
          user.dms.send(theMessage)
        }
        this.doPassives()
      }
      else if(role.toUpperCase() == "JOAT"){
        if(user.ability.toUpperCase() == "COP"){
          user.dms.send(target.name + " is " + target.visibleAff + ".")
          user.abils.splice(user.abils.indexOf(user.ability),1)
        }
        else if(user.ability.toUpperCase() == "LAWYER"){
          if(target.framed != true){
            target.visibleAff = "town"
          }
          user.abils.splice(user.abils.indexOf(user.ability),1)
        }
        else if(user.ability.toUpperCase() == "FRAMER"){
          target.framed = true
          target.visibleAff = "mafia"
          user.abils.splice(user.abils.indexOf(user.ability),1)
        }
      }
      else if(role.toUpperCase() == "HIDER"){
        user.killable = false
        target.hider.push(user)
      }
      else if(role.toUpperCase() == "JANITOR"){
        target.willFlip = false
      }
      for(let mod of user.modifiers){
        if(mod.toUpperCase() == "WEAK"){
          if(target.affiliation.toUpperCase() == "MAFIA"){
            user.alive = false
            user.vtl = null
            if(this.mafia.indexOf(user.name) != -1){
              this.mafia.splice(this.mafia.indexOf(user.name),1)
            }
            else{
              if(user.affiliation.toUpperCase() == "TOWN"){
                this.townAlive -= 1
              }
            }
            this.graveyard.push(user)
          }
          break
        }
      }
    }
    help = function(msg) {
        let contentArray = msg.content.split(' ')
        if(contentArray.length > 2){
          msg.channel.send("Incorrect format. Do mafia.help or mafia.help <page number>.")
          return
        }
        if(contentArray[1] && contentArray[1] != 1 && contentArray[1] != 2){
          msg.channel.send("The only page numbers are 1 and 2.")
          return
        }
        var num = 1
        if(contentArray[1]){
          num = contentArray[1]
        }
        let helpText1 = `
            *Welcome to MafiaBot by Bullish and Speedrace. (page 1)*
            **Commands: **
            \`mafia.new <gameTitle>\` = make yourself mod, with <gameTitle> as the game's title. If you do not provide a game title, the default will be "Mafia."
            \`mafia.add|<player username>|<player role>|<character>|<affiliation>|<pm>'\` = add a player; [playerName] must be their exact display name. To run a game without characters, do mafia.chars off, otherwise you must provide a character. If the player is mafia, do NOT include their partners in their pm because the pm will be printed if they die; the game will automatically tell them their partners. For a JOAT, do |JOAT#<abilities separated by commas>. For example, |JOAT#bulletproof,lawyer|. To add modifiers, for player role, do <player role>&<modifiers separated by commas>. For example, |strongman&1x,even|.
            \`mafia.kick <playerName>\` = remove a player from the list of players while making the game; [playerName] must be exact
            \`mafia.players\` = list all players. *(alias mafia.ls)*
            \`mafia.chars <mode>\` = turns use of characters on or off. Default is on. <mode> must be 'on' or 'off.'
            \`mafia.flip <mode>\` = switches lynch flipping before or after the NP. Default is before the NP. <mode> must be 'before' or 'after.'
            \`mafia.start\` = starts a phase with 15 minutes on the clock. To change game time length, do mafia.time <day phase length in minutes>.
            \`mafia.time <day phase length in minutes>\` = changes the day phase time length.
            \`mafia.pause\` = pauses the phase.
            \`mafia.unpause\` = unpauses the phase.
            \`mafia.checktime\` = shows time left in the phase.`
        let helpText2 = `
            *Welcome to MafiaBot by Bullish and Speedrace. (page 2)*
            **Commands: **
            \`mafia.status\` = shows stats about the current game.
            \`mafia.kill <playerName> <deathMessage>\` = kills a player; <playerName> pattern matches; <deathMessage> displays after the player name.
            \`vtl <playerName>\` = votes to lynch a player; <playerName> pattern matches. *(alias vte, vote)*
            \`unvote\` = unvotes.
            \`mafia.votes\` = lists the current vote count. *(alias mafia.vc)* *(alias mafia.v)*
            \`mafia.resetvotes\` = resets the vote count to 0. *(alias mafia.rv)*
            \`mafia.end\` = end the game.
            \`mafia.revive\` = revive all players.
            \`mafia.roles\` = lists roles. Do mafia.roles to see all roles, or mafia.roles <role> to see a specific one.
            \`mafia.modifs\` = lists all possible modifiers.
            \`mafia.settings <settingToChange> <mode>\` = Opens the settings menu. Include <settingToChange> and <mode> to change a specific setting.
            \`action|<playerName>\` = performs one's night action. <playerName> must be exact. Do 'action|waive' to waive.
            \`nk|<playerName>\` = performs the night kill. <playerName> must be exact. Do 'nk|waive' to waive.
            \`mafia.help <page number>\` = opens this help menu. Include <page number> for a specific page
        `
        var embed = null
        if(num == 1){
          embed = {
              color: "888888",
              title: "How to use this bot: ",
              description: helpText1
          }
        }
        else{
          embed = {
              color: "888888",
              title: "How to use this bot: ",
              description: helpText2
          }
        }
        msg.channel.send({embed: embed})
    }
    seeMods = function(msg){
      let modList = `
          Even - makes it so actions can only be done on even nights
          Odd - makes it so actions can only be done on odd nights
          1x - makes it so a role can only be used X amount of times (replace the 1 with how many times it can be used).
          Weak - makes it so that, if the user targets scum, they user dies.
          Strong - makes it so that the role will bypass kill-stopping roles; only for killing roles.
      `
      let embed = {
            color: "888888",
            title: "Mods: ",
            description: modList
      }
      msg.channel.send({embed: embed})
      return
    }
    settings = function(msg){
      var sett = false
      var mode = false
      let contentArray = msg.content.split(' ')
      if(contentArray.length == 1){
        let settingsList = `
            \`mafia.settings <settingToChange> <mode>\` = Opens the settings menu. Include <settingToChange> and <mode> to change a specific setting.
            \`mafia.settings tellIfBlocked <on or off>\` = Decides if players who are roleblocked are told. Default is true.
            \`mafia.settings jesterEnd <on or off>\` = Decides if the game ends if the jester wins. Default is true.
            \`mafia.settings canDocSelfTarget <yes or no>\` = Decides if the doctor can self-target. Default is true.
        `
        let embed = {
              color: "888888",
              title: "Mafia Settings: ",
              description: settingsList
        }
        msg.channel.send({embed: embed})
        return
      }
      if(contentArray.length != 3){
        msg.channel.send("Incorrect formatting. Do mafia.settings <settingToChange> <mode>")
        return
      }
      if(contentArray[1].toUpperCase() == "tellIfBlocked".toUpperCase()){
        if(contentArray[2].toUpperCase() == "ON"){
          this.tellIfBlocked = true
          msg.channel.send("Setting changed!")
          return
        }
        else if(contentArray[2].toUpperCase() == "OFF"){
          this.tellIfBlocked = false
          msg.channel.send("Setting changed!")
          return
        }
        else{
          msg.channel.send("That mode for this setting does not exist. Do mafia.settings to see possible setting modes.")
          return
        }
      }
      if(contentArray[1].toUpperCase() == "jesterEnd".toUpperCase()){
        if(contentArray[2].toUpperCase() == "ON"){
          this.jesterEnd = true
          msg.channel.send("Setting changed!")
          return
        }
        else if(contentArray[2].toUpperCase() == "OFF"){
          this.jesterEnd = false
          msg.channel.send("Setting changed!")
          return
        }
        else{
          msg.channel.send("That mode for this setting does not exist. Do mafia.settings to see possible setting modes.")
          return
        }
      }
      if(contentArray[1].toUpperCase() == "canDocSelfTarget".toUpperCase()){
        if(contentArray[2].toUpperCase() == "YES"){
          this.canDocSelfTarget = ["Lawyer", "Doctor"]
          msg.channel.send("Setting changed!")
          return
        }
        else if(contentArray[2].toUpperCase() == "NO"){
          this.canDocSelfTarget = ["Lawyer"]
          msg.channel.send("Setting changed!")
          return
        }
        else{
          msg.channel.send("That mode for this setting does not exist. Do mafia.settings to see possible setting modes.")
          return
        }
      }
      msg.channel.send("That setting does not exist. Do mafia.settings to see possible settings.")
      return
    }
    printRoles = function(msg){
      var content = msg.content.split(" ")
      if(content.length == 2){
        if((this.roleList.filter((str) => str.toUpperCase() == (content[1].toUpperCase())).length) < 1){
          msg.channel.send("This is not a valid role. Do mafia.roles to see all roles.")
          return
        }
        var i = 0
        while (i < this.roleList.length){
          if(this.roleList[i].toUpperCase() == content[1].toUpperCase()){
            break
          }
          i+=1
        }
        var role = `${this.roleList[i]} - ${this.roleDesc[i]}`
        let embed = {
            color: "888888",
            description: role
        }
        msg.channel.send({embed: embed})
        return
      }
      else if(content.length != 1){
        msg.channel.send("Incorrect format. Do mafia.roles to see all roles, or mafia.roles <role> to see a specific one.")
        return
      }
      var str = ''
      var str2 = ''
      var i = 0
      while (i < Math.floor(this.roleList.length/2)){
        str = str + `${this.roleList[i]} - ${this.roleDesc[i]}\n`
        i+=1;
      }
      while (i < this.roleList.length){
        str2 = str2 + `${this.roleList[i]} - ${this.roleDesc[i]}\n`
        i+=1;
      }
      let embed = {
          color: "888888",
          title: "Roles: ",
          description: str
      }
      let embed2 = {
          color: "888888",
          title: "Roles: ",
          description: str2
      }
      msg.channel.send({embed: embed})
      msg.channel.send({embed: embed2})
    }
    printJoat = function(msg){
      var str = ''
      var i = 0
      while (i < this.possAbils.length){
        str = str + `${this.possAbils[i]}\n`
        i+=1;
      }
      let embed = {
          color: "888888",
          title: "JOAT Abilities: ",
          description: str
      }
      msg.channel.send({embed: embed})
    }
    inno = function(msg){
      var user = null
      if(this.inGame == false){
        msg.channel.send("There is no current game.")
        return
      }
      for(let player of this.playersList){
        if(msg.author == player.dms){
          user = player
        }
      }
      if(user == null){
        msg.channel.send("You are not in the game.")
        return
      }
      if(user.role.toUpperCase() != "INNOCENT CHILD"){
        msg.channel.send("You are not an innocent child.")
        return
      }
      this.channel.send("*" + user.name + " is innocent.*")
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
