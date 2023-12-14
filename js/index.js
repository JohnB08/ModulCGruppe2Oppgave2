const fetchApi = async (url) => {
  const response = await fetch(url, {
    //dette objektet er med fordi API må vite at vi vil ha en json fil tilbake
    accept: "application/json",
  });
  const result = await response.json();
  return result;
};

/* Dette er apiurlen vi legger alle andre url til inni objektet. */
const apiURL = "https://www.dnd5eapi.co";

const apiIndex = "https://www.dnd5eapi.co/api";

const indexExample = await fetchApi(apiIndex);

const allMonstersUrl = "https://www.dnd5eapi.co/api/monsters";

const allMonstersExample = await fetchApi(allMonstersUrl);

const monsterUrl = "https://www.dnd5eapi.co/api/monsters/acolyte";

const monsterExample = await fetchApi(monsterUrl);

const cardImgContainer = document.querySelector(".card-img");

const cardTextContainer = document.querySelector(".monster-stats");

console.log(indexExample);
console.log(allMonstersExample);
console.log(monsterExample);

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
/* For å lage en brukervennlig navbar må index fra API struktureres litt annerledes. */

/* NAVBAR START*/
console.log(window.navigator);
/**
 * Lager et nytt object basert på API, strukturert så navBar i topp får fem knapper med hver sin undermeny.
 * er mye mer leslig en det orginale objektet.
 * @param {*} object tar inn indexen til API
 * @returns ferdig strukturert object.
 */
const makeNavBarObject = async (object) => {
  const navBarObject = {};
  navBarObject.generalRules = {
    abilityScores: object["ability-scores"],
    feats: object["feats"],
    conditions: object["conditions"],
    features: object["features"],
    damageTypes: object["damage-types"],
    proficiencies: object["proficiencies"],
    traits: object["traits"],
    magicSchools: object["magic-schools"],
    backgrounds: object["backgrounds"],
    alignments: object["alignments"],
    rules: object["rules"],
    name: "General Rules",
  };
  navBarObject.classes = {
    name: "Classes",
    allClasses: object["classes"],
  };
  let fetchClasses = await fetchApi(`${apiURL}${object["classes"]}`);
  console.log(fetchClasses.results);
  for (let classID of fetchClasses.results) {
    navBarObject.classes[classID.index] = classID;
  }
  navBarObject.races = {
    name: "Races",
    allRaces: object["races"],
  };
  let fetchRaces = await fetchApi(`${apiURL}${object["races"]}`);
  for (let race of fetchRaces.results) {
    navBarObject.races[race.index] = race;
  }
  navBarObject.equipment = {
    name: "Equipment",
    categories: object["equipment-categories"],
    normalEquipment: object["equipment"],
    magicItems: object["magic-items"],
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
let menuOpen = false;
const desktopNavBar = async () => {
  const navBarObject = await fetchNavBarObject();
  const headerElement = makeElements("header", { className: "navBar navDark" });
  const logoContainer = makeElements("div", { className: "logoContainer" });
  const logo = makeElements("img", { src: "./img/logo.svg" });
  logoContainer.appendChild(logo);
  headerElement.appendChild(logoContainer);
  const navBtnContainer = makeElements("div", { className: "navBtnContainer" });
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

  headerElement.appendChild(navBtnContainer);
  document.body.prepend(headerElement);
  console.log(navBarObject);
  navBtnContainer.addEventListener("mouseover", (event) => {
    if (!subMenuOpen) return;
    else if (event.target === navBtnContainer) subMenuRemover();
  });
};

await desktopNavBar();

/* DROPDOWN MENU DESKTOP! */
let subMenuOpen = false;
let menuElements = [];
let btnId = 0;
const subMenuGenerator = (event, category, navBarObject) => {
  const selectedBtn = event.target;
  if (subMenuOpen) {
    return;
  } else {
    btnId = 0;
    const subMenu = makeElements("div", {
      className: "subMenu navDark sideBorders",
    });
    Object.keys(navBarObject[category]).forEach((subCat) => {
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
  if (!subMenuOpen) {
    menuElements.forEach((element) => element.remove());
    menuElements = [];
    subMenuOpen = false;
  } else {
    btnId = 0;
    const subMenu = makeElements("div", {
      className: "mobileSubMenu navDark",
    });
    Object.keys(navBarObject[category]).forEach((subCat) => {
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

/* NAVBAR END */
//monsterCard image maker
const cardImage = document.createElement("img");
cardImage.src = apiURL + monsterExample.image;
cardImage.setAttribute("width", "400");
cardImage.setAttribute("height", "300");
cardImgContainer.appendChild(cardImage);

//monsterCard text content maker
const monsterName = document.createElement("h1")
const monsterSize = document.createElement("p")
const monsterArmor = document.createElement("p")
const monsterHP = document.createElement("p")
const monsterSpeed = document.createElement("p")
const monsterStats = document.createElement("p")
const monsterSkill = document.createElement("p")
const monsterSense = document.createElement("p")
const monsterLanguage = document.createElement("p")
const monsterExp = document.createElement("p")
const monsterProficiencyBonus = document.createElement("p")
const monsterSpecialAbility = document.createElement("p")
const monsterAction = document.createElement("p")
const monsterDescription = document.createElement("p")
monsterName.textContent = `${monsterExample.name}`
cardTextContainer.appendChild(monsterName)

//size, race and alignment display
monsterSize.textContent = `${monsterExample.size}, ${monsterExample.type}, ${monsterExample.alignment}`
cardTextContainer.appendChild(monsterSize)

//create armor information
monsterArmor.textContent = `Armor Class ${monsterExample.armor_class[0].value}`
cardTextContainer.appendChild(monsterArmor)

//hit points display
monsterHP.textContent = `Hit Point ${monsterExample.hit_points} (${monsterExample.hit_points_roll})`
cardTextContainer.appendChild(monsterHP)

//speed value display
monsterSpeed.textContent = `Speed ${monsterExample.speed.walk}`
cardTextContainer.appendChild(monsterSpeed)

//Monster stats display
monsterStats.textContent = `STR ${monsterExample.strength} DEX ${monsterExample.dexterity} CON ${monsterExample.constitution} INT ${monsterExample.intelligence} WIS ${monsterExample.wisdom} CHA ${monsterExample.charisma}`
cardTextContainer.appendChild(monsterStats)

//Monster skill display
//fix a better method which makes it able to register monster with more than 2 skills
monsterSkill.textContent = `Skills ${monsterExample.proficiencies[0].proficiency.name.slice(6)} +${monsterExample.proficiencies[0].value}, ${monsterExample.proficiencies[1].proficiency.name.slice(6)} +${monsterExample.proficiencies[1].value}`
cardTextContainer.appendChild(monsterSkill)

//Monster sense Display
// find a way to remove "_" in propertynames
monsterSense.textContent = `Senses ${Object.getOwnPropertyNames(monsterExample.senses)} ${Object.values(monsterExample.senses)}`;
cardTextContainer.appendChild(monsterSense)

//Monster Language Display
monsterLanguage.textContent = `Languages ${monsterExample.languages}`
cardTextContainer.appendChild(monsterLanguage)

//Monster xp and challenge rating
monsterExp.textContent = `Challenge ${monsterExample.challenge_rating} (${monsterExample.xp} XP)`
cardTextContainer.appendChild(monsterExp)

//Monster proficiency bonus display
monsterProficiencyBonus.textContent = `Proficiency Bonus +${monsterExample.proficiency_bonus}`
cardTextContainer.appendChild(monsterProficiencyBonus)

//Monster Special ability
monsterSpecialAbility.textContent = `${monsterExample.special_abilities[0].name} ${monsterExample.special_abilities[0].desc}`
cardTextContainer.appendChild(monsterSpecialAbility)

//Monster Action
monsterAction.textContent = `Action ${monsterExample.actions[0].name} ${monsterExample.actions[0].desc}`
cardTextContainer.appendChild(monsterAction)

//Monster descprtion
monsterDescription.textContent = `Description ${monsterExample.desc}`
cardTextContainer.appendChild(monsterDescription)