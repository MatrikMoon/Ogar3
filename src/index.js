var runMaster = true;
var runGame = true;

var _gameServer = null;
var _masterServer = null;

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

process.argv.forEach(function(val) {
    if (val == "--master") {
        runMaster = true;
    } else if (val == "--game") {
        runGame = true;
    } else if (val == "--help") {
        console.log("Proper Usage: %s [--master] [--game]", process.argv[0]);
        console.log("    --master            Run the Agar master server.");
        console.log("    --game              Run the Agar game server.");
        console.log("    --help              Help menu.");
        console.log("");
        console.log("You can use both options simultaneously to run both the master and game server.");
        console.log("");
    } 
});

if (runMaster) {
    // Initialize the master server
    var MasterServer = require('./MasterServer');
    _masterServer = new MasterServer(8080);
    _masterServer.start();
}

if (runGame) {
    // Initialize the game server
    var GameServer = require('./GameServer');
    _gameServer = new GameServer();
    _gameServer.start();
}

const printHelp = () => {
  console.log("Proper Usage:");
  console.log("    spawnBots         Spawn 10 bots");
  console.log("    despawnBots       Despawn all bots");
  console.log("    help              Help menu.");
};

readline.on('line', (command) => {
  switch (command) {
    case 'spawnBots': 
      let BotLoader = require('./ai/BotLoader.js');
      let numberOfBots = 10 - _gameServer.clients.length;
      if (numberOfBots <= 0) numberOfBots = 10;
      new BotLoader(_gameServer, numberOfBots);
      console.log("[Game] Loaded "+numberOfBots+" player bots");
      break;
    case 'despawnBots':
      let clients = _gameServer.clients;
      clients.forEach((client) => {
        console.log(client.isBot);
        if (client.isBot) client.close();
      });
      break;
    case 'help':
      printHelp();
      break;
    default:
      printHelp();
      break;
  }
});

