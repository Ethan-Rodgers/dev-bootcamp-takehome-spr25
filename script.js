const qs = document.querySelector.bind(document);
const qsa = document.querySelectorAll.bind(document);
const buttons = {
  choose: qsa("button.choose"),
  moves: qsa("article.moves button")
}
const articles = {
  choose: qs("article.choose"),
  ethan: qs("article.ethan"),
  user: qs("article.user"),
  battle: qs("article.battle")
}
const texts = {
  hpLabel: qs("h3.hp-label"),
  hp: {
    user: qs("user-hp"),
    ethan: qs("ethan-hp")
  },
  messages: qs("h3.messages")
}


const pokemonDb = {
  c: {
    name: "Charmander",
    types: ["fi"],
    hp: 600,
    moves: [
      {
        name: "Ember",
        type: "fi",
        power: 50,
        mult: 1
      },
      {
        name: "Rock throw",
        type: "ro",
        power: 60,
        mult: 1
      },
      {
        name: "Superpower",
        type: "fi",
        power: 40,
        mult: 0.5
      },
      {
        name: "Accept application",
        type: "no",
        power: 999,
        mult: 2
      },
    ]
  },
  s: {
    name: "Squirtle",
    types: ["wa"],
    hp: 500,
    moves: [
      {
        name: "Water gun",
        type: "wa",
        power: 50,
        mult: 1
      },
      {
        name: "Fury cutter",
        type: "bu",
        power: 60,
        mult: 2
      },
      {
        name: "Pound",
        type: "no",
        power: 40,
        mult: 1
      },
      {
        name: "Accept application",
        type: "no",
        power: 999,
        mult: 2
      },
    ]
  },
  b: {
    name: "Bulbasaur",
    types: ["gr"],
    hp: 600,
    moves: [
      {
        name: "Branch poke",
        type: "gr",
        power: 50,
        mult: 1
      },
      {
        name: "Confusion",
        type: "ps",
        power: 60,
        mult: 0.5
      },
      {
        name: "Curse",
        type: "gh",
        power: 40,
        mult: 2
      },
      {
        name: "Accept application",
        type: "no",
        power: 999,
        mult: 2
      },
    ]
  }
}




let pokemon = null;
let state = 0; // 0=choose, 1=battle, 2=win

buttons.choose.forEach(button => button.addEventListener("click", choose));



function choose() {
  pokemon = this.dataset.pkmn;
  state=1;
  console.log("Chose " + pokemon);

  articles.choose.style.display = "none";
  articles.battle.style.display = "show";
}



