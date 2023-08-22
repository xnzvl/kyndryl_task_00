const ADJACENCY_LIST = [
  [ 1,  6,  7],
  [ 0,  2,  6, 12], 
  [ 1],
  [ 2,  4,  8,  9, 10],
  [ 3,  5,  9],
  [ 4,  9, 14],
  [ 0,  1, 10],
  [ 0,  1, 11],
  [ 3, 12],
  [ 3,  4,  5,  8, 12, 14],
  [ 3,  6,  7, 15, 17],
  [ 7, 16, 18],
  [ 1,  8,  9, 17],
  [19],
  [ 9, 19, 20],
  [ 6, 10, 21, 22],
  [11, 17, 21, 22],
  [10, 12, 22, 23],
  [11, 12, 17, 23, 24],
  [13, 14, 18, 23, 25],
  [14, 25],
  [15, 16, 22],
  [16, 17, 23],
  [17, 18, 19, 22, 24],
  [18, 23, 25],
  [19, 20]
]
const INDENT_UNIT = "  ";
const PROMPT = require('prompt-sync')({sigint: true});
const TARGET_ID = "N";


class Player {
  #name;
  #nickname;
  #position;

  constructor(name, nickname, initialPosition) {
    this.#name = name;
    this.#nickname = nickname;
    this.#position = initialPosition;
  }

  getName() {
    return this.#name;
  }

  getNickname() {
    return this.#nickname;
  }

  getCurrentPosition() {
    return this.#position;
  }

  getTravelOptions() {
    return this.#position.getAdjacent();
  }

  travelTo(destinationIndex) {
    this.#position = this.getTravelOptions()[destinationIndex]
  }

  onActionPosition() {
    return Boolean(this.#position.getAction());
  }

  doAction() {
    const action = this.#position.getAction();
    if (action) {
      action()
    }
  }
}

class Node {
  #id;
  #adjacent;
  #action;

  constructor(id) {
    this.#id = id;
    this.#adjacent = null;
    this.#action = null;
  }

  getId() {
    return this.#id;
  }

  getAction() {
    return this.#action;
  }

  setAction(action) {
    if (!this.#action) {
      this.#action = action;
    }
  }

  getAdjacent() {
    return [...this.#adjacent];
  }

  setAdjacent(adjacent) {
    if (!this.#adjacent) {
      this.#adjacent = [...adjacent];
    }
  }
}


function initializeMap() {
  const alpLength = "Z".charCodeAt(0) - "A".charCodeAt(0) + 1;
  const nodes = Array(alpLength).fill(null);

  for (let i = 0; i < alpLength; i++) {
    nodes[i] = new Node(String.fromCharCode("A".charCodeAt(0) + i));
  }

  for (let i = 0; i < alpLength; i++) {
    nodes[i].setAdjacent(ADJACENCY_LIST[i].map((id) => nodes[id]));
  }

  nodes[0].setAction(() => showSign("  your journey begins here ..."));

  return nodes[0];
}

function createPlayer(initialPosition) {
  function prompter(msg) {
    let answer;
    do {
      answer = PROMPT(msg).trim();
    } while(!answer);
    return answer
  }

  const name = prompter("Enter your name: ");
  const nick = prompter("Enter your nickname: ");

  return new Player(name, nick, initialPosition);
}

function drawTravelOptions(player) {
  console.log(`== Target location:  ${TARGET_ID} ==`);
  console.log(`-- Current location: ${player.getCurrentPosition().getId()} --`);
  console.log("");
  console.log("Travel options:");

  const travelOptions = player.getTravelOptions();
  for (let optionIndex in travelOptions) {
    console.log(`  [${Number(optionIndex) + 1}] ${travelOptions[optionIndex].getId()}`)
  }
  console.log("");
}

function drawActionOptions(node) {
  if (!node.getAction()) {
    return;
  }

  console.log("  [X] Action");
  console.log("");
}

function isValidChoice(player, choice) {
  return (!isNaN(choice)
    && 0 < Number(choice)
    && Number(choice) <= player.getTravelOptions().length);
}

function makeChoice(player) {
  let choice = null;
  do {
    console.clear();
    drawTravelOptions(player);
    drawActionOptions(player.getCurrentPosition());

    if(choice) {
      console.log(`  Your last choice "${choice}" is invalid.`);
    } else {
      console.log("");
    }

    choice = PROMPT("  Your choice: ");

    if (player.onActionPosition() && (choice == "X" || choice == "x")) {
      player.doAction();
      choice = null;  // supressing invalid-input-alert
    }

  } while (!isValidChoice(player, choice));

  player.travelTo(choice - 1);
}

function showSign(msg) {
  console.clear();
  console.log("-- You're reading a sign --");
  console.log("");
  console.log(msg);
  console.log("");
  console.log("");
  PROMPT("Press Enter to continue ...");
}

function victoryScreen(player) {
  console.clear();
  console.log("========== VICTORY ==========");
  console.log("-- Target location reached --");
  console.log("");
  console.log("  Congratulations!");
  console.log(`  Player ${player.getNickname()} (${player.getName()}) has won!`);
  console.log("");
  console.log("---------- THE END ----------");
}


function main() {
  const startNode = initializeMap();
  const player = createPlayer(startNode);

  while (player.getCurrentPosition().getId() !== TARGET_ID) {
    makeChoice(player);
  }

  victoryScreen(player);
}

main()
