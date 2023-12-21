/* Importer fra moduler */

import { fetchApi } from "./Modules/fetchApi.mjs";
import { makeElements } from "./Modules/makeElements.mjs";
import { navBarMaker } from "./Modules/navBarMaker.mjs";
import {
  setActiveScreen,
  prevScreen,
  activeScreen,
} from "./Modules/setActiveScreen.mjs";
import { displaySearchItem } from "./Modules/displayItemInfo.mjs";
/* fetcher fra HTML */

const infoCard = document.querySelector(".info-card");

const cardImgContainer = document.querySelector(".card-img");

const cardTextContainer = document.querySelector(".monster-stats");

const searchBtn = document.querySelector(".searchBtn");

const searchField = document.querySelector("#searchField");

const startPage = document.querySelector(".startPage");

const resultScreen = document.querySelector(".resultScreen");

/* mekker NAVBAR */
await navBarMaker();

const headerLogo = document.querySelector(".headerLogo");

/* globale variabler */
const searchDatabase = await fetchApi("../js/searchDatabase/searchObject.JSON");
console.log(searchDatabase.data);
let searchElements = [];

/**
 * Funksjon som finner et monster fra API og setter det som monsterExample variabelen.
 * @param {*} monsterURL
 */
const setActiveMonster = async (monsterURL) => {
  monsterExample = await fetchApi(apiURL + monsterURL);
};

/* For å lage en brukervennlig navbar må index fra API struktureres litt annerledes. */

/* API URLER */

const apiURL = "https://www.dnd5eapi.co";

const apiIndex = "https://www.dnd5eapi.co/api";

const indexExample = await fetchApi(apiIndex);

const allMonstersUrl = "https://www.dnd5eapi.co/api/monsters";

const allMonstersExample = await fetchApi(allMonstersUrl);

const monsterUrl = "https://www.dnd5eapi.co/api/monsters/acolyte";

let monsterExample = await fetchApi(monsterUrl);

const searchAPIURL = "https://api.open5e.com/search/?text=";

const test = await fetchApi(
  apiURL + "/api/equipment-categories/adventuring-gear"
);
console.log(test);

/* Søkefunksjoner */

/**
 * Bruker en annen api, og normaliserer til vår api for å lage en søkefunksjon. Vår valgte API mangler enkel søkefunksjon.
 * @param {*} string input
 * @returns
 */
const searchFunction = async (string, item = null) => {
  //Fjerner alle gamle "children" fra resultScreen og resetter searchElements
  searchElements.forEach((element) => element.remove());
  searchElements = [];
  let searchResult = [];
  //Mindre nøyaktig søkefunksjon, går via en annen api. gir flere resultater, men mangler mye.
  const normalizedString = string.toLowerCase();
  let searchData = item || searchDatabase.data;
  searchData.forEach((data) => {
    console.log(data);
    arraySearch(searchResult, data, normalizedString);
  });
  console.log(searchResult);
  //Går gjennom alle resultatene og normaliserer svarene til vår apitype. Noe her kan gjøres bedre. men beste er nok å faktisk skifte API vi bruker på siden.

  //Lager nye child elementer til resultScreen basert på søkeresultatene.
  if (activeScreen !== resultScreen) setActiveScreen(resultScreen);
  for (let result of searchResult) {
    const fetchedData = await fetchApi(apiURL + result.url);
    appendResults(fetchedData);
  }
};

const arraySearch = (mainArray, array, searchString) => {
  if (array.length === 0) return;
  let searchArray = array.map((x) => x);
  let string = searchString;
  //Find leter etter strings
  let result = searchArray.find((searchElement) =>
    searchElement.index?.includes(string)
  );
  console.log(result);
  if (result === undefined) return;
  else {
    mainArray.push(result);
    searchArray.splice(searchArray.indexOf(result), 1, "");
    return arraySearch(mainArray, searchArray, searchString);
  }
};

const appendResults = async (searchResult) => {
  const resultName = makeElements("button", {
    className: "resultName descriptionText darkMode",
    innerText: searchResult.name,
    value: searchResult.url,
  });
  resultName.addEventListener("click", async () => {
    await setActiveMonster(resultName.value);
    resultName.value.includes("monsters")
      ? (displayMonsterInfo(monsterExample), setActiveScreen(infoCard))
      : displaySearchItem(resultName.value);
  });
  searchElements.push(resultName);
  resultScreen.appendChild(resultName);
  if (!searchResult.desc) return;
  if (typeof searchResult.desc === "object") {
    for (let desc of searchResult.desc) {
      const resultDesc = makeElements("p", {
        className: "resultDesc buttonText darkMode",
        innerText: desc,
      });
      resultScreen.appendChild(resultDesc);
      searchElements.push(resultDesc);
    }
  } else {
    const resultDesc = makeElements("p", {
      className: "resultDesc buttonText darkMode",
      innerText: searchResult.desc,
    });
    resultScreen.appendChild(resultDesc);
    searchElements.push(resultDesc);
  }
};

//Eventlistener til søkeknappen
searchBtn.addEventListener(
  "click",
  async () => await searchFunction(searchField.value)
);

//Eventlistener til searchField. gjør at vi kan trykke enter for å søke.
searchField.addEventListener("keydown", async (event) => {
  if (event.code !== "Enter") return;
  else await searchFunction(searchField.value);
});

/* NAVBAR END */

/* dragonList */
const mainContainer = document.getElementById("main-container");
const buttonHome = document.getElementById("home-btn");
const buttonPrev = document.getElementById("previouse-btn");
const buttonNext = document.getElementById("next-btn");

const baseUrl = "https://www.dnd5eapi.co/api/monsters";

let currentDragonList = {
  count: 0,
  next: "",
  previous: "",
  results: [],
};

async function getDragonList(url) {
  const response = await fetch(url || baseUrl);
  if (response.status !== 200) {
    console.warn("noe gikk galt");
    return;
  }
  const data = await response.json();
  console.log(data);

  currentDragonList = data;

  displayDragonList(data.results);
}

getDragonList(baseUrl);

function displayDragonList() {
  mainContainer.innerHTML = "";
  dragonList.forEach(async (dragon) => {
    const dragonDetailData = await getDragonDetails(pokemon.url);
    const dragonImg = dragonDetailData.sprites.other["official-artwork"];

    const containerEl = document.createElement("div");
    const dragonNameEl = document.createElement("h3");
    dragonNameEl.textContent = dragon.name;
  });
}

//monsterCard image maker
const cardImage = document.createElement("img");

cardImage.setAttribute("width", "400");
cardImage.setAttribute("height", "300");
cardImgContainer.appendChild(cardImage);

console.log(apiURL + monsterExample.image);

//monsterCard text content maker
const monsterName = document.createElement("h1");
const monsterSize = document.createElement("p");
const monsterArmor = document.createElement("p");
const monsterHP = document.createElement("p");
const monsterSpeed = document.createElement("p");
const monsterStats = document.createElement("p");
const monsterSkill = document.createElement("p");
const monsterSense = document.createElement("p");
const monsterLanguage = document.createElement("p");
const monsterExp = document.createElement("p");
const monsterProficiencyBonus = document.createElement("p");
const monsterSpecialAbility = document.createElement("p");
const monsterAction = document.createElement("p");
const monsterDescription = document.createElement("p");

const displayMonsterInfo = (monsterExample) => {
  cardImage.src = apiURL + monsterExample.image;

  monsterName.textContent = `${monsterExample.name}`;
  cardTextContainer.appendChild(monsterName);

  //size, race and alignment display
  monsterSize.textContent = `${monsterExample.size}, ${monsterExample.type}, ${monsterExample.alignment}`;
  cardTextContainer.appendChild(monsterSize);

  //create armor information
  monsterArmor.textContent = `Armor Class ${monsterExample.armor_class[0].value}`;
  cardTextContainer.appendChild(monsterArmor);

  //hit points display
  monsterHP.textContent = `Hit Point ${monsterExample.hit_points} (${monsterExample.hit_points_roll})`;
  cardTextContainer.appendChild(monsterHP);

  //speed value display
  monsterSpeed.textContent = `Speed ${monsterExample.speed.walk}`;
  cardTextContainer.appendChild(monsterSpeed);

  //Monster stats display
  monsterStats.textContent = `STR ${monsterExample.strength} DEX ${monsterExample.dexterity} CON ${monsterExample.constitution} INT ${monsterExample.intelligence} WIS ${monsterExample.wisdom} CHA ${monsterExample.charisma}`;
  cardTextContainer.appendChild(monsterStats);

  //Monster skill display
  //fix a better method which makes it able to register monster with more than 2 skills
  monsterSkill.textContent = `Skills ${monsterExample.proficiencies[0].proficiency.name.slice(
    6
  )} +${
    monsterExample.proficiencies[0].value
  }, ${monsterExample.proficiencies[1].proficiency.name.slice(6)} +${
    monsterExample.proficiencies[1].value
  }`;
  cardTextContainer.appendChild(monsterSkill);

  //Monster sense Display
  // find a way to remove "_" in propertynames
  monsterSense.textContent = "senses: ";
  //Object Entries, så kan dekonstruere values.
  Object.entries(monsterExample.senses).forEach((sense) => {
    let [senseName, senseValue] = sense;
    //ser om navnet inneholder _ og fjerner
    if (senseName.includes("_")) {
      senseName = senseName.split("_").join(" ");
    }
    //Legger dekonstruert value inn i p
    monsterSense.textContent += `${senseName}: ${senseValue} `;
  });
  cardTextContainer.appendChild(monsterSense);

  //Monster Language Display
  monsterLanguage.textContent = `Languages ${monsterExample.languages}`;
  cardTextContainer.appendChild(monsterLanguage);

  //Monster xp and challenge rating
  monsterExp.textContent = `Challenge ${monsterExample.challenge_rating} (${monsterExample.xp} XP)`;
  cardTextContainer.appendChild(monsterExp);

  //Monster proficiency bonus display
  monsterProficiencyBonus.textContent = `Proficiency Bonus +${monsterExample.proficiency_bonus}`;
  cardTextContainer.appendChild(monsterProficiencyBonus);

  //Monster Special ability
  monsterSpecialAbility.textContent = `${monsterExample.special_abilities[0].name} ${monsterExample.special_abilities[0].desc}`;
  cardTextContainer.appendChild(monsterSpecialAbility);

  //Monster Action
  monsterAction.textContent = `Action ${monsterExample.actions[0].name} ${monsterExample.actions[0].desc}`;
  cardTextContainer.appendChild(monsterAction);

  //Monster descprtion
  monsterDescription.textContent = `Description ${monsterExample.desc}`;
  cardTextContainer.appendChild(monsterDescription);
};
setActiveScreen(startPage);
headerLogo.addEventListener("click", () => setActiveScreen(startPage));
