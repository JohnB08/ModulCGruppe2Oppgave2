/* Importer fra moduler */

import { fetchApi } from "./fetchApi.js";
import { makeElements } from "./makeElements.js";
import { hamButton } from "./hamburgerSVG.js";

/* fetcher fra HTML */

const infoCard = document.querySelector(".info-card");

const cardImgContainer = document.querySelector(".card-img");

const cardTextContainer = document.querySelector(".monster-stats");

const searchBtn = document.querySelector(".searchBtn");

const searchField = document.querySelector("#searchField");

const startPage = document.querySelector(".startPage");

const resultScreen = document.querySelector(".resultScreen");

/* globale variabler */

let menuOpen = false;
let currentTarget = "";
let activeScreen = startPage;

/**
 * Setter hvilke div som skal vises til en hver tid.
 * @param {*} screenElement hvilket element som skal vises.
 */
const setActiveScreen = (screenElement) => {
  activeScreen.style.display = "none";
  activeScreen = screenElement;
  activeScreen.style.display = "flex";
};

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

/* NAVBAR START*/
/**
 * Lager et nytt object basert på API, strukturert så navBar i topp får fem knapper med hver sin undermeny.
 * er mye mer leslig en det orginale objektet.
 * @param {*} object index til valgt api.
 * @returns
 */
const makeNavBarObject = async (object) => {
  const navBarObject = {};
  //Siden objektet blir omstrukturert til å være mye mer kompakt m.h.t. brukervennlighet og knapper, er dette vanskelig å få til med en funksjon.
  navBarObject.generalRules = {
    subMenu: {
      "Ability Scores": object["ability-scores"],
      Feats: object["feats"],
      Conditions: object["conditions"],
      Features: object["features"],
      "Damage Types": object["damage-types"],
      Proficiencies: object["proficiencies"],
      Traits: object["traits"],
      "Magic Schools": object["magic-schools"],
      Backgrounds: object["backgrounds"],
      Alignments: object["alignments"],
      Rules: object["rules"],
    },
    name: "General Rules",
  };
  navBarObject.classes = {
    name: "Classes",
    allClasses: object["classes"],
    subMenu: {},
  };
  //Fetcher alle classnames og legger de inn i subMenu objektet. Disse skal brukes senere for å displaye dropdown menu i objektet.
  let fetchClasses = await fetchApi(`${apiURL}${object["classes"]}`);
  for (let classID of fetchClasses.results) {
    navBarObject.classes.subMenu[classID.index] = classID;
  }
  navBarObject.races = {
    name: "Races",
    allRaces: object["races"],
    subMenu: {},
  };
  //Gjør det samme her som med classes
  let fetchRaces = await fetchApi(`${apiURL}${object["races"]}`);
  for (let race of fetchRaces.results) {
    navBarObject.races.subMenu[race.index] = race;
  }
  navBarObject.equipment = {
    name: "Equipment",
    subMenu: {
      Categories: object["equipment-categories"],
      "Normal Equipment": object["equipment"],
      "Magic Items": object["magic-items"],
    },
  };
  navBarObject.monsters = {
    name: "Monsters",
    allMonsters: object["monsters"],
  };
  return navBarObject;
};

/**
 * ser om navbar allerede er lagret i localStorage, så siden slipper å gjøre en ny API call.
 * Siden navbar er ganske statisk føler jeg dette er en god måte å gjøre det på. det gjør at
 * etter første siteload blir navbaren en mindre belastning på api.
 * @returns
 */
const fetchNavBarObject = async () => {
  let navBarObject = JSON.parse(localStorage.getItem("dndNavBarObject")) || 0;
  if (navBarObject === 0) {
    const index = await fetchApi(apiIndex);
    navBarObject = await makeNavBarObject(index);
    localStorage.setItem("dndNavBarObject", JSON.stringify(navBarObject));
  }
  return navBarObject;
};

/**
 * Funksjon som displayer menyen om man er på desktop
 * @param {*} navBarObject
 * @returns
 */
const desktopButtonDisplay = (navBarObject) => {
  const navBtnContainer = makeElements("div", {
    className: "navBtnContainer",
  });
  Object.keys(navBarObject).forEach((category) => {
    const btn = makeElements("div", {
      className: "btnTextOnly btnText navBarBtn",
      innerText: navBarObject[category].name,
      id: category,
    });
    btn.addEventListener("mouseover", (event) =>
      subMenuGenerator(event, category, navBarObject)
    );
    navBtnContainer.appendChild(btn);
  });

  navBtnContainer.addEventListener("mouseover", (event) => {
    if (!subMenuOpen) return;
    else if (event.target === navBtnContainer) subMenuRemover();
  });
  return navBtnContainer;
};

/**
 * Funksjon som lager knappene for mobilbruk.
 * @param {*} navBarObject
 * @param {*} headerElement
 * @returns
 */
const mobileButtonDisplay = (navBarObject, headerElement) => {
  headerElement.appendChild(hamButton);
  const hamMenu = makeElements("div", { className: "hamMenu" });
  Object.keys(navBarObject).forEach((category) => {
    const btn = makeElements("div", {
      className: "hamMenuBtn",
      innerText: navBarObject[category].name,
      id: category,
    });
    btn.addEventListener("click", (event) =>
      mobileSubMenuGenerator(event, category, navBarObject)
    );
    hamMenu.appendChild(btn);
  });
  hamButton.addEventListener("click", () => {
    const armArray = document.querySelectorAll(".arm");
    if (menuOpen) {
      hamMenu.style.display = "none";
      menuOpen = false;
      for (let i = 0; i < armArray.length; i++) {
        armArray[i].classList.remove(`armAnim${i + 1}`);
      }
    } else {
      hamMenu.style.display = "flex";
      menuOpen = true;
      for (let i = 0; i < armArray.length; i++) {
        armArray[i].classList.add(`armAnim${i + 1}`);
      }
    }
  });
  return hamMenu;
};

/* DROPDOWN MENU DESKTOP! */
let subMenuOpen = false;
let menuElements = [];
let btnId = 0;

/**
 * Funskjon som lager dropdown menyen for desktop.
 * @param {*} event
 * @param {*} category
 * @param {*} navBarObject
 * @returns
 */
const subMenuGenerator = (event, category, navBarObject) => {
  const selectedBtn = event.target;
  if (subMenuOpen) {
    return;
  } else if (!navBarObject[category].subMenu) {
    return;
  } else {
    btnId = 0;
    const subMenu = makeElements("div", {
      className: "subMenu navDark sideBorders",
    });
    Object.keys(navBarObject[category].subMenu).forEach((subCat) => {
      const btn = makeElements("button", {
        className: "btnTextOnly btnTextNoBold subMenuBtn",
        innerText: subCat,
        id: subCat,
      });
      btnId++;
      btn.style.animationDelay = `${btnId * 25}ms`;
      subMenu.appendChild(btn);
      menuElements.push(subMenu);
      subMenu.addEventListener("mouseleave", () => subMenuRemover());
    });
    selectedBtn.appendChild(subMenu);
    subMenuOpen = true;
  }
};

/**
 * Funksjon som fjerner knappene igjen for desktop
 * @returns
 */
const subMenuRemover = () => {
  if (!subMenuOpen) return;
  else {
    menuElements.forEach((element) => element.remove());
    menuElements = [];
    subMenuOpen = false;
  }
};

/**
 * Funksjon som lager submeny for mobilmenyen.
 * @param {*} event
 * @param {*} category
 * @param {*} navBarObject
 */
const mobileSubMenuGenerator = (event, category, navBarObject) => {
  const selectedBtn = event.target;
  if (subMenuOpen) {
    menuElements.forEach((element) => element.remove());
    menuElements = [];
    subMenuOpen = false;
    if (selectedBtn != currentTarget) {
      currentTarget = selectedBtn;
      mobileSubMenuGenerator(event, category, navBarObject);
    }
  } else {
    currentTarget = selectedBtn;
    btnId = 0;
    const subMenu = makeElements("div", {
      className: "mobileSubMenu navDark",
    });
    Object.keys(navBarObject[category].subMenu).forEach((subCat) => {
      const btn = makeElements("button", {
        className: "btnTextOnly btnTextNoBold subMenuBtn",
        innerText: subCat,
        id: subCat,
      });
      btnId++;
      btn.style.animationDelay = `${btnId * 25}ms`;
      subMenu.appendChild(btn);
      menuElements.push(subMenu);
    });
    selectedBtn.appendChild(subMenu);
    subMenuOpen = true;
  }
};

/**
 * Funksjon som skjekker om vi er på en mobil eller ikke, kjører enten mobiledisplay eller desktopdisplay
 * @param {*} navBarObject
 * @param {*} headerElement
 * @returns
 */
const mobileCheck = (navBarObject, headerElement) => {
  if (window.navigator.userAgentData.mobile || window.innerWidth < 600)
    return mobileButtonDisplay(navBarObject, headerElement);
  else return desktopButtonDisplay(navBarObject);
};

/**
 * Funksjon som lager headerElementet som inneholder navBar
 */
const navBarMaker = async () => {
  const navBarObject = await fetchNavBarObject();
  const headerElement = makeElements("header", { className: "navBar navDark" });
  const logoContainer = makeElements("div", { className: "logoContainer" });
  const logo = makeElements("img", { src: "./img/logo.svg" });
  logoContainer.appendChild(logo);
  headerElement.appendChild(logoContainer);
  const navBtnContainer = mobileCheck(navBarObject, headerElement);
  headerElement.appendChild(navBtnContainer);
  document.body.prepend(headerElement);
};

await navBarMaker();

/* Søkefunksjoner */

/**
 * Bruker en annen api, og normaliserer til vår api for å lage en søkefunksjon. Vår valgte API mangler enkel søkefunksjon.
 * @param {*} string input
 * @returns
 */
const searchFunction = async (string) => {
  //Fjerner alle gamle "children" fra resultScreen
  for (let child of resultScreen.children) {
    child.remove();
  }
  setActiveScreen(resultScreen);
  //Mindre nøyaktig søkefunksjon, går via en annen api. gir flere resultater, men mangler mye.
  const normalizedString = string.toLowerCase();
  //Finner resultatet fra søkemotoren til searchAPI, limiter søket til innhold vår api har.
  const results = await fetchApi(
    searchAPIURL + normalizedString + "&document_slug=wotc-srd"
  );
  //Går gjennom alle resultatene og normaliserer svarene til vår apitype. Noe her kan gjøres bedre. men beste er nok å faktisk skifte API vi bruker på siden.
  results.results.forEach(async (result) => {
    let name = result.name.toLowerCase();
    if (name === "weapons" || name === "armor") name = normalizedString;
    const normalizedName = name.split(" ").join("-");
    let index = result.route.toLowerCase();
    if (index === "magicitems/") index = "magic-items/";
    if (index === "sections/") index = "equipment/";
    const newSearchApi = `${apiURL}/api/${index}${normalizedName}`;
    const searchResult = await fetchApi(newSearchApi);
    //passer på å ignorere de søkene hvor ingenting er funnet.
    if (searchResult === "Nothing Found!") return;
    //Lager nye child elementer til resultScreen basert på søkeresultatene.
    else {
      const resultName = makeElements("button", {
        className: "resultName descriptionText darkMode",
        innerText: searchResult.name,
        value: searchResult.url,
      });
      resultName.addEventListener("click", async () => {
        await setActiveMonster(resultName.value);
        displayMonsterInfo(monsterExample);
        setActiveScreen(infoCard);
        history.pushState({ page_id: "displayMonster" }, "");
      });
      resultScreen.appendChild(resultName);
      if (!searchResult.desc) return;
      else {
        if (typeof searchResult.desc === "object") {
          for (let desc of searchResult.desc) {
            const resultDesc = makeElements("p", {
              className: "resultDesc buttonText darkMode",
              innerText: desc,
            });
            resultScreen.appendChild(resultDesc);
          }
        } else {
          const resultDesc = makeElements("p", {
            className: "resultDesc buttonText darkMode",
            innerText: searchResult.desc,
          });
          resultScreen.appendChild(resultDesc);
        }
        history.pushState({ page_id: "search" }, "");
      }
    }
  });
  //Mer direkte søkefunksjon, men søket må være svært nøyaktig. dårlig brukeropplevelse.
  /* 
  const normalizedString = string.toLowerCase().split(" ").join("-");
  Object.keys(indexExample).forEach(async (category) => {
    const result = await fetchApi(
      `${apiURL}/api/${category}/${normalizedString}`
    );
    if (result === "Nothing Found!") return;
    else allResults.push(result);
  }); */
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

setActiveScreen(startPage);
