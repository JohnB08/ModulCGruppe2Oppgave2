const fetchApi = async (url) => {
  const response = await fetch(url, {
    //dette objektet er med fordi API må vite at vi vil ha en json fil tilbake
    accept: "application/json",
  });
  if (!response.ok) {
    return "Nothing Found!";
  } else {
    const result = await response.json();
    return result;
  }
};

/* Dette er apiurlen vi legger alle andre url til inni objektet. */
const apiURL = "https://www.dnd5eapi.co";

const apiIndex = "https://www.dnd5eapi.co/api";

const indexExample = await fetchApi(apiIndex);

const allMonstersUrl = "https://www.dnd5eapi.co/api/monsters";

const allMonstersExample = await fetchApi(allMonstersUrl);

const monsterUrl = "https://www.dnd5eapi.co/api/monsters/acolyte";

let monsterExample = await fetchApi(monsterUrl);

const infoCard = document.querySelector(".info-card");

const cardImgContainer = document.querySelector(".card-img");

const cardTextContainer = document.querySelector(".monster-stats");

const searchBtn = document.querySelector(".searchBtn");
const searchField = document.querySelector("#searchField");
const startPage = document.querySelector(".startPage");
const resultScreen = document.querySelector(".resultScreen");

const searchAPIURL = "https://api.open5e.com/search/?text=";

console.log(indexExample);
console.log(allMonstersExample);
console.log(monsterExample);

let activeScreen = startPage;

/*
 *Alle funksjoner skal ta inn ett av eksemplene som parameter.
 *Dette gjøres ved å si først til funksjonen din når du lager den, at du vil ha et parameter
 *kodestruktur:
 *const fetchMonsters = (parameterObject) => {
 *Så bruker du parameteret inni funksjonen
 *   console.log(parameterObject)
 *
 * }
 *
 * Når du caller på (kjører) funksjonen senere, så legger du eksempelobjektet inn i funksjonen.
 *
 * fetchMonsters(monsterExample)
 *
 *Da vil funksjonen erstatte parameterObject med monsterExample i koden du har, og kjøre koden din med monsterExample.
 *
 * I eksempelet over ender du opp med at monsterExample blir consol logget.
 *
 *
 */

/**
 * Funksjon som lager html element
 * @param {*} type hvilken type element du vil ha, string. f.eks "div"
 * @param {*} parameters hvilke parametere du vil gi elementet, f.eks {classname: "container"}
 */
const makeElements = (type, parameters) => {
  const element = document.createElement(type);
  Object.entries(parameters).forEach((entry) => {
    let [propertyKey, propertyValue] = entry;
    element[propertyKey] = propertyValue;
  });
  return element;
};

/**
 * Setter hvilke div som skal vises til en hver tid.
 * @param {*} screenElement hvilket element som skal vises.
 */
const setActiveScreen = (screenElement) => {
  activeScreen.style.display = "none";
  activeScreen = screenElement;
  activeScreen.style.display = "flex";
};

/* For å lage en brukervennlig navbar må index fra API struktureres litt annerledes. */

/* NAVBAR START*/
/**
 * Lager et nytt object basert på API, strukturert så navBar i topp får fem knapper med hver sin undermeny.
 * er mye mer leslig en det orginale objektet.
 * @param {*} object tar inn indexen til API
 * @returns ferdig strukturert object.
 */

const makeNavBarObject = async (object) => {
  const navBarObject = {};
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
  let fetchClasses = await fetchApi(`${apiURL}${object["classes"]}`);
  for (let classID of fetchClasses.results) {
    navBarObject.classes.subMenu[classID.index] = classID;
  }
  navBarObject.races = {
    name: "Races",
    allRaces: object["races"],
    subMenu: {},
  };
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
const setActiveMonster = async (monsterURL) => {
  monsterExample = await fetchApi(apiURL + monsterURL);
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
let menuOpen = false;
let currentTarget = "";
let allResults = [];

/**
 * Bruker en annen api, og normaliserer til vår api for å lage en søkefunksjon. Vår valgte API mangler enkel søkefunksjon.
 * @param {*} string input
 * @returns
 */
const searchFunction = async (string) => {
  for (let child of resultScreen.children) {
    child.remove();
  }
  setActiveScreen(resultScreen);
  //Mindre nøyaktig søkefunksjon, går via en annen api. gir flere resultater, men mangler mye.
  const normalizedString = string.toLowerCase();
  const results = await fetchApi(
    searchAPIURL + normalizedString + "&document_slug=wotc-srd"
  );
  results.results.forEach(async (result) => {
    let name = result.name.toLowerCase();
    if (name === "weapons" || name === "armor") name = normalizedString;
    const normalizedName = name.split(" ").join("-");
    let index = result.route.toLowerCase();
    if (index === "magicitems/") index = "magic-items/";
    if (index === "sections/") index = "equipment/";
    const newSearchApi = `${apiURL}/api/${index}${normalizedName}`;
    const searchResult = await fetchApi(newSearchApi);
    if (searchResult === "Nothing Found!") return;
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
        if (searchResult.desc === []) {
          for (let desc of searchResult.desc) {
            const resultDesc = makeElements("p", {
              className: "resultName buttonText darkMode",
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
  /* 
  //Mer direkte søkefunksjon, men søket må være svært nøyaktig.
  const normalizedString = string.toLowerCase().split(" ").join("-");
  Object.keys(indexExample).forEach(async (category) => {
    const result = await fetchApi(
      `${apiURL}/api/${category}/${normalizedString}`
    );
    if (result === "Nothing Found!") return;
    else allResults.push(result);
  }); */
};

searchBtn.addEventListener(
  "click",
  async () => await searchFunction(searchField.value)
);

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

const mobileButtonDisplay = (navBarObject, headerElement) => {
  const hamButton = makeElements("div", { className: "hamBtn" });
  const hamSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const svgAttributes = {
    width: "3em",
    height: "3em",
    viewBox: "0 0 48 48",
  };
  Object.entries(svgAttributes).forEach((attribute) => {
    let [attributeName, attributeValue] = attribute;
    hamSVG.setAttribute(attributeName, attributeValue);
  });
  const hamPath1 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  hamPath1.setAttribute("d", "M7.94971 11.9497H39.9497");
  const hamPath2 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  hamPath2.setAttribute("d", "M7.94971 23.9497H39.9497");
  const hamPath3 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  hamPath3.setAttribute("d", "M7.94971 35.9497H39.9497");

  const pathAttributes = {
    fill: "none",
    stroke: "#2f3437",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "4",
    class: "arm",
  };

  let armArray = [hamPath1, hamPath2, hamPath3];
  armArray.forEach((arm) => {
    Object.entries(pathAttributes).forEach((attribute) => {
      let [attributeName, attributeValue] = attribute;
      arm.setAttribute(attributeName, attributeValue);
    });
    hamSVG.appendChild(arm);
  });
  hamButton.appendChild(hamSVG);
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
const subMenuRemover = () => {
  if (!subMenuOpen) return;
  else {
    menuElements.forEach((element) => element.remove());
    menuElements = [];
    subMenuOpen = false;
  }
};

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

const mobileCheck = (navBarObject, headerElement) => {
  if (window.navigator.userAgentData.mobile || window.innerWidth < 600)
    return mobileButtonDisplay(navBarObject, headerElement);
  else return desktopButtonDisplay(navBarObject);
};

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
  monsterSense.textContent = `Senses ${Object.getOwnPropertyNames(
    monsterExample.senses
  )} ${Object.values(monsterExample.senses)}`;
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
