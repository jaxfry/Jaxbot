//dependencys
var mineflayer = require('mineflayer')
var D = require('discord.js');
const { channel } = require('diagnostics_channel');
const client = new D.Client();
var config = require('./config.json')
const chalk = require('chalk')
const { mineflayer: mineflayerViewer } = require('prismarine-viewer');
const { delay } = require('lodash');
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const RANGE_GOAL = 1 // get within this radius of the player
const tpaList = ["jaxfry"]


 //change the config here
 let prefix = config.prefix;
 let color = "#RANDOM";
let ip = config.ip;
let username = config.username;
let password = config.password;
let ver = config.version;
//creates the bot
var bot = mineflayer.createBot({
  host: ip,  
  version: ver,
  password: password,
  username: username,
  auth: 'microsoft',
})



bot.chatAddPattern(/^.*?(\w*) wants to teleport to you\.$/, "tpa", "tparequest");
bot.chatAddPattern(/(Your request was accepted, teleporting to:)/, "die", "death");
bot.chatAddPattern(/(!!)/, "ad", "Advertise");

//turns discord bot on
client.on('ready', async () => {
    console.log(chalk.blue('=-()-=-=()=--=()=--=()=--=()'))
    console.log(chalk.red(`discord bot is on`))
    console.log(chalk.magenta('=-()-=-=()=--=()=--=()=--=()'))
}) 
//turns minecraft bot on
bot.on('login', async () => {
    console.log(chalk.blue('=-()-=-=()=--=()=--=()=--=()'))
    console.log(chalk.green`bot is on At ${ip}`)
    console.log(chalk.magenta('=-()-=-=()=--=()=--=()=--=()'))
})

bot.loadPlugin(pathfinder)


bot.once('spawn', () => {

  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    if (message === '^jaxb0t')
    bot.chat(`/tpa ${username}`)
    return
  })
})

bot.on('die', function (username) {
  console.log(`I did /kill.`)
  {
    setTimeout(function() {
      bot.chat(`/kill`)
      bot.chat("Thanks for using jaxb0t! to use it again do ^jaxb0t.")
    }, 1000);
  }
})


  
    setTimeout(function() {
      bot.chat(`Please use jaxb0t. It is not %100 done and may be buggy and not work some times. If you ever see a bug with jaxb0t please dm me on discord or join this server: https://discord.gg/MbnRvWExcG`)
      bot.chat("To use jaxb0t just type ^jaxb0t")
    }, 420000)
  


bot.once('spawn', () => {
  const mcData = require('minecraft-data')(bot.version)
  const defaultMove = new Movements(bot, mcData)

  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    if (message !== 'come') return
    const target = bot.players[username]?.entity
    if (!target) {
      console.log("I don't see you !")
      return
    }
    const { x: playerX, y: playerY, z: playerZ } = target.position

    bot.pathfinder.setMovements(defaultMove)
    bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, RANGE_GOAL))
  })
})

bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3007, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
})

bot.on('tpa', function (username) {
  console.log(`${username} tried to tp.`)
  if (tpaList.includes(username)) {
      bot.chat(`/tpy ${username}`)
  }
})



//advertive



//say command
client.on('message', msg => {
    if (!msg.content.startsWith(prefix)) return
    let args = msg.content.split(" ").slice(1)
    args = msg.content.slice(prefix.length).split(/ +/);
    let command = msg.content.split(" ")[0];
    command = command.slice(prefix.length);
    command = args.shift().toLowerCase();
    if (command == "say"){
        const chat = args.join(" ")
        bot.chat(chat)
    }
  })

//walk command
  client.on('message', msg => {
    if (!msg.content.startsWith(prefix)) return
    let args = msg.content.split(" ").slice(1)
    args = msg.content.slice(prefix.length).split(/ +/);
    let command = msg.content.split(" ")[0];
    command = command.slice(prefix.length);
    command = args.shift().toLowerCase();
    if (command == "walk"){
        const walk = args.join(" ")
        bot.setControlState('forward', true)
        bot.chat(walk)
    }
  })
  client.on('message', msg => {
    if (!msg.content.startsWith(prefix)) return
    let args = msg.content.split(" ").slice(1)
    args = msg.content.slice(prefix.length).split(/ +/);
    let command = msg.content.split(" ")[0];
    command = command.slice(prefix.length);
    command = args.shift().toLowerCase();
    if (command == "stop"){
        const stop = args.join(" ")
        bot.setControlState('forward', false)
        bot.chat(stop)
    }
  })


  

//configs discord bot
bot.on('message', message => {
    let channel = client.channels.cache.get(config.ChannelID)
    if (!channel) return;
    channel.send(`From Server Chat >> ${message}`)
})


client.login(config.Dtoken)
.catch(error => {
    console.log('cant login');
}) 