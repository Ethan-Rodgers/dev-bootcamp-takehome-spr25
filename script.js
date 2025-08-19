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
    user: qs("h3.user-hp"),
    ethan: qs("h3.ethan-hp")
  },
  messages: qs("h3.messages")
}


const pkmnDb = {
  c: {
    name: "Charmander",
    types: ["fi"],
    hp: 600,
    abbrev: 'c',
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
    abbrev: 's',
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
    abbrev: 'b',
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
const ethan = {
  types: ["el", "ps"],
  hp: 1000,
  moves: [
    {
      name: "Hack",
      type: "ps",
      power: 70,
      mult: {
        c: 1,
        s: 1,
        b: 1
      }
    },
    {
      name: "Slap bass",
      type: "st",
      power: 70,
      mult: {
        c: 0.5,
        s: 0.5,
        b: 1
      }
    },
    {
      name: "Refactor",
      type: "el",
      power: 70,
      mult: {
        c: 1,
        s: 2,
        b: 0.5
      }
    },
    {
      name: "Pull request",
      type: "fl",
      power: 70,
      mult: {
        c: 1,
        s: 1,
        b: 2
      }
    },
  ]
}



let pokemon;
let state = 0; // 0=choose, 1=battle, 2=win
let hp = {
  user: 0,
  ethan: ethan.hp
}

buttons.choose.forEach(button => button.addEventListener("click", choose));
buttons.moves.forEach(button => button.addEventListener("click", startTurn));



function choose() {
  pokemon = pkmnDb[this.dataset.pkmn];
  state=1;
  console.log("Chose " + pokemon.name);

  //show articles
  articles.choose.style.display = "none";
  articles.battle.style.display = "block";
  articles.user.style.display = "block";
  

  //populate
  hp.user = pokemon.hp;
  texts.hpLabel.textContent = `${pokemon.name} HP`;
  texts.hp.user.textContent = "/".repeat(Math.ceil(20.0 * hp.user / pokemon.hp)) + ` ${hp.user}/${pokemon.hp}`;
  texts.hp.ethan.textContent = "/".repeat(Math.ceil(20.0 * hp.ethan / ethan.hp)) + ` ${hp.ethan}/${ethan.hp}`;
  for (let i = 0; i < 4; i++) {
    const move = pokemon.moves[i]
    buttons.moves[i].textContent = `${move.name} - ${move.type}, power=${move.power}`
  }
}

let currentTurn = false;
async function startTurn() {
  if (state != 1) return;
  currentTurn = true;

  //Ethan's move
  const ethanMove = ethan.moves[Math.floor(Math.random() * ethan.moves.length)];
  console.log(ethanMove);
  await show(`Ethan Rodgers used ${ethanMove.name}`);
  hp.user = Math.max(0, hp.user - ethanMove.power * ethanMove.mult[pokemon.abbrev]);
  await updateHpBar();
  if (ethanMove.mult[pokemon.abbrev] == 2) show("It's super effective!");
  else if (ethanMove.mult[pokemon.abbrev] == 0.5) show("It's not very effective...");

  //check win
  checkWin();

  //User's move
  const move = pokemon.moves[Number(this.dataset.i)];
  console.log(move);
  await show(`${pokemon.name} used ${move.name}`);
  hp.ethan = Math.max(0, hp.ethan - move.power * move.mult);
  await updateHpBar();
  if (move.mult == 2) show("It's super effective!");
  else if (move.mult == 0.5) show("It's not very effective...");

  //check win
  checkWin();


  currentTurn = false;

  function checkWin() {
    if (hp.user == 0) {
      state = 2
      show(`${pokemon.name} fainted.`);
    }
    else if (hp.ethan == 0) {
      state = 2
      show(`The opposing Ethan Rodgers fainted.`);
    }
  }
}

async function show(txt) {
  texts.messages.textContent = txt;
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  texts.messages.textContent = "-";
  await new Promise((resolve, reject) => setTimeout(resolve, 500));
}

async function updateHpBar() {
  let numSlashes = Math.ceil(20.0 * hp.user / pokemon.hp);
  texts.hp.user.textContent = "/".repeat(numSlashes) + " ".repeat(20 - numSlashes) + ` ${hp.user}/${pokemon.hp}`;
  if(1.0 * hp.user / pokemon.hp < 0.1) texts.hp.user.style.color = "red";
  else if(1.0 * hp.user / pokemon.hp < 0.5) texts.hp.user.style.color = "#9c9a13";

  numSlashes = Math.ceil(20.0 * hp.ethan / ethan.hp);
  texts.hp.ethan.textContent = "/".repeat(numSlashes) + " ".repeat(20 - numSlashes) + ` ${hp.ethan}/${ethan.hp}`;
  if(1.0 * hp.ethan / ethan.hp < 0.1) texts.hp.ethan.style.color = "red";
  else if(1.0 * hp.ethan / ethan.hp < 0.5) texts.hp.ethan.style.color = "#9c9a13";

  await new Promise((resolve, reject) => setTimeout(resolve, 500));
}

