const ADJACENCY_LIST = [
  [ 1,  6,  7],
  [ 0,  2,  6,  7, 12], 
  [ 1,  3],
  [ 2,  4,  8,  9, 10],
  [ 3,  5,  9],
  [ 4,  9, 14],
  [ 0,  1, 10, 15],
  [ 0,  1, 10, 11],
  [ 3,  9, 12],
  [ 3,  4,  5,  8, 12, 14],
  [ 3,  6,  7, 15, 17],
  [ 7, 16, 18],
  [ 1,  8,  9, 17, 18],
  [19],
  [ 5,  9, 19, 20],
  [ 6, 10, 21, 22],
  [11, 17, 21, 22],
  [10, 12, 16, 18, 22, 23],
  [11, 12, 17, 23, 24],
  [13, 14, 18, 23, 25],
  [14, 25],
  [15, 16, 22],
  [16, 17, 21, 23],
  [17, 18, 19, 24],
  [18, 23, 25],
  [19, 20, 24]
]
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
}

class Node {
  #id;
  #adjacent;

  constructor(id) {
    this.#id = id;
    this.#adjacent = null;
  }

  getId() {
    return this.#id;
  }

  getAdjacent() {
    return [...this.#adjacent];
  }

  setAdjacent(adjacent) {
    if (this.#adjacent === null) {
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

  return nodes[0];
}

function createPlayer(initialPosition) {
  const name = PROMPT("Enter your name: ");
  const nick = PROMPT("Enter your nickname: ")

  return new Player(name, nick, initialPosition);
}

function drawOptions(player) {
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

function isValidChoice(player, choice) {
  return !isNaN(choice)
    && 0 < Number(choice)
    && Number(choice) <= player.getTravelOptions().length;
}

function makeChoice(player) {
  let choice = null;

  do {
    console.clear();
    drawOptions(player);

    if(choice) {
      console.log(`  Your last choice "${choice}" is invalid.`);
    } else {
      console.log("");
    }

    choice = PROMPT("  Your choice: ");
  } while (!isValidChoice(player, choice));

  player.travelTo(choice - 1);
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
