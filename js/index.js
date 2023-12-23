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
import { searchDatabase } from "./Modules/fetchData.mjs";
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

const monsterUrl = "https://www.dnd5eapi.co/api/monsters/adult-black-dragon";

let monsterExample = await fetchApi(monsterUrl);

const searchAPIURL = "https://api.open5e.com/search/?text=";

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
  let normalizedString = string.toLowerCase();
  if (normalizedString.includes(" "))
    normalizedString = normalizedString.split(" ").join("-");
  let searchData = item || searchDatabase.data;
  searchData.forEach((data) => {
    arraySearch(searchResult, data, normalizedString);
  });
  //Går gjennom alle resultatene og normaliserer svarene til vår apitype. Noe her kan gjøres bedre. men beste er nok å faktisk skifte API vi bruker på siden.

  //Lager nye child elementer til resultScreen basert på søkeresultatene.
  if (!searchResult.length) {
    appendResults();
  } else {
    for (let result of searchResult) {
      const fetchedData = await fetchApi(apiURL + result.url);
      appendResults(fetchedData);
    }
  }
  if (activeScreen !== resultScreen) setActiveScreen(resultScreen);
};

const arraySearch = (mainArray, array, searchString) => {
  if (!array.length) return;
  let searchArray = array.map((x) => x);
  let string = searchString;
  //Find leter etter strings
  let result = searchArray.find((searchElement) =>
    searchElement.index?.includes(string)
  );
  console.log(result);
  if (!result) return;
  else {
    mainArray.push(result);
    searchArray.splice(searchArray.indexOf(result), 1, "");
    return arraySearch(mainArray, searchArray, searchString);
  }
};

const appendResults = async (searchResult) => {
  if (!searchResult) {
    const errorMessage = makeElements("h3", {
      className: "resultName descriptionText darkMode",
      innerText: "Nothing Found",
    });
    searchElements.push(errorMessage);
    resultScreen.appendChild(errorMessage);
  } else {
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
  setActiveScreen(mainContainer);
}

/* await getDragonList(baseUrl); */

function displayDragonList(dragonList) {
  mainContainer.innerHTML = "";
  dragonList.forEach(async (dragon) => {
    const dragonDetailData =
      /* await getDragonDetails(dragon.url); */ await fetchApi(
        apiURL + dragon.url
      );
    console.log(dragonDetailData);
    if (dragonDetailData.image) {
      const dragonImg = document.createElement("img");
      dragonImg.src = apiURL + dragonDetailData.image;
    }
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
const monsterLegendaryAction = document.createElement("p");

const displayMonsterInfo = (monsterExample) => {
  cardImage.src = apiURL + monsterExample.image;

  monsterName.textContent = `${monsterExample.name}`;
  cardTextContainer.appendChild(monsterName);

  //size, race and alignment display
  monsterSize.innerHTML = `${monsterExample.size}, ${monsterExample.type}, ${monsterExample.alignment}`;
  cardTextContainer.appendChild(monsterSize);

  //create armor information
  if (!monsterExample.armor_class) return;
  else {
    monsterArmor.innerHTML = `<span>Armor Class</span> ${monsterExample.armor_class[0].value}`;
    cardTextContainer.appendChild(monsterArmor);
  }

  //hit points display
  if (!monsterExample.hit_points) return;
  else {
    monsterHP.innerHTML = `<span>Hit Point</span> ${monsterExample.hit_points} (${monsterExample.hit_points_roll})`;
    cardTextContainer.appendChild(monsterHP);
  }

  //speed value display
  if (!monsterExample.speed.walk) return;
  else {
    monsterSpeed.innerHTML = `<span>Speed</span> ${monsterExample.speed.walk}`;
    cardTextContainer.appendChild(monsterSpeed);
  }

  //Monster stats display
  monsterStats.innerHTML = `<span>STR</span> ${monsterExample.strength} <span>DEX</span> ${monsterExample.dexterity} <span>CON</span> ${monsterExample.constitution} <span>INT</span> ${monsterExample.intelligence} <span>WIS</span> ${monsterExample.wisdom} <span>CHA</span> ${monsterExample.charisma}`;
  cardTextContainer.appendChild(monsterStats);

  //Monster skill display
  if (!monsterExample.proficiencies) return;
  else {
    let monsterSkills = ` `;
    for (let i = 0; i < monsterExample.proficiencies.length; i++) {
      const dupeRemover = monsterExample.proficiencies[i].proficiency.name;
      // .split(":")
      // .pop();
      console.log(dupeRemover);
      monsterSkills += `<span>${dupeRemover}</span> +${monsterExample.proficiencies[i].value}<br>`;
      monsterSkill.innerHTML = `<span>Skills:</span><br> ${monsterSkills}`;
    }

    cardTextContainer.appendChild(monsterSkill);
  }
  // monsterSkill.innerHTML = `<span>Skills</span>`
  // Object.entries(monsterExample.proficiencies).forEach((sense) => {
  //   let [proficienciesName, proficienciesValue] = skills
  // })
  cardTextContainer.appendChild(monsterSkill);
  // Monster sense Display
  // find a way to remove "_" in propertynames
  if (!monsterExample.senses) return;
  else {
    // monsterSense.textContent = "senses: ";

    // Object.entries(monsterExample.senses).forEach((sense) => {
    //   let [senseName, senseValue] = sense;

    //   if (senseName.includes("_")) {
    //     senseName = senseName.split("_").join(" ");
    //   }
    // });
    // monsterSense.textContent += `${senseName}: ${senseValue}`
    monsterSense.innerHTML = `<span>Senses </span> ${Object.getOwnPropertyNames(
      monsterExample.senses
    )}  ${Object.values(monsterExample.senses)}`;
  }
  cardTextContainer.appendChild(monsterSense);

  //Monster Language Display
  if (!monsterExample.languages) return;
  else {
    monsterLanguage.innerHTML = `<span>Languages</span> ${monsterExample.languages}`;
    cardTextContainer.appendChild(monsterLanguage);
  }

  //Monster xp and challenge rating
  if (!monsterExample.xp) return;
  else {
    monsterExp.innerHTML = `<span>Challenge</span> ${monsterExample.challenge_rating} (${monsterExample.xp} XP)`;
    cardTextContainer.appendChild(monsterExp);
  }

  //Monster proficiency bonus display
  if (!monsterExample.proficiency_bonus) return;
  else {
    monsterProficiencyBonus.innerHTML = `<span>Proficiency Bonus</span> +${monsterExample.proficiency_bonus}`;
    cardTextContainer.appendChild(monsterProficiencyBonus);

    //Monster Special ability
    if (!monsterExample.special_abilities) return;
    else {
      for (let i = 0; i < monsterExample.special_abilities.length; i++) {
        monsterSpecialAbility.innerHTML += `<span>${monsterExample.special_abilities[i].name}</span> ${monsterExample.special_abilities[i].desc}<br>`;
        console.log([i]);
        cardTextContainer.appendChild(monsterSpecialAbility);
      }
    }
  }
  // Monster Action
  if (!monsterExample.actions) return;
  else {
    let monsterActions = " ";
    for (let i = 0; i < monsterExample.actions.length; i++) {
      monsterActions += `<span>${monsterExample.actions[i].name}</span> ${monsterExample.actions[i].desc}<br>`;
      monsterAction.innerHTML = `<span>Action</span><br> ${monsterActions}`;
      cardTextContainer.appendChild(monsterAction);
    }
  }

  //Monster descprtion
  if (!monsterExample.desc) return;
  else {
    monsterDescription.innerHTML = `<span>Description</span>: ${monsterExample.desc}`;
    cardTextContainer.appendChild(monsterDescription);
  }

  // if (monsterExample.desc !== "object" || "undefined") {
  //   monsterDescription.innerHTML = `<span>Description</span> ${monsterExample.desc}`;
  //   cardTextContainer.appendChild(monsterDescription);
  // }

  if (!monsterExample.legendary_actions) return;
  else {
    let legendaryAction = "<span>Legendary Action:</span><br> ";
    for (let i = 0; i < monsterExample.legendary_actions.length; i++) {
      monsterLegendaryAction.innerHTML = `${monsterExample.legendary_actions[i].name} ${monsterExample.legendary_actions[i].desc} ${monsterExample.legendary_actions[i].damage}`;
      // monsterLegendaryAction.innerHTML = legendaryAction;
      cardTextContainer.appendChild(monsterLegendaryAction);
      console.log(monsterLegendaryAction);
    }
    console.log(legendaryAction);
  }
  console.log(monsterExample.legendary_actions);
  console.log("test");
};
setActiveScreen(startPage);
headerLogo.addEventListener("click", () => setActiveScreen(startPage));
