import { fetchApi } from "./fetchApi.mjs";
import { makeElements } from "./makeElements.mjs";
import { hamButton } from "./hamburgerSVG.js";
import { displaySearchItem } from "./displayItemInfo.mjs";

let menuOpen = false;
let currentTarget = "";
let subMenuOpen = false;
let menuElements = [];
let btnId = 0;

const apiURL = "https://www.dnd5eapi.co";

const apiIndex = "https://www.dnd5eapi.co/api";

const indexExample = await fetchApi(apiIndex);

const allMonstersUrl = "https://www.dnd5eapi.co/api/monsters";

const allMonstersExample = await fetchApi(allMonstersUrl);

const monsterUrl = "https://www.dnd5eapi.co/api/monsters/acolyte";

let monsterExample = await fetchApi(monsterUrl);

const searchAPIURL = "https://api.open5e.com/search/?text=";

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
    if (btn.innerText === "Monsters") {
      //sett inn funksjon fra dragonList her
    }
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
    let activeCategory = navBarObject[category].subMenu;
    Object.keys(activeCategory).forEach((subCat) => {
      const btn = makeElements("button", {
        className: "btnTextOnly btnTextNoBold subMenuBtn",
        innerText: subCat,
        id: subCat,
        value: activeCategory[subCat].url,
      });
      btn.addEventListener("click", (event) => {
        displaySearchItem(event.target.value);
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
    let activeCategory = navBarObject[category].subMenu;
    Object.keys(activeCategory).forEach((subCat) => {
      const btn = makeElements("button", {
        className: "btnTextOnly btnTextNoBold subMenuBtn",
        innerText: subCat,
        id: subCat,
        value: activeCategory[subCat].url,
      });
      btn.addEventListener("click", (event) => {
        displaySearchItem(event.target.value);
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
  const logo = makeElements("img", {
    src: "./img/logo.svg",
    className: "headerLogo",
  });
  logoContainer.appendChild(logo);
  headerElement.appendChild(logoContainer);
  const navBtnContainer = mobileCheck(navBarObject, headerElement);
  headerElement.appendChild(navBtnContainer);
  document.body.prepend(headerElement);
};

export { navBarMaker };
