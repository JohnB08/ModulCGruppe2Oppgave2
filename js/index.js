/* Importer fra moduler */

import { fetchApi } from "./Modules/fetchApi.js";
import { makeElements } from "./Modules/makeElements.js";
import { navBarMaker } from "./Modules/navBarMaker.js";
import {
  setActiveScreen,
  prevScreen,
  activeScreen,
} from "./Modules/setActiveScreen.js";
import { displaySearchItem } from "./Modules/displayItemInfo.js";
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

window.addEventListener("popstate", (event) => {
  console.log(event);
  if (event.state === "startPage") setActiveScreen(startPage);
  else if (event.target.location.pathname === "/search") {
    searchFunction(event.state.stringKey, event.state);
  } else if (event.target.location.pathname === "/info") {
    displaySearchItem("", event.state);
  } else if (event.target.location.pathname === "monster") {
    displayMonsterInfo(event.state);
    setActiveScreen(infoCard);
  }
});

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
  //Mindre nøyaktig søkefunksjon, går via en annen api. gir flere resultater, men mangler mye.
  const normalizedString = string.toLowerCase();
  //Finner resultatet fra søkemotoren til searchAPI, limiter søket til innhold vår api har.
  const results =
    item ||
    (await fetchApi(
      searchAPIURL + normalizedString + "&document_slug=wotc-srd"
    ));
  results.stringKey = normalizedString;
  //Går gjennom alle resultatene og normaliserer svarene til vår apitype. Noe her kan gjøres bedre. men beste er nok å faktisk skifte API vi bruker på siden.
  results.results.forEach(async (result) => {
    let name = result.name.toLowerCase();
    if (name === "weapons" || name === "armor") name = normalizedString;
    const normalizedName = name.split(" ").join("-");
    let index = result.route.toLowerCase();
    if (index === "magicitems/") index = "magic-items/";
    if (name !== normalizedString) {
      index === "sections/" ? (index = "equipment-categories/") : index;
    } else {
      index = "equipment/";
    }

    const newSearchApi = `${apiURL}/api/${index}${normalizedName}`;
    const searchResult = await fetchApi(newSearchApi);
    //passer på å ignorere de søkene hvor ingenting er funnet.
    if (searchResult === "Nothing Found!") return;
    //Lager nye child elementer til resultScreen basert på søkeresultatene.
    else {
      appendResults(searchResult, normalizedString);
    }
    if (activeScreen !== resultScreen)
      setActiveScreen(resultScreen, "search", results);
  });
};

const appendResults = async (searchResult, string = "") => {
  const resultName = makeElements("button", {
    className: "resultName descriptionText darkMode",
    innerText: searchResult.name,
    value: searchResult.url,
  });
  resultName.addEventListener("click", async () => {
    await setActiveMonster(resultName.value);
    resultName.value.includes("monsters")
      ? (displayMonsterInfo(monsterExample),
        setActiveScreen(infoCard, "monster", monsterExample))
      : displaySearchItem(resultName.value);
  });
  searchElements.push(resultName);
  resultScreen.appendChild(resultName);
  if (searchResult.equipment) {
    searchResult.equipment.forEach(async (equipment) => {
      if (!equipment.index.includes(string)) return;
      else {
        string = equipment.index;
        const newSearch = await fetchApi(`${apiURL}/api/equipment/${string}`);
        await appendResults(newSearch, string);
      }
    });
  }
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

//monsterCard image maker
const cardImage = document.createElement("img");

cardImage.setAttribute("width", "400");
cardImage.setAttribute("height", "300");
cardImgContainer.appendChild(cardImage);

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
history.replaceState("startPage", "", document.location.href);
setActiveScreen(startPage, "startPage", "startPage");
console.log(headerLogo);
headerLogo.addEventListener("click", () =>
  setActiveScreen(startPage, "startPage", "startPage")
);
