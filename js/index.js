const fetchApi = async (url) => {
  const response = await fetch(url, {
    accept: "application/json",
  });
  const result = await response.json();
  return result;
};

/* Dette er apiurlen vi legger alle andre url til inni objektet. */
const apiURL = "https://www.dnd5eapi.co";

const apiIndex = "https://www.dnd5eapi.co/api";

/* const indexExample = await fetchApi(apiIndex); */

const allMonstersUrl = "https://www.dnd5eapi.co/api/monsters";

const allMonstersExample = await fetchApi(allMonstersUrl);

const monsterUrl = "https://www.dnd5eapi.co/api/monsters/acolyte";

const monsterExample = await fetchApi(monsterUrl);

/* console.log(indexExample); */
console.log(allMonstersExample);
console.log(monsterExample);

/*
 *Alle funksjoner skal ta inn ett av eksemplene som parameter.
 *Dette gjøres ved å si først til funksjonen din når du lager den, at du vil ha et parameter
 *kodestruktur: const fetchMonsters = (parameterObject) => {
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
    magicEquipment: object["magic-equipment"],
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

const navBarObject = await fetchNavBarObject();
const headerElement = makeElements("header", { className: "navBar navDark" });
const logoContainer = makeElements("div", { className: "logoContainer" });
const logo = makeElements("img", { src: "./img/logo.svg" });
logoContainer.appendChild(logo);
headerElement.appendChild(logoContainer);
const navBtnContainer = makeElements("div", { className: "navBtnContainer" });
Object.keys(navBarObject).forEach((category) => {
  const btn = makeElements("button", {
    className: "navBarBtn",
    innerText: navBarObject[category].name,
    id: category,
  });
  navBtnContainer.appendChild(btn);
});
headerElement.appendChild(navBtnContainer);
document.body.appendChild(headerElement);
console.log(navBarObject);


/* NAVBAR START */
